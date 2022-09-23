import React, { useState } from 'react'
import {
  deleteUserFromOrganization,
  fetchOrganization as OrganizationQuery,
  initializeNeededSkills
} from '../../api'

import {
  OrganizationInviteUserForm,
  OrganizationCreateTeamForm,
  OrganizationTeams,
  OrganizationSkills,
  OrganizationNeededSkills,
  OrganizationContent,
  OrganizationContentStats,
  OrganizationSkillStats,
  OrganizationLearningPathStatistics
} from './'
import {
  Card,
  Button,
  Table,
  Tag,
  Message,
  MessageBox,
  Tabs,
  Icon
} from 'element-react'
import { Query, Mutation } from 'react-apollo'
import { Link, Route } from 'react-router-dom'
import { ROLES } from '../../environment'
import {
  ResetDemoOrganization,
  TogglePaidButton,
  ActivateOrganization,
  TogglePremium,
  ToggleCorporate,
  ToggleFulfillment,
  ToggleTechnicians,
  ToggleEvents
} from './components'
import { CategoriesList } from '../categories'
import { RolesPage } from '../roles'
import { NIL } from 'uuid'
// import OrganizationGoals from './OrganizationGoals'

const ChosenPath = props => {
  return <div>{props.pathName}</div>
}

const listColumns = (leaders, organizationId, allAdmins) => [
  {
    label: 'Employee',
    render: ({ firstName, lastName, email }) => {
      if (firstName) {
        if (lastName) {
          return <p>{firstName + ' ' + lastName + ` (${email})`}</p>
        } else return <p>{firstName + ` (${email})`}</p>
      } else return <p>{email}</p>
    }
  },
  {
    label: 'Acquired from',
    render: ({ registeredFrom }) =>
      registeredFrom ? `Registered: ${registeredFrom}` : 'Direct invite'
  },
  {
    label: 'Chosen path',
    render: user => {
      if (user.inbound.path === null) {
        return ''
      } else {
        return <ChosenPath pathName={user.inbound.path} />
      }
    }
  },
  {
    label: 'Position',
    prop: 'roleAtWork'
  },
  {
    label: 'Status',
    render: ({ status }) => {
      return (
        <Tag
          type={
            status === 'active'
              ? 'success'
              : status === 'disabled'
              ? 'danger'
              : 'primary'
          }
        >
          {status}
        </Tag>
      )
    }
  },
  {
    label: 'Roles',
    render: ({ roles, email }) => {
      return (
        <React.Fragment>
          {roles.map(role => (
            <Tag
              style={{ marginLeft: 10 }}
              type={
                role.includes(ROLES.INNENTIAL_ADMIN)
                  ? 'danger'
                  : role.includes(ROLES.ADMIN)
                  ? 'success'
                  : 'primary'
              }
              key={role}
            >
              {role.includes(ROLES.INNENTIAL_ADMIN)
                ? 'Innential Admin'
                : role.includes(ROLES.ADMIN)
                ? 'Admin'
                : 'User'}
            </Tag>
          ))}
          {leaders.includes(email) ? (
            <Tag style={{ marginLeft: 10 }} type='warning'>
              Leader
            </Tag>
          ) : (
            <p />
          )}
        </React.Fragment>
      )
    }
  },
  {
    label: 'Operations',
    render: ({ _id: userId, email, roles }) => {
      const isAdmin = roles.indexOf('ADMIN') !== -1
      const isOnlyAdmin = allAdmins.length === 1 && isAdmin
      const isLeader = leaders.includes(email)
      return (
        <div>
          <Mutation
            mutation={deleteUserFromOrganization}
            update={(cache, { data: { deleteUserFromOrganization } }) => {
              const { fetchOrganization } = cache.readQuery({
                query: OrganizationQuery,
                variables: { organizationId }
              })
              const newEmployees =
                fetchOrganization &&
                fetchOrganization.employees.filter(
                  employee => employee.email !== deleteUserFromOrganization
                )
              cache.writeQuery({
                query: OrganizationQuery,
                variables: { organizationId },
                data: {
                  fetchOrganization: {
                    ...fetchOrganization,
                    employees: [...newEmployees]
                  }
                }
              })
            }}
            refetchQueries={['fetchOrganization', 'fetchAllUsers']}
          >
            {deleteUserFromOrganization => (
              <Button
                style={{ marginLeft: 10 }}
                type='danger'
                size='small'
                onClick={async () =>
                  handleRemovingUser(
                    userId,
                    isLeader,
                    organizationId,
                    deleteUserFromOrganization,
                    isOnlyAdmin
                  )
                }
              >
                Delete
              </Button>
            )}
          </Mutation>
          <Link to={`/users/${userId}`}>
            <Button type='success' size='small'>
              <Icon name='arrow-right' />
            </Button>
          </Link>
        </div>
      )
    }
  }
]

