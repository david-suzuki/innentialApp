// import SKILLS_CATEGORY from '~/environment'
import mongoose from 'mongoose'
import { REVIEW_STATUS, REVIEW_GOALS, REVIEW_SCOPE } from '~/environment'

const Schema = mongoose.Schema

const ObjectId = Schema.Types.ObjectId

export const reviewSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  organizationId: {
    type: ObjectId,
    required: true
  },
  templateId: {
    type: ObjectId,
    required: true
  },
  startsAt: {
    type: Date,
    required: true
  },
  closedAt: Date,
  status: {
    type: String,
    enum: REVIEW_STATUS,
    required: true,
    default: 'UPCOMING'
  },
  goalsToReview: {
    type: String,
    enum: REVIEW_GOALS
  },
  scopeType: {
    type: String,
    enum: REVIEW_SCOPE, // [ALL, SPECIFIC, PERSONAL]
    required: true
  },
  reviewScope: [
    {
      userId: ObjectId,
      teamId: ObjectId,
      reviewers: [ObjectId],
      completed: {
        type: Boolean,
        default: false
      }
    }
  ],
  oneTimeReview: { type: Boolean },
  progressCheckFrequency: {
    repeatCount: Number,
    repeatInterval: {
      type: String,
      default: 'WEEK'
    },
    day: {
      type: Number,
      default: 1,
      min: 0,
      max: 6
    }
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  hasScheduledEvent: [
    {
      userId: ObjectId,
      scheduledDate: Date,
      scheduledBy: ObjectId
    }
  ]
})

const Review = mongoose.model('Review', reviewSchema)
export default Review
