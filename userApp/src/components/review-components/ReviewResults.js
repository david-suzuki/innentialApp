import React, { Component } from 'react'
import goalReviewStyle from '../../styles/goalReviewStyle'
import {
  Statement,
  GoalItem,
  GoalItemCompleted,
  UserItemReview,
  List,
  SkillProgression
} from '../ui-components'
import { Notification, Button } from 'element-react'
import { withRouter, Redirect } from 'react-router-dom'
import { Query } from 'react-apollo'
import { fetchReviewResultInfo } from '../../api'
import { LoadingSpinner, captureFilteredError } from '../general'
import history from '../../history'

class ReviewResults extends Component {
  state = {
    isViewingGoals: false,
    goalsVisible: false,
    goals: [],
    nextGoals: [],
    reviewer: '',
    userName: '',
    skillProgression: [],
    feedback: ''
  }

  setViewingGoals = ({
    goalsReviewed,
    goalsSet,
    reviewer,
    userName,
    skillProgression,
    feedback
  }) => {
    this.setState({
      isViewingGoals: true,
      goals: goalsReviewed,
      nextGoals: goalsSet,
      reviewer,
      userName,
      skillProgression,
      feedback
    })
  }

  setGoalsVisible = value => {
    this.setState({ goalsVisible: value })
  }

  goBackToResultPage = () => {
    this.setState({
      isViewingGoals: false,
      goalsVisible: false,
      goals: [],
      nextGoals: [],
      reviewer: '',
      userName: '',
      skillProgression: [],
      feedback: ''
    })
  }

  render() {
    const { name, closedAt, userResults } = this.props
    const {
      isViewingGoals,
      goalsVisible,
      goals,
      nextGoals,
      userName,
      reviewer: reviewerName,
      skillProgression,
      feedback
    } = this.state
    return (
      <div>
        <div className='goal-review__heading'>
          <i
            className='goal-review__back__button icon icon-small-right icon-rotate-180'
            onClick={e => {
              e.preventDefault()
              if (isViewingGoals) {
                this.goBackToResultPage()
              } else history.goBack()
            }}
          />
          <div className='goal-review__heading-info'>
            <h1>{isViewingGoals ? userName : name}</h1>
            <div className='goal-review__date'>
              {isViewingGoals
                ? `Reviewed by: ${reviewerName}`
                : `Closed: ${new Date(closedAt).toDateString()}`}
            </div>
          </div>
        </div>
        {isViewingGoals ? (
          <div>
            {skillProgression && skillProgression.length > 0 && (
              <SkillProgression skillProgression={skillProgression} />
            )}
            {feedback && (
              <>
                <div className='goal-summary__goals-set-header'>Feedback: </div>
                <div
                  className='goal-results__feedback-wrapper'
                  dangerouslySetInnerHTML={{
                    __html: feedback
                  }}
                />
              </>
            )}
            {goals && goals.length > 0 && (
              <div className='goal-summary__goals-reviewed-wrapper'>
                <div className='goal-summary__goals-reviewed-header'>
                  <span>
                    Goals reviewed:{'    '}
                    <span className='goal-summary__goals-reviewed-header__number'>
                      {goals.length}
                    </span>
                  </span>
                  <Button onClick={() => this.setGoalsVisible(!goalsVisible)}>
                    {goalsVisible ? 'Hide' : 'Show'}
                  </Button>
                </div>
                {goalsVisible && (
                  <List noBoxShadow noPadding>
                    {goals.map(goal => (
                      <GoalItemCompleted
                        key={`goals-summary:goal-reviewed:${goal._id}`}
                        {...goal}
                      />
                    ))}
                  </List>
                )}
              </div>
            )}
            {nextGoals && nextGoals.length > 0 && (
              <div>
                <div className='goal-summary__goals-set-header'>Next steps</div>
                {nextGoals.map(goal => (
                  <GoalItem
                    key={`goals-summary:goal-set:${goal.goalName}`}
                    {...goal}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {userResults.length > 0 ? (
              <List>
                {userResults.map(
                  ({
                    _id: userId,
                    user,
                    goalsReviewed,
                    goalsSet,
                    reviewedAt,
                    reviewer,
                    skillProgression,
                    feedback
                  }) => {
                    const {
                      email,
                      status,
                      firstName,
                      lastName,
                      roleAtWork,
                      imageLink,
                      location
                    } = user
                    const userName =
                      status === 'active' ? `${firstName} ${lastName}` : email
                    return (
                      <UserItemReview
                        key={`userItem:${userId}`}
                        userName={userName}
                        imgLink={imageLink}
                        location={location}
                        roleAtWork={roleAtWork}
                        goalsSet={reviewedAt}
                        numberOfGoals={goalsReviewed.length + goalsSet.length}
                        onClick={() =>
                          this.setViewingGoals({
                            goalsReviewed,
                            goalsSet,
                            reviewer,
                            userName,
                            skillProgression,
                            feedback
                          })
                        }
                      />
                    )
                  }
                )}
              </List>
            ) : (
              <Statement content='Nothing to show.' />
            )}
          </div>
        )}
        <style jsx>{goalReviewStyle}</style>
      </div>
    )
  }
}

export default withRouter(({ match: { params } }) => {
  const { reviewId } = params

  return (
    <Query
      query={fetchReviewResultInfo}
      variables={{ reviewId }}
      fetchPolicy='cache-and-network'
    >
      {({ data, loading, error }) => {
        if (loading) return <LoadingSpinner />
        if (error) {
          captureFilteredError(error)
          return <Redirect to='/error-page/500' />
        }

        if (data) {
          if (data.fetchReviewResultInfo !== null) {
            const { name, closedAt, userResults } = data.fetchReviewResultInfo

            return (
              <ReviewResults
                name={name}
                closedAt={closedAt}
                userResults={userResults}
              />
            )
          }

          Notification({
            type: 'warning',
            message: 'No result to display',
            duration: 2500,
            offset: 90
          })
          return <Redirect to='/reviews' />
        }
        return null
      }}
    </Query>
  )
})
