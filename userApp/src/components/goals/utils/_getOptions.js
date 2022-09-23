import variables from '../../../styles/variables'
// import { Notification, Button, Icon, MessageBox } from 'element-react'

// COLOR DECLARATIONS
const { apple, seafoamBlue, lightMustard, warmGrey, black } = variables

export const getGoalOptions = ({
  status,
  handleDeletion,
  handleMutating,
  history
}) => {
  const optionGroups = []
  // const statusGroup = []

  switch (status) {
    case 'ACTIVE':
      optionGroups.push([
        {
          icon: 'icon-check-small',
          text: 'Mark complete',
          color: apple,
          onClick: goalId => handleMutating({ goalId, status: 'PAST' })
        }
      ])
      optionGroups.push([
        {
          icon: 'icon-e-remove',
          text: 'Delete',
          color: black,
          onClick: goalId => handleDeletion(goalId)
        }
      ])
      break
    case 'PAST':
      optionGroups.push([
        {
          icon: 'icon-e-remove',
          text: 'Delete',
          color: black,
          onClick: goalId => handleDeletion(goalId)
        }
      ])
      break
    default:
      if (status === 'READY FOR REVIEW') {
        optionGroups.push([
          {
            icon: 'icon-ban',
            text: 'Not ready for review',
            color: warmGrey,
            onClick: goalId => handleMutating({ goalId, status: 'DRAFT' })
          }
        ])
      } else {
        optionGroups.push([
          {
            icon: 'icon-send',
            text: 'Ready for review',
            color: seafoamBlue,
            onClick: goalId =>
              handleMutating({ goalId, status: 'READY FOR REVIEW' })
          }
        ])
      }
      optionGroups.push([
        {
          icon: 'icon-small-add',
          text: 'Activate private goal',
          color: apple,
          onClick: goalId => handleMutating({ goalId, status: 'ACTIVE' })
        }
      ])
      // optionGroups.push(statusGroup)

      optionGroups.push([
        {
          icon: 'el-icon-edit',
          text: 'Edit',
          color: lightMustard,
          onClick: goalId => history.push(`/goals/edit/${goalId}`)
        }
      ])
      optionGroups.push([
        {
          icon: 'el-icon-delete',
          text: 'Delete',
          color: black,
          onClick: goalId => handleDeletion(goalId)
        }
      ])
      break
  }

  // if (canRecommend)

  // const statusGroup = []

  // if (goal.status === 'ACTIVE') {
  //   statusGroup.push({
  //     icon: 'icon-favorite',
  //     text: 'Like',
  //     color: lightMustard,
  //     onClick: contentId => {
  //       handleLikingContent(contentId)
  //     }
  //   })
  // } else if(goal.status !== 'PAST') {
  //   if (goal.status !== 'READY FOR REVIEW') {
  //     statusGroup.push({
  //       icon: 'icon-favorite',
  //       text: 'Like',
  //       color: lightMustard,
  //       onClick: contentId => {
  //         handleLikingContent(contentId)
  //       }
  //     })
  //   } else {
  //     statusGroup.push({
  //       icon: 'icon-favorite',
  //       text: 'Like',
  //       color: lightMustard,
  //       onClick: contentId => {
  //         handleLikingContent(contentId)
  //       }
  //     })
  //   }
  //   statusGroup.push({
  //     icon: 'icon-favorite',
  //     text: 'Like',
  //     color: lightMustard,
  //     onClick: contentId => {
  //       handleLikingContent(contentId)
  //     }
  //   })
  // }

  // optionGroups.push(statusGroup)

  // if (isOwnContent)
  //   optionGroups.push([
  //     {
  //       icon: 'icon-e-remove',
  //       text: 'Delete',
  //       color: black,
  //       onClick: contentId => {
  //         handleDeletingContent(contentId)
  //       }
  //     }
  //   ])

  return optionGroups
}

export const getApprovalOptions = ({ handleApproving, approved }) => {
  return [
    [
      {
        icon: 'icon-check-small',
        text: 'Approve',
        color: approved ? apple : warmGrey,
        onClick: () => handleApproving(true)
      },
      {
        icon: 'icon-e-remove',
        text: 'Disapprove',
        color: approved === false ? black : warmGrey,
        onClick: () => handleApproving(false)
      }
    ]
  ]
}
