import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { fetchLearningContentRating } from '../../../api'
import { Loading, Message, Progress } from 'element-react'

const updateContentStats = (learningContentId, contentsStats) => {
  const contentStats = contentsStats.find(
    contentStats => contentStats.contentId === learningContentId
  )

  const startedCount =
    contentStats.completedCount + contentStats.inProgressCount
  contentStats.startedDescription = startedCount

  const percentage =
    startedCount === 0 ? 0 : contentStats.completedCount / startedCount
  contentStats.completedDescription = `${contentStats.completedCount} (${(
    percentage * 100
  ).toFixed(1)}%)`

  return contentStats
}

const ContentStats = ({ content, goalStats, organizationId }) => {
  const contentStats = goalStats
    ? updateContentStats(content._id, goalStats.learningContentStatistics)
    : null

  const contentStatsText = contentStats
    ? `${contentStats.startedDescription} | ${contentStats.completedDescription}`
    : ''

  const { data, loading, error } = useQuery(fetchLearningContentRating, {
    variables: { learningContentId: content._id, organizationId }
  })

  if (loading) return <Loading />

  if (error) {
    Message({
      message: `Error! ${error.message}`,
      type: 'error'
    })
    return null
  }

  if (data) {
    const ratingInfo = data.fetchLearningContentRating
    const rating = (ratingInfo.rating || []).map(r => {
      const sum = r.interesting + r.uninteresting

      r.percentages = [
        sum > 0 ? Math.round((r.interesting * 100) / sum) : 0,
        sum > 0 ? Math.round((r.uninteresting * 100) / sum) : 0
      ]
      return r
    })

    const average = ratingInfo.average ? ratingInfo.average.toFixed(2) : 'N/A'

    return (
      <>
        <li>
          {content.type} - {content.title} | {contentStatsText}
        </li>
        <div
          style={{
            paddingTop: '5px',
            paddingBottom: '20px'
          }}
        >
          <div
            style={{
              paddingTop: '10px',
              paddingBottom: '5px'
            }}
          >
            Total Feedback: {average} ({ratingInfo.count}{' '}
            {ratingInfo.count === 1 ? 'user' : 'users'})
          </div>
          {rating.map((r, index) => (
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                paddingTop: '5px',
                paddingBottom: '5px'
              }}
              key={`${content._id}:${index}`}
            >
              <div style={{ paddingRight: '5px' }}>({index + 1})</div>
              <div style={{ width: '75%' }}>
                <Progress percentage={Math.round(r.countRatio * 100)} />
              </div>
              <span
                style={{
                  width: '100%',
                  whiteSpace: 'nowrap'
                }}
              >
                ({r.count} {r.count === 1 ? 'user' : 'users'} -{' '}
                {`${r.percentages[0]}% interested`}
                {' / '}
                {`${r.percentages[1]}% uninterested`})
              </span>
            </div>
          ))}
        </div>
      </>
    )
  }
  return null
}

export default ContentStats
