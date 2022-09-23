import React, { useEffect } from 'react'
import { withRouter, Redirect } from 'react-router-dom'
import { SingleRoleForm, roleFormDefaults } from './organization-settings'
import Container from '../globalState'
import roleFormStyle from '../styles/roleFormStyle'

export default withRouter(({ location: { state }, history, currentUser }) => {
  // useEffect(() => {
  //   const mainWrapper = document.getElementById('main-wrapper')
  //   mainWrapper.className = 'container-main__wrapper wrapper--right'

  //   return () => {
  //     const mainWrapper = document.getElementById('main-wrapper')
  //     mainWrapper.className = 'container-main__wrapper'
  //   }
  // }, [])
  if (currentUser.roles.indexOf('ADMIN') === -1)
    return <Redirect to='/error-page/404' />
  const { setFrameworkState } = Container.useContainer()

  let initialData = roleFormDefaults
  if (state) initialData = state.initialData
  const isEditing = initialData._id
  const isSuggestion = initialData.suggestion

  return (
    <div>
      <div className='role-setting__heading'>
        <i
          className='role-setting__back__button icon icon-small-right icon-rotate-180'
          onClick={e => {
            e.preventDefault()
            history.goBack()
          }}
        />
        <div className='role-setting__heading-info'>
          <h1>
            {isEditing ? (isSuggestion ? 'Review' : 'Edit') : 'Add'} role
            requirements
          </h1>
        </div>
      </div>
      <SingleRoleForm
        initialData={initialData}
        goBack={history.goBack}
        setFrameworkState={setFrameworkState}
      />
      <style jsx>{roleFormStyle}</style>
    </div>
  )
})
