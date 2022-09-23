import { isUser } from '~/directives'

export const mutationTypes = `
  type Mutation {
    createTask(input: TaskInput!): Task @${isUser}
    deleteTask(id: ID!): Task @${isUser}
    updateTask(input: TaskInput!): Task @${isUser}
  }
`

export const mutationResolvers = {
  Mutation: {
    createTask: async (_, args, { dataSources }) => {
      const { input } = args || {}
      if (!input) return null
      return dataSources.Task.createOne(input)
    },
    deleteTask: async (_, { id }, { dataSources }) =>
      dataSources.Task.remove({ id }),
    updateTask: async (_, args, { dataSources }) => {
      const { input = {} } = args || {}
      const { id, ...update } = input
      if (!id) return null
      return dataSources.Task.updateOne({
        filter: { _id: id },
        update
      })
    }
  }
}
