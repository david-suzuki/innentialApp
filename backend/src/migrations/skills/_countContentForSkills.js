import { Skills, LearningContent, ContentSources } from '~/models'
;(async () => {
  let updatedCounter = 0
  const skills = await Skills.find().lean()
  const disabledSources = await ContentSources.find({ enabled: false })
    .select({ _id: 1 })
    .lean()

  const disabledSourceIds = disabledSources.map(({ _id }) => _id)

  await Promise.all(
    skills.map(async ({ _id, contentCount }) => {
      if (contentCount !== 69420) {
        // MANUAL EXCEPTION
        await Skills.findOneAndUpdate(
          { _id },
          {
            $set: {
              contentCount: await LearningContent.countDocuments({
                'relatedPrimarySkills._id': _id,
                inactive: { $ne: true },
                organizationSpecific: null,
                source: { $nin: disabledSourceIds }
              })
            }
          }
        )
        updatedCounter++
      }
    })
  )

  if (updatedCounter) console.log(`Updated ${updatedCounter} skills`)
})()
