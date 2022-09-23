import { ApolloClient } from 'apollo-client'
import { withClientState } from 'apollo-link-state'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'
import { onError } from 'apollo-link-error'
import { ApolloLink } from 'apollo-link'
import decode from 'jwt-decode'

import {
  APP,
  AUTH,
  CLIENT_AUTH_REQUEST_TYPE,
  CLIENT_AUTHENTICATION_METHOD,
  JWT,
  VERSION
} from '../environment'
// import { defaults, resolvers, responseResolvers, watchedMutations } from '../../api';
import { defaults, resolvers } from '../api'

const { CONSTANTS: { UNAUTHORIZED, FORBIDDEN, APP_ID } = {} } = APP

const opts = {
  credentials: 'same-origin',
  headers: {
    'frontend-version': VERSION,
    [AUTH.STRATEGIES.CLIENT.AUTH_HEADER]: CLIENT_AUTH_REQUEST_TYPE
  }
}

const localStorage = window.localStorage

const useLocalStorage = CLIENT_AUTHENTICATION_METHOD.LOCAL_STORAGE

// const apolloCache = new InMemoryCache();

const apolloCache = new InMemoryCache({
  dataIdFromObject: e => `${e.__typename}_${e._id}` || null // eslint-disable-line no-underscore-dangle
})

// const watchedMutationLink = new WatchedMutationLink(apolloCache, watchedMutations);
const stateLink = withClientState({
  cache: apolloCache,
  defaults,
  resolvers
})

const httpLink = new HttpLink({
  uri: APP.ENDPOINT.GRAPHQL,
  ...opts
})
const authMiddlewareLink = setContext(() => {
  const headers = {
    headers: {
      appId: APP_ID,
      [JWT.HEADER.TOKEN.NAME]:
        localStorage.getItem(JWT.LOCAL_STORAGE.TOKEN.NAME) || null,
      [JWT.HEADER.REFRESH_TOKEN.NAME]: localStorage.getItem(JWT.LOCAL_STORAGE.REFRESH_TOKEN.NAME) || null, // eslint-disable-line
    }
  }

  if (headers.headers[JWT.HEADER.REFRESH_TOKEN.NAME]) {
    const currentTime = Date.now().valueOf() / 1000
    const tokenExpiration = decode(
      headers.headers[JWT.HEADER.REFRESH_TOKEN.NAME]
    ).exp
    if (currentTime > tokenExpiration) {
      window.location.replace('/login')
    }
  }
  return headers
})

const afterwareLink = new ApolloLink((operation, forward) =>
  forward(operation).map(response => {
    const context = operation.getContext()
    const {
      response: { headers }
    } = context

    if (headers) {
      const token = headers.get(JWT.HEADER.TOKEN.NAME)
      const refreshToken = headers.get(JWT.HEADER.REFRESH_TOKEN.NAME)

      if (token) {
        localStorage.setItem(JWT.LOCAL_STORAGE.TOKEN.NAME, token)
      }

      if (refreshToken) {
        localStorage.setItem(JWT.LOCAL_STORAGE.REFRESH_TOKEN.NAME, refreshToken)
      }
    }

    return response
  })
)

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors && graphQLErrors.filter(e => e).length > 0) {
    graphQLErrors.map(({ message = '', status = 200 }) => {
      if (UNAUTHORIZED === message || status === 401) {
        console.warn(`You've attempted to access ${UNAUTHORIZED} section`)
      }
      if (FORBIDDEN === message || status === 403) {
        console.warn(`You've attempted a ${FORBIDDEN} action`)
        window.location.replace(`/error-page/403`)
      }
      return null
    })
  }
  if (networkError && networkError.statusCode === 401) {
    // eslint-disable-next-line
    window.location.replace('/login');
    console.warn(UNAUTHORIZED)
  }
  if (networkError && networkError.statusCode === 403) {
    // Do something
    console.warn(FORBIDDEN)
  }
  if (networkError && networkError.statusCode >= 500) {
    // eslint-disable-next-line
    console.warn('SERVER ERROR');
    window.location.replace(`/error-page/${networkError.statusCode}`)
  }
})

let links = [errorLink, stateLink /* , watchedMutationLink */, httpLink]

if (useLocalStorage) {
  links = [
    errorLink,
    stateLink,
    afterwareLink,
    authMiddlewareLink,
    // watchedMutationLink,
    httpLink
  ]
}

const link = ApolloLink.from(links)

const client = new ApolloClient({
  link,
  cache: apolloCache,
  connectToDevTools: true
})

const resetLocalStorageTokens = () => {
  localStorage.removeItem(JWT.LOCAL_STORAGE.TOKEN.NAME)
  localStorage.removeItem(JWT.LOCAL_STORAGE.REFRESH_TOKEN.NAME)
}

if (useLocalStorage) {
  client.onClearStore(() => resetLocalStorageTokens())
  client.onResetStore(() => resetLocalStorageTokens())
}

export default client
