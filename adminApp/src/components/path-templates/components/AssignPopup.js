import React, { useState } from 'react'
import { UserSearch } from '../../user'
import { Dialog, Button, Pagination, Table, Tag, Message } from 'element-react'
import { useMutation } from 'react-apollo'
import { transformLearningPathToGoalsAdmin } from '../../../api'
import { ROLES } from '../../../environment'

const DetailsDialog = ({ pathId, pathName, setNotVisible }) => {
  const [users, setUsers] = useState([])

  const [assign] = useMutation(transformLearningPathToGoalsAdmin)

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const paginated = users.slice(pageSize * (page - 1), pageSize * page)

  return (
    <Dialog
      title={`Assign the '${pathName}' path to a user`}
      visible
      onCancel={setNotVisible}
      lockScroll
      showClose
      size='large'
    >
      <Dialog.Body>
        {users.length > 0 && (
          <Pagination
            total={users.length}
            layout='sizes, prev, pager, next'
            pageSizes={[20, 50, 100, 200]}
            pageSize={pageSize}
            currentPage={page}
            onSizeChange={pageSize => setPageSize(pageSize)}
            onCurrentChange={page => setPage(page)}
          />
        )}
        <UserSearch displayResults={(results = []) => setUsers([...results])} />
        {users.length > 0 && (
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
                          style={{ marginRight: 10 }}
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
                        <Tag style={{ marginRight: 10 }} type='warning'>
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
                render: ({ _id: userId }) => {
                  return (
                    <Button
                      onClick={async () => {
                        try {
                          const {
                            data: {
                              transformLearningPathToGoalsAdmin: response
                            }
                          } = await assign({
                            variables: {
                              id: pathId,
                              targetUser: userId
                            }
                          })

                          if (response === null) {
                            Message({
                              message: 'Something went wrong',
                              type: 'error',
                              customClass: 'message-box--on-top'
                            })
                          } else {
                            Message({
                              message: 'Assignment was successful',
                              type: 'success',
                              customClass: 'message-box--on-top'
                            })
                          }
                        } catch (err) {
                          Message({
                            message: err.message,
                            type: 'error',
                            customClass: 'message-box--on-top'
                          })
                        }
                      }}
                      type='success'
                      size='small'
                    >
                      Assign
                    </Button>
                  )
                }
              }
            ]}
            data={paginated}
            stripe
          />
        )}
      </Dialog.Body>
      <style>{`
      .message-box--on-top {
        z-index: 1014;
      }
      `}</style>
    </Dialog>
  )
}

export default DetailsDialog
