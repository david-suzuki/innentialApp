import { FulfillmentRequest, User } from '~/models'
import { isInnentialAdmin, isUser } from '~/directives'
import { filterRequestsWithNoUserOrContent } from '../../LearningRequest/request-data/utils'

export const queryTypes = `
  type Query {
    fetchAllFulfillmentRequests(
      user: ID, 
      organizationId: ID, 
      limit: Int, 
      offset: Int
    ): [FulfillmentRequest] @${isInnentialAdmin}
    fetchFulfillmentRequest(requestId: ID!): FulfillmentRequest @${isInnentialAdmin}
    fetchUserFulfillmentRequests: [FulfillmentRequest] @${isUser}
  }
`

export const queryResolvers = {
  Query: {
    fetchAllFulfillmentRequests: async (
      _,
      { user, organizationId, limit, offset }
    ) => {
      const requests = await FulfillmentRequest.find({
        ...(user && { user }),
        ...(organizationId && { organizationId })
      })
        .sort({ createdAt: 1 })
        .skip(limit * (offset - 1))
        .limit(limit)
        .lean()

      return filterRequestsWithNoUserOrContent(requests)
    },
    fetchFulfillmentRequest: async (_, { requestId }) => {
      const request = await FulfillmentRequest.findById(requestId).lean()

      const user = await User.findById(request.user)
        .select({ _id: 1 })
        .lean()

      if (user._id) {
        return request
      } else {
        throw new Error(
          'The user belonging to this FulfillmentRequest has been deleted'
        )
      }
    },
    fetchUserFulfillmentRequests: async (_, args, { user: { _id: user } }) => {
      const requests = await FulfillmentRequest.find({ user }).lean()
      return filterRequestsWithNoUserOrContent(requests)
    }
  }
}
