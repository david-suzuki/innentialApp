import React, { Component } from 'react'
import { ManageUsers, TeamItems, List, Statement } from '../ui-components'
import { remapEmployeesForUI, remapTeamsForUI } from './_teamUtils'
import { ApolloConsumer, Query } from 'react-apollo'
import {
  deleteUserFromOrganization,
  deleteTeam,
  archiveTeam,
  fetchArchivedTeams,
  fetchStatsOverviewData,
  fetchOnboardedTeamsInOrganization,
  promoteUser,
  fetchUsersProfile,
  fetchCurrentUserOrganizationTeams,
  fetchCurrentUserEmployees,
  fetchSmallerCurrentUserOrganization
} from '../../api'
import { useQuery } from 'react-apollo'
import { Notification, Button, MessageBox } from 'element-react'
import '../../styles/theme/notification.css'
import '../../styles/theme/message.css'
import {
  captureFilteredError,
  LoadingSpinner,
  SentryDispatch
} from '../general'
import history from '../../history'
// TODO: Wrap this in a stage results query
class ManageTeams extends Component {
  // constructor(props) {
  //   super(props)
  // }

  //   const { organizationData } = this.props
  //   this.uiTeams = remapTeamsForUI(organizationData.teams, true)
  //   this.uiEmployees = remapEmployeesForUI(organizationData.employees)
  //   this.leaders = organizationData.teams.map(t => t.leader._id)

  //   this.state = {
  //     isOnTeamsTab: true,
  //     teamArchived: false,
  //     viewingArchivedTeams: false
  //   }
  // }

  state = {
    isOnTeamsTab: this.props.activeIndex === 0,
    teamArchived: false,
    viewingArchivedTeams: false
  }

  // componentWillReceiveProps(nextProps) {
  //   const {
  //     organizationData: { teams: newTeams, employees: newEmployees }
  //   } = nextProps
  //   const {
  //     organizationData: { teams, employees }
  //   } = this.props
  //   let update = false
  //   if (teams.length !== newTeams.length) {
  //     this.uiTeams = remapEmployeesForUI(newTeams, true)
  //     update = true
  //   }
  //   if (employees.length !== newEmployees.length) {
  //     this.uiEmployees = remapEmployeesForUI(newEmployees)
  //     update = true
  //   }
  //   if (update) this.forceUpdate()
  // }

  componentDidMount() {
    const mainWrapper = document.getElementById('main-wrapper')
    if (mainWrapper.classList.contains('wrapper--right')) {
      mainWrapper.className = 'container-main__wrapper'
    }
  }

  toggleArchivedTeams = e => {
    e.preventDefault()
    const { viewingArchivedTeams } = this.state
    this.setState({ viewingArchivedTeams: !viewingArchivedTeams })
  }

  evaluateUser = (id, name) => {
    history.push('/evaluate-employee', {
      userId: id,
      fullName: name,
      redirect: `/organization/users`
    })
  }

  promoteAdmin = async id => {
    const user = this.props.organizationData.employees.find(
      employee => employee._id === id
    )
    if (user) {
      MessageBox.confirm(
        `Are you sure you want to give administrator priviledges to ${
          user.firstName ? user.firstName : 'this person'
        }?`,
        `Warning`,
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      )
        .then(async () => {
          await this.props.client
            .mutate({
              mutation: promoteUser,
              variables: {
                userId: id
              },
              update: async (cache, { data: { promoteUser: result } }) => {
                try {
                  const { fetchUsersProfile: profile } = await cache.readQuery({
                    query: fetchUsersProfile,
                    variables: { userId: result._id }
                  })
                  if (profile) {
                    await cache.writeQuery({
                      query: fetchUsersProfile,
                      data: {
                        fetchUsersProfile: {
                          ...profile,
                          roles: ['USER', 'ADMIN']
                        }
                      }
                    })
                  }
                } catch (e) {}
              }
              // refetchQueries: ['fetchCurrentUserOrganization']
            })
            .then(res => {
              if (res.data && res.data.promoteUser !== null) {
                Notification({
                  type: 'success',
                  message: `${user.firstName} is now an administrator`,
                  duration: 2500,
                  offset: 90
                })
              } else {
                Notification({
                  type: 'warning',
                  message: 'Something went wrong',
                  duration: 2500,
                  offset: 90
                })
              }
            })
            .catch(e => captureFilteredError(e))
        })
        .catch(() => {
          Notification({
            type: 'warning',
            message: 'Operation cancelled',
            duration: 2500,
            offset: 90
          })
        })
    } else {
      console.log('Not found')
    }
  }

