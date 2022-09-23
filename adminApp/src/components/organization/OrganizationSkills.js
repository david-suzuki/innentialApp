import React, { Component } from 'react'
import {
  Layout,
  Table,
  Button,
  Loading,
  Message,
  MessageBox,
  Checkbox,
  Pagination
} from 'element-react'
import { localizedTime } from '../general/utilities'
import {
  fetchOrganizationSkillsForAdmin as OrgSkillQuery,
  disableSelectedSkillsForOrganization,
  enableSelectedSkillsForOrganization,
  deleteSkillFromOrganization,
  fetchAmountOfContentForSkill,
  resetCustomCategoryForSkill,
  fetchSkillDeleteInfo,
  makeMandatoryForOrganization,
  makeNotMandatoryForOrganization
} from '../../api'
import { Query, Mutation, ApolloConsumer } from 'react-apollo'
import { SkillsAdd } from '../skills'
import { Link } from 'react-router-dom'
import { AddSkillsFramework } from '../frameworks'

const checkSkillsDeleteInfo = async (client, selectedSkills) => {
  const checks = []
  selectedSkills.forEach(id => {
    checks.push(
      client.query({
        query: fetchSkillDeleteInfo,
        variables: { skillId: id }
      })
    )
  })
  const checksReturned = await Promise.all(checks)
  checksReturned
    .map(item => item.data.fetchSkillDeleteInfo)
    .filter(item => !!item)
  if (checksReturned.length > 0) {
    return checksReturned.map(item => item.data.fetchSkillDeleteInfo)
  }
  return []
}

const handleRemovingSkill = async (
  client,
  skillId,
  organizationId,
  deleteSkillFromOrganization,
  contentLength
) => {
  const usersHaveSkill = await checkSkillsDeleteInfo(client, [skillId])
  MessageBox.confirm(
    `This will permanently delete the file${
      contentLength > 0
        ? ' and ' +
          contentLength +
          ` learning content item${contentLength > 1 ? 's' : ''}`
        : ''
    }.${
      usersHaveSkill.length > 0
        ? ' Some users will have the skill deleted from profile.'
        : ''
    } Continue?`,
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  )
    .then(async () => {
      await deleteSkillFromOrganization({
        variables: {
          skillId,
          organizationId
        }
      }).then(({ deleteSkillFromOrganization }) => {
        if (deleteSkillFromOrganization !== 'OK') {
          Message({
            type: 'success',
            message: 'Delete completed!'
          })
        }
      })
    })
    .catch(() => {
      Message({
        type: 'info',
        message: 'Delete canceled'
      })
    })
}

const listColumns = (organizationId, urlextension, client) => [
  {
    type: 'selection',
    reserveSelection: true
  },
  {
    label: 'Date',
    render: row => {
      return localizedTime(row.createdAt)
    }
  },
  {
    label: 'Category',
    prop: 'category',
    sortable: 'custom'
  },
  {
    label: 'Name',
    prop: 'name',
    sortable: 'custom'
  },
  {
    label: 'Enabled',
    prop: 'enabled',
    render: ({ enabled }) => {
      if (enabled) return 'True'
      else return 'False'
    },
    sortable: 'custom'
    // sortMethod: ({ enabled }) => {
    //   return enabled
    // }
  },
  {
    label: 'Mandatory',
    prop: 'mandatory',
    render: ({ mandatory }) => {
      if (mandatory) return 'True'
      else return 'False'
    },
    sortable: 'custom'
    // sortMethod: ({ mandatory }) => {
    //   return mandatory
    // }
  },
  {
    label: 'Operations',
    width: '400px',
    render: ({
      _id,
      organizationSpecific,
      useCustomCategory,
      orgFrameworkId
    }) => {
      return (
        <div>
          {orgFrameworkId && (
            <Link
              to={{
                pathname: `/frameworks/${orgFrameworkId}/edit`
              }}
            >
              <Button type='info' size='small' style={{ marginRight: '10px' }}>
                Edit Framework
              </Button>
            </Link>
          )}
          {organizationSpecific === organizationId && (
            <Mutation
              mutation={deleteSkillFromOrganization}
              refetchQueries={[
                'fetchOrganizationSpecificContent',
                'fetchAllSkills',
                'fetchOrganizationSkillsForAdmin'
              ]}
            >
              {deleteSkillFromOrganization => {
                return (
                  <Query
                    query={fetchAmountOfContentForSkill}
                    variables={{
                      skillId: _id
                    }}
                  >
                    {({ data }) => {
                      if (data) {
                        return (
                          <Button
                            type='danger'
                            size='small'
                            style={{ marginRight: '10px' }}
                            onClick={async () =>
                              handleRemovingSkill(
                                client,
                                _id,
                                organizationId,
                                deleteSkillFromOrganization,
                                data.fetchAmountOfContentForSkill
                              )
                            }
                          >
                            Delete
                          </Button>
                        )
                      }
                      return null
                    }}
                  </Query>
                )
              }}
            </Mutation>
          )}{' '}
          {useCustomCategory ? (
            <Mutation
              mutation={resetCustomCategoryForSkill}
              variables={{
                skillId: _id,
                organizationId
              }}
              refetchQueries={['fetchOrganizationSkillsForAdmin']}
            >
              {resetCustomCategoryForSkill => (
                <Button
                  style={{
                    marginRight: '10px'
                  }}
                  type='warning'
                  size='small'
                  onClick={async e => {
                    e.preventDefault()
                    await resetCustomCategoryForSkill()
                      .then(() => {
                        Message({
                          type: 'success',
                          message: 'Delete completed!'
                        })
                      })
                      .catch(e => {
                        Message({
                          type: 'error',
                          message: `${e.message}`
                        })
                      })
                  }}
                >
                  Reset custom category
                </Button>
              )}
            </Mutation>
          ) : (
            <Link to={{ pathname: `${urlextension}/set-category/${_id}` }}>
              <Button
                type='info'
                size='small'
                style={{
                  marginRight: '10px'
                }}
              >
                {organizationSpecific === organizationId
                  ? `Set category`
                  : `Set custom category`}
              </Button>
            </Link>
          )}
          <Link to={`${urlextension}/add-content/${_id}`}>
            <Button type='info' size='small'>
              Add content
            </Button>
          </Link>
        </div>
      )
    }
  }
]

