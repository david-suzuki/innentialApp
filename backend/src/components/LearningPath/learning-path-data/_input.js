export default `
  input GoalTemplateInput {
    id: ID
    order: Int
    goalName: String
    goalType: String
    measures: [String!]
    relatedSkills: [ID!]
    content: [LearningPathContentInput!]
    mentors: [ID!]
    tasks: [ID!]
  }

  input LearningPathTeamInput {
    teamId: ID!
    teamName: String!
  }

  input LearningPathContentInput {
    contentId: ID!
    note: String
    order: Int
  }

  input LearningPathInput {
    id: ID
    active: Boolean
    name: String
    description: String
    abstract: String
    duration: String
    targetGroup: String
    prerequisites: String
    category: String
    publishedDate: DateTime
    internalNotes: String
    author: String
    authorDescription: String
    authorPosition: String
    trending: Boolean
    paid: Boolean
    hasContent: Boolean
    team: LearningPathTeamInput
    goalTemplate: [GoalTemplateInput!]
    organizationId: ID
    roles: [ID!]
    skills: [ID!]
    startConditions: [String]
  }

  input AssignTeamInput {
    teamId: ID!
    autoassign: Boolean
  }

  input AssignLearningPathInput {
    pathId: ID!
    everyone: Boolean
    autoassign: Boolean
    teams: [AssignTeamInput]
    users: [ID]
  }
  input InputQueryParams {
    limit  : Int 
    skip : Int
    sort: [String]
  }
`
