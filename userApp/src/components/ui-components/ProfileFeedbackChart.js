import React from 'react'
import { Radar } from 'react-chartjs-2'

const PFlevels = [' - ', 'Zu wenig', 'Wenig', 'Stark', 'Übertrieben', ' - ']

const commonSettings = {
  borderWidth: 1,
  pointBackgroundColor: '#ffffff',
  pointBorderWidth: 2,
  pointRadius: 2
}

const chartData = (skills, labels, premium) => ({
  labels: labels.map(
    label => `${label.slice(0, 30)}${label.length > 30 ? '...' : ''}`
  ),
  datasets: [
    premium && {
      backgroundColor: 'rgba(41, 163, 153, .2)',
      borderColor: 'rgb(41, 163, 153)',
      pointBorderColor: 'rgb(41, 163, 153)',
      label: 'Feedback',
      data: skills.needed,
      ...commonSettings
    },
    {
      backgroundColor: 'rgba(90, 85, 171, .2)',
      borderColor: 'rgb(90, 85, 171)',
      pointBorderColor: 'rgb(90, 85, 171)',
      label: 'Self',
      data: skills.available,
      ...commonSettings
    }
  ].filter(d => !!d)
})

const options = (corporate = false, labels) => ({
  legend: {
    display: false
  },
  scale: {
    ticks: {
      min: 0,
      max: corporate ? 4 : 5,
      stepSize: 1
    }
  },
  tooltips: {
    callbacks: {
      title: function(tooltipItems, data) {
        return `${data.datasets[tooltipItems[0].datasetIndex].label}`
      },
      label: function(tooltipItem) {
        const level = Number(tooltipItem.yLabel)
        return `${labels[tooltipItem.index]}: ${
          level === 0
            ? 'N/A'
            : corporate
            ? `${level.toFixed(2)} (${PFlevels[Math.round(level)]})`
            : level.toFixed(2)
        }`
      }
    }
  }
})

const ProfileFeedbackChart = ({
  skills,
  labels,
  corporate,
  premium,
  ...other
}) => (
  <Radar
    data={chartData(skills, labels, premium)}
    options={options(corporate, labels)}
    {...other}
  />
)

export default ProfileFeedbackChart
