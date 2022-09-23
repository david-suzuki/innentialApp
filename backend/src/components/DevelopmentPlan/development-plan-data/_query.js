import {
  DevelopmentPlan,
  Goal,
  LearningPathTemplate,
  LearningContent,
  User,
  ContentSources
} from '~/models'
import { isUser } from '~/directives'
import JourneyNextSteps from '../../../models/JourneyNextSteps'
import { DateTime } from 'luxon'

export const queryTypes = `
  type Query {
    fetchDevelopmentPlan(user: ID!, reviewId: ID): DevelopmentPlan @${isUser}
    fetchUserDevelopmentPlan: DevelopmentPlan @${isUser}
    fetchUserCompletedContentPlan(limit: Int): [DevelopmentPlanContent] @${isUser}
    fetchContentPlanForGoal(goalId: ID!): GoalAndPlan @${isUser}
    checkContentPlanForGoal(goalId: ID!): Boolean @${isUser}
    fetchNextStepsForUser: JourneyNextSteps @${isUser}
    fetchDevelopmentPlanWithStats(userId: ID!): [DevelopmentPlanStats] @${isUser}
  }
`

const currencySymbols = {
  EUR: '€',
  USD: '$'
}

export const fetchDevelopmentPlanWithStats = async (
  _,
  { userId: user, filter },
  { user: { _id: contextUser } }
) => {
  const devPlan = await DevelopmentPlan.findOne({
    user,
    active: true
  }).lean()

  const startOfWeek = DateTime.fromJSDate(new Date()).startOf('week')

  if (devPlan) {
    const devPlanContent = devPlan.content.filter(({ startDate, endDate }) => {
      const start = new Date(startDate)
      const end = endDate ? new Date(endDate) : null
      return (
        !filter ||
        filter === 'ALL_TIME' ||
        start >= startOfWeek.toJSDate() ||
        end >= startOfWeek.toJSDate()
      )
    })

    const pathContentArray = await Promise.all(
      devPlanContent.map(async c => {
        const dbContent = await LearningContent.findById(c.contentId)
          .select({
            _id: 1,
            price: 1,
            source: 1,
            title: 1,
            type: 1,
            iconSource: 1
          })
          .lean()

        const goal = await Goal.findById(c.goalId)
          .select({ _id: 1, fromTemplate: 1, setBy: 1 })
          .lean()

        const learningPath = await LearningPathTemplate.findOne({
          goalTemplate: goal ? goal.fromTemplate : null
        })
          .select({ _id: 1, name: 1 })
          .lean()

        const setBy = goal ? goal.setBy : null

        let assignedBy = ''
        if (setBy === null) {
          assignedBy = 'Innential'
        } else {
          if (String(user) === String(contextUser)) {
            assignedBy = 'You'
          } else {
            const assignedByUser = await User.findById(setBy)
              .select({ _id: 1, firstName: 1, lastName: 1 })
              .lean()

            if (assignedByUser)
              assignedBy = `${assignedByUser.firstName} ${assignedByUser.lastName}`
          }
        }

        const { _id: pathId, ...pathRest } = learningPath || {}
        const {
          _id: contentId,
          title: contentName,
          source: sourceId,
          price: contentPrice,
          ...contentRest
        } = dbContent || {}

        const source = await ContentSources.findById(sourceId)
          .select({ _id: 1, name: 1, baseUrls: 1 })
          .lean()

        const price = contentPrice
          ? contentPrice.value === 0
            ? 'FREE'
            : `${
                currencySymbols[contentPrice.currency]
              }${contentPrice.value.toFixed(2)}`
          : ''

        return {
          path: {
            pathId,
            ...pathRest,
            assignedBy: {
              userId: setBy,
              name: assignedBy
            }
          },
          content: {
            contentId,
            name: contentName,
            status: !c.approved ? 'AWAITING APPROVAL' : c.status,
            source: source || {
              name: '',
              baseUrls: []
            },
            price,
            ...contentRest
          }
        }
      })
    )

    const pathContentMap = pathContentArray.reduce((acc, curr) => {
      if (curr.path) {
        const pathId = curr.path.pathId
        if (!pathId) return acc

        if (!acc[pathId]) {
          acc[pathId] = {
            path: curr.path,
            content: [curr.content]
          }
        } else {
          acc[pathId].content.push(curr.content)
        }
      }

      return acc
    }, {})

    return Object.values(pathContentMap).map(el => {
      const inProgressCount = el.content.filter(
        content => content.status === 'IN PROGRESS'
      ).length

      const completedCount = el.content.filter(
        content => content.status === 'COMPLETED'
      ).length

      const notStartedCount = el.content.filter(content =>
        ['AWAITING APPROVAL', 'NOT STARTED', 'AWAITING FULFILLMENT'].includes(
          content.status
        )
      ).length

      const startedCount = inProgressCount + completedCount

      el.path.status =
        startedCount === 0
          ? 'NOT STARTED'
          : completedCount === el.content.length
          ? 'COMPLETED'
          : 'IN PROGRESS'

      el.path.stats = {
        inProgressCount,
        completedCount,
        notStartedCount
      }

      return el
    })
  }
  return null
}

