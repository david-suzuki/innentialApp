import React, { useState } from 'react'
// import {} from 'element-react'
import { Button, MessageBox, Notification } from 'element-react'
import roleManagementStyle from '../../styles/roleManagementStyle'
import tableStyle from '../../styles/tableStyle'
import {
  fetchRoleGroups,
  fetchRoleSuggestions,
  deleteRole,
  deleteRoleGroup
} from '../../api'
import { Query, Mutation } from 'react-apollo'
import { captureFilteredError, LoadingSpinner } from '../general'
import { Link } from 'react-router-dom'
import Container from '../../globalState'

const handleDeletingGroup = (groupId, mutation) => {
  MessageBox.confirm(
    `This cannot be undone`,
    `Are you sure you want to delete the role group? All related roles will be preserved`,
    {
      type: 'warning'
    }
  )
    .then(() => {
      mutation({
        variables: {
          groupId
        }
      })
        .then(({ data: { deleteRoleGroup: response } }) => {
          if (response !== null) {
            Notification({
              type: 'success',
              message: 'Role group deleted',
              duration: 2500,
              offset: 90
            })
          } else {
            Notification({
              type: 'warning',
              message: 'Oops! Something went wrong',
              duration: 2500,
              offset: 90
            })
          }
        })
        .catch(err => {
          captureFilteredError(err)
          Notification({
            type: 'warning',
            message: 'Oops! Something went wrong',
            duration: 2500,
            offset: 90
          })
        })
    })
    .catch(() => {})
}

const handleDeletingRole = (roleId, mutation) => {
  MessageBox.confirm(
    `This cannot be undone`,
    `Are you sure you want to delete the role?`,
    {
      type: 'warning'
    }
  )
    .then(() => {
      mutation({
        variables: {
          roleId
        }
      })
        .then(({ data: { deleteRole: response } }) => {
          if (response !== null) {
            Notification({
              type: 'success',
              message: 'Role deleted',
              duration: 2500,
              offset: 90
            })
          } else {
            Notification({
              type: 'warning',
              message: 'Oops! Something went wrong',
              duration: 2500,
              offset: 90
            })
          }
        })
        .catch(err => {
          captureFilteredError(err)
          Notification({
            type: 'warning',
            message: 'Oops! Something went wrong',
            duration: 2500,
            offset: 90
          })
        })
    })
    .catch(() => {})
}

const RoleTable = ({
  roles = [],
  suggestion = true,
  handleDeletion = () => {}
}) => {
  return (
    <table className='table'>
      <tbody>
        <tr>
          <td style={{ width: '25%' }}>Title</td>
          {!suggestion && <td>Description</td>}
          {suggestion && <td>Suggested by</td>}
          <td style={{ width: '20%' }}>Core skills</td>
          <td style={{ width: '20%' }}>Nice to have skills</td>
          <td style={{ width: '10%' }} />
        </tr>
        {roles.map(
          ({
            _id,
            title,
            description,
            suggestedBy,
            coreSkills,
            secondarySkills,
            nextSteps
          }) => (
            <tr key={`role${suggestion ? '-suggestion' : ''}:${_id}`}>
              <td>{title}</td>
              {!suggestion && (
                <td className='table__column--description'>
                  {description || 'N/A'}
                </td>
              )}
              {suggestion && <td>{suggestedBy}</td>}
              <td>{coreSkills.length}</td>
              <td>{secondarySkills.length}</td>
              <td>
                <span>
                  <Link
                    to={{
                      pathname: '/roles/form',
                      state: {
                        initialData: {
                          _id,
                          title,
                          description,
                          coreSkills,
                          secondarySkills,
                          nextSteps,
                          suggestion
                        }
                      }
                    }}
                  >
                    <i className='el-icon-edit' />
                  </Link>
                  <i
                    className='el-icon-delete icon-delete-red'
                    onClick={() => handleDeletion(_id)}
                  />
                </span>
              </td>
            </tr>
          )
        )}
        {roles.length === 0 && (
          <tr>
            <th colSpan='5'>Nothing to display</th>
          </tr>
        )}
      </tbody>
      <style>{tableStyle}</style>
    </table>
  )
}

