import React, { Component, useEffect } from 'react'
import goalReviewStyle from '../../styles/goalReviewStyle'
import { Steps } from '../ui-components'
import { MessageBox } from 'element-react'
import { withRouter, Redirect } from 'react-router-dom'
import { Query, Mutation } from 'react-apollo'
import {
  fetchUserGoalInfoForReview,
  deleteReviewTemplate,
  closeReview,
  fetchUserReviews,
  fetchOrganizationReviews,
  fetchOrganizationReviewSchedules,
  fetchLeadersReviewSchedules
} from '../../api'
import { LoadingSpinner, captureFilteredError } from '../general'
import history from '../../history'
import {
  GoalsOverviewPage,
  GoalSetting,
  GoalsReviewPage,
  GoalSummary
} from './goal-review-components'
import 'element-theme-chalk/lib/slider.css'

// THIS HANDLES THE "GO BACK" BUTTON FUNCTION BASED ON CURRENT STATE

const handleGoBack = async (
  activePage,
  goalsReviewed,
  onlySettingGoals,
  handlePaging,
  noFirstPage
) => {
  if (
    activePage === 0 ||
    activePage === 3 ||
    (noFirstPage && activePage === 1)
  ) {
    if (activePage === 0 && goalsReviewed) {
      try {
        await MessageBox.confirm(
          'Are you sure you want to leave the review without setting the new goals?',
          'Warning',
          {
            type: 'warning'
          }
        )
      } catch (err) {
        return
      }
    }
    history.goBack()
  } else {
    if (onlySettingGoals && activePage === 2) {
      handlePaging(activePage - 2)
    } else handlePaging(activePage - 1)
  }
}

// THIS HANDLES THE FORMS BASED ON THE CURRENT PAGING OF THE REVIEW WRAPPER

const GoalReviewPager = ({
  activePage,
  userId,
  active,
  goalsReviewed,
  onlySettingGoals,
  reviewId,
  nextReviewId,
  goals,
  handlePaging,
  handleSettingGoals,
  onGoalsReviewed,
  reviewWillClose,
  nextGoals,
  onlySummary,
  toggleReviewHeading,
  skillProgression,
  currentUser,
  userName,
  feedback,
  feedbackFromOthers
}) => {
  switch (activePage) {
    case 0:
      return (
        <GoalsOverviewPage
          goals={goals}
          handlePaging={handlePaging}
          goalsReviewed={onlySettingGoals}
          feedbackFromOthers={feedbackFromOthers}
        />
      )
    case 1:
      return (
        <GoalsReviewPage
          goals={goals}
          userId={userId}
          reviewId={reviewId}
          onGoalsReviewed={onGoalsReviewed}
          userName={userName}
        />
      )
    case 2:
      return (
        <GoalSetting
          userId={userId}
          active={active}
          reviewId={nextReviewId} // THIS IS THE ID FOR WHICH YOU'RE SETTING THE GOALS, NOT THE CURRENT REVIEW
          previousReviewId={reviewId}
          onGoalSet={handleSettingGoals}
          toggleReviewHeading={toggleReviewHeading}
          currentUser={currentUser}
        />
      )
    case 3:
      return (
        <GoalSummary
          reviewId={reviewId}
          nextGoals={nextGoals}
          goals={goals}
          history={history}
          reviewWillClose={reviewWillClose}
          onlySummary={onlySummary}
          skillProgression={skillProgression}
          feedback={feedback}
        />
      )
    default:
      return <Redirect to={`/start-review/${reviewId}`} />
  }
}

