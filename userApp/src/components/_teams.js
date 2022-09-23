import React from 'react'
import ManageTeams from './teams/ManageTeams'
import MyTeams from './teams/MyTeams'
import { fetchCurrentUserOrganizationTeams } from '../api'
import { Query } from 'react-apollo'
import { SentryDispatch, LoadingSpinner } from './general'
import { withRouter } from 'react-router-dom'

const tabs = {
  users: 1,
  skills: 2,
  settings: 3,
  roles: 4,
  'path-templates': 5
}

export default withRouter(
  ({ organizationData, user, location: { state, search } }) => {
    if (user.roles.indexOf('ADMIN') !== -1) {
      const searchStrings = search && search.split('?')[1].split('&')
      const tabSearch =
        searchStrings && searchStrings.find(str => str.indexOf('tab') === 0)
      const activeIndex = (tabSearch && tabs[tabSearch.split('=')[1]]) || 0
      return (
        <ManageTeams
          organizationData={organizationData}
          activeIndex={activeIndex}
          user={user}
        />
      )
    } else {
      return (
        <Query
          query={fetchCurrentUserOrganizationTeams}
          fetchPolicy='cache-first'
        >
          {({ data, loading, error }) => {
            if (loading) return <LoadingSpinner />
            if (error) return <SentryDispatch error={error} />
            if (data) {
              return (
                <MyTeams
                  organizationData={organizationData}
                  currentUser={user}
                />
              )
            }
          }}
        </Query>
      )
    }
  }
)
