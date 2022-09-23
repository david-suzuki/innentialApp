import { ContentSources } from '~/models'
import { contentSourcesData } from './_contentSourcesData'

export default async () => {
  const contentSources = await ContentSources.find()
  if (contentSources.length === 0) {
    await ContentSources.insertMany(contentSourcesData, (error, docs) => {
      if (error) {
        throw new Error(error)
      } else {
        console.log('Content sources added sucessfully')
      }
    })
  }
}