export const queryResolvers = {
  Query: {
    fetchDevelopmentPlan: async (_, { user, reviewId }) => {
      if (reviewId) {
        const devPlan = await DevelopmentPlan.findOne({
          user,
          reviewId,
          active: true
        })
        return devPlan
      } else {
        const devPlan = await DevelopmentPlan.findOne({
          user,
          active: true
        })
        return devPlan
      }
    },
    fetchUserDevelopmentPlan: async (_, args, { user: { _id: user } }) => {
      const devPlan = await DevelopmentPlan.findOne({
        user,
        active: true
      }).lean()
      if (devPlan) {
        const { content, mentors, selectedGoalId } = devPlan
        const filteredPlan = {
          ...devPlan,
          content: content.filter(
            ({ goalId }) =>
              !selectedGoalId || String(goalId) === String(selectedGoalId)
          ),
          mentors: mentors.filter(
            ({ goalId }) =>
              !selectedGoalId || String(goalId) === String(selectedGoalId)
          )
        }
        return filteredPlan
      }
      return null
    },
    fetchUserCompletedContentPlan: async (
      _,
      { limit },
      { user: { _id: user } }
    ) => {
      const devPlan = await DevelopmentPlan.findOne({
        user,
        active: true
      }).lean()
      if (devPlan) {
        const { content } = devPlan

        const completedContent = content.filter(
          ({ status }) => status === 'COMPLETED'
        )

        completedContent.sort(
          (a, b) => new Date(b.endDate || null) - new Date(a.endDate || null)
        )

        return (
          await Promise.all(
            completedContent.slice(0, limit).map(async item => {
              return {
                ...item,
                content: await LearningContent.findById(item.contentId).lean()
              }
            })
          )
        ).filter(({ content }) => !!content)
      }
      return null
    },
    fetchContentPlanForGoal: async (
      _,
      { goalId },
      { user: { _id, roles, organizationId } }
    ) => {
      const goal = await Goal.findById(goalId).lean()
      if (!goal) return null

      if (String(goal.organizationId) !== String(organizationId)) return null

      const { user } = goal

      const devPlan = await DevelopmentPlan.findOne({
        user,
        active: true
      }).lean()

      if (!devPlan) return null
      const filteredContent = devPlan.content.filter(
        c => String(goalId) === String(c.goalId)
      )
      const filteredMentors = devPlan.mentors.filter(
        m => String(goalId) === String(m.goalId)
      )

      return {
        _id: `${user}:${goalId}`,
        user,
        developmentPlan: {
          ...devPlan,
          _id: `${devPlan._id}:${goalId}`,
          content: filteredContent,
          mentors: filteredMentors
        },
        goal
      }
    },
    checkContentPlanForGoal: async (_, { goalId }) => {
      const goal = await Goal.findById(goalId)
      if (goal) {
        if (goal.goalType === 'PERSONAL' && goal.user) {
          const goalsDevPlan = await DevelopmentPlan.findOne({
            user: goal.user,
            $or: [{ 'content.goalId': goal._id }, { 'mentor.goalId': goal._id }]
          })

          return !!goalsDevPlan
        } else return false // TODO: Other types of goals
      }

      return false
    },
    fetchNextStepsForUser: async (_, args, { user: { _id: user } }) => {
      return JourneyNextSteps.findOne({ user }).lean()
    },
    fetchDevelopmentPlanWithStats
  }
}
