import React from 'react'
import { likeContent } from '../api'
import { Mutation } from 'react-apollo'
import { Redirect, withRouter } from 'react-router-dom'
import { SentryDispatch, LoadingSpinner } from '../components/general'
import { Notification } from 'element-react'
import { ResetLearningPreferences } from './'

class Mutator extends React.Component {
  componentDidMount() {
    this.props.mutation()
  }

  render() {
    const { error, loading, data } = this.props.mutationProps

    if (error) return <SentryDispatch error={error} />
    if (loading) return <LoadingSpinner />
    if (data) {
      if (data.likeContent === 'OK') {
        Notification({
          type: 'info',
          message: `The item is already on your liked list`,
          iconClass: 'el-icon-info',
          duration: 2500,
          offset: 90
        })
      } else if (data.likeContent !== null) {
        Notification({
          type: 'success',
          message: `The item has been added to your liked list`,
          duration: 2500,
          offset: 90
        })
      } else {
        Notification({
          type: 'warning',
          message: `Content could not be found`,
          duration: 2500,
          offset: 90
        })
      }
      return (
        <>
          <ResetLearningPreferences />
          <Redirect
            to={{
              pathname: '/learning?tab=myContent',
              state: { goToTab: 'Liked' }
            }}
            exact
          />
        </>
      )
    }
    return null
  }
}
// [], 'DATE'
const ContentWrapper = ({
  match: {
    params: { learningContentId }
  }
}) => {
  return (
    <Mutation
      mutation={likeContent}
      variables={{ learningContentId }}
      refetchQueries={[
        'fetchLikedContentForUser',
        'fetchRelevantContentForUser',
        'fetchSharedInTeamContent',
        'fetchSharedByMeContent'
      ]}
    >
      {(mutation, mutationProps) => (
        <Mutator mutation={mutation} mutationProps={mutationProps} />
      )}
    </Mutation>
  )
}

export default withRouter(ContentWrapper)

// <ApolloConsumer>
//       {client => {
//         client.mutate({
//           mutation: updateLearningPreferences,
//           variables: {
//             sortMethod: 'DATE'
//           },
//           refetchQueries: ['currentUserPreferredTypes', 'fetchRelevantContentForUser']
//         }).then(res => console.log(res))
//           .catch(e => console.log(e))

//         return <Redirect to={{ pathname: '/', state: { activeName: 'Content' } }} exact />
//       }}
//     </ApolloConsumer>
