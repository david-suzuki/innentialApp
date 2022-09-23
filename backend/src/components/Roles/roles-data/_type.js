import {
  User,
  Categories,
  Skills,
  Organization,
  RoleRequirements,
  RoleGroup
} from '~/models'

export const types = `
  type RoleRequirementsSkills {
    fullSkill: Skill
    level: Int
    value: [String]
    _id: ID
  }

  type RoleRequirements {
    _id: ID!
    title: String
    userId: String
    organization: Organization
    description: String
    nextSteps: [RoleRequirements]
    createdAt: String
    coreSkills: [RoleRequirementsSkills]
    secondarySkills: [RoleRequirementsSkills]
    otherRequirements: [String]
    suggestion: Boolean
    suggestedBy: String
    grouped: Boolean
  }

  type RoleGroup {
    _id: String!
    groupName: String!
    relatedRoles: [RoleRequirements]
  }
`

export const typeResolvers = {
  RoleRequirements: {
    suggestedBy: async ({ userId }) => {
      const user = await User.findById(userId)
        .select({ _id: 1, firstName: 1, lastName: 1 })
        .lean()
      if (user) {
        return `${user.firstName} ${user.lastName}`
      }
      return 'User deleted'
    },
    coreSkills: async ({ coreSkills }) => {
      const mappedSkills = await Promise.all(
        coreSkills.map(async rs => {
          const skill = await Skills.findById(rs.skillId)
          if (skill) {
            const category = await Categories.findById(skill.category)
            const categoryName = category ? category.name : 'Uncategorised'

            return {
              _id: rs._id,
              level: rs.level,
              fullSkill: skill,
              value: [categoryName, String(skill._id)]
            }
          }
          return {
            _id: rs._id,
            level: rs.level,
            fullSkill: {},
            value: ['', null]
          }
        })
      )
      return mappedSkills
    },
    secondarySkills: async ({ secondarySkills }) => {
      const mappedSkills = await Promise.all(
        secondarySkills.map(async rs => {
          const skill = await Skills.findById(rs.skillId)
          if (skill) {
            const category = await Categories.findById(skill.category)
            const categoryName = category ? category.name : 'Uncategorised'

            return {
              _id: rs._id,
              level: rs.level,
              fullSkill: skill,
              value: [categoryName, String(skill._id)]
            }
          }
          return {
            _id: rs._id,
            level: rs.level,
            fullSkill: {},
            value: ['', null]
          }
        })
      )
      return mappedSkills
    },
    organization: async ({ organizationId }) => {
      if (organizationId) {
        const organization = await Organization.findById(organizationId)
        return organization
      }
      return null
    },
    nextSteps: async ({ nextSteps = [] }) => {
      const nextRoles = await RoleRequirements.find({ _id: { $in: nextSteps } })
        .select({ _id: 1, title: 1 })
        .lean()
      return nextRoles
    },
    grouped: async ({ _id }) => {
      const roleGroup = await RoleGroup.findOne({ relatedRoles: _id })
        .select({ _id: 1 })
        .lean()
      return !!roleGroup
    }
  },
  RoleGroup: {
    relatedRoles: async ({ relatedRoles }) => {
      const roles = await RoleRequirements.find({ _id: { $in: relatedRoles } })
      return roles
    }
  }
}
