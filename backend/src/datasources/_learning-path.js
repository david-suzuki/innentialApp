import to from 'await-to-js'
import GokuArray from 'goku-array'
import GoalTemplate from './_goal-template'
import {
  LearningPathTemplate,
  LearningContent,
  DevelopmentPlan,
  Goal,
  GoalTemplate as GoalTemplateModel,
  UserProfile,
  UserContentInteractions,
  RoleRequirements,
  User,
  Team,
  Organization,
  JourneyNextSteps,
  PathAssignee,
  Comment,
  ContentSources
} from '~/models'
import {
  throwIfError,
  sendEmail,
  learningPathNotification,
  learningPathRequestedNotification,
  appUrls,
  sentryCaptureException
} from '../utils'
import MongoDataSourceClass from './_mongo-datasource-class'
import {
  learningPathSearch,
  learningPathForArgs,
  getLearningPathForNewLPNotification
} from './utils/learning-path'
import series from 'async/series'
import LearningRequest from './_learning-request'
import { Types } from 'mongoose'
import checkAvailableSubscription from './utils/learning-content/checkAvailableSubscription'

const appLink = appUrls['user']

const setDevelopmentPlan = async ({
  setBy,
  organizationId,
  user,
  content,
  mentors,
  goalId,
  isFirstGoal
}) => {
  const checkStatus = (organization, contentSource, content) => {
    return (
      content.status ||
      ((organization &&
        organization.fulfillment &&
        content.price > 0 &&
        !content.subscriptionAvailable) ||
      (contentSource &&
        contentSource.accountRequired &&
        organization.fulfillment)
        ? 'AWAITING FULFILLMENT'
        : 'NOT STARTED')
    )
  }
  const userData = await User.findById(user)
    .select({ roles: 1 })
    .lean()

  const devPlan = await DevelopmentPlan.findOne({ user, active: true })
    .select({ _id: 1 })
    .lean()

  const organization = await Organization.findById(organizationId)
    .select({ approvals: 1, fulfillment: 1 })
    .lean()

  if (devPlan) {
    let result = {}
    if (goalId) {
      // let status, active

      // const goal = await Goal.findById(goalId)
      //   .select({ status: 1 })
      //   .lean()

      // if (goal && goal.status === 'ACTIVE') {
      //   status = organization && organization.fulfillment ? 'AWAITING FULFILLMENT' : 'NOT STARTED'
      //   active = true
      // } else {
      //   status = 'INACTIVE'
      //   active = false
      // }

      const pullResult = await DevelopmentPlan.findOneAndUpdate(
        { user, active: true },
        {
          $pull: {
            content: {
              goalId
            },
            mentors: {
              goalId
            }
          }
        },
        { new: true, lean: true }
      )

      const { content: existingContent, mentors: existingMentors } = pullResult

      const updatedContent = await Promise.all(
        // await Promise.all(
        content
          .filter(
            ({ contentId }) =>
              !existingContent.some(
                ({ contentId: existingId }) =>
                  String(existingId) === String(contentId)
              )
          )
          .map(
            /* async */ async content => {
              const approved =
                !organization ||
                !organization.approvals ||
                userData.roles.includes('ADMIN') ||
                content.price === 0

              const learningContent = await LearningContent.findById(
                content.contentId
              )
              const contentSource = await ContentSources.findById(
                learningContent.source
              )
              const status = checkStatus(organization, contentSource, content)

              // if (!approved) {
              //   await LearningRequest.requestLearning(
              //     {
              //       contentId: content.contentId,
              //       goalId
              //     },
              //     {
              //       user,
              //       organizationId
              //     }
              //   )
              // }
              return {
                ...content,
                status,
                approved
              }
            }
          )
      )
      // )

      const updatedMentors = mentors
        .filter(
          ({ mentorId }) =>
            !existingMentors.some(
              ({ mentorId: existingId }) =>
                String(existingId) === String(mentorId)
            )
        )
        .map(mentor => ({
          ...mentor,
          active: true
        }))

      const pushResult = await DevelopmentPlan.findOneAndUpdate(
        { user, active: true },
        {
          $push: {
            content: {
              $each: updatedContent
            },
            mentors: {
              $each: updatedMentors
            }
          },
          $set: {
            updatedAt: new Date(),
            ...(isFirstGoal &&
              (!pullResult.selectedGoalId ||
                String(setBy) === String(user)) && { selectedGoalId: goalId })
          }
        },
        { new: true, lean: true }
      )

      if (
        isFirstGoal &&
        (!pullResult.selectedGoalId || String(setBy) === String(user))
      ) {
        await Goal.updateOne({ _id: goalId }, { seen: true })
      }

      if (pushResult) {
        const filteredContent = pushResult.content.filter(
          item => String(goalId) === String(item.goalId)
        )

        const filteredMentors = pushResult.mentors.filter(
          item => String(goalId) === String(item.goalId)
        )

        result = {
          ...pushResult,
          content: filteredContent,
          mentors: filteredMentors
        }
      }
    } else {
      const pullResult = await DevelopmentPlan.findOneAndUpdate(
        { user, active: true },
        {
          $pull: {
            content: {
              status: { $ne: 'INACTIVE' }
            },
            mentors: {
              active: true
            }
          }
        },
        { new: true, lean: true }
      )

      const { content: existingContent, mentors: existingMentors } = pullResult

      const updatedContent = await Promise.all(
        content
          .filter(
            ({ contentId }) =>
              !existingContent.some(
                ({ contentId: existingId }) =>
                  String(existingId) === String(contentId)
              )
          )
          .map(async content => {
            const approved =
              !organization ||
              !organization.approvals ||
              userData.roles.includes('ADMIN') ||
              content.price === 0
            const learningContent = await LearningContent.findById(
              content.contentId
            )
            const contentSource = await ContentSources.findById(
              learningContent.source
            )
            const status = checkStatus(organization, contentSource, content)

            // if (!approved) {
            //   await LearningRequest.requestLearning(
            //     {
            //       contentId: content.contentId,
            //       goalId
            //     },
            //     {
            //       user,
            //       organizationId
            //     }
            //   )
            // }
            return {
              ...content,
              status,
              approved
            }
          })
      )

      const updatedMentors = mentors.filter(
        ({ mentorId }) =>
          !existingMentors.some(
            ({ mentorId: existingId }) =>
              String(existingId) === String(mentorId)
          )
      )

      result = await DevelopmentPlan.findOneAndUpdate(
        { user, active: true },
        {
          $push: {
            content: {
              $each: updatedContent
            },
            mentors: {
              $each: updatedMentors
            }
          },
          $set: {
            updatedAt: new Date()
          }
        },
        { new: true }
      )
    }
    return result
  } else {
    const newPlan = await DevelopmentPlan.create({
      user,
      setBy,
      content: await Promise.all(
        content.map(
          /* async */ async content => {
            const approved =
              !organization ||
              !organization.approvals ||
              userData.roles.includes('ADMIN') ||
              content.price === 0

            const learningContent = await LearningContent.findById(
              content.contentId
            )
            const contentSource = await ContentSources.findById(
              learningContent.source
            )
            const status = checkStatus(organization, contentSource, content)

            // if (!approved) {
            //   await LearningRequest.requestLearning(
            //     {
            //       contentId: content.contentId,
            //       goalId
            //     },
            //     {
            //       user,
            //       organizationId
            //     }
            //   )
            // }
            return {
              ...content,
              status,
              approved
            }
          }
        )
      ),
      mentors,
      organizationId,
      selectedGoalId: goalId
    })

    await Goal.updateOne({ _id: goalId }, { seen: true })

    return newPlan
  }
}

