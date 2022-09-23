import { isUser } from '~/directives'
import { Industries } from '~/models'

export const queryTypes = `
  type Query {
    publicFetchAllIndustries: [Industry]
    fetchAllIndustries: [Industry] @${isUser}
  }
`

export const queryResolvers = {
  Query: {
    fetchAllIndustries: async (_, args, context) => {
      const allIndustries = await Industries.find().sort({ name: 1 })
      return allIndustries
    },
    publicFetchAllIndustries: async (_, args, context) => {
      const allIndustries = await Industries.find().sort({ name: 1 })
      return allIndustries
    }
  }
}
