import { isUser, isAdmin } from '~/directives'
import { Interests, UserProfile, User } from '~/models'
import { sentryCaptureException } from '~/utils'

export const queryTypes = `
  type Query {
      fetchAllInterests: [Interest] @${isUser}
      fetchInterestUserList(interestId: ID!): [User] @${isAdmin}
  }
`

export const queryResolvers = {
  Query: {
    fetchAllInterests: async (_, args, context) => {
      const allInterests = await Interests.find().sort({ name: 1 })
      return allInterests
    },
    fetchInterestUserList: async (
      _,
      { interestId },
      { user: { organizationId } }
    ) => {
      const userProfiles = await UserProfile.find({
        'selectedInterests._id': interestId,
        organizationId
      })
      const userData = []
      await Promise.all(
        userProfiles.map(async profile => {
          const { roleAtWork } = profile
          const user = await User.findById(profile.user).lean()
          if (user) {
            userData.push({
              ...user,
              roleAtWork
            })
          } else sentryCaptureException(`User:${profile.user} not found`)
        })
      )
      return userData
    }
  }
}
