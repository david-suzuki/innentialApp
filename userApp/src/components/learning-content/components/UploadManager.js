import React, { useEffect, Component, useState } from 'react'
import {
  FormDescription,
  LearningItemNew,
  List,
  remapLearningContentForUI
} from '../../ui-components'
import { ContentUpload, FileContentUpload, ContentEdit } from './'
import { MessageBox, Button, Notification, Radio } from 'element-react'
import { Mutation, useMutation, useQuery } from 'react-apollo'
import { LoadingSpinner } from '../../general'

import {
  markContentAsViewed,
  likeContent,
  dislikeContent,
  addContentToActiveGoal,
  deleteUserLearningContent,
  fetchCurrentUserOrganizationTeams
} from '../../../api'
import { getOptions } from '../utils/_getOptions'
import Container from '../../../globalState'
import { useHistory } from 'react-router-dom'

import { captureFilteredError } from '../../general'

const DisplayContent = ({
  content,
  setContent,
  resetManager,
  isNew,
  handleLikingContent,
  handleAddingToGoal,
  handleDeletingContent,
  currentUser,
  teams,
  inDevelopmentPlan,
  addContentToDevelopmentPlan,
  backToDevelopmentPlan
}) => {
  const [edit, setEdit] = useState(false)

  const container = Container.useContainer()

  const remappedContent = remapLearningContentForUI({
    content,
    options: getOptions({
      isOwnContent: isNew,
      content,
      container,
      handleLikingContent,
      handleDeletingContent,
      handleEditingContent: () => setEdit(true),
      disableAddingToGoal: !!inDevelopmentPlan
    })
  })

  if (edit) {
    const contentId = content?._id || null

    if (contentId) {
      return (
        <ContentEdit
          contentId={contentId}
          handleSubmit={updated => {
            setContent(updated)
            setEdit(false)
          }}
        />
      )
    } else {
      backToDevelopmentPlan()
      return null
    }
  }

  return (
    <div className='component-block'>
      <div style={{ marginBottom: '25px' }}>
        <FormDescription
          label={
            isNew ? `Your item has been uploaded` : `We found matching item`
          }
          description={
            isNew
              ? inDevelopmentPlan
                ? 'You can now add item to your development plan'
                : teams && teams.length > 0
                ? `You can now share the item to your teams`
                : ''
              : `Item with that URL already exists`
          }
        />
      </div>
      <List noPadding overflow noBoxShadow>
        <LearningItemNew {...remappedContent} />
        {/* <LearningItem
          key={content._id}
          contentId={content._id}
          recommended={false}
          type={content.type}
          skills={skills}
          sourceName={content.source.name}
          author={content.author ? content.author : ``}
          isPaid={content.price.value > 0}
          mainTags={skills}
          content={
            <a
              href={content.url}
              target="_bblank"
              onMouseDown={() => handleClickingContent(content._id)}
            >
              {content.title}
            </a>
          }
          cantLike
          cantShareContent
        /> */}
      </List>
      {inDevelopmentPlan ? (
        <span>
          <Button
            type='primary'
            onClick={() => {
              if (!addContentToDevelopmentPlan(content)) {
                Notification({
                  type: 'success',
                  message: 'Item added to plan!',
                  duration: 2500,
                  offset: 90
                })
              } else {
                Notification({
                  type: 'info',
                  message: 'Item already in development plan',
                  duration: 2500,
                  offset: 90,
                  iconClass: 'el-icon-info'
                })
              }
              backToDevelopmentPlan()
            }}
          >
            Add to development plan
          </Button>
          <a className='el-button--secondary-link' onClick={resetManager}>
            Reset
          </a>
        </span>
      ) : (
        <Button type='primary' onClick={resetManager}>
          Go back
        </Button>
      )}
    </div>
  )
}

