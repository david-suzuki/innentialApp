import React, { Component } from 'react'
import {
  Layout,
  Table,
  Loading,
  Button,
  Message,
  Pagination,
  MessageBox
} from 'element-react'
import { localizedTime } from '../general/utilities'
import {
  fetchAllContentSources as SourcesQuery,
  fetchSourcesListLength,
  disableSelectedSources,
  enableSelectedSources,
  deleteContentSource,
  fetchAmountOfContentForSource
} from '../../api'
import SourcesAdd from './SourcesAdd'
import { Query, Mutation } from 'react-apollo'
import { Link } from 'react-router-dom'

const handleRemovingSource = (sourceId, deleteContentSource, contentLength) => {
  MessageBox.confirm(
    `This will permanently delete the file${
      contentLength > 0
        ? ' and ' +
          contentLength +
          ` learning content item${contentLength > 1 ? 's' : ''}`
        : ''
    }. Continue?`,
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  )
    .then(async () => {
      try {
        const { data } = await deleteContentSource({
          variables: { sourceId }
        })
        if (data.deleteContentSource !== 'OK') {
          Message({
            type: 'success',
            message: `Content source successfully deleted`
          })
        }
      } catch (err) {
        Message({
          type: 'error',
          message: `${err.message}`
        })
      }
    })
    .catch(() => {})
}

const listColumns = queryVariables => [
  {
    type: 'selection'
  },
  {
    label: 'Last updated',
    render: row => {
      return localizedTime(row.updatedAt)
    }
  },
  {
    label: 'Slug',
    prop: 'slug',
    sortable: true
  },
  {
    label: 'Name',
    prop: 'name',
    sortable: true
  },
  {
    label: 'URL',
    render: ({ baseUrls }) => {
      return baseUrls.map((baseUrl, i) => (
        <p key={`${baseUrl}:${i}`}>{baseUrl}</p>
      ))
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
    label: 'Operations',
    render: ({ _id }) => {
      // if (selectedRow._id === _id)
      return (
        <span>
          <Link to={`content-sources/${_id}/edit`}>
            <Button type='primary' size='small'>
              Edit
            </Button>
          </Link>
          <Mutation
            mutation={deleteContentSource}
            refetchQueries={[
              'fetchAllLearningContent',
              'fetchLikedContentForUser'
            ]}
            update={(cache, { data: { deleteContentSource } }) => {
              const queryObject = cache.readQuery({
                query: SourcesQuery,
                variables: queryVariables
              })
              const newContentSources = queryObject.fetchAllContentSources.filter(
                source => source._id !== deleteContentSource
              )
              cache.writeQuery({
                query: SourcesQuery,
                variables: queryVariables,
                data: { fetchAllContentSources: [...newContentSources] }
              })
            }}
          >
            {(deleteContentSource, { loading }) => {
              if (loading) return <Loading />
              return (
                <Query
                  query={fetchAmountOfContentForSource}
                  variables={{
                    source: _id
                  }}
                >
                  {({ data }) => {
                    if (data)
                      return (
                        <Button
                          type='danger'
                          size='small'
                          style={{ marginLeft: 10 }}
                          onClick={async e => {
                            e.preventDefault()
                            handleRemovingSource(
                              _id,
                              deleteContentSource,
                              data.fetchAmountOfContentForSource
                            )
                          }}
                        >
                          Delete
                        </Button>
                      )
                    else return null
                  }}
                </Query>
              )
            }}
          </Mutation>
        </span>
      )
      // else return <div/>
    }
  }
]

export default class SourcesList extends Component {
  state = {
    pageSize: 20,
    page: 1,
    sourceIDs: []
    // selectedRow: {}
  }

  table = React.createRef()

  handleChangingSize = pageSize => {
    this.setState({ pageSize })
  }

  handleChangingPage = page => {
    this.setState({ page })
  }

  handleSelection = selection => {
    const newsourceIDs = selection.map(source => source._id)
    this.setState({
      sourceIDs: newsourceIDs
    })
  }

  // handleHover = row => {
  //   this.setState({
  //     selectedRow: row
  //   })
  // }

  render() {
    const { pageSize, page /*, selectedRow */ } = this.state
    const queryVariables = { limit: pageSize, offset: page }
    return (
      <React.Fragment>
        <Layout.Row>
          <span
            style={{ display: 'flex', marginBottom: '20px', float: 'left' }}
          >
            <Mutation
              mutation={disableSelectedSources}
              refetchQueries={['fetchAllContentSources']}
            >
              {(disableSelectedSources, { loading }) => {
                if (loading) return <Loading fullscreen />
                return (
                  <Button
                    style={{
                      marginRight: '15px'
                    }}
                    type='primary'
                    onClick={async e => {
                      const { sourceIDs } = this.state
                      e.preventDefault()
                      if (sourceIDs.length > 0) {
                        try {
                          await disableSelectedSources({
                            variables: { sourceIDs }
                          })
                          Message({
                            type: 'success',
                            message: 'Sources disabled'
                          })
                          this.table.current.clearSelection()
                        } catch (e) {
                          Message({
                            type: 'error',
                            message: `${e.graphQLErrors[0].message}`
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
              mutation={enableSelectedSources}
              refetchQueries={['fetchAllContentSources']}
            >
              {(enableSelectedSources, { loading }) => {
                if (loading) return <Loading fullscreen />
                return (
                  <Button
                    style={{
                      marginLeft: '0px',
                      marginRight: '15px'
                    }}
                    type='primary'
                    onClick={async e => {
                      const { sourceIDs } = this.state
                      e.preventDefault()
                      if (sourceIDs.length > 0) {
                        try {
                          await enableSelectedSources({
                            variables: { sourceIDs }
                          })
                          Message({
                            type: 'success',
                            message: 'Sources enabled'
                          })
                          this.table.current.clearSelection()
                        } catch (e) {
                          Message({
                            type: 'error',
                            message: `${e.graphQLErrors[0].message}`
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
            <SourcesAdd />
            <Query query={fetchSourcesListLength}>
              {({ loading, data }) => {
                if (loading) return <Loading />
                return (
                  <Pagination
                    total={data && data.fetchSourcesListLength}
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
          </span>
        </Layout.Row>
        <Layout.Row>
          <Layout.Col span='24'>
            <Query query={SourcesQuery} variables={queryVariables}>
              {({ loading, error, data }) => {
                if (loading) return <Loading />
                if (error) return `Error! ${error.message}`
                return (
                  <div>
                    <Table
                      ref={this.table}
                      labelWidth='120'
                      style={{ width: '100%' }}
                      columns={listColumns(queryVariables /*, selectedRow */)}
                      data={data.fetchAllContentSources}
                      stripe
                      onSelectChange={selection =>
                        this.handleSelection(selection)
                      }
                      onSelectAll={selection => this.handleSelection(selection)}
                      // onCellMouseEnter={row => this.handleHover(row)}
                    />
                  </div>
                )
              }}
            </Query>
          </Layout.Col>
        </Layout.Row>
      </React.Fragment>
    )
  }
}
