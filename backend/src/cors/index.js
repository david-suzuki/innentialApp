import cors from 'cors'
import { JWT } from '~/config'

// FIXES EITHER CORS ERROR OR APOLLO SERVER METHOD NOT ALLOWED (405) WHEN FRONTEND WEBPACK DEV
// SERVER (i.e. VUE) HAS NO PROXY TABLE FOR APOLLO /GRAPHQL
const originWhitelist = [
  // Allow domains here
  'http://localhost:8080',
  'http://localhost:8081',
  'http://localhost:8082',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'https://admin.innential.com',
  'https://admin-staging.innential.com',
  'https://develop-compass.netlify.app',
  'https://mycareercompass.io',
  'https://develop-micro-site.netlify.app'
]

const corsOptions = {
  origin(origin, callback) {
    const originIsWhitelisted = originWhitelist.indexOf(origin) !== -1
    callback(null, originIsWhitelisted)
  },
  exposedHeaders: [
    // Expose the headers that the JS client needs to access
    ...Object.keys(JWT.HEADER)
      .map(h => JWT.HEADER[h].name)
      .join(',')
  ],
  credentials: false // Set true if response to preflight request doesn't pass access control check
}

export default () => cors(corsOptions)
