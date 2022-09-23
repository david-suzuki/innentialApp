import {
  Review,
  ReviewTemplate,
  ReviewResults,
  Team,
  User,
  UserProfile,
  Goal
} from '~/models'
import { isUser } from '~/directives'
import { sentryCaptureException } from '~/utils'

export const queryTypes = `
  type Query {
    fetchUserReviews: [Review] @${isUser}
    fetchOrganizationReviews: [Review] @${isUser}
    fetchOrganizationReviewSchedules: [ReviewSchedule] @${isUser}
    fetchLeadersReviewSchedules: [ReviewSchedule] @${isUser}
    fetchReviewScheduleEditInfo(templateId: ID!): ReviewScheduleEditInfo @${isUser}
    fetchReviewStartInfo(reviewId: ID!): ReviewStartInfo @${isUser}
    fetchReviewResultInfo(reviewId: ID!): ReviewResult @${isUser}
    fetchUpcomingOrActiveReviewEventInfo(
      reviewId: ID, 
      templateId: ID
    ): ReviewScopeInfo @${isUser}
  }
`

const userPromise = (
  userIds,
  nextReview,
  reviewId,
  scheduledEvents = [],
  oneTimeReview
) => {
  return Promise.all(
    userIds.map(async userId => {
      const user = await User.findById(userId)
      const userProfile = await UserProfile.findOne({ user: userId })
      if (!user) {
        sentryCaptureException(`User:${userId} not found`)
        return null
      }
      let numberOfGoals = await Goal.countDocuments({
        reviewId,
        user: userId,
        status: 'ACTIVE'
      })

      let hasEventScheduled = null
      const usersEvent = scheduledEvents.find(
        ({ userId: scheduledId }) => String(scheduledId) === String(userId)
      )
      if (usersEvent) hasEventScheduled = usersEvent.scheduledDate

      let goalsSet
      if (nextReview) {
        const { _id: nextReviewId } = nextReview
        const newGoals = await Goal.find({
          reviewId: nextReviewId,
          user: userId,
          status: 'ACTIVE'
        })
        if (newGoals && newGoals.length > 0) {
          numberOfGoals += newGoals.length
          goalsSet = newGoals[0].createdAt
        }
      } else if (oneTimeReview) {
        const goal = await Goal.findOne({ reviewId, user: userId })
          .select({ reviewedAt: 1 })
          .lean()
        goalsSet = goal.reviewedAt
      }

      if (user.status !== 'active' || !userProfile) {
        return {
          _id: user._id,
          userName: user.email,
          email: user.email,
          active: false,
          roleAtWork: '',
          location: '',
          numberOfGoals,
          goalsSet,
          hasEventScheduled
        }
      }

      const { firstName, lastName, location, email } = user
      const userName = `${firstName}${lastName ? ' ' + lastName : ''}`
      const { roleAtWork } = userProfile

      return {
        _id: user._id,
        userName,
        email,
        active: true,
        roleAtWork,
        location,
        numberOfGoals,
        goalsSet,
        hasEventScheduled
      }
    })
  )
}

