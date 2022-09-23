import React, { useState } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { Query } from 'react-apollo'
import { fetchDraftGoalsOfUserTeams } from '../../../api'
import { LoadingSpinner, captureFilteredError } from '../../general'
import reviewFormStyle from '../../../styles/reviewFormStyle'
import { ListSort, List, UserItemReview, Statement } from '../../ui-components'

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
    label: '# of drafts',
    value: 'GOALSNUMBER'
  }
]

const GoalDraftList = ({ teams, isAdmin }) => {
  const [sortMethod, setSortMethod] = useState({ label: 'Name', value: 'NAME' })
  const [filterMethod, setFilterMethod] = useState({
    label: 'All',
    value: 'ALL'
  })

  const teamList = [
    { label: 'All', value: 'ALL' },
    ...teams.map(({ _id: teamId, teamName }) => ({
      label: teamName,
      value: teamId
    }))
  ]

  return (
    <>
      {teams.length > 0 ? (
        <>
          <div className='reviewForm__subtitle'>
            <h4>
              This is a list of “Ready for review” goals{' '}
              {isAdmin ? 'in your organization.' : 'of your team members.'}
            </h4>
          </div>
          <List>
            <ListSort
              sortMethod={sortMethod.label}
              sortMethodList={sortMethods}
              changeSortMethod={setSortMethod}
              filter={filterMethod.label}
              filterList={teamList}
              changeFilter={setFilterMethod}
            />
            {teams
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
                    default:
                      return a.userName.localeCompare(b.userName)
                  }
                })
                return (
                  <React.Fragment key={`draft-team:${teamId}`}>
                    <div className='list__section-title'>
                      <h3>{teamName}</h3>
                    </div>
                    <div className='list__items-review'>
                      {users.map(user => {
                        const firstName = user.userName.split(' ')[0]
                        return (
                          <Link
                            to={`/goals/approval/${user._id}${
                              firstName ? `?firstName=${firstName}` : ''
                            }`}
                          >
                            <UserItemReview
                              key={`${teamId}:${user._id}`}
                              {...user}
                              // onClick={() => {
                              //   history.push()
                              // }}
                            />
                          </Link>
                        )
                      })}
                    </div>
                  </React.Fragment>
                )
              })}
          </List>
        </>
      ) : (
        <Statement content='There are no goals and development plans waiting for approval' />
      )}
      <style jsx>{reviewFormStyle}</style>
    </>
  )
}

export default ({ currentUser }) => {
  return (
    <Query query={fetchDraftGoalsOfUserTeams} fetchPolicy='cache-and-network'>
      {({ data, loading, error }) => {
        if (loading) return <LoadingSpinner />
        if (error) {
          captureFilteredError(error)
          return <Redirect to='/error-page/500' />
        }

        if (data) {
          if (data.fetchDraftGoalsOfUserTeams !== null) {
            const teams = data.fetchDraftGoalsOfUserTeams
            return (
              <GoalDraftList
                teams={teams}
                isAdmin={currentUser.roles.indexOf('ADMIN') !== -1}
              />
            )
          } else {
            return <Redirect to='/error-page/404' />
          }
        }
        return null
      }}
    </Query>
  )
}

// export default withRouter(({ history, currentUser }) => (
//   <>
//     <div className="reviewForm__title">
//       <i
//         onClick={() => history.goBack()}
//         className="review-form__back__button icon icon-small-right icon-rotate-180"
//       />
//       Goal approval
//     </div>
//     <GoalDraftLeaderView currentUser={currentUser} />
//   </>
// ))
