import React, { useEffect } from 'react'
import { GoalItem, UserFeedbackItem } from '../../ui-components'
import { Button } from 'element-react'
import history from '../../../history'

const GoalsOverviewPage = ({
  goals,
  handlePaging,
  goalsReviewed,
  feedbackFromOthers = []
}) => {
  useEffect(() => {
    if (history.location.pathname.includes('/goals/')) {
      const mainWrapper = document.getElementById('main-wrapper')
      mainWrapper.className = 'container-main__wrapper wrapper--right'
    }
  })
  return (
    <div>
      {goals.length > 0 && (
        <>
          <h4 className='align-left' style={{ marginBottom: '20px' }}>
            Goals to review:{' '}
          </h4>
          {goals.map(goal => (
            <GoalItem key={`goals-overview:goal:${goal._id}`} {...goal} />
          ))}
        </>
      )}
      {feedbackFromOthers.length > 0 && (
        <>
          <h4 className='align-left' style={{ marginBottom: '20px' }}>
            Feedback from others:{' '}
          </h4>
          {feedbackFromOthers.map(feedback => (
            <UserFeedbackItem
              key={`goals-overview:feedback:${feedback._id}`}
              {...feedback}
            />
          ))}
        </>
      )}
      <div className='page-footer page-footer--fixed'>
        <Button
          type='primary'
          size='large'
          style={{ marginBottom: '20px' }}
          onClick={e => {
            e.preventDefault()
            if (goalsReviewed) {
              handlePaging(2)
            } else handlePaging(1)
          }}
        >
          {goalsReviewed ? 'Set goals' : 'Start review'}
        </Button>
      </div>
    </div>
  )
}

export default GoalsOverviewPage
