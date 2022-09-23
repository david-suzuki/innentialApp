import React, { useState, useEffect } from 'react'
import {
  Dialog,
  Button,
  Select,
  Notification,
  Radio
  // Checkbox
} from 'element-react'
import Autosuggest from 'react-autosuggest'
import { useMutation, useQuery } from 'react-apollo'
import {
  assignLearningPaths,
  assignLearningPathsLeader,
  fetchTeamLearningPath,
  fetchCurrentUserOrganizationTeams,
  fetchCurrentUserOrganizationWithoutImages,
  fetchFilteredEmployees,
  fetchTeamLearningPathsProgress
} from '../../api'
import { captureFilteredError, LoadingSpinner } from '../general'
// import roleAssignmentStyle from '../../styles/roleAssignmentStyle'
import Container from '../../globalState'
import { BodyPortal } from './'
import shareContentStyle from '../../styles/shareContentStyle'
import tableStyle from '../../styles/tableStyle'
import { Link } from 'react-router-dom'
import { ReactComponent as PathsIcon } from '../../static/NewNav_assets/user-route-icons/paths.svg'

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

const TeamTable = ({ selectedTeams, setAutoassignTeam, removeTeam }) => {
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
            <td>
              <div
                style={{
                  display: 'flex',
                  width: 'fit-content',
                  marginLeft: 'auto',
                  marginRight: 'auto'
                }}
              >
                <img
                  width={15}
                  style={{ marginRight: '7px' }}
                  src={require('../../static/check-circle.svg')}
                  alt=''
                />
                Autoassign
                {/* <img
              width={15}
              style={{ marginLeft: '5px' }}
              src={require('../../static/sort.svg')}
              alt=''
            /> */}
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
          {selectedTeams.map(({ teamName, _id, autoassign, assigned }) => {
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
                <td style={{ textAlign: 'center' }}>
                  <img
                    src={
                      autoassign
                        ? require('../../static/check-circle-green.svg')
                        : require('../../static/noncheck-circle.svg')
                    }
                    style={{
                      width: '24px',
                      height: '24px',
                      cursor: 'pointer'
                    }}
                    alt='autoassign-icon'
                    onClick={() => setAutoassignTeam(_id, !autoassign)}
                  />
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

const AssignPathAdmin = ({
  users: employees = [],
  teams: allTeams = [],
  email,
  handleEmailChange,
  loading: employeesLoading,
  addUserToAssignedList,
  removeUserFromAssignedList
  // currentUser
}) => {
  const { isAssigningPath, setAssigningPath } = Container.useContainer()

  const teamPath =
    isAssigningPath.team &&
    allTeams.find(({ _id: teamId }) => teamId === isAssigningPath.team._id)

  const users = teamPath
    ? employees.filter(user => {
        const teamMembers = [teamPath.leader, ...teamPath.members].map(
          ({ _id }) => _id
        )

        return teamMembers.indexOf(user._id) !== -1
      })
    : employees

  const teams = teamPath ? [teamPath] : allTeams // if path belongs to team, it can only be assigned to that team, otherwise you can assign to anyone

  const currentAssignee = isAssigningPath.assignee

  const [assignLearningPathMutation, { loading }] = useMutation(
    assignLearningPaths
  )

  const assignLearningPath = ({
    pathId,
    selectedUsers,
    selectedTeams,
    everyone,
    autoassign
  }) => {
    if (pathId) {
      let mutationLoading = true
      const mutation = assignLearningPathMutation({
        variables: {
          input: {
            pathId,
            autoassign,
            users: selectedUsers.map(({ _id: userId }) => userId),
            teams: selectedTeams.map(({ _id: teamId, autoassign }) => ({
              teamId,
              autoassign
            })),
            everyone
          }
        },
        update: (proxy, { data: { assignLearningPaths: learningPath } }) => {
          try {
            if (scope == 'USER') {
              for (const team of teams) {
                let usersArray = []
                for (const user of learningPath.assignee.users) {
                  const filter = [...team.members, team.leader].filter(
                    value => {
                      return value._id == user._id
                    }
                  )[0]
                  usersArray = [...usersArray, filter]
                }
                usersArray = usersArray.filter(value => {
                  return value !== undefined
                })
                if (usersArray.length !== 0) {
                  let readQuery = proxy.readQuery({
                    query: fetchTeamLearningPathsProgress,
                    variables: { teamId: team._id, filter: 'ALL_TIME' }
                  })

                  let learningPathInCache = readQuery.fetchTeamLearningPathsProgress.filter(
                    value => value.pathId == learningPath._id
                  )
                  if (learningPathInCache.length == 0) {
                    const newPathProgress = {
                      _id: `${learningPath._id}:${team._id}`,
                      pathId: learningPath._id,
                      pathName: learningPath.name,
                      __typename: 'TeamPathStatistics',
                      assignedTo: usersArray.map(user => {
                        return {
                          firstName: user.firstName,
                          imageLink: user.imageLink,
                          lastName: user.lastName,
                          status: 'NOT STARTED',
                          userId: user._id,
                          __typename: 'AssignedToUser',
                          _id: `${user._id}:${team._id}`
                        }
                      })
                    }

                    proxy.writeQuery({
                      query: fetchTeamLearningPathsProgress,
                      variables: { teamId: team._id, filter: 'ALL_TIME' },
                      data: {
                        fetchTeamLearningPathsProgress: [
                          ...readQuery.fetchTeamLearningPathsProgress,
                          newPathProgress
                        ]
                      }
                    })
                  } else {
                    for (const user of usersArray) {
                      const filteredUsersInCache = learningPathInCache[0].assignedTo.filter(
                        value => {
                          return value.userId == user._id
                        }
                      )

                      if (filteredUsersInCache.length == 0) {
                        const newUser = {
                          firstName: user.firstName,
                          imageLink: user.imageLink,
                          lastName: user.lastName,
                          status: 'NOT STARTED',
                          userId: user._id,
                          __typename: 'AssignedToUser',
                          _id: `${user._id}:${team._id}`
                        }
                        learningPathInCache[0] = {
                          ...learningPathInCache[0],
                          assignedTo: [
                            ...learningPathInCache[0].assignedTo,
                            newUser
                          ]
                        }
                        let learningPathsWithout = readQuery.fetchTeamLearningPathsProgress.filter(
                          value => {
                            return (
                              value.pathId !== learningPathInCache[0].pathId
                            )
                          }
                        )

                        proxy.writeQuery({
                          query: fetchTeamLearningPathsProgress,
                          variables: { teamId: team._id, filter: 'ALL_TIME' },
                          data: {
                            fetchTeamLearningPathsProgress: [
                              ...learningPathsWithout,
                              learningPathInCache[0]
                            ]
                          }
                        })
                      }
                    }
                  }
                }
              }
            } else if (scope == 'TEAM') {
              for (const team of learningPath.assignee.teams) {
                let readQuery = proxy.readQuery({
                  query: fetchTeamLearningPathsProgress,
                  variables: { teamId: team.team._id, filter: 'ALL_TIME' }
                })
                const Team = teams.filter(value => {
                  return value._id == team.team._id
                })[0]
                const users = [...Team.members, Team.leader]
                const foundedPath = readQuery.fetchTeamLearningPathsProgress.filter(
                  value => {
                    return value.pathId == learningPath._id
                  }
                )

                if (foundedPath.length == 0) {
                  const newPathProgress = {
                    pathId: learningPath._id,
                    pathName: learningPath.name,
                    __typename: 'TeamPathStatistics',
                    _id: `${learningPath._id}:${team._id}`,
                    assignedTo: users.map(user => {
                      return {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        imageLink: user.imageLink,
                        status: 'NOT STARTED',
                        userId: user._id,
                        __typename: 'AssignedToUser',
                        _id: `${user._id}:${team._id}`
                      }
                    })
                  }

                  readQuery.fetchTeamLearningPathsProgress = [
                    ...readQuery.fetchTeamLearningPathsProgress,
                    newPathProgress
                  ]

                  proxy.writeQuery({
                    query: fetchTeamLearningPathsProgress,
                    variables: { teamId: team.team._id, filter: 'ALL_TIME' },
                    data: readQuery
                  })
                } else if (foundedPath.length !== 0) {
                  let usersNotAssignedTo = []

                  usersNotAssignedTo = users.map(user => {
                    let foundedUsers = foundedPath[0].assignedTo.filter(
                      value => {
                        return value.userId == user._id
                      }
                    )
                    if (foundedUsers.length == 0) {
                      return user
                    }
                  })
                  usersNotAssignedTo = usersNotAssignedTo.filter(value => {
                    return value !== undefined
                  })

                  for (
                    let i = 0;
                    i < readQuery.fetchTeamLearningPathsProgress.length;
                    i++
                  ) {
                    usersNotAssignedTo = usersNotAssignedTo.map(user => {
                      return {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        imageLink: user.imageLink,
                        status: 'NOT STARTED',
                        userId: user._id,
                        __typename: 'AssignedToUser',
                        _id: `${user._id}:${team._id}`
                      }
                    })
                    if (
                      readQuery.fetchTeamLearningPathsProgress[i]._id ==
                      foundedPath[0]._id
                    ) {
                      readQuery.fetchTeamLearningPathsProgress[i].assignedTo = [
                        ...usersNotAssignedTo,
                        ...readQuery.fetchTeamLearningPathsProgress[i]
                          .assignedTo
                      ]
                    }
                  }

                  proxy.writeQuery({
                    query: fetchTeamLearningPathsProgress,
                    variables: { teamId: team.team._id, filter: 'ALL_TIME' },
                    data: readQuery
                  })
                }
              }
            } else if (scope == 'ALL') {
              for (const team of teams) {
                try {
                  let readQuery = proxy.readQuery({
                    query: fetchTeamLearningPathsProgress,
                    variables: { teamId: team._id, filter: 'ALL_TIME' }
                  })
                  let foundedPath = readQuery.fetchTeamLearningPathsProgress?.filter(
                    value => {
                      return value.pathId == learningPath._id
                    }
                  )
                  if (foundedPath.length == 0) {
                    let users = [...team.members, team.leader]
                    readQuery.fetchTeamLearningPathsProgress = [
                      ...readQuery.fetchTeamLearningPathsProgress,
                      {
                        _id: `${learningPath._id}:${team._id}`,
                        pathId: learningPath._id,
                        pathName: learningPath.name,
                        __typename: 'TeamPathStatistics',
                        assignedTo: users.map(user => {
                          return {
                            firstName: user.firstName,
                            lastName: user.lastName,
                            imageLink: user.imageLink,
                            status: 'NOT STARTED',
                            userId: user._id,
                            __typename: 'AssignedToUser',
                            _id: `${user._id}:${team._id}`
                          }
                        })
                      }
                    ]

                    proxy.writeQuery({
                      query: fetchTeamLearningPathsProgress,
                      variables: { teamId: team._id, filter: 'ALL_TIME' },
                      data: readQuery
                    })
                  } else if (foundedPath.length !== 0) {
                    let users = [...team.members, team.leader]

                    users = users.map(user => {
                      let foundedUser = foundedPath[0].assignedTo.filter(
                        value => {
                          return value.userId == user._id
                        }
                      )
                      if (foundedUser.length == 0) {
                        return user
                      } else {
                      }
                    })

                    users = users.filter(value => {
                      return value != undefined
                    })

                    if (users.length != 0) {
                      let readQueryWithoutFoundedPath = readQuery.fetchTeamLearningPathsProgress.filter(
                        value => {
                          return value.pathId !== foundedPath[0].pathId
                        }
                      )

                      let oldUsers = users.map(user => {
                        return foundedPath[0].assignedTo.filter(value => {
                          return value.userId != user._id
                        })[0]
                      })
                      users = users.map(user => {
                        return {
                          _id: `${user._id}:${team._id}`,
                          firstName: user.firstName,
                          lastName: user.lastName,
                          __typename: 'AssignedToUser',
                          userId: user._id,
                          imageLink: user.imageLink,
                          status: 'NOT STARTED'
                        }
                      })
                      readQuery.fetchTeamLearningPathsProgress = [
                        ...readQueryWithoutFoundedPath,
                        {
                          ...foundedPath[0],
                          assignedTo: [...oldUsers, ...users]
                        }
                      ]

                      proxy.writeQuery({
                        query: fetchTeamLearningPathsProgress,
                        variables: { teamId: team._id, filter: 'ALL_TIME' },
                        data: readQuery
                      })
                    }
                  }
                } catch (e) {}
              }
            }
          } catch (e) {}

          try {
            const { fetchTeamLearningPath: teams } = proxy.readQuery({
              query: fetchTeamLearningPath
            })
            const updatedTeams = teams.map(
              ({ teamId, learningPaths, ...rest }) => {
                if (
                  selectedTeams.some(team => team._id === teamId) &&
                  !learningPaths.some(lp => lp._id === learningPath._id)
                ) {
                  const newLearningPaths = [...learningPaths, learningPath]
                  return {
                    teamId,
                    ...rest,
                    learningPaths: newLearningPaths
                  }
                }
                return {
                  teamId,
                  learningPaths,
                  ...rest
                }
              }
            )

            const newTeams = selectedTeams
              .filter(team => !teams.some(({ teamId }) => team._id === teamId))
              .map(({ _id: teamId, teamName }) => ({
                _id: `new-team:${teamId}`,
                teamId,
                teamName,
                learningPaths: [learningPath],
                __typename: 'TeamLearningPaths'
              }))

            proxy.writeQuery({
              query: fetchTeamLearningPath,
              data: {
                fetchTeamLearningPath: [...newTeams, ...updatedTeams]
              }
            })
          } catch (e) {}
        }
      })
        .then(() => {
          mutationLoading = false
          setAssigningPath(null)
          return Notification({
            type: 'success',
            message: everyone
              ? `Assignment might take a few moments`
              : 'Assignment was successful',
            duration: 2500,
            offset: 90
          })
        })

        .catch(e => {
          captureFilteredError(e)
          Notification({
            type: 'warning',
            message: 'Oops! Something went wrong',
            duration: 2500,
            offset: 90
          })
        })

      if (mutationLoading) {
        return <LoadingSpinner />
      }
    }

    // setCurrentAssignee(null)
    setAssigningPath(null)
  }

  const [selectedUsers, setSelectedUsers] = useState(
    currentAssignee?.users?.map(user => ({ ...user, assigned: true })) || []
  ) // USER
  const [selectedTeams, setSelectedTeams] = useState(
    currentAssignee?.teams
      ?.filter(({ team }) => !!team)
      ?.map(({ team, autoassign }) => ({
        ...team,
        autoassign,
        assigned: true
      })) || []
  ) // TEAM
  const [everyone, setEveryone] = useState(
    !isAssigningPath.team && (currentAssignee?.everyone || false)
  ) // BOOL
  const [autoassign, setAutoassign] = useState(
    currentAssignee?.autoassign || false
  ) // BOOL
  const [scope, setScope] = useState(getScope(currentAssignee)) // STRING
  const [suggested, setSuggested] = useState('') // AUTOSUGGEST VALUE (STRING)
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    if (scope === 'USER') {
      setSelectedTeams([])
    }
    if (scope === 'TEAM') {
      setSelectedUsers([])
    }
  }, [scope])

  const scopeSelectOptions = [
    !teamPath && <Select.Option value='ALL' label='Everyone' />,
    <Select.Option value='USER' label='Specific users' />,
    <Select.Option value='TEAM' label='Specific teams' />
  ].filter(o => !!o)

  // scopeSelectOptions.unshift(
  //   <Select.Option
  //     key='allusers'
  //     value='ALL'
  //     label='Everyone'
  //     disabled={!isAdmin}
  //   />
  // )
  // if (userLeadTeams.length > 0 || (isAdmin && teams.length > 0))
  //   scopeSelectOptions.push(
  //     <Select.Option key='specteams' value='TEAM' label='Specific teams' />
  //   )

  const teamSelectOptions = teams.map(team => (
    <Select.Option key={team._id} value={team._id} label={team.teamName} />
  ))

  const setAutoassignTeam = (teamId, value) => {
    setSelectedTeams(
      selectedTeams.map(({ autoassign, ...team }) => ({
        ...team,
        autoassign: team._id === teamId ? value : autoassign
      }))
    )
  }

  const removeTeam = teamId => {
    setSelectedTeams(selectedTeams.filter(({ _id }) => teamId !== _id))
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
    addUserToAssignedList(suggestion)
    setSuggested('')
  }

  const removeUser = _id => {
    removeUserFromAssignedList({ _id })
    setSelectedUsers(selectedUsers.filter(user => user._id !== _id))
  }

  const handleUpdateTeamSelect = value => {
    const currentAssigned = selectedTeams.filter(({ assigned }) => assigned)
    const newTeams = teams
      .filter(
        ({ _id: teamId }) =>
          !currentAssigned.some(team => team._id === teamId) &&
          value.some(id => id === teamId)
      )
      .map(team => ({
        ...team,
        autoassign: selectedTeams.find(({ _id: teamId }) => team._id === teamId)
          ?.autoassign
      }))
    setSelectedTeams([...currentAssigned, ...newTeams])
  }

  return (
    <BodyPortal>
      <Dialog
        visible={!!isAssigningPath}
        onCancel={() => {
          // setCurrentAssignee(null)
          setAssigningPath(null)
        }}
        title='Assign learning path'
      >
        <Dialog.Body>
          <p className='share-content__title'>
            To whom do you want to assign this path?
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
              <img
                src={
                  autoassign
                    ? require('../../static/check-circle-green.svg')
                    : require('../../static/noncheck-circle.svg')
                }
                style={{
                  width: '24px',
                  height: '24px',
                  cursor: 'pointer',
                  marginRight: 10
                }}
                alt='autoassign-icon'
                onClick={() => setAutoassign(!autoassign)}
              />
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
                setAutoassignTeam={setAutoassignTeam}
                removeTeam={removeTeam}
              />
            </>
          )}
          {scope === 'USER' && (
            <>
              <div className='select-autosuggest-in-modal'>
                <Autosuggest
                  suggestions={employeesLoading ? [] : employees}
                  onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                  onSuggestionsClearRequested={onSuggestionsClearRequested}
                  getSuggestionValue={suggestion => suggestion.email}
                  onSuggestionSelected={onSuggestionSelected}
                  renderSuggestion={({ firstName, lastName, email }) => {
                    if (employeesLoading) {
                      return <LoadingSpinner />
                    } else {
                      return (
                        <div>
                          {firstName
                            ? `${firstName}${
                                lastName ? ' ' + lastName : ''
                              } | ${email}`
                            : `${email}`}
                        </div>
                      )
                    }
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
            loading={loading}
            disabled={
              !everyone && selectedUsers.length + selectedTeams.length === 0
            }
            onClick={() =>
              assignLearningPath({
                pathId: isAssigningPath._id,
                selectedUsers,
                selectedTeams,
                everyone,
                autoassign
              })
            }
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

const AssignPathLeader = ({
  users: userTeamMembers = [],
  teams: userTeams = []
}) => {
  const { isAssigningPath, setAssigningPath } = Container.useContainer()

  const teamPath =
    isAssigningPath.team &&
    userTeams.find(({ _id: teamId }) => teamId === isAssigningPath.team._id)

  const users = teamPath
    ? userTeamMembers.filter(user => {
        const teamMembers = [teamPath.leader, ...teamPath.members].map(
          ({ _id }) => _id
        )

        return teamMembers.indexOf(user._id) !== -1
      })
    : userTeamMembers

  const teams = teamPath ? [teamPath] : userTeams // if path belongs to team, it can only be assigned to that team, otherwise you can assign to anyone

  const currentAssignee = isAssigningPath.assignee

  const [assignLearningPathMutation, { loading }] = useMutation(
    assignLearningPathsLeader
  )

  const assignLearningPath = ({ pathId, selectedUsers, selectedTeams }) => {
    if (pathId) {
      assignLearningPathMutation({
        variables: {
          input: {
            pathId,
            users: selectedUsers.map(({ _id: userId }) => userId),
            teams: selectedTeams.map(({ _id: teamId, autoassign }) => ({
              teamId,
              autoassign
            }))
          }
        },
        update: (
          proxy,
          { data: { assignLearningPathsLeader: learningPath } }
        ) => {
          try {
            if (scope == 'USER') {
              for (const team of teams) {
                let usersArray = []
                for (const user of learningPath.assignee.users) {
                  const filter = [...team.members, team.leader].find(value => {
                    return value._id == user._id
                  })
                  usersArray = [...usersArray, filter]
                }
                usersArray = usersArray.filter(value => {
                  return value !== undefined
                })
                if (usersArray.length !== 0) {
                  let readQuery = proxy.readQuery({
                    query: fetchTeamLearningPathsProgress,
                    variables: { teamId: team._id, filter: 'ALL_TIME' }
                  })

                  let learningPathInCache = readQuery.fetchTeamLearningPathsProgress.filter(
                    value => value.pathId == learningPath._id
                  )
                  if (learningPathInCache.length == 0) {
                    const newPathProgress = {
                      _id: `${learningPath._id}:${team._id}`,
                      pathId: learningPath._id,
                      pathName: learningPath.name,
                      __typename: 'TeamPathStatistics',
                      assignedTo: usersArray.map(user => {
                        return {
                          firstName: user.firstName,
                          imageLink: user.imageLink,
                          lastName: user.lastName,
                          status: 'NOT STARTED',
                          userId: user._id,
                          __typename: 'AssignedToUser',
                          _id: `${user._id}:${team._id}`
                        }
                      })
                    }

                    proxy.writeQuery({
                      query: fetchTeamLearningPathsProgress,
                      variables: { teamId: team._id, filter: 'ALL_TIME' },
                      data: {
                        fetchTeamLearningPathsProgress: [
                          ...readQuery.fetchTeamLearningPathsProgress,
                          newPathProgress
                        ]
                      }
                    })
                  } else {
                    for (const user of usersArray) {
                      const filteredUsersInCache = learningPathInCache[0].assignedTo.filter(
                        value => {
                          return value.userId == user._id
                        }
                      )

                      if (filteredUsersInCache.length == 0) {
                        const newUser = {
                          firstName: user.firstName,
                          imageLink: user.imageLink,
                          lastName: user.lastName,
                          status: 'NOT STARTED',
                          userId: user._id,
                          __typename: 'AssignedToUser',
                          _id: `${user._id}:${team._id}`
                        }
                        learningPathInCache[0] = {
                          ...learningPathInCache[0],
                          assignedTo: [
                            ...learningPathInCache[0].assignedTo,
                            newUser
                          ]
                        }
                        let learningPathsWithout = readQuery.fetchTeamLearningPathsProgress.filter(
                          value => {
                            return (
                              value.pathId !== learningPathInCache[0].pathId
                            )
                          }
                        )

                        proxy.writeQuery({
                          query: fetchTeamLearningPathsProgress,
                          variables: { teamId: team._id, filter: 'ALL_TIME' },
                          data: {
                            fetchTeamLearningPathsProgress: [
                              ...learningPathsWithout,
                              learningPathInCache[0]
                            ]
                          }
                        })
                      }
                    }
                  }
                }
              }
            } else if (scope == 'TEAM' || scope == 'MYTEAM') {
              for (const team of learningPath.assignee.teams) {
                let readQuery = proxy.readQuery({
                  query: fetchTeamLearningPathsProgress,
                  variables: { teamId: team.team._id, filter: 'ALL_TIME' }
                })
                const Team = teams.find(value => {
                  return value._id == team.team._id
                })
                const users = [...Team.members, Team.leader]
                const foundedPath = readQuery.fetchTeamLearningPathsProgress.filter(
                  value => {
                    return value.pathId == learningPath._id
                  }
                )

                if (foundedPath.length == 0) {
                  const newPathProgress = {
                    pathId: learningPath._id,
                    pathName: learningPath.name,
                    __typename: 'TeamPathStatistics',
                    _id: `${learningPath._id}:${team._id}`,
                    assignedTo: users.map(user => {
                      return {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        imageLink: user.imageLink,
                        status: 'NOT STARTED',
                        userId: user._id,
                        __typename: 'AssignedToUser',
                        _id: `${user._id}:${team._id}`
                      }
                    })
                  }

                  readQuery.fetchTeamLearningPathsProgress = [
                    ...readQuery.fetchTeamLearningPathsProgress,
                    newPathProgress
                  ]

                  proxy.writeQuery({
                    query: fetchTeamLearningPathsProgress,
                    variables: { teamId: team.team._id, filter: 'ALL_TIME' },
                    data: readQuery
                  })
                } else if (foundedPath.length !== 0) {
                  let usersNotAssignedTo = []

                  usersNotAssignedTo = users.map(user => {
                    let foundedUsers = foundedPath[0].assignedTo.filter(
                      value => {
                        return value.userId == user._id
                      }
                    )
                    if (foundedUsers.length == 0) {
                      return user
                    }
                  })
                  usersNotAssignedTo = usersNotAssignedTo.filter(value => {
                    return value !== undefined
                  })

                  for (
                    let i = 0;
                    i < readQuery.fetchTeamLearningPathsProgress.length;
                    i++
                  ) {
                    usersNotAssignedTo = usersNotAssignedTo.map(user => {
                      return {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        imageLink: user.imageLink,
                        status: 'NOT STARTED',
                        userId: user._id,
                        __typename: 'AssignedToUser',
                        _id: `${user._id}:${team._id}`
                      }
                    })
                    if (
                      readQuery.fetchTeamLearningPathsProgress[i]._id ==
                      foundedPath[0]._id
                    ) {
                      readQuery.fetchTeamLearningPathsProgress[i].assignedTo = [
                        ...usersNotAssignedTo,
                        ...readQuery.fetchTeamLearningPathsProgress[i]
                          .assignedTo
                      ]
                    }
                  }

                  proxy.writeQuery({
                    query: fetchTeamLearningPathsProgress,
                    variables: { teamId: team.team._id, filter: 'ALL_TIME' },
                    data: readQuery
                  })
                }
              }
            }
          } catch (e) {}
          try {
            const { fetchTeamLearningPath: teams } = proxy.readQuery({
              query: fetchTeamLearningPath
            })

            const updatedTeams = teams.map(
              ({ teamId, learningPaths, ...rest }) => {
                if (
                  selectedTeams.some(team => team._id === teamId) &&
                  !learningPaths.some(lp => lp._id === learningPath._id)
                ) {
                  const newLearningPaths = [...learningPaths, learningPath]
                  return {
                    teamId,
                    ...rest,
                    learningPaths: newLearningPaths
                  }
                }
                return {
                  teamId,
                  learningPaths,
                  ...rest
                }
              }
            )

            const newTeams = selectedTeams
              .filter(team => !teams.some(({ teamId }) => team._id === teamId))
              .map(({ _id: teamId, teamName }) => ({
                _id: `new-team:${teamId}`,
                teamId,
                teamName,
                learningPaths: [learningPath],
                __typename: 'TeamLearningPaths'
              }))

            proxy.writeQuery({
              query: fetchTeamLearningPath,
              data: {
                fetchTeamLearningPath: [...newTeams, ...updatedTeams]
              }
            })
          } catch (e) {}
        }
      })
        .then(() =>
          Notification({
            type: 'success',
            message: 'Assignment was successful',
            duration: 2500,
            offset: 90
          })
        )
        .catch(e => {
          captureFilteredError(e)
          Notification({
            type: 'warning',
            message: 'Oops! Something went wrong',
            duration: 2500,
            offset: 90
          })
        })
    }
    // setCurrentAssignee(null)
    setAssigningPath(null)
  }

  // IF PATH IS ASSIGNED TO EVERYONE, TEAM LEAD HAS NO AGENCY
  const everyone = !isAssigningPath.team && (currentAssignee?.everyone || false) // BOOL

  const [selectedUsers, setSelectedUsers] = useState(
    currentAssignee?.users
      ?.filter(user => users.some(({ _id: userId }) => userId === user._id))
      ?.map(user => ({ ...user, assigned: true })) || []
  ) // USERID
  const [selectedTeams, setSelectedTeams] = useState(
    currentAssignee?.teams
      ?.filter(({ team }) => !!team)
      ?.filter(({ team }) =>
        teams.some(({ _id: teamId }) => teamId === team._id)
      )
      ?.map(({ team, autoassign }) => ({
        ...team,
        autoassign,
        assigned: true
      })) || []
  ) // TEAMID
  const [scope, setScope] = useState(getScope(currentAssignee)) // STRING

  const [suggested, setSuggested] = useState('') // AUTOSUGGEST VALUE (STRING)
  const [suggestions, setSuggestions] = useState([]) // AUTOSUGGEST SUGGESTIONS (ARRAY)

  const scopeSelectOptions = [
    everyone && <Select.Option value='ALL' label='Everyone' disabled={true} />,
    <Select.Option value='USER' label='Specific users' />,
    // <Select.Option value='TEAM' label='Specific teams' />,
    <Select.Option value='MYTEAM' label='My teams' />
  ].filter(o => !!o)

  // scopeSelectOptions.unshift(
  //   <Select.Option
  //     key='allusers'
  //     value='ALL'
  //     label='Everyone'
  //     disabled={!isAdmin}
  //   />
  // )
  // if (userLeadTeams.length > 0 || (isAdmin && teams.length > 0))
  //   scopeSelectOptions.push(
  //     <Select.Option key='specteams' value='TEAM' label='Specific teams' />
  //   )

  const teamSelectOptions = teams.map(team => (
    <Select.Option
      key={team._id}
      value={team._id}
      label={team.teamName}
      disabled={
        selectedTeams.find(({ _id: teamId }) => teamId === team._id)?.assigned
      }
    />
  ))

  const setAutoassignTeam = (teamId, value) => {
    setSelectedTeams(
      selectedTeams.map(({ autoassign, ...team }) => ({
        ...team,
        autoassign: team._id === teamId ? value : autoassign
      }))
    )
  }

  const removeTeam = teamId => {
    setSelectedTeams(selectedTeams.filter(({ _id }) => teamId !== _id))
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
    setSuggested('')
  }

  const removeUser = _id => {
    setSelectedUsers(selectedUsers.filter(user => user._id !== _id))
  }

  const handleUpdateTeamSelect = value => {
    const currentAssigned = selectedTeams.filter(({ assigned }) => assigned)
    const newTeams = teams
      .filter(
        ({ _id: teamId }) =>
          !currentAssigned.some(team => team._id === teamId) &&
          value.some(id => id === teamId)
      )
      .map(team => ({
        ...team,
        autoassign: selectedTeams.find(({ _id: teamId }) => team._id === teamId)
          ?.autoassign
      }))
    setSelectedTeams([...currentAssigned, ...newTeams])
  }

  return (
    <BodyPortal>
      <Dialog
        visible={!!isAssigningPath}
        onCancel={() => {
          // setCurrentAssignee(null)
          setAssigningPath(null)
        }}
        title='Assign learning path'
      >
        <Dialog.Body>
          <p className='share-content__title'>
            To whom do you want to assign this path?
          </p>
          <div className='select-autosuggest-in-modal'>
            <Select
              value={scope}
              onChange={value => {
                if (everyone) return
                if (value === 'MYTEAM') {
                  setSelectedTeams(teams)
                }
                setScope(value)
              }}
              placeholder='Select from one of the options'
              disabled={everyone}
            >
              {scopeSelectOptions}
            </Select>
          </div>
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
                setAutoassignTeam={setAutoassignTeam}
                removeTeam={removeTeam}
              />
            </>
          )}
          {scope === 'USER' && (
            <>
              <div className='select-autosuggest-in-modal'>
                <Autosuggest
                  suggestions={suggestions}
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
                    value: suggested,
                    placeholder: 'Start typing to find employees',
                    onChange: onChangeSuggestion
                  }}
                />
              </div>
              <UserTable
                selectedUsers={selectedUsers}
                removeUser={removeUser}
                onClickLink={() => setAssigningPath(null)}
              />
            </>
          )}
        </Dialog.Body>
        <Dialog.Footer style={{ textAlign: 'left' }}>
          <Button
            type='primary'
            loading={loading}
            disabled={
              everyone || selectedUsers.length + selectedTeams.length === 0
            }
            onClick={() =>
              assignLearningPath({
                pathId: isAssigningPath._id,
                selectedUsers,
                selectedTeams
              })
            }
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

export default ({ currentUser }) => {
  let teams = []
  let users = []

  const isAdmin = currentUser.roles.indexOf('ADMIN') !== -1
  const { isAssigningPath } = Container.useContainer()
  if (isAdmin) {
    const [email, setEmail] = useState('')
    const handleEmailChange = value => {
      setEmail(value)
    }

    const {
      data: currentUserOrganizationData,
      loading: currentUserOrganizationLoading,
      error: currentUserOrganizationError
    } = useQuery(fetchCurrentUserOrganizationWithoutImages)

    const [assignedToUsers, setAssignedToUsers] = useState(
      isAssigningPath?.assignee?.users ? isAssigningPath?.assignee?.users : []
    )

    useEffect(() => {
      setAssignedToUsers(
        isAssigningPath?.assignee?.users ? isAssigningPath?.assignee?.users : []
      )
    }, [isAssigningPath])
    const addUserToAssignedList = user => {
      setAssignedToUsers([...assignedToUsers, user])
    }
    const removeUserFromAssignedList = user => {
      setAssignedToUsers(
        assignedToUsers.filter(value => {
          return user._id !== value._id
        })
      )
    }

    const {
      data: filteredEmployees,
      loading: filteredEmployeesLoading,
      error: filteredEmployeesError
    } = useQuery(fetchFilteredEmployees, {
      variables: {
        email,
        alreadyAssigned: isAssigningPath
          ? assignedToUsers.map(assignee => {
              return assignee._id
            })
          : []
      },
      fetchPolicy: 'network-only'
    })

    if (!isAssigningPath) return null

    if (currentUserOrganizationError || filteredEmployeesError) {
      captureFilteredError(
        currentUserOrganizationError || filteredEmployeesError
      )
      return null
    }

    if (!currentUserOrganizationLoading || !filteredEmployeesLoading) {
      const organizationData =
        currentUserOrganizationData.fetchCurrentUserOrganization
      teams = organizationData.teams
      users = filteredEmployees?.fetchFilteredEmployees?.filter(
        employee => employee._id !== currentUser._id
      )
      return (
        <AssignPathAdmin
          handleEmailChange={handleEmailChange}
          email={email}
          users={filteredEmployeesLoading ? [] : users}
          teams={teams}
          loading={filteredEmployeesLoading ? true : false}
          addUserToAssignedList={addUserToAssignedList}
          removeUserFromAssignedList={removeUserFromAssignedList}
        />
      )
    }
  } else {
    const { data, loading, error } = useQuery(fetchCurrentUserOrganizationTeams)
    if (!isAssigningPath) return null

    if (error) {
      captureFilteredError(error)
      return null
    }

    if (!loading) {
      const organizationData = {
        teams: data.fetchCurrentUserOrganization.teams,
        employees: []
      }
      teams = organizationData.teams.filter(
        team => team.leader._id === currentUser._id
      )

      users = teams.reduce((acc, team) => {
        const { members, leader } = team
        const array = []
        if (!acc.some(memberInArray => memberInArray._id === leader._id)) {
          array.push(leader)
        }
        members.forEach(member => {
          if (!acc.some(memberInArray => memberInArray._id === member._id)) {
            array.push(member)
          }
        })
        return [...acc, ...array]
      }, [])

      return <AssignPathLeader users={users} teams={teams} />
    } else {
      return <LoadingSpinner />
    }
  }

  if (!isAssigningPath) return null
}

// OLD COMPONENTS

// const DateSelect = ({ value, onChange }) => {
//   // const dayOfWeek = new Date().getDay()
//   // const multiplier = dayOfWeek === 0 ? 1 : 8 - dayOfWeek

//   return (
//     <Select
//       value={value}
//       onChange={onChange}
//       style={{ display: 'inline-block', marginLeft: '12px' }}
//       placeholder='Pick a time'
//     >
//       <Select.Option value={null} label='No deadline' />
//       {/* <Select.Option
//         value={new Date(Date.now() + multiplier * 8.64e7)}
//         label="By next week"
//       /> */}
//       <Select.Option value={new Date(Date.now() + 6.048e8)} label='In 1 week' />
//       <Select.Option
//         value={new Date(Date.now() + 2 * 6.048e8)}
//         label='In 2 weeks'
//       />
//       <Select.Option
//         value={new Date(Date.now() + 3 * 6.048e8)}
//         label='In 3 weeks'
//       />
//       <Select.Option
//         value={new Date(Date.now() + 2.628e9)}
//         label='In 1 month'
//       />
//       <Select.Option
//         value={new Date(Date.now() + 2 * 2.628e9)}
//         label='In 2 months'
//       />
//       <Select.Option
//         value={new Date(Date.now() + 3 * 2.628e9)}
//         label='In 3 months'
//       />
//     </Select>
//   )
// }

// class AssignForm extends Component {
//   constructor(props) {
//     super(props)

//     const { teams, currentUser, initialAssignee } = props
//     const userLeadTeams = teams.filter(
//       team => team.leader._id === currentUser._id
//     )

//     let scope = ''
//     let selectedTeams = []
//     let selectedUsers = []

//     if (initialAssignee) {
//       if (initialAssignee.everyone) {
//         scope = 'ALL'
//       } else if (initialAssignee.teams.length > 0) {
//         scope = 'TEAM'
//         selectedTeams = initialAssignee.teams
//           .filter(({ team }) => !!team)
//           .map(({ team, autoassign }) => ({
//             teamId: team._id,
//             autoassign
//           }))
//       } else {
//         scope = 'USER'
//         selectedUsers = initialAssignee.users
//       }
//     }

//     this.state = {
//       userLeadTeams,
//       scope,
//       selectedTeams,
//       selectedUsers,
//       usersInTeamScope: 'ALL',
//       selectedUsersInTeam: [],
//       suggestions: [],
//       suggested: '',
//       addReview: true,
//       deadline: null
//     }
//   }

//   clearSelections = () => {
//     this.setState({
//       selectedTeams: [],
//       selectedUsers: [],
//       usersInTeamScope: 'ALL',
//       selectedUsersInTeam: [],
//       suggestions: [],
//       suggested: ''
//     })
//   }

//   setScope = value => {
//     this.setState({ scope: value }, () => {
//       this.clearSelections()
//       const { userLeadTeams } = this.state
//       const {
//         setSelectedUsers,
//         setSelectedTeams,
//         setEveryone,
//         users
//       } = this.props
//       if (value === 'ALL') {
//         setEveryone(true)
//         setSelectedUsers([])
//         setSelectedTeams([])
//         this.setState({ selectedTeams: [] })
//       } else if (value === 'MYTEAM') {
//         setEveryone(false)
//         setSelectedUsers([])
//         setSelectedTeams(
//           userLeadTeams.map(({ _id }) => ({ teamId: _id, autoassign: false }))
//         )
//       } else {
//         setEveryone(false)
//         setSelectedUsers([])
//         setSelectedTeams([])
//       }
//     })
//   }

//   setSelectedTeams = value => {
//     const newSelectedTeams = value.map(teamId => ({
//       teamId,
//       autoassign:
//         this.state.selectedTeams.find(
//           ({ teamId: selectedId }) => selectedId === teamId
//         )?.autoassign || false
//     }))
//     this.setState({ selectedTeams: newSelectedTeams }, () => {
//       const { teams, setSelectedTeams } = this.props
//       setSelectedTeams(newSelectedTeams)
//     })
//   }

//   setAutoassign = (teamId, value) => {
//     const newSelectedTeams = this.state.selectedTeams.map(
//       ({ teamId: selectedId, autoassign }) => ({
//         teamId: selectedId,
//         autoassign: selectedId === teamId ? value : autoassign
//       })
//     )
//     this.setState({ selectedTeams: newSelectedTeams }, () => {
//       const { teams, setSelectedTeams } = this.props
//       setSelectedTeams(newSelectedTeams)
//     })
//   }

//   // AUTOSUGGEST METHODS

//   onSuggestionsFetchRequested = ({ value }) => {
//     const filteredResults = this.props.users
//       .filter(
//         user =>
//           !this.state.selectedUsers.some(selected => selected._id === user._id)
//       )
//       .filter(this.filterResults(value))
//     this.setState({
//       suggestions: filteredResults
//     })
//   }

//   onSuggestionsClearRequested = () => {
//     this.setState({
//       suggestions: []
//     })
//   }

//   filterResults = queryString => {
//     return ({ firstName, lastName, email }) => {
//       if (firstName && lastName) {
//         let points = 0
//         const individualStrings = queryString.split(' ')
//         individualStrings.forEach(s => {
//           if (email.indexOf(s.toLowerCase()) === 0) points++
//           if (firstName.toLowerCase().indexOf(s.toLowerCase()) === 0) points++
//           if (lastName.toLowerCase().indexOf(s.toLowerCase()) === 0) points++
//         })
//         return points > 0
//       } else return email.indexOf(queryString.toLowerCase()) === 0
//     }
//   }

//   onChangeSuggestion = (event, { newValue }) => {
//     this.setState({
//       suggested: newValue
//     })
//   }

//   onSuggestionSelected = (event, { suggestion }) => {
//     this.setState(
//       ({ selectedUsers }) => ({
//         selectedUsers: [...selectedUsers, suggestion],
//         suggested: ''
//       }),
//       () => {
//         const { selectedUsers } = this.state

//         const { setSelectedUsers } = this.props
//         setSelectedUsers(selectedUsers.map(({ _id }) => _id))
//       }
//     )
//   }

//   removeUser = _id => {
//     this.setState(
//       ({ selectedUsers }) => ({
//         selectedUsers: selectedUsers.filter(user => user._id !== _id)
//       }),
//       () => {
//         const { selectedUsers } = this.state

//         const { setSelectedUsers } = this.props
//         setSelectedUsers(selectedUsers.map(({ _id }) => _id))
//       }
//     )
//   }

//   removeTeam = _id => {
//     this.setState(
//       ({ selectedTeams }) => ({
//         selectedTeams: selectedTeams.filter(({ teamId }) => teamId !== _id)
//       }),
//       () => {
//         const { selectedTeams } = this.state

//         const { setSelectedTeams } = this.props
//         setSelectedTeams(selectedTeams)
//       }
//     )
//   }

//   // componentDidMount() {
//   //   if (this.props.teams.length < 1) {
//   //     this.setState(prevState => ({ ...prevState, scope: 'USER' }))
//   //   }
//   // }

//   render() {
//     const {
//       scope,
//       userLeadTeams,
//       selectedTeams,
//       selectedUsers,
//       selectedUsersInTeam,
//       suggestions,
//       suggested,
//       usersInTeamScope
//       // deadline,
//       // addReview
//     } = this.state

//     const { currentUser, teams } = this.props
//     const isAdmin = currentUser.roles.indexOf('ADMIN') !== -1

//     const scopeSelectOptions = [
//       <Select.Option value='USER' label='Specific users' key='specusers' />
//     ]

//     const displayTeams = teams.filter(team =>
//       selectedTeams.some(selected => team._id === selected.teamId)
//     )

//     scopeSelectOptions.unshift(
//       <Select.Option
//         key='allusers'
//         value='ALL'
//         label='Everyone'
//         disabled={!isAdmin}
//       />
//     )
//     if (userLeadTeams.length > 0 || (isAdmin && teams.length > 0))
//       scopeSelectOptions.push(
//         <Select.Option key='specteams' value='TEAM' label='Specific teams' />
//       )

//     const teamSelectOptions = teams.map(team => (
//       <Select.Option key={team._id} value={team._id} label={team.teamName} />
//     ))

//     const userSelectOptions = userLeadTeams
//       .reduce((acc, team) => {
//         const { members, leader } = team
//         const array = []
//         if (!acc.some(user => user._id === leader._id)) {
//           array.push(leader)
//         }
//         members.forEach(member => {
//           if (!acc.some(user => user._id === member._id)) {
//             array.push(member)
//           }
//         })
//         return [...acc, ...array]
//       }, [])
//       .map(user => (
//         <Select.Option
//           key={user._id}
//           value={user._id}
//           label={
//             user.firstName && user.lastName
//               ? `${user.firstName} ${user.lastName} (${user.email})`
//               : user.email
//           }
//         />
//       ))

//     return (
//       <>
//         <p className='share-content__title'>
//           To whom do you want to assign this path?
//         </p>
//         <div className='select-autosuggest-in-modal'>
//           <Select
//             value={scope}
//             onChange={this.setScope}
//             placeholder='Select from one of the options'
//             disabled={!isAdmin && scope === 'ALL'}
//           >
//             {scopeSelectOptions}
//           </Select>
//         </div>
//         {/* {scope === 'MYTEAM' && (
//           <>
//             <p className='share-content__subtitle'>
//               You will also start the learning path if you select "Everyone in
//               team"
//             </p>
//             <Radio.Group
//               value={usersInTeamScope}
//               onChange={this.onChangeUsersInTeamScope}
//             >
//               <Radio value='ALL'>Everyone in team</Radio>
//               <Radio value='SPECIFIC'>Specific users</Radio>
//             </Radio.Group>
//           </>
//         )} */}
//         {/* {scope === 'MYTEAM' && usersInTeamScope === 'SPECIFIC' && (
//           <div className='select-autosuggest-in-modal'>
//             <Select
//               value={selectedUsersInTeam}
//               onChange={this.setSelectedUsersInTeam}
//               placeholder='Select users'
//               multiple
//             >
//               {userSelectOptions}
//             </Select>
//           </div>
//         )} */}

//         {/* <div className='align-left' style={{ margin: '15px 0' }}>
//           <span
//             className='select-autosuggest-in-modal'
//             style={{
//               fontSize: '13px',
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'baseline'
//             }}
//           >
//             Deadline for finishing path:
//             <DateSelect
//               value={deadline}
//               onChange={value => {
//                 this.props.setDeadline(value)
//                 this.setState({ deadline: value })
//               }}
//             />
//           </span>
//           {deadline && (
//             <div style={{ paddingTop: '15px' }}>
//               <Checkbox
//                 className='full-label'
//                 checked={addReview}
//                 onChange={value => {
//                   this.props.setReview(value)
//                   this.setState({ addReview: value })
//                 }}
//               >
//                 I would like to review the employees' progress on their goals on
//                 the day of the deadline
//               </Checkbox>
//             </div>
//           )}
//         </div> */}
//         <style>{tableStyle}</style>
//       </>
//     )
//   }
// }
