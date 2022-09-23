import React, { Component } from 'react'
import { Notification } from 'element-react'
import '../../styles/theme/notification.css'
import { Mutation } from 'react-apollo'
import { markContentAsViewed } from '../../api'
import { LearningItems, remapLearningContentForUI } from '../ui-components'
import { getOptions } from './utils/_getOptions'
import { captureFilteredError } from '../general'

export default class LikedContentList extends Component {
  // constructor(props) {
  //   super(props)
  // }

  //   const { relevantContent } = props
  //   this.state = {
  //     assortedContent: relevantContent
  //   }
  // }
  // componentWillReceiveProps(props) {
  //   const { relevantContent } = props
  //   this.setState( {
  //     assortedContent: relevantContent
  //   })
  // }

  // state = {
  //   assortedContent: this.props.relevantContent
  // }

  // componentDidMount() {
  //   const navRoutes = Array.from(document.getElementsByClassName(`hamburger-menu__route-name`))
  //   const learningTab = navRoutes.find(route => route.innerText === 'Learning') || {}
  //   learningTab.innerText = 'Learning'
  // }

  // componentWillReceiveProps(props) {
  //   this.setState({
  //     assortedContent: props.relevantContent
  //   })
  // }

  handleDislikingContent = async (dislikeContent, learningContentId) => {
    try {
      await dislikeContent({
        variables: { learningContentId }
      }).then(({ data: { dislikeContent } }) => {
        // const { assortedContent } = this.state
        // this.setState({
        //   assortedContent: assortedContent.filter(
        //     content => content._id !== dislikeContent
        //   )
        // })
        Notification({
          type: 'success',
          message: `The item has been moved to your disliked list`,
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
      relevantContent,
      neededWorkSkills,
      dislikeContent,
      canRecommend,
      container
    } = this.props

    const remappedContent = relevantContent.map(content => {
      const options = getOptions({
        content,
        container,
        canRecommend,
        handleAddingToGoal: this.handleAddingToGoal,
        handleLikingContent: () => {}
        // handleDislikingContent: contentId =>
        //   this.handleDislikingContent(dislikeContent, contentId)
      })

      return {
        ...remapLearningContentForUI({ content, neededWorkSkills, options })
      }
    })

    return (
      <Mutation mutation={markContentAsViewed}>
        {markContentAsViewed => (
          <LearningItems
            items={remappedContent}
            onLinkClick={async learningContentId => {
              await markContentAsViewed({
                variables: { learningContentId }
              })
            }}
          />
        )}
      </Mutation>
    )

    // return this.state.assortedContent.map(content => {
    //   const { relatedPrimarySkills, relatedSecondarySkills } = content
    //   const primarySkills = relatedPrimarySkills.map(skill => ({
    //     _id: skill._id.split(':')[1],
    //     name: skill.name,
    //     primary: true,
    //     level: skill.skillLevel
    //   }))
    //   const secondarySkills =
    //     (relatedSecondarySkills &&
    //       relatedSecondarySkills.length > 0 &&
    //       relatedSecondarySkills.map(skill => ({
    //         _id: skill._id.split(':')[1],
    //         name: skill.name,
    //         primary: false
    //       }))) ||
    //     []
    //   const skills = [...primarySkills, ...secondarySkills]
    //   const mainTags = skills.filter(tag =>
    //     this.props.neededWorkSkills.some(
    //       skill => tag._id.indexOf(skill.skillId) !== -1
    //     )
    //   )
    //   const secondaryTags = skills.filter(
    //     skill => !mainTags.some(tag => tag._id.indexOf(skill._id) !== -1)
    //   )
    //   return (
    //     <Mutation
    //       key={`contentViewedMutation:${content._id}`}
    //       mutation={markContentAsViewed}
    //     >
    //       {markContentAsViewed => (
    //         <LearningItem
    //           key={content._id}
    //           contentId={content._id}
    //           recommended={false}
    //           type={content.type}
    //           sourceName={content.source.name}
    //           author={content.author ? content.author : ``}
    //           content={
    //             <a
    //               href={content.url}
    //               target="_bblank"
    //               onClick={async () => {
    //                 await markContentAsViewed({
    //                   variables: { learningContentId: content._id }
    //                 })
    //               }}
    //             >
    //               {content.title}
    //             </a>
    //           }
    //           liked
    //           onBanClick={async () =>
    //             this.handleDislikingContent(
    //               this.props.dislikeContent,
    //               content._id
    //             )
    //           }
    //           skills={skills}
    //           mainTags={mainTags}
    //           secondaryTags={secondaryTags}
    //           label={content.newContent && `NEW`}
    //           isPaid={content.price.value > 0}
    //           contentSourceIcon={content.source.iconSource}
    //           canUnshareContent={content.canUnshare}
    //           cantShareContent={!content.canShare}
    //         />
    //       )}
    //     </Mutation>
    //   )
    // })
  }
}
