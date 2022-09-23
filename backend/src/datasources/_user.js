import MongoDataSourceClass from './_mongo-datasource-class'
import { User } from '~/models'

export default new (class extends MongoDataSourceClass {
  // reads
  async findById(docId) {
    return this.model.findById(docId)
  }

  async getAllResolvers(ids) {
    return this.loadManyByIds(ids)
  }
})(User)
