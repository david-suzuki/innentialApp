import React, { useState, Component } from 'react'
import { Dialog, Button, Select, Notification, Radio } from 'element-react'
import Container from '../../globalState'
import { Mutation, useQuery } from 'react-apollo'
import {
  recommendContent,
  fetchTeamsForRecommendedContent,
  fetchLikedContentForUser
} from '../../api'
import shareContentStyle from '../../styles/shareContentStyle'
import { captureFilteredError } from '../general'
import Autosuggest from 'react-autosuggest'

const scopes = [
  {
    value: 'USER',
    label: 'Specific users',
    key: 'specusers'
  }
]

class RecommendForm extends Component {
  constructor(props) {
    super(props)

    const { teams, currentUser } = props
    const userLeadTeams = teams.filter(
      team => team.leader._id === currentUser._id
    )

    this.state = {
      userLeadTeams,
      scope: '',
      selectedTeams: [],
      selectedUsers: [],
      usersInTeamScope: 'ALL',
      selectedUsersInTeam: [],
      suggestions: [],
      suggested: ''
    }
  }

  clearSelections = () => {
    this.setState({
      selectedTeams: [],
      selectedUsers: [],
      usersInTeamScope: 'ALL',
      selectedUsersInTeam: [],
      suggestions: [],
      suggested: ''
    })
  }

  setScope = value => {
    this.setState({ scope: value }, () => {
      this.clearSelections()
      const { userLeadTeams } = this.state
      const { setSelectedUsers, users } = this.props
      if (value === 'ALL') {
        setSelectedUsers(users.map(({ _id }) => _id))
      } else if (value === 'MYTEAM') {
        const userIds = userLeadTeams.reduce((acc, team) => {
          const { members, leader } = team
          const array = []
          if (!acc.some(userId => userId === leader._id)) {
            array.push(leader._id)
          }
          members.forEach(member => {
            if (!acc.some(userId => userId === member._id)) {
              array.push(member._id)
            }
          })
          return [...acc, ...array]
        }, [])
        setSelectedUsers(userIds)
      } else setSelectedUsers([])
    })
  }

  onChangeUsersInTeamScope = value => {
    this.setState({ usersInTeamScope: value }, () => {
      const { userLeadTeams } = this.state
      const { setSelectedUsers, users } = this.props
      if (value === 'ALL') {
        const userIds = userLeadTeams.reduce((acc, team) => {
          const { members, leader } = team
          const array = []
          if (!acc.some(userId => userId === leader._id)) {
            array.push(leader._id)
          }
          members.forEach(member => {
            if (!acc.some(userId => userId === member._id)) {
              array.push(member._id)
            }
          })
          return [...acc, ...array]
        }, [])
        setSelectedUsers(userIds)
      } else if (value === 'SPECIFIC') {
        this.setSelectedUsersInTeam([])
      }
    })
  }

  setSelectedUsersInTeam = value => {
    this.setState({ selectedUsersInTeam: value }, () => {
      const { setSelectedUsers } = this.props
      setSelectedUsers(value)
    })
  }

  setSelectedTeams = value => {
    this.setState({ selectedTeams: value }, () => {
      const { teams, setSelectedUsers } = this.props
      const userIds = teams
        .filter(team => value.some(selectedId => team._id === selectedId))
        .reduce((acc, team) => {
          const { members, leader } = team
          const array = []
          if (!acc.some(userId => userId === leader._id)) {
            array.push(leader._id)
          }
          members.forEach(member => {
            if (!acc.some(userId => userId === member._id)) {
              array.push(member._id)
            }
          })
          return [...acc, ...array]
        }, [])
      setSelectedUsers(userIds)
    })
  }

  // AUTOSUGGEST METHODS

