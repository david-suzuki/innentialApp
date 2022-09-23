export default `
input DurationInput {
  basis: String!
  hoursMin: Int
  hoursMax: Int
  hours: Int
  minutes: Int
  weeks: Int
}

input PriceInput {
  currency: String
  value: Float
}

input RelatedPrimarySkillsInput {
  _id: String
  name: String
  skillLevel: Int
  importance: Float
}

input SelectedSkillInput {
  _id: String!
  name: String
  skillLevel: Int!
}

input SkillsInput {
  _id: String
  name: String
}

input RelatedInterestInput {
  _id: String
  name: String
 }

input RelatedIndustryInput {
  _id: String
  name: String
 }

 input RelatedLineOfWorkInput {
   _id: String
   name: String
  }

input LearningContentInput {
  title: String!
  url: URL
  awsId: ID
  author: String
  type: String!
  price: PriceInput
  certified: Boolean
  german: Boolean
  externalRating: Float
  nOfReviews: Int
  duration: DurationInput
  source: ID
  organizationSpecific: ID
  relatedPrimarySkills: [RelatedPrimarySkillsInput]!
  relatedSecondarySkills: [SkillsInput]
  relatedInterests: [RelatedInterestInput]
  relatedIndustries: [RelatedIndustryInput]
  relatedLineOfWork: RelatedLineOfWorkInput
  publishedDate: DateTime
  startDate: DateTime
}

input SavedLearningContentInput {
  _id: String!
  contentType: String!
  relevanceRating: Float!
}

input LimitInput {
  courses: Int
  books: Int
  events: Int
  articles: Int
}

input EventInput {
  eventType: String!,
  impression: [ID!],
  contentId:  ID!
}
`
