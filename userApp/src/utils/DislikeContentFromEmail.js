import React from 'react'
import { dislikeContent } from '../api'
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
      if (data.dislikeContent === 'OK') {
        Notification({
          type: 'info',
          message: `The item is already on your disliked list`,
          iconClass: 'el-icon-info',
          duration: 2500,
          offset: 90
        })
      } else {
        Notification({
          type: 'success',
          message: `The item has been added to your disliked list`,
          duration: 2500,
          offset: 90
        })
      }
      return (
        <>
          <ResetLearningPreferences />
          <Redirect
            to={{
              pathname: '/learning?tab=myLearning',
              state: { goToTab: 'Disliked' }
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
      mutation={dislikeContent}
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
