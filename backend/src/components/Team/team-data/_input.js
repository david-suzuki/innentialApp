export default `
  input MemberInput {
    email: String!
    teamId: ID!
    invite: Boolean
  }
  input TeamContentInput {
    title: String!
    author: String
    pdfSource: String!
    relatedPerformanceArea: String!
  }

  input SkillRelevancyInput {
    skillId: String!
    level: Int!
  }

  input TeamRelevancyInput {
    teamId: String!
    skills: [SkillRelevancyInput]
  }
`
