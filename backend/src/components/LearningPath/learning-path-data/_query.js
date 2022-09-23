import { isInnentialAdmin, isAdmin, isUser } from '~/directives'
import {
  LearningPathTemplate,
  Goal,
  GoalTemplate,
  LearningContent,
  DevelopmentPlan,
  User
} from '../../../models'
import {
  sentryCaptureException,
  getUploadLink
  // getUploadBannerLink,
  // getUploadAuthorImgLink
} from '../../../utils'
import { DateTime } from 'luxon'

export const queryTypes = `
  type Query {
    fetchOrganizationLearningPath: [LearningPath] @${isAdmin}
    fetchTeamLearningPath: [TeamLearningPaths] @${isUser}
    fetchOrganizationLearningPathForDashboard(search: String): [LearningPath] @${isUser}
    fetchTeamsLearningPathsForDashboard(search: String): LearningPathList @${isUser}
    fetchInnentialLearningPaths(showOrganization : Boolean , params : InputQueryParams) : [LearningPath] @${isInnentialAdmin}
    fetchInnentialLearningPathStatistics(pathId: ID! , params : InputQueryParams): PathTemplateContent @${isInnentialAdmin}
    fetchInnentialLearningPathDetails(id : ID!) : LearningPath @${isInnentialAdmin}
    totalNumberOfInnentialLearningPaths(showOrganization : Boolean) : Int @${isInnentialAdmin}
    fetchInnentialAndOrgLearningPaths(organizationId: ID!): [LearningPath] @${isInnentialAdmin}
    fetchLearningPathById(id: ID!): LearningPath @${isUser}
    fetchLearningPathByIdAdmin(id: ID!): LearningPath @${isInnentialAdmin}
    fetchOwnOrganizationLearningPathById(id: ID!): LearningPath @${isAdmin}
    fetchLearningPathsForDashboard(search: String, limit: Int, categories: [String!]): [LearningPathList] @${isUser}
    fetchRelevantLearningPaths(neededSkills: [SelectedSkillInput!]): [LearningPath] @${isUser}
    fetchRelevantLearningPathsForUser: [LearningPath] @${isUser}
    fetchBannerUploadLink(pathId: ID!, contentType: String): URL @${isUser}
    fetchAuthorImageUploadLink(pathId: ID!, contentType: String): URL @${isInnentialAdmin}
    fetchAuthorCompanyLogoUploadLink(pathId: ID!, contentType: String): URL @${isInnentialAdmin}
    fetchAssignedLearningPathsForUser: LearningPathList @${isUser}
    fetchLearningPathCategories(onboarding: Boolean): [String!] @${isUser}
  }
`
const fetchOneLearningPathStatistics = async (
  _,
  { learningPathId, minDate, organizationId, realUsers }
) => {
  // TODO: We should not be making another query for this template again
  const learningPath = await LearningPathTemplate.findById(
    learningPathId
  ).lean()

  const goalStats = await Promise.all(
    learningPath.goalTemplate.map(async goalTemplateId =>
      fetchLearningGoalStatistics(null, {
        goalTemplateId,
        minDate,
        organizationId,
        realUsers
      })
    )
  )

  const userGoalPairs = await Promise.all(
    learningPath.goalTemplate.map(async goalTemplate => {
      const goals = await Goal.find({
        ...(organizationId && { organizationId }),
        fromTemplate: goalTemplate,
        createdAt: { $gte: minDate },
        user: { $in: realUsers }
      }).lean()

      return goals.map(goal => {
        return {
          user: goal.user,
          status: goal.status
        }
      })
    })
  )

  const userGoalsMap = userGoalPairs
    .reduce((acc, curr) => [...acc, ...curr], [])
    .reduce((acc, b) => {
      if (!acc[b.user]) {
        acc[b.user] = {
          activeCount: b.status === 'ACTIVE' ? 1 : 0,
          pastCount: b.status === 'PAST' ? 1 : 0
        }
      } else {
        if (b.status === 'ACTIVE') {
          acc[b.user].activeCount++
        } else if (b.status === 'PAST') {
          acc[b.user].pastCount++
        }
      }
      return acc
    }, [])

  let inProgressCount = 0
  let completedCount = 0

  const noGoals = learningPath.goalTemplate.length

  for (const [key, pair] of Object.entries(userGoalsMap)) {
    if (pair.pastCount === noGoals) {
      completedCount++
    } else if (pair.activeCount > 0) {
      inProgressCount++
    }
  }

  const pathOrganization = learningPath.organization
    ? learningPath.organization
    : null

  return {
    learningPathId: learningPath._id,
    name: learningPath.name,
    organization: pathOrganization,
    inProgressCount,
    completedCount,
    learningGoalStatistics: goalStats
  }
}
const fetchLearningGoalStatistics = async (
  _,
  { goalTemplateId, minDate, organizationId, realUsers }
) => {
  const goalTemplate = await GoalTemplate.findById(goalTemplateId)
    .select({ goalName: 1, 'content.contentId': 1 })
    .lean()

  if (!goalTemplate.content) {
    return {}
  }

  const contentStats = await Promise.all(
    goalTemplate.content.map(async content =>
      fetchLearningContentStatistics(null, {
        learningContentId: content.contentId,
        goalTemplateId,
        minDate,
        organizationId,
        realUsers
      })
    )
  )

  const seenCount = await Goal.countDocuments({
    ...(organizationId && { organizationId }),
    fromTemplate: goalTemplateId,
    $or: [{ status: 'PAST' }, { seen: true }],
    createdAt: { $gte: minDate },
    user: { $in: realUsers }
  })

  const completedCount = await Goal.countDocuments({
    ...(organizationId && { organizationId }),
    fromTemplate: goalTemplateId,
    status: 'PAST',
    createdAt: { $gte: minDate },
    user: { $in: realUsers }
  })

  return {
    goalId: goalTemplateId,
    name: goalTemplate.goalName,
    inProgressCount: seenCount,
    completedCount,
    learningContentStatistics: contentStats
  }
}
const fetchLearningContentStatistics = async (
  _,
  { learningContentId, goalTemplateId, minDate, organizationId, realUsers }
) => {
  const learningGoals = await Goal.find({
    ...(organizationId && { organizationId }),
    fromTemplate: goalTemplateId,
    createdAt: { $gte: minDate },
    user: { $in: realUsers }
  })
    .select({ _id: 1 })
    .lean()

  const learningGoalIds = learningGoals.map(goal => String(goal._id))

  const developmentPlans = await DevelopmentPlan.find({
    ...(organizationId && { organizationId }),
    'content.contentId': learningContentId,
    user: { $in: realUsers }
  })
    .select({
      'content.contentId': 1,
      'content.goalId': 1,
      'content.status': 1
    })
    .lean()

  const learningContents = developmentPlans
    .map(plan => plan.content)
    .reduce((acc, curr) => [...acc, ...curr], [])
    .filter(
      content =>
        String(content.contentId) === String(learningContentId) &&
        content.goalId &&
        learningGoalIds.includes(String(content.goalId))
    )

  // for title
  const learningContent = await LearningContent.findById(learningContentId)
    .select({ title: 1, type: 1 })
    .lean()

  const notStartedContents = learningContents.filter(
    content => content.status === 'NOT STARTED'
  )
  const inProgressContents = learningContents.filter(
    content => content.status === 'IN PROGRESS'
  )
  const completedContents = learningContents.filter(
    content => content.status === 'COMPLETED'
  )

  return {
    contentId: learningContentId,
    title: learningContent ? learningContent.title : 'Content not found',
    type: learningContent ? learningContent.type : '',
    notStartedCount: notStartedContents.length,
    inProgressCount: inProgressContents.length,
    completedCount: completedContents.length
  }
}

