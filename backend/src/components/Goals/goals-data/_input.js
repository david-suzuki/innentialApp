export default `
  input UserGoalInput {
    user: ID!
    reviewId: ID!
    goals: [SingleGoalInput]!
  }

  input SingleGoalInput {
    _id: ID
    goalName: String!
    goalType: String!
    measures: [String]
    relatedSkills: [ID]
    developmentPlan: GoalDevelopmentPlanInput
  }

  input GoalApproveInput {
    goalId: ID!
    approved: Boolean!
    note: String
    developmentPlan: GoalDevelopmentPlanInput
  }

  input UserGoalResultInput {
    user: ID!
    reviewId: ID!
    goals: [GoalResultInput]!
    peer: Boolean
  }

  input GoalResultInput {
    _id: ID!
    goalName: String!
    goalType: String!
    relatedSkills: [ID]
    measures: [MeasureInput]
    skills: [GoalRelatedSkillInput]
    feedback: String
  }

  input GoalRelatedSkillInput {
    skillId: ID!
    level: Int
    related: Boolean
  }

  input MeasureInput {
    _id: ID
    measureName: String!
    completed: Boolean
    successRate: Int
  }

  input ReviewFeedbackInput {
    user: ID!
    reviewId: ID!
    skills: [GoalRelatedSkillInput!]
    feedback: String
  }
`