const UploadPager = ({
  page,
  setContent,
  displayContent,
  content,
  isNew,
  handleDislikingContent,
  handleLikingContent,
  handleAddingToGoal,
  handleDeletingContent,
  resetManager,
  currentUser,
  teams,
  inDevelopmentPlan,
  addContentToDevelopmentPlan,
  uploadType,
  backToDevelopmentPlan,
  contentType
}) => {
  const [addToGoalMutation] = useMutation(addContentToActiveGoal)
  const [likeContentMutation] = useMutation(likeContent, {
    update: () => {
      content = {
        ...content,
        liked: !content.liked
      }
    }
  })
  const [deleteContent] = useMutation(deleteUserLearningContent)

  switch (page) {
    case 0:
      if (uploadType === 'FILE')
        return <FileContentUpload displayContent={displayContent} />
      else
        return (
          <ContentUpload
            displayContent={displayContent}
            contentType={contentType}
          />
        )
    case 1:
      const handlers = {
        handleLikingContent: id => handleLikingContent(likeContentMutation, id),
        handleAddingToGoal: variables =>
          handleAddingToGoal(addToGoalMutation, variables),
        handleDeletingContent: contentId =>
          handleDeletingContent(deleteContent, contentId)
      }
      return (
        <DisplayContent
          content={content}
          setContent={setContent}
          isNew={isNew}
          resetManager={resetManager}
          currentUser={currentUser}
          teams={teams}
          inDevelopmentPlan={inDevelopmentPlan}
          {...handlers}
          addContentToDevelopmentPlan={addContentToDevelopmentPlan}
          backToDevelopmentPlan={backToDevelopmentPlan}
        />
      )
    // return (
    //   <Mutation
    //     mutation={likeContent}
    //     refetchQueries={[
    //       'fetchLikedContentForUser',
    //       'fetchRelevantContentForUser',
    //       'fetchSharedInTeamContent',
    //       'fetchSharedByMeContent',
    //       'fetchDislikedContentForUser'
    //     ]}
    //     update={() => {
    //       content = {
    //         ...content,
    //         liked: true,
    //         disliked: false
    //       }
    //     }}
    //   >
    //     {likeContent => {
    //       return (
    //         <Mutation
    //           mutation={dislikeContent}
    //           refetchQueries={[
    //             'fetchLikedContentForUser',
    //             'fetchRelevantContentForUser',
    //             'fetchSharedInTeamContent',
    //             'fetchSharedByMeContent',
    //             'fetchDislikedContentForUser'
    //           ]}
    //           update={() => {
    //             content = {
    //               ...content,
    //               liked: false,
    //               disliked: true
    //             }
    //           }}
    //         >
    //           {dislikeContent => {
    //             return (
    //               <Mutation mutation={markContentAsViewed}>
    //                 {markContentAsViewed => {
    //                   const handlers = {
    //                     handleLikingContent: id =>
    //                       handleLikingContent(likeContentMutation, id),
    //                     handleAddingToGoal: variables =>
    //                       handleAddingToGoal(addToGoalMutation, variables)
    //                   }
    //                   return (
    //                     <DisplayContent
    //                       content={content}
    //                       isNew={isNew}
    //                       resetManager={resetManager}
    //                       currentUser={currentUser}
    //                       teams={teams}
    //                       inDevelopmentPlan={inDevelopmentPlan}
    //                       {...handlers}
    //                       addContentToDevelopmentPlan={
    //                         addContentToDevelopmentPlan
    //                       }
    //                       backToDevelopmentPlan={backToDevelopmentPlan}
    //                     />
    //                   )
    //                 }}
    //               </Mutation>
    //             )
    //           }}
    //         </Mutation>
    //       )
    //     }}
    //   </Mutation>
    // )
    default:
      return <ContentUpload displayContent={this.displayContent} />
  }
}

class UploadManager extends Component {
  state = {
    page: 0,
    content: null,
    isNew: false,
    uploadType: 'URL'
  }

  setUploadType = value => {
    this.setState({ uploadType: value })
  }

  setContent = content => {
    this.setState({
      content: content ? content : null,
      ...(!content && { page: 0 })
    })
  }

  displayContent = (content, newContent) => {
    if (newContent) {
      this.setState({
        content,
        isNew: true
      })
    } else {
      this.setState({ content })
    }
    this.setState({
      page: 1
    })
  }

  resetManager = () => {
    this.setState({
      content: null,
      page: 0
    })
  }

  // Handler functions

  handleClickingContent = async (markContentAsViewed, learningContentId) => {
    await markContentAsViewed({
      variables: { learningContentId }
    })
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
              this.setContent(null)
              if (typeof this.props.backToDevelopmentPlan === 'function')
                this.props.backToDevelopmentPlan()
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

  // handleEditingContent = contentId => {
  //   history.push(`/learning-content/edit`, { contentId })
  // }

  render() {
    return (
      <div>
        {this.state.content === null && (
          <>
            <FormDescription
              label='Select the type of item you want to upload'
              description={
                <>
                  If you have a file on your computer you would like to share,
                  select <b>Upload a File</b>. Otherwise you can paste a link
                  and we will extract information for you
                </>
              }
            />
            <TypeSelector
              value={this.state.uploadType}
              setValue={this.setUploadType}
            />
          </>
        )}
        <UploadPager
          {...this.state}
          {...this.props}
          handleClickingContent={this.handleClickingContent}
          handleLikingContent={this.handleLikingContent}
          handleDislikingContent={this.handleDislikingContent}
          handleAddingToGoal={this.handleAddingToGoal}
          handleDeletingContent={this.handleDeletingContent}
          resetManager={this.resetManager}
          displayContent={this.displayContent}
          setContent={this.setContent}
        />
      </div>
    )
  }
}

const TypeSelector = ({ value, setValue }) => {
  return (
    <Radio.Group
      value={value}
      style={{ width: '20%', margin: 'auto', marginBottom: '40px' }}
      onChange={setValue}
    >
      <Radio value='URL'>URL</Radio>
      <Radio value='FILE'>Upload a File</Radio>
    </Radio.Group>
  )
}

export default props => {
  const { inDevelopmentPlan, backToDevelopmentPlan } = props

  const { data, loading, error } = useQuery(fetchCurrentUserOrganizationTeams)

  const history = useHistory()

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    captureFilteredError(error)
    Notification({
      type: 'warning',
      message: 'Oops! Something went wrong',
      duration: 2500,
      offset: 90
    })
    inDevelopmentPlan ? backToDevelopmentPlan() : history.goBack()
    return null
  }

  const teams = data?.fetchCurrentUserOrganization?.teams || []

  return (
    <div
      className='wrapper--right'
      style={{ maxWidth: '640px', margin: '0px auto' }}
    >
      <div className='page-heading'>
        <i
          className='page-heading__back__button icon icon-small-right icon-rotate-180'
          onClick={() => {
            if (inDevelopmentPlan) {
              MessageBox.confirm('Are you sure you want to leave?', '', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning'
              })
                .then(() => {
                  backToDevelopmentPlan()
                })
                .catch(() => {})
            } else {
              history.goBack()
            }
          }}
        />
        <div className='page-heading-info'>
          <h1>Learning item upload</h1>
        </div>
      </div>
      <UploadManager
        {...props}
        teams={teams}
        backToDevelopmentPlan={backToDevelopmentPlan}
      />
    </div>
  )
}
