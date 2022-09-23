import { LearningContent } from '~/models'
import { URL } from 'url'

const appendsearch =
  '?tap_a=5644-dce66f&tap_s=1041034-703027&utm_medium=affiliate&utm_source=innential'

;(async () => {
  let n = 0

  const items = await LearningContent.find({ url: /datacamp.com/ })
    .select({ _id: 1, url: 1 })
    .lean()

  await Promise.all(
    items.map(async item => {
      try {
        const url = new URL(item.url)

        const search = url.search

        if (search) return

        url.search = appendsearch

        n++

        await LearningContent.findOneAndUpdate(
          { _id: item._id },
          {
            $set: {
              url
            }
          }
        )
      } catch (err) {
        console.error(err)
      }
    })
  )

  n > 0 && console.log(`Updated ${n} DataCamp items to affiliate link`)
})()
