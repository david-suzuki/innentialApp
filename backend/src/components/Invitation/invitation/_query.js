import { Invitation } from '~/models'

export const queryTypes = `
  type Query {
    publicFetchAllInvitations: [Invitation]
  }
`

export const queryResolvers = {
  Query: {
    //
    publicFetchAllInvitations: async (_, args, context) => {
      const all = await Invitation.find()
      return all
    }
  }
}
