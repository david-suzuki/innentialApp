import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const requestSchema = new Schema({
  contentId: {
    type: ObjectId,
    required: true
  },
  user: {
    type: ObjectId,
    required: true
  },
  organizationId: {
    type: ObjectId,
    required: true
  },
  goalId: ObjectId,
  approved: Boolean,
  note: String,
  reviewedBy: ObjectId,
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  reviewedAt: Date,
  sent: Boolean
})

const LearningRequest = mongoose.model('LearningRequest', requestSchema)
export default LearningRequest