const transformTemplateToGoal = async ({
  userId,
  targetUser,
  forApproval,
  goalTemplate,
  deadline,
  reviewId,
  organization,
  isFirstGoal
}) => {
  const {
    createdAt,
    updatedAt,
    tasks,
    _id,
    measures = [],
    relatedSkills = [],
    content: rawContent = [],
    mentors = [],
    ...goalData
  } = goalTemplate

  const data = {
    ...goalData,
    measures: measures.map(m => ({ measureName: m })),
    setBy: userId,
    user: targetUser,
    status: forApproval ? 'READY FOR REVIEW' : 'ACTIVE',
    relatedSkills,
    organizationId: organization, // use user's organization
    fromTemplate: _id,
    // isPrivate: !forApproval && targetUser === userId,
    deadline,
    reviewId
  }

  // const contentIds = rawContent.map(({ contentId }) => contentId)
  const newGoal = await Goal.create(data)

  if (newGoal) {
    const goalId = newGoal._id
    await setDevelopmentPlan({
      setBy: userId || targetUser,
      user: targetUser,
      organizationId: organization,
      content: (
        await Promise.all(
          rawContent.map(async ({ contentId, note }) => {
            const content = await LearningContent.findById(contentId)
              .select({
                _id: 1,
                type: 1,
                price: 1,
                source: 1,
                udemyCourseId: 1
              })
              .lean()
            if (!content) return null
            return {
              contentId,
              goalId,
              contentType: content.type,
              price: content.price.value,
              note,
              subscriptionAvailable: await checkAvailableSubscription(content, {
                organizationId: organization
              })
              // ...(content.status && { status: content.status })
            }
          })
        )
      ).filter(item => !!item),
      mentors: mentors.map(mentor => ({
        mentorId: mentor._id,
        goalId
      })),
      goalId,
      isFirstGoal
    })
    return newGoal
  }
  return null
}

const customErrors = {
  'expected `name` to be unique': 'This name is already in use'
}

