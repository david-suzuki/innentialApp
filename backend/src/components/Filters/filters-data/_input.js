export default `
  input FilterInput {
    preferredSkills: [SkillsInput]
    preferredLanguage: [String]
    price: [String]
    priceRange: PriceRangeInput
    preferredSources: [ID]
    preferredTypes: [String]
    durationEnabled: Boolean
    durationRanges : [DurationRangeInput]
    preferredDifficulty: [String]
    preferredCertified: [String]
    preferredSubscription: [SubscriptionInput]
  }
  input DurationRangeInput {
    minHours : Int
    maxHours : Int
  }

  input SubscriptionInput {
    _id: String
    name: String
  }

  input PriceRangeInput {
    minPrice: Float!
    maxPrice: Float
  }
`
