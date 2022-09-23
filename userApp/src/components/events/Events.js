import React, { useEffect, useState } from 'react'
import { Link, Redirect, Route, Switch, useHistory } from 'react-router-dom'
import { MessageBox, Pagination } from 'element-react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { ListSort, Statement } from '../ui-components'
import EventCard from './EventCard'
import AdminEvents from './AdminEvents'
import { ReactComponent as IconCheck } from '$/static/check-grey.svg'
import { ReactComponent as IconInfo } from '$/static/warning.svg'
import eventsStyle from '$/styles/eventsStyle'
import {
  fetchAllMyEvents,
  fetchAllInvitations,
  fetchAllPastEvents,
  declineInvitation,
  acceptInvitation
} from '../../api'
import { captureFilteredError, LoadingSpinner } from '../general'

const sortMethods = [
  {
    label: 'Soonest',
    callback: (a, b) => {
      return new Date(b?.scheduleFromDate) - new Date(a?.scheduleFromDate)
    }
  },
  {
    label: 'Latest',
    callback: (a, b) => {
      return new Date(a?.scheduleFromDate) - new Date(b?.scheduleFromDate)
    }
  }
]

const MyEvents = props => {
  const { currentUser } = props

  let history = useHistory()

  const { data, loading, error } = useQuery(fetchAllMyEvents)

  const events = (data && data.fetchAllMyEvents) || []

  const [myEventsData, setMyEventsData] = useState(events)
  const [sortMethodMyEvents, setSortMethodMyEvents] = useState(sortMethods[0])
  const [myEventsPage, setMyEventsPage] = useState(0)

  useEffect(() => {
    setMyEventsData(events)
  }, [events])

  const handleDetail = id => {
    history.push(`/event/${id}`)
  }

  const handleChangeMyEventsPage = page => {
    setMyEventsPage(page - 1)
  }

  if (loading) return <LoadingSpinner />

  if (error) {
    captureFilteredError(error)
    return null
  }

  const children = e => (
    <div className='my-events__container'>
      <button
        className='el-button el-button--default details-button'
        onClick={() => handleDetail(e._id)}
      >
        <span>See Details</span>
      </button>
      <div className='my-events__message'>
        <IconInfo className='my-events__message-icon-info' />
        <div>
          <span>Invited by </span>
          <Link to={`/users/${e.creater._id}`}>
            {e.creater.firstName} {e.creater.lastName}
          </Link>
        </div>
      </div>
    </div>
  )
  return (
    <>
      <div className='events__container'>
        <div className='events__sort'>
          <ListSort
            sortMethod={sortMethodMyEvents.label}
            sortMethodList={sortMethods}
            changeSortMethod={sortMethod => {
              setSortMethodMyEvents(sortMethod)
              const sortedData = myEventsData.sort((a, b) =>
                sortMethod.callback(a, b)
              )
              setMyEventsData(sortedData)
            }}
          >
            <i className='el-icon-arrow-down el-icon--right'></i>
          </ListSort>
        </div>

        {events.length > 0 &&
          events.length <= 12 &&
          myEventsData.map(e => (
            <EventCard key={e._id} data={e} children={children(e)} />
          ))}
        {events.length > 12 &&
          myEventsData
            .slice(myEventsPage * 10, myEventsPage * 10 + 10)
            .map(e => (
              <EventCard key={e._id} data={e} children={children(e)} />
            ))}
        {events.length === 0 && <Statement content='No goals to display.' />}
      </div>
      {events.length > 12 && (
        <>
          <br />
          <br />
          <Pagination
            total={myEventsData.length}
            currentPage={myEventsPage + 1}
            pageSize={12}
            layout=' prev, pager, next'
            onCurrentChange={page => {
              handleChangeMyEventsPage(page)
            }}
          />
        </>
      )}
    </>
  )
}

