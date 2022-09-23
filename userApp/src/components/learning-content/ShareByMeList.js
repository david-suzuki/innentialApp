import React, { Component } from 'react'
import { Query, Mutation, useMutation } from 'react-apollo'
import {
  fetchSharedByMeContent,
  markContentAsViewed,
  likeContent,
  dislikeContent,
  addContentToActiveGoal
} from '../../api'
import { LoadingSpinner, captureFilteredError } from '../general'
import {
  Statement,
  LearningItems,
  remapLearningContentForUI
} from '../ui-components'
import { Notification } from 'element-react'
import Container from '../../globalState'
import { getOptions } from './utils/_getOptions'

class MyList extends Component {
  handleLikingContent = async (likeContent, learningContentId) => {
    try {
      await likeContent({
        variables: { learningContentId }
      }).then(() => {
        Notification({
          type: 'success',
          message: `The item has been saved in your private list`,
          duration: 2500,
          offset: 90
        })
      })
    } catch (e) {
      captureFilteredError(e)
      Notification({
        type: 'error',
        message: `Oops, something went wrong!`,
        duration: 2500,
        offset: 90,
        iconClass: 'el-icon-error'
      })
    }
  }

  handleDislikingContent = async (dislikeContent, learningContentId) => {
    try {
      await dislikeContent({
        variables: { learningContentId }
      }).then(() => {
        Notification({
          type: 'success',
          message: `The item has been disliked`,
          duration: 2500,
          offset: 90
        })
      })
    } catch (e) {
      captureFilteredError(e)
      Notification({
        type: 'error',
        message: `Oops, something went wrong!`,
        duration: 2500,
        iconClass: 'el-icon-error'
      })
    }
  }

  handleClickingContent = async (markContentAsViewed, learningContentId) => {
    await markContentAsViewed({
      variables: { learningContentId }
    })
  }

  handleAddingToGoal = async variables => {
    try {
      const {
        data: { addContentToActiveGoal: result }
      } = await this.props.addToGoalMutation({
        variables
      })
      if (result !== null) {
        Notification({
          type: 'success',
          message: `Item added to development plan`,
          duration: 2500,
          offset: 90
        })
      } else {
        Notification({
          type: 'error',
          message: `Oops, something went wrong!`,
          duration: 2500,
          iconClass: 'el-icon-error'
        })
      }
    } catch (e) {
      captureFilteredError(e)
      Notification({
        type: 'error',
        message: `Oops, something went wrong!`,
        duration: 2500,
        iconClass: 'el-icon-error'
      })
    }
  }

  render() {
    const {
      mySharedContent,
      neededWorkSkills,
      likeContent,
      dislikeContent,
      container,
      canRecommend
    } = this.props
    if (mySharedContent && mySharedContent.length === 0) {
      return <Statement content='No items to display' />
    } else {
      const remappedContent = mySharedContent.map(content => {
        const options = getOptions({
          content,
          container,
          canRecommend,
          handleLikingContent: contentId =>
            this.handleLikingContent(likeContent, contentId),
          handleDislikingContent: contentId =>
            this.handleDislikingContent(dislikeContent, contentId),
          handleAddingToGoal: this.handleAddingToGoal
        })
        return {
          ...remapLearningContentForUI({
            content,
            neededWorkSkills,
            options,
            shareInfo: { sharedIn: content.sharedIn }
          })
        }
      })
      return (
        <Mutation mutation={markContentAsViewed}>
          {markContentAsViewed => (
            <LearningItems
              items={remappedContent}
              onLinkClick={learningContentId =>
                this.handleClickingContent(
                  markContentAsViewed,
                  learningContentId
                )
              }
            />
          )}
        </Mutation>
      )
    }
  }
}

const refetchQueries = [
  'fetchLikedContentForUser',
  'fetchRelevantContentForUser',
  'fetchSharedInTeamContent',
  'fetchSharedByMeContent',
  'fetchDislikedContentForUser'
]

export default ({ neededWorkSkills, usersTeams, canRecommend }) => {
  const container = Container.useContainer()
  const [addToGoalMutation] = useMutation(addContentToActiveGoal)
  return (
    <Query query={fetchSharedByMeContent} fetchPolicy='cache-and-network'>
      {({ data, loading, error }) => {
        if (loading) return <LoadingSpinner />
        if (error) {
          captureFilteredError(error)
          return null
        }
        if (data) {
          const content = data.fetchSharedByMeContent
          return (
            <Mutation mutation={likeContent} refetchQueries={refetchQueries}>
              {likeContent => {
                return (
                  <Mutation
                    mutation={dislikeContent}
                    refetchQueries={refetchQueries}
                  >
                    {dislikeContent => {
                      return (
                        <MyList
                          mySharedContent={content}
                          neededWorkSkills={neededWorkSkills}
                          usersTeams={usersTeams}
                          likeContent={likeContent}
                          dislikeContent={dislikeContent}
                          container={container}
                          canRecommend={canRecommend}
                          addToGoalMutation={addToGoalMutation}
                        />
                      )
                    }}
                  </Mutation>
                )
              }}
            </Mutation>
          )
        }
        return null
      }}
    </Query>
  )
}
