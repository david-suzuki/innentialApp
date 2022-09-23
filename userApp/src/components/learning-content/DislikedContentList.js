import React, { Component } from 'react'
import { Notification } from 'element-react'
import '../../styles/theme/notification.css'
import {
  Statement,
  LearningItems,
  remapLearningContentForUI
} from '../ui-components'
import {
  fetchDislikedContentForUser,
  likeContent,
  markContentAsViewed
} from '../../api'
import { Query, Mutation } from 'react-apollo'
import { captureFilteredError, LoadingSpinner } from '../general'
import Container from '../../globalState'
import { getOptions } from './utils/_getOptions'

class DislikedContentList extends Component {
  // constructor(props) {
  //   super(props)

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

  // componentWillReceiveProps(props) {
  //   this.setState({
  //     assortedContent: props.relevantContent
  //   })
  // }

  handleLikingContent = async (likeContent, learningContentId) => {
    try {
      await likeContent({
        variables: { learningContentId }
      }).then(({ data: { likeContent } }) => {
        // const { assortedContent } = this.state
        // this.setState({
        //   assortedContent: assortedContent.filter(
        //     content => content._id !== likeContent
        //   )
        // })
        Notification({
          type: 'success',
          message: `The item has been moved to your liked list`,
          duration: 2500,
          offset: 90
        })
      })
    } catch (e) {
      Notification({
        type: 'error',
        message: `Oops, something went wrong!`,
        duration: 2500,
        offset: 90,
        iconClass: 'el-icon-error'
      })
    }
  }

  render() {
    const {
      relevantContent,
      neededWorkSkills,
      container,
      canRecommend,
      likeContent
    } = this.props

    const remappedContent = relevantContent.map(content => {
      const options = getOptions({
        content,
        container,
        canRecommend,
        handleLikingContent: contentId =>
          this.handleLikingContent(likeContent, contentId),
        handleDislikingContent: () => {}
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
    //           onHeartClick={async () =>
    //             this.handleLikingContent(this.props.likeContent, content._id)
    //           }
    //           disliked
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

export default ({ neededWorkSkills, canRecommend }) => {
  const container = Container.useContainer()
  return (
    <Mutation
      mutation={likeContent}
      refetchQueries={[
        'fetchRelevantContentForUser',
        'fetchLikedContentForUser',
        'fetchSharedInTeamContent',
        'fetchSharedByMeContent',
        'fetchDislikedContentForUser'
      ]}
    >
      {likeContent => (
        <Query
          query={fetchDislikedContentForUser}
          fetchPolicy='cache-and-network'
        >
          {({ loading, error, data }) => {
            if (loading) return <LoadingSpinner />
            if (error) captureFilteredError(error)

            const dislikedContent = data && data.fetchDislikedContentForUser
            if (dislikedContent.length > 0) {
              return (
                <DislikedContentList
                  canRecommend={canRecommend}
                  relevantContent={dislikedContent}
                  likeContent={likeContent}
                  neededWorkSkills={neededWorkSkills}
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
