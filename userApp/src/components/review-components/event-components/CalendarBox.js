import React from 'react'
import { Button } from 'element-react'
import GenerateCalendarEvents from '../../../utils/GenerateCalendarEvents'
import googleCalendarLogo from '../../../static/Google-Calendar-icon.png'
import appleLogo from '../../../static/apple-classic-logo-vector.png'
import outlookLogo from '../../../static/outlook-logo-vector.png'
import { captureFilteredError } from '../../general'

const calendarHelper = new GenerateCalendarEvents()

export default ({
  reviewName,
  firstReviewStart,
  calendarEmails,
  userId,
  reviewId,
  scheduleEvent
}) => {
  const calendarOptions = [
    { label: 'Google Calendar', value: 'google', icon: googleCalendarLogo },
    { label: 'Outlook', value: 'outlook', icon: outlookLogo },
    { label: 'Apple Calendar', value: 'apple', icon: appleLogo }
  ]

  return calendarOptions.map(({ label, value: calendar, icon }) => (
    <div style={{ padding: '10px 24px 10px 0px' }}>
      <Button
        style={{
          width: '100%',
          fontWeight: 'bold',
          color: 'black',
          borderRadius: '32px'
        }}
        size='large'
        onClick={async () => {
          const event = {
            title: reviewName,
            location: '',
            description: '',
            startTime: firstReviewStart,
            endTime: new Date(firstReviewStart.getTime() + 3.6e6),
            addUsers: calendarEmails
          }
          const url = calendarHelper.buildUrl(event, calendar)
          if (
            !calendarHelper.isMobile() &&
            (url.startsWith('data') || url.startsWith('BEGIN'))
          ) {
            const filename = 'download.ics'
            const blob = new Blob([url], {
              type: 'text/calendar;charset=utf-8'
            })

            // if (this.state.isCrappyIE) {
            //   window.navigator.msSaveOrOpenBlob(blob, filename);
            // } else
            {
              /****************************************************************
              // many browsers do not properly support downloading data URIs
              // (even with "download" attribute in use) so this solution
              // ensures the event will download cross-browser
              ****************************************************************/
              const link = document.createElement('a')
              link.href = window.URL.createObjectURL(blob)
              link.setAttribute('download', filename)
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            }
          } else {
            window.open(url, '_blank')
          }
          try {
            await scheduleEvent({
              variables: {
                userId,
                reviewId,
                scheduledDate: firstReviewStart
              }
            })
          } catch (e) {
            captureFilteredError(e)
          }
        }}
      >
        <img src={icon} style={{ height: '32px', marginRight: '10px' }} />
        <span style={{ lineHeight: '32px', verticalAlign: 'bottom' }}>
          {label}
        </span>
      </Button>
    </div>
  ))
}