export default class OrganizationSkills extends Component {
  state = {
    skills: [],
    pageSize: 20,
    page: 1,
    sortMethod: (a, b) => 0
  }

  timeout = null

  table = React.createRef()

  handleSelection = selection => {
    this.setState({
      skills: selection.map(({ _id, name }) => ({ _id, name }))
    })
  }

  updateSkills = (cache, key, value) => {
    try {
      const { organizationId } = this.props
      const { fetchOrganizationSkillsForAdmin: skills } = cache.readQuery({
        query: OrgSkillQuery,
        variables: { organizationId }
      })
      const newSkills = skills.map(skill => {
        if (this.state.skills.some(s => s._id === skill._id)) {
          return {
            ...skill,
            [key]: value
          }
        }
        return skill
      })
      cache.writeQuery({
        query: OrgSkillQuery,
        data: { fetchOrganizationSkillsForAdmin: [...newSkills] },
        variables: { organizationId }
      })
    } catch (e) {}
  }

  clearSelect = () => {
    this.setState({
      skills: []
    })
    this.table.current.clearSelection()
  }

  render() {
    const { organizationId, urlextension } = this.props
    const { pageSize, page, sortMethod } = this.state

    return (
      <ApolloConsumer>
        {client => (
          <Query query={OrgSkillQuery} variables={{ organizationId }}>
            {({ loading, error, data }) => {
              if (loading) return 'Loading...'
              if (error) return `Error! ${error.message}`

              if (data) {
                const skills = data.fetchOrganizationSkillsForAdmin

                skills.sort(sortMethod)

                const paginated = skills.slice(
                  pageSize * (page - 1),
                  pageSize * page
                )

                return (
                  <React.Fragment>
                    <Layout.Row>
                      <span
                        style={{
                          display: 'flex',
                          marginBottom: '20px',
                          float: 'left'
                        }}
                      >
                        <Mutation
                          mutation={disableSelectedSkillsForOrganization}
                          update={cache =>
                            this.updateSkills(cache, 'enabled', false)
                          }
                        >
                          {(
                            disableSelectedSkillsForOrganization,
                            { loading }
                          ) => {
                            return (
                              <Button
                                style={{
                                  marginRight: '15px'
                                }}
                                loading={loading}
                                type='primary'
                                onClick={async e => {
                                  const { skills } = this.state
                                  e.preventDefault()
                                  if (skills.length > 0) {
                                    try {
                                      await disableSelectedSkillsForOrganization(
                                        {
                                          variables: {
                                            skillIDs: skills.map(
                                              ({ _id }) => _id
                                            ),
                                            organizationId
                                          }
                                        }
                                      )
                                      Message({
                                        type: 'success',
                                        message: 'Skills disabled'
                                      })
                                      this.clearSelect()
                                    } catch (e) {
                                      Message({
                                        type: 'error',
                                        message: `${e}`
                                      })
                                    }
                                  }
                                }}
                              >
                                Disable Selected
                              </Button>
                            )
                          }}
                        </Mutation>
                        <Mutation
                          mutation={enableSelectedSkillsForOrganization}
                          update={cache =>
                            this.updateSkills(cache, 'enabled', true)
                          }
                        >
                          {(
                            enableSelectedSkillsForOrganization,
                            { loading }
                          ) => {
                            return (
                              <Button
                                style={{
                                  marginLeft: '0px',
                                  marginRight: '15px'
                                }}
                                loading={loading}
                                type='primary'
                                onClick={async e => {
                                  const { skills } = this.state
                                  e.preventDefault()
                                  if (skills.length > 0) {
                                    try {
                                      await enableSelectedSkillsForOrganization(
                                        {
                                          variables: {
                                            skillIDs: skills.map(
                                              ({ _id }) => _id
                                            ),
                                            organizationId
                                          }
                                        }
                                      )
                                      Message({
                                        type: 'success',
                                        message: 'Skills enabled'
                                      })
                                      this.clearSelect()
                                    } catch (e) {
                                      Message({
                                        type: 'error',
                                        message: `${e}`
                                      })
                                    }
                                  }
                                }}
                              >
                                Enable Selected
                              </Button>
                            )
                          }}
                        </Mutation>
                        <Mutation
                          mutation={makeNotMandatoryForOrganization}
                          update={cache =>
                            this.updateSkills(cache, 'mandatory', false)
                          }
                        >
                          {(mutate, { loading }) => {
                            return (
                              <Button
                                style={{
                                  marginRight: '15px'
                                }}
                                loading={loading}
                                type='primary'
                                onClick={async e => {
                                  const { skills } = this.state
                                  e.preventDefault()
                                  if (skills.length > 0) {
                                    try {
                                      await mutate({
                                        variables: {
                                          skills,
                                          organizationId
                                        }
                                      })
                                      Message({
                                        type: 'success',
                                        message: 'Skills updated'
                                      })
                                      this.clearSelect()
                                    } catch (e) {
                                      Message({
                                        type: 'error',
                                        message: `${e}`
                                      })
                                    }
                                  }
                                }}
                              >
                                Make selected non-mandatory
                              </Button>
                            )
                          }}
                        </Mutation>
                        <Mutation
                          mutation={makeMandatoryForOrganization}
                          update={cache =>
                            this.updateSkills(cache, 'mandatory', true)
                          }
                        >
                          {(mutate, { loading }) => {
                            return (
                              <Button
                                style={{
                                  marginLeft: '0px',
                                  marginRight: '15px'
                                }}
                                loading={loading}
                                type='primary'
                                onClick={async e => {
                                  const { skills } = this.state
                                  e.preventDefault()
                                  if (skills.length > 0) {
                                    try {
                                      await mutate({
                                        variables: { skills, organizationId }
                                      })
                                      Message({
                                        type: 'success',
                                        message: 'Skills updated'
                                      })
                                      this.clearSelect()
                                    } catch (e) {
                                      Message({
                                        type: 'error',
                                        message: `${e}`
                                      })
                                    }
                                  }
                                }}
                              >
                                Make selected mandatory
                              </Button>
                            )
                          }}
                        </Mutation>
                        <SkillsAdd organizationId={organizationId} />
                        <AddSkillsFramework
                          forSkills
                          organizationId={organizationId}
                        />
                        <Pagination
                          total={skills.length}
                          layout='sizes, prev, pager, next'
                          pageSizes={[20, 50, 100, 200]}
                          pageSize={pageSize}
                          currentPage={page}
                          onSizeChange={pageSize => this.setState({ pageSize })}
                          onCurrentChange={page => this.setState({ page })}
                        />
                      </span>
                    </Layout.Row>
                    <Layout.Row>
                      <Layout.Col span='24'>
                        <Table
                          ref={this.table}
                          style={{ width: '100%' }}
                          columns={listColumns(
                            organizationId,
                            urlextension,
                            client
                          )}
                          data={[...paginated]}
                          rowKey={row => `skill:${row._id}`}
                          stripe
                          emptyText='No skills to display'
                          onSelectChange={selection =>
                            this.handleSelection(selection)
                          }
                          onSelectAll={selection =>
                            this.handleSelection(selection)
                          }
                          onSortChange={({ prop, order }) => {
                            this.setState({
                              sortMethod: (a, b) => {
                                const prefix = order === 'ascending' ? 1 : -1
                                if (typeof a[prop] === 'string') {
                                  return prefix * b[prop].localeCompare(a[prop])
                                } else return prefix * (b[prop] - a[prop])
                              }
                            })
                          }}
                        />
                      </Layout.Col>
                    </Layout.Row>
                  </React.Fragment>
                )
              }
              return null
            }}
          </Query>
        )}
      </ApolloConsumer>
    )
  }
}
