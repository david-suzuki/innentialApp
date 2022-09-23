import React, { useState } from 'react'
import goalReviewStyle from '../../../styles/goalReviewStyle'
import history from '../../../history'
import { GoalSetting } from '../'
import { withRouter } from 'react-router-dom'
import { Button } from 'element-react'

const handleSettingGoals = (isDashboardDraft = false) => {
  if (!isDashboardDraft) return () => history.push('/goals')
  return () => history.push('/goals', { dashboardPlan: true })
}

export default withRouter(({ currentUser, location: { state } }) => {
  const { _id: userId } = currentUser
  const [reviewHeadingVisible, setReviewHeading] = useState(true)
  const dashboardDraft = state && state.dashboardDraft

  return (
    <div>
      {reviewHeadingVisible && (
        <div className='goal-review__heading'>
          <i
            className='page-heading__back__button icon icon-small-right icon-rotate-180'
            onClick={e => {
              e.preventDefault()
              history.goBack()
            }}
          />
          <div className='goal-review__heading-info'>
            <h1>New draft</h1>
          </div>
          <Button
            className='el-button--help'
            onClick={() => window.Intercom('startTour', 85968)}
          >
            ?
          </Button>
        </div>
      )}
      <GoalSetting
        active
        userId={userId}
        onGoalSet={handleSettingGoals(dashboardDraft)}
        toggleReviewHeading={() => setReviewHeading(!reviewHeadingVisible)}
        total={1}
        currentUser={currentUser}
      />
      <style jsx>{goalReviewStyle}</style>
    </div>
  )
})
