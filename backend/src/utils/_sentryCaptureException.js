import * as Sentry from '@sentry/node'
import { ENVIRONMENT } from '../environment'

const { SERVER } = process.env

const production = SERVER === ENVIRONMENT.PRODUCTION
export const sentryCaptureException = error => {
  if (production) Sentry.captureException(error)
  else {
    console.log(error)
  }
}