  onSuggestionsFetchRequested = ({ value }) => {
    const filteredResults = this.props.users
      .filter(
        user =>
          !this.state.selectedUsers.some(selected => selected._id === user._id)
      )
      .filter(this.filterResults(value))
    this.setState({
      suggestions: filteredResults
    })
  }

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    })
  }

  filterResults = queryString => {
    return ({ firstName, lastName, email }) => {
      if (firstName && lastName) {
        let points = 0
        const individualStrings = queryString.split(' ')
        individualStrings.forEach(s => {
          if (email.indexOf(s.toLowerCase()) === 0) points++
          if (firstName.toLowerCase().indexOf(s.toLowerCase()) === 0) points++
          if (lastName.toLowerCase().indexOf(s.toLowerCase()) === 0) points++
        })
        return points > 0
      } else return email.indexOf(queryString.toLowerCase()) === 0
    }
  }

  onChangeSuggestion = (event, { newValue }) => {
    this.setState({
      suggested: newValue
    })
  }

  onSuggestionSelected = (event, { suggestion }) => {
    this.setState(
      ({ selectedUsers }) => ({
        selectedUsers: [...selectedUsers, suggestion],
        suggested: ''
      }),
      () => {
        const { selectedUsers } = this.state

        const { setSelectedUsers } = this.props
        setSelectedUsers(selectedUsers.map(({ _id }) => _id))
      }
    )
  }

  removeUser = _id => {
    this.setState(
      ({ selectedUsers }) => ({
        selectedUsers: selectedUsers.filter(user => user._id !== _id)
      }),
      () => {
        const { selectedUsers } = this.state

        const { setSelectedUsers } = this.props
        setSelectedUsers(selectedUsers.map(({ _id }) => _id))
      }
    )
  }

  render() {
    const {
      scope,
      userLeadTeams,
      selectedTeams,
      selectedUsers,
      selectedUsersInTeam,
      suggestions,
      suggested,
      usersInTeamScope
    } = this.state
    const { currentUser, teams } = this.props
    const isAdmin = currentUser.roles.indexOf('ADMIN') !== -1

    const scopeSelectOptions = [
      scopes.map(scope => <Select.Option {...scope} />)
    ]

    if (isAdmin)
      scopeSelectOptions.unshift(
        <Select.Option key='allusers' value='ALL' label='Everyone' />
      )
    if (userLeadTeams.length > 1 || isAdmin)
      scopeSelectOptions.push(
        <Select.Option
          key='specteams'
          value='SPECIFIC'
          label='Specific teams'
        />
      )
    if (userLeadTeams.length > 0)
      scopeSelectOptions.push(
        <Select.Option key='myteams' value='MYTEAM' label='My teams' />
      )

    const teamSelectOptions = teams.map(team => (
      <Select.Option key={team._id} value={team._id} label={team.teamName} />
    ))

    const userSelectOptions = userLeadTeams
      .reduce((acc, team) => {
        const { members, leader } = team
        const array = []
        if (!acc.some(user => user._id === leader._id)) {
          array.push(leader)
        }
        members.forEach(member => {
          if (!acc.some(user => user._id === member._id)) {
            array.push(member)
          }
        })
        return [...acc, ...array]
      }, [])
      .map(user => (
        <Select.Option
          key={user._id}
          value={user._id}
          label={
            user.firstName && user.lastName
              ? `${user.firstName} ${user.lastName} (${user.email})`
              : user.email
          }
        />
      ))

    return (
      <>
        <p className='share-content__title'>
          To whom do you want to recommend this item?
        </p>
        <p className='share-content__subtitle'>
          The item will be visible in the development plan recommendations for
          the selected person(s)
        </p>
        <div className='select-autosuggest-in-modal'>
          <Select
            value={scope}
            onChange={this.setScope}
            placeholder='Select from one of the options'
          >
            {scopeSelectOptions}
          </Select>
        </div>
        {scope === 'MYTEAM' && (
          <>
            <p className='share-content__subtitle'>
              You will also receive the item recommendation if you select
              "Everyone in team"
            </p>
            <Radio.Group
              value={usersInTeamScope}
              onChange={this.onChangeUsersInTeamScope}
            >
              <Radio value='ALL'>Everyone in team</Radio>
              <Radio value='SPECIFIC'>Specific users</Radio>
            </Radio.Group>
          </>
        )}
        {scope === 'MYTEAM' && usersInTeamScope === 'SPECIFIC' && (
          <div className='select-autosuggest-in-modal'>
            <Select
              value={selectedUsersInTeam}
              onChange={this.setSelectedUsersInTeam}
              placeholder='Select users'
              multiple
            >
              {userSelectOptions}
            </Select>
          </div>
        )}
        {scope === 'SPECIFIC' && (
          <div className='select-autosuggest-in-modal'>
            <Select
              value={selectedTeams}
              onChange={this.setSelectedTeams}
              placeholder='Select teams'
              multiple
            >
              {teamSelectOptions}
            </Select>
          </div>
        )}
        {scope === 'USER' && (
          <>
            <div className='select-autosuggest-in-modal'>
              <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={suggestion => suggestion.email}
                onSuggestionSelected={this.onSuggestionSelected}
                renderSuggestion={({ firstName, lastName, email }) => {
                  return (
                    <div>
                      {firstName
                        ? `${firstName}${
                            lastName ? ' ' + lastName : ''
                          } | ${email}`
                        : `${email}`}
                    </div>
                  )
                }}
                inputProps={{
                  value: suggested,
                  placeholder: 'Start typing to find employees',
                  onChange: this.onChangeSuggestion
                }}
              />
            </div>
            <div className='recommend-content__selected-tags'>
              {selectedUsers.map(({ firstName, lastName, email, _id }) => (
                <Button
                  key={_id}
                  type='primary'
                  className='el-button--cascader'
                  style={{ marginBottom: '5px' }}
                  onClick={e => this.removeUser(_id)}
                >
                  {firstName
                    ? `${firstName}${lastName ? ' ' + lastName : ''} | ${email}`
                    : `${email}`}{' '}
                  <i className='icon icon-e-remove' />
                </Button>
              ))}
            </div>
          </>
        )}
      </>
    )
  }
}

