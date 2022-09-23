import React from 'react'
import { ApolloConsumer } from 'react-apollo'
import { useQuery } from '@apollo/react-hooks'
import { fetchTeam, fetchTeamDetails, fetchTeamMembers } from '../../api'
import { withRouter, Redirect } from 'react-router-dom'
import { TeamDetailsLeader, TeamDetailsMember } from './team-details'
import { captureFilteredError, LoadingSpinner } from '../general'
import { RouteManager } from '../../utils'

export default withRouter(
  ({
    match: {
      params: { teamId }
    },
    location: { state },
    currentUser
  }) => {
    const viewSkills = RouteManager.getTeamSkillView()
    const justEvaluated = (state && state.justEvaluated) || viewSkills
    const [membersPage, setMembersPage] = React.useState(1)
    const membersLimit = 20
    const membersSkip = (membersPage - 1) * membersLimit
    const handleMembersPageChange = page => {
      return setMembersPage(page)
    }

    const {
      data: teamDetails,
      loading: teamDetailsLoading,
      error: teamDetailsError
    } = useQuery(fetchTeamDetails, {
      variables: {
        teamId
      }
    })
    const {
      data: teamMembers,
      loading: teamMembersLoading,
      error: teamMembersError
    } = useQuery(fetchTeamMembers, {
      variables: {
        teamId,
        membersLimit,
        membersSkip
      }
    })

    if (teamDetailsError || teamMembersError) {
      captureFilteredError(teamDetailsError || teamMembersError)
      return <Redirect to='/error-page/404' />
    }

    if (teamDetailsLoading || teamMembersLoading) return <LoadingSpinner />

    if (teamDetails) {
      const team = teamDetails && {
        ...teamDetails.fetchTeam
      }

      if (
        team.active &&
        (currentUser._id === team.leader._id ||
          currentUser.roles.indexOf('ADMIN') !== -1)
      ) {
        return (
          <ApolloConsumer>
            {client => (
              <TeamDetailsLeader
                team={team}
                teamMembers={teamMembers?.fetchTeamMembers?.members || []}
                user={currentUser}
                client={client}
                teamLeader={team.leader}
                teamId={teamId}
                justEvaluated={justEvaluated}
                handleMembersPageChange={handleMembersPageChange}
                membersPage={membersPage}
                totalMembers={teamDetails.fetchTeam.totalMembers}
                membersLoading={teamMembersLoading}
              />
            )}
          </ApolloConsumer>
        )
      } else {
        return (
          <TeamDetailsMember
            team={team}
            teamId={teamId}
            teamMembers={teamMembers?.fetchTeamMembers?.members || []}
            membersLoading={teamMembersLoading}
            membersPage={membersPage}
            totalMembers={teamDetails.fetchTeam.totalMembers}
            handleMembersPageChange={handleMembersPageChange}
            user={currentUser}
            justEvaluated={justEvaluated}
          />
        )
      }
    }
    return null
  }
)
