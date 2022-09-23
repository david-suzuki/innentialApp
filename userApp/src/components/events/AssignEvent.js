import React, { useState, useEffect } from 'react'
import {
  Dialog,
  Button,
  Select,
  Notification,
  Radio
  // Checkbox
} from 'element-react'
import { useQuery } from '@apollo/react-hooks'
import Autosuggest from 'react-autosuggest'
import { BodyPortal } from '../ui-components'
import shareContentStyle from '../../styles/shareContentStyle'
import tableStyle from '../../styles/tableStyle'
import { Link } from 'react-router-dom'
import { ReactComponent as PathsIcon } from '../../static/NewNav_assets/user-route-icons/paths.svg'
import { fetchAttendeeUsers, fetchAttendeeTeams } from '../../api'

const UserTable = ({ selectedUsers, removeUser, onClickLink }) => {
  return (
    <div className='recommend-content__selected-list'>
      <table className='table'>
        <tbody>
          <tr>
            <td>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <PathsIcon
                  className='table-icon--first'
                  style={{ marginRight: '7px', width: '15px' }}
                />
                Name
              </div>
            </td>
            <td style={{ width: '20%' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <img
                  width={15}
                  style={{ marginRight: '7px' }}
                  src={require('../../static/settings.svg')}
                  alt=''
                />
                Settings
              </div>
            </td>
          </tr>
          {selectedUsers.map(
            ({ firstName, lastName, email, _id, assigned }) => {
              const namePlate = firstName
                ? `${firstName}${lastName ? ' ' + lastName : ''} | ${email}`
                : `${email}`

              return (
                <tr>
                  <td>
                    <div style={{ display: 'flex' }}>
                      <img
                        width={15}
                        style={{ marginRight: '5px' }}
                        src={require('../../static/user.svg')}
                        alt=''
                      />
                      {assigned ? (
                        <Link onClick={onClickLink} to={`/profiles/${_id}`}>
                          {namePlate}
                        </Link>
                      ) : (
                        namePlate
                      )}
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {!assigned && (
                      <div
                        style={{
                          cursor: 'pointer',
                          color: '#E72E2D',
                          fontSize: '12px'
                        }}
                        onClick={e => removeUser(_id)}
                      >
                        <i
                          className='el-icon-delete'
                          style={{
                            fontSize: '16px',
                            marginLeft: '5px',
                            fontWeight: 'bold'
                          }}
                        />
                        <span>Delete</span>
                      </div>
                    )}
                  </td>
                </tr>
              )
            }
          )}
          {selectedUsers.length === 0 && (
            <tr>
              <th colSpan='2'>Nothing to display</th>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

const TeamTable = ({ selectedTeams, removeTeam }) => {
  return (
    <div className='recommend-content__selected-list'>
      <table className='table'>
        <tbody>
          <tr>
            <td>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <PathsIcon
                  className='table-icon--first'
                  style={{ marginRight: '7px', width: '15px' }}
                />
                Team Name
              </div>
            </td>

            <td style={{ width: '20%' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end'
                }}
              >
                <img
                  width={15}
                  style={{ marginRight: '7px' }}
                  src={require('../../static/settings.svg')}
                  alt=''
                />
                Settings
              </div>
            </td>
          </tr>
          {/* {selectedTeams.map(({ teamName, _id }) => ( */}
          {selectedTeams.map(({ teamName, _id, assigned }) => {
            return (
              <tr key={_id}>
                <td
                  style={{
                    fontSize: '14px',
                    fontWeight: 400,
                    color: '#152540'
                  }}
                >
                  {teamName}
                </td>
                <td style={{ textAlign: 'right' }}>
                  {!assigned && (
                    <div
                      style={{
                        cursor: 'pointer',
                        color: '#E72E2D',
                        fontSize: '12px'
                      }}
                      onClick={() => removeTeam(_id)}
                    >
                      <i
                        className='el-icon-delete'
                        style={{
                          fontSize: '16px',
                          marginRight: '5px',
                          fontWeight: 'bold'
                        }}
                      />
                      <span>Delete</span>
                    </div>
                  )}
                </td>
              </tr>
            )
          })}
          {selectedTeams.length === 0 && (
            <tr>
              <th colSpan='3'>Nothing to display</th>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

const getScope = current => {
  if (!current) return ''

  if (current.everyone) return 'ALL'
  if (current.teams.length > 0) return 'TEAM'
  if (current.users.length > 0) return 'USER'

  return ''
}

const currentAssignee = {
  everyone: false,
  teams: [],
  users: []
}

const AssignEvent = ({
  inputClicked,
  setInputClicked,
  attendee,
  currentAssignee,
  setEventAssigneesInfo,
  setEventAttendeesInfo
}) => {
  const { data: userData } = useQuery(fetchAttendeeUsers)
  const users = (userData && userData.fetchAttendeeUsers) || []

  const { data: teamData } = useQuery(fetchAttendeeTeams)
  const teams = (teamData && teamData.fetchAttendeeTeams) || []

  // const { data:teams } = useQuery(fetchAttendeeTeams)
  const [assignedToEvent, setAssignedToEvent] = useState(currentAssignee)
  const [selectedUsers, setSelectedUsers] = useState([])
  const [selectedTeams, setSelectedTeams] = useState([])
  const [everyone, setEveryone] = useState(false)
  const [scope, setScope] = useState(getScope(currentAssignee))
  const [suggested, setSuggested] = useState('') // AUTOSUGGEST VALUE (STRING)
  const [suggestions, setSuggestions] = useState([])

  const [email, setEmail] = useState('')
  const handleEmailChange = value => {
    setEmail(value)
  }

  // useEffect(() => {
  //   if (scope === 'USER') {
  //     setSelectedTeams([])
  //   }
  //   if (scope === 'TEAM') {
  //     setSelectedUsers([])
  //   }
  // }, [scope])

  useEffect(() => {
    if (attendee.attendeeType === 'everyone') {
      setScope('ALL')
    } else if (attendee.attendeeType === 'specificusers') {
      setScope('USER')
      const selectedUsers = users.filter(user =>
        attendee.attendeeIds.includes(user._id)
      )
      setSelectedUsers(selectedUsers)
    } else if (attendee.attendeeType === 'specificteams') {
      setScope('TEAM')
      const selectedTeams = teams.filter(team =>
        attendee.attendeeIds.includes(team._id)
      )
      setSelectedTeams(selectedTeams)
    }
  }, [attendee])

  const scopeSelectOptions = [
    <Select.Option value='ALL' label='Everyone' />,
    <Select.Option value='USER' label='Specific users' />,
    <Select.Option value='TEAM' label='Specific teams' />
  ].filter(o => !!o)

  const teamSelectOptions = teams.map(team => (
    <Select.Option key={team._id} value={team._id} label={team.teamName} />
  ))

  const removeTeam = teamId => {
    setSelectedTeams(selectedTeams.filter(({ _id }) => teamId !== _id))
  }

  const selectedUsersInfo =
    selectedUsers.length == 1
      ? `${selectedUsers[0].firstName} ${selectedUsers[0].lastName}`
      : `${selectedUsers.length} attendees`

  const selectedTeamsInfo =
    selectedTeams.length == 1
      ? `${selectedTeams[0].teamName}`
      : `${selectedTeams.length} teams`

  const handleAssign = () => {
    setAssignedToEvent({ everyone, selectedUsers, selectedTeams })
    setInputClicked(false)
    setEventAssigneesInfo(
      everyone
        ? 'Everyone'
        : selectedUsers.length > 0
        ? selectedUsersInfo
        : selectedTeamsInfo
    )
    setEventAttendeesInfo(
      everyone
        ? { type: 'everyone', items: [] }
        : selectedUsers.length > 0
        ? { type: 'specificusers', items: selectedUsers }
        : { type: 'specificteams', items: selectedTeams }
    )
  }
  // AUTOSUGGEST METHODS

  const filterResults = queryString => {
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

  const onSuggestionsFetchRequested = ({ value }) => {
    const filteredResults = users
      .filter(
        user => !selectedUsers.some(selected => selected._id === user._id)
      )
      .filter(filterResults(value))

    setSuggestions(filteredResults)
  }

  const onSuggestionsClearRequested = () => {
    setSuggestions([])
  }

  const onChangeSuggestion = (event, { newValue }) => {
    setSuggested(newValue)
  }

  const onSuggestionSelected = (event, { suggestion }) => {
    setSelectedUsers([...selectedUsers, suggestion])
    handleEmailChange('')
    // addUserToAssignedList(suggestion)
    setSuggested('')
  }

  const removeUser = _id => {
    // removeUserFromAssignedList({ _id })
    setSelectedUsers(selectedUsers.filter(user => user._id !== _id))
  }

  const handleUpdateTeamSelect = value => {
    const newTeams = teams.filter(
      ({ _id: teamId }) =>
        !selectedTeams.some(team => team._id === teamId) &&
        value.some(id => id === teamId)
    )

    setSelectedTeams([...selectedTeams, ...newTeams])
    console.log(value)
  }

  return (
    <BodyPortal>
      <Dialog
        visible={inputClicked}
        onCancel={() => {
          setInputClicked(false)
        }}
        title='Event attendees'
      >
        <Dialog.Body>
          <p className='share-content__title'>
            To whom do you want to send invitation?
          </p>
          <div className='select-autosuggest-in-modal'>
            <Select
              value={scope}
              onChange={value => {
                // if (value === 'MYTEAM') {
                //   setSelectedTeams(teams)
                // }
                setEveryone(value === 'ALL')
                setScope(value)
                setSelectedTeams([])
                setSelectedUsers([])
              }}
              placeholder='Select from one of the options'
              // disabled={!isAdmin && everyone}
            >
              {scopeSelectOptions}
            </Select>
          </div>
          {scope === 'ALL' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '12px'
              }}
            >
              Autoassign to every new person in the organization
            </div>
          )}
          {(scope === 'TEAM' || scope == 'MYTEAM') && (
            <>
              <div className='select-autosuggest-in-modal'>
                <Select
                  value={selectedTeams.map(({ _id: teamId }) => teamId)}
                  onChange={handleUpdateTeamSelect}
                  placeholder='Select teams'
                  multiple
                >
                  {teamSelectOptions}
                </Select>
              </div>
              <TeamTable
                selectedTeams={selectedTeams}
                removeTeam={removeTeam}
              />
            </>
          )}
          {scope === 'USER' && (
            <>
              <div className='select-autosuggest-in-modal'>
                <Autosuggest
                  suggestions={users}
                  onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                  onSuggestionsClearRequested={onSuggestionsClearRequested}
                  getSuggestionValue={suggestion => suggestion.email}
                  onSuggestionSelected={onSuggestionSelected}
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
                    value: email,
                    placeholder: 'Start typing to find employees',
                    onChange: (e, value) => {
                      onChangeSuggestion(e, value)
                      return handleEmailChange(e.target.value)
                    }
                  }}
                />
              </div>
              <UserTable
                selectedUsers={selectedUsers}
                removeUser={removeUser}
              />
            </>
          )}
        </Dialog.Body>
        <Dialog.Footer style={{ textAlign: 'left' }}>
          <Button
            type='primary'
            // loading={loading}
            disabled={
              !everyone && selectedUsers.length + selectedTeams.length === 0
            }
            onClick={handleAssign}
          >
            <p style={{ fontWeight: 'bold', fontSize: '14px' }}>Assign</p>
          </Button>
        </Dialog.Footer>
        <style>{tableStyle}</style>
        <style>{shareContentStyle}</style>
      </Dialog>
    </BodyPortal>
  )
}

AssignEvent.defaultProps = {
  currentAssignee: currentAssignee
}

export default AssignEvent
