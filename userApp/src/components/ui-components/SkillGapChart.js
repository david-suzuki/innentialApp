import React, { useContext } from 'react'
import { Radar } from 'react-chartjs-2'
import { UserContext } from '../../utils'

const PFlevels = [' - ', 'Zu wenig', 'Wenig', 'Stark', 'Übertrieben', ' - ']

const commonSettings = {
  borderWidth: 1,
  pointBackgroundColor: '#ffffff',
  pointBorderWidth: 2,
  pointRadius: 2
}

const chartData = (skills, labels, max) => ({
  labels: labels.map(
    label => `${label.slice(0, max)}${label.length > max ? '...' : ''}`
  ),
  datasets: [
    {
      backgroundColor: 'rgba(41, 163, 153, .2)',
      borderColor: 'rgb(41, 163, 153)',
      pointBorderColor: 'rgb(41, 163, 153)',
      label: 'Needed',
      data: skills.needed,
      ...commonSettings
    },
    {
      backgroundColor: 'rgba(90, 85, 171, .2)',
      borderColor: 'rgb(90, 85, 171)',
      pointBorderColor: 'rgb(90, 85, 171)',
      label: 'Available',
      data: skills.available,
      ...commonSettings
    }
  ]
})

const options = (corporate, labels) => ({
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

const SkillGapsChart = ({ skills, labels, maxLabelLength = 30, ...other }) => (
  <Radar
    data={chartData(skills, labels, maxLabelLength)}
    options={options(useContext(UserContext)?.corporate, labels)}
    {...other}
  />
)

export default SkillGapsChart
