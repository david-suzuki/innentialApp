import MongoDataSourceClass from './_mongo-datasource-class'
import { Review, ReviewTemplate } from '~/models'
import { determineScope } from '~/components/Reviews/review-data/utils'

export default new (class extends MongoDataSourceClass {
  // reads
  async findById(docId) {
    return this.model.findById(docId)
  }

  async getAllResolvers(ids) {
    return this.loadManyByIds(ids)
  }

  // writes
  async createOne(data, context) {
    if (!data || !context) return null

    const {
      scopeType,
      specificScopes,
      specificUsers,
      reviewers,
      specificReviewers,
      firstReviewStart: startsAt,
      goalType: goalsToReview,
      organizationId,
      leadersReview
    } = data

    const { user: currentUserId } = context

    const template = await ReviewTemplate.create(data)

    const review = await this.model.create({
      ...data,
      startsAt,
      status: 'UPCOMING',
      goalsToReview,
      scopeType,
      templateId: template._id,
      reviewScope: await determineScope({
        scopeType,
        specificScopes,
        reviewers,
        specificReviewers,
        organizationId,
        specificUsers,
        currentUserId,
        leadersReview
      })
    })

    return review
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
})(Review)
