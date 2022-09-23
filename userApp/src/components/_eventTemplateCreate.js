import React, { useEffect } from 'react'
import { withRouter, Redirect } from 'react-router-dom'
import EventTemplateForm from './events/EventTemplate'
import { fetchEventById } from '../api'
import { useQuery } from 'react-apollo'
import { LoadingSpinner, SentryDispatch } from './general'

const QueryWrapper = ({ eventId, history, currentUser }) => {
  const { data, loading, error } = useQuery(fetchEventById, {
    variables: {
      eventId
    },
    fetchPolicy: 'cache-and-network'
  })

  if (loading) return <LoadingSpinner />

  if (error) {
    return <SentryDispatch error={error} />
  }

  const event = data?.fetchEventById

  if (event) {
    return (
      <EventTemplateForm
        initialData={{
          ...event
        }}
        history={history}
        currentUser={currentUser}
      />
    )
  }
  return null
}

export default withRouter(({ location: { state }, history, currentUser }) => {
  const isAdmin = currentUser.roles.indexOf('ADMIN') !== -1

  if (currentUser.roles.indexOf('ADMIN') === -1 && !currentUser.leader)
    return <Redirect to='/error-page/404' />

  if (state?.initialData?.eventId) {
    return (
      <QueryWrapper
        eventId={state.initialData.eventId}
        history={history}
        currentUser={currentUser}
      />
    )
  }

  let initialData = {
    _id: null,
    title: '',
    eventType: 'Internal',
    description: '',
    format: '',
    eventLink: '',
    eventLinkExternal: '',
    eventLocation: '',
    isOnedayEvent: true,
    scheduleFromDate: '',
    scheduleToDate: '',
    scheduleTime: '',
    isPaid: false,
    currency: 'EUR',
    price: null,
    skills: [],
    attendee: {
      attendeeType: '',
      attendeeIds: []
    },
    imageLink: null,
    inviteLink: {
      status: false,
      url: ''
    }
  }

  return (
    <EventTemplateForm
      initialData={initialData}
      history={history}
      currentUser={currentUser}
    />
  )
})
