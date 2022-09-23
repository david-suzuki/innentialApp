import DataLoader from 'dataloader'
import sift from 'sift'

const remapDocs = (docs, ids) => {
  const idMap = {}
  docs.forEach(doc => {
    idMap[doc._id] = doc // eslint-disable-line no-underscore-dangle
  })
  return ids.map(id => idMap[id])
}

const dataQuery = ({ queries }, model) =>
  model
    .find({ $or: queries })
    .lean()
    .then(items => queries.map(query => items.filter(sift(query))))

const queryLoader = model =>
  new DataLoader(queries => dataQuery({ queries }, model))

const loader = model =>
  new DataLoader(ids =>
    model
      .find({ _id: { $in: ids } })
      .lean()
      .then(docs => remapDocs(docs, ids))
  )

export default class {
  constructor(model) {
    this.model = model
  }
  async loadManyByQuery(query) {
    const docs = await queryLoader(this.model).load(query)
    return docs
  }

  async loadOneById(id) {
    const doc = await loader(this.model).load(id)

    return doc
  }

  async loadManyByIds(ids) {
    return Promise.all(ids.map(id => this.loadOneById(id)))
  }
}
