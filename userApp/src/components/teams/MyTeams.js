import React, { Component } from 'react'
import { List, TeamItems } from '../ui-components'
import { remapTeamsForUI } from './_teamUtils'
import history from '../../history'
import { useQuery } from 'react-apollo'
import { fetchCurrentUserOrganizationTeamsInitialData } from '../../api'
import { LoadingSpinner, SentryDispatch } from '../general'

// TODO: Wrap this in a stage results query
class MyTeams extends Component {
  constructor(props) {
    super(props)

    const {
      organizationData,
      currentUser: { _id: userId }
    } = this.props
    if (organizationData) {
      const teams = organizationData ? organizationData.teams : []

      teams.sort((a, b) => {
        const aDate = new Date(a.createdAt)
        const bDate = new Date(b.createdAt)
        return bDate - aDate
      })

      const leaderTeams = []
      const memberTeams = []
      const otherTeams = []
      teams.forEach(team => {
        const {
          leader: { _id: leaderId },
          members
        } = team
        if (members.some(({ _id: memberId }) => memberId === userId)) {
          memberTeams.push(team)
        } else if (leaderId === userId) {
          leaderTeams.push(team)
        } else otherTeams.push(team)
      })

      this.leaderUITeams = remapTeamsForUI(leaderTeams, true)
      this.memberUITeams = remapTeamsForUI(memberTeams, false)
      this.otherUITeams = remapTeamsForUI(otherTeams, false)
    }
  }

  renameTeam = (teamId, oldName) => {
    history.push(`/rename-team`, { teamId, oldName })
  }

  render() {
    const hasOwnTeams =
      this.leaderUITeams.length + this.memberUITeams.length > 0
    const hasOtherTeams = this.otherUITeams.length > 0

    return (
      <div className='component-block'>
        {hasOwnTeams && (
          <div className='tab-content'>
            <List>
              <TeamItems
                items={this.leaderUITeams}
                teamDropdownOptions={[
                  {
                    value: 'Rename',
                    boundFunction: this.renameTeam
                  }
                ]}
              />
              <TeamItems items={this.memberUITeams} />
            </List>
          </div>
        )}
        {hasOtherTeams && (
          <>
            <h3 className='align-left'>Other teams in the organization</h3>
            <br />
            <div className='tab-content'>
              <List>
                <TeamItems items={this.otherUITeams} />
              </List>
            </div>
          </>
        )}
      </div>
    )
  }
}
export default props => {
  const { data, loading, error } = useQuery(
    fetchCurrentUserOrganizationTeamsInitialData
  )
  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <SentryDispatch error={error} />
  }
  return (
    <MyTeams
      {...props}
      organizationData={data?.fetchCurrentUserOrganization || {}}
    />
  )
}
