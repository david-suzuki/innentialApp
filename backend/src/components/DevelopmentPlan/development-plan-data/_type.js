import GokuArray from 'goku-array'
import {
  LearningContent,
  UserProfile,
  User,
  Goal,
  GoalTemplate,
  UserContentInteractions,
  Review,
  Organization,
  FulfillmentRequest
} from '~/models'
import { Types } from 'mongoose'
import { getDownloadLink } from '~/utils'

export const types = `
  type DevelopmentPlan {
    _id: String!
    content: [DevelopmentPlanContent]
    mentors: [RelevantUser]
    tasks: [DevelopmentPlanTask]
    selectedGoalId: ID
    selectedGoalName: String
  }

  type DevelopmentPlanTask {
    _id: ID!
    task: Task
    status: String!
    goalId: ID
    goalName: String
    goalCompleted: Boolean
    goalEnds: DateTime
    startDate: DateTime
    endDate: DateTime
  }

  type GoalAndPlan {
    _id: ID!
    user: ID!
    developmentPlan: DevelopmentPlan
    goal: Goal
  }

  type DevelopmentPlanContent {
    _id: ID!
    content: LearningContent!
    status: String!
    approved: Boolean
    goalId: ID
    goalName: String
    goalCompleted: Boolean
    goalEnds: DateTime
    startDate: DateTime
    endDate: DateTime
    setBy: ID
    request: Request
    fulfillmentRequest: FulfillmentRequest
    note: String
    order: Int
  }

  type DevelopmentPlanRelatedContent {
    recommended: [LearningContent]
    relatedContentLength: [Int]
    relatedContent: [LearningContent]
    relatedMentors: [RelevantUser]
    savedForLater: [LearningContent]
    totalRelatedContent : Int
  }

  type JourneyNextSteps {
    _id: ID!
    awaitingXLP: Boolean
  }

  type DevelopmentPlanStats {
    _id: ID!
    path: DevelopmentPlanLearningPath
    content: [DevelopmentPlanLearningContent]
  }

  type DevelopmentPlanLearningPath {
    _id: ID!
    pathId: ID!
    name: String
    status: String
    assignedBy: LearningPathAssigner
    stats: LearningContentStats
  }
  
  type LearningPathAssigner {
    _id: ID!
    userId: ID
    name: String
  }

  type LearningContentStats {
    _id: ID!
    inProgressCount: Int
    completedCount: Int
    notStartedCount: Int
  }
  
  type DevelopmentPlanLearningContent {
    _id: ID!
    contentId: ID!
    name: String
    type: String
    price: String
    status: String
    source: ContentSource
  }
`

