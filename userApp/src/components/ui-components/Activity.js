import React, { useState } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { Line } from 'react-chartjs-2'
import { testMutation } from '../../api/_mutations'
import { fetchActivity, fetchActivityForTeams } from '../../api/_queries'

import variables from '../../styles/variables'
import { LoadingSpinner } from '../general'
import { DashboardSelect, Statement } from './'

const Activity = ({
  setActivityError,
  setLoadingActivity,
  timeSpan,
  isAdmin = true,
  leaderId
}) => {
  const query = isAdmin ? fetchActivity : fetchActivityForTeams

  const queryName = isAdmin ? 'fetchActivity' : 'fetchActivityForTeams'

  const {
    data: dataQuery,
    loading: loadingQuery,
    error: errorQuery
  } = useQuery(query, {
    variables: leaderId ? { leaderId, timeSpan } : { timeSpan },
    fetchPolicy: 'cache-and-network'
  })
  // const [mutate, { loading: loadingMutation }] = useMutation(testMutation)

  // const calculateDate = (date, addition) => {
  //   const beaconDate = new Date(date)
  //   const finalDate = new Date(beaconDate)
  //   const currentDate = beaconDate.getDate()
  //   finalDate.setDate(currentDate + addition)
  //   return new Date(finalDate).toDateString()
  // }

  const commonOptions = {
    lineTension: 0.6,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderWidth: 2
  }

  if (loadingQuery) {
    // setLoadingActivity(true)
    return <LoadingSpinner />
  }

  if (errorQuery) {
    return <Statement content='Oops! Something went wrong' />
  }

  if (dataQuery) {
    // setLoadingActivity(false)
    // NULL CHECK: If data returned from the query was null (such as in case of an error) the app would crash
    const { learningStarted = [], learningCompleted = [], xAxis = [] } =
      (dataQuery && dataQuery[queryName]) || {}

    if (
      learningStarted.length === 0 &&
      learningCompleted.length === 0 &&
      xAxis.length === 0
    ) {
      return (
        <div className='dashboard-activity__placeholder'>
          Not enough data to display Activity chart in this time range
        </div>
      )
    }

    // const sliceIndex = learningStarted.findIndex(element => element > 0)

    const labels = xAxis.map((label, idx) =>
      xAxis.length < 12 || idx % 3 === 0 || idx === xAxis.length - 1
        ? label
        : ' '
    )
    // timeSpan !== 'LAST_MONTH' && sliceIndex <= 5
    //   ? xAxis.slice(sliceIndex)
    //   : xAxis
    //       .slice(sliceIndex)

    const options = {
      tooltips: {
        enabled: true,
        bodyFontFamily: 'Poppins',
        callbacks: {
          title: function(tooltipItems) {
            return `${xAxis[tooltipItems[0].index]}`
          },
          label: (tooltipItems, data) =>
            ` ${data.datasets[tooltipItems.datasetIndex].label}: ${
              tooltipItems.value
            }`
        }
      },
      legend: {
        display: false
      },
      maintainAspectRatio: false,
      responsive: true
    }

    const data = {
      datasets: [
        {
          label: 'Started',
          data: learningStarted,
          borderColor: variables.brandPrimary,
          pointBackgroundColor: variables.brandPrimary,
          ...commonOptions
        },
        {
          label: 'Completed',
          data: learningCompleted,
          borderColor: variables.darkGreen,
          pointBackgroundColor: variables.darkGreen,
          ...commonOptions
        }
      ],
      labels
    }

    // NULL CHECK: There was no default value in the reduce function, so if the array was empty, this will throw an error

    const totalCompleted = learningCompleted.reduce(
      (acc, curr) => acc + parseInt(curr),
      0
    )

    const totalStarted = learningStarted.reduce(
      (acc, curr) => acc + parseInt(curr),
      0
    )

    const legendData = [
      {
        total: totalCompleted,
        color: variables.darkGreen,
        title: 'Total learning completed'
      },
      {
        total: totalStarted,
        color: variables.brandPrimary,
        title: 'Total learning in progress'
      }
    ]

    // const handleMutation = () => {
    //   mutate()
    //     .then(res => {
    //       console.log(res)
    //     })
    //     .catch(e => {
    //       console.log(e)
    //     })
    // }

    return (
      <div>
        <div className='dashboard-activity__head'>
          <div className='dashboard-activity__legend'>
            {legendData.map(({ title, color, total }) => (
              <div key={title}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}
                >
                  <div
                    className='legend-color'
                    style={{ backgroundColor: color }}
                  />
                  <h4>{title}</h4>
                </div>

                <div className='legend__total'>{total}</div>
              </div>
            ))}
          </div>
        </div>
        <div className='dashboard-activity__chart-container'>
          <Line data={data} options={options} />
        </div>
        {/* {loadingMutation ? (
          <span>Loading...</span>
        ) : (
          <button onClick={handleMutation}>test mutation</button>
        )} */}
      </div>
    )
  }
  // NULL CHECK: There always should be a return null statement on the bottom of the component, because returning nothing
  // from a render function in React throws an error
  return null
}

export default React.memo(Activity)
