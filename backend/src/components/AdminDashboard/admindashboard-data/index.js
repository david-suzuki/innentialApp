import { typeResolvers, types } from './_type'
import { queryResolvers, queryTypes } from './_query'
// import inputTypes from './_input';
import { mutationResolvers, mutationTypes } from './_mutation'

export default {
  types: `
    ${types}
    ${queryTypes}
    ${mutationTypes}
  `,
  resolvers: Object.assign(queryResolvers, typeResolvers, mutationResolvers)
}
