import { makeExecutableSchema } from 'graphql-tools'
import { mergeTypes, mergeResolvers } from 'merge-graphql-schemas'
import OKGGraphQLScalars from '@okgrow/graphql-scalars' // eslint-disable-line
import mapValues from 'lodash.mapvalues'
import components from '~/components'
import QUERY_SETTINGS from '$/settings/queries.json'
import { UNAUTHORIZED } from '~/environment'
import { directives, attachDirectives } from '~/directives'
import { setPublicResolvers } from './graphql'

const { PUBLIC_PREFIX } = QUERY_SETTINGS

// Add more okgrow/graphql-scalars if you need
const oKGGraphQLScalars = `
  scalar NonNegativeFloat
  scalar EmailAddress
  scalar URL
  scalar DateTime
`

const typeDefs = mergeTypes([
  directives,
  oKGGraphQLScalars,
  ...components.types
])

/** *********** PROTECTING YOUR QUERIES/MUTATIONS ***************/

const authenticated = resolver => (parent, args, context, info) => {
  if (context.user) {
    return resolver(parent, args, context, info)
  }
  throw new Error(UNAUTHORIZED) // this is gonna be handled in _format-errors
}

const resolvers = [...components.resolvers]

setPublicResolvers(resolvers)

/*
 * ANYTHING CONTAINING THE PUBLIC_PREFIX STRING IN THE RESOLVER NAME
 * DOESN'T GO THROUGH THE AUTHORIZATION CHECK */
// Credit: zach.codes https://zach.codes/handling-auth-in-graphql-the-right-way/

const publicPrefixRegex = new RegExp(`^${PUBLIC_PREFIX}`)

const authResolvers = mapValues(mergeResolvers(resolvers), (resolver, type) =>
  mapValues(resolver, item => {
    if (type !== 'Mutation' && type !== 'Query') return item // skip type resolvers
    if (publicPrefixRegex.test(item.name)) return item
    if (process.env.NODE_ENV === 'testing') {
      // skip auth for graphql-tester
      return item
    }
    return authenticated(item)
  })
)

/***************************************************/

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers: authResolvers
})

// The following code is needed since schemas built with makeExecutableSchema (or other client tools)
// do not have handler functions for serialize, parseValue, and parseLiteral bound.
// ref: https://stackoverflow.com/a/47827818
Object.keys(OKGGraphQLScalars).forEach(key => {
  // eslint-disable-next-line no-underscore-dangle
  if (schema._typeMap[key]) {
    Object.assign(schema._typeMap[key], OKGGraphQLScalars[key]) // eslint-disable-line no-underscore-dangle
  }
})

attachDirectives(schema)
