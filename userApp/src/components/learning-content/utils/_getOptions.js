import React from 'react'
import variables from '../../../styles/variables'
// import history from '../../../history'
import { Input, MessageBox, Notification } from 'element-react'

// COLOR DECLARATIONS
const {
  apple,
  fadedRed,
  seafoamBlue,
  lightMustard,
  warmGrey,
  black,
  brandPrimary,
  avocado
} = variables

const handleClickPending = request => {
  const url = request?.requestURL
  if (url) {
    window.navigator.clipboard
      .writeText(url)
      .then(() =>
        Notification({
          type: 'info',
          message: 'Link copied to clipboard',
          duration: 2500,
          offset: 90,
          iconClass: 'el-icon-info'
        })
      )
      .catch(async () => {
        try {
          await MessageBox.alert(
            <div>
              Copy it from below:
              <Input
                value={url}
                readOnly
                onFocus={e => {
                  e.target.select()
                }}
                style={{ marginTop: '15px' }}
              />
            </div>,
            'Could not write link to clipboard',
            {
              type: 'warning'
            }
          )
        } catch (e) {}
      })
  }
}

export const getDevelopmentPlanOptions = ({
  canRecommend,
  status,
  price = 0,
  handleSettingStatus,
  container,
  approved,
  request,
  handleRemoving,
  handleSavingForLater,
  handleRequesting,
  handleRequestingFulfillment,
  fulfillmentRequest
}) => {
  const options = []

  if (approved === null) {
    if (request) {
      return [
        {
          icon: 'icon-send',
          text: `Pending Approval (copy link)`,
          color: seafoamBlue,
          onClick: () => handleClickPending(request)
        },
        {
          icon: 'el-icon-delete',
          text: `Remove from path`,
          color: black,
          onClick: contentId => {
            handleRemoving(contentId, true)
          }
        }
      ]
    } else {
      return [
        {
          icon: 'icon-send',
          text: `Request Approval`,
          color: seafoamBlue,
          onClick: contentId => handleRequesting(contentId)
        },
        {
          icon: 'el-icon-delete',
          text: `Remove from path`,
          color: black,
          onClick: contentId => {
            handleRemoving(contentId, true)
          }
        }
      ]
    }
  }

  if (approved === false) {
    return [
      {
        icon: 'icon-favorite',
        text: 'Save for later',
        color: lightMustard,
        onClick: contentId => {
          handleSavingForLater(contentId)
        }
      },
      {
        icon: 'el-icon-delete',
        text: 'Remove from development plan',
        color: black,
        onClick: contentId => {
          handleRemoving(contentId, false)
        }
      }
    ]
  }

  // if (canRecommend && status === 'COMPLETED')
  //   options.push({
  //     icon: 'icon-send',
  //     text: 'Recommend',
  //     color: seafoamBlue,
  //     onClick: contentId => {
  //       container.setSharedContent({ contentId })
  //       container.setRecommendingContent(true)
  //     }
  //   })

  switch (status) {
    case 'AWAITING FULFILLMENT':
      options.push({
        icon: fulfillmentRequest ? 'icon-time-clock' : 'icon-send',
        text: fulfillmentRequest ? 'Awaiting delivery' : 'Request delivery',
        color: fulfillmentRequest ? lightMustard : seafoamBlue,
        onClick: fulfillmentRequest
          ? () => {}
          : contentId => handleRequestingFulfillment(contentId)
      })
      break
    case 'NOT STARTED':
      options.push({
        icon: 'icon-h-dashboard',
        text: 'Set in progress',
        color: lightMustard,
        onClick: contentId =>
          handleSettingStatus({
            variables: { status: 'IN PROGRESS', contentId }
          })
      })
      break
    case 'IN PROGRESS':
      options.push(
        ...[
          {
            icon: 'icon-check-small',
            text: 'Set completed',
            color: apple,
            onClick: contentId =>
              handleSettingStatus({
                variables: { status: 'COMPLETED', contentId }
              })
          },
          {
            icon: 'icon-e-remove',
            text: 'Set not started',
            color: warmGrey,
            onClick: contentId =>
              handleSettingStatus({
                variables: { status: 'NOT STARTED', contentId }
              })
          }
        ]
      )
      break
    case 'COMPLETED':
      options.push(
        ...[
          {
            icon: 'icon-h-dashboard',
            text: 'Set not completed',
            color: warmGrey,
            onClick: contentId =>
              handleSettingStatus({
                variables: { status: 'IN PROGRESS', contentId }
              })
          }
        ]
      )
      break
    default:
      break
  }

  return options
}

export const getOptions = ({
  content,
  container,
  // canRecommend,
  handleLikingContent,
  // handleDislikingContent,
  isOwnContent,
  handleDeletingContent,
  disabled,
  handleEditingContent,
  disableAddingToGoal
}) => {
  const options = []

  const { addedContent } = container

  if (!disableAddingToGoal) {
    if (content.inDevelopmentPlan) {
      options.push({
        icon: 'icon-check-small',
        text: 'In your learning list',
        color: avocado,
        disabled: true
      })
    } else
      options.push({
        icon:
          addedContent &&
          content._id === addedContent.contentId &&
          container.addedContentLoading
            ? 'el-icon-loading'
            : 'el-icon-plus',
        text: 'Add to your learning list',
        color: brandPrimary,
        onClick: (contentId, type = '', price = 0, subscriptionAvailable) => {
          container.setAddedContent({
            contentId,
            contentType: type.toUpperCase(),
            price,
            subscriptionAvailable
          })
          container.setAddingToGoal(true)
        }
      })
  }

  // if (canRecommend)
  //   options.push({
  //     icon: 'icon-send',
  //     text: 'Recommend',
  //     color: seafoamBlue,
  //     onClick: contentId => {
  //       container.setSharedContent({ contentId })
  //       container.setRecommendingContent(true)
  //     }
  //   })

  if (content.canShare)
    options.push({
      icon: 'icon-bookmark-add',
      text: 'Share',
      color: apple,
      onClick: contentId => {
        container.setSharingContent(true)
        container.setSharedContent({
          contentId
        })
      }
    })

  if (content.canUnshare)
    options.push({
      icon: 'icon-bookmark-delete',
      text: 'Unshare',
      color: fadedRed,
      onClick: contentId => {
        container.setUnsharingContent(true)
        container.setSharedContent({
          contentId
        })
      }
    })

  if (!content.liked)
    options.push({
      icon: 'icon-favorite',
      text: 'Save for Later',
      color: lightMustard,
      onClick: contentId => {
        handleLikingContent(contentId)
      },
      disabled
    })

  // if (!content.disliked)
  //   options.push({
  //     icon: 'icon-ban',
  //     text: 'Dislike',
  //     color: warmGrey,
  //     onClick: contentId => {
  //       handleDislikingContent(contentId)
  //     },
  //     disabled
  //   })

  if (isOwnContent) {
    options.push({
      icon: 'el-icon-edit',
      text: 'Edit',
      color: seafoamBlue,
      onClick: contentId => {
        handleEditingContent(contentId)
      }
    })
    options.push({
      icon: 'el-icon-delete',
      text: 'Delete',
      color: black,
      onClick: contentId => {
        handleDeletingContent(contentId)
      }
    })
  }

  return options
}