const sendTransformNotifications = async ({
  targetUser,
  userId,
  name: pathName,
  forApproval,
  organizationId,
  pathId,
  pathGoals,
  content
}) => {
  if (forApproval) {
    let superiorUserInfo

    const userTeam = await Team.findOne({ members: userId }).select({
      leader: 1
    })
    if (userTeam) {
      superiorUserInfo = await User.findById(userTeam.leader)
        .select({ _id: 1, firstName: 1, email: 1 })
        .lean()
    } else {
      superiorUserInfo = await User.findOne({ organizationId, roles: 'ADMIN' })
        .select({ _id: 1, firstName: 1, email: 1 })
        .lean()
    }

    const requestingUserInfo = await User.findById(userId)
      .select({ _id: 1, firstName: 1, lastName: 1 })
      .lean()

    const { email, firstName: name } = superiorUserInfo
    const { firstName, lastName } = requestingUserInfo

    await sendEmail(
      email,
      `${firstName} just requested a learning path`,
      learningPathRequestedNotification({
        name,
        from: {
          firstName,
          lastName
        },
        userId,
        pathName,
        appLink
      })
    )
  } else if (targetUser !== userId) {
    const targetUserInfo = await User.findOne({
      _id: targetUser,
      status: 'active'
    })
      .select({ _id: 1, firstName: 1, email: 1 })
      .lean()
    if (targetUserInfo) {
      const settingUserInfo = await User.findById(userId)
        .select({ _id: 1, firstName: 1, lastName: 1 })
        .lean()

      const firstName = settingUserInfo ? settingUserInfo.firstName : ''

      const { email } = targetUserInfo

      const data = await getLearningPathForNewLPNotification({
        pathId,
        pathName,
        pathGoals,
        content,
        appLink
      })

      if (appLink && data) {
        const statusCode = await sendEmail(
          email,
          firstName
            ? `${firstName} just assigned a Learning Path to you`
            : `You've got a new Learning Path`,
          learningPathNotification({
            ...data,
            appLink
          })
        )
        console.log(`Email sent with status code ${statusCode}`)
      }
    }
  }
}

const transform = async ({
  id,
  organization,
  userId,
  targetUser,
  forApproval = false,
  deadline,
  reviewId,
  firstPath,
  model
}) => {
  const [err, learningPath] = await to(model.findById(id))
  if (!learningPath) return null
  if (err) return null
  const allowedToTransform = // user can transform only Innential LP (organization === null) or his own organization LPs
    !learningPath.organization ||
    String(organization) === String(learningPath.organization)
  if (!allowedToTransform) return null
  const { goalTemplate: goalTemplates, name } = learningPath

  const existingGoals = await Promise.all(
    goalTemplates.map(async goalId =>
      Goal.findOne({
        user: targetUser,
        fromTemplate: goalId
      })
    )
  )

  if (existingGoals.some(goal => goal !== null)) {
    console.log('already_assigned')
    return
  }

  try {
    const firstGoal = await GoalTemplateModel.findById(goalTemplates[0])
      .select({ content: 1 })
      .lean()

    sendTransformNotifications({
      targetUser,
      userId,
      forApproval,
      name,
      organizationId: organization,
      pathGoals: goalTemplates,
      pathId: id,
      content: firstGoal.content
    })
  } catch (err) {
    sentryCaptureException(err)
  }

  if (!firstPath)
    // SET NEW PATH STARTED FOR INBOUND USER
    await User.findOneAndUpdate(
      { _id: targetUser, 'inbound.path': { $ne: null } },
      {
        $set: {
          'inbound.startedNewPath': true
        }
      }
    )

  await JourneyNextSteps.findOneAndUpdate(
    { user: targetUser },
    {
      $set: {
        awaitingXLP: false
      }
    }
  )

  if (goalTemplates && Array.isArray(goalTemplates) && goalTemplates.length) {
    const templates = new GokuArray(goalTemplates)
    return templates.asyncMap(async (goalId, i) => {
      // const existingGoal = await Goal.findOne({
      //   user: targetUser,
      //   fromTemplate: goalId
      // })
      // if (existingGoal) throw new Error(`already_assigned`)
      const goal = await GoalTemplate.findById(goalId)
      return transformTemplateToGoal({
        goalTemplate: goal._doc || goal,
        userId,
        targetUser,
        deadline,
        reviewId,
        organization,
        isFirstGoal: i === 0,
        forApproval
      })
    })
  }
  return null
}

