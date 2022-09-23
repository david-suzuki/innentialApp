import React from 'react'
import { withRouter, Redirect } from 'react-router-dom'
import {
  fetchUpcomingOrActiveReviewEventInfo,
  scheduleEvent
} from '../../../api'
import { Query, Mutation } from 'react-apollo'
import { Statement } from '../../ui-components'
import { LoadingSpinner, captureFilteredError } from '../../general'
import { ReviewStartList } from '../StartReview'

export default withRouter(
  ({
    currentUser,
    // organizationData,
    location: { state },
    match: { params }
  }) => {
    const asTemplate = state && state.asTemplate
    const templateId = params && params.templateId
    const queryParams =
      asTemplate && templateId ? { templateId } : { reviewId: templateId }
    const absolutePower = currentUser.roles.indexOf('ADMIN') !== -1

    return (
      <Query
        query={fetchUpcomingOrActiveReviewEventInfo}
        variables={queryParams}
      >
        {({ data, loading, error }) => {
          if (loading) return <LoadingSpinner />
          if (error) {
            captureFilteredError(error)
            return <Statement content='Oops! Something went wrong.' />
          }

          const queryResult = data && data.fetchUpcomingOrActiveReviewEventInfo
          if (queryResult) {
            const { startsAt, reviewStartInfo } = queryResult
            const { name, teams, type } = reviewStartInfo
            const teamsToReview = teams.filter(team => team.isReviewer)
            const otherTeams = teams
              .filter(team => !team.isReviewer)
              .map(team => {
                return {
                  ...team,
                  users: team.users.filter(user => {
                    return !teamsToReview.some(({ users }) =>
                      users.some(({ _id: userId }) => user._id === userId)
                    )
                  })
                }
              })
              .filter(({ users }) => users.length > 0)

            return (
              <Mutation
                mutation={scheduleEvent}
                refetchQueries={['fetchUpcomingOrActiveReviewEventInfo']}
              >
                {scheduleEvent => (
                  <ReviewStartList
                    _id={queryResult._id}
                    name={name}
                    teamsToReview={teamsToReview}
                    otherTeams={otherTeams}
                    canReviewCauseAdmin={absolutePower}
                    type={type}
                    reviewStart={startsAt}
                    scheduleEvent={scheduleEvent}
                    cantReviewYet
                    currentUser={currentUser}
                  />
                )}
              </Mutation>
            )
          }
          return <Redirect to='/error-page/404' />
        }}
      </Query>
    )
  }
)
