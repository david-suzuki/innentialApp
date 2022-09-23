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
import { Link, Route } from 'react-router-dom'
import {
  LearningContentDetails,
  DeleteSpider,
  ContentSourceSelector
} from './components'
import { LearningContentRatings, LearningContentForm } from './'

import { localizedTime } from '../general/utilities'
import {
  fetchAllLearningContent,
  deleteLearningContent,
  fetchAllLearningContent as ContentQuery,
  fetchLearningContentListLength,
  cleanupDeadContent,
  fetchLearningContentRating
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

const listColumns = queryVariables => [
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
          refetchQueries={[
            // 'fetchAllLearningContent',
            'fetchLikedContentForUser'
          ]}
          update={(cache, { data: { deleteLearningContent } }) => {
            const queryObject = cache.readQuery({
              query: ContentQuery,
              variables: queryVariables
            })
            const newLearningContents = queryObject.fetchAllLearningContent.filter(
              content => content._id !== deleteLearningContent
            )
            cache.writeQuery({
              query: ContentQuery,
              variables: queryVariables,
              data: { fetchAllLearningContent: [...newLearningContents] }
            })
          }}
        >
          {deleteLearningContent => (
            <span
              style={{
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <Button
                style={{ marginTop: '25%' }}
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
                style={{ marginTop: '25%', marginLeft: '5px' }}
              >
                <Button type='success' size='small'>
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

export default class LearningContentList extends Component {
  state = {
    pageSize: 20,
    page: 1,
    filter: '',
    source: ''
    // buttonDisabled: false
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

  handleCleaningContent = (cleanupDeadContent, source) => {
    if (source && source.length === 24) {
      MessageBox.confirm(
        'This will mark the content for cleanup. Irresponsive content will be deleted from the platform. Continue?',
        'Warning',
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      )
        .then(async () => {
          const {
            data: { cleanupDeadContent: response }
          } = await cleanupDeadContent({
            variables: {
              source
            }
          })
          const nUpdated = parseInt(response)
          if (!isNaN(nUpdated)) {
            if (nUpdated > 0) {
              Message({
                type: 'success',
                message: `Marked ${nUpdated} items for cleanup`
              })
            } else {
              Message({
                type: 'info',
                message: 'No items updated. Perhaps a cleanup has ran recently'
              })
            }
          } else {
            Message({
              type: 'error',
              message: response
            })
          }
        })
        .catch(() => {})
    } else {
      Message({
        type: 'warning',
        message: 'Please provide a source of the content'
      })
    }
  }

  render() {
    const { pageSize, page, filter, source } = this.state
    const queryVariables = { filter, source, limit: pageSize, offset: page }
    return (
      <React.Fragment>
        <Route
          exact
          path='/learning-content/add'
          component={LearningContentForm}
        />
        <Layout.Row>
          <Layout.Col span='5'>
            <Link
              className='button'
              to={{
                pathname: '/learning-content/add'
              }}
            >
              <Button type='primary'>Add new Learning Content</Button>
            </Link>
          </Layout.Col>
          <Layout.Col span='5'>
            <Mutation mutation={cleanupDeadContent}>
              {cleanupDeadContent => (
                <Button
                  type='primary'
                  // disabled={buttonDisabled}
                  onClick={() =>
                    this.handleCleaningContent(cleanupDeadContent, source)
                  }
                >
                  Mark source for clean-up
                </Button>
              )}
            </Mutation>
          </Layout.Col>
          <Layout.Col span='5'>
            <DeleteSpider query={ContentQuery} />
          </Layout.Col>
          <Layout.Col span='5'>
            <Link
              className='button'
              to={{
                pathname: '/learning-content/rated'
              }}
            >
              <Button type='primary'>See Learning Content Ratings</Button>
            </Link>
          </Layout.Col>
        </Layout.Row>
        <Layout.Row>
          <Layout.Col span='5'>
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
          </Layout.Col>
          <Layout.Col span='5'>
            <h6 style={{ marginBottom: '5px' }}>Source of content</h6>
            <ContentSourceSelector
              contentSource={source}
              onChangeContentSource={this.onChangeContentSource}
            />
          </Layout.Col>
          <Layout.Col span='10'>
            <Query
              query={fetchLearningContentListLength}
              variables={{ filter, source }}
            >
              {({ data }) => {
                return (
                  <Pagination
                    total={data && data.fetchLearningContentListLength}
                    layout='sizes, prev, pager, next'
                    pageSizes={[20, 50, 100, 200]}
                    pageSize={pageSize}
                    currentPage={page}
                    onSizeChange={pageSize => this.handleChangingSize(pageSize)}
                    onCurrentChange={page => this.handleChangingPage(page)}
                  />
                )
              }}
            </Query>
          </Layout.Col>
        </Layout.Row>
        <Layout.Row>
          <Layout.Col span='24'>
            <Query query={fetchAllLearningContent} variables={queryVariables}>
              {({ error, loading, data }) => {
                if (loading) return 'Loading...'
                if (error) return `Error! ${error.message}`

                const allLearningContent = data && data.fetchAllLearningContent
                return (
                  <Table
                    style={{ width: '100%' }}
                    columns={listColumns(queryVariables)}
                    data={allLearningContent}
                    stripe
                  />
                )
              }}
            </Query>
          </Layout.Col>
        </Layout.Row>
        <style jsx global>{`
          .el-button {
            margin-bottom: 20px;
            margin-right: 15px;
          }
          span {
            vertical-align: middle;
          }
        `}</style>
      </React.Fragment>
    )
  }
}