export default new (class extends MongoDataSourceClass {
  /*
   READS
  */
  async findById(docId) {
    return this.model.findById(docId)
  }

  async getAll(query, params = {}) {
    return this.model
      .find(query)
      .limit(params.limit === undefined ? 0 : params.limit)
      .skip(params.skip === undefined ? 0 : params.skip)
  }
  async count(query) {
    return this.model.countDocuments(query)
  }

  async getAllLean(query) {
    return this.model.find(query).lean()
  }

  async getOne(query) {
    return this.model.findOne(query)
  }

  async findOwnOrganizationLearningPathById({ id, organizationId }) {
    const learningPath = await this.model.findById(id)
    if (!learningPath || learningPath.organization !== organizationId)
      return null
    return learningPath
  }

  async findOrganizationPaths({ user = {} }) {
    const { _id, organizationId, roles } = user
    if (!_id || !organizationId) return null

    if (roles.includes('ADMIN')) {
      const pathAssignments = await PathAssignee.find({
        organizationId,
        $or: [{ everyone: true }, { teams: { $ne: [] } }]
      })
        .select({ pathId: 1, everyone: 1, 'teams.teamId': 1 })
        .lean()

      return this.getAll({
        team: null,
        $or: [
          {
            _id: {
              $in: pathAssignments
                .filter(ass => ass.everyone || ass.teams.length > 1)
                .map(ass => ass.pathId)
            }
          },
          { organization: organizationId }
        ]
      })
    }
    return []
  }

  async findTeamPaths({ user = {} }) {
    const { _id, organizationId, roles } = user
    if (!_id || !organizationId) return null

    let teams = []

    if (roles.includes('ADMIN')) {
      teams = await Team.find({
        active: true,
        organizationId
      }).lean()
    } else {
      teams = await Team.find({
        leader: _id,
        active: true,
        organizationId
      }).lean()
    }

    return (
      await Promise.all(
        teams.map(async team => {
          const teamMemberIds = [...team.members, team.leader]

          const assignedToTeam = await PathAssignee.find({
            // $or: [
            //   { 'teams.teamId': team._id },
            //   { users: { $in: teamMemberIds } }
            // ],
            'teams.teamId': team._id,
            everyone: { $ne: true }
          })
            .select({ pathId: 1 })
            .lean()

          // const goals = await Goal.find({
          //   user: { $in: teamMemberIds },
          //   status: 'ACTIVE',
          //   fromTemplate: { $ne: null }
          // })
          //   .select({ fromTemplate: 1 })
          //   .lean()

          // const goalTemplates = await GoalTemplateModel.find({
          //   _id: { $in: goals.map(({ fromTemplate }) => fromTemplate) }
          // })
          //   .select({ _id: 1 })
          //   .lean()

          return {
            teamId: team._id,
            teamName: team.teamName,
            learningPaths: await this.getAll({
              $or: [
                {
                  organization: organizationId,
                  'team.teamId': team._id
                },
                {
                  _id: { $in: assignedToTeam.map(ass => ass.pathId) }
                }
                // { goalTemplate: { $in: goalTemplates } }
              ]
            })
          }
        })
      )
    ).filter(({ learningPaths }) => learningPaths.length > 0)
  }

  async findOrganizationPathsForDashboard({ user = {}, search }) {
    const { _id, organizationId } = user
    if (!_id || !organizationId) return null

    const userTeams = await Team.find({
      $or: [{ leader: _id }, { members: _id }],
      organizationId
    })
      .select({ _id: 1 })
      .lean()
    const teamIds = userTeams.map(({ _id }) => _id)

    let paths = []
    if (search) {
      paths = await learningPathSearch({
        dataSource: this,
        search,
        organizationId,
        teamIds
      })
    } else {
      paths = await this.getAll({
        organization: organizationId,
        active: true,
        team: null
        // $or: [{ active: true }, { 'team.teamId': { $in: teamIds } }]
      })
    }
    paths.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    return paths
    // if (roles.includes('ADMIN')) {
    //   return this.getAll({ organization: organizationId })
    // }
    // const userTeams = await Team.find({ leader: _id, organizationId })
    //   .select({ _id: 1 })
    //   .lean()
    // const teamIds = userTeams.map(({ _id }) => _id)

    // return this.getAll({
    //   organization: organizationId,
    //   'team.teamId': { $in: teamIds }
    // })
  }

  async findTeamsPathsForDashboard({ user = {}, search }) {
    const { _id, organizationId } = user
    if (!_id || !organizationId) return null

    const userTeams = await Team.find({
      $or: [{ leader: _id }, { members: _id }],
      organizationId
    }).lean()

    const recommendedPathIds = userTeams
      .map(({ recommendedPaths }) => recommendedPaths)
      .filter(path => !!path)
      .reduce((acc, curr) => [...acc, ...curr], [])

    const recommendedPaths = await this.getAllLean({
      $or: [
        { _id: { $in: recommendedPathIds } },
        {
          'team.teamId': { $in: userTeams.map(({ _id }) => _id) }
        }
      ],
      active: true
    })

    const teamTitle =
      userTeams.length === 1
        ? `${userTeams[0].teamName} Paths`
        : `Your Teams' Paths`

    return {
      _id: 'team-paths:list',
      key: teamTitle,
      value: recommendedPaths.map(path => {
        return {
          ...path,
          _id: path._id + '#',
          recommendedToTeams: userTeams.filter(({ recommendedPaths = [] }) =>
            recommendedPaths.map(p => String(p._id)).includes(String(path._id))
          )
        }
      })
    }
  }

  async findLearningPathsBySearch({ search, categories }) {
    const [error, value] = await to(
      learningPathSearch({ dataSource: this, search, categories })
    )
    throwIfError({ error })
    return [
      {
        _id: `list:search-paths:query:${search}:categories:${categories}`,
        key:
          value.length > 0
            ? `Found ${value.length} path${
                value.length > 1 ? 's' : ''
              } in Innential`
            : `No Innential paths match your search criteria`,
        value
      }
    ]
  }

  async findRelevantLearningPathsForUser({ userId: user }) {
    const profile = await UserProfile.findOne({ user }).lean()
    if (!profile) throw new Error(`User not onboarded`)

    const {
      neededWorkSkills: neededSkills,
      roleAtWork: title,
      organizationId
    } = profile

    const role = await RoleRequirements.findOne({
      title,
      organizationId
    }).lean()

    return this.findRelevantLearningPaths({
      neededSkills,
      organizationId,
      role
    })
  }

  async findRelevantLearningPaths({
    neededSkills,
    organizationId,
    role = null
  }) {
    try {
      const relevantPaths = await learningPathForArgs(
        this,
        neededSkills,
        role,
        organizationId
      )

      relevantPaths.sort((a, b) => b.relevanceRating - a.relevanceRating)

      return relevantPaths
    } catch (err) {
      sentryCaptureException(err)
      return null
    }
  }

  async getLearningPathsForDashboard({
    organizationId,
    _id: user,
    limit,
    categories = []
  }) {
    // const profile = await UserProfile.findOne({ user }).lean()
    // if (!profile) throw new Error(`User not onboarded`)
    // const interactionsProfile = await UserContentInteractions.findOne({
    //   user
    // }).lean()
    // if (!interactionsProfile)
    //   throw new Error(`Content interaction profile not found`)

    // const { neededWorkSkills: neededSkills, roleAtWork: title } = profile

    // const role = await RoleRequirements.findOne({
    //   title,
    //   organizationId
    // }).lean()

    const relevantPaths = await this.getAllLean({
      organization: null,
      active: true,
      hasContent: true
    })

    // const { sortMethod } = interactionsProfile

    relevantPaths.sort(
      (a, b) => new Date(b.publishedDate) - new Date(a.publishedDate)
    )

    // switch (sortMethod) {
    //   case 'DATE':
    //     relevantPaths.sort(
    //       (a, b) => new Date(b.publishedDate) - new Date(a.publishedDate)
    //     )
    //     break
    //   case 'RELEVANCE':
    //     relevantPaths.sort((a, b) => b.relevanceRating - a.relevanceRating)
    //     break
    //   default:
    //     relevantPaths.sort((a, b) => b.relevanceRating - a.relevanceRating)
    //     break
    // }

    // const targetGroups = {
    //   Trending: [],
    //   'For Leaders': [],
    //   'For Developers': [],
    //   'For HR Managers': [],
    //   'For First time leaders': [],
    //   Other: []
    // }

    const listOrder = [
      'Learning Paths you would love',
      'Digital Skills',
      'Personal Productivity',
      'Product and Innovation',
      'DevOps',
      'Sales',
      'For Leaders',
      'Marketing',
      'Human Resources',
      'People Development',
      'Teamwork',
      'Other'
    ].reverse()

    const lists = Object.entries(
      relevantPaths.reduce(
        (acc, curr) => {
          const key = curr.targetGroup || 'Other'
          const trendingPaths = [...acc['Learning Paths you would love']]
          if (curr.trending) trendingPaths.push(curr)
          return {
            ...acc,
            [key]: [...(acc[key] || []), curr],
            'Learning Paths you would love': trendingPaths
          }
        },
        { 'Learning Paths you would love': [] }
      )
    )
      .filter(([_, value]) => value.length > 0)
      .map(([key, value], i) => ({
        _id: `${key}:${i}`,
        key,
        value
      }))

    lists.sort((a, b) => listOrder.indexOf(b.key) - listOrder.indexOf(a.key))

    if (categories.length > 0) {
      return lists.filter(({ key }) => categories.includes(key))
    }
    return lists.slice(0, limit)
  }

  async getLearningPathCategories({ user, onboarding }) {
    if (!user) {
      sentryCaptureException(new Error(`Not enough arguments provided`))
      return null
    }

    const categories = []

    const relevantPaths = await this.model
      .find({
        organization: null,
        active: true,
        hasContent: true
      })
      .select({ targetGroup: 1 })
      .lean()

    const hasOrganizationPath = await this.model
      .findOne({
        organization: user.organizationId,
        active: true,
        team: null
      })
      .select({ _id: 1 })
      .lean()

    const organization = await Organization.findById(user.organizationId)
      .select({ organizationName: 1 })
      .lean()

    const teamPaths = await this.findTeamsPathsForDashboard({
      user
    })

    relevantPaths.forEach(({ targetGroup }) => {
      if (!categories.includes(targetGroup)) {
        categories.push(targetGroup)
      }
    })

    const listOrder = [
      'Learning Paths you would love',
      'Digital Skills',
      'Personal Productivity',
      'Product and Innovation',
      'DevOps',
      'Sales',
      'For Leaders',
      'Marketing',
      'Human Resources',
      'People Development',
      'Teamwork',
      'Other'
    ].reverse()

    categories.sort((a, b) => listOrder.indexOf(b) - listOrder.indexOf(a))

    const hasTeamPaths = teamPaths.value.length > 0

    if (!!hasOrganizationPath && !onboarding)
      categories.unshift(
        organization ? organization.organizationName : 'Organization Paths'
      )
    if (hasTeamPaths) categories.unshift('Team Paths')

    return categories.filter(c => !!c)
  }

  async completedPath(goal) {
    if (!goal) throw new Error(`Insufficient arguments provided`)
    const { user, fromTemplate } = goal

    if (fromTemplate) {
      const lp = await this.model
        .findOne({
          goalTemplate: fromTemplate
        })
        .select({ goalTemplate: 1, _id: 1 })
        .lean()

      if (lp) {
        const otherGoalsInPath = await Goal.countDocuments({
          user,
          status: 'ACTIVE',
          fromTemplate: { $in: lp.goalTemplate }
        })
        if (otherGoalsInPath === 0) return lp._id
      }
    }
    return null
  }

  async getAssignedPathsForUser({ user }) {
    const pathGoals = await Goal.find({
      user,
      fromTemplate: { $ne: null },
      status: 'ACTIVE'
    })
      .select({ fromTemplate: 1, setBy: 1 })
      .lean()

    const assignedBy = await Promise.all(
      pathGoals
        .filter(({ setBy }) => String(setBy) !== String(user))
        .map(async ({ setBy }) => {
          if (!setBy) return { _id: null, firstName: 'Innential', lastName: '' }
          else
            return User.findById(setBy)
              .select({ _id: 1, firstName: 1, lastName: 1 })
              .lean()
        })
    )

    const uniqueAssigners = new GokuArray(assignedBy)
      .unique(({ _id }) => String(_id))
      .toArray()
      .sort((a, b) => !!b._id - !!a._id) // PRIORITIZE REAL USERS

    const key =
      uniqueAssigners.length === 0
        ? 'Innential'
        : `${uniqueAssigners[0].firstName} ${uniqueAssigners[0].lastName}`

    if (pathGoals.length === 0) return null

    const learningPaths = await this.model
      .find({
        goalTemplate: { $in: pathGoals.map(({ fromTemplate }) => fromTemplate) }
      })
      .lean()

    if (learningPaths.length === 0) return null

    return {
      _id: new Types.ObjectId(),
      key,
      value: learningPaths.slice(0, 3)
    }
  }

  /*
    WRITES
  */
  async createOne(data) {
    if (!data) return null
    const { id, goalTemplate: goalTemplates, ...doc } = data
    let goals = []

    if (goalTemplates && Array.isArray(goalTemplates) && goalTemplates.length) {
      const existingGoals = goalTemplates
        .filter(goal => !!goal.id)
        .map(g => g.id)
      const newGoals = goalTemplates.filter(goal => !goal.id)

      const [err, result] = await to(GoalTemplate.createMany(newGoals))
      throwIfError({ error: err })

      const createdGoals = result._doc || result
      goals = [...existingGoals, ...createdGoals]
    }

    const [errTemplate, template] = await to(
      this.model.create({
        ...doc,
        goalTemplate: [...goals]
      })
    )

    throwIfError({ error: errTemplate, customErrors })
    return template
  }

  async updateOne({ filter, update, updateExisting }) {
    // @MARIUSZ
    const { _id: id } = filter
    if (!id) return null
    const { goalTemplate: goalTemplates = [], ...doc } = update

    const currentGoals = await this.model
      .findById(id)
      .select({ goalTemplate: 1, _id: 0 })

    const arr = new GokuArray(
      currentGoals.goalTemplate.map(templateId => String(templateId))
    )

    const existingGoalsFromPath = await Goal.find({
      fromTemplate: { $in: arr },
      status: 'ACTIVE'
    })
      .select({ _id: 1, user: 1, organizationId: 1 })
      .lean()

    const usersAffected = existingGoalsFromPath.reduce(
      (acc, { user, organizationId }) => {
        if (
          !acc.some(({ targetUser }) => String(user) === String(targetUser))
        ) {
          return [...acc, { targetUser: user, organization: organizationId }]
        }
        return acc
      },
      []
    )

    let newGoals = goalTemplates.filter(goal => !goal.id)
    if (newGoals && Array.isArray(newGoals) && newGoals.length) {
      const createdGoals = await Promise.all(
        newGoals.map(async newGoal => {
          const created = await GoalTemplateModel.create({
            ...newGoal
          })

          if (updateExisting) {
            await Promise.all(
              usersAffected.map(async ({ targetUser, organization }) => {
                try {
                  await transformTemplateToGoal({
                    goalTemplate: created._doc || created,
                    organization,
                    targetUser,
                    userId: targetUser
                  })
                } catch (err) {
                  sentryCaptureException(
                    `Failed to create goal for ${targetUser}; Reason: ${err.message}`
                  )
                }
              })
            )
          }

          return {
            ...newGoal,
            id: created._id
          }
        })
      )
      // const [err, result] = await to(GoalTemplate.createMany(newGoals))
      // throwIfError({ error: err })

      // const createdGoals = result._doc || result

      // if (updateExisting) {
      //   // CREATE NEW GOALS FOR USERS
      //   await Promise.all(
      //     createdGoals.map(goalTemplate =>
      //       Promise.all(
      //         usersAffected.map(async ({ targetUser, organization }) => {
      //           try {
      //             await transformTemplateToGoal({
      //               goalTemplate: goalTemplate._doc || goalTemplate,
      //               organization,
      //               targetUser,
      //               userId: targetUser
      //             })
      //           } catch (err) {
      //             sentryCaptureException(
      //               `Failed to create goal for ${targetUser}; Reason: ${err.message}`
      //             )
      //           }
      //         })
      //       )
      //     )
      //   )
      // }

      newGoals = createdGoals
      // .map(goal => goal._id)
    }

    const existingGoals = goalTemplates.filter(goal => !!goal.id)
    // .map(g => g.id)

    const { additional, common, missing } = arr.diff(existingGoals)

    // remove missing goals (we'll handle deletion of goal templates separately but for now
    // this is the easier approach)
    await Promise.all(
      missing.map(async ({ _id: missingId }) => {
        try {
          await GoalTemplateModel.findByIdAndRemove(missingId)

          if (updateExisting) {
            // GOALS TO DELETE
            const goalIds = (
              await Goal.find({ fromTemplate: missingId, status: 'ACTIVE' })
                .select({ _id: 1 })
                .lean()
            ).map(({ _id }) => _id)

            // USERS WHO HAVE ALREADY BEGUN WORKING ON THE GOALS
            const exemptUsers = (
              await DevelopmentPlan.find({
                content: {
                  $elemMatch: {
                    goalId: { $in: goalIds },
                    status: { $in: ['IN PROGRESS', 'COMPLETED'] }
                  }
                }
              })
                .select({ user: 1 })
                .lean()
            ).map(({ user }) => user)

            // FOR EVERYBODY ELSE, REMOVE THE GOALS
            await Goal.deleteMany({
              _id: { $in: goalIds },
              user: { $nin: exemptUsers }
            })
          }
        } catch (err) {
          sentryCaptureException(
            `Failed to delete goals for template: ${missingId}: ${err.message}`
          )
        }
      })
    )

    // for additional and common goals it might be tha the content array has changed
    // so the goal template content must be updated accordingly

    await series(
      [...additional, ...common].map(({ id: goalId }) => {
        return async callback => {
          try {
            const currentGoalTemplate = await GoalTemplate.findById(goalId)
            if (!currentGoalTemplate) {
              throw new Error(`Cannot find goalId: ${goalId}`)
            }
            const currentContent = currentGoalTemplate.content.map(
              ({ contentId, note }) => ({ contentId: String(contentId), note })
            )

            // diff function that compares content ids
            currentContent.diff = (arr = []) => {
              const next = arr
              const additional = next.filter(
                item =>
                  !currentContent.some(
                    item2 => item.contentId === item2.contentId
                  )
              )
              const missing = currentContent.filter(
                item => !next.some(item2 => item.contentId === item2.contentId)
              )
              const common = next.filter(item =>
                currentContent.some(item2 => item.contentId === item2.contentId)
              )
              return {
                additional: [...additional],
                missing: [...missing],
                common: [...new Set(common)]
              }
            }

            const inputGoal = goalTemplates.find(goal => goal.id === goalId)
            if (!inputGoal) {
              throw new Error(`Cannot find input goal: ${goalId}`)
            }

            const { additional, common, missing } = currentContent.diff(
              inputGoal.content
            )

            const content = [...additional, ...common]
            const {
              measures,
              relatedSkills,
              // mentors,
              goalName,
              goalType
            } = inputGoal
            await GoalTemplate.updateOne({
              filter: { _id: goalId },
              update: {
                content,
                ...(measures && { measures }),
                ...(relatedSkills && { relatedSkills }),
                // ...(mentors && { mentors }),
                ...(goalName && { goalName }),
                ...(goalType && { goalType })
              }
            })
            if (updateExisting) {
              // UPDATE GOAL INFO
              await Goal.updateMany(
                { fromTemplate: goalId },
                {
                  $set: {
                    // TODO: UPDATING MEASURES
                    // ...(measures && {
                    //   measures: measures.map(m => ({ measureName: m }))
                    // }),
                    ...(relatedSkills && { relatedSkills }),
                    // ...(mentors && { mentors }),
                    ...(goalName && { goalName })
                  }
                }
              )
              // UPDATE DEV PLANS FOR AFFECTED USERS
              console.time('Update plans')

              await usersAffected.reduce(
                async (
                  arr,
                  { targetUser: user, organization: organizationId }
                ) => {
                  await arr
                  const checkStatus = (
                    organization,
                    contentSource,
                    content
                  ) => {
                    return (
                      content.status ||
                      ((organization &&
                        organization.fulfillment &&
                        content.price > 0 &&
                        !content.subscriptionAvailable) ||
                      (contentSource.accountRequired &&
                        organization.fulfillment)
                        ? 'AWAITING FULFILLMENT'
                        : 'NOT STARTED')
                    )
                  }
                  try {
                    const devPlan = await DevelopmentPlan.findOne({
                      user
                    })
                      .select({ content: 1 })
                      .lean()

                    if (!devPlan) {
                      throw new Error(`Development plan not found`)
                    }

                    const userGoal = await Goal.findOne({
                      user,
                      fromTemplate: goalId
                    })
                      .select({ _id: 1 })
                      .lean()

                    if (!userGoal) {
                      throw new Error(`Goal not found`)
                    }

                    const userData = await User.findById(user)
                      .select({ roles: 1 })
                      .lean()

                    if (!userData) {
                      throw new Error(`User not found`)
                    }

                    const organization = await Organization.findById(
                      organizationId
                    )
                      .select({ approvals: 1, fulfillment: 1 })
                      .lean()

                    const { content: currentContent } = devPlan

                    // REMOVE MISSING CONTENT THAT IS NOT STARTED
                    const filteredContent = currentContent.filter(
                      ({ contentId, status, goalId }) =>
                        ['IN PROGRESS', 'COMPLETED'].includes(status) ||
                        String(goalId) !== String(userGoal._id) ||
                        !missing
                          .map(({ contentId }) => String(contentId))
                          .includes(String(contentId))
                    )

                    // UPDATE EXISTING CONTENT TO MATCH THE LATEST ONE IN LP (NOTES ETC.)
                    const updatedContent = filteredContent.map(item => {
                      const updatedInGoal = content.find(
                        ({ contentId }) =>
                          String(contentId) === String(item.contentId)
                      )

                      if (
                        updatedInGoal &&
                        String(item.goalId) === String(userGoal._id)
                      ) {
                        return {
                          ...item,
                          ...updatedInGoal
                        }
                      }
                      return item
                    })

                    const existingIds = updatedContent.map(({ contentId }) =>
                      String(contentId)
                    )

                    // ADD ADDITIONAL ITEMS TO DEV PLAN
                    const contentToAdd = (
                      await Promise.all(
                        additional
                          .filter(
                            ({ contentId }) =>
                              !existingIds.includes(String(contentId))
                          )
                          .map(async content => {
                            const item = await LearningContent.findById(
                              content.contentId
                            )
                              .select({
                                _id: 1,
                                type: 1,
                                price: 1,
                                source: 1
                              })
                              .lean()

                            if (!item) return null

                            const approved =
                              !organization ||
                              !organization.approvals ||
                              userData.roles.includes('ADMIN') ||
                              item.price.value === 0

                            const contentSource = await ContentSources.findById(
                              item.source
                            )
                            const status = checkStatus(
                              organization,
                              contentSource,
                              content
                            )
                            return {
                              contentId: content.contentId,
                              goalId: userGoal._id,
                              contentType: item.type,
                              price: item.price.value,
                              note: content.note,
                              approved,
                              status
                              // ...(content.status && { status: content.status })
                            }
                          })
                      )
                    ).filter(item => !!item)

                    await DevelopmentPlan.findOneAndUpdate(
                      { user },
                      {
                        $set: {
                          content: [...contentToAdd, ...updatedContent],
                          updatedAt: new Date()
                        }
                      },
                      { new: true }
                    )
                  } catch (err) {
                    await new Promise(async (resolve, reject) => {
                      await setTimeout(() => resolve(true), 200)
                    })
                    sentryCaptureException(
                      `Failed to update development plan for user:${user}: ${err.message}`
                    )
                    return null
                  }
                  await new Promise(async (resolve, reject) => {
                    await setTimeout(() => resolve(true), 200)
                  })
                  return [await arr]
                }
              )

              callback(null)
              console.timeEnd('Update plans')
            }
          } catch (err) {
            callback(err)
          }
        }
      }),
      err => {
        if (err) {
          throw new Error(`Error when updating goals: ${err.message}`)
        }
      }
    )

    // await Promise.all(
    //   [...additional, ...common].map(async (goalId) => {
    //   })
    // )

    const goals = [...common, ...additional, ...newGoals]

    goals.sort((a, b) => {
      return a.order - b.order
    })
    // console.log(goals)
    return this.model.findOneAndUpdate(
      filter,
      {
        ...doc,
        goalTemplate: goals.map(goal => goal.id)
      },
      {
        new: true
      }
    )
  }

  async changePublishedStatus({ pathIds, value }) {
    await this.model.updateMany(
      { _id: { $in: pathIds } },
      {
        $set: {
          active: value
        }
      }
    )
    return this.getAll({ _id: { $in: pathIds } })
  }

  async remove(params) {
    const { id, organization } = params || {}
    const conditions = {
      _id: id,
      ...(organization && { organization })
    }
    const [err, deleted] = await to(
      this.model.findOneAndRemove({ ...conditions })
    )
    throwIfError({ error: err })
    const { goalTemplate = [] } = deleted || {}
    if (Array.isArray(goalTemplate) && goalTemplate.length) {
      // remove associated goal templates
      const goalIds = goalTemplate.map(goal => goal._id)
      await GoalTemplateModel.deleteMany({ _id: { $in: goalIds } })
    }
    await PathAssignee.deleteMany({ pathId: id })
    await Comment.deleteMany({ pathId: id })
    const lp = deleted._doc || deleted
    return {
      ...lp,
      goalTemplate: []
    }
  }

  async transform(args) {
    return transform({
      ...args,
      model: this.model
    })
  }
})(LearningPathTemplate)
