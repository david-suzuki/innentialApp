import { isUser, isAdmin } from '~/directives'
import { makePublicResolver } from '~/graphql'
import { appUrls } from '~/utils'

// right after cloning the repo
// isInnentialAdmin ---> only user created in fixtures is allowed
// canReadProfile ---> both users ric0 and kris are allowed

const PUBLIC_QUERIES = {
  PUBLIC_TEST: makePublicResolver('test')
}

export const queryTypes = `
  type Query {
    ${PUBLIC_QUERIES.PUBLIC_TEST}: String
    connection: String!
    checkAuth: String  @${isUser}
    fetchApiUrl: String @${isAdmin}
  }
`

// NOTE:
// Keep in mind  that "checkAuth: String!  @${isInnentialAdmin}" if not allowed would also throw
// TypeError: Cannot convert undefined or null to object
// when using non nullable objects

export const queryResolvers = {
  Query: {
    [PUBLIC_QUERIES.PUBLIC_TEST]: () =>
      'Server is up and running... working smoothly',
    connection: () => 'Connected',
    checkAuth: (_, args, context) =>
      `Authorized | CurentUserId ${context.user._id}!`,
    fetchApiUrl: _ => `${appUrls['api']}`
  }
}

// makeQueryPublic(queryResolvers.Query);
