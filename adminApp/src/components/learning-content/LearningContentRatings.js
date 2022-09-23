import React, { Component } from 'react'
import { Layout, Table, Button, Pagination } from 'element-react'
import { withRouter } from 'react-router-dom'
import { LearningContentDetails } from './components'
import { localizedTime } from '../general/utilities'
import { fetchAllRatedLearningContent } from '../../api'
import { Query } from 'react-apollo'

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
    label: 'Rating (avg.)',
    prop: 'averageRating',
    render: data => {
      return data.averageRating.toFixed(2)
    },
    sortable: true
  }
]

class LearningContentRatings extends Component {
  constructor(props) {
    super(props)

    this.state = {
      pageSize: 20,
      page: 1,
      filter: '',
      source: ''
    }
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
    const queryVariables = { filter, source, limit: pageSize, offset: page }

    return (
      <>
        <Button
          type='primary'
          onClick={e => {
            e.preventDefault()
            this.props.history.goBack()
          }}
        >
          Go back
        </Button>
        <React.Fragment>
          <Layout.Row>
            <Layout.Col span='10'>
              <Query
                query={fetchAllRatedLearningContent}
                variables={{ filter, source }}
              >
                {({ data }) => {
                  return (
                    <Pagination
                      total={data && data.fetchAllRatedLearningContent.length}
                      layout='sizes, prev, pager, next'
                      pageSizes={[20, 50, 100, 200]}
                      pageSize={pageSize}
                      currentPage={page}
                      onSizeChange={pageSize =>
                        this.handleChangingSize(pageSize)
                      }
                      onCurrentChange={page => this.handleChangingPage(page)}
                    />
                  )
                }}
              </Query>
            </Layout.Col>
          </Layout.Row>
          <Layout.Row>
            <Layout.Col span='24'>
              <Query
                query={fetchAllRatedLearningContent}
                variables={queryVariables}
              >
                {({ error, loading, data }) => {
                  if (loading) return 'Loading...'
                  if (error) return `Error! ${error.message}`

                  const allLearningContent =
                    data && data.fetchAllRatedLearningContent

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
      </>
    )
  }
}

export default withRouter(LearningContentRatings)
