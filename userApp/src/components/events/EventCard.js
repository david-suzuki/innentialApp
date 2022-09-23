import React from 'react'
import moment from 'moment'
import eventCardStyle from '$/styles/eventCardStyle'

const EventCard = ({ data, children }) => {
  const imgSrc = !data.imageLink
    ? require('$/static/learning-path-picture.png')
    : data.imageLink

  return (
    <div className='event-card__container'>
      <div className='event-card'>
        <img className='event-card__image' src={imgSrc} alt='event' />
        <div style={{ position: 'relative' }}>
          <div className='event-card__date'>
            {data.scheduleFromDate === null && (
              <span className='date__anytime'>ANYTIME</span>
            )}
            {data.isOnedayEvent && (
              <div className='date__one-day'>
                <div className='date__day'>
                  {moment(new Date(data.scheduleFromDate)).format('DD')}
                </div>
                <div className='date__month'>
                  {moment(new Date(data.scheduleFromDate))
                    .format('MMM')
                    .toUpperCase()}
                </div>
              </div>
            )}
            {!data.isOnedayEvent &&
              data.scheduleFromDate &&
              data.scheduleToDate && (
                <div className='date__two-days'>
                  <div>
                    <div className='date__day'>
                      {moment(new Date(data.scheduleFromDate)).format('DD')}
                    </div>
                    <div className='date__month'>
                      {moment(new Date(data.scheduleFromDate))
                        .format('MMM')
                        .toUpperCase()}
                    </div>
                  </div>
                  <div> - </div>
                  <div>
                    <div className='date__day'>
                      {moment(new Date(data.scheduleToDate)).format('DD')}
                    </div>
                    <div className='date__month'>
                      {moment(new Date(data.scheduleToDate))
                        .format('MMM')
                        .toUpperCase()}
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
        <div className='event-card__title'>{data.title}</div>
        <div className='event-card__info'>
          <span>{data.eventType}</span>
          <span className='event__format'>{data.format}</span>
          {/* <span>Innential</span> */}
        </div>

        <style jsx>{eventCardStyle}</style>
      </div>
      <div className='event-card__footer'>{children}</div>
    </div>
  )
}

export default EventCard
