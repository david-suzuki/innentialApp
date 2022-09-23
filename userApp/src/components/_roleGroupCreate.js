import React from 'react'
import { withRouter, Redirect } from 'react-router-dom'
import Container from '../globalState'
import { RoleGroupForm, roleGroupFormDefaults } from './organization-settings'

export default withRouter(({ history, location: { state }, currentUser }) => {
  if (currentUser.roles.indexOf('ADMIN') === -1)
    return <Redirect to='/error-page/404' />
  const initialData = (state && state.initialData) || roleGroupFormDefaults
  if (state) delete state.initialData
  const { setFrameworkState } = Container.useContainer()

  return (
    <RoleGroupForm
      initialData={initialData}
      setFrameworkState={setFrameworkState}
      history={history}
    />
  )
})
