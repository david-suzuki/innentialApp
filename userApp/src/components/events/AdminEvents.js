import React, { Fragment } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { Query } from 'react-apollo'
import adminEventsStyle from '$/styles/adminEventsStyle'
import {
  Tab,
  Tabs,
  TabsList,
  TabContent,
  List,
  Statement
} from '../ui-components'
import AdminEventsTable from './AdminEventsTable'
import {
  fetchAllUpcomingAdminEvents,
  fetchAllPastAdminEvents,
  fetchAllDraftAdminEvents,
  deleteEvent,
  publicEvent
} from '../../api'
import { captureFilteredError, LoadingSpinner } from '../general'
import { Notification } from 'element-react'

const AdminEvents = () => {
  const history = useHistory()

  const [mutationDelete] = useMutation(deleteEvent)
  const [mutationPublic] = useMutation(publicEvent)

  const editEvent = eventId => {
    history.push({
      pathname: '/event-templates/form',
      state: {
        initialData: {
          eventId
        }
      }
    })
  }

  const deleteEventById = eventId => {
    mutationDelete({
      variables: {
        eventId
      },
      refetchQueries: [
        {
          query: fetchAllDraftAdminEvents
        },
        {
          query: fetchAllUpcomingAdminEvents
        },
        {
          query: fetchAllPastAdminEvents
        }
      ]
    }).then(() =>
      Notification({
        type: 'success',
        message: 'Event has been deleted.',
        duration: 2500,
        offset: 90
      })
    )
  }

  const publicEventById = eventId => {
    mutationPublic({
      variables: {
        eventId
      },
      refetchQueries: [
        {
          query: fetchAllDraftAdminEvents
        },
        {
          query: fetchAllUpcomingAdminEvents
        },
        {
          query: fetchAllPastAdminEvents
        }
      ]
    }).then(() =>
      Notification({
        type: 'success',
        message: 'Event has been published.',
        duration: 2500,
        offset: 90
      })
    )
  }

  return (
    <div className='admin-paths__container'>
      <List noPadding overflow noBoxShadow purpleBackground>
        <Link to='/event-templates/form'>
          <button className='el-button el-button--primary add-event__button'>
            <span>Add new event</span>
            <img
              width={16}
              height={18}
              style={{ marginLeft: '5px' }}
              src={require('../../static/plus-circle-white.svg')}
              alt=''
            />
          </button>
        </Link>
        <Tabs className='subtabs'>
          <TabsList>
            <Tab>Upcoming</Tab>
            <Tab>Past</Tab>
            <Tab>Drafts</Tab>
          </TabsList>
          <TabContent>
            <Query query={fetchAllUpcomingAdminEvents}>
              {({ data, loading, error }) => {
                if (loading) return <LoadingSpinner />

                if (error) {
                  captureFilteredError(error)
                  return null
                }

                const upcomingEvents =
                  (data && data.fetchAllUpcomingAdminEvents) || []

                return (
                  <Fragment>
                    <AdminEventsTable
                      events={upcomingEvents}
                      actionButtonText='Edit Event'
                      actionButtonHandle={eventId => editEvent(eventId)}
                      deleteButtonHandle={eventId => deleteEventById(eventId)}
                      handleSortEventsByDate={() => {}}
                      handleSortEventsByAttendeeName={() => {}}
                      handleSortEventsByCreatorName={() => {}}
                    />
                    {upcomingEvents.length === 0 && (
                      <Statement content='Nothing to display.' />
                    )}
                  </Fragment>
                )
              }}
            </Query>
          </TabContent>
          <TabContent>
            <Query query={fetchAllPastAdminEvents}>
              {({ data, loading, error }) => {
                if (loading) return <LoadingSpinner />

                if (error) {
                  captureFilteredError(error)
                  return null
                }

                const pastEvents = (data && data.fetchAllPastAdminEvents) || []

                return (
                  <Fragment>
                    <AdminEventsTable
                      events={pastEvents}
                      actionButtonText='Upload file'
                      actionButtonHandle={() => {}}
                      deleteButtonHandle={eventId => deleteEventById(eventId)}
                      handleSortEventsByDate={() => {}}
                      handleSortEventsByAttendeeName={() => {}}
                      handleSortEventsByCreatorName={() => {}}
                    />
                    {pastEvents.length === 0 && (
                      <Statement content='Nothing to display.' />
                    )}
                  </Fragment>
                )
              }}
            </Query>
          </TabContent>
          <TabContent>
            <Query query={fetchAllDraftAdminEvents}>
              {({ data, loading, error }) => {
                if (loading) return <LoadingSpinner />

                if (error) {
                  captureFilteredError(error)
                  return null
                }

                const draftEvents =
                  (data && data.fetchAllDraftAdminEvents) || []

                return (
                  <Fragment>
                    <AdminEventsTable
                      events={draftEvents}
                      actionButtonText='Publish'
                      actionButtonHandle={eventId => publicEventById(eventId)}
                      deleteButtonHandle={eventId => deleteEventById(eventId)}
                      handleSortEventsByDate={() => {}}
                      handleSortEventsByAttendeeName={() => {}}
                      handleSortEventsByCreatorName={() => {}}
                    />
                    {draftEvents.length === 0 && (
                      <Statement content='Nothing to display.' />
                    )}
                  </Fragment>
                )
              }}
            </Query>
          </TabContent>
        </Tabs>
      </List>
      <style jsx>{adminEventsStyle}</style>
    </div>
  )
}

export default AdminEvents
