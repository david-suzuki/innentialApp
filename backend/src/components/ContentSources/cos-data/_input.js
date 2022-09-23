export default `
input ContentSourceInput {
    name: String!
    baseUrls: [String]!
    affiliate: Boolean
    certText: String
    subscription: Boolean
    tags: [String!]
    accountRequired : Boolean
  }
`