export const typeResolvers = {
  DevelopmentPlan: {
    selectedGoalName: async ({ selectedGoalId }) => {
      const goal = await Goal.findById(selectedGoalId)
        .select({ goalName: 1 })
        .lean()
      if (goal) return goal.goalName
      return ''
    },
    tasks: async ({ tasks, startDate, endDate }, _, { dataSources }) => {
      // startDate: DateTime
      // endDate: DateTime
      const items = new GokuArray(tasks).groupBy('taskId') // needed for granting consistency

      let allTasks = new GokuArray(
        await dataSources.Task.getAllResolvers(tasks.map(t => t.taskId))
      )
      const allGoals = await dataSources.Goal.getAllResolvers(
        tasks.filter(t => !!t.goalId).map(t => t.goalId)
      )

      return allTasks.asyncMap(async task => {
        const _id = task._id.toString()

        const associatedGoal = allGoals.find(
          goal => goal._id.toString() === items[_id][0].goalId.toString()
        )
        const { _id: goalId, goalName, status } = associatedGoal
        // all these might go in the Goal type resolver fields
        const goalCompleted = associatedGoal.status === 'PAST'
        const review = await Review.findById(associatedGoal.reviewId)
          .select({ startsAt: 1, closedAt: 1 })
          .lean()
        let goalEnds
        if (review) {
          if (review.closedAt) {
            goalEnds = review.closedAt
          } else goalEnds = review.startsAt
        }
        /// /////
        return {
          _id,
          task: await dataSources.Task.getResolver(_id),
          status,
          goalId: goalId,
          goalName,
          goalCompleted,
          goalEnds,
          startDate,
          endDate
        }
      })
    },
    content: async (
      { content, user },
      _,
      { user: { _id: currentUserId, organizationId }, dataSources }
    ) => {
      const interactionsProfile = await UserContentInteractions.findOne({
        user
      })
        .select({ recommended: 1 })
        .lean()
      const recommended = interactionsProfile && interactionsProfile.recommended

      const organization = await Organization.findById(organizationId)
        .select({ approvals: 1 })
        .lean()

      // TODO
      // start date is taken from development plan
      // updated at is taken from learning path
      // const canBeOrdered = new Date(startDate) >= new Date(updatedAt)

      const normalisedContent = await Promise.all(
        content.map(
          async ({
            contentId,
            _id,
            status,
            goalId,
            startDate,
            endDate,
            setBy,
            approved: currentlyApproved,
            note,
            order
          }) => {
            const item = await LearningContent.findOne({
              _id: contentId
            }).lean()

            if (item) {
              const recommendationItem =
                recommended &&
                recommended.find(
                  ({ contentId }) => String(contentId) === String(item._id)
                )

              let recommendationInfo = {}
              if (recommendationItem) {
                const { recommendedBy, recommendedAt } = recommendationItem
                recommendationInfo = {
                  recommendedBy,
                  recommendedAt
                }
              } else if (
                setBy &&
                String(setBy) !== String(user) &&
                String(setBy) !== String(currentUserId)
              ) {
                recommendationInfo = {
                  recommendedBy: setBy
                }
              }

              let goalName, goalCompleted, goalEnds
              const goal = await Goal.findById(goalId)
                .select({
                  goalName: 1,
                  status: 1,
                  reviewId: 1,
                  reviewedAt: 1,
                  fromPath: 1
                })
                .lean()
              if (goal) {
                goalName = goal.goalName
                goalCompleted = goal.status === 'PAST'
                const review = await Review.findById(goal.reviewId)
                  .select({ startsAt: 1, closedAt: 1 })
                  .lean()
                if (review) {
                  if (review.closedAt) {
                    goalEnds = review.closedAt
                  } else goalEnds = review.startsAt
                }
              }

              const request = await dataSources.LearningRequest.getRequest({
                contentId,
                user
              })

              const fulfillmentRequest = await FulfillmentRequest.findOne({
                contentId,
                user
              })

              const approved =
                !organization ||
                !organization.approvals || // APPROVALS TURNED OFF
                currentlyApproved === undefined || // EXCEPTION FOR OLD CONTENT
                currentlyApproved || // CONTENT APPROVED CURRENTLY
                (request && request.approved) // CONTENT PREVIOUSLY APPROVED

              return {
                _id,
                status,
                content: {
                  ...item,
                  ...recommendationInfo
                },
                goalId,
                goalName,
                goalCompleted,
                goalEnds,
                startDate,
                endDate,
                setBy,
                approved,
                request,
                fulfillmentRequest,
                note,
                order
              }
            }
            return null
          }
        )
      )
      return normalisedContent.reduce((acc, curr) => {
        if (curr === null) {
          return acc
        } else return [...acc, curr]
      }, [])
      // .filter(({ content: item }) => {
      //   if (price && price.length) {
      //     if (price.length === 2) return true
      //     else if (price.indexOf('Paid') !== -1) {
      //       return item.price.value > 0
      //     } else return item.price.value === 0
      //   } else return true
      // })
    },
    mentors: async ({ mentors }) => {
      const denormalisedMentors = await Promise.all(
        mentors.map(async ({ mentorId: user, goalId, active }) => {
          const userProfile = await UserProfile.findOne({ user })
            .select({ roleAtWork: 1, selectedWorkSkills: 1 })
            .lean()
          const denormalisedUser = await User.findOne({ _id: user })
            .select({ firstName: 1, lastName: 1, location: 1, status: 1 })
            .lean()

          let img,
            isActive,
            label,
            location,
            name,
            profession,
            /* status, */ goalName,
            goalCompleted,
            goalEnds
          let skills = []
          let status = ''

          if (userProfile) {
            const { roleAtWork } = userProfile
            profession = roleAtWork
            const { selectedWorkSkills } = userProfile
            skills = selectedWorkSkills.map(({ _id, level }) => {
              return { _id, level, relevancyRating: 2 }
            })
          }
          if (denormalisedUser) {
            const {
              firstName,
              lastName,
              location: userLocation,
              status: userStatus
            } = denormalisedUser
            name = `${firstName} ${lastName}`
            location = userLocation
            isActive = userStatus === 'active'
            status = userStatus
              .toLowerCase()
              .replace(/\b\w/g, l => l.toUpperCase())
            img = await getDownloadLink({
              key: 'users/profileImgs',
              expires: 500 * 60,
              _id: user
            })
          } else {
            name = 'User deleted'
            isActive = false
          }

          if (goalId) {
            const goal = await Goal.findById(goalId)
              .select({ goalName: 1, status: 1, reviewId: 1, reviewedAt: 1 })
              .lean()
            if (goal) {
              goalName = goal.goalName
              goalCompleted = goal.status === 'PAST'
              const review = await Review.findById(goal.reviewId)
                .select({ startsAt: 1, closedAt: 1 })
                .lean()
              if (review) {
                if (review.closedAt) {
                  goalEnds = review.closedAt
                } else goalEnds = review.startsAt
              }
            }
          }

          return {
            _id: user,
            img,
            isActive,
            label,
            location,
            name,
            profession,
            status,
            goalId,
            goalName,
            goalCompleted,
            goalEnds,
            skills
          }
        })
      )
      return denormalisedMentors
    }
  },
  DevelopmentPlanContent: {
    order: async ({ goalId, content }) => {
      const goal = await Goal.findById(goalId)
        .select({
          fromTemplate: 1
        })
        .lean()

      if (!goal) return 0

      const goalTemplateId = goal.fromTemplate

      if (goalTemplateId) {
        const goalTemplate = await GoalTemplate.findById(goalTemplateId)
          .select({
            content: 1
          })
          .lean()

        let contentOrder = 0

        if (goalTemplate && goalTemplate.content) {
          goalTemplate.content.forEach(c => {
            if (String(c.contentId) === String(content._id)) {
              contentOrder = c.order || 0
            }
          })
        }

        return contentOrder
      }
      return 0
    }
  },
  DevelopmentPlanStats: {
    _id: () => new Types.ObjectId()
  },
  DevelopmentPlanLearningPath: {
    _id: () => new Types.ObjectId()
  },
  LearningPathAssigner: {
    _id: () => new Types.ObjectId()
  },
  DevelopmentPlanLearningContent: {
    _id: () => new Types.ObjectId()
  },
  LearningContentStats: {
    _id: () => new Types.ObjectId()
  }
}

// {
//   _id
//   img
//   isActive
//   label
//   location
//   name
//   profession
// }
