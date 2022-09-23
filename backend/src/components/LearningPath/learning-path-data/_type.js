import {
  Goal,
  Review,
  User,
  UserProfile,
  Team,
  Organization,
  Skills,
  LearningContent,
  // LearningPathTemplate,
  // GoalTemplate,
  // DevelopmentPlan,
  PathAssignee
} from '../../../models'
import {
  getDownloadLink
  // getDownloadBannerLink,
  // getDownloadAuthorImgLink
} from '~/utils'
import { Types } from 'mongoose'

export const types = `
  type GoalTemplate {
    _id: ID!
    goalName: String!
    goalType: String
    measures: [String]
    relatedSkills: [Skill!]
    content: [GoalTemplateContent!]
    mentors: [RelevantUser!]
    tasks: [Task!]
    createdAt: DateTime
    updatedAt: DateTime
  }

  type GoalTemplateContent {
    _id: ID!
    content: LearningContent!
    note: String
    order: Int
  }

  type LearningPath {
    _id: ID!
    active: Boolean
    name: String
    description: String
    abstract: String
    duration: String
    targetGroup: String
    prerequisites: String
    publishedDate: DateTime
    category: String
    imageLink: URL
    setBy: User
    internalNotes: String
    author: String
    authorDescription: String
    authorPosition: String
    authorImageLink: URL
    authorCompanyLogoImageLink: URL
    trending: Boolean
    organization: Organization
    team: Team
    paid: Boolean
    goalTemplate: [GoalTemplate!]
    roles: [RoleRequirements!]
    skills: [Skill!]
    createdAt: DateTime
    updatedAt: DateTime
    recommendedToTeams: [Team]
    userProgress: UserProgress
    startConditions: [String]
    autoAssign: Boolean
    assignee: Assignee
    curatedBy: LearningPathAssigner
  }
  type PathTemplateContent {
    _id : ID!
    LearningPaths : [LearningPath]
    LearningPathsStatistics:[LearningPathStatistics]
  }

  type TeamLearningPaths {
    _id: ID!
    teamId: ID!
    teamName: String!
    learningPaths: [LearningPath!]
  }

  type Assignee {
    _id: ID!
    everyone: Boolean
    autoassign: Boolean
    teams: [AssigneeTeam]
    users: [User]
  }

  type AssigneeTeam {
    _id: ID!
    team: Team
    autoassign: Boolean
    users: [User]
  }

  type UserProgress {
    _id: ID!
    status: String
    completion: Int
  }

  type LearningPathList {
    _id: ID!
    key: String!
    value: [LearningPath!]
  }
`

