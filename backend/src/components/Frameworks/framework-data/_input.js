export default `
  input AddFrameworkInput {
    connectedTo: ID!
    level1Text: String!
    level2Text: String!
    level3Text: String!
    level4Text: String!
    level5Text: String!
  }

  input EditFrameworkInput {
    frameworkId: ID!
    level1Text: String!
    level2Text: String!
    level3Text: String!
    level4Text: String!
    level5Text: String!
  }
`
