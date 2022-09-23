import React from 'react'
import { updateLearningPreferences } from '../api'
import { Mutation } from 'react-apollo'
import { captureFilteredError } from '../components/general'

class Mutator extends React.Component {
  componentDidMount() {
    this.props.mutation()
  }

  render() {
    const { error } = this.props.mutationProps
    if (error) captureFilteredError(error)
    return null
  }
}
// [], 'DATE'
const ResetLearningPreferences = () => {
  return (
    <Mutation
      mutation={updateLearningPreferences}
      variables={{ sortMethod: 'RELEVANCE', price: [], types: [] }}
      refetchQueries={[
        'currentUserPreferredTypes',
        'fetchLikedContentForUser',
        'fetchDislikedContentForUser',
        'fetchRelevantContentForUser'
      ]}
    >
      {(mutation, mutationProps) => (
        <Mutator mutation={mutation} mutationProps={mutationProps} />
      )}
    </Mutation>
  )
}

export default ResetLearningPreferences

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