export const typeResolvers = {
  PathTemplateContent: {
    _id: () => Types.ObjectId()
  },
  LearningPath: {
    goalTemplate: async (
      { goalTemplate: goalsIds, _id },
      _,
      { dataSources }
    ) => {
      if (!goalsIds) return null
      return (await dataSources.GoalTemplate.getAllResolvers(goalsIds)).filter(
        value => {
          if (!value) {
            throw new Error(`Goals don't exist : ${goalsIds} at ${_id} `)
          }
          return !!value
        }
      )
    },
    organization: ({ organization }) => {
      return Organization.findById(organization).lean()
    },
    imageLink: ({ _id }) => {
      const pathId = String(_id).replace(/[#]/g, '') // REMOVE EXTRA CHARACTERS USED FOR APOLLO ID DUPLICATION FIX
      return getDownloadLink({ _id: pathId, key: 'learning-paths/banners' })
    },
    authorImageLink: ({ _id }) => {
      return getDownloadLink({ _id, key: 'learning-paths/authors' })
    },
    authorCompanyLogoImageLink: ({ _id }) => {
      return getDownloadLink({ _id, key: 'learning-paths/company-logos' })
    },
    team: async ({ team }) => {
      if (team && team.teamId) {
        const foundTeam = await Team.findById(team.teamId)
        return (
          foundTeam || {
            _id: team.teamId,
            teamName: `${team.teamName} (deleted)`
          }
        )
      }
      return null
    },
    skills: ({ skills }) => {
      return Skills.find({ _id: { $in: skills } }).lean()
    },
    userProgress: async ({ goalTemplate }, args, context) => {
      const userId = context.user._id

      let goals = await Promise.all(
        goalTemplate.map(async goalTemplate => {
          const goals = await Goal.find({
            fromTemplate: goalTemplate,
            user: userId
          })
            .select({ status: 1 })
            .lean()

          if (goals.length === 0) {
            return []
          }

          return goals.map(goal => goal.status)
        })
      )

      goals = goals.reduce((acc, curr) => [...acc, ...curr], [])

      let status = ''

      // (1) if no goals exist for the user, then the path hasn't yet been started
      if (goals.length === 0) {
        status = 'NOT STARTED'

        // (2) if all goals are in the past, then the path has been completed
      } else if (goals.every(g => g === 'PAST')) {
        status = 'COMPLETED'

        // (3)if one of the goals is past or active then the path is in progress
      } else if (goals.some(g => g === 'PAST' || g === 'ACTIVE')) {
        status = 'IN PROGRESS'
      }

      // let content = await Promise.all(
      //   goalTemplate.map(async goalTemplateId => {
      //     const content = await getContent({ goalTemplateId, userId })
      //     return content.reduce((acc, curr) => [...acc, ...curr], [])
      //   })
      // )

      // content = content.reduce((acc, curr) => [...acc, ...curr], [])

      // const completion =
      //   content.length === 0
      //     ? 0
      //     : content.filter(c => c.status === 'COMPLETED').length /
      //       content.length

      return {
        status
        // completion: Math.round(completion * 100)
      }
    },
    assignee: async (
      { _id: pathId, goalTemplate = [] },
      _,
      { user: { organizationId } }
    ) => {
      const existingAssignee = await PathAssignee.findOne({
        pathId,
        organizationId
      }).lean()

      if (existingAssignee) {
        return {
          ...existingAssignee,
          goalTemplate
        }
      }

      return null
    },
    curatedBy: async ({ setByUser, organization: organizationId }) => {
      const user = await User.findById(setByUser)
        .select({ _id: 1, firstName: 1, lastName: 1 })
        .lean()

      const organization = await Organization.findById(organizationId)
        .select({ organizationName: 1 })
        .lean()

      return {
        _id: new Types.ObjectId(),
        userId: user ? user._id : null,
        name: user
          ? `${user.firstName} ${user.lastName}`
          : organization
          ? organization.organizationName
          : 'Innential'
      }
    }
  },
  Assignee: {
    users: async ({ users }) =>
      User.find({ _id: { $in: users } })
        .select({ _id: 1, firstName: 1, lastName: 1, email: 1 })
        .lean(),
    teams: async (
      { teams, goalTemplate },
      _,
      { user: { _id: userId, roles } }
    ) => {
      let filteredTeams = teams

      if (!roles.includes('ADMIN')) {
        const userTeams = await Team.find({ leader: userId, active: true })
          .select({ _id: 1 })
          .lean()

        filteredTeams = teams.filter(({ teamId }) =>
          userTeams.some(team => String(team._id) === String(teamId))
        )
      }

      return (
        await Promise.all(
          filteredTeams.map(async ({ teamId, autoassign }) => {
            const team = await Team.findById(teamId)
              .select({ _id: 1, teamName: 1, leader: 1, members: 1 })
              .lean()

            if (!team) return null

            return {
              _id: new Types.ObjectId(),
              team,
              autoassign,
              users: (
                await Goal.find({
                  fromTemplate: { $in: goalTemplate },
                  status: 'ACTIVE',
                  user: { $in: [team.leader, ...team.members] }
                })
                  .select({ user: 1 })
                  .lean()
              ).map(({ user }) => user)
            }
          })
        )
      ).filter(i => !!i)
    }
  },
  AssigneeTeam: {
    // _id: ({ _id }) => _id || new Types.ObjectId(),
    users: async ({ users }) => {
      return User.find({
        _id: {
          $in: users
        }
      }).select({ _id: 1, firstName: 1, lastName: 1, email: 1 })
    }
  },
  TeamLearningPaths: {
    _id: () => new Types.ObjectId()
  },
  UserProgress: {
    _id: () => new Types.ObjectId()
  },
  GoalTemplate: {
    relatedSkills: ({ relatedSkills: skillsIds }, _, { dataSources }) => {
      return dataSources.Skills.getAllResolvers(skillsIds)
    },
    content: async ({ content }) => {
      return (
        await Promise.all(
          content.map(async ({ _id, contentId, note, order }) => {
            const item = await LearningContent.findById(contentId).lean()
            if (!item) return null
            return {
              _id,
              content: item,
              note,
              order
            }
          })
        )
      ).filter(item => !!item) // null check
      // return dataSources.LearningContent.getAllResolvers(contentIds)
    },
    mentors: async ({ mentors: mentorsIds }, _, { dataSources }) => {
      const mentors = await dataSources.User.getAllResolvers(mentorsIds)
      const denormalisedMentors = await Promise.all(
        mentors.map(async ({ _id: user, goalId, active }) => {
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

          const status = active ? 'ACTIVE' : 'INACTIVE'

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
  }
}