export default ({ currentUser }) => {
  const container = Container.useContainer()
  const [selectedUsers, setSelectedUsers] = useState([])

  const { data, loading, error } = useQuery(fetchTeamsForRecommendedContent)

  if (loading) return null

  if (error) {
    captureFilteredError(error)
  }

  const teams = data?.fetchCurrentUserOrganization?.teams || []
  const users = data?.fetchCurrentUserOrganization?.employees || []
  if (!container.sharedContent) return null

  const { contentId } = container.sharedContent
  return (
    <>
      <Mutation
        mutation={recommendContent}
        refetchQueries={[
          'fetchRelevantContentForUser',
          'fetchUserUploadedContent',
          {
            query: fetchLikedContentForUser
          }
        ]}
      >
        {(mutation, { loading }) => {
          return (
            <Dialog
              visible={container.isRecommendingContent}
              onCancel={() => {
                container.setRecommendingContent(false)
                container.setSharedContent(null)
              }}
            >
              <Dialog.Body>
                <div>
                  <RecommendForm
                    currentUser={currentUser}
                    users={users}
                    setSelectedUsers={setSelectedUsers}
                    teams={teams}
                  />
                  <Button
                    className='el-button--space-top'
                    type='primary'
                    loading={loading}
                    disabled={selectedUsers && selectedUsers.length === 0}
                    onClick={e => {
                      e.preventDefault()
                      mutation({
                        variables: {
                          contentId,
                          userIds: selectedUsers
                        }
                      })
                        .then(({ data: { recommendContent: result } }) => {
                          if (result === 'OK') {
                            container.setRecommendingContent(false)
                            container.setSharedContent(null)
                            setSelectedUsers([])
                            Notification({
                              type: 'success',
                              message:
                                'Content has been recommended to selected users',
                              duration: 1500,
                              offset: 90
                            })
                          } else {
                            Notification({
                              type: 'warning',
                              message: "Couldn't recommend item to users",
                              duration: 1500,
                              offset: 90
                            })
                          }
                        })
                        .catch(err => {
                          captureFilteredError(err)
                          Notification({
                            type: 'warning',
                            message: 'Oops! Something went wrong',
                            duration: 1500,
                            offset: 90
                          })
                        })
                    }}
                  >
                    Recommend
                  </Button>
                </div>
              </Dialog.Body>
            </Dialog>
          )
        }}
      </Mutation>
      <style jsx>{shareContentStyle}</style>
    </>
  )
}
