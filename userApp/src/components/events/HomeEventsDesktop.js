import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import homeEventsDesktopStyle from '../../styles/homeEventsDesktopStyle'
import { ReactComponent as ClockIcon } from '$/static/clock-icon.svg'
import { fetchAllMyEvents } from '../../api'
import { captureFilteredError, LoadingSpinner } from '../general'

const HomeEventsDesktop = () => {
  const { data, loading, error } = useQuery(fetchAllMyEvents)

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

  return (
    <div className='home-desktop__events-container'>
      <div className='home-desktop__events-header'>
        <div className='home-desktop__events-header__title'>
          <i className='el-icon-star-off' />
          <span style={{ margin: '0 6px 0 8px' }}>Upcoming Events</span>
          {upcomingEvents.length > 0 && (
            <span className='home-desktop__events-count'>
              {upcomingEvents.length}
            </span>
          )}
        </div>
        {upcomingEvents.length > 0 && (
          <div className='home-desktop__events-header__link'>
            <Link to='/events'>View All</Link>
          </div>
        )}
      </div>
      <div className='home-desktop__events'>
        {upcomingEvents.length > 0 ? (
          <>
            {Object.keys(events).map(function(keytitle, keyIndex) {
              return (
                <div className='home-desktop__events__item' key={keyIndex}>
                  <div className='events__item-date'>
                    {` ${new Date(keytitle).toLocaleDateString('en-US', {
                      day: 'numeric'
                    })} ${new Date(keytitle).toLocaleDateString('en-US', {
                      month: 'long'
                    })}`}
                  </div>

                  {events[keytitle].map(function(event) {
                    return (
                      <Link to={`/event/${event._id}`} key={event._id}>
                        <div className='events__item-info'>
                          <div
                            className='events__item-info__image'
                            style={{
                              backgroundImage: `url(${imgSrc(event)})`
                            }}
                          ></div>
                          <div className='events__item-info__details'>
                            <div className='events__item-info__detail-type'>
                              {event.eventType}
                            </div>
                            <div className='events__item-info__details-name'>
                              <span title={event.title}>{event.title}</span>
                              <i className='el-icon-arrow-right' />
                            </div>
                            <div className='events__item-info__details-time'>
                              <ClockIcon className='clock-icon' />
                              {new Date(
                                event.scheduleFromDate
                              ).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )
            })}
          </>
        ) : (
          <div className='home-desktop__events__item'>
            <div className='no-events'>
              <span>It seems like you don’t have any upcoming events.</span>
              <Link to='/events'>
                <div className='el-button no-events__button'>
                  <span>Visit Events page </span>
                  <i className='el-icon-arrow-right' />
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
      <style jsx>{homeEventsDesktopStyle}</style>
    </div>
  )
}

export default HomeEventsDesktop