  deleteUserFromOrganization = async id => {
    const usersLeadTeam = this.props.organizationData.teams.find(
      t => t.leader._id === id
    )
    if (usersLeadTeam) {
      MessageBox.confirm(
        `User is the leader of ${usersLeadTeam.teamName}, and deleting the user will delete the team. In order to keep the team, please change the team leader in the members section of the team.`,
        'Warning',
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      )
        .then(async () => {
          await this.props.client
            .mutate({
              mutation: deleteUserFromOrganization,
              variables: {
                userId: id,
                organizationId: this.props.organizationData._id
              },
              update: cache => {
                try {
                  Object.keys(cache.data.data).forEach(key => {
                    return (
                      (key.match(/^Team/) && cache.data.delete(key)) ||
                      (key.match(/^TeamMembers/) && cache.data.delete(key)) ||
                      (key.match(/^Member/) && cache.data.delete(key))
                    )
                  })
                } catch (e) {}
                try {
                  const { fetchStatsOverviewData: overview } = cache.readQuery({
                    query: fetchStatsOverviewData
                  })
                  cache.writeQuery({
                    query: fetchStatsOverviewData,
                    data: {
                      fetchStatsOverviewData: {
                        ...overview,
                        employees: overview.employees - 1,
                        teams: overview.teams - 1
                      }
                    }
                  })
                } catch (e) {}

                try {
                  const {
                    fetchOnboardedTeamsInOrganization: onboardedTeams
                  } = cache.readQuery({
                    query: fetchOnboardedTeamsInOrganization
                  })
                  cache.writeQuery({
                    query: fetchOnboardedTeamsInOrganization,
                    data: {
                      fetchOnboardedTeamsInOrganization: onboardedTeams.filter(
                        team => team._id !== usersLeadTeam._id
                      )
                    }
                  })
                } catch (e) {}
              },
              refetchQueries: [
                {
                  query: fetchCurrentUserEmployees,
                  variables: {
                    employeesLimit: 20,
                    employeesSkip: (this.props.employeesPage - 1) * 20,
                    nameFilter: this.props.appliedFilters.searchString,
                    selectedSkillsFilter: this.props.appliedFilters.skillSearch
                  }
                },
                'fetchTeam',
                'fetchOpenAssessmentsForUser',
                'fetchStatsOverviewData',
                'fetchStatsTeamsData',
                'fetchStatsGrowthData',
                'fetchOnboardedTeamsInOrganization'
              ]
            })
            .then(res => {
              if (
                res.data &&
                res.data.deleteUserFromOrganization === 'success'
              ) {
                Notification({
                  type: 'success',
                  message: 'User successfully removed',
                  duration: 2500,
                  offset: 90
                })
              } else {
                Notification({
                  type: 'warning',
                  message: 'Something went wrong',
                  duration: 2500,
                  offset: 90
                })
              }
            })
            .catch(e => captureFilteredError(e))
        })
        .catch(() => {
          Notification({
            type: 'warning',
            message: 'Operation cancelled',
            duration: 2500,
            offset: 90
          })
        })
    } else {
      MessageBox.confirm(
        `Are you sure you want to remove this person from the organization?`,
        'Warning',
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      )
        .then(async () => {
          await this.props.client
            .mutate({
              mutation: deleteUserFromOrganization,
              variables: {
                userId: id,
                organizationId: this.props.organizationData._id
              },
              update: cache => {
                try {
                  Object.keys(cache.data.data).forEach(key => {
                    return (
                      (key.match(/^Team/) && cache.data.delete(key)) ||
                      (key.match(/^Member/) && cache.data.delete(key))
                    )
                  })
                } catch (e) {}
                try {
                  const { fetchStatsOverviewData: overview } = cache.readQuery({
                    query: fetchStatsOverviewData
                  })
                  cache.writeQuery({
                    query: fetchStatsOverviewData,
                    data: {
                      fetchStatsOverviewData: {
                        ...overview,
                        employees: overview.employees - 1
                      }
                    }
                  })
                } catch (e) {}
              },
              refetchQueries: [
                {
                  query: fetchCurrentUserEmployees,
                  variables: {
                    employeesLimit: 20,
                    employeesSkip: (this.props.employeesPage - 1) * 20,
                    nameFilter: this.props.appliedFilters.searchString,
                    selectedSkillsFilter: this.props.appliedFilters.skillSearch
                  }
                },
                'fetchTeam',
                'fetchOpenAssessmentsForUser',
                'fetchRelevantContentForUser',
                'fetchStatsOverviewData',
                'fetchStatsTeamsData',
                'fetchStatsGrowthData',
                'fetchOnboardedTeamsInOrganization'
              ]
            })
            .then(res => {
              if (
                res.data &&
                res.data.deleteUserFromOrganization === 'success'
              ) {
                Notification({
                  type: 'success',
                  message: 'User successfully removed',
                  duration: 2500,
                  offset: 90
                })
              } else {
                Notification({
                  type: 'warning',
                  message: 'Something went wrong',
                  duration: 2500,
                  offset: 90
                })
              }
            })
            .catch(e => captureFilteredError(e))
        })
        .catch(() => {
          Notification({
            type: 'warning',
            message: 'Operation cancelled',
            duration: 2500,
            offset: 90
          })
        })
    }
  }

