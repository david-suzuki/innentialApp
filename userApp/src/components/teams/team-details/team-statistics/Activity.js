import React, { useState } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { Bar } from 'react-chartjs-2'
import { fetchActivity, fetchActivityForTeam } from '../../../../api/_queries'
import { statsStyle } from '../../../../styles/statsStyle'
import variables from '../../../../styles/variables'
import { captureFilteredError, LoadingSpinner } from '../../../general'
import { ChartLegend, ListSort, Statement } from '../../../ui-components'

const Activity = ({ teamId, timeSpan }) => {
  const { data, loading, error } = useQuery(fetchActivityForTeam, {
    variables: { teamId, timeSpan },
    fetchPolicy: 'cache-and-network'
  })

  // const commonOptions = {
  //   lineTension: 0.6,
  //   backgroundColor: 'rgba(0, 0, 0, 0)',
  //   borderWidth: 2
  // }

  if (loading) {
    // setLoadingActivity(true)
    return <LoadingSpinner />
  }

  if (error) {
    captureFilteredError(error)
    return <Statement content='Oops! Something went wrong' />
  }

  if (data) {
    // setLoadingActivity(false)
    // NULL CHECK: If data returned from the query was null (such as in case of an error) the app would crash
    const { learningStarted = [], learningCompleted = [], xAxis = [] } =
      data?.fetchActivityForTeam || {}

    // MOCKUP DATA (TEMP)
    // xAxis = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
    // learningStarted = [7, 5, 3, 7, 0, 1, 3]
    // learningCompleted = [9, 12, 8, 10, 4, 0, 6]
    // END OF MOCKUP DATA (TEMP)

    if (
      learningStarted.length === 0 &&
      learningCompleted.length === 0 &&
      xAxis.length === 0
    ) {
      return (
        <div className='dashboard-activity__placeholder'>
          Not enough data to display Activity chart in this time range
          <style jsx>{statsStyle}</style>
        </div>
      )
    }

    const labels = xAxis.map((label, idx) =>
      xAxis.length < 12 || idx % 3 === 0 || idx === xAxis.length - 1
        ? label
        : ' '
    )

    const options = {
      scales: {
        yAxes: [
          {
            stacked: true,
            ticks: {
              beginAtZero: true,
              stepSize: 5
            }
          }
        ],
        xAxes: [
          {
            stacked: true
          }
        ]
      },
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
      }
    }

    const chartData = {
      datasets: [
        {
          label: 'In progress',
          data: learningStarted,
          backgroundColor: variables.brandPrimary,
          barThickness: xAxis.length < 8 ? 13 : 7
        },
        {
          label: 'Completed',
          data: learningCompleted,
          backgroundColor: variables.darkGreen,
          barThickness: xAxis.length < 8 ? 13 : 7
        }
      ],
      labels
    }

    return (
      <div>
        <div
          className='dashboard-activity__chart-container'
          style={{ padding: 10 }}
        >
          <Bar data={chartData} options={options} />
        </div>
        <style jsx>{statsStyle}</style>
      </div>
    )
  }
  return null
}

const sortMethodList = [
  { label: 'This week', value: 'THIS_WEEK' },
  { label: 'This month', value: 'THIS_MONTH' },
  { label: 'Last month', value: 'LAST_MONTH' },
  { label: 'This year', value: 'THIS_YEAR' },
  { label: 'All time', value: 'ALL_TIME' }
]

const ActivityWrapper = ({ teamId }) => {
  const [sortMethod, setSortMethod] = useState(
    sortMethodList.find(({ value }) => value === 'ALL_TIME') ||
      sortMethodList[0]
  )

  return (
    <div className='team-stats-item__wrapper'>
      <div className='team-stats-item__header'>Activity</div>
      <div className='team-stats-item__action'>
        <ListSort
          sortMethod={sortMethod?.label || ''}
          changeSortMethod={sortBy => setSortMethod(sortBy)}
          sortMethodList={sortMethodList}
        />
        <ChartLegend
          availableLabel='Total learning started'
          neededLabel='Total learning completed'
          padding={false}
        />
      </div>
      <div className='team-stats-item'>
        <Activity isAdmin={false} teamId={teamId} timeSpan={sortMethod.value} />
      </div>
    </div>
  )
}

export default React.memo(ActivityWrapper)
