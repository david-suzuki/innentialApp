import { User } from '~/models'
import { createTokens } from '~/authentication'
import { AUTH } from '~/config'
import { sentryCaptureException } from '~/utils'

export const queryTypes = `
type Query {
      publicFetchInvitation(pendingInvitation: ID!): User
      publicGetAuthToken(userId: ID!): String
  }
`

export const queryResolvers = {
  Query: {
    publicFetchInvitation: async (_, { pendingInvitation }, context) => {
      try {
        const user = await User.findOne({
          'invitation.pendingInvitation': pendingInvitation
        })
        return user
      } catch (e) {
        sentryCaptureException(e)
        console.log('There is an error while fetching user invitation', e)
        throw new Error(
          `User with provided invitation ${pendingInvitation} has not ben found`
        )
      }
    },
    publicGetAuthToken: async (_, { userId }) => {
      try {
        const validUser = await User.findById(userId)
        const additionalClaims = {}
        const userData = {
          _id: validUser._id,
          firstName: validUser.firstName,
          email: validUser.email,
          roles: validUser.roles,
          permissions: validUser.permissions,
          organizationId: validUser.organizationId
        }
        const [token, refreshToken] = await createTokens(
          {
            user: userData,
            refreshTokenSecret: validUser.password + AUTH.SECRET_REFRESH_TOKEN
          },
          additionalClaims
        )
        const response = JSON.stringify({ token, refreshToken })
        return response
      } catch (e) {
        sentryCaptureException(e)
        return null
      }
    }
  }
}
