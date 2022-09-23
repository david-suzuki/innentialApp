import { Invitation } from '~/models'

export const mutationTypes = `
  type Mutation {
    publicCreateInvitation(inputData: InvitationInput!): String
  }
`

export const mutationResolvers = {
  Mutation: {
    //
    publicCreateInvitation: async (_, { inputData }) => {
      Invitation.create(inputData)
      return 'invitation created!'
    }
  }
}
