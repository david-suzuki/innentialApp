import { Interests } from '~/models'
import slug from 'slug'
import { interestsData } from './_interestsData.js'

export default async () => {
  const interests = await Interests.find()
  if (interests.length === 0) {
    const updatedInterests = interestsData.map(interest => ({
      name: interest.name,
      // TODO: update slug using the .pre middleware by Mongoose
      slug: slug(interest.name, {
        replacement: '_',
        lower: true
      })
    }))
    await Interests.insertMany(updatedInterests, (error, docs) => {
      if (error) {
        throw new Error(error)
      } else {
        console.log('Interests added sucessfully')
      }
    })
  }
}
