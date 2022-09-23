import React from 'react'
import GenerateCalendarEvents from './GenerateCalendarEvents'
import googleCalendarLogo from '$/static/google-calendar.svg'
import outlookLogo from '$/static/office-outlook.png'

const calendarHelper = new GenerateCalendarEvents()

export default ({ title, fromDate, toDate, description, isOnedayEvent }) => {
  const calendarOptions = [
    { label: 'Outlook', value: 'outlook', icon: outlookLogo },
    { label: 'Google Calendar', value: 'google', icon: googleCalendarLogo }
  ]

  return (
    <div className='event-calendars'>
      {calendarOptions.map(({ label, value: calendar, icon }) => (
        <div
          onClick={() => {
            const event = {
              title: title,
              location: '',
              description: description,
              startTime: fromDate,
              endTime: isOnedayEvent ? fromDate : toDate
            }
            const url = calendarHelper.buildUrl(event, calendar)

            window.open(url, '_blank')
          }}
        >
          <img src={icon} />
        </div>
      ))}
    </div>
  )
}
