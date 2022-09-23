import React, { Component } from 'react'
import {
  Layout,
  Table,
  Button,
  Message,
  MessageBox,
  Loading,
  Icon
} from 'element-react'
import { Query, Mutation } from 'react-apollo'
import {
  fetchAllSkillCategories as CategoryQuery,
  fetchSkillCategoriesForOrganization as OrgCategoryQuery,
  enableSelectedCategoriesForOrganization,
  disableSelectedCategoriesForOrganization,
  deleteCategoryFromOrganization,
  deleteCategory
} from '../../api'
import { localizedTime } from '../general/utilities'
import CategoriesAdd from './CategoriesAdd'
import { Link } from 'react-router-dom'
import { AddSkillsFramework } from '../frameworks'

const handleRemovingCategory = (variables, mutate) => {
  MessageBox.confirm(
    `This will permanently delete the file. Continue?`,
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  )
    .then(async () => {
      await mutate({
        variables
      }).then(response => {
        if (
          response.deleteCategoryFromOrganization !== 'OK' &&
          response.deleteCategory !== 'OK'
        ) {
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

const listColumns = organizationId => {
  if (organizationId) {
    return [
      {
        type: 'selection'
      },
      {
        label: 'Last updated',
        render: ({ updatedAt }) => {
          return localizedTime(updatedAt)
        }
      },
      {
        label: 'Enabled',
        render: ({ enabled }) => {
          if (enabled) return 'True'
          else return 'False'
        },
        sortable: true,
        sortMethod: ({ enabled }) => {
          return enabled
        }
      },
      {
        label: 'Name',
        prop: 'name',
        sortable: true
      },
      {
        label: 'Operations',
        render: ({ _id, name, organizationSpecific, orgFrameworkId }) => (
          <div>
            {orgFrameworkId && (
              <Link
                to={{
                  pathname: `/frameworks/${orgFrameworkId}/edit`
                }}
              >
                <Button
                  type='info'
                  size='small'
                  style={{ marginRight: '10px' }}
                >
                  Edit framework
                </Button>
              </Link>
            )}
            {organizationSpecific === organizationId && (
              <React.Fragment>
                <Mutation
                  mutation={deleteCategoryFromOrganization}
                  update={(
                    cache,
                    { data: { deleteCategoryFromOrganization } }
                  ) => {
                    const {
                      fetchSkillCategoriesForOrganization
                    } = cache.readQuery({
                      query: OrgCategoryQuery,
                      variables: { organizationId }
                    })
                    const newCategories = fetchSkillCategoriesForOrganization.filter(
                      category =>
                        category._id !== deleteCategoryFromOrganization
                    )
                    cache.writeQuery({
                      query: OrgCategoryQuery,
                      variables: { organizationId },
                      data: {
                        fetchSkillCategoriesForOrganization: [...newCategories]
                      }
                    })
                  }}
                  refetchQueries={[
                    'fetchOrganizationSpecificSkills',
                    'fetchOrganizationSkillsForAdmin',
                    'fetchAllSkillCategories',
                    'fetchRegularSkills',
                    'fetchAllSkills'
                  ]}
                >
                  {deleteCategoryFromOrganization => (
                    <Button
                      type='danger'
                      size='small'
                      style={{ marginRight: '10px' }}
                      onClick={async () =>
                        handleRemovingCategory(
                          {
                            categoryId: _id,
                            organizationId
                          },
                          deleteCategoryFromOrganization
                        )
                      }
                    >
                      Delete
                    </Button>
                  )}
                </Mutation>
                <Link
                  to={{
                    pathname: `/skill-categories/${_id}/rename`,
                    state: { name }
                  }}
                >
                  <Button type='success' size='small'>
                    <Icon name='arrow-right' />
                  </Button>
                </Link>
              </React.Fragment>
            )}
          </div>
        )
      }
    ]
  } else
    return [
      {
        label: 'Last updated',
        render: ({ updatedAt }) => {
          return localizedTime(updatedAt)
        }
      },
      {
        label: 'Name',
        prop: 'name',
        sortable: true
      },
      {
        label: 'Organization specific?',
        render: ({ organizationSpecific }) => {
          if (organizationSpecific) return 'Yes'
          else return 'No'
        }
      },
      {
        label: 'Operations',
        render: ({ _id, name, frameworkId }) => (
          <div>
            {frameworkId && (
              <Link
                to={{
                  pathname: `/frameworks/${frameworkId}/edit`
                }}
              >
                <Button
                  type='info'
                  size='small'
                  style={{ marginRight: '10px' }}
                >
                  Edit framework
                </Button>
              </Link>
            )}
            <Mutation
              mutation={deleteCategory}
              update={(cache, { data: { deleteCategory } }) => {
                const { fetchAllSkillCategories } = cache.readQuery({
                  query: CategoryQuery
                })
                const newCategories = fetchAllSkillCategories.filter(
                  category => category._id !== deleteCategory
                )
                cache.writeQuery({
                  query: CategoryQuery,
                  data: { fetchAllSkillCategories: [...newCategories] }
                })
              }}
              refetchQueries={[
                'fetchOrganizationSpecificSkills',
                'fetchOrganizationSpecificSkillsForAdmin',
                'fetchSkillCategoriesForOrganization',
                'fetchRegularSkills',
                'fetchAllSkills'
              ]}
            >
              {deleteCategory => (
                <Button
                  type='danger'
                  size='small'
                  style={{ marginRight: '10px' }}
                  onClick={async () =>
                    handleRemovingCategory({ categoryId: _id }, deleteCategory)
                  }
                >
                  Delete
                </Button>
              )}
            </Mutation>
            <Link
              to={{
                pathname: `/skill-categories/${_id}/rename`,
                state: { name }
              }}
            >
              <Button type='success' size='small'>
                <Icon name='arrow-right' />
              </Button>
            </Link>
          </div>
        )
      }
    ]
}

export default class CategoriesList extends Component {
  state = {
    categoryIDs: []
  }

  table = React.createRef()

  handleSelection = selection => {
    const newCategoryIDs = selection.map(category => category._id)
    this.setState({
      categoryIDs: newCategoryIDs
    })
  }

  render() {
    const { organizationId } = this.props
    const query = organizationId ? OrgCategoryQuery : CategoryQuery
    const queryName = organizationId
      ? 'fetchSkillCategoriesForOrganization'
      : 'fetchAllSkillCategories'
    const variables = organizationId ? { organizationId } : {}
    return (
      <Query
        query={query}
        variables={variables}
        fetchPolicy='cache-and-network'
      >
        {({ loading, error, data }) => {
          if (loading) return 'Loading...'
          if (error) return `Error! ${error.message}`

          const categoryData = data && data[queryName]
          const categoriesLeft =
            categoryData &&
            categoryData.filter(category => category.frameworkId === null)

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
                  {organizationId && (
                    <div>
                      <Mutation
                        mutation={disableSelectedCategoriesForOrganization}
                        refetchQueries={['fetchSkillCategoriesForOrganization']}
                      >
                        {(
                          disableSelectedCategoriesForOrganization,
                          { loading }
                        ) => {
                          if (loading) return <Loading fullscreen />
                          return (
                            <Button
                              style={{
                                marginRight: '15px'
                              }}
                              type='primary'
                              onClick={async e => {
                                const { categoryIDs } = this.state
                                e.preventDefault()
                                if (categoryIDs.length > 0) {
                                  try {
                                    await disableSelectedCategoriesForOrganization(
                                      {
                                        variables: {
                                          categoryIDs,
                                          organizationId
                                        }
                                      }
                                    )
                                    Message({
                                      type: 'success',
                                      message: 'Categories disabled'
                                    })
                                    this.table.current.clearSelection()
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
                        mutation={enableSelectedCategoriesForOrganization}
                        refetchQueries={['fetchSkillCategoriesForOrganization']}
                      >
                        {(
                          enableSelectedCategoriesForOrganization,
                          { loading }
                        ) => {
                          if (loading) return <Loading fullscreen />
                          return (
                            <Button
                              style={{
                                marginLeft: '0px',
                                marginRight: '15px'
                              }}
                              type='primary'
                              onClick={async e => {
                                const { categoryIDs } = this.state
                                e.preventDefault()
                                if (categoryIDs.length > 0) {
                                  try {
                                    await enableSelectedCategoriesForOrganization(
                                      {
                                        variables: {
                                          categoryIDs,
                                          organizationId
                                        }
                                      }
                                    )
                                    Message({
                                      type: 'success',
                                      message: 'Categories enabled'
                                    })
                                    this.table.current.clearSelection()
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
                    </div>
                  )}
                  <CategoriesAdd organizationId={organizationId} />
                  {categoriesLeft && (
                    <AddSkillsFramework organizationId={organizationId} />
                  )}
                </span>
              </Layout.Row>
              <Layout.Row>
                <Layout.Col span='24'>
                  <Table
                    ref={this.table}
                    labelWidth='120'
                    style={{ width: '100%' }}
                    columns={listColumns(organizationId)}
                    data={categoryData}
                    stripe
                    onSelectChange={selection =>
                      this.handleSelection(selection)
                    }
                    onSelectAll={selection => this.handleSelection(selection)}
                  />
                </Layout.Col>
              </Layout.Row>
            </React.Fragment>
          )
        }}
      </Query>
    )
  }
}
