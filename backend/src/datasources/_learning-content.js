import MongoDataSourceClass from './_mongo-datasource-class'
import {
  LearningContent,
  UserContentInteractions,
  TeamSharedContentList,
  DevelopmentPlan,
  LearningRequest
} from '../models'
import { ENVIRONMENT } from '../environment'
import { algolia } from '../config'
import axios from 'axios'
import { sentryCaptureException } from '../utils'
// import allSettled from 'promise.allsettled'

const scraperAPIPath = '/api/deleted-item-create/'

const scraperURL =
  process.env.SERVER === ENVIRONMENT.PRODUCTION
    ? 'http://admin-sc.innential.com'
    : 'http://admin-sc.innential.com:7070'

export default new (class extends MongoDataSourceClass {
  // reads
  async findById(docId) {
    return this.model.findById(docId)
  }

  async getAllResolvers(ids) {
    return this.loadManyByIds(ids)
  }

  // deletes
  async singleDelete(filter) {
    const item = await this.model
      .findOne(filter)
      .select({ _id: 1, url: 1 })
      .lean()

    if (item) {
      if (process.env.NODE_ENV === 'production') {
        try {
          axios.post(
            `${scraperURL}${scraperAPIPath}`,
            JSON.stringify([{ source_url: item.url }]),
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          )
        } catch (err) {
          sentryCaptureException(
            new Error(`Failed to send deleted item to scraper API: ${err}`)
          )
        }
      }
      return this.INDIRECT_deleteById(item._id)
    }
    return null
  }

  async bulkDelete(filter) {
    const items = await this.model
      .find(filter)
      .select({ _id: 1, url: 1 })
      .lean()

    if (process.env.NODE_ENV === 'production') {
      try {
        await axios.post(
          `${scraperURL}${scraperAPIPath}`,
          JSON.stringify(items.map(item => ({ source_url: item.url }))),
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
      } catch (err) {
        sentryCaptureException(
          new Error(`Failed to send deleted item to scraper API: ${err}`)
        )
      }
    }

    const contentIds = items.map(({ _id }) => _id)

    return this.INDIRECT_deleteByIds(contentIds)
  }

  // DO NOT CALL THE METHODS BELOW DIRECTLY - USE singleDelete AND bulkDelete INSTEAD TO MAKE SURE ALL THE MIDDLEWARE IS RUN

  async INDIRECT_deleteByIds(contentIds = []) {
    await UserContentInteractions.updateMany(
      {
        $or: [
          {
            likedContent: { $in: contentIds }
          },
          {
            dislikedContent: { $in: contentIds }
          }
        ]
      },
      {
        $pullAll: {
          likedContent: contentIds,
          dislikedContent: contentIds
        }
      }
    )

    await LearningRequest.deleteMany({ contentId: { $in: contentIds } })

    await DevelopmentPlan.updateMany(
      { 'content.contentId': { $in: contentIds } },
      {
        $pull: {
          content: {
            contentId: { $in: contentIds }
          }
        }
      }
    )

    await TeamSharedContentList.updateMany(
      { 'sharedContent.contentId': { $in: contentIds } },
      {
        $pull: {
          sharedContent: {
            contentId: { $in: contentIds }
          }
        }
      }
    )

    if (process.env.SERVER === ENVIRONMENT.PRODUCTION) {
      algolia.deleteObjects(contentIds)
    }

    const { n: contentDeleted } = await this.model.deleteMany({
      _id: { $in: contentIds }
    })

    return contentDeleted
  }

  async INDIRECT_deleteById(contentId) {
    await UserContentInteractions.updateMany(
      {
        $or: [
          {
            likedContent: contentId
          },
          {
            dislikedContent: contentId
          }
        ]
      },
      {
        $pull: {
          likedContent: contentId,
          dislikedContent: contentId
        }
      }
    )

    await DevelopmentPlan.updateMany(
      { 'content.contentId': contentId },
      {
        $pull: {
          content: {
            contentId
          }
        }
      }
    )

    // remove the  content links from the teams content lists
    await TeamSharedContentList.updateMany(
      { 'sharedContent.contentId': contentId },
      {
        $pull: {
          sharedContent: {
            contentId
          }
        }
      }
    )

    await LearningRequest.deleteMany({ contentId })

    if (process.env.SERVER === ENVIRONMENT.PRODUCTION) {
      algolia.deleteObject(`${contentId}`)
    }

    return this.model.findByIdAndRemove(contentId)
  }
})(LearningContent)
