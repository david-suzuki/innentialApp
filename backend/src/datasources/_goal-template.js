import MongoDataSourceClass from './_mongo-datasource-class'
import { GoalTemplate } from '~/models'

export default new (class extends MongoDataSourceClass {
  // reads
  async findById(docId) {
    return this.model.findById(docId)
  }

  async getAllResolvers(ids) {
    return this.loadManyByIds(ids)
  }

  // writes
  async createMany(data) {
    if (!data) return null
    const docs = data.map(doc => {
      const { _id, ...rest } = doc
      return rest
    })
    return this.model.insertMany(docs)
  }

  async updateOne({ filter, update }) {
    const { _id: id } = filter
    if (!id) return null
    return this.model.findOneAndUpdate(filter, update, {
      new: true
    })
  }
})(GoalTemplate)