  deleteTeam = async teamId => {
    await this.props.client
      .mutate({
        mutation: deleteTeam,
        variables: {
          teamId
        },
        update: cache => {
          try {
            let readQuery = cache.readQuery({
              query: fetchSmallerCurrentUserOrganization
            })
            readQuery = {
              fetchCurrentUserOrganization: {
                ...readQuery.fetchCurrentUserOrganization,
                teams: readQuery.fetchCurrentUserOrganization.teams.filter(
                  team => {
                    return team._id !== teamId
                  }
                )
              }
            }
            cache.writeQuery({
              query: fetchSmallerCurrentUserOrganization,
              data: readQuery
            })
          } catch (e) {
            console.log(e)
          }

          try {
            const {
              fetchOnboardedTeamsInOrganization: onboardedTeams
            } = cache.readQuery({
              query: fetchOnboardedTeamsInOrganization
            })
            cache.writeQuery({
              query: fetchOnboardedTeamsInOrganization,
              data: {
                fetchOnboardedTeamsInOrganization: onboardedTeams.filter(
                  team => team._id !== teamId
                )
              }
            })
          } catch (e) {}
        },
        refetchQueries: [
          'fetchSharedByMeContent',
          'fetchSharedInTeamContent',
          'fetchRelevantContentForUser',
          'fetchStatsOverviewData',
          'fetchStatsTeamsData',
          'fetchStatsGrowthData'
        ]
      })
      .then(res => {
        if (res.data && res.data.deleteTeam === 'success') {
          Notification({
            type: 'success',
            message: 'Team successfully deleted',
            duration: 2500,
            offset: 90
          })
        } else {
          Notification({
            type: 'warning',
            message: 'Something went wrong',
            duration: 2500,
            offset: 90
          })
        }
      })
      .catch(e => captureFilteredError(e))
  }

  archiveTeam = async teamId => {
    await this.props.client
      .mutate({
        mutation: archiveTeam,
        variables: {
          teamId
        },
        update: cache => {
          try {
            const { fetchStatsOverviewData: overview } = cache.readQuery({
              query: fetchStatsOverviewData
            })
            cache.writeQuery({
              query: fetchStatsOverviewData,
              data: {
                fetchStatsOverviewData: {
                  ...overview,
                  teams: overview.teams - 1
                }
              }
            })
          } catch (e) {}

          try {
            const {
              fetchOnboardedTeamsInOrganization: onboardedTeams
            } = cache.readQuery({
              query: fetchOnboardedTeamsInOrganization
            })
            cache.writeQuery({
              query: fetchOnboardedTeamsInOrganization,
              data: {
                fetchOnboardedTeamsInOrganization: onboardedTeams.filter(
                  team => team._id !== teamId
                )
              }
            })
          } catch (e) {}
        },
        refetchQueries: [
          'fetchArchivedTeams',
          'fetchRelevantContentForUser',
          'fetchStatsOverviewData',
          'fetchStatsTeamsData',
          'fetchStatsGrowthData'
        ]
      })
      .then(async res => {
        if (res.data && res.data.archiveTeam) {
          const archivedTeam = res.data.archiveTeam
          try {
            const data = await this.props.client.readQuery({
              query: fetchArchivedTeams
            })
            const allArchivedteams = data && data.fetchArchivedTeams
            Object.assign(archivedTeam.stageResultInfo, {
              ...archivedTeam.stageResultInfo,
              _id: archivedTeam._id
            })
            allArchivedteams.push(archivedTeam)
            await this.props.client.writeQuery({
              query: fetchArchivedTeams,
              data: {
                fetchArchivedTeams: allArchivedteams
              }
            })
          } catch (e) {
            captureFilteredError(e)
          }
          const { teamArchived } = this.state
          this.setState({ teamArchived: !teamArchived })
          Notification({
            type: 'success',
            message: `Team ${archivedTeam.teamName} has been archived`,
            duration: 2500,
            offset: 90
          })
        } else {
          Notification({
            type: 'warning',
            message: 'Something went wrong',
            duration: 2500,
            offset: 90
          })
        }
      })
      .catch(e => captureFilteredError(e))
  }

