import to from 'await-to-js'
import { Task } from '~/models'
import { throwIfError } from '../utils'
import MongoDataSourceClass from './_mongo-datasource-class'

export default new (class extends MongoDataSourceClass {
  // reads
  async findById(docId) {
    return this.model.findById(docId)
  }

  async getAll(query) {
    return this.model.find(query)
  }

  async getResolver(id) {
    return this.loadOneById(id)
  }

  async getAllResolvers(ids) {
    return this.loadManyByIds(ids)
  }

  // writes
  async createOne(data) {
    if (!data) return null

    const [err, template] = await to(this.model.create(data))

    throwIfError({ error: err })
    return template
  }

  async updateOne({ filter, update }) {
    const { _id: id } = filter
    if (!id) return null

    return this.model.findOneAndUpdate(filter, update, {
      new: true
    })
  }

  async remove(params) {
    const { id } = params || {}
    const conditions = {
      _id: id
    }
    const [err, deleted] = await to(
      this.model.findOneAndRemove({ ...conditions })
    )
    throwIfError({ error: err })
    return deleted
  }
})(Task)
