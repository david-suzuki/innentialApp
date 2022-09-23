import React, { useState, Fragment, useEffect } from 'react'
import { generateInitialsAvatar, generateSpecialAvatar } from '$/utils'
import { Link, useParams } from 'react-router-dom'
import { MessageBox } from 'element-react'
import CalendarBox from './CalendarBox'
import singleEventStyle from '$/styles/singleEventStyle'
import { ReactComponent as IconCalendar } from '$/static/calendar.svg'
import { ReactComponent as IconClock } from '$/static/clock.svg'
import { ReactComponent as IconPlace } from '$/static/droppin.svg'
import { ReactComponent as IconAttendee } from '$/static/assignee.svg'
import { ReactComponent as IconWarning } from '$/static/warning.svg'
import { ReactComponent as IconInfo } from '$/static/info-icon.svg'
import { fetchEventById, declineInvitation, acceptInvitation } from '../../api'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { captureFilteredError, LoadingSpinner } from '../general'
import AddToCalendar from 'react-add-to-calendar'

const calendarItems = [{ outlook: 'Outlook' }, { google: 'Google' }]

const SingleEvent = ({ currentUser }) => {
  let { eventId } = useParams()

  const { data, loading, error } = useQuery(fetchEventById, {
    variables: {
      eventId
    }
  })

  const [mutateDecline] = useMutation(declineInvitation, {
    variables: {
      eventId
    },
    // refetchQueries: [{ query: fetchEventById, variables: { eventId } }]
    update: (proxy, { data: { declineInvitation: result } }) => {
      try {
        const { fetchEventById: prevRequest } = proxy.readQuery({
          query: fetchEventById,
          variables: { eventId }
        })

        proxy.writeQuery({
          query: fetchEventById,
          variables: { eventId },
          data: {
            fetchEventById: Object.assign(prevRequest, {
              invitations: result.invitations
            })
          }
        })
      } catch (e) {
        console.error(e)
      }
    }
  })

  const [mutateAccept] = useMutation(acceptInvitation, {
    variables: {
      eventId
    },
    // refetchQueries: [{ query: fetchEventById, variables: { eventId } }]
    update: (proxy, { data: { acceptInvitation: result } }) => {
      try {
        const { fetchEventById: prevRequest } = proxy.readQuery({
          query: fetchEventById,
          variables: { eventId }
        })

        proxy.writeQuery({
          query: fetchEventById,
          variables: { eventId },
          data: {
            fetchEventById: Object.assign(prevRequest, {
              invitations: result.invitations
            })
          }
        })
      } catch (e) {
        console.error(e)
      }
    }
  })

  const event = (data && data.fetchEventById) || {}

  const [inviteStatus, setInviteStatus] = useState('pending')

  let calendarEvent = {
    title: event.title,
    description: event.description,
    location: '',
    startTime: event.scheduleFromDate,
    endTime: event.isOnedayEvent ? event.scheduleFromDate : event.scheduleToDate
  }

  useEffect(() => {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const mailbtn = urlParams.get('mailbtn')

    if (mailbtn && mailbtn === 'accept') {
      mutateAccept().then(() => {
        setInviteStatus('accept')
        MessageBox.confirm(
          <div className='info__main-calendars__dialog'>
            <div>
              <div>Add this event</div>
              <div>to your calendar:</div>
            </div>
            <AddToCalendar event={calendarEvent} listItems={calendarItems} />
          </div>,
          ' ',
          {
            showCancelButton: false,
            showConfirmButton: false,
            showCancel: true
          }
        )
      })
    } else if (mailbtn && mailbtn === 'decline') {
      mutateDecline().then(() => {
        setInviteStatus('decline')
      })
    }
  }, [])

  useEffect(() => {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const mailbtn = urlParams.get('mailbtn')

    if (!mailbtn) {
      if (event.invitations) {
        const currentUserInvitation = event.invitations.find(
          invitation => invitation._id === currentUser._id
        )
        setInviteStatus(currentUserInvitation.status)
      }
    }
  }, [event])

  if (loading) return <LoadingSpinner />

  if (error) {
    captureFilteredError(error)
    return null
  }

  const imgSrc = !event.imageLink
    ? require('$/static/learning-path-picture.png')
    : event.imageLink

  const handleDecline = async () => {
    setInviteStatus('decline')
    await mutateDecline()
  }

  const handleAccept = async () => {
    setInviteStatus('accept')
    MessageBox.confirm(
      <div className='info__main-calendars__dialog'>
        <div>
          <div>Add this event</div>
          <div>to your calendar:</div>
        </div>
        <AddToCalendar event={calendarEvent} listItems={calendarItems} />
      </div>,
      ' ',
      {
        showCancelButton: false,
        showConfirmButton: false,
        showCancel: true
      }
    )
    await mutateAccept()
  }

  return (
    <div className='component-block--paths'>
      <Link to='/events'>
        <div className='back__button'>
          <i className='icon icon-small-right icon-rotate-180' />
          Back
        </div>
      </Link>

      <div className='event-container'>
        <div className='event-panel'>
          <div className='event-panel__info'>
            <div className='event-panel__info-top'>
              <div className='info__main'>
                <div className='info__main-title'>{event.title}</div>
                {inviteStatus === 'accept' ? (
                  <div className='event-message event-message__success'>
                    <IconInfo className='icon-info' />
                    <span>You have accepted this invitation.</span>
                  </div>
                ) : (
                  <div className='event-message event-message__warning'>
                    <IconWarning className='icon-warning' />
                    <span>You have declined this invitation.</span>
                  </div>
                )}
                {/* <button className='el-button el-button--primary register-button'>
                  <span>Register for event</span>
                </button>
                <button
                  className='el-button el-button--primary register-button register-button--success'
                  disabled
                >
                  <span>Registered!</span>
                </button> */}
                {inviteStatus === 'pending' && (
                  <Fragment>
                    <button className='el-button accept-button'>
                      <span>Accept</span>
                    </button>
                    <button className='el-button decline-button'>
                      <span>Decline</span>
                    </button>
                  </Fragment>
                )}
                {inviteStatus === 'accept' && (
                  <div className='invite-accept-div'>
                    <div className='info__main-calendars'>
                      <span>Add to calendar:</span>
                      <AddToCalendar
                        event={calendarEvent}
                        listItems={calendarItems}
                      />
                    </div>
                    <button
                      className='el-button decline-button'
                      style={{
                        marginLeft: 20
                      }}
                      onClick={handleDecline}
                    >
                      <span>Decline</span>
                    </button>
                  </div>
                )}
                {inviteStatus === 'decline' && (
                  <button
                    className='el-button accept-button--plain'
                    onClick={handleAccept}
                  >
                    <span>Accept</span>
                  </button>
                )}
              </div>
              <div className='info__rest'>
                <div className='info__rest-details'>
                  <div
                    className='info__rest-details__icon'
                    style={{
                      background: '#5A55AB'
                    }}
                  >
                    <IconCalendar />
                  </div>
                  <span className='info__rest-details__text'>
                    {` ${new Date(event.scheduleFromDate).toLocaleDateString(
                      'en-US',
                      {
                        day: 'numeric'
                      }
                    )} ${new Date(event.scheduleFromDate).toLocaleDateString(
                      'en-US',
                      {
                        month: 'long',
                        year: 'numeric'
                      }
                    )}`}
                  </span>
                </div>
                <div className='info__rest-details'>
                  <div
                    className='info__rest-details__icon'
                    style={{
                      background: '#2FBBB0'
                    }}
                  >
                    <IconClock
                      style={{
                        stroke: 'white'
                      }}
                    />
                  </div>
                  <span className='info__rest-details__text'>
                    {new Date(event.scheduleFromDate).toLocaleTimeString(
                      'en-US',
                      {
                        hour: '2-digit',
                        hour12: false,
                        minute: '2-digit'
                      }
                    )}
                  </span>
                </div>
                <div className='info__rest-details'>
                  <div
                    className='info__rest-details__icon'
                    style={{
                      background: '#347EB6'
                    }}
                  >
                    <IconPlace />
                  </div>
                  <span className='info__rest-details__text'>
                    {event.eventType}
                  </span>
                </div>
                <div className='info__rest-details'>
                  <div
                    className='info__rest-details__icon'
                    style={{
                      background: '#FEBB5B'
                    }}
                  >
                    <IconAttendee />
                  </div>
                  <div className='info__rest-details__attendees'>
                    {event.invitations.slice(0, 3).map(invitation => (
                      <img
                        key={invitation._id}
                        src={
                          invitation.imageLink ||
                          generateInitialsAvatar({
                            firstName: invitation.firstName,
                            lastName: invitation.lastName,
                            _id: invitation._id
                          })
                        }
                        alt='avatar'
                        width='37'
                        height='37'
                      />
                    ))}
                    {event.invitations.length > 3 && (
                      <img
                        src={generateSpecialAvatar({
                          initials: `+${event.invitations.length - 3}`,
                          initialBg: '#BDBBDD',
                          initialWeight: 900,
                          initialSize: 18,
                          size: 40
                        })}
                        alt='more-users'
                        width='37'
                        height='37'
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className='event-panel__info-bottom'>
              <div className='info__skills'>
                <span className='info__skills-title'>Related Skills:</span>
                <div className='info__skills-skills'>
                  {event.skills.map(skill => (
                    <div key={skill._id} className='info__skills-skills__skill'>
                      {skill.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <img
            className='event-panel__background'
            src={imgSrc}
            alt='background'
          />
        </div>
        <div className='event-description'>
          <div className='event-description__title'>Event Info:</div>
          <div className='event-description__text'>{event.description}</div>
        </div>
        <style jsx>{singleEventStyle}</style>
      </div>
    </div>
  )
}

export default SingleEvent
