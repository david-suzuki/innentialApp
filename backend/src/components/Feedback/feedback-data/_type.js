import Mongoose from 'mongoose'
import { Organization, Team, Skills, User } from '~/models'
import { getDownloadLink, appUrls } from '~/utils'

const appLink = `${appUrls['user']}`

export const types = `
  type RawFeedback {
    _id: ID
    skillId: ID
    feedback: [Feedback]
  }

  type Feedback {
    _id: ID
    evaluatedBy: Evaluated
    evaluatedAt: String
    evaluatedLevel: Float
  }

  type TextFeedback {
    _id: ID!
    evaluatedBy: Evaluated
    evaluatedAt: DateTime
    evaluated: Evaluated
    content: String
    skills: [FeedbackSkill]
  }

  type Evaluated {
    _id: ID
    teamId: ID
    firstName: String
    lastName: String
    imageLink: URL
    email: String
    isPlatformUser: Boolean
  }

  type PublicLink {
    _id: ID!
    link: URL
    active: Boolean
  }

  type EvaluateInfo {
    _id: ID!
    userName: String!
    corporate: Boolean
    skills: [Skill!]
  }

  type FeedbackSkill {
    _id: ID!
    skillId: ID
    name: String
    level: Int
  }

  type FeedbackRequest {
    _id: ID!
    requestedFrom: Employees
    requestedTeam: Team
    requestedBy: Employees
    feedbackShareKey: String
    requestedAt: DateTime
  }

  type EvaluatedSkills {
    _id: ID
    skillId: ID
    evaluatedLevel: Float
  }
`

export const typeResolvers = {
  Evaluated: {
    imageLink: async ({ _id }) => {
      const link = await getDownloadLink({
        key: 'users/profileImgs',
        expires: 500 * 60,
        _id: _id
      })
      return link
    },
    isPlatformUser: async ({ _id }) => {
      const user = await User.findById(_id)
        .select({ _id: 1 })
        .lean()

      return !!user
    }
  },
  TextFeedback: {
    evaluatedBy: async (
      { evaluatedBy, external },
      _,
      { user: { organizationId } }
    ) => {
      const organization = await Organization.findById(organizationId)
        .select({ feedbackVisible: 1 })
        .lean()
      if (organization && organization.feedbackVisible) {
        return external || User.findById(evaluatedBy)
      }
      return null
    },
    evaluated: async ({ evaluated }) => {
      if (evaluated) {
        const user = await User.findById(evaluated)
        if (user) return user
        // TEAM FEEDBACK?
        const team = await Team.findById(evaluated)
          .select({ _id: 1, teamName: 1 })
          .lean()

        if (team) {
          return {
            _id: null,
            teamId: team._id,
            firstName: team.teamName,
            lastName: ''
          }
        }
      }
      return null
    },
    skills: async ({ skillFeedback = [] }) => {
      const skills = await Promise.all(
        skillFeedback.map(async ({ _id, skillId, level }) => {
          const skill = await Skills.findOne({ _id: skillId })
            .select({ name: 1 })
            .lean()

          if (!skill) return null

          return {
            _id,
            skillId,
            level,
            name: skill.name
          }
        })
      )
      return skills.filter(item => !!item)
    }
  },
  FeedbackRequest: {
    requestedFrom: async ({ userId }) => {
      return User.findById(userId)
    },
    requestedTeam: async ({ requestedBy: teamId }) => {
      return Team.findById(teamId)
    },
    requestedBy: async ({ requestedBy }) => {
      if (!requestedBy) return null
      return User.findById(requestedBy)
    },
    feedbackShareKey: async ({ requestedBy }) => {
      if (!requestedBy) return ''
      const user = await User.findById(requestedBy)
        .select({ feedbackShareKey: 1 })
        .lean()
      if (user) {
        return user.feedbackShareKey
      }
      const team = await Team.findById(requestedBy)
        .select({ feedbackShareKey: 1 })
        .lean()
      if (team) {
        return team.feedbackShareKey
      }
      return ''
    }
  },
  Feedback: {
    evaluatedBy: async ({ evaluatedBy }) => {
      const user = await User.findById(evaluatedBy)
      if (user) {
        const organization = await Organization.findById(user.organizationId)
          .select({ feedbackVisible: 1 })
          .lean()
        if (organization && organization.feedbackVisible) {
          return user
        }
      }
      return null
    }
  },
  PublicLink: {
    _id: ({ _id }) => _id || new Mongoose.Types.ObjectId(),
    link: ({ token }) =>
      token ? `${appLink}/public-feedback?token=${token}` : null
  }
}
