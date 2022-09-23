import MongoDataSourceClass from './_mongo-datasource-class'
import {
  DevelopmentPlan,
  LearningRequest,
  User,
  Team,
  Organization
  // UserContentInteractions
} from '../models'
import { agenda } from '../config'
import { sentryCaptureException } from '../utils'
import { createDeliveryRequest } from '../components/Fulfillment/fulfillment-data/_mutation'
// import { sentryCaptureException } from '../utils'

export default new (class extends MongoDataSourceClass {
  // reads
  // async findById(docId) {
  //   return this.model.findById(docId)
  // }

  // async getAllResolvers(ids) {
  //   return this.loadManyByIds(ids)
  // }

  async exists(query) {
    const check = await this.model
      .findOne(query)
      .select({ _id: 1 })
      .lean()
    return !!check
  }

  async getRequest({ contentId, user }) {
    return this.model.findOne({ user, contentId })
  }

  // writes
  async requestLearning({ contentId, goalId }, { organizationId, user }) {
    if (!user || !organizationId || !contentId)
      throw new Error('Insufficient parameters')
    if (await this.exists({ user, contentId })) return null

    // SEND NOTIFICATIONS TO ADMIN(S)
    const admins = await User.find({
      organizationId,
      roles: 'ADMIN'
    })
      .select({ _id: 1 })
      .lean()

    await Promise.all(
      admins.map(async ({ _id: adminId }, i) => {
        const baseTiming = 30 // base value for scheduling
        const offset = i * 10 // offset to avoid large amounts of concurrent jobs running

        return agenda
          .create('singleAdminRequestsReminder', {
            user: String(adminId)
          })
          .unique({ 'data.user': String(adminId) }, { insertOnly: true })
          .schedule(`in ${baseTiming + offset} seconds`)
          .save()
      })
    )

    const organization = await Organization.findOne({
      _id: organizationId
    }).lean()

    // SEND NOTIFICATIONS TO TEAM LEADER(S)
    if (organization.teamLeadApprovals) {
      const teams = await Team.find({
        organizationId,
        members: { $in: [user] }
      }).lean()

      const leaderIds = teams.map(({ leader }) => leader)

      const leaders = await User.find({ _id: { $in: leaderIds } }).lean()

      const adminIds = admins.map(({ _id }) => String(_id))

      await Promise.all(
        leaders.map(async (leader, i) => {
          const baseTiming = 30 // base value for scheduling
          const offset = i * 10 // offset to avoid large amounts of concurrent jobs running
          const leaderId = leader._id

          // if leader is also an admin, then abort because he'll get the admin email anyway
          if (adminIds.includes(String(leaderId))) {
            return
          }

          return agenda
            .create('singleLeaderRequestsReminder', {
              user: String(leaderId)
            })
            .unique({ 'data.user': String(leaderId) }, { insertOnly: true })
            .schedule(`in ${baseTiming + offset} seconds`)
            .save()
        })
      )
    }

    return this.model.create({
      user,
      organizationId,
      contentId,
      goalId
    })
  }

  async reviewRequest({ requestId, approved, note, reviewedBy }) {
    const result = await this.updateOne({
      filter: { _id: requestId },
      update: {
        $set: {
          approved,
          note,
          reviewedBy,
          reviewedAt: new Date()
        }
      }
    })

    const { user, contentId } = result

    // if (approved) {
    const developmentPlan = await DevelopmentPlan.findOneAndUpdate(
      { user, 'content.contentId': contentId },
      {
        $set: {
          'content.$.approved': approved
        }
      }
    )

    try {
      const { status } = developmentPlan.content.find(
        ({ contentId: id }) => String(contentId) === String(id)
      )
      if (status === 'AWAITING FULFILLMENT') {
        await createDeliveryRequest({
          contentId,
          userId: user
        })
      }
    } catch (err) {
      sentryCaptureException(
        `Failed to request learning item delivery for user:${user} item:${contentId}, reason: ${err.message}`
      )
    }

    agenda
      .create('singleUserRequestsReviewedNotification', {
        user: String(user)
      })
      .unique({ 'data.user': String(user) }, { insertOnly: true })
      .schedule('in 30 seconds')
      .save()

    // } else {
    //   await DevelopmentPlan.findOneAndUpdate(
    //     { user },
    //     {
    //       $pull: {
    //         content: {
    //           contentId
    //         }
    //       }
    //     }
    //   )

    //   await UserContentInteractions.findOneAndUpdate(
    //     { user },
    //     {
    //       $addToSet: {
    //         likedContent: String(contentId)
    //       }
    //     }
    //   )
    // }

    return result
  }

  async cancelMany(content = [], user) {
    if (!user || !content.every(content => !!content.contentId))
      throw new Error(`Insufficient arguments provided`)

    const contentIds = content.map(({ contentId }) => contentId)

    return this.model.deleteMany({
      user,
      contentId: { $in: contentIds },
      approved: null
    })
  }

  // async createMany(data) {
  //   if (!data) return null
  //   const docs = data.map(doc => {
  //     const { _id, ...rest } = doc
  //     return rest
  //   })
  //   return this.model.insertMany(docs)
  // }

  async updateOne({ filter, update }) {
    const { _id: id } = filter
    if (!id) return null
    return this.model.findOneAndUpdate(filter, update, {
      new: true
    })
  }
})(LearningRequest)
