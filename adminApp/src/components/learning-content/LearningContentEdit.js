import React from 'react'
import { Layout } from 'element-react'
import { LearningContentUrlAdd, LearningContentFileAdd } from './'
import { fetchLearningContentEditForm } from '../../api'
import { withRouter } from 'react-router-dom'
import { Query } from 'react-apollo'

const LearningContentEdit = ({ match, history }) => {
  const learningContentId =
    match && match.params && match.params.learningContentId
  return (
    <Layout.Row>
      <Layout.Col span='24'>
        <span>
          <div style={{ fontSize: '16px', marginBottom: '20px' }}>
            {'Edit your learning content'}
          </div>
          <Query
            query={fetchLearningContentEditForm}
            variables={{
              learningContentId
            }}
          >
            {({ loading, error, data }) => {
              if (loading) return 'Loading...'
              if (error) return `Error! ${error.message}`

              const learningContentData =
                data && data.fetchLearningContentEditForm

              const learningContentFormData = {
                ...learningContentData,
                publishedDate: learningContentData.publishedDate || null
              }

              const initialUrl = learningContentFormData.url
                ? learningContentFormData.url.slice()
                : null

              const isNotFile = !!initialUrl === !!learningContentFormData

              return isNotFile ? (
                <LearningContentUrlAdd
                  initialFormValues={learningContentFormData}
                  learningContentId={learningContentId}
                  goBack={history.goBack}
                />
              ) : (
                <LearningContentFileAdd
                  initialFormValues={learningContentFormData}
                  learningContentId={learningContentId}
                  goBack={history.goBack}
                  editing
                />
              )
            }}
          </Query>
        </span>
      </Layout.Col>
    </Layout.Row>
  )
}

export default withRouter(LearningContentEdit)
