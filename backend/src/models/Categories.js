import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

export const categoriesSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  slug: String,
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  organizationSpecific: ObjectId
})

const Categories = mongoose.model('Categories', categoriesSchema)
export default Categories
