import React from 'react'
import { Button, Notification, MessageBox } from 'element-react'
import { Mutation } from 'react-apollo'
import {
  createReviewTemplate,
  currentUser,
  scheduleEvent,
  fetchOrganizationReviewSchedules,
  fetchLeadersReviewSchedules,
  fetchUserReviews,
  fetchOrganizationReviews
} from '../../api'
import {
  // LoadingSpinner,
  captureFilteredError
} from '../general'
import history from '../../history'
import { CalendarBox } from './event-components'

const createEventsForReviews = (
  inputData,
  createdTemplateId,
  calendarEmails,
  scheduleEvent
) => {
  const {
    scopeType,
    specificUsers,
    firstReviewStart,
    name: reviewName
  } = inputData
  const isPersonal = scopeType === 'PERSONAL' && specificUsers.length === 1
  if (isPersonal) {
    MessageBox.confirm(
      <CalendarBox
        reviewName={reviewName}
        firstReviewStart={firstReviewStart}
        calendarEmails={calendarEmails}
        reviewId={createdTemplateId}
        userId={specificUsers[0]}
        scheduleEvent={scheduleEvent}
      />,
      'Would you like to create calendar events for the review now?',
      {
        showConfirmButton: false,
        cancelButtonText: 'Done'
      }
    ).catch(() => history.push('/reviews/scheduled'))
  } else {
    MessageBox.confirm(
      'Would you like to schedule calendar events now?',
      'Success',
      {
        confirmButtonText: 'Yes',
        cancelButtonText: 'Later'
      }
    )
      .then(() =>
        history.push(`/create/reviews/events/${createdTemplateId}`, {
          asTemplate: true
        })
      )
      .catch(() => history.push('/reviews/scheduled'))
  }
}
export default ({ inputData, formRef, calendarEmails, skipScheduling }) => {
  return (
    <Mutation
      mutation={createReviewTemplate}
      awaitRefetchQueries
      refetchQueries={[
        { query: fetchOrganizationReviews, variables: {} },
        { query: fetchOrganizationReviewSchedules, variables: {} },
        { query: fetchUserReviews, variables: {} },
        { query: fetchLeadersReviewSchedules, variables: {} },
        { query: currentUser, variables: {} }
      ]}
    >
      {(mutation, { loading }) => {
        return (
          <Mutation mutation={scheduleEvent}>
            {scheduleEvent => (
              <Button
                className='review-form__button__schedule el-button--lilac'
                loading={loading}
                onClick={e => {
                  e.preventDefault()
                  formRef.current.validate(async valid => {
                    if (valid) {
                      if (
                        inputData.scopeType === 'PERSONAL' &&
                        inputData.reviewers === 'TEAMLEAD' &&
                        !inputData.leadersReview
                      ) {
                        Notification({
                          type: 'warning',
                          message:
                            "You can't select team leaders to do personal reviews, select the individiual leaders who should do the reviews",
                          duration: 5000,
                          offset: 90
                        })
                        return
                      }
                      if (inputData.edittingId) {
                        // we're editting
                        MessageBox.confirm(
                          'Would you like to apply the changes to active reviews?',
                          'Warning',
                          {
                            confirmButtonText: 'Apply now',
                            cancelButtonText: 'Apply from next review',
                            type: 'warning'
                          }
                        )
                          .then(() => {
                            // WE WANT TO UPDATE THE ACTIVE REVIEW
                            inputData = {
                              ...inputData,
                              updateReview: true
                            }
                          })
                          .catch(() => {})
                          .finally(() => {
                            mutation({ variables: { inputData } })
                              .then(
                                ({
                                  data: { createReviewTemplate: result }
                                }) => {
                                  if (
                                    result &&
                                    result.length &&
                                    result.length === 24
                                  ) {
                                    Notification({
                                      type: 'success',
                                      message: 'Your changes have been saved!',
                                      duration: 2500,
                                      offset: 90
                                    })
                                    history.push('/reviews/scheduled')
                                  } else {
                                    Notification({
                                      type: 'warning',
                                      message: 'Oops, something went wrong!',
                                      duration: 2500,
                                      offset: 90
                                    })
                                  }
                                }
                              )
                              .catch(e => {
                                captureFilteredError(e)
                                Notification({
                                  type: 'warning',
                                  message: 'Oops, something went wrong!',
                                  duration: 2500,
                                  offset: 90
                                })
                              })
                          })
                      } else {
                        mutation({ variables: { inputData } })
                          .then(
                            ({ data: { createReviewTemplate: result } }) => {
                              if (
                                result &&
                                result.length &&
                                result.length === 24
                              ) {
                                Notification({
                                  type: 'success',
                                  message: 'Your changes have been saved!',
                                  duration: 2500,
                                  offset: 90
                                })
                                if (!skipScheduling) {
                                  createEventsForReviews(
                                    inputData,
                                    result,
                                    calendarEmails,
                                    scheduleEvent
                                  )
                                } else {
                                  history.push('/reviews/scheduled')
                                }
                              } else {
                                Notification({
                                  type: 'warning',
                                  message: 'Oops, something went wrong!',
                                  duration: 2500,
                                  offset: 90
                                })
                              }
                            }
                          )
                          .catch(e => {
                            captureFilteredError(e)
                            Notification({
                              type: 'warning',
                              message: 'Oops, something went wrong!',
                              duration: 2500,
                              offset: 90
                            })
                          })
                      }
                    }
                  })
                }}
              >
                Schedule review
              </Button>
            )}
          </Mutation>
        )
      }}
    </Mutation>
  )
}
