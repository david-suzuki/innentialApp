import { GoalTemplate } from '../../models'
;(async () => {
  let nUpdated = 0

  const templates = await GoalTemplate.find()
    .select({ _id: 1, content: 1 })
    .lean()

  await Promise.all(
    templates.map(async ({ _id, content }) => {
      if (content.length === 0 || content[0].contentId) return null
      nUpdated++
      return GoalTemplate.findByIdAndUpdate(_id, {
        $set: {
          content: content.map(contentId => ({
            contentId
          }))
        }
      })
    })
  )

  nUpdated > 0 && console.log(`Updated ${nUpdated} goal templates`)
})()
