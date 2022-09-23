import { isUser } from '~/directives'
import { LinesOfWork } from '~/models'

export const queryTypes = `
  type Query {
      fetchAllLinesOfWork: [LineOfWork] @${isUser}
  }
`

export const queryResolvers = {
  Query: {
    fetchAllLinesOfWork: async (_, args, context) => {
      const allLinesOfWork = await LinesOfWork.find().sort({ name: 1 })
      return allLinesOfWork
    }
  }
}