/* 
  NOTE: THE PAGE HANDLING HERE MIGHT SEEM A LITTLE ODD

  PAGE 0 IS GOAL OVERVIEW
  PAGE 1 IS GOAL REVIEW
  PAGE 2 IS NEW GOAL SETTING
  PAGE 3 IS GOAL SUMMARY

  ESSENTIALLY, THERE ARE 4 DIFFERENT POSSIBLE STATES (3 CORRECT ONES) BASED ON: 
  - WHETHER THERE ARE GOALS SET FOR THIS REVIEW
  - WHETHER THERE'LL BE ANOTHER REVIEW

  IF THERE ARE NO GOALS, BUT THERE'S A NEXT REVIEW, YOU JUST GO STRAIGHT TO PAGE 2, AND SKIP EVERYTHING ELSE
  IF THERE ARE GOALS, THEN YOU EITHER GET PAGES [0, 1, 2, 3] OR [0, 1, 3] (IF THERE'S NO NEXT REVIEW)
*/

class GoalReviewWrapper extends Component {
  constructor(props) {
    super(props)

    const {
      onlySummary,
      noFirstPage,
      nextGoals,
      oneTimeReview,
      onlySettingGoals
    } = props

    this.state = {
      activePage: onlySummary ? 3 : noFirstPage ? 1 : 0,
      goalsReviewed: onlySettingGoals,
      goalsSet: false,
      reviewWillClose: false,
      nextGoals,
      hideReviewHeading: false,
      oneTimeReview
    }
  }

  componentDidUpdate() {
    if (history.location.pathname.includes('/goals/')) {
      const mainWrapper = document.getElementById('main-wrapper')
      mainWrapper.className = 'container-main__wrapper wrapper--right'
    }
  }

  handleSettingGoals = (nextGoals, result) => {
    this.setState({ nextGoals })
    if (result === 'CLOSED') this.handleClosing()
    this.handlePaging(3)
  }

  handleClosing = () => {
    this.setState({ reviewWillClose: true })
  }

  handlePaging = nextPage => {
    this.setState({ activePage: nextPage })
  }

  toggleReviewHeading = () => {
    this.setState(({ hideReviewHeading: value }) => ({
      hideReviewHeading: !value
    }))
  }

  handleReviewingGoals = () => {
    this.setState({ goalsReviewed: true })
    if (this.props.oneTimeReview) {
      MessageBox.confirm(
        `You can immediately prepare the next steps`,
        `Would you like to do this review periodically with ${this.props.userName}?`,
        {
          confirmButtonText: `Yes`,
          cancelButtonText: `No, just this once`,
          type: 'warning'
        }
      )
        .then(() => {
          this.setState({ oneTimeReview: false }, () => this.handlePaging(2))
        })
        .catch(async () => {
          try {
            const {
              templateId,
              deleteUpcoming,
              closeReview,
              reviewId
            } = this.props
            await deleteUpcoming({
              variables: {
                templateId
              }
            })
            await closeReview({
              variables: {
                reviewId
              }
            })
          } catch (err) {
            captureFilteredError(err)
          } finally {
            this.handlePaging(3)
          }
        })
    } else {
      this.handlePaging(2)
    }
  }

