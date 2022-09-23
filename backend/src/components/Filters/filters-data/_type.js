export const types = `
  type Filters {
    _id: ID!
    skillPrefs: [SingleFilter]
    extraSkillPrefs: [SingleFilter]
    languagePref: [SingleFilter]
    pricePref: [SingleFilter]
    priceRangePref: PriceRange
    sourcePrefs: [SingleFilter]
    durationPref: [DurationFilter]
    typePrefs: [SingleFilter]
    levelPref: [SingleFilter]
    certPref: [SingleFilter]
    subscriptionPref: [SingleFilter]
  }

  type SingleFilter {
    _id: ID!
    name: String!
    count: Int
  }
  type DurationFilter {
    _id : ID!
    count : Int
    minHours : Int
    maxHours : Int
  }
  type PriceRange {
    lowestPrice: Float
    highestPrice: Float
  }
`

export const typeResolvers = {
  //
}
