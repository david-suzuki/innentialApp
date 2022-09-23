import React, { Component } from 'react'
import {
  Layout,
  Table,
  Button,
  MessageBox,
  Message,
  Icon,
  Pagination,
  Select
} from 'element-react'
import { Link } from 'react-router-dom'
import {
  LearningContentDetails
  // ContentSourceSelector
} from '../learning-content/components'
import { localizedTime } from '../general/utilities'
import {
  deleteLearningContent,
  fetchOrganizationSpecificContent as ContentQuery,
  fetchOrganizationContentListLength
} from '../../api'
import { Query, Mutation } from 'react-apollo'

const selectOptions = [
  {
    value: 'ARTICLE',
    label: 'Article'
  },
  {
    value: 'E-LEARNING',
    label: 'E-Learning'
  },
  {
    value: 'BOOK',
    label: 'Book'
  },
  {
    value: 'TOOL',
    label: 'Tool'
  },
  {
    value: 'EVENT',
    label: 'Event'
  }
]

const handleRemovingContent = (learningContentId, deleteLearningContent) => {
  MessageBox.confirm(
    'This will permanently delete the file. Continue?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  )
    .then(async () => {
      await deleteLearningContent({
        variables: {
          learningContentId
        }
      })
      Message({
        type: 'success',
        message: 'Delete completed!'
      })
    })
    .catch(() => {
      Message({
        type: 'info',
        message: 'Delete canceled'
      })
    })
}

const listColumns = [
  {
    type: 'expand',
    expandPannel: data => {
      return <LearningContentDetails data={data} />
    }
  },
  {
    label: 'Date',
    render: row => {
      return localizedTime(row.createdAt)
    },
    sortable: true,
    width: 200
  },
  {
    label: 'Type',
    prop: 'type',
    sortable: true,
    width: 130
  },
  {
    label: 'Title',
    prop: 'title',
    sortable: true
  },
  {
    label: 'Author',
    prop: 'author'
  },
  {
    label: 'Operations',
    width: 120,
    render: ({ _id }) => {
      return (
        <Mutation
          mutation={deleteLearningContent}
          refetchQueries={['fetchOrganizationSpecificContent']}
        >
          {deleteLearningContent => (
            <span
              style={{
                display: 'flex',
                justifyContent: 'center',
                verticalAlign: 'middle'
              }}
            >
              <Button
                style={{
                  marginTop: '20px',
                  marginBottom: '20px',
                  marginRight: '15px'
                }}
                type='danger'
                size='small'
                onClick={async () =>
                  handleRemovingContent(_id, deleteLearningContent)
                }
              >
                Delete
              </Button>
              <Link
                to={{
                  pathname: `/learning-content/${_id}/edit`
                }}
              >
                <Button
                  type='success'
                  size='small'
                  style={{
                    marginTop: '20px',
                    marginBottom: '20px',
                    marginRight: '15px'
                  }}
                >
                  <Icon name='arrow-right' />
                </Button>
              </Link>
            </span>
          )}
        </Mutation>
      )
    }
  }
]

export default class OrganizationContent extends Component {
  state = {
    pageSize: 20,
    page: 1,
    filter: '',
    source: ''
  }

  handleChangingSize = pageSize => {
    this.setState({ pageSize })
  }

  handleChangingPage = page => {
    this.setState({ page })
  }

  onChangeContentSource = value => {
    if (value._id) {
      this.setState({ source: value._id })
    } else {
      this.setState({ source: '' })
    }
  }

  render() {
    const { pageSize, page, filter, source } = this.state
    const { organizationId } = this.props
    return (
      <React.Fragment>
        <Layout.Row>
          <Layout.Col span='24'>
            <div>
              <span
                style={{
                  display: 'flex',
                  justifyContent: 'left',
                  verticalAlign: 'middle'
                }}
              >
                <div>
                  <h6 style={{ marginBottom: '5px' }}>Type of content</h6>
                  <Select
                    placeholder='Select type of content'
                    value={filter}
                    onChange={value => {
                      this.setState({ filter: value })
                    }}
                    clearable
                  >
                    {selectOptions.map(el => {
                      return (
                        <Select.Option
                          key={el.value}
                          label={el.label}
                          value={el.value}
                        />
                      )
                    })}
                  </Select>
                </div>
                {/* <div>
                  <h6 style={{ marginBottom: '5px' }}>Source of content</h6>
                  <ContentSourceSelector
                    contentSource={source}
                    onChangeContentSource={this.onChangeContentSource}
                  />
                </div> */}
                <Query
                  query={fetchOrganizationContentListLength}
                  variables={{ organizationId, filter, source }}
                >
                  {({ data }) => {
                    const contentLength =
                      data && data.fetchOrganizationContentListLength
                    if (contentLength > 20)
                      return (
                        <Pagination
                          total={contentLength}
                          layout='sizes, prev, pager, next'
                          pageSizes={[20, 50, 100, 200]}
                          pageSize={pageSize}
                          currentPage={page}
                          onSizeChange={pageSize =>
                            this.handleChangingSize(pageSize)
                          }
                          onCurrentChange={page =>
                            this.handleChangingPage(page)
                          }
                        />
                      )
                    else return <div />
                  }}
                </Query>
              </span>
            </div>
            <Query
              query={ContentQuery}
              variables={{
                organizationId,
                filter,
                source,
                limit: pageSize,
                offset: page
              }}
              fetchPolicy='cache-and-network'
            >
              {({ error, loading, data }) => {
                if (loading) return 'Loading...'
                if (error) return `Error! ${error.message}`

                const organizationContent =
                  data && data.fetchOrganizationSpecificContent
                return (
                  <Table
                    style={{ width: '100%' }}
                    columns={listColumns}
                    data={organizationContent}
                    stripe
                  />
                )
              }}
            </Query>
          </Layout.Col>
        </Layout.Row>
        <style jsx global>{`
          .el-tabs__content {
            overflow: visible;
          }
          .el-card {
            overflow: visible;
          }
          div {
            overflow: visible;
          }
        `}</style>
      </React.Fragment>
    )
  }
}
