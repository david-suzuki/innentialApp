import { typeResolvers, types } from './_type'
import { queryResolvers, queryTypes } from './_query'

export default {
  types: `
    ${types}
    ${queryTypes}
  `,
  resolvers: Object.assign(queryResolvers, typeResolvers)
}
