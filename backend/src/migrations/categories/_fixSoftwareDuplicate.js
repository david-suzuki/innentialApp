import { Skills, Categories } from '~/models'
;(async () => {
  const ECSoftware = await Categories.findOne({
    slug: 'SOFTWARE',
    organizationSpecific: { $ne: null }
  })
    .select({ _id: 1 })
    .lean()
  const InnentialSoftware = await Categories.findOne({
    slug: 'SOFTWARE',
    organizationSpecific: null
  })
    .select({ _id: 1 })
    .lean()

  if (!!ECSoftware && !!InnentialSoftware) {
    try {
      const result = await Skills.updateMany(
        { category: ECSoftware._id },
        { $set: { category: InnentialSoftware._id } }
      )
      await Categories.deleteOne({
        _id: ECSoftware._id
      })
      console.log(
        `Updated skills to use platform software category: ${result.nModified}`
      )
    } catch (e) {
      console.log(`Error merging software categories: ${e.message}`)
    }
  }
})()
