export default `
  input DevelopmentPlanInput {
    user: ID!
    content: [DPContentInput]
    mentors: [DPMentorInput]
    goalId: ID
  }

  input GoalDevelopmentPlanInput {
    content: [DPContentInput]
    mentors: [DPMentorInput]
  }

  input DPContentInput {
    contentId: ID!
    contentType: String
    goalId: ID
    status: String
    setBy: ID
    approved: Boolean
    price: Float
    note: String
    order: Int
    subscriptionAvailable: Boolean
  }

  input DPMentorInput {
    mentorId: ID!
    goalId: ID
  }
`