export const queryResolvers = {
  Query: {
    fetchUserReviews: async (_, args, { user: { _id } }) => {
      const userReviews = await Review.find({ 'reviewScope.reviewers': _id })
      return userReviews
    },
    fetchOrganizationReviews: async (_, args, { user: { organizationId } }) => {
      const allReviews = await Review.find({ organizationId })
      return allReviews
    },
    fetchOrganizationReviewSchedules: async (
      _,
      args,
      { user: { organizationId } }
    ) => {
      const allReviewsSchedules = await ReviewTemplate.find({
        organizationId
      }).sort({ createdAt: -1 })
      return allReviewsSchedules
    },
    fetchLeadersReviewSchedules: async (
      _,
      args,
      { user: { _id, organizationId } }
    ) => {
      const allReviewsSchedules = await ReviewTemplate.find({
        organizationId,
        createdBy: _id
      }).sort({ createdAt: -1 })
      return allReviewsSchedules
    },
    fetchReviewScheduleEditInfo: async (_, { templateId }) => {
      const template = await ReviewTemplate.findById(templateId)
      return template
    },
    fetchReviewStartInfo: async (
      _,
      { reviewId },
      { user: { _id, organizationId, roles } }
    ) => {
      const review = await Review.findById(reviewId).lean()
      if (!review) {
        sentryCaptureException(`Review:${reviewId} not found!`)
        return null
      }
      if (review.status !== 'OPEN') {
        sentryCaptureException(`Review:${reviewId} is not open yet!`)
        return null
      }
      if (String(review.organizationId) !== String(organizationId)) {
        sentryCaptureException(
          `Access violation: User:${_id} shouldn't have access to ${reviewId}`
        )
        return null
      }
      const {
        name,
        reviewScope,
        templateId,
        scopeType,
        hasScheduledEvent: scheduledEvents
      } = review

      const reviewTemplate = await ReviewTemplate.findById(templateId)
        .select({ oneTimeReview: 1 })
        .lean()
      const oneTimeReview = !reviewTemplate || reviewTemplate.oneTimeReview

      const nextReview = await Review.findOne({
        templateId,
        status: 'UPCOMING'
      })
        .select({ _id: 1 })
        .lean()

      if (scopeType === 'PERSONAL') {
        let userIds = []

        if (roles.indexOf('ADMIN') !== -1) {
          userIds = reviewScope.map(({ userId }) => userId)
        } else {
          userIds = reviewScope
            .filter(({ reviewers }) =>
              reviewers.some(userId => String(userId) === String(_id))
            )
            .map(({ userId }) => userId)

          if (userIds.length === 0) {
            sentryCaptureException(
              `User:${_id} has no teams to review in ${reviewId}`
            )
            return null
          }
        }

        const userInfo = await userPromise(
          userIds,
          nextReview,
          reviewId,
          scheduledEvents,
          oneTimeReview
        )
        const users = userInfo.reduce((acc, curr) => {
          if (curr !== null) {
            return [...acc, curr]
          } else return acc
        }, [])

        return {
          _id: review._id,
          name,
          teams: [
            {
              _id: review._id,
              teamName: 'Users to review',
              users,
              isReviewer: true
            }
          ],
          type: 'PERSONAL'
        }
      } else {
        let teamIds = []

        if (roles.indexOf('ADMIN') !== -1) {
          teamIds = reviewScope.map(({ teamId }) => teamId)
        } else {
          teamIds = reviewScope
            .filter(({ reviewers }) =>
              reviewers.some(userId => String(userId) === String(_id))
            )
            .map(({ teamId }) => teamId)

          if (teamIds.length === 0) {
            sentryCaptureException(
              `User:${_id} has no teams to review in ${reviewId}`
            )
            return null
          }
        }

        const allTeams = await Team.find({
          _id: { $in: teamIds },
          active: true
        }).lean()

        const teams = await Promise.all(
          allTeams.map(async team => {
            const teamScope = reviewScope.find(
              ({ teamId }) => String(teamId) === String(team._id)
            )
            const isReviewer =
              teamScope &&
              teamScope.reviewers.some(
                reviewer => String(reviewer) === String(_id)
              )

            const { teamName, leader, members } = team
            const userIds = [leader, ...members]

            const userInfo = await userPromise(
              userIds,
              nextReview,
              reviewId,
              scheduledEvents,
              oneTimeReview
            )
            const users = userInfo.reduce((acc, curr) => {
              if (curr !== null) {
                return [...acc, curr]
              } else return acc
            }, [])

            return {
              _id: team._id,
              teamName,
              users,
              isReviewer
            }
          })
        )

        return {
          _id: review._id,
          name,
          teams,
          type: 'TEAM'
        }
      }
    },
    fetchReviewResultInfo: async (_, { reviewId }) => {
      const reviewResult = await ReviewResults.findOne({ reviewId }).lean()
      return reviewResult
    },
    fetchUpcomingOrActiveReviewEventInfo: async (
      _,
      { templateId, reviewId },
      { user: { _id, roles } }
    ) => {
      // this function can be used with templateId or ReviewId
      // makes it simpler to access the most relevant review
      // though reviewId would probably end up overriding the smart stuff
      let closestReview
      try {
        if (templateId) {
          const template = await ReviewTemplate.findById(templateId)
          if (template) {
            closestReview = await Review.findOne({
              templateId,
              status: 'OPEN'
            }).lean()

            if (!closestReview)
              closestReview = await Review.findOne({
                templateId,
                status: 'UPCOMING'
              }).lean()

            if (!closestReview)
              throw new Error(
                `No open or upcoming reviews found for template: ${templateId}`
              )
          } else {
            throw new Error(`Template not found template: ${templateId}`)
          }
        } // endif template stuff
        else if (reviewId) {
          closestReview = await Review.findOne({
            _id: reviewId
          }).lean()

          if (!closestReview)
            throw new Error(
              `No open or upcoming reviews found for reviewID: ${reviewId}`
            )
        } // endif review stuff
        else return null

        // determine reviewers
        // determine who they can review
        const {
          name,
          reviewScope,
          // templateId: closestReviewTemplateId,
          scopeType,
          hasScheduledEvent: scheduledEvents
        } = closestReview

        let nextReview
        if (closestReview.status === 'OPEN') {
          nextReview = await Review.findOne({
            templateId,
            status: 'UPCOMING'
          })

          // if (!nextReview)
          //   throw new Error(`review is open, but no upcoming reviews are set ${closestReview._id}`)
        }

        let reviewStartInfo
        if (scopeType === 'PERSONAL') {
          let userIds = []

          if (roles.indexOf('ADMIN') !== -1) {
            userIds = reviewScope.map(({ userId }) => userId)
          } else {
            userIds = reviewScope
              .filter(({ reviewers }) =>
                reviewers.some(userId => String(userId) === String(_id))
              )
              .map(({ userId }) => userId)

            if (userIds.length === 0)
              throw new Error(
                `User:${_id} has no teams to review in ${closestReview._id}`
              )
          }

          const userInfo = await userPromise(
            userIds,
            nextReview,
            closestReview._id,
            scheduledEvents
          )
          const users = userInfo.reduce((acc, curr) => {
            if (curr !== null) {
              return [...acc, curr]
            } else return acc
          }, [])

          reviewStartInfo = {
            _id: closestReview._id,
            name,
            teams: [
              {
                _id: closestReview._id,
                teamName: 'Users to review',
                users,
                isReviewer: true
              }
            ],
            type: 'PERSONAL'
          }
          // PERSONAL SCOPE END
        } else {
          let teamIds = []

          if (roles.indexOf('ADMIN') !== -1) {
            teamIds = reviewScope.map(({ teamId }) => teamId)
          } else {
            teamIds = reviewScope
              .filter(({ reviewers }) =>
                reviewers.some(userId => String(userId) === String(_id))
              )
              .map(({ teamId }) => teamId)

            if (teamIds.length === 0) {
              throw new Error(
                `User:${_id} has no teams to review in ${closestReview._id}`
              )
            }
          }

          const allTeams = await Team.find({
            _id: { $in: teamIds },
            active: true
          }).lean()

          const teams = await Promise.all(
            allTeams.map(async team => {
              const teamScope = reviewScope.find(
                ({ teamId }) => String(teamId) === String(team._id)
              )
              const isReviewer =
                teamScope &&
                teamScope.reviewers.some(
                  reviewer => String(reviewer) === String(_id)
                )

              const { teamName, leader, members } = team
              const userIds = [leader, ...members]

              const userInfo = await userPromise(
                userIds,
                nextReview,
                closestReview._id,
                scheduledEvents
              )
              const users = userInfo.reduce((acc, curr) => {
                if (curr !== null) {
                  return [...acc, curr]
                } else return acc
              }, [])

              return {
                _id: team._id,
                teamName,
                users,
                isReviewer
              }
            })
          )

          reviewStartInfo = {
            _id: closestReview._id,
            name,
            teams,
            type: 'TEAM'
          }
        }

        return {
          ...closestReview,
          reviewStartInfo
        }
      } catch (e) {
        sentryCaptureException(e)
        return null
      }
    }
  }
}

