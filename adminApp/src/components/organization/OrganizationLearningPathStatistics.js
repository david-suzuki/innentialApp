import React from 'react'
import { useQuery } from 'react-apollo'
import { Loading, Message, Table } from 'element-react'
import { fetchLearningPathStatistics } from '../../api'
import { ContentStats } from '../path-templates/components'

const updatePathStats = (learningPathId, pathsStats) => {
  const pathStats = pathsStats.find(
    pathStats => pathStats.learningPathId === learningPathId
  )

  const startedCount = pathStats.completedCount + pathStats.inProgressCount
  pathStats.startedDescription = startedCount

  const percentage =
    startedCount === 0 ? 0 : pathStats.completedCount / startedCount
  pathStats.completedDescription = `${pathStats.completedCount} (${(
    percentage * 100
  ).toFixed(1)}%)`

  return pathStats
}

const updateGoalStats = (learningGoalId, goalsStats) => {
  const goalStats = goalsStats.find(
    goalStats => goalStats.goalId === learningGoalId
  )

  const startedCount = goalStats.inProgressCount
  goalStats.startedDescription = startedCount

  const percentage =
    startedCount === 0 ? 0 : goalStats.completedCount / startedCount
  goalStats.completedDescription = `${goalStats.completedCount} (${(
    percentage * 100
  ).toFixed(1)}%)`

  return goalStats
}

const PathExpandDisplay = ({ pathStats, organizationId }) => {
  return (
    <div>
      <p>
        <strong>Learning Goals:</strong>
      </p>
      {pathStats.learningGoalStatistics.map(goalStats => {
        updateGoalStats(goalStats.goalId, pathStats.learningGoalStatistics)

        return (
          <div style={{ margin: 10 }} key={goalStats._id}>
            {goalStats.name} | {goalStats.startedDescription} |{' '}
            {goalStats.completedDescription}
            <ol style={{ textAlign: 'justify', paddingLeft: '15px' }}>
              {goalStats.learningContentStatistics.map(contentStats => {
                const { title, type, contentId } = contentStats

                const content = {
                  _id: contentId,
                  title,
                  type
                }

                return (
                  <ContentStats
                    key={`${goalStats._id}:${content._id}`}
                    goalStats={goalStats}
                    content={content}
                    organizationId={organizationId}
                  />
                )
              })}
            </ol>
          </div>
        )
      })}
    </div>
  )
}

const listColumns = organizationId => [
  {
    type: 'expand',
    expandPannel: data => {
      return (
        <PathExpandDisplay pathStats={data} organizationId={organizationId} />
      )
    }
  },
  {
    label: 'Learning Path',
    render: data => {
      return <div>{data.name}</div>
    }
  },
  {
    label: 'Started',
    render: data => {
      const pathStats = updatePathStats(data.learningPathId, [data])

      if (pathStats) {
        return <span>{pathStats.startedDescription}</span>
      }

      return <span>Unavailable</span>
    }
  },
  {
    label: 'Completed',
    render: data => {
      const pathStats = updatePathStats(data.learningPathId, [data])

      if (pathStats) {
        return <span>{pathStats.completedDescription}</span>
      }

      return <span>Unavailable</span>
    }
  }
]

const OrganizationLearningPathStatistics = ({ organizationId }) => {
  const { data, loading, error } = useQuery(fetchLearningPathStatistics, {
    variables: { organizationId }
  })

  if (loading) return <Loading />

  if (error) {
    Message({
      message: `Error! ${error.message}`,
      type: 'error'
    })
  }

  if (data) {
    const pathsStats = data.fetchLearningPathStatistics

    return (
      <Table
        style={{ width: '100%' }}
        columns={listColumns(organizationId)}
        data={pathsStats ? [...pathsStats] : []}
        stripe
      />
    )
  }

  return null
}

export default OrganizationLearningPathStatistics
