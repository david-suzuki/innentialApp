import mongoose from 'mongoose'

const Schema = mongoose.Schema

export const interestsSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  }
})

const Interests = mongoose.model('Interests', interestsSchema)
export default Interests
