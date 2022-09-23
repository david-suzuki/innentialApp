import { LearningContent, User, UserContentInteractions } from '../../../models'

export const types = `
  type FulfillmentRequest {
    _id: ID!
    content: LearningContent!
    user: Employees!
    fulfilled: Boolean
    note: String
    createdAt: DateTime
    reviewedAt: DateTime
    learningCredentials: LearningCredentials
  }

  type LearningCredentials {
    _id: ID!
    email: String!
    password: String!
  }
`

export const typeResolvers = {
  FulfillmentRequest: {
    content: async ({ contentId }) => LearningContent.findById(contentId),
    user: async ({ user }) => User.findById(user),
    learningCredentials: async ({ user }) => {
      const contentInteractionsProfile = await UserContentInteractions.findOne({
        user
      })
        .select({ learningCredentials: 1, _id: 1 })
        .lean()

      if (
        !contentInteractionsProfile ||
        !contentInteractionsProfile.learningCredentials
      )
        return null

      const {
        learningCredentials: { email, password },
        _id
      } = contentInteractionsProfile

      return {
        _id,
        email,
        password
      }
    }
  },
  LearningCredentials: {
    email: parent => {
      return parent.email ? parent.email : ''
    },
    password: parent => {
      return parent.password ? parent.password : ''
    }
  }
}
