import React from 'react'
import {
  fetchTeamLearningContent,
  deleteTeamLearningContent
} from '../../../../api'
import { AddTeamContentForm } from './'
import { localizedTime } from '../../../general/utilities'
import { Query, Mutation } from 'react-apollo'
import { Layout, Table, Message, MessageBox, Button } from 'element-react'

const handleRemovingContent = (contentId, deleteTeamLearningContent) => {
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
      await deleteTeamLearningContent({
        variables: {
          contentId
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
    label: 'Date',
    render: row => {
      return localizedTime(row.createdAt)
    }
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
    label: 'URL',
    render: row => {
      return <a href={row.pdfSource}>{row.pdfSource}</a>
    }
  },
  {
    label: 'Key Area of Performance',
    prop: 'relatedPerformanceArea'
  },
  {
    label: 'Operations',
    width: 120,
    render: ({ _id }) => {
      return (
        <Mutation
          mutation={deleteTeamLearningContent}
          refetchQueries={['fetchTeamLearningContent']}
        >
          {deleteTeamLearningContent => (
            <Button
              type='danger'
              size='small'
              onClick={async () =>
                handleRemovingContent(_id, deleteTeamLearningContent)
              }
            >
              Delete
            </Button>
          )}
        </Mutation>
      )
    }
  }
]

const TeamContentPage = () => {
  return (
    <React.Fragment>
      <Layout.Row>
        <Layout.Col span='24'>
          <AddTeamContentForm />
          <Query query={fetchTeamLearningContent}>
            {({ loading, error, data }) => {
              if (loading) return 'Loading...'
              if (error) return `Error! ${error.message}`
              return (
                <Table
                  style={{ width: '100%' }}
                  columns={listColumns}
                  data={data.fetchTeamLearningContent}
                  stripe
                />
              )
            }}
          </Query>
        </Layout.Col>
      </Layout.Row>
    </React.Fragment>
  )
}

export default TeamContentPage
