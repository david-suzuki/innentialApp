import { isUser, isInnentialAdmin } from '~/directives'
import {
  sendEmail,
  deliveryRequestedNotification,
  deliveryFulfilledNotification,
  appUrls
} from '~/utils'
import {
  User,
  LearningContent,
  FulfillmentRequest,
  UserContentInteractions,
  DevelopmentPlan,
  ContentSources
} from '~/models'
import { Types } from 'mongoose'
import { ENVIRONMENT } from '../../../environment'

export const mutationTypes = `
  type Mutation {
    requestLearningContentDelivery(contentId: ID!): FulfillmentRequest @${isUser}
    generateCredentialsForLearning(user: ID!): LearningCredentials @${isInnentialAdmin}
    completeFulfillmentRequest(requestId: ID!, note: String): FulfillmentRequest @${isInnentialAdmin}
  }
`

export const createDeliveryRequest = async ({ contentId, userId }) => {
  const user = await User.findById(userId)
    .select({ firstName: 1, lastName: 1, email: 1, organizationId: 1 })
    .lean()
  const item = await LearningContent.findById(contentId)
    .select({ title: 1 })
    .lean()

  const requestId = new Types.ObjectId()

  const { firstName, lastName, email } = user
  const { title } = item

  if (process.env.NODE_ENV === ENVIRONMENT.PRODUCTION)
    await sendEmail(
      'contact@innential.com',
      'A user just requested learning delivery',
      deliveryRequestedNotification({
        firstName,
        lastName,
        email,
        title,
        link: `${appUrls['admin']}/request/${requestId}`
      })
    )

  return FulfillmentRequest.create({
    _id: requestId,
    user: userId,
    contentId,
    organizationId: user.organizationId
  })
}

const domain = 'learn.innential.com'

export const mutationResolvers = {
  Mutation: {
    requestLearningContentDelivery: async (
      _,
      { contentId },
      { user: { _id } }
    ) => createDeliveryRequest({ contentId, userId: _id }),
    generateCredentialsForLearning: async (_, { user }) => {
      const userData = await User.findById(user)
        .select({ email: 1 })
        .lean()

      const { email: userEmail } = userData

      const [identifier, orgDomain] = userEmail.split('@')

      const email = `${identifier}.${orgDomain.split('.')[0]}@${domain}`
      const symbols = ['!', '@', '#', '$', '%', '?']

      const result = await UserContentInteractions.findOneAndUpdate(
        { user },
        {
          $set: {
            learningCredentials: {
              email,
              password: `${Math.random()
                .toString(36)
                .substr(2, 7)}${
                symbols[Math.floor(Math.random() * 5)]
              }${Math.random()
                .toString(36)
                .substr(2, 7)
                .toUpperCase()}${Math.floor(Math.random() * 100) * 10}`
            }
          }
        },
        { new: true }
      )

      return {
        ...result.learningCredentials,
        _id: result._id
      }
    },
    completeFulfillmentRequest: async (_, { requestId, note }) => {
      // UPDATE REQUEST
      const result = await FulfillmentRequest.findOneAndUpdate(
        { _id: requestId },
        {
          $set: {
            fulfilled: true,
            note,
            reviewedAt: new Date()
          }
        },
        { new: true }
      )

      // ACTIVATE CONTENT IN DEVELOPMENT PLAN
      await DevelopmentPlan.findOneAndUpdate(
        {
          user: result.user,
          content: {
            $elemMatch: {
              contentId: result.contentId,
              status: 'AWAITING FULFILLMENT'
            }
          }
        },
        {
          $set: {
            'content.$.status': 'NOT STARTED'
          }
        }
      )

      // SEND NOTIFICATION
      const user = await User.findById(result.user)
        .select({ firstName: 1, lastName: 1, email: 1, organizationId: 1 })
        .lean()

      const item = await LearningContent.findById(result.contentId).lean()

      if (!user || !item) {
        throw new Error(`Could not fetch data for request: ${requestId}`)
      }

      const { firstName, email } = user

      const { _id, title, type, source, url, relatedPrimarySkills = [] } = item

      const contentSource = await ContentSources.findById(source)
        .select({ name: 1 })
        .lean()

      await sendEmail(
        email,
        `Your ${type ? type.toLowerCase() : 'learning'} has arrived!`,
        deliveryFulfilledNotification({
          appLink: appUrls['user'],
          name: firstName,
          item: {
            _id,
            title,
            type,
            source: contentSource ? contentSource.name : '',
            link: url,
            delivery: true,
            // note,
            skills: relatedPrimarySkills.map(({ name }) => name)
          }
        })
      )

      return result
    }
  }
}
