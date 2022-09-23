import React from 'react'
import SourcesForm from './SourcesForm'
import { Query, Mutation } from 'react-apollo'
import { Loading } from 'element-react'
import { editContentSource, fetchSourceEditForm } from '../../api'
import IconUpload from './utils/IconUpload'
import { withRouter } from 'react-router-dom'

const SourceEdit = ({ match, history }) => {
  const sourceId = match && match.params && match.params.sourceId
  return (
    <Query query={fetchSourceEditForm} variables={{ sourceId }}>
      {({ loading, data, error }) => {
        if (loading) return <Loading />
        if (error) return <p>Error!</p>

        const sourceData = data && data.fetchSourceEditForm
        return (
          <div>
            <div>
              <Mutation
                mutation={editContentSource}
                refetchQueries={[
                  'fetchAllContentSources',
                  'fetchSourceEditForm'
                ]}
              >
                {editContentSource => (
                  <SourcesForm
                    sourceId={sourceId}
                    initialValues={sourceData}
                    mutation={editContentSource}
                    goBack={history.goBack}
                  />
                )}
              </Mutation>
            </div>
            <div>
              <IconUpload
                sourceId={sourceId}
                iconSource={sourceData.iconSource}
              />
            </div>
          </div>
        )
      }}
    </Query>
  )
}

export default withRouter(SourceEdit)
