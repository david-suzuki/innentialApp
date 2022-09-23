import { Industries } from '~/models'
import slug from 'slug'
import { industriesData } from './_industriesData.js'

export default async () => {
  const industries = await Industries.find()
  if (industries.length === 0) {
    const updatedIndustries = industriesData.map(industry => ({
      name: industry.name,
      // TODO: update slug using the .pre middleware by Mongoose
      slug: slug(industry.name, {
        replacement: '_',
        lower: true
      })
    }))
    await Industries.insertMany(updatedIndustries, (error, docs) => {
      if (error) {
        throw new Error(error)
      } else {
        console.log('Industries added sucessfully')
      }
    })
  }
}
