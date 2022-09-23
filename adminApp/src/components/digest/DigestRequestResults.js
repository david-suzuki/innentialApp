import React from 'react'
import { Layout, Table, Button, Icon, Message, MessageBox } from 'element-react'
import {
  fetchRelevantLearningContent as RelevantContentQuery,
  deleteLearningContent
} from '../../api'
import { Query, Mutation } from 'react-apollo'
import { localizedTime } from '../general/utilities'
import { LearningContentDetails } from '../learning-content/components'
import { Link } from 'react-router-dom'

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
    label: 'Added to Database',
    render: row => {
      return localizedTime(row.createdAt)
    }
  },
  {
    label: 'Type',
    prop: 'type',
    sortable: true
  },
  {
    label: 'Title',
    prop: 'title',
    sortable: true
  },
  {
    label: 'Relevance Rating',
    render: row => {
      return Math.round(row.relevanceRating * 100) / 100
    }
  },
  {
    label: 'Operations',
    render: ({ _id }) => {
      return (
        <Mutation
          mutation={deleteLearningContent}
          update={(cache, { data: { deleteLearningContent } }) => {
            const { fetchRelevantLearningContent } = cache.readQuery({
              query: RelevantContentQuery,
              variables: queryVariables
            })
            const newLearningContents = fetchRelevantLearningContent.filter(
              content => content._id !== deleteLearningContent
            )
            cache.writeQuery({
              query: RelevantContentQuery,
              data: { fetchRelevantLearningContent: [...newLearningContents] },
              variables: queryVariables
            })
          }}
          refetchQueries={['fetchAllLearningContent']}
        >
          {deleteLearningContent => (
            <span
              style={{
                display: 'flex',
                justifyContent: 'left'
              }}
            >
              <Button
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

const DigestRequestResults = ({ queryVariables }) => {
  return (
    <Query query={RelevantContentQuery} variables={queryVariables}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...'
        if (error) return `Error! ${error.message}`
        return (
          <Layout.Row>
            <Layout.Col span='24'>
              <Table
                style={{ width: '100%' }}
                columns={listColumns(queryVariables)}
                data={data.fetchRelevantLearningContent}
                stripe
                emptyText='No Learning Content Available'
              />
            </Layout.Col>
          </Layout.Row>
        )
      }}
    </Query>
  )
}

export default DigestRequestResults
