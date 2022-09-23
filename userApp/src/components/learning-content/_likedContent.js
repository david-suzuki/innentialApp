import React, { useEffect } from 'react'
import {
  fetchLikedContentForUser,
  dislikeContent,
  addContentToActiveGoal
} from '../../api'
import { Statement } from '../ui-components'
import { Query, Mutation, useMutation } from 'react-apollo'
import LikedContentList from './LikedContentList'
import { captureFilteredError, LoadingSpinner } from '../general'
import Container from '../../globalState'

export default ({ neededWorkSkills, canRecommend }) => {
  const container = Container.useContainer()

  const [addToGoalMutation] = useMutation(addContentToActiveGoal)

  return (
    <Mutation
      mutation={dislikeContent}
      refetchQueries={[
        'fetchLikedContentForUser',
        'fetchRelevantContentForUser',
        'fetchSharedInTeamContent',
        'fetchSharedByMeContent',
        'fetchDislikedContentForUser'
      ]}
    >
      {dislikeContent => (
        <Query query={fetchLikedContentForUser} fetchPolicy='cache-and-network'>
          {({ loading, error, data }) => {
            if (loading) return <LoadingSpinner />
            if (error) captureFilteredError(error)

            const likedContent = data && data.fetchLikedContentForUser
            if (likedContent.length > 0) {
              return (
                <LikedContentList
                  relevantContent={likedContent}
                  dislikeContent={dislikeContent}
                  addToGoalMutation={addToGoalMutation}
                  neededWorkSkills={neededWorkSkills}
                  canRecommend={canRecommend}
                  container={container}
                />
              )
            } else return <Statement content='No learning items to display' />
          }}
        </Query>
      )}
    </Mutation>
  )
}
