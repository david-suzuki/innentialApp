import {
  Review,
  Goal,
  User,
  UserProfile,
  ReviewResults,
  Team,
  ReviewTemplate
} from '~/models'
import { isUser, isInnentialAdmin } from '~/directives'
import { sentryCaptureException } from '~/utils'

export const queryTypes = `
  type Query {
    fetchUserGoalInfoForReview(userId: ID!, reviewId: ID!): UserGoalInfo @${isUser}
    fetchUserGoals: [Goal] @${isUser}
    fetchUsersGoals(userId: ID!): [Goal] @${isUser}
    fetchDraftGoalsForUser(userId: ID!): [Goal] @${isUser}
    fetchDraftGoalsOfUserTeams: [ReviewTeamInfo] @${isUser}
    checkReadyForReviewGoalsForUser: Boolean @${isUser}
    fetchSingleGoal(goalId: ID!): Goal @${isUser}
    fetchOrganizationGoals(organizationId: ID!): [Goal] @${isInnentialAdmin}
    fetchGoalsStatsForOrganization(organizationId: ID!): [GoalStats] @${isInnentialAdmin}
  }
`

export const queryResolvers = {
  Query: {
    fetchUserGoals: async (_, args, { user: { _id: user } }) => {
      const allGoals = await Goal.find({ user }).sort({ createdAt: -1 })
      return allGoals
    },
    fetchUsersGoals: async (_, { userId }) => {
      const allGoals = await Goal.find({ user: userId }).sort({ createdAt: -1 })
      return allGoals
    },
    fetchDraftGoalsForUser: async (_, { userId }) => {
      const draftGoals = await Goal.find({
        user: userId,
        status: 'READY FOR REVIEW'
      }).sort({ createdAt: -1 })
      return draftGoals
    },
    fetchSingleGoal: async (_, { goalId }) => {
      const goal = await Goal.findById(goalId)
      if (goal && goal.status !== 'DRAFT' && goal.status !== 'READY FOR REVIEW')
        return null
      return goal
    },
    fetchUserGoalInfoForReview: async (
      _,
      { userId, reviewId },
      { user: { _id, roles } }
    ) => {
      const review = await Review.findById(reviewId)
      if (!review) {
        sentryCaptureException(`Review:${reviewId} not found!`)
        return null
      }
      if (review.status !== 'OPEN') {
        sentryCaptureException(`Review:${reviewId} is not open yet!`)
        return null
      }
      const { name: reviewName, reviewScope, templateId, createdAt } = review
      const isReviewer = reviewScope.some(({ reviewers }) =>
        reviewers.some(reviewer => String(reviewer) === _id)
      )
      if (!isReviewer && roles.indexOf('ADMIN') === -1) {
        sentryCaptureException(
          `Access violation: User:${_id} is not a reviewer in ${reviewId}`
        )
        return null
      }

      const user = await User.findById(userId)
      if (!user) {
        sentryCaptureException(`User:${userId} not found`)
        return null
      }
      const { firstName, lastName, email, status } = user
      const userName =
        status === 'active'
          ? `${firstName}${lastName ? ' ' + lastName : ''}`
          : email

      const goals = await Goal.find({
        user: userId,
        reviewId
      })
      let nextReviewId = null
      const nextReview = await Review.findOne({
        templateId,
        status: 'UPCOMING'
      })
      if (nextReview) nextReviewId = nextReview._id
      const nextGoals = await Goal.find({
        user: userId,
        reviewId: nextReviewId,
        status: 'ACTIVE'
      })
      const reviewTemplate = await ReviewTemplate.findById(templateId)
        .select({ oneTimeReview: 1 })
        .lean()
      const oneTimeReview = !reviewTemplate || reviewTemplate.oneTimeReview

      const goalsCompleted = goals.every(goal => goal.reviewedAt)

      const reviewResults = await ReviewResults.findOne({ reviewId })

      let feedback = ''
      let skillProgression = []
      if (reviewResults) {
        const { userResults } = reviewResults
        if (userResults && userResults.length > 0) {
          const userResult = userResults.find(ur => String(ur.user) === userId)
          if (userResult) {
            skillProgression = userResult.skillProgression
            feedback = userResult.feedback
          }
        }
      }

      return {
        _id: userId,
        reviewName,
        userName,
        active: status === 'active',
        goals,
        nextReviewId,
        goalsCompleted,
        nextGoals,
        skillProgression,
        templateId,
        oneTimeReview,
        feedback,
        createdAt
      }
    },
    checkReadyForReviewGoalsForUser: async (
      _,
      args,
      { user: { _id, organizationId, roles } }
    ) => {
      let teams = []
      if (roles.indexOf('ADMIN') !== -1) {
        teams = await Team.find({ organizationId, active: true }).lean()
      } else {
        teams = await Team.find({
          organizationId,
          active: true,
          leader: _id
        }).lean()
      }

      if (teams.length === 0) return false

      const userIds = teams
        .map(({ leader, members }) => [leader, ...members])
        .reduce((acc, curr) => [...acc, ...curr], [])
        .filter(userId => String(userId) !== String(_id))

      const readyGoal = await Goal.findOne({
        status: 'READY FOR REVIEW',
        user: { $in: userIds }
      })
        .select({ _id: 1 })
        .lean()

      return !!readyGoal
    },
    fetchDraftGoalsOfUserTeams: async (
      _,
      args,
      { user: { _id, organizationId, roles } }
    ) => {
      try {
        let teams = []
        if (roles.indexOf('ADMIN') !== -1) {
          teams = await Team.find({ organizationId, active: true }).lean()
        } else {
          teams = await Team.find({
            organizationId,
            active: true,
            leader: _id
          }).lean()
        }

        const finalTeams = await Promise.all(
          teams.map(async team => {
            const { teamName, leader, members } = team
            const userIds = [leader, ...members].filter(
              userId => String(userId) !== String(_id)
            )

            const userInfo = await Promise.all(
              userIds.map(async userId => {
                const user = await User.findById(userId)
                const userProfile = await UserProfile.findOne({ user: userId })
                if (!user) {
                  sentryCaptureException(`User:${userId} not found`)
                  return null
                }
                let numberOfGoals = await Goal.countDocuments({
                  user: userId,
                  status: 'READY FOR REVIEW'
                })

                if (user.status !== 'active' || !userProfile) {
                  return {
                    _id: user._id,
                    userName: user.email,
                    active: false,
                    roleAtWork: '',
                    location: '',
                    numberOfGoals
                  }
                }

                const { firstName, lastName, location } = user
                const userName = `${firstName}${lastName ? ' ' + lastName : ''}`
                const { roleAtWork } = userProfile

                return {
                  _id: user._id,
                  userName,
                  active: true,
                  roleAtWork,
                  location,
                  numberOfGoals
                }
              })
            )

            const users = userInfo.reduce((acc, curr) => {
              if (curr !== null && curr.numberOfGoals > 0) {
                return [...acc, curr]
              } else return acc
            }, [])

            return {
              _id: team._id,
              teamName,
              users
            }
          })
        )

        return finalTeams.reduce((acc, curr) => {
          if (curr.users.length > 0) {
            return [...acc, curr]
          } else return acc
        }, [])
      } catch (e) {
        sentryCaptureException(e)
        return []
      }
    },
    fetchOrganizationGoals: async (_, { organizationId }) => {
      const allGoals = await Goal.find({ organizationId }).sort({
        createdAt: -1
      })
      return allGoals
    },
    fetchGoalsStatsForOrganization: async (_, { organizationId }) => {
      const teams = await Team.find({
        organizationId
      }).lean()
      const teamStats = await Promise.all(
        teams.map(async team => {
          const { leader, members } = team
          const newTeam = [leader, ...members]
          const draft = await Goal.countDocuments({
            user: { $in: newTeam },
            status: 'DRAFT'
            // autogenerated: { $ne: true }
          })
          const review = await Goal.countDocuments({
            user: { $in: newTeam },
            status: 'READY FOR REVIEW'
          })
          const active = await Goal.countDocuments({
            user: { $in: newTeam },
            status: 'ACTIVE'
          })
          const completed = await Goal.countDocuments({
            user: { $in: newTeam },
            status: 'COMPLETED'
          })
          const privateGoal = await Goal.countDocuments({
            user: { $in: newTeam },
            status: 'ACTIVE',
            isPrivate: true
          })
          return {
            _id: team._id,
            draft,
            review,
            active,
            completed,
            privateGoal,
            teamName: team.teamName
          }
        })
      )
      // WHOLE ORGANIZATION OPTION
      teamStats.push({
        _id: organizationId,
        draft: await Goal.countDocuments({
          organizationId,
          status: 'DRAFT'
          // autogenerated: { $ne: true }
        }),
        review: await Goal.countDocuments({
          organizationId,
          status: 'READY FOR REVIEW'
        }),
        active: await Goal.countDocuments({
          organizationId,
          status: 'ACTIVE'
        }),
        completed: await Goal.countDocuments({
          organizationId,
          status: 'COMPLETED'
        }),
        privateGoal: await Goal.countDocuments({
          organizationId,
          status: 'ACTIVE',
          isPrivate: true
        }),
        teamName: 'Whole organization'
      })
      return teamStats
    }
  }
}