const handleRemovingUser = (
  userId,
  isLeader,
  organizationId,
  deleteUserFromOrganization,
  isOnlyAdmin
) => {
  if (isOnlyAdmin) {
    MessageBox.confirm(
      "User is the only admin, either reset the demo organization and delete the organization, or just delete the organization if demo users don't exist",
      'Warning',
      {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )
      .then(() => {})
      .catch(e => {})
  } else {
    MessageBox.confirm(
      isLeader ? (
        <React.Fragment>
          This employee is the leader of a team.
          <br />
          Deleting him will archive the team. You can change the team's leader
          from the team menu.
        </React.Fragment>
      ) : (
        'Do you want to delete user from organization?'
      ),
      'Warning',
      {
        confirmButtonText: isLeader ? 'Delete and archive' : 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )
      .then(async () => {
        try {
          await deleteUserFromOrganization({
            variables: {
              userId,
              organizationId
            }
          })
          Message({
            type: 'success',
            message: 'User successfully deleted from the organization'
          })
        } catch (e) {
          Message({
            type: 'error',
            message: `${e.graphQLErrors[0].message}`
          })
        }
      })
      .catch(() => {
        Message({
          type: 'info',
          message: 'Delete cancelled'
        })
      })
  }
}

const OrganizationDetails = ({
  locations = [],
  size,
  industry,
  _id: organizationId,
  isPayingOrganization,
  premium,
  corporate,
  fulfillment,
  technicians,
  events
}) => {
  return (
    <React.Fragment>
      <br />
      <span>Size: {size}</span>
      <br />
      <span>Locations: {locations.join(', ')}</span>
      <br />
      <span>Industry: {industry}</span>
      <br />
      <TogglePaidButton
        organizationId={organizationId}
        isPayingOrganization={isPayingOrganization}
      />
      <TogglePremium organizationId={organizationId} premium={premium} />
      <ToggleCorporate organizationId={organizationId} corporate={corporate} />
      <ToggleFulfillment
        organizationId={organizationId}
        fulfillment={fulfillment}
      />
      <ToggleTechnicians
        organizationId={organizationId}
        technicians={technicians}
      />
      <ToggleEvents organizationId={organizationId} events={events} />
    </React.Fragment>
  )
}

// const tabs = []

const OrganizationPage = ({ match }) => {
  const [activeTab, setActiveTab] = useState('1')
  const [selectedTab, setSelectedTab] = useState('Employees')
  const organizationId = match && match.params && match.params.organizationId
  const enableCustomNeededSkills = (initializeNeededSkills, organizationId) => {
    initializeNeededSkills({ variables: { organizationId } })
    setActiveTab('4')
  }

  return (
    <Query query={OrganizationQuery} variables={{ organizationId }}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...'
        if (error) return `Error! ${error.message}`
        const organization = data && data.fetchOrganization
        const teams = data && data.fetchOrganization.teams
        const leaders = teams.map(team => team.leader.email)
        return (
          <Mutation
            mutation={initializeNeededSkills}
            refetchQueries={[
              { query: OrganizationQuery, variables: { organizationId } }
            ]}
          >
            {initializeNeededSkills => (
              <Card
                className='box-card'
                header={
                  <div className='clearfix'>
                    <span style={{ lineHeight: '36px' }}>
                      {organization.organizationName}
                    </span>
                    <OrganizationDetails {...organization} />
                    <div>
                      <span style={{ float: 'right' }}>
                        <Link to={`${match.url}/edit`}>
                          <Button type='primary' icon='edit' />
                        </Link>
                      </span>
                      {!organization.disabled && (
                        <span style={{ float: 'right', marginRight: 10 }}>
                          <OrganizationInviteUserForm />
                        </span>
                      )}
                      {!organization.disabled && (
                        <span style={{ float: 'right', marginRight: 10 }}>
                          <OrganizationCreateTeamForm
                            employees={organization.employees}
                          />
                        </span>
                      )}
                      {!organization.neededSkillsEnabled &&
                        !organization.disabled && (
                          <span style={{ float: 'right', marginRight: 10 }}>
                            <Button
                              type='primary'
                              onClick={() =>
                                enableCustomNeededSkills(
                                  initializeNeededSkills,
                                  organizationId
                                )
                              }
                            >
                              Customize needed skills
                            </Button>
                          </span>
                        )}
                      {organization.isDemoOrganization && (
                        <span style={{ float: 'right', marginRight: 10 }}>
                          <ResetDemoOrganization
                            organizationId={organizationId}
                          />
                        </span>
                      )}
                      {organization.disabled && (
                        <span style={{ float: 'right', marginRight: 10 }}>
                          <ActivateOrganization
                            organizationId={organizationId}
                          />
                        </span>
                      )}
                    </div>
                  </div>
                }
              >
                <div style={{ marginTop: 20 }}>
                  {!organization.disabled ? (
                    <Tabs
                      type='card'
                      activeName={activeTab}
                      onTabClick={value => {
                        setSelectedTab(value.props.label)
                      }}
                    >
                      <Tabs.Pane label='Employees' name='1'>
                        {selectedTab == 'Employees' ? (
                          <Table
                            labelWidth='120'
                            style={{ width: '100%' }}
                            columns={listColumns(
                              leaders,
                              organizationId,
                              organization.employees.reduce(
                                (acc = [], curr) => {
                                  if (curr.roles.indexOf('ADMIN') !== -1)
                                    return [...acc, curr]
                                  else return acc
                                },
                                []
                              )
                            )}
                            data={organization && organization.employees}
                            stripe
                          />
                        ) : null}
                      </Tabs.Pane>
                      <Tabs.Pane label='Teams' name='2'>
                        {selectedTab == 'Teams' ? (
                          <OrganizationTeams
                            organizationId={organizationId}
                            urlextension={match.url}
                          />
                        ) : null}
                      </Tabs.Pane>
                      <Tabs.Pane label='Skills' name='3'>
                        {selectedTab == 'Skills' ? (
                          <OrganizationSkills
                            organizationId={organizationId}
                            urlextension={match.url}
                          />
                        ) : null}
                      </Tabs.Pane>
                      {organization.neededSkillsEnabled && (
                        <Tabs.Pane label='Needed Skills' name='4'>
                          {selectedTab == 'Needed Skills' ? (
                            <OrganizationNeededSkills
                              organization={organization}
                              urlextension={match.url}
                            />
                          ) : null}
                        </Tabs.Pane>
                      )}
                      <Tabs.Pane label='Content' name='5'>
                        {selectedTab == 'Content' ? (
                          <OrganizationContent
                            organizationId={organizationId}
                          />
                        ) : null}
                      </Tabs.Pane>
                      <Tabs.Pane label='Categories' name='6'>
                        {selectedTab == 'Categories' ? (
                          <CategoriesList organizationId={organizationId} />
                        ) : null}
                      </Tabs.Pane>
                      <Tabs.Pane label='Content stats' name='7'>
                        {selectedTab == 'Content stats' ? (
                          <OrganizationContentStats
                            organizationId={organizationId}
                          />
                        ) : null}
                      </Tabs.Pane>
                      <Tabs.Pane label='Roles' name='8'>
                        {selectedTab == 'Roles' ? (
                          <RolesPage specificOrganizationId={organizationId} />
                        ) : null}
                      </Tabs.Pane>
                      {/* <Tabs.Pane label='Goals' name='9'>
                      <OrganizationGoals
                        organizationId={organizationId}
                        urlextension={match.url}
                      />
                    </Tabs.Pane> */}
                      <Tabs.Pane label='Skill stats' name='10'>
                        {selectedTab == 'Skill stats' ? (
                          <OrganizationSkillStats
                            organizationId={organizationId}
                          />
                        ) : null}
                      </Tabs.Pane>
                      <Tabs.Pane label='Path stats' name='11'>
                        {selectedTab == 'Path stats' ? (
                          data.fetchOrganization.employees.length >= 300 ? (
                            <div>
                              Sorry, we couldn't fetch path statistics for such
                              a large organization
                            </div>
                          ) : (
                            <OrganizationLearningPathStatistics
                              organizationId={organizationId}
                            />
                          )
                        ) : null}
                      </Tabs.Pane>
                    </Tabs>
                  ) : (
                    <Tabs
                      type='card'
                      activeName={activeTab}
                      onTabClick={value => {
                        setSelectedTab(value.props.label)
                      }}
                    >
                      <Tabs.Pane label='Employees' name='1'>
                        {selectedTab == 'Employees' ? (
                          <Table
                            labelWidth='120'
                            style={{ width: '100%' }}
                            columns={listColumns(
                              leaders,
                              organizationId,
                              organization.employees.reduce(
                                (acc = [], curr) => {
                                  if (curr.roles.indexOf('ADMIN') !== -1)
                                    return [...acc, curr]
                                  else return acc
                                },
                                []
                              )
                            )}
                            data={organization && organization.employees}
                            stripe
                          />
                        ) : null}
                      </Tabs.Pane>
                    </Tabs>
                  )}
                </div>
              </Card>
            )}
          </Mutation>
        )
      }}
    </Query>
  )
}

export default OrganizationPage
