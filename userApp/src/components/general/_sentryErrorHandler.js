import React from 'react'
import * as Sentry from '@sentry/browser'
import { Redirect } from 'react-router-dom'

export const SentryDispatch = ({ error }) => {
  if (
    process.env.NODE_ENV !== 'development' &&
    !process.env.REACT_APP_STAGING
  ) {
    Sentry.captureException(error)
  } else console.error(error)
  return <Redirect to={{ pathname: '/error-page/500' }} />
}

export const captureFilteredError = error => {
  if (!error) return
  if (
    process.env.NODE_ENV !== 'development' &&
    !process.env.REACT_APP_STAGING
  ) {
    Sentry.captureException(error)
  } else {
    console.log(error)
  }
}
