import { Skills, UserProfile, User, Categories } from '~/models'
import { Types } from 'mongoose'
import { getDownloadLink } from '~/utils'

export const types = `
  type TeamLearningContent {
    _id: ID!
    title: String!
    pdfSource: String!
    author: String
    relatedPerformanceArea: String!
    createdAt: DateTime
  }

  type UserEvaluateInfo {
    _id: ID!
    userId: ID!
    fullName: String
    completed: Boolean
    shouldEvaluate: Boolean
  }

  type TeamEvaluateInfo {
    _id: ID!
    teamId: ID!
    teamName: String!
    usersToEvaluate: [UserEvaluateInfo]
    evaluatedUsers: [String]
    allCompleted: Boolean
    shouldSetRequired: Boolean
  }

  type TeamSkillGapItem {
    _id: ID!
    teamName: String!
    skills: [TeamEvaluatedSkill!]
  }

  type EvaluateInfoType {
    _id: ID!
    teamInformations: [TeamEvaluateInfo]
  }

  type UserEvaluation {
    _id: ID!
    userId: ID!
    skills: [EvaluatedSkills]
  }

  type RequiredEvaluationSkills {
    category: String,
    level: Int,
    name: String,
    slug: String, 
    skillId: String,
    _id: String
  }
  type Evaluation {
    _id: ID!
    teamId: ID!
    evaluatedBy: ID!
    memberEvaluations: [UserEvaluation]
    leadersSkills: [RequiredEvaluationSkills]
    requiredSkills: [RequiredEvaluationSkills]
  }

  type TeamEvaluation {
    _id: ID!
    evaluation: Evaluation
    unEvaluatedUsers: [UserProfile]
  }

  type TeamEvaluatedSkill {
    _id: ID!
    name: String
    skillId: String
    skillAvailable: Float
    skillNeeded: Float
    usersForTooltip: [TeamEvaluatedSkillUser]
    users: Int
    usersInOrganization: Int
  }

  type SkillDetailsData {
    _id: ID!
    name: String
    userId: String
    skillId: String
    skillAvailable: Float
    skillNeeded: Float
    evaluatedLevel: Float
  }
  
  type TeamEvaluatedSkillUser {
    _id: ID!
    userId: String
    name: String
    level: Float
  }
  
  type OrganizationEvaluation {
    _id: ID!
    evaluations: [Evaluation]
    unEvaluatedUsers: [UserProfile]
    allProfiles: [UserProfile]
  }

  type TeamPathStatistics {
    _id: ID!
    pathId: ID
    pathName: String
    assignedTo: [AssignedToUser!]
  }

  type AssignedToUser {
    _id: ID!
    userId: ID!
    firstName: String
    lastName: String
    status: String
    imageLink: String
  }
`

export const typeResolvers = {
  //
  OrganizationEvaluation: {
    _id: ({ evaluations }) => {
      return `++Org`
    }
  },
  Evaluation: {
    requiredSkills: async ({ _id, requiredSkills }) => {
      const reqSkills = await Promise.all(
        requiredSkills.map(async (reqSkill, idx) => {
          const skill = await Skills.findById(reqSkill.skillId)
          if (skill === null) {
            console.log(
              'Skill is null, fix this by re-onboarding the users! (Migration issue)',
              reqSkill
            )
            return
          }
          const { category, name, slug } = skill
          return {
            _id: `${_id}--${idx}`,
            category,
            name,
            slug,
            level: reqSkill.level,
            skillId: skill._id
          }
        })
      )

      return reqSkills
    },
    leadersSkills: async ({ _id, evaluatedBy }) => {
      const leadersProfile = await UserProfile.findOne({ user: evaluatedBy })
      if (!leadersProfile) throw new Error('No active leader')

      const normalisedSkills = await Promise.all(
        leadersProfile.selectedWorkSkills.map(async (sk, idx) => {
          const normalisedSkill = await Skills.findById(sk._id)
          if (normalisedSkill) {
            const { name, category } = normalisedSkill
            const normalisedCategory = await Categories.findById(category)
            if (normalisedCategory) {
              return {
                _id: `${_id}ls${idx}`,
                skillId: sk._id,
                level: sk.level,
                category: normalisedCategory.name,
                name,
                slug: sk.slug
              }
            } else
              return {
                _id: `${_id}ls${idx}`,
                skillId: sk._id,
                level: sk.level,
                category: 'Uncategorised',
                name,
                slug: sk.slug
              }
          }
        })
      )

      return normalisedSkills
    }
  },
  TeamEvaluateInfo: {
    usersToEvaluate: async ({ usersToEvaluate, teamId, ...rest }) => {
      const finalUsers = await Promise.all(
        usersToEvaluate.map(async ({ userId, shouldEvaluate, completed }) => {
          const us = await User.findById(userId)
          return {
            _id: `${teamId}_${userId}`,
            fullName: `${us.firstName} ${us.lastName}`,
            userId,
            shouldEvaluate,
            completed
          }
        })
      )
      return finalUsers
    }
  },
  TeamPathStatistics: {
    _id: () => new Types.ObjectId(),
    assignedTo: ({ assignedTo = [] }) => {
      return Promise.all(
        assignedTo.map(async user => ({
          ...user,
          _id: new Types.ObjectId(),
          userId: user._id,
          imageLink: await getDownloadLink({
            key: 'users/profileImgs',
            expires: 500 * 60,
            _id: user._id
          })
        }))
      )
    }
  }
}
