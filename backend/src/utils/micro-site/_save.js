import { MicroSiteResult } from '../../models'

const saveResult = async (data, resultId) => {
  const { selectedContent } = data // CONTENT IDS
  const result = await MicroSiteResult.findOneAndUpdate(
    { 'results.resultId': resultId },
    {
      $set: {
        'results.$.selectedContent': selectedContent,
        'results.$.updatedAt': new Date()
      }
    }
  )

  if (!result) throw new Error(`Not found`)

  // TODO: SEND EMAIL
}

export default saveResult
