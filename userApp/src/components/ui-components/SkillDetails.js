import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { ApolloConsumer, Query, useQuery } from 'react-apollo'
import {
  fetchTeam,
  currentUser,
  fetchSkillDetailsInTeam,
  fetchSkillAvailableInOrganization,
  fetchDataForSkillDetails
} from '../../api'
import FormDescription from './FormDescription'
import skillDetailsStyle from '../../styles/skillDetailsStyle'
import {
  findImageLinkInEmployees,
  findImageLinkInTeam
} from '../teams/_teamUtils'
import { LoadingSpinner, captureFilteredError } from '../general'
import SkillItemWithUser from './SkillItemWithUser'
import history from '../../history'

const findRequiredSkill = (skills, skillId) => {
  if (skills && skills.length > 0) {
    return skills.find(item => item.skillId === skillId)
  }
  return null
}

const sortedSkills = skills => {
  return skills.sort((a, b) => {
    let aValue = a.skillAvailable
    let bValue = b.skillAvailable
    if (a.evaluatedLevel) {
      aValue = a.evaluatedLevel
    }
    if (b.evaluatedLevel) {
      bValue = b.evaluatedLevel
    }
    return bValue - aValue
  })
}

class SkillDetailsInTeam extends Component {
  componentDidMount() {
    const { teamId } = this.props
    if (teamId) {
      this.client
        .query({
          query: fetchTeam,
          variables: { teamId }
        })
        .then(res => this.setState({ team: res.data.fetchTeam }))
      this.client
        .query({ query: currentUser })
        .then(res => this.setState({ user: res.data.currentUser }))
    }
  }

  client = {}
  render() {
    const skillId = this.props.match.params.skillId
    const team = this.state && this.state.team
    const user = this.state && this.state.user
    return (
      <ApolloConsumer>
        {client => {
          this.client = client
          if (team && user) {
            const description = {
              label: this.props.skillName
            }
            const displayEvaluated =
              user.roles.includes('ADMIN') || team.leader._id === user._id
            const isRequiredSkill = findRequiredSkill(
              team.requiredSkills,
              this.props.match.params.skillId
            )
            return (
              <div className='skill-details'>
                <div className='skill-details__heading'>
                  <i
                    className='icon icon-small-right'
                    type='signin'
                    size='large'
                    onClick={e => {
                      e.preventDefault()
                      this.props.history.goBack()
                    }}
                  />
                </div>
                <FormDescription {...description} />
                {isRequiredSkill && isRequiredSkill.level && (
                  <div className='skill-details__subtitle'>
                    <span className='skill-details__subtitle__text'>
                      Required skill level in your team
                    </span>
                    <div className='skill-details__subtitle__count'>
                      {isRequiredSkill.level}
                    </div>
                  </div>
                )}
                <div
                  className={`skill-details__list ${
                    isRequiredSkill && isRequiredSkill.level
                      ? ''
                      : 'no-required-skills'
                  }`}
                >
                  <Query
                    query={fetchSkillDetailsInTeam}
                    variables={{ teamId: team._id, skillId }}
                  >
                    {({ data, loading, error }) => {
                      if (error) {
                        captureFilteredError(error)
                        return null
                      }
                      if (loading) return <LoadingSpinner />
                      return sortedSkills(data.fetchSkillDetailsInTeam).map(
                        tsk => {
                          return (
                            <SkillItemWithUser
                              key={tsk._id}
                              {...tsk}
                              displayEvaluated={
                                user.premium && displayEvaluated
                              }
                              userImage={findImageLinkInTeam(tsk.userId, team)}
                            />
                          )
                        }
                      )
                    }}
                  </Query>
                </div>
                <style jsx>{skillDetailsStyle}</style>
              </div>
            )
          } else {
            return null
          }
        }}
      </ApolloConsumer>
    )
  }
}

class SkillDetailsInOrganization extends Component {
  componentDidMount() {
    this.client
      .query({
        query: currentUser
      })
      .then(res => this.setState({ user: res.data.currentUser }))
  }

  client = {}
  render() {
    const skillId = this.props.match.params.skillId
    const user = this.state && this.state.user

    return (
      <ApolloConsumer>
        {client => {
          this.client = client
          if (user) {
            const displayEvaluated =
              (this.props.excludedTeam &&
                user &&
                this.props.excludedTeam.leader._id === user._id) ||
              user.roles.includes('ADMIN')

            const description = {
              label: this.props.skillName,
              description: `People in the organization, who can help your team with ${this.props.skillName}`
            }

            return (
              <div className='skill-details'>
                <div className='skill-details__heading'>
                  <i
                    className='icon icon-small-right'
                    type='signin'
                    size='large'
                    onClick={e => {
                      e.preventDefault()
                      this.props.history.goBack()
                    }}
                  />
                </div>
                <FormDescription {...description} />
                <div className='skill-details__list'>
                  <Query
                    query={fetchSkillAvailableInOrganization}
                    variables={{ skillId, teamId: '' }}
                  >
                    {({ data, loading, error }) => {
                      if (error) {
                        captureFilteredError(error)
                        return null
                      }
                      if (loading) return <LoadingSpinner />
                      return sortedSkills(
                        data.fetchSkillAvailableInOrganization
                      ).map(tsk => {
                        return (
                          <SkillItemWithUser
                            key={tsk._id}
                            {...tsk}
                            displayEvaluated={user.premium && displayEvaluated}
                            userImage={findImageLinkInEmployees(
                              tsk.userId,
                              this.props.employees
                            )}
                          />
                        )
                      })
                    }}
                  </Query>
                </div>
                <style jsx>{skillDetailsStyle}</style>
              </div>
            )
          }
          return null
        }}
      </ApolloConsumer>
    )
  }
}

const viewDelegator = props => {
  const teamId = props.location.state && props.location.state.teamId
  const skillName = props.location.state && props.location.state.skillName
  const excludedTeam = props.location.state && props.location.state.excludedTeam

  if (teamId)
    return (
      <SkillDetailsInTeam {...props} teamId={teamId} skillName={skillName} />
    )
  if (skillName) {
    return (
      <Query
        query={fetchDataForSkillDetails}
        variables={{ skillId: props.match.params.skillId }}
      >
        {({ data, loading, error }) => {
          if (error) return null
          if (loading) return <LoadingSpinner />

          const orgData = data && data.fetchCurrentUserOrganization
          const employees = data && data.fetchUsersFromOrganizationWithSkill
          if (orgData) {
            return (
              <SkillDetailsInOrganization
                {...props}
                teamIds={orgData.teams.map(t => t._id)}
                excludedTeam={orgData.teams.find(t => t._id === excludedTeam)}
                employees={employees}
                skillName={skillName}
              />
            )
          }
          return null
        }}
      </Query>
    )
  } else {
    history.goBack()
    return null
  }
}
export default withRouter(viewDelegator)
