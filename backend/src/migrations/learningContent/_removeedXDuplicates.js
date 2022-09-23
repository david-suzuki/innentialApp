import { LearningContent } from '~/models'
import dataSources from '~/datasources'
import GokuArray from 'goku-array'
;(async () => {
  const items = await LearningContent.find({ spider: 'edx' })
    .select({ _id: 1, title: 1 })
    .lean()

  const arr = new GokuArray(items)

  const uniqueContent = arr.unique(({ title }) => title)

  const { missing: duplicates } = arr.diff(uniqueContent)

  const duplicateIds = duplicates.map(({ _id }) => _id)

  const n = await dataSources().LearningContent.bulkDelete({
    _id: { $in: duplicateIds }
  })

  n > 0 && console.log(`Removed ${n} duplicate items from edX`)
})()
