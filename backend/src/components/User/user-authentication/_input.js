export default `
  input UserCredentials {
    email: String!
    password: String!
  }

  input UserSignupInput {
    _id: String!
    firstName: String!
    lastName: String!
    password: String!
  }

  input UserRegisterInput {
    email: String!
    firstName: String!
    lastName: String!
  }
`