  render() {
    const {
      activePage,
      goalsReviewed,
      reviewWillClose,
      nextGoals,
      hideReviewHeading,
      oneTimeReview
    } = this.state
    const {
      onlySummary,
      onlySettingGoals,
      reviewName,
      userName = '',
      active,
      userId,
      reviewId,
      nextReviewId,
      goals,
      skillProgression,
      currentUser,
      feedback,
      feedbackFromOthers,
      noFirstPage
    } = this.props

    return (
      <div>
        {!hideReviewHeading && (
          <>
            <div className='goal-review__heading'>
              <i
                className='goal-review__back__button icon icon-small-right icon-rotate-180'
                onClick={e => {
                  e.preventDefault()
                  handleGoBack(
                    activePage,
                    goalsReviewed,
                    onlySettingGoals,
                    this.handlePaging,
                    noFirstPage
                  )
                }}
              />
              <div className='goal-review__heading-info'>
                <h1>{reviewName}</h1>
                <div className='goal-review__date'>{userName}</div>
              </div>
            </div>
            {activePage !== 0 && !onlySummary && (
              <Steps
                steps={
                  onlySettingGoals
                    ? ['Next steps', 'Summary']
                    : ['Feedback', 'Next steps', 'Summary']
                }
                activeStep={activePage}
              />
            )}
          </>
        )}
        <GoalReviewPager
          activePage={activePage}
          userId={userId}
          active={active}
          reviewId={reviewId}
          nextReviewId={nextReviewId}
          goals={goals}
          nextGoals={nextGoals}
          handlePaging={this.handlePaging}
          handleSettingGoals={this.handleSettingGoals}
          goalsReviewed={goalsReviewed}
          onlySettingGoals={onlySettingGoals}
          onGoalsReviewed={this.handleReviewingGoals}
          reviewWillClose={reviewWillClose}
          onlySummary={onlySummary}
          toggleReviewHeading={this.toggleReviewHeading}
          skillProgression={skillProgression}
          currentUser={currentUser}
          userName={userName.split(' ')[0]}
          feedback={feedback}
          feedbackFromOthers={feedbackFromOthers}
        />
        <style jsx>{goalReviewStyle}</style>
      </div>
    )
  }
}

export default withRouter(({ match: { params }, currentUser }) => {
  const { reviewId, userId } = params

  return (
    <Query
      query={fetchUserGoalInfoForReview}
      variables={{ userId, reviewId }}
      fetchPolicy='network-only'
    >
      {({ data, loading, error }) => {
        if (loading) return <LoadingSpinner />
        if (error) {
          captureFilteredError(error)
          return <Redirect to='/error-page/500' />
        }

        if (data) {
          if (data.fetchUserGoalInfoForReview !== null) {
            const {
              reviewName,
              userName,
              active,
              nextReviewId,
              goals,
              goalsCompleted,
              nextGoals,
              skillProgression,
              oneTimeReview,
              templateId,
              feedback,
              feedbackFromOthers = []
            } = data.fetchUserGoalInfoForReview

            // console.log({ goalsCompleted })

            return (
              <Mutation
                mutation={deleteReviewTemplate}
                refetchQueries={[
                  { query: fetchUserReviews, variables: {} },
                  { query: fetchOrganizationReviewSchedules, variables: {} },
                  { query: fetchOrganizationReviews, variables: {} },
                  { query: fetchLeadersReviewSchedules, variables: {} }
                ]}
              >
                {deleteReviewTemplate => (
                  <Mutation
                    mutation={closeReview}
                    refetchQueries={[
                      { query: fetchUserReviews, variables: {} },
                      {
                        query: fetchOrganizationReviewSchedules,
                        variables: {}
                      },
                      { query: fetchOrganizationReviews, variables: {} },
                      { query: fetchLeadersReviewSchedules, variables: {} }
                    ]}
                  >
                    {closeReview => (
                      <GoalReviewWrapper
                        reviewName={reviewName}
                        userName={userName}
                        active={active}
                        nextReviewId={nextReviewId}
                        goals={goals}
                        userId={userId}
                        reviewId={reviewId}
                        nextGoals={nextGoals}
                        onlySummary={
                          (goalsCompleted && oneTimeReview) ||
                          (nextGoals && nextGoals.length > 0)
                        }
                        onlySettingGoals={goalsCompleted || goals.length === 0}
                        noFirstPage={
                          goals.length + feedbackFromOthers.length === 0
                        }
                        skillProgression={skillProgression}
                        currentUser={currentUser}
                        oneTimeReview={oneTimeReview}
                        deleteUpcoming={deleteReviewTemplate}
                        templateId={templateId}
                        closeReview={closeReview}
                        feedback={feedback}
                        feedbackFromOthers={feedbackFromOthers}
                      />
                    )}
                  </Mutation>
                )}
              </Mutation>
            )
          }
        }
        return <Redirect to='/reviews' />
      }}
    </Query>
  )
})
