import React from 'react'

const getWeekText = weeks => {
  const months = Math.floor(weeks / 4)
  const remainingWeeks = weeks % 4

  return `${months > 0 ? `${months} month${months > 1 ? 's' : ''} ` : ''}${
    remainingWeeks > 0
      ? `${remainingWeeks} week${remainingWeeks > 1 ? 's' : ''}`
      : ''
  }`
}

const getHourText = (hours, minutes) => {
  const totalHours = hours + Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  return `${
    totalHours > 0 ? `${totalHours} hour${totalHours > 1 ? 's' : ''} ` : ''
  }${
    remainingMinutes > 0
      ? `${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`
      : ''
  }`
}

const TotalDuration = ({ durationRanges, developmentPlan }) => {
  const { hours, minutes } = developmentPlan.reduce(
    (acc, curr) => {
      if (curr.duration) {
        let { basis, hoursMin, hoursMax, hours, minutes, weeks } = curr.duration
        if (basis === 'PER WEEK') {
          if (!weeks) {
            weeks = 4
          }
          const averageTimePerWeek = (hoursMin + hoursMax) / 2
          const totalTime = averageTimePerWeek * weeks

          return {
            ...acc,
            hours: acc.hours + totalTime
          }
        } else if (hours || minutes) {
          return {
            hours: acc.hours + (hours || 0),
            minutes: acc.minutes + (minutes || 0)
          }
        }
      } else if (curr.type === 'ARTICLE') {
        return { ...acc, minutes: acc.minutes + 5 }
      }
      return acc
    },
    { hours: 0, minutes: 0 }
  )

  const weeks = Math.floor(hours / durationRanges[0]?.maxHours)

  // if(weeks === 0) return null

  return (
    <div style={{ fontSize: '14px' }}>
      <span style={{ color: '#8494b2' }}>Approximate total duration: </span>
      <strong style={{ color: '#3b4b66', marginLeft: '8px' }}>
        {weeks > 0 ? getWeekText(weeks) : getHourText(hours, minutes)}
      </strong>
    </div>
  )
}

export default TotalDuration
