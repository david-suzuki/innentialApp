export default `  
  input FrequencyInput {
    repeatCount: Int
    repeatInterval: String
    day: Int
  }

  input ReviewTemplateInput {
    edittingId: String
    updateReview: Boolean
    name: String!
    goalType: String!
    scopeType: String!
    specificScopes: [String]
    specificUsers: [String]
    reviewers: String!
    specificReviewers: [String]
    firstReviewStart: DateTime!
    reviewFrequency: FrequencyInput
    progressCheckFrequency: FrequencyInput
    leadersReview: Boolean
    oneTimeReview: Boolean
  }
`
