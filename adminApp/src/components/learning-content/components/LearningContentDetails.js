import React from 'react'
import { Loading, Message, Progress } from 'element-react'
import { useQuery } from 'react-apollo'
import { localizedTime } from '../../general/utilities'
import { fetchLearningContentRating } from '../../../api'

const LearningContentRatingElement = ({ contentId }) => {
  const { data, loading, error } = useQuery(fetchLearningContentRating, {
    variables: { learningContentId: contentId }
  })

  if (loading) return <Loading />

  if (error) {
    Message({
      message: `Error! ${error.message}`,
      type: 'error'
    })
  }

  if (data) {
    const ratingInfo = data.fetchLearningContentRating
    const rating = ratingInfo.rating.map(r => {
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
        <div style={{ paddingBottom: '5px' }}>
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
          >
            <div style={{ paddingRight: '5px' }}>({index + 1})</div>
            <div style={{ width: '100%' }}>
              <Progress percentage={Math.round(r.countRatio * 100)} />
            </div>
            <span style={{ width: '100%', whiteSpace: 'nowrap' }}>
              ({r.count} {r.count === 1 ? 'user' : 'users'} -{' '}
              {`${r.percentages[0]}% interested`}
              {' / '}
              {`${r.percentages[1]}% uninterested`})
            </span>
          </div>
        ))}
      </>
    )
  }

  return null
}

// TODO: wrap this component into query so that not all content is loaded upfront on the list
const LearningContentDetails = ({ data }) => {
  return (
    <div>
      <div style={{ display: 'inline-block' }}>
        <div className='field'>
          <strong>Created At:</strong> {localizedTime(data.createdAt)}
        </div>
        <div className='field'>
          <strong>Type:</strong> {data.type}
        </div>
        <div className='field'>
          <strong>Content Title:</strong> {data.title}
        </div>
        <div className='field'>
          <strong>URL:</strong> <a href={data.url}>{data.url}</a>
        </div>
        <div className='field'>
          <strong>Source:</strong> {data.source.name}
        </div>
        {data.author && (
          <div className='field'>
            <strong>Author:</strong> {data.author}
          </div>
        )}
        {(data.price.currency || data.price.value) && (
          <div className='field'>
            <strong>Price:</strong>
            <span>{data.price.currency} </span>
            <span>{data.price.value}</span>
          </div>
        )}
        {data.duration && (
          <div className='field'>
            <strong>Duration:</strong>
            {data.duration.basis === 'ONE TIME' ? (
              <>
                <span>{data.duration.hours || 0} hours </span>
                <span>{data.duration.minutes || 0} minutes</span>
              </>
            ) : (
              <>
                <span>{data.duration.weeks} weeks, </span>
                <span>
                  {data.duration.hoursMin} - {data.duration.hoursMax} h/week
                </span>
              </>
            )}
          </div>
        )}
        <div className='field'>
          <strong>Certified:</strong>
          <span>{data.certified ? 'Yes' : 'No'}</span>
        </div>
        {data.relatedPrimarySkills && data.relatedPrimarySkills.length > 0 && (
          <div className='field'>
            <strong>Related Primary Skills:</strong>
            {data.relatedPrimarySkills.map((skill, i) => {
              return (
                <div key={i}>
                  <p>{skill.name}</p>
                  <p>
                    <strong>Skill Level:</strong> {skill.skillLevel}
                  </p>
                  <p>
                    <strong>Importance:</strong> {skill.importance}
                  </p>
                </div>
              )
            })}
          </div>
        )}
        {data.relatedSecondarySkills && data.relatedSecondarySkills.length > 0 && (
          <div className='field'>
            <strong>Related Secondary Skills:</strong>
            {data.relatedSecondarySkills.map((skill, i) => {
              return <p key={i}>{skill.name}</p>
            })}
          </div>
        )}
        {data.relatedIndustries && data.relatedIndustries.length > 0 && (
          <div className='field'>
            <strong>Related Industries:</strong>
            {data.relatedIndustries.map((industry, i) => {
              return <p key={i}>{industry.name}</p>
            })}
          </div>
        )}
        {data.relatedInterests && data.relatedInterests.length > 0 && (
          <div className='field'>
            <strong>Related Interests:</strong>
            {data.relatedInterests.map((interest, i) => {
              return <p key={i}>{interest.name}</p>
            })}
          </div>
        )}
        {data.relatedLineOfWork && data.relatedLineOfWork.name && (
          <div className='field'>
            <strong>Related Line Of Work:</strong>
            <p>{data.relatedLineOfWork.name}</p>
          </div>
        )}
        <div className='field'>
          <strong>Spider:</strong> {data.spider ? data.spider : 'N/A'}
        </div>
      </div>
      <div style={{ paddingTop: '30px' }}>
        {LearningContentRatingElement({ contentId: data._id })}
      </div>
    </div>
  )
}

export default LearningContentDetails
