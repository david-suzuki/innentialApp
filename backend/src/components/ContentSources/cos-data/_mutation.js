import { ContentSources, LearningContent } from '~/models'
import { isInnentialAdmin } from '~/directives'
import slug from 'slug'
import { sentryCaptureException } from '~/utils'
import { algolia } from '~/config'
import { ENVIRONMENT } from '~/environment'

export const mutationTypes = `
  type Mutation {
    addContentSource(inputData: ContentSourceInput!): ContentSource @${isInnentialAdmin}
    editContentSource(inputData: ContentSourceInput!, sourceId: ID!): ContentSource @${isInnentialAdmin}
    disableSelectedSources(sourceIDs: [ID!]): [ContentSource] @${isInnentialAdmin}
    enableSelectedSources(sourceIDs: [ID!]): [ContentSource] @${isInnentialAdmin}
    deleteContentSource(sourceId: ID!): ID @${isInnentialAdmin}
  }
`

export const mutationResolvers = {
  Mutation: {
    addContentSource: async (_, { inputData }) => {
      const { name, baseUrls, ...rest } = inputData
      const nameCheck = await ContentSources.findOne({ name })
      if (nameCheck)
        throw new Error(
          `A source with that name already exists: ${nameCheck._id}`
        )
      await Promise.all(
        baseUrls.map(async url => {
          const urlRegExp = new RegExp(
            url.replace('https:', 'https?:').replace('http:', 'https?:')
          )
          const urlCheck = await ContentSources.findOne({
            baseUrls: { $in: [urlRegExp] }
          })
          if (urlCheck)
            throw new Error(
              `A source with that URL already exists: ${urlCheck._id}`
            )
        })
      )
      const parsedData = {
        name,
        baseUrls,
        slug: slug(name, {
          replacement: '_',
          lower: true
        }),
        ...rest
      }
      const newSource = await ContentSources.create(parsedData)
      return newSource
    },
    editContentSource: async (_, { inputData, sourceId }) => {
      const { baseUrls } = inputData
      const source = await ContentSources.findById(sourceId)
      if (!source)
        throw new Error(`Content source with ID:${sourceId} not found`)
      await Promise.all(
        baseUrls.map(async url => {
          const urlRegExp = new RegExp(
            url.replace('https:', 'https?:').replace('http:', 'https?:')
          )
          const urlCheck = await ContentSources.findOne({
            baseUrls: { $in: [urlRegExp] }
          })
          if (urlCheck && urlCheck._id.toString() !== sourceId.toString())
            throw new Error(
              `Another source with that URL already exists: ${urlCheck._id}`
            )
        })
      )
      const result = await ContentSources.findOneAndUpdate(
        { _id: sourceId },
        { ...inputData, updatedAt: new Date() },
        { new: true }
      )
      return result
    },
    disableSelectedSources: async (_, { sourceIDs }) => {
      const updatedSources = await Promise.all(
        sourceIDs.map(async id => {
          const source = await ContentSources.findById(id)
          if (!source) throw new Error(`Source with id: ${id} not found`)

          const result = await ContentSources.findOneAndUpdate(
            { _id: source._id },
            { $set: { enabled: false, updatedAt: new Date() } },
            { new: true }
          )

          return result
        })
      )
      return updatedSources
    },
    enableSelectedSources: async (_, { sourceIDs }) => {
      const updatedSources = await Promise.all(
        sourceIDs.map(async id => {
          const source = await ContentSources.findById(id)
          if (!source) throw new Error(`Source with id: ${id} not found`)

          const result = await ContentSources.findOneAndUpdate(
            { _id: source._id },
            { $set: { enabled: true, updatedAt: new Date() } },
            { new: true }
          )

          return result
        })
      )
      return updatedSources
    },
    deleteContentSource: async (_, { sourceId }, { dataSources }) => {
      const source = await ContentSources.findById(sourceId)
      if (source) {
        try {
          await dataSources.LearningContent.bulkDelete({
            source: source._id
          })
          await ContentSources.deleteOne({ _id: source._id })
          return source._id
        } catch (e) {
          sentryCaptureException(
            `Failed to delete content source"${sourceId}": ${e}`
          )
        }
      } else return 'OK'
    }
  }
}
