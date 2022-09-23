import { isUser } from '~/directives'
import { Comment } from '~/models'

export const queryTypes = `
  type Query {
    fetchAllCommentsForPath(pathId: ID!): [Comment] @${isUser} 
    fetchAllCommentsForUser: [Comment] @${isUser} 
    fetchAllResolvedCommentsForUser: [Comment] @${isUser} 
    fetchAllComments: [Comment] @${isUser} 
  }
`

export const queryResolvers = {
  Query: {
    fetchAllCommentsForPath: async (
      _,
      { pathId },
      { user: { organizationId } }
    ) =>
      Comment.find({
        pathId,
        organizationId,
        replyTo: null
      }),
    fetchAllCommentsForUser: async (_, __, { user: { _id: user } }) =>
      Comment.find({
        user,
        replyTo: null
      }),
    fetchAllResolvedCommentsForUser: async (_, __, { user: { _id: user } }) =>
      Comment.find({
        user,
        resolved: true,
        replyTo: null
      }),
    fetchAllComments: async (_, __, { user: { organizationId } }) =>
      Comment.find({
        organizationId,
        replyTo: null
      })
  }
}
