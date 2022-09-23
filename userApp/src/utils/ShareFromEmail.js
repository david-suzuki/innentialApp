import React from 'react'
import { Query } from 'react-apollo'
import Container from '../globalState'
import { withRouter, Redirect } from 'react-router-dom'
import { fetchLearningContent } from '../api'
import { Notification } from 'element-react'
import { LoadingSpinner, SentryDispatch } from '../components/general'

const Redirector = ({ contentId, contentLabel }) => {
  const container = Container.useContainer()
  container.setSharingContent(true)
  container.setSharedContent({
    contentId,
    contentLabel
  })
  return <Redirect to={{ pathname: '/learning' }} />
}
const shareContent = ({ match, history }) => {
  const contentId = match && match.params && match.params.contentId

  return (
    <Query
      query={fetchLearningContent}
      variables={{ learningContentId: contentId }}
    >
      {({ data, loading, error }) => {
        if (loading) {
          return <LoadingSpinner />
        }
        if (error) {
          Notification({
            type: 'error',
            message: 'Something went wrong trying to share item',
            duration: 1500
          })
          return <SentryDispatch error={error} />
        }
        if (data) {
          const res = data.fetchLearningContent
          if (res) {
            return <Redirector contentId={contentId} contentLabel={res.title} />
          } else {
            return <Redirect to={{ pathname: '/learning' }} />
          }
        }
        return null
      }}
    </Query>
  )
}

export default withRouter(shareContent)
