import { ENVIRONMENT } from '../environment'

const { SERVER } = process.env

const { PRODUCTION, STAGING } = ENVIRONMENT

const production = SERVER === PRODUCTION
const staging = SERVER === STAGING

console.log(`Server build is ${SERVER || 'development'}`)

const appUrls = {
  admin: production
    ? 'https://admin.innential.com'
    : staging
    ? 'https://admin-staging.innential.com'
    : 'http://localhost:8081',
  user: production
    ? 'https://app.innential.com'
    : staging
    ? 'https://user-staging.innential.com'
    : 'http://localhost:8082',
  api: production
    ? 'https://api.innential.com'
    : staging
    ? 'https://api-staging.innential.com'
    : 'http://localhost:3000',
  bootcamp: e =>
    e === 'production'
      ? 'https://mycareercompass.io'
      : e === 'staging'
      ? 'https://develop-compass.netlify.app'
      : 'http://localhost:3003'
}

export default appUrls
