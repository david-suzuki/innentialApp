import mongoose from 'mongoose'

const Schema = mongoose.Schema

export const linesOfWorkSchema = new Schema({
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

const LinesOfWork = mongoose.model('LinesOfWork', linesOfWorkSchema)
export default LinesOfWork
