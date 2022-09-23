import React, { useState } from 'react'
import { Link, withRouter } from 'react-router-dom'
import ApolloCacheUpdater from 'apollo-cache-updater'
import {
  Layout,
  Table,
  Button,
  Message,
  MessageBox,
  Icon,
  Tag,
  Pagination
} from 'element-react'
import {
  deleteUser,
  fetchAllUsers,
  fetchAllUsers as UsersQuery,
  fetchUsersListLength as usersCountQuery
} from '../../api'
import { Query, Mutation, useMutation } from 'react-apollo'
import { ROLES } from '../../environment'

// TODO: introduce new deleteUser mutation specific to this logic

const handleRemovingUser = (userId, leader, mutation) => {
  MessageBox.confirm(
    leader ? (
      <React.Fragment>
        This user is the leader of a team
        <br />
        Deleting him will archive the team. You can change the team's leader
        from the team menu in the organization page.
      </React.Fragment>
    ) : (
      'This action will permanently delete the user. Continue?'
    ),
    'Warning',
    {
      confirmButtonText: leader ? 'Delete and archive' : 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  )
    .then(() => {
      try {
        mutation({
          variables: {
            userId
          },
          update: async (
            proxy,
            { data: { deleteUser: mutationResult = {} } }
          ) => {
            const updates = await ApolloCacheUpdater({
              proxy, // apollo proxy
              queriesToUpdate: [fetchAllUsers],
              operation: 'REMOVE',
              searchVariables: {},
              mutationResult: { _id: userId },
              ID: '_id'
            })
            if (updates)
              Message({
                type: 'success',
                message: 'Delete completed!'
              })
          }
        })
      } catch (e) {
        Message({
          type: 'error',
          message: `${e.graphQLErrors[0].message}`
        })
      }
    })
    .catch(e => {
      Message({
        type: 'info',
        message: 'Delete canceled'
      })
    })
}

const UserList = () => {
  const [mutation] = useMutation(deleteUser)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(100)

  const queryVariables = {
    offset: page,
    limit: pageSize
  }
  return (
    <div>
      <Query query={UsersQuery} variables={queryVariables}>
        {({ loading, error, data }) => {
          if (loading) return 'Loading...'
          if (error) return `Error! ${error.message}`

          return (
            <Layout.Row>
              <Layout.Col span='24'>
                <Query query={usersCountQuery}>
                  {({ loading, error, data }) => {
                    if (loading) return 'Loading...'
                    if (error) return `Error! ${error.message}`
                    return (
                      <Pagination
                        total={data && data.fetchUsersListLength}
                        layout='sizes, prev, pager, next'
                        pageSizes={[100, 200, 500]}
                        pageSize={pageSize}
                        currentPage={page}
                        onSizeChange={pageSize => setPageSize(pageSize)}
                        onCurrentChange={page => setPage(page)}
                      />
                    )
                  }}
                </Query>

                <Table
                  labelWidth='120'
                  style={{ width: '100%' }}
                  columns={[
                    {
                      label: 'Email',
                      prop: 'email'
                    },
                    {
                      label: 'Name',
                      render: ({ firstName }) => {
                        if (firstName) {
                          return <i>{firstName}</i>
                        } else return <i>N/A</i>
                      }
                    },
                    {
                      label: 'Surname',
                      render: ({ lastName }) => {
                        if (!lastName) {
                          return <i>-</i>
                        } else return <i>{lastName}</i>
                      }
                    },
                    {
                      label: 'Organization',
                      prop: 'organizationName'
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
                      render: ({ roles, leader }) => {
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
                            {leader ? (
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
                      width: 120,
                      render: ({ _id, leader }) => {
                        return (
                          // <Mutation
                          //   mutation={deleteUser}
                          // update={(cache, { data: { deleteUser } }) => {
                          //   const { fetchAllUsers } = cache.readQuery({
                          //     query: UsersQuery
                          //   })
                          //   const newUsers = fetchAllUsers.filter(
                          //     user => user.email !== deleteUser.email
                          //   )
                          //   cache.writeQuery({
                          //     query: UsersQuery,
                          //     data: { fetchAllUsers: [...newUsers] }
                          //   })
                          // }}
                          //   refetchQueries={[
                          //     'fetchOrganization',
                          //     'fetchAllUsers'
                          //   ]}
                          // >
                          // {deleteUser => (
                          <span
                            style={{
                              display: 'flex',
                              justifyContent: 'center'
                            }}
                          >
                            <Button
                              style={{ marginTop: '25%', marginLeft: 10 }}
                              type='danger'
                              size='small'
                              onClick={async () =>
                                handleRemovingUser(_id, leader, mutation)
                              }
                            >
                              Delete
                            </Button>
                            <Link
                              to={`/users/${_id}`}
                              style={{ marginTop: '25%' }}
                            >
                              <Button type='success' size='small'>
                                <Icon name='arrow-right' />
                              </Button>
                            </Link>
                          </span>
                          // )}
                          // {/* </Mutation> */}
                        )
                      }
                    }
                  ]}
                  data={data && data.fetchAllUsers}
                  stripe
                />
              </Layout.Col>
            </Layout.Row>
          )
        }}
      </Query>
      <style jsx global>{`
        .el-button {
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  )
}

export default withRouter(UserList)
