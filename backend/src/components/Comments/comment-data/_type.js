import { LearningPathTemplate, User, Comment } from '~/models'

export const types = `
  type Comment {
    _id: ID!
    path: LearningPath!
    user: User!
    likes: [ID]
    replies: [Comment]
    resolved: Boolean
    accepted: Boolean
    abstract: String
    content: String!
    createdAt: DateTime!
  }
`

export const typeResolvers = {
  Comment: {
    path: async ({ pathId }) => LearningPathTemplate.findById(pathId),
    user: async ({ user }) => User.findById(user),
    replies: async ({ replies = [] }) => Comment.find({ _id: { $in: replies } })
  }
}
