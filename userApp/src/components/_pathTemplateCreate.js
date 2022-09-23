import React, { useEffect } from 'react'
import { withRouter, Redirect } from 'react-router-dom'
import {
  PathTemplateForm,
  pathTemplateFormDefaults
} from './organization-settings'
import { fetchLearningPathEditInfo, fetchUserTeamsDetails } from '../api'
import { useQuery } from 'react-apollo'
import { LoadingSpinner, SentryDispatch } from './general'
// import Container from '../globalState'
// import roleFormStyle from '../styles/roleFormStyle'

const QueryWrapper = ({ pathId, history, currentUser, teams }) => {
  const { data, loading, error } = useQuery(fetchLearningPathEditInfo, {
    variables: {
      pathId
    },
    fetchPolicy: 'cache-and-network'
  })

  if (loading) return <LoadingSpinner />

  if (error) {
    return <SentryDispatch error={error} />
  }

  const learningPath = data?.fetchLearningPathById

  if (learningPath) {
    return (
      <PathTemplateForm
        initialData={{
          ...learningPath,
          goalTemplates: learningPath.goalTemplate.map(g => ({
            ...g,
            content: g.content
              .sort((a, b) => a.order - b.order)
              .map(({ content, ...rest }) => ({
                ...rest,
                ...content
              }))
          })),
          team: learningPath.team
            ? {
                teamId: learningPath.team._id,
                teamName: learningPath.team.teamName
              }
            : null
        }}
        history={history}
        currentUser={currentUser}
        teams={teams}
      />
    )
  }
  return null
}

export default withRouter(({ location: { state }, history, currentUser }) => {
  const isAdmin = currentUser.roles.indexOf('ADMIN') !== -1

  const { data, loading, error } = useQuery(fetchUserTeamsDetails)

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <SentryDispatch error={error} />
  }

  if (currentUser.roles.indexOf('ADMIN') === -1 && !currentUser.leader)
    return <Redirect to='/error-page/404' />

  const teams =
    data?.fetchCurrentUserOrganization?.teams?.filter(team => {
      if (isAdmin) {
        return true
      } else return team.leader._id === currentUser._id
    }) || []

  if (state?.initialData?.pathId) {
    return (
      <QueryWrapper
        pathId={state.initialData.pathId}
        history={history}
        currentUser={currentUser}
        teams={teams}
      />
    )
  }
  // const { setFrameworkState } = Container.useContainer()

  let initialData = {
    ...PathTemplateForm,
    ...pathTemplateFormDefaults,
    goalTemplates: [...pathTemplateFormDefaults.goalTemplates]
  }
  return (
    <PathTemplateForm
      initialData={initialData}
      history={history}
      currentUser={currentUser}
      teams={teams}
    />
  )
})
