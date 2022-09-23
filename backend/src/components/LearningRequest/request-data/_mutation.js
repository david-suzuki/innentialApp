import { isAdmin, isUser } from '~/directives'

export const mutationTypes = `
  type Mutation {
    requestLearningContent(contentId: ID!, goalId: ID): Request @${isUser}
    reviewContentRequest(approved: Boolean!, requestId: ID!, note: String): Request @${isUser}
  }
`

export const mutationResolvers = {
  Mutation: {
    requestLearningContent: async (
      _,
      { contentId, goalId },
      { user: { _id: user, organizationId }, dataSources }
    ) =>
      dataSources.LearningRequest.requestLearning(
        { contentId, goalId },
        { organizationId, user }
      ),
    reviewContentRequest: async (
      _,
      { approved, requestId, note },
      { user: { _id: reviewedBy }, dataSources }
    ) =>
      dataSources.LearningRequest.reviewRequest({
        approved,
        requestId,
        note,
        reviewedBy
      })
  }
}
