import React from 'react'
import { UserItemWithSkill, Statement } from '../ui-components'
import { Query } from 'react-apollo'
import { fetchRelevantUsersInOrganization } from '../../api'
import { captureFilteredError, LoadingSpinner } from '../general'

export const UserDisplay = ({ relevantUsers }) => {
  return (
    <>
      {relevantUsers.length > 0 ? (
        relevantUsers.map(relevantUser => (
          <UserItemWithSkill {...relevantUser} key={relevantUser._id} />
        ))
      ) : (
        <Statement content='There is currently no-one with the skill that you want to learn' />
      )}
    </>
  )
}
export default props => {
  return (
    <Query
      query={fetchRelevantUsersInOrganization}
      fetchPolicy='cache-and-network'
    >
      {({
        data: { fetchRelevantUsersInOrganization } = {},
        loading,
        error
      }) => {
        if (loading) return <LoadingSpinner />
        if (error) {
          captureFilteredError(error)
          return null
        }
        if (fetchRelevantUsersInOrganization) {
          return (
            <UserDisplay relevantUsers={fetchRelevantUsersInOrganization} />
          )
        }
        return null
      }}
    </Query>
  )
}
