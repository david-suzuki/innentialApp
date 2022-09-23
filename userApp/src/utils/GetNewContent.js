import React from 'react'
import { updateLearningPreferences } from '../api'
import { Mutation } from 'react-apollo'
import { Redirect } from 'react-router-dom'
import { SentryDispatch, LoadingSpinner } from '../components/general'

class Mutator extends React.Component {
  componentDidMount() {
    this.props.mutation()
  }

  render() {
    const { error, loading, data } = this.props.mutationProps

    if (error) return <SentryDispatch error={error} />
    if (loading) return <LoadingSpinner />
    if (data) {
      if (data.updateLearningPreferences === 'Success')
        return <Redirect to={{ pathname: '/learning' }} exact />
      else {
        return (
          <SentryDispatch error='Something unexpected happened during new content link' />
        )
      }
    }
    return null
  }
}
// [], 'DATE'
const ContentWrapper = () => {
  return (
    <Mutation
      mutation={updateLearningPreferences}
      variables={{ sortMethod: 'DATE', price: [] }}
      refetchQueries={[
        'currentUserPreferredTypes',
        'fetchRelevantContentForUser'
      ]}
    >
      {(mutation, mutationProps) => (
        <Mutator mutation={mutation} mutationProps={mutationProps} />
      )}
    </Mutation>
  )
}

export default ContentWrapper

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