const Invitations = props => {
  const { currentUser, events } = props

  const [mutateDecline] = useMutation(declineInvitation, {
    update: (proxy, { data: { declineInvitation: result } }) => {
      try {
        const { fetchAllInvitations: prevRequest } = proxy.readQuery({
          query: fetchAllInvitations
        })

        proxy.writeQuery({
          query: fetchAllInvitations,
          data: {
            fetchAllInvitations: prevRequest.filter(
              item => item._id !== result._id
            )
          }
        })
      } catch (e) {
        console.error(e)
      }
    }
  })

  const [mutateAccept] = useMutation(acceptInvitation, {
    update: (proxy, { data: { acceptInvitation: result } }) => {
      try {
        const { fetchAllInvitations: invitations } = proxy.readQuery({
          query: fetchAllInvitations
        })

        proxy.writeQuery({
          query: fetchAllInvitations,
          data: {
            fetchAllInvitations: invitations.filter(
              item => item._id !== result._id
            )
          }
        })

        const { fetchAllMyEvents: myevents } = proxy.readQuery({
          query: fetchAllMyEvents
        })

        proxy.writeQuery({
          query: fetchAllMyEvents,
          data: {
            fetchAllMyEvents: myevents.concat(result)
          }
        })
      } catch (e) {
        console.error(e)
      }
    }
  })

  const handleDecline = async eventId => {
    await mutateDecline({ variables: { eventId } })
  }

  const children = e => (
    <div className='invitations__container'>
      <div className='invitations__message'>
        <IconInfo className='invitations__message-icon-info' />
        <span>You are invited</span>
      </div>
      <div className='invitations__actions'>
        <div
          className='invitations__actions-accept'
          onClick={() =>
            MessageBox.confirm(
              <div className='invitations__actions-accept__dialog'>
                <span>Are you sure you want to attend this event?</span>
              </div>,
              ' ',
              {
                showConfirmButton: true,
                showCancelButton: true,
                showCancel: true,
                confirmButtonText: 'Accept',
                cancelButtonText: 'Decline'
              }
            ).then(async () => {
              await mutateAccept({ variables: { eventId: e._id } })
            })
          }
        >
          <span>Accept</span>
          <IconCheck className='invitations__actions-accept__icon' />
        </div>
        <div
          className='invitations__actions-decline'
          onClick={() => handleDecline(e._id)}
        >
          <span>Decline</span>
          <div className='invitations__actions-decline__icon' />
        </div>
      </div>
    </div>
  )
  return (
    <div className='events__container'>
      {events.map(e => (
        <EventCard key={e._id} data={e} children={children(e)} />
      ))}
      {events.length === 0 && <Statement content='No goals to display.' />}
    </div>
  )
}

const PastEvents = props => {
  const { currentUser } = props

  let history = useHistory()

  const { data, loading, error } = useQuery(fetchAllPastEvents)

  if (loading) return <LoadingSpinner />

  if (error) {
    captureFilteredError(error)
    return null
  }

  const events = (data && data.fetchAllPastEvents) || []

  const handleDetail = id => {
    history.push(`/past-event/${id}`)
  }

  const children = e => (
    <div className='my-events__container'>
      <button
        className='el-button el-button--default details-button'
        onClick={() => handleDetail(e._id)}
      >
        <span>See Details</span>
      </button>
      <div className='my-events__message'>
        <IconInfo className='my-events__message-icon-info' />
        <div>
          <Link>Available event recording!</Link>
        </div>
      </div>
    </div>
  )
  return (
    <div className='events__container'>
      {events.map(e => (
        <EventCard key={e._id} data={e} children={children(e)} />
      ))}
      {events.length === 0 && <Statement content='No goals to display.' />}
    </div>
  )
}

export default ({ currentUser }) => {
  const { data, loading, error } = useQuery(fetchAllInvitations)

  const events = (data && data.fetchAllInvitations) || []

  const setInvitationsCount = () => {
    const invitationsCount = events.length
    const node = document.querySelector('.tabs-title__extra-prop__invitations')
    node.innerText = invitationsCount
  }

  useEffect(() => {
    setInvitationsCount()
  }, [])

  if (loading) return <LoadingSpinner />

  if (error) {
    captureFilteredError(error)
    return null
  }

  return (
    <div className='component-block--paths'>
      <Switch>
        <Route path='/events/my-events' exact>
          <MyEvents />
        </Route>
        <Route path='/events/invitations' exact>
          <Invitations currentUser={currentUser} events={events} />
        </Route>
        <Route path='/events/past' exact>
          <PastEvents />
        </Route>
        {(currentUser.leader || currentUser.roles.indexOf('ADMIN') !== -1) && (
          <Route path='/events/manage-events' exact>
            <AdminEvents />
          </Route>
        )}
        <Route>
          <Redirect to='/events/my-events' />
        </Route>
      </Switch>
      <style jsx>{eventsStyle}</style>
    </div>
  )
}
