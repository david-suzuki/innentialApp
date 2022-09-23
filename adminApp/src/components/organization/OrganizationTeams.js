import React from 'react'
import { Button, Table, Message, MessageBox } from 'element-react'
import { Link } from 'react-router-dom'
import { Query, Mutation } from 'react-apollo'
import {
  archiveTeam,
  deleteTeam,
  fetchOrganization as OrganizationQuery
} from '../../api'

const handleArchivingTeam = (teamId, archiveTeam) => {
  MessageBox.confirm('Are you sure you want to archive this team?', 'Warning', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  })
    .then(async () => {
      console.log({
        variables: {
          teamId
        }
      })
      try {
        await archiveTeam({
          variables: {
            teamId
          }
        })
        Message({
          type: 'success',
          message: 'Team successfully archived'
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
        message: 'Archive canceled'
      })
    })
}

const handleDeletingTeam = (teamId, deleteTeam) => {
  MessageBox.confirm('Are you sure you want to delete this team?', 'Warning', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  })
    .then(async () => {
      console.log({
        variables: {
          teamId
        }
      })
      try {
        await deleteTeam({
          variables: {
            teamId
          }
        })
        Message({
          type: 'success',
          message: 'Team successfully deleted'
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
        message: 'Delete canceled'
      })
    })
}

const OrganizationTeams = props => {
  const organizationId = props.organizationId
  const url = props.urlextension
  return (
    <Query query={OrganizationQuery} variables={{ organizationId }}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...'
        if (error) return `Error! ${error.message}`

        const teamData =
          data && data.fetchOrganization && data.fetchOrganization.teams

        return (
          <Table
            labelWidth='120'
            style={{ width: '100%' }}
            columns={[
              {
                label: 'Team Name',
                prop: 'teamName'
              },
              {
                label: 'Leader',
                // width: '240',
                render: ({ leader }) => {
                  const { firstName, name, email } = leader
                  return (
                    <p>
                      {firstName || name || ''} ({email})
                    </p>
                  )
                }
              },
              {
                label: 'Members',
                width: '200',
                render: ({ members }) => {
                  return <div>{members.length + 1}</div>
                }
              },
              {
                label: 'Operations',
                render: ({ _id: teamId }) => {
                  return (
                    <div className='clearfix'>
                      <span style={{ float: 'left' }}>
                        <Link
                          to={`${url}/${teamId}`}
                          style={{ marginTop: '25%' }}
                        >
                          <Button
                            style={{ marginLeft: 10 }}
                            type='primary'
                            size='small'
                          >
                            Details
                          </Button>
                        </Link>
                      </span>
                      <span style={{ float: 'left' }}>
                        <Mutation
                          mutation={archiveTeam}
                          refetchQueries={['fetchOrganization']}
                        >
                          {archiveTeam => (
                            <Button
                              style={{ marginLeft: 10 }}
                              type='warning'
                              size='small'
                              onClick={async () =>
                                handleArchivingTeam(teamId, archiveTeam)
                              }
                            >
                              Archive
                            </Button>
                          )}
                        </Mutation>
                      </span>
                      <span style={{ float: 'left' }}>
                        <Mutation
                          mutation={deleteTeam}
                          refetchQueries={['fetchOrganization']}
                        >
                          {deleteTeam => (
                            <Button
                              style={{ marginLeft: 10 }}
                              type='danger'
                              size='small'
                              onClick={async () =>
                                handleDeletingTeam(teamId, deleteTeam)
                              }
                            >
                              Delete
                            </Button>
                          )}
                        </Mutation>
                      </span>
                    </div>
                  )
                }
              }
            ]}
            data={teamData}
            stripe
          />
        )
      }}
    </Query>
  )
}

export default OrganizationTeams
