import React from 'react'
import { ProfileForm } from './user-profile'
import { withRouter, Redirect } from 'react-router-dom'

export default withRouter(({ location: { state }, currentUser, history }) => {
  if (!currentUser || currentUser.roles.indexOf('ADMIN') === -1)
    return <Redirect to='/error-page/404' />
  if (!state) return <Redirect to='/error-page/400' />

  const { user, initialData = {} } = state

  return (
    <ProfileForm
      user={user}
      initialData={{ ...initialData }}
      history={history}
      currentUser={currentUser}
    />
  )
})
