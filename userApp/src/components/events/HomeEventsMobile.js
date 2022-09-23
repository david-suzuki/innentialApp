import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'
import { useQuery } from '@apollo/react-hooks'
import homeEventsMobileStyle from '../../styles/homeEventsMobileStyle'
import { ReactComponent as ClockIcon } from '$/static/clock-icon.svg'
import { fetchAllMyEvents } from '../../api'
import { captureFilteredError, LoadingSpinner } from '../general'

const HomeEventsMobile = () => {
  const { data, loading, error } = useQuery(fetchAllMyEvents)
  const [showDropdown, setShowDropdown] = useState(false)

  if (loading) return <LoadingSpinner />

  if (error) {
    captureFilteredError(error)
    return null
  }

  const upcomingEvents = (data && data.fetchAllMyEvents) || []

  const dates = new Set([])
  for (let event of upcomingEvents) {
    dates.add(event.scheduleFromDate)
  }
  const events = {}
  for (let event of dates) {
    events[event] = upcomingEvents.filter(e => e.scheduleFromDate === event)
  }

  const imgSrc = event => {
    const imageLink = !event.imageLink
      ? require('$/static/learning-path-picture.png')
      : event.imageLink

    return imageLink
  }

  return data.length > 0 ? (
    <div className='home__events'>
      <div
        className='home__events-header'
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <div className='home__events-header__title'>
          <i className='el-icon-star-off' />
          <span>Upcoming Events</span>
          <span className='home__events-count'>{upcomingEvents.length}</span>
        </div>
        <i
          className={showDropdown ? 'el-icon-arrow-up' : 'el-icon-arrow-down'}
        />
      </div>
      <CSSTransition
        in={showDropdown}
        timeout={200}
        classNames='show-dropdown'
        unmountOnExit
      >
        <div className='home__events-dropdown'>
          {Object.keys(events).map(function(keyName, keyIndex) {
            return (
              <div className='home__events-dropwdown__item' key={keyIndex}>
                <div className='dropwdown__item-date'>
                  {` ${new Date(keyName).toLocaleDateString('en-US', {
                    day: 'numeric'
                  })} ${new Date(keyName).toLocaleDateString('en-US', {
                    month: 'long'
                  })}`}
                </div>

                {events[keyName].map(function(event) {
                  return (
                    <Link to={`/event/${event._id}`} key={event.id}>
                      <div className='dropwdown__item-info'>
                        <div
                          className='dropwdown__item-info__image'
                          style={{
                            backgroundImage: `url(${imgSrc(event)})`
                          }}
                        ></div>
                        <div className='dropwdown__item-info__details'>
                          <div className='dropwdown__item-info__detail-type'>
                            {event.type}
                          </div>
                          <div className='dropwdown__item-info__details-name'>
                            <span title={event.name}>{event.name}</span>
                          </div>
                          <div className='dropwdown__item-info__details-time'>
                            <ClockIcon className='clock-icon' />
                            {new Date(event.startTime).toLocaleTimeString(
                              'en-US',
                              {
                                hour: '2-digit',
                                minute: '2-digit'
                              }
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )
          })}
        </div>
      </CSSTransition>
      <style jsx>{homeEventsMobileStyle}</style>
    </div>
  ) : null
}

export default HomeEventsMobile
