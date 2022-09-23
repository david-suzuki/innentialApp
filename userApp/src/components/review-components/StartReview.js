import React, { useEffect, useState } from 'react'
import { withRouter, Redirect, Link } from 'react-router-dom'
import { Query } from 'react-apollo'
import { fetchReviewStartInfo } from '../../api'
import { LoadingSpinner, captureFilteredError } from '../general'
import history from '../../history'
import reviewFormStyle from '../../styles/reviewFormStyle'
import { ListSort, List, UserItemReview } from '../ui-components'
// import globalState from '../../globalState'

const sortMethods = [
  {
    label: 'Name',
    value: 'NAME'
  },
  {
    label: 'Role',
    value: 'ROLEATWORK'
  },
  {
    label: 'Reviewed',
    value: 'COMPLETED'
  },
  {
    label: '# of goals',
    value: 'GOALSNUMBER'
  }
]

export const ReviewStartList = ({
  _id: reviewId,
  name,
  teamsToReview,
  otherTeams,
  canReviewCauseAdmin,
  type,
  cantReviewYet,
  reviewStart,
  scheduleEvent,
  currentUser
}) => {
  const [sortMethod, setSortMethod] = useState({ label: 'Name', value: 'NAME' })
  const [filterMethod, setFilterMethod] = useState({
    label: 'All',
    value: 'ALL'
  })

  const teamList = [
    { label: 'All', value: 'ALL' },
    ...teamsToReview.map(({ _id: teamId, teamName }) => ({
      label: teamName,
      value: teamId
    }))
  ]
  // const { setCalendarState } = globalState.useContainer()

  const sortProps =
    type === 'TEAM'
      ? {
          sortMethod: sortMethod.label,
          sortMethodList: sortMethods,
          changeSortMethod: setSortMethod,
          filter: filterMethod.label,
          filterList: teamList,
          changeFilter: setFilterMethod
        }
      : {
          sortMethod: sortMethod.label,
          sortMethodList: sortMethods,
          changeSortMethod: setSortMethod
        }

  return (
    <>
      <div className='review-start__heading'>
        <Link to={cantReviewYet ? '/reviews/upcoming' : '/reviews/open'}>
          <i className='review-form__back__button icon icon-small-right icon-rotate-180' />
        </Link>
        <div className='review-start__heading-info'>
          <h1>{name}</h1>
        </div>
      </div>
      {teamsToReview.length > 0 && (
        <>
          <div className='reviewForm__subtitle'>
            {cantReviewYet ? (
              <h4>Select your team members to schedule a calendar event</h4>
            ) : (
              <h4>Select your team members to review</h4>
            )}
          </div>
          <div className='tab-content'>
            <List overflow>
              <ListSort {...sortProps} />
              {teamsToReview
                .filter(({ _id: teamId }) => {
                  if (filterMethod.value === 'ALL') return true
                  return filterMethod.value === teamId
                })
                .map(({ _id: teamId, teamName, users }) => {
                  users.sort((a, b) => {
                    switch (sortMethod.value) {
                      case 'NAME':
                        return a.userName.localeCompare(b.userName)
                      case 'GOALSNUMBER':
                        if (a.numberOfGoals === b.numberOfGoals) {
                          return a.userName.localeCompare(b.userName)
                        }
                        return a.numberOfGoals - b.numberOfGoals
                      case 'ROLEATWORK':
                        return a.roleAtWork.localeCompare(b.roleAtWork)
                      case 'COMPLETED':
                        if (a.goalsSet === b.goalsSet) {
                          return a.userName.localeCompare(b.userName)
                        }
                        if (a.goalsSet && !b.goalsSet) {
                          return 1
                        } else {
                          return -1
                        }
                      default:
                        return a.userName.localeCompare(b.userName)
                    }
                  })
                  return (
                    <React.Fragment key={`review-team:${teamId}`}>
                      <div className='list__section-title'>
                        <h3>{teamName}</h3>
                      </div>
                      <div className='list__items-review'>
                        {users.map(user => (
                          <UserItemReview
                            dontDisplayCalendarIcon={
                              currentUser._id === user._id
                            }
                            key={`${teamId}:${user._id}`}
                            isInEventScheduling={cantReviewYet}
                            reviewStartDate={reviewStart}
                            scheduleMutation={scheduleEvent}
                            {...user}
                            reviewName={name}
                            onClick={() => {
                              if (!cantReviewYet) {
                                history.push(
                                  `/review/${reviewId}/goals/${user._id}`
                                )
                              }
                            }}
                            reviewId={reviewId}
                          />
                        ))}
                      </div>
                    </React.Fragment>
                  )
                })}
            </List>
          </div>
        </>
      )}
      {otherTeams.length > 0 && (
        <>
          <div className='reviewForm__subtitle'>
            <h4>Other teams in this review</h4>
          </div>
          <div className='tab-content'>
            <List overflow>
              {otherTeams.map(({ _id: teamId, teamName, users }) => {
                return (
                  <React.Fragment key={`review-team:${teamId}`}>
                    <div className='list__section-title'>
                      <h3>{teamName}</h3>
                    </div>
                    <div className='list__items-review'>
                      {users.map(user => (
                        <UserItemReview
                          key={`${teamId}:${user._id}`}
                          {...user}
                          dontDisplayCalendarIcon={currentUser._id === user._id}
                          isInEventScheduling={cantReviewYet}
                          reviewStartDate={reviewStart}
                          reviewName={name}
                          scheduleMutation={scheduleEvent}
                          onClick={() => {
                            if (!cantReviewYet) {
                              history.push(
                                `/review/${reviewId}/goals/${user._id}`
                              )
                            }
                          }}
                          notInReview={!canReviewCauseAdmin}
                          reviewId={reviewId}
                        />
                      ))}
                    </div>
                  </React.Fragment>
                )
              })}
            </List>
          </div>
        </>
      )}
      <style jsx>{reviewFormStyle}</style>
    </>
  )
}

export default withRouter(({ match: { params }, currentUser }) => {
  const { reviewId } = params

  const absolutePower = currentUser.roles.indexOf('ADMIN') !== -1
  return (
    <Query
      query={fetchReviewStartInfo}
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
          if (data.fetchReviewStartInfo !== null) {
            const { name, teams, type } = data.fetchReviewStartInfo
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
              <ReviewStartList
                _id={reviewId}
                name={name}
                teamsToReview={teamsToReview}
                otherTeams={otherTeams}
                canReviewCauseAdmin={absolutePower}
                type={type}
                currentUser={currentUser}
              />
            )
          } else return <Redirect to='/reviews' />
        }
        return null
      }}
    </Query>
  )
})
