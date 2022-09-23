export default `
  input CreateRoleSkillInput {
    skillId: String!
    level: Int!
    slug: String!
  }

  input CreateRoleGroupInput {
    groupName: String!
    _id: ID
    relatedRoles: [CreateRoleInput]
  }

  input CreateRoleInput {
    title: String!
    _id: String
    organizationId: String
    description: String
    nextSteps: [ID]
    coreSkills: [CreateRoleSkillInput]
    secondarySkills: [CreateRoleSkillInput]
    otherRequirements: [String]
  }
`
