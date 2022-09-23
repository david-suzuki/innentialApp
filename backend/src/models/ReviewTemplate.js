// import SKILLS_CATEGORY from '~/environment'
import mongoose from 'mongoose'
import {
  REVIEW_GOALS,
  REVIEW_REVIEWERS,
  REVIEW_SCOPE,
  FREQUENCY
} from '~/environment'

const Schema = mongoose.Schema

const ObjectId = Schema.Types.ObjectId

export const reviewTemplateSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  createdBy: ObjectId,
  oneTimeReview: {
    type: Boolean
  },
  organizationId: {
    type: ObjectId,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  goalType: {
    type: String,
    enum: REVIEW_GOALS, // [TEAM, ORGANIZATION, PERSONAL]
    required: true
  },
  scopeType: {
    type: String,
    enum: REVIEW_SCOPE, // [ALL, SPECIFIC, PERSONAL]
    required: true
  },
  specificScopes: {
    type: [ObjectId],
    default: []
  },
  specificUsers: {
    type: [ObjectId],
    default: []
  },
  reviewers: {
    type: String,
    enum: REVIEW_REVIEWERS, // [ADMIN, TEAMLEAD, SPECIFIC]
    required: true
  },
  specificReviewers: {
    type: [ObjectId],
    default: []
  },
  firstReviewStart: {
    type: Date,
    required: true
  },
  reviewFrequency: {
    repeatCount: Number,
    repeatInterval: {
      type: String,
      enum: FREQUENCY // [WEEK, MONTH, YEAR]
    }
  },
  progressCheckFrequency: {
    repeatCount: Number,
    repeatInterval: {
      type: String,
      default: 'WEEK'
    },
    day: {
      type: Number,
      min: 0,
      max: 6,
      default: 1
    }
  }
})

const ReviewTemplate = mongoose.model('ReviewTemplate', reviewTemplateSchema)
export default ReviewTemplate
