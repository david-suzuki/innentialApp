import { ContentSources, LearningContent } from '~/models'
import { isInnentialAdmin } from '~/directives'
import { getUploadLink } from '~/utils'

export const queryTypes = `
  type Query {
    fetchSourcesListLength: Int @${isInnentialAdmin}
    fetchAllContentSources(limit: Int, offset: Int): [ContentSource] @${isInnentialAdmin}
    fetchAmountOfContentForSource(source: ID!): Int @${isInnentialAdmin}
    fetchSourceEditForm(sourceId: ID!): ContentSource @${isInnentialAdmin}
    fetchIconUploadLink(sourceId: ID!, contentType: String): String @${isInnentialAdmin}
  }
`

export const queryResolvers = {
  Query: {
    fetchSourcesListLength: async () => {
      const contentSources = await ContentSources.find()
      return contentSources.length
    },
    fetchAllContentSources: async (_, { limit, offset }) => {
      const contentSources = await ContentSources.find().sort({ updatedAt: -1 })
      if (limit && offset)
        return contentSources.slice(limit * (offset - 1), limit * offset)
      else return contentSources
    },
    fetchSourceEditForm: async (_, { sourceId }) => {
      const contentSource = await ContentSources.findById(sourceId)
      if (!contentSource)
        throw new Error(`No content source found for ID:${sourceId}`)
      return contentSource
    },
    fetchIconUploadLink: async (_, args) => {
      const { sourceId: _id, contentType } = args
      return getUploadLink({ _id, contentType, key: 'sources/icons' })
    },
    fetchAmountOfContentForSource: async (_, { source }, context) => {
      return LearningContent.countDocuments({
        source
      })
      // const sourceLearningContent = await LearningContent.find({
      //   source
      // }).lean()
      // return sourceLearningContent.length || 0
    }
  }
}
