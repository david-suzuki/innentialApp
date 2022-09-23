import { LearningContent } from '~/models'
import dataSources from '~/datasources'
import GokuArray from 'goku-array'
;(async () => {
  const items = await LearningContent.find({ organizationSpecific: null })
    .select({ _id: 1, url: 1 })
    .lean()

  const arr = new GokuArray(items)

  const uniqueContent = arr.unique(({ url }) => url)

  const { missing: duplicates } = arr.diff(uniqueContent)

  const duplicateIds = duplicates.map(({ _id }) => _id)

  const n = await dataSources().LearningContent.bulkDelete({
    _id: { $in: duplicateIds }
  })

  n > 0 && console.log(`Removed ${n} duplicate content items`)
})()
