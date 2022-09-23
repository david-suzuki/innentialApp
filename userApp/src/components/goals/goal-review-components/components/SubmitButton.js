import React from 'react'
import { Button, Notification } from 'element-react'
import { Mutation /*, Query */ } from 'react-apollo'
import {
  addGoalsToReview,
  draftGoals /*, fetchDevelopmentPlan */,
  fetchUserGoals,
  fetchOrganizationReviews,
  fetchUserReviews
} from '../../../../api'

export default ({
  user,
  reviewId = null,
  previousReviewId = null,
  goalsArray,
  onSubmit = () => {}
}) => {
  if (reviewId !== null) {
    return (
      <Mutation
        mutation={addGoalsToReview}
        refetchQueries={[
          'fetchReviewStartInfo',
          'fetchUserReviews',
          'fetchUserGoals',
          'fetchUserDevelopmentPlan',
          'fetchUsersGoals',
          'fetchDraftGoalsForUser'
        ]}
        update={(proxy, { data: { addGoalsToReview: result } }) => {
          if (result === 'CLOSED') {
            try {
              // ADMIN SCOPE
              const { fetchOrganizationReviews: reviews } = proxy.readQuery({
                query: fetchOrganizationReviews
              })
              const newReviews = reviews.map(review => {
                if (review._id === previousReviewId) {
                  return {
                    ...review,
                    status: 'CLOSED',
                    closedAt: new Date().toString()
                  }
                } else return review
              })
              proxy.writeQuery({
                query: fetchUserReviews,
                data: {
                  fetchUserReviews: newReviews
                }
              })
            } catch (err) {}
            try {
              // USER SCOPE
              const { fetchUserReviews: reviews } = proxy.readQuery({
                query: fetchUserReviews
              })
              const newReviews = reviews.map(review => {
                if (review._id === previousReviewId) {
                  return {
                    ...review,
                    status: 'CLOSED',
                    closedAt: new Date().toString()
                  }
                } else return review
              })
              proxy.writeQuery({
                query: fetchUserReviews,
                data: {
                  fetchUserReviews: newReviews
                }
              })
            } catch (err) {}
          }
        }}
      >
        {(mutation, { loading }) => (
          <Button
            type='primary'
            loading={loading}
            onClick={e => {
              e.preventDefault()
              // VALIDATION: CHECK GOAL AND MEASURE NAMES
              if (
                goalsArray.every(([key, { goalName, measures }]) => {
                  return (
                    goalName.length > 0 &&
                    Object.entries(measures).every(
                      ([measureKey, measureName]) => measureName.length > 0
                    )
                  )
                })
              ) {
                // const goalsArray = Object.entries(goals).map(
                //   ([key, value]) => value
                // )

                // DATA FOR GOAL SETTING MUTATION
                const inputData = {
                  user,
                  reviewId,
                  goals: goalsArray.map(([key, goal]) => {
                    const {
                      _id,
                      measures,
                      goalName,
                      relatedSkills,
                      developmentPlan: { content, mentors }
                    } = goal
                    return {
                      _id,
                      goalName,
                      goalType: 'PERSONAL',
                      measures: Object.entries(measures).map(
                        ([measureKey, measureName]) => measureName
                      ),
                      relatedSkills: relatedSkills.map(skill => skill._id),
                      developmentPlan: {
                        content: content.map(
                          ({
                            _id: contentId,
                            type: contentType,
                            price: { value: price }
                          }) => {
                            return {
                              contentId,
                              contentType,
                              price
                            }
                          }
                        ),
                        mentors: mentors.map(({ _id: mentorId }) => ({
                          mentorId
                        }))
                      }
                    }
                  })
                }

                // INFO TO PASS TO REVIEW SUMMARY
                const nextGoals = goalsArray.map(([key, goal], i) => {
                  const {
                    _id,
                    measures,
                    goalName,
                    relatedSkills,
                    developmentPlan: { content, mentors }
                  } = goal
                  return {
                    _id: _id || `nextGoal:${i}`,
                    goalName,
                    goalType: 'PERSONAL',
                    measures: Object.entries(measures).map(
                      ([measureKey, measureName], ix) => ({
                        _id: `${i}:nextMeasure:${ix}`,
                        measureName
                      })
                    ),
                    relatedSkills: relatedSkills.map(skill => ({
                      _id: skill._id,
                      name: skill.name
                    })),
                    developmentPlan: {
                      content: content.map(content => {
                        return {
                          _id: content._id,
                          content,
                          status: 'NOT STARTED'
                        }
                      }),
                      mentors
                    }
                  }
                })
                mutation({
                  variables: {
                    inputData
                  }
                })
                  .then(({ data: { addGoalsToReview: result } }) => {
                    if (result !== null) {
                      if (result === 'CLOSED') {
                        Notification({
                          type: 'success',
                          message:
                            'Goals successfully set. This review will now close.',
                          duration: 2500,
                          offset: 90
                        })
                      } else {
                        Notification({
                          type: 'success',
                          message: 'Goals successfully set!',
                          duration: 2500,
                          offset: 90
                        })
                      }
                      onSubmit(nextGoals, result)
                    } else {
                      Notification({
                        type: 'warning',
                        message: 'Oops, something went wrong!',
                        duration: 2500,
                        offset: 90
                      })
                    }
                  })
                  .catch(() => {
                    Notification({
                      type: 'warning',
                      message: 'Oops, something went wrong!',
                      duration: 2500,
                      offset: 90
                    })
                  })
              } else {
                Notification({
                  type: 'warning',
                  message:
                    'Please provide all the goal and measure descriptions!',
                  duration: 2500,
                  offset: 90
                })
              }
            }}
          >
            Complete review
          </Button>
        )}
      </Mutation>
    )
  } else {
    return (
      <Mutation
        mutation={draftGoals}
        refetchQueries={['fetchUserDevelopmentPlan']}
        update={(cache, { data: { draftGoals: newGoals } }) => {
          try {
            const { fetchUserGoals: goals } = cache.readQuery({
              query: fetchUserGoals
            })
            cache.writeQuery({
              query: fetchUserGoals,
              data: {
                fetchUserGoals: [...newGoals, ...goals]
              }
            })
          } catch (e) {}
        }}
      >
        {(mutation, { loading }) => (
          <Button
            type='primary'
            loading={loading}
            onClick={e => {
              e.preventDefault()
              // VALIDATION: CHECK GOAL AND MEASURE NAMES
              if (
                goalsArray.every(([key, { goalName, measures }]) => {
                  return (
                    goalName.length > 0 &&
                    Object.entries(measures).every(
                      ([measureKey, measureName]) => measureName.length > 0
                    )
                  )
                })
              ) {
                // DATA FOR GOAL DRAFTING MUTATION
                const goals = goalsArray.map(([key, goal]) => {
                  const {
                    measures,
                    goalName,
                    relatedSkills,
                    developmentPlan: { content, mentors }
                  } = goal
                  return {
                    goalName,
                    goalType: 'PERSONAL',
                    measures: Object.entries(measures).map(
                      ([measureKey, measureName]) => measureName
                    ),
                    relatedSkills: relatedSkills.map(skill => skill._id),
                    developmentPlan: {
                      content: content.map(
                        ({
                          _id: contentId,
                          type: contentType,
                          price: { value: price }
                        }) => {
                          return {
                            contentId,
                            contentType,
                            price
                          }
                        }
                      ),
                      mentors: mentors.map(({ _id: mentorId }) => ({
                        mentorId
                      }))
                    }
                  }
                })

                mutation({
                  variables: {
                    goals
                  }
                })
                  .then(({ data: { draftGoals: result } }) => {
                    if (result !== null) {
                      Notification({
                        type: 'success',
                        message: `Goals successfully drafted! They'll be available once a team leader approves them.`,
                        duration: 2500,
                        offset: 90
                      })
                      onSubmit()
                    } else {
                      Notification({
                        type: 'warning',
                        message: 'Oops, something went wrong!',
                        duration: 2500,
                        offset: 90
                      })
                    }
                  })
                  .catch(() => {
                    Notification({
                      type: 'warning',
                      message: 'Oops, something went wrong!',
                      duration: 2500,
                      offset: 90
                    })
                  })
              } else {
                Notification({
                  type: 'warning',
                  message:
                    'Please provide all the goal and measure descriptions!',
                  duration: 2500,
                  offset: 90
                })
              }
            }}
          >
            Save goals
          </Button>
        )}
      </Mutation>
    )
  }
}
