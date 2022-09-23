export default `
  input CommentInput {
    pathId: ID!
    replyTo: ID
    abstract: String
    content: String!
  }

  input CommentEditInput {
    commentId: ID!
    abstract: String
    content: String!
  }
`
