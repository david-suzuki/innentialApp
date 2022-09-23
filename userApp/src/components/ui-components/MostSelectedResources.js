import React from 'react'
import { Polar } from 'react-chartjs-2'
import { useQuery } from '@apollo/react-hooks'
import { fetchMostPopularResources } from '../../api'
import { Statement } from '.'
import { captureFilteredError, LoadingSpinner } from '../general'
import { capitalize } from '../user-onboarding/utilities'

const MostSelectedResources = ({ organizationId }) => {
  const { data, loading, error } = useQuery(fetchMostPopularResources, {
    variables: { organizationId }
    // fetchPolicy: 'network-only'
  })
  if (loading) return <LoadingSpinner />

  if (error) {
    captureFilteredError(error)
    return <Statement content='Oops! Something went wrong.' />
  }

  if (data && data.fetchMostPopularResources) {
    const otherObj = {
      type: 'OTHER',
      users: 0
    }

    const formattedData = data.fetchMostPopularResources.map(item => {
      return item.type !== 'E-LEARNING' &&
        item.type !== 'ARTICLE' &&
        item.type !== 'BOOK'
        ? { ...otherObj, users: otherObj.users++ }
        : item
    })

    if (formattedData.length === 0) {
      return (
        <div className='doughnut-chart__placeholder'>
          Not enough data to display Most Popular Resources
        </div>
      )
    }

    const idx = formattedData.length - 1
    const otherSum = formattedData[idx]

    const finalData =
      otherObj.users > 0
        ? formattedData.filter(item => item.type !== 'OTHER').concat([otherSum])
        : formattedData

    const resourcesTypes = finalData.map(({ type }) => capitalize(type))

    const chartData = finalData.map(({ users }) => users)

    const total = chartData.reduce((acc, curr) => acc + curr, 0)
    const percentageData = chartData
      .sort((a, b) => b - a)
      .map(quantity => parseFloat((quantity * 100) / total).toFixed(1))

    const formattedLabels = []
    for (let i = 0; i < percentageData.length; i++) {
      formattedLabels.push(`${resourcesTypes[i]} ${percentageData[i]}% `)
    }

    // console.log(formattedLabels)

    const colors = [
      // variables.darkGreen,
      ' rgba(41, 163, 153, 0.5)',
      // variables.brandPrimary,
      'rgba(90, 85, 171,0.5)',
      // variables.lightMustard
      'rgba(245, 183, 100, 0.5)',
      // variables.fadedRed,
      'rgba(220, 50, 80, 0.5)'
    ]

    const hoverColors = [
      // variables.darkGreen,
      ' rgba(41, 163, 153, 0.7)',
      // variables.brandPrimary,
      'rgba(90, 85, 171, 0.7)',
      // variables.lightMustard
      'rgba(245, 183, 100, 0.7)',
      // variables.fadedRed,
      'rgba(220, 50, 80, 0.7)'
    ]

    const options = {
      // elements: {
      //   arc: {
      //     borderWIdth: 4
      //   }
      // },
      animation: {
        duration: 0.5
      },
      startAngle: -Math.PI / 4,
      scale: {
        ticks: {
          min: 0,
          max: 100,

          fontSize: 14
          // backdropColor: 'rgba(255, 255, 255, 0)'
        },
        scaleLabel: {
          display: true
        },
        gridLines: {
          offsetGridLines: false,
          lineWidth: 1,
          drawBorder: false
        }
      },
      angleLines: {
        display: true
      },

      legend: {
        display: false
      },

      tooltips: {
        enabled: true,
        bodyFontFamily: 'Poppins',
        callbacks: {
          label: function(tooltipItems, data) {
            return data.labels[tooltipItems.index]
          }
        }
      },
      maintainAspectRatio: false
    }

    const getChartData = canvas => {
      const data = {
        datasets: [
          {
            data: percentageData,
            backgroundColor: colors,
            hoverBackgroundColor: hoverColors,
            borderAlign: 'nearest',
            borderWidth: 3,
            borderColor: 'transparent'
          }
        ],
        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: formattedLabels
      }

      return data
    }

    const Legend = ({ data, peopleQty, colors }) => {
      return (
        <div className='doughnut-chart__legend'>
          {data.map((percentage, idx) => {
            const formattedLabel = resourcesTypes[idx]
              ? resourcesTypes[idx].toLowerCase()
              : 'Other'

            const nUsers = peopleQty[idx]
            return (
              nUsers > 0 && (
                <div key={idx}>
                  <div
                    className='legend-color'
                    style={{ backgroundColor: colors[idx] }}
                  />
                  <span>{`${percentage} % (${nUsers} people)`} </span>
                  <span> {formattedLabel}</span>
                </div>
              )
            )
          })}
        </div>
      )
    }

    return (
      <div className='doughnut-chart__container'>
        <div
          style={{
            position: 'relative',
            height: '255px',
            width: '255px'
          }}
        >
          <Polar data={canvas => getChartData(canvas)} options={options} />
        </div>
        <Legend data={percentageData} peopleQty={chartData} colors={colors} />
      </div>
    )
  }
  return null
}

export default React.memo(MostSelectedResources)
