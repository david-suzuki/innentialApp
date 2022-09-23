import React, { Component } from 'react'
import {
  Statement,
  remapLearningContentForUI,
  LearningItems
} from '../ui-components'
import { Notification, MessageBox } from 'element-react'
import { Query, Mutation, useMutation } from 'react-apollo'
import { LoadingSpinner, captureFilteredError } from '../general'
import {
  fetchUserUploadedContent,
  likeContent,
  dislikeContent,
  markContentAsViewed,
  deleteUserLearningContent,
  addContentToActiveGoal
} from '../../api'
import { getOptions } from './utils/_getOptions'
import Container from '../../globalState'
import history from '../../history'

const OwnContentList = ({
  ownContent,
  neededWorkSkills,
  usersTeams,
  handleLikingContent,
  handleDislikingContent,
  handleClickingContent,
  handleDeletingContent,
  handleAddingToGoal,
  handleEditingContent,
  canRecommend
}) => {
  const [addToGoalMutation] = useMutation(addContentToActiveGoal)
  const container = Container.useContainer()
  if (ownContent && ownContent.length === 0) {
    return <Statement content='No items to display' />
  } else {
    const remappedContent = ownContent.map(content => {
      const options = getOptions({
        content,
        container,
        canRecommend,
        handleLikingContent,
        handleDislikingContent,
        isOwnContent: !!content.organizationSpecific,
        handleDeletingContent,
        handleAddingToGoal: variables =>
          handleAddingToGoal(addToGoalMutation, variables),
        handleEditingContent
      })
      return {
        ...remapLearningContentForUI({ content, neededWorkSkills, options })
      }
    })

    return (
      <LearningItems
        items={remappedContent}
        onLinkClick={learningContentId =>
          handleClickingContent(learningContentId)
        }
      />
      //     <div>
      //       {ownContent.map(content => {
      //         const { relatedPrimarySkills, relatedSecondarySkills } = content
      //         const primarySkills = relatedPrimarySkills.map(skill => ({
      //           _id: skill._id.split(':')[1],
      //           name: skill.name,
      //           primary: true,
      //           level: skill.skillLevel
      //         }))
      //         const secondarySkills =
      //           (relatedSecondarySkills &&
      //             relatedSecondarySkills.length > 0 &&
      //             relatedSecondarySkills.map(skill => ({
      //               _id: skill._id.split(':')[1],
      //               name: skill.name,
      //               primary: false
      //             }))) ||
      //           []
      //         const skills = [...primarySkills, ...secondarySkills]
      //         const mainTags = skills.filter(tag =>
      //           neededWorkSkills.some(
      //             skill => tag._id.indexOf(skill.skillId) !== -1
      //           )
      //         )
      //         const secondaryTags = skills.filter(
      //           skill => !mainTags.some(tag => tag._id.indexOf(skill._id) !== -1)
      //         )
      //         return (
      //           <LearningItem
      //             key={content._id}
      //             contentId={content._id}
      //             recommended={false}
      //             type={content.type}
      //             author={content.author ? content.author : ``}
      //             sourceName={content.source.name}
      //             skills={skills}
      //             isPaid={content.price.value > 0}
      //             mainTags={mainTags}
      //             secondaryTags={secondaryTags}
      //             content={
      //               <a
      //                 href={content.url}
      //                 target="_bblank"
      //                 onMouseDown={() => handleClickingContent(content._id)}
      //               >
      //                 {content.title}
      //               </a>
      //             }
      //             onHeartClick={async () => handleLikingContent(content._id)}
      //             onBanClick={async () => handleDislikingContent(content._id)}
      //             liked={content.liked}
      //             disliked={content.disliked}
      //             canUnshareContent={content.canUnshare}
      //             cantShareContent={!content.canShare}
      //             button
      //             buttonValue="Delete"
      //             buttonType="danger"
      //             onButtonClicked={() => {
      //               handleDeletingContent(content._id)
      //             }}
      //             label={content.newContent && `NEW`}
      //           />
      //         )
      //       })}
      //     </div>
    )
  }
}

export default class OwnContent extends Component {
  handleDeletingContent = async (
    deleteUserLearningContent,
    learningContentId
  ) => {
    MessageBox.confirm(
      'This will remove the item from the platform permanently. Continue?',
      'Warning',
      {
        type: 'warning'
      }
    )
      .then(async () => {
        deleteUserLearningContent({
          variables: { learningContentId }
        })
          .then(({ data: { deleteUserLearningContent } }) => {
            if (deleteUserLearningContent !== 'OK') {
              Notification({
                type: 'success',
                message: `The item has been successfully removed`,
                duration: 2500,
                offset: 90
              })
            }
          })
          .catch(() => {
            Notification({
              type: 'warning',
              message: `Oops! Something went wrong`,
              duration: 2500,
              offset: 90
            })
          })
      })
      .catch(() => {})
  }

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

  handleAddingToGoal = async (mutation, variables) => {
    try {
      const {
        data: { addContentToActiveGoal: result }
      } = await mutation({
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

  handleEditingContent = contentId => {
    history.push(`/learning-content/edit`, { contentId })
  }

  render() {
    const { props } = this
    const refetchQueries = [
      'fetchLikedContentForUser',
      'fetchRelevantContentForUser',
      'fetchSharedInTeamContent',
      'fetchSharedByMeContent',
      'fetchDislikedContentForUser',
      'fetchUserUploadedContent'
    ]
    return (
      <div>
        <Mutation mutation={markContentAsViewed}>
          {markContentAsViewed => {
            return (
              <Mutation
                mutation={deleteUserLearningContent}
                refetchQueries={refetchQueries}
              >
                {deleteUserLearningContent => {
                  return (
                    <Mutation
                      mutation={likeContent}
                      refetchQueries={refetchQueries}
                    >
                      {likeContent => {
                        return (
                          <Mutation
                            mutation={dislikeContent}
                            refetchQueries={refetchQueries}
                          >
                            {dislikeContent => {
                              const handlers = {
                                handleLikingContent: id =>
                                  this.handleLikingContent(likeContent, id),
                                handleDislikingContent: id =>
                                  this.handleDislikingContent(
                                    dislikeContent,
                                    id
                                  ),
                                handleClickingContent: id =>
                                  this.handleClickingContent(
                                    markContentAsViewed,
                                    id
                                  ),
                                handleDeletingContent: id =>
                                  this.handleDeletingContent(
                                    deleteUserLearningContent,
                                    id
                                  ),
                                handleAddingToGoal: this.handleAddingToGoal,
                                handleEditingContent: this.handleEditingContent
                              }
                              return (
                                <Query
                                  query={fetchUserUploadedContent}
                                  fetchPolicy='cache-and-network'
                                >
                                  {({ data, loading, error }) => {
                                    if (loading) return <LoadingSpinner />
                                    if (error) {
                                      captureFilteredError(error)
                                      return (
                                        <Statement content='Oops! Something went wrong' />
                                      )
                                    }
                                    const userContent =
                                      data && data.fetchUserUploadedContent
                                    if (userContent) {
                                      return (
                                        <OwnContentList
                                          {...props}
                                          ownContent={userContent}
                                          {...handlers}
                                        />
                                      )
                                    }
                                    return null
                                  }}
                                </Query>
                              )
                            }}
                          </Mutation>
                        )
                      }}
                    </Mutation>
                  )
                }}
              </Mutation>
            )
          }}
        </Mutation>
      </div>
    )
  }
}
