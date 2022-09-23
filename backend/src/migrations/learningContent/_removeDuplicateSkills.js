import { LearningContent } from '~/models'
import { removeDuplicates } from '~/utils'
;(() => {
  LearningContent.find()
    .select({ _id: 1, relatedPrimarySkills: 1 })
    .then(async (docs, err) => {
      if (err) {
        console.error(err)
      } else {
        const duplicates = docs.filter(({ relatedPrimarySkills }) => {
          return relatedPrimarySkills.some(
            (obj, ix, array) =>
              array.findIndex(({ _id }) => _id === obj._id) !== ix
          )
        })
        await Promise.all(
          duplicates.map(async ({ _id, relatedPrimarySkills }) => {
            await LearningContent.findOneAndUpdate(
              { _id },
              {
                $set: {
                  relatedPrimarySkills: removeDuplicates(
                    relatedPrimarySkills,
                    '_id'
                  )
                }
              }
            )
          })
        )
        duplicates.length &&
          console.log(
            `Removed duplicate skills from ${duplicates.length} content items`
          )
      }
    })
})()
