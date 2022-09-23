// import SKILLS_CATEGORY from '~/environment'
import mongoose from 'mongoose'

const Schema = mongoose.Schema

const ObjectId = Schema.Types.ObjectId

export const reviewResultsSchema = new Schema({
  reviewId: {
    type: ObjectId,
    required: true
  },
  templateId: {
    type: ObjectId,
    required: true
  },
  closedAt: Date,
  userResults: [
    {
      teamId: ObjectId,
      user: ObjectId,
      reviewer: ObjectId,
      goalsReviewed: [ObjectId],
      goalsSet: [ObjectId],
      reviewedAt: {
        type: Date,
        default: Date.now
      },
      skillProgression: [
        {
          oldValue: Number,
          newValue: Number
        }
      ],
      feedback: String
    }
  ]
})

const ReviewResult = mongoose.model('ReviewResult', reviewResultsSchema)
export default ReviewResult
