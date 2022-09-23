import mongoose from 'mongoose'

const Schema = mongoose.Schema
// TODO: Take the list of industries from LinkedIn
export const industriesSchema = new Schema({
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

const Industries = mongoose.model('Industries', industriesSchema)
export default Industries