export const queryResolvers = {
  Query: {
    fetchOrganizationLearningPath: async (_, __, { user, dataSources }) =>
      dataSources.LearningPath.findOrganizationPaths({ user }),
    fetchTeamLearningPath: async (_, __, { user, dataSources }) =>
      dataSources.LearningPath.findTeamPaths({ user }),
    fetchOrganizationLearningPathForDashboard: async (
      _,
      { search },
      { user, dataSources }
    ) =>
      dataSources.LearningPath.findOrganizationPathsForDashboard({
        user,
        search
      }),
    fetchTeamsLearningPathsForDashboard: async (
      _,
      { search },
      { user, dataSources }
    ) =>
      dataSources.LearningPath.findTeamsPathsForDashboard({
        user,
        search
      }),
    fetchInnentialLearningPaths: async (
      _,
      { showOrganization, params = {} },
      { dataSources }
    ) => {
      return dataSources.LearningPath.getAll(
        showOrganization ? {} : { organization: null },
        params
      )
    },
    fetchInnentialLearningPathStatistics: async (
      _,
      { pathId, organizationId },
      { dataSources }
    ) => {
      // const learningPath = await LearningPathTemplate.findById(pathId).lean()

      // 3 is April because in JS, January is Month 0
      const minDate = DateTime.fromJSDate(new Date(2021, 3, 1))

      // TODO: Why are we getting all users?
      const allUsers = await User.find({
        status: { $ne: 'disabled' }
      }) // non-Innential users
        .select({ _id: 1, email: 1 })
        .lean()

      const realUsers = allUsers
        .filter(user => {
          const emailParts = user.email.split('@')
          return emailParts.length > 1 && emailParts[1] !== 'innential.com'
        })
        .map(user => String(user._id))

      // TODO: We should probably be using learningPaths here instead of learningPathIds
      // to avoid querying the db for the learningPath again
      const pathStats = await fetchOneLearningPathStatistics(null, {
        pathId,
        minDate,
        organizationId,
        realUsers
      })

      const statistics = pathStats.filter(p => {
        if (
          organizationId &&
          p.organization == null &&
          p.inProgressCount === 0 &&
          p.completedCount === 0
        ) {
          return false
        }
        return true
      })
      return statistics
    },
    fetchInnentialLearningPathDetails: async (_, { id }, { dataSources }) => {
      return dataSources.LearningPath.findById(id)
    },
    totalNumberOfInnentialLearningPaths: async (
      _,
      { showOrganization },
      { dataSources }
    ) => {
      let innentialLearningPaths = await dataSources.LearningPath.count(
        showOrganization ? {} : { organization: null }
      )
      return innentialLearningPaths
    },
    fetchInnentialAndOrgLearningPaths: async (
      _,
      { organizationId },
      { dataSources }
    ) => {
      return dataSources.LearningPath.getAll({
        $or: [{ organization: null }, { organization: organizationId }]
      })
    },
    fetchLearningPathByIdAdmin: async (_, args, { dataSources }) => {
      const { id } = args || {}
      if (!id) return null
      return dataSources.LearningPath.getOne({
        _id: id
      })
    },
    fetchLearningPathById: async (
      _,
      args,
      { dataSources, user: { organizationId } }
    ) => {
      const { id } = args || {}
      if (!id) return null
      return dataSources.LearningPath.getOne({
        _id: id,
        $or: [{ organization: null }, { organization: organizationId }]
      })
    },
    fetchOwnOrganizationLearningPathById: async (
      _,
      args,
      { dataSources, user }
    ) => {
      const { id } = args || {}
      const { organizationId } = user
      if (!id || !organizationId) return null
      return dataSources.LearningPath.findOwnOrganizationLearningPathById({
        id,
        organizationId
      })
    },
    fetchLearningPathsForDashboard: async (
      _,
      { limit, search, categories },
      { dataSources, user: { _id, organizationId } }
    ) => {
      try {
        if (search) {
          return dataSources.LearningPath.findLearningPathsBySearch({
            organizationId,
            search,
            limit,
            categories
          })
        } else {
          return dataSources.LearningPath.getLearningPathsForDashboard({
            organizationId,
            _id,
            limit,
            categories
          })
        }
      } catch (err) {
        sentryCaptureException(err)
        return null
      }
    },
    fetchRelevantLearningPaths: async (
      _,
      { neededSkills },
      { dataSources, user: { organizationId } }
    ) =>
      dataSources.LearningPath.findRelevantLearningPaths({
        organizationId,
        neededSkills
      }),
    fetchRelevantLearningPathsForUser: async (
      _,
      args,
      { dataSources, user: { _id: userId } }
    ) => dataSources.LearningPath.findRelevantLearningPathsForUser({ userId }),
    fetchBannerUploadLink: async (_, args) => {
      const { pathId: _id, contentType } = args
      return getUploadLink({ _id, contentType, key: 'learning-paths/banners' })
    },
    fetchAuthorImageUploadLink: async (_, args) => {
      const { pathId: _id, contentType } = args
      return getUploadLink({ _id, contentType, key: 'learning-paths/authors' })
    },
    fetchAuthorCompanyLogoUploadLink: async (_, args) => {
      const { pathId: _id, contentType } = args
      return getUploadLink({
        _id,
        contentType,
        key: 'learning-paths/company-logos'
      })
    },
    fetchAssignedLearningPathsForUser: async (
      _,
      args,
      { user: { _id: user }, dataSources }
    ) => {
      return dataSources.LearningPath.getAssignedPathsForUser({
        user
      })
    },
    fetchLearningPathCategories: async (
      _,
      { onboarding },
      { dataSources, user }
    ) =>
      dataSources.LearningPath.getLearningPathCategories({ user, onboarding })
  }
}