// const allTeams = await Team.find({
//   _id: { $in: teamsToReview },
//   active: true
// }).lean()

// const teams = await Promise.all(
//   allTeams.map(async team => {
//     const { teamName, leader, members } = team
//     const userIds = [leader, ...members]

//     const userInfo = await Promise.all(
//       userIds.map(async userId => {
//         const user = await User.findById(userId)
//         const userProfile = await UserProfile.findOne({ user: userId })
//         if (!user) {
//           sentryCaptureException(`User:${userId} not found`)
//           return null
//         }

//         let numberOfGoals = await Goal.countDocuments({
//           reviewId,
//           user: userId
//         })

//         let goalsSet
//         if (nextReview) {
//           const { _id: nextReviewId } = nextReview
//           const newGoals = await Goal.find({
//             reviewId: nextReviewId,
//             user: userId
//           })
//           if (newGoals && newGoals.length > 0) {
//             numberOfGoals += newGoals.length
//             goalsSet = newGoals[0].createdAt
//           }
//         }

//         if (user.status !== 'active' || !userProfile) {
//           return {
//             _id: user._id,
//             userName: user.email,
//             active: false,
//             roleAtWork: '',
//             location: '',
//             numberOfGoals,
//             goalsSet
//           }
//         }

//         const { firstName, lastName, location } = user
//         const userName = `${firstName}${lastName ? ' ' + lastName : ''}`
//         const { roleAtWork } = userProfile

//         return {
//           _id: user._id,
//           userName,
//           roleAtWork,
//           location,
//           numberOfGoals,
//           goalsSet
//         }
//       })
//     )
//     const users = userInfo.reduce((acc, curr) => {
//       if (curr !== null) {
//         return [...acc, curr]
//       } else return acc
//     }, [])

//     return {
//       _id: team._id,
//       teamName,
//       users,
//       isReviewer: true
//     }
//   })
// )

// return {
//   _id: review._id,
//   name,
//   teams
// }
