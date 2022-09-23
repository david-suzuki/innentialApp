import React from 'react'
import { compose, pure } from 'recompose'
import { graphql } from 'react-apollo'
import { authQuery } from '../../api'
import Loading from './Loading'
import { Redirect, withRouter } from 'react-router-dom'

const connectionData = graphql(authQuery, {
  options: { fetchPolicy: 'network-only' }
})
const ConnectionResult = ({ children, data: { checkAuth }, history }) => {
  return checkAuth && checkAuth.includes('Authorized')
    ? children
    : history.location.pathname !== '/login' && <Redirect to='/login' />
}

export default compose(
  connectionData,
  Loading,
  withRouter,
  pure
)(ConnectionResult)
