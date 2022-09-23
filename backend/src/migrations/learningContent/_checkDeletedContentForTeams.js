import { LearningContent, TeamSharedContentList } from '~/models'
;(async () => {
  const allSharedContentLists = await TeamSharedContentList.find().lean()
  await Promise.all(
    allSharedContentLists.map(async teamContentList => {
      // const originalContent = teamContentList.sharedContent
      let filteredContent = teamContentList.sharedContent
      let foundMissingContent = false
      await Promise.all(
        teamContentList.sharedContent.map(async sharedContent => {
          const learningContent = await LearningContent.findOne({
            _id: sharedContent.contentId
          })
          if (!learningContent) {
            foundMissingContent = true
            console.log('missing content!', sharedContent.contentId)
            filteredContent = filteredContent.filter(
              content => content.contentId !== sharedContent.contentId
            )
          }
        })
      )
      if (foundMissingContent) {
        const newList = await TeamSharedContentList.findOneAndUpdate(
          { _id: teamContentList._id },
          {
            $set: {
              sharedContent: filteredContent
            }
          },
          { new: true }
        )

        console.log('Updatedlists shared content', newList.sharedContent)
      }
    })
  )
})()
