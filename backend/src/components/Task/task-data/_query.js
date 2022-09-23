import { isUser } from '~/directives'

export const queryTypes = `
  type Query {
    fetchTasks: [Task] @${isUser}
    fetchTaskById(id: ID!): Task @${isUser}
  }
`

export const queryResolvers = {
  Query: {
    fetchTaskById: async (_, args, { dataSources }) => {
      const { id } = args || {}
      if (!id) return null
      return dataSources.Task.findById(id)
    },
    fetchTasks: async (_, __, { dataSources }) => dataSources.Task.getAll()
  }
}