  renameTeam = (teamId, oldName) => {
    history.push(`/rename-team`, { teamId, oldName })
  }

  onTabChange = tab => {
    history.push(`/teams?tab=${tab}`)
    this.setState({ isOnTeamsTab: tab === 'teams' })
  }

  render() {
    const { viewingArchivedTeams, isOnTeamsTab } = this.state
    const {
      organizationData: {
        teams,
        employees,
        locations /*, hasCustomFrameworks */
      },
      user
    } = this.props

    const uiTeams = remapTeamsForUI(teams, true)

    const userDropdownOptions = [
      {
        value: 'Remove from organization',
        boundFunction: this.deleteUserFromOrganization
      },
      user.premium && {
        value: 'Give feedback',
        boundFunction: this.evaluateUser
      },
      {
        value: 'Make administrator',
        boundFunction: this.promoteAdmin
      }
    ].filter(option => !!option)

    const adminDropdownOptions = [
      user.premium &&
        user.corporate && {
          value: 'Give feedback',
          boundFunction: this.evaluateUser
        }
    ].filter(option => !!option)

    const uiEmployees = remapEmployeesForUI(
      employees.map(employee => ({
        ...employee,
        userDropdownOptions:
          employee._id !== this.props.user._id
            ? employee.roles.indexOf('ADMIN') !== -1
              ? adminDropdownOptions
              : userDropdownOptions
            : []
      }))
    )
    const leaders = teams.map(t => t.leader._id)

    const teamDropdownOptions = [
      {
        value: 'Rename',
        boundFunction: this.renameTeam
      },
      {
        value: 'Delete team',
        boundFunction: this.deleteTeam
      },
      {
        value: 'Archive team',
        boundFunction: this.archiveTeam
      }
    ]

    return (
      <div>
        <Query query={fetchArchivedTeams}>
          {({ data, loading }) => {
            if (loading) return <LoadingSpinner />
            if (viewingArchivedTeams) {
              if (
                data &&
                data.fetchArchivedTeams &&
                data.fetchArchivedTeams.length > 0
              ) {
                const uiArchivedTeams = remapTeamsForUI(data.fetchArchivedTeams)
                return (
                  <div>
                    <List>
                      <TeamItems items={uiArchivedTeams} />
                    </List>
                    <Button
                      onClick={e => this.toggleArchivedTeams(e)}
                      className='el-button--green'
                      style={{ marginTop: '150px' }}
                    >
                      Go Back
                    </Button>
                  </div>
                )
              } else
                return (
                  <div>
                    <Statement content='No teams to display' />
                    <Button
                      onClick={e => this.toggleArchivedTeams(e)}
                      className='el-button--green'
                      style={{ marginTop: '50px' }}
                    >
                      Go Back
                    </Button>
                  </div>
                )
            } else
              return (
                <div>
                  <ManageUsers
                    user={user}
                    users={uiEmployees}
                    teams={uiTeams}
                    teamDropdownOptions={teamDropdownOptions}
                    {...this.props}
                    leaders={leaders}
                    locations={locations}
                    organizationData={this.props.organizationData}
                    // hasCustomFrameworks={hasCustomFrameworks}
                    onTabChange={this.onTabChange}
                    activeIndex={this.props.activeIndex}
                  />
                  {isOnTeamsTab && (
                    <Button
                      onClick={e => this.toggleArchivedTeams(e)}
                      className='el-button--green'
                    >
                      View Archived Teams
                    </Button>
                  )}
                </div>
              )
          }}
        </Query>
      </div>
    )
  }
}