const RoleGroupItem = ({
  _id: groupId,
  isOpen,
  onToggle: handleToggle,
  groupName,
  relatedRoles,
  deleteRole,
  deleteRoleGroup
}) => {
  // const [expandPanel, togglePanel] = useState(index === 0)

  return (
    <div>
      <div className='role-management__group-heading'>
        <span>
          <i
            onClick={handleToggle}
            className={`icon icon-small-down ${isOpen &&
              'icon-rotate-180'} role-management__group-heading__expand`}
          />
          {groupName}
          <span className='role-management__group-heading__count'>
            {relatedRoles.length}
          </span>
        </span>
        {groupId !== 'default:ungrouped' && (
          <span>
            <Link
              to={{
                pathname: '/roles/group',
                state: {
                  initialData: { _id: groupId, groupName, relatedRoles }
                }
              }}
            >
              <i className='el-icon-edit' />
            </Link>
            <i
              className='el-icon-delete icon-clickable'
              style={{ marginLeft: '3px' }}
              onClick={() => handleDeletingGroup(groupId, deleteRoleGroup)}
            />
          </span>
        )}
      </div>
      {isOpen && (
        <div style={{ paddingLeft: '7px' }}>
          <RoleTable
            roles={relatedRoles}
            suggestion={false}
            handleDeletion={roleId => handleDeletingRole(roleId, deleteRole)}
          />
        </div>
      )}
    </div>
  )
}

export default () => {
  const { openRoleTabs, handleToggleRoleTab } = Container.useContainer()

  return (
    <Mutation
      mutation={deleteRole}
      update={(cache, { data: { deleteRole: result } }) => {
        const { fetchRoleGroups: roleGroups } = cache.readQuery({
          query: fetchRoleGroups
        })
        const filteredGroups = roleGroups.map(({ relatedRoles, ...rest }) => ({
          ...rest,
          relatedRoles: relatedRoles.filter(role => role._id !== result)
        }))
        cache.writeQuery({
          query: fetchRoleGroups,
          data: {
            fetchRoleGroups: filteredGroups
          }
        })
      }}
      refetchQueries={['fetchRoleSuggestions', 'fetchRoles']}
    >
      {deleteRole => (
        <div className='role-management__wrapper'>
          <Query query={fetchRoleSuggestions}>
            {({ data, loading, error }) => {
              if (loading) return <LoadingSpinner />
              if (error) {
                captureFilteredError(error)
                return null
              }

              if (data) {
                const roleData = data.fetchRoleSuggestions
                if (roleData.length > 0) {
                  return (
                    <div style={{ marginBottom: '40px' }}>
                      <h3
                        className='align-left'
                        style={{ marginBottom: '10px' }}
                      >
                        User suggested roles
                      </h3>
                      <RoleTable
                        roles={roleData}
                        handleDeletion={roleId =>
                          handleDeletingRole(roleId, deleteRole)
                        }
                      />
                    </div>
                  )
                }
              }
              return null
            }}
          </Query>
          <Query query={fetchRoleGroups}>
            {({ data, loading, error }) => {
              if (loading) return <LoadingSpinner />
              if (error) {
                captureFilteredError(error)
                return null
              }

              if (data) {
                const roleGroupData = data.fetchRoleGroups
                return (
                  <Mutation
                    mutation={deleteRoleGroup}
                    // refetchQueries={['fetchRoleGroups']}
                    update={(cache, { data: { deleteRoleGroup: result } }) => {
                      const { fetchRoleGroups: roleGroups } = cache.readQuery({
                        query: fetchRoleGroups
                      })
                      const [removedGroup] = roleGroups.splice(
                        roleGroups.findIndex(
                          ({ _id: groupId }) => result === groupId
                        ),
                        1
                      )
                      const [ungrouped] = roleGroups.splice(
                        roleGroups.findIndex(
                          ({ _id: groupId }) => groupId === 'default:ungrouped'
                        ),
                        1
                      )
                      // const filteredGroups = roleGroups.filter(({ _id: groupId }) => result !== groupId)
                      cache.writeQuery({
                        query: fetchRoleGroups,
                        data: {
                          fetchRoleGroups: [
                            ...roleGroups,
                            {
                              ...ungrouped,
                              relatedRoles: [
                                ...removedGroup.relatedRoles,
                                ...ungrouped.relatedRoles
                              ]
                            }
                          ]
                        }
                      })
                    }}
                  >
                    {deleteRoleGroup => (
                      <>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            verticalAlign: 'middle',
                            margin: '10px 0px'
                          }}
                        >
                          <h3>Roles in the organization</h3>
                          <div>
                            <Link to='/roles/form'>
                              <Button
                                type='primary'
                                className='role-management__add-role-button'
                              >
                                Add new role
                              </Button>
                            </Link>
                            <Link to='/roles/group'>
                              <Button
                                type='primary'
                                style={{ marginLeft: '10px' }}
                              >
                                Add new role progression
                              </Button>
                            </Link>
                          </div>
                        </div>
                        {roleGroupData.map((group, i) => (
                          <RoleGroupItem
                            key={group._id}
                            isOpen={openRoleTabs.some(index => i === index)}
                            onToggle={() => handleToggleRoleTab(i)}
                            {...group}
                            deleteRole={deleteRole}
                            deleteRoleGroup={deleteRoleGroup}
                          />
                        ))}
                      </>
                    )}
                  </Mutation>
                )
              }
              return null
            }}
          </Query>

          <style jsx>{roleManagementStyle}</style>
        </div>
      )}
    </Mutation>
  )
}