export default props => {
  // if (props.queryDecider) {
  const [employeesPage, setEmployeesPage] = React.useState(1)
  const [membersPage, setMembersPage] = React.useState(1)
  const [state, setState] = React.useState({
    searchString: '',
    skillSearch: []
  })
  const resetPagination = () => {
    setEmployeesPage(1)
  }
  const [filter, setFilter] = React.useState({
    searchString: '',
    skillSearch: []
  })

  const handleChange = (key, value) => {
    setState({ ...state, [key]: value })
  }

  const handleSearchStringChange = value => {
    setState({ ...state, searchString: value })
  }
  const handleSkillUpdate = (skillId, level) => {
    setState(({ skillSearch }) => ({
      ...state,
      skillSearch: skillSearch.map(({ _id, ...skill }) => {
        if (_id === skillId) {
          return {
            _id,
            ...skill,
            level
          }
        }
        return {
          _id,
          ...skill
        }
      })
    }))
  }
  const applyFilter = value => {
    setEmployeesPage(1)
    setFilter(value)
  }

  const handleSkillRemove = skillId => {
    setState(({ skillSearch }) => ({
      ...state,
      skillSearch: skillSearch.filter(({ _id }) => _id !== skillId)
    }))
  }

  const handleEmployeesPageChange = page => {
    return setEmployeesPage(page)
  }

  const employeesLimit = 20
  const employeesSkip = (employeesPage - 1) * employeesLimit

  const {
    data: smallerCurrentUserOrganizationData,
    loading: smallerCurrentUserOrganizationLoading,
    error: smallerCurrentUserOrganizationError
  } = useQuery(fetchSmallerCurrentUserOrganization, {})

  const {
    data: currentUserEmployeesData,
    loading: currentUserEmployeesLoading,
    error: currentUserEmployeesError
  } = useQuery(fetchCurrentUserEmployees, {
    variables: {
      employeesLimit,
      employeesSkip,
      nameFilter: filter?.searchString,
      selectedSkillsFilter: filter?.skillSearch
    }
  })

  if (smallerCurrentUserOrganizationError || currentUserEmployeesError) {
    return (
      <SentryDispatch
        error={smallerCurrentUserOrganizationError || currentUserEmployeesError}
      />
    )
  }

  if (!smallerCurrentUserOrganizationLoading && !currentUserEmployeesLoading) {
    let organizationData = {
      ...smallerCurrentUserOrganizationData?.fetchCurrentUserOrganization,
      ...currentUserEmployeesData?.fetchCurrentUserOrganizationEmployees
    }

    organizationData.teams.sort((a, b) => {
      const aDate = new Date(a.createdAt)
      const bDate = new Date(b.createdAt)
      return bDate - aDate
    })

    return (
      <ApolloConsumer>
        {client => (
          <ManageTeams
            {...props}
            appliedFilters={filter}
            handleChange={handleChange}
            resetPagination={resetPagination}
            handleSearchStringChange={handleSearchStringChange}
            applyFilter={applyFilter}
            filter={state}
            handleSkillRemove={handleSkillRemove}
            handleSkillUpdate={handleSkillUpdate}
            employeesPage={employeesPage}
            membersPage={membersPage}
            handleEmployeesPageChange={handleEmployeesPageChange}
            totalEmployees={organizationData.totalEmployees}
            organizationData={organizationData}
            client={client}
          />
        )}
      </ApolloConsumer>
    )
  } else {
    return <LoadingSpinner />
  }
  // } else if (!props.queryDecider) {
  //   const {
  //     data: currentUserTeamsData,
  //     loading: currentUserTeamsLoading,
  //     error: currentUserTeamsError
  //   } = useQuery(fetchCurrentUserOrganizationTeams)

  //   if (currentUserTeamsError) {
  //     return <SentryDispatch error={currentUserTeamsError} />
  //   }

  //   if (!currentUserTeamsLoading) {
  //     const organizationData = {
  //       teams: currentUserTeamsData.fetchCurrentUserOrganization.teams,
  //       employees: []
  //     }

  //     organizationData.teams.sort((a, b) => {
  //       const aDate = new Date(a.createdAt)
  //       const bDate = new Date(b.createdAt)
  //       return bDate - aDate
  //     })
  //     return (
  //       <ApolloConsumer>
  //         {client => (
  //           <ManageTeams
  //             {...props}
  //             organizationData={organizationData}
  //             client={client}
  //           />
  //         )}
  //       </ApolloConsumer>
  //     )
  //   } else {
  //     return <LoadingSpinner />
  //   }
  // }
}
