import mongoose from 'mongoose'
import { CONTENT_TYPE, DEVELOPMENT_PLAN_STATUS } from '../environment'

const Schema = mongoose.Schema

const ObjectId = Schema.Types.ObjectId

export const developmentPlanSchema = new Schema({
  user: {
    type: ObjectId,
    required: true
  },
  setBy: {
    type: ObjectId,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  // reviewId: ObjectId,
  content: [
    {
      contentId: ObjectId,
      status: {
        type: String,
        default: 'NOT STARTED',
        enum: DEVELOPMENT_PLAN_STATUS
      },
      startDate: Date,
      endDate: Date,
      contentType: {
        type: String,
        enum: CONTENT_TYPE
      },
      goalId: ObjectId,
      setBy: ObjectId,
      approved: {
        type: Boolean,
        default: true
      },
      note: String,
      order: Number
    }
  ],
  mentors: [
    {
      mentorId: ObjectId,
      goalId: ObjectId,
      active: {
        type: Boolean,
        default: true
      }
    }
  ],
  tasks: [
    {
      goalId: ObjectId,
      taskId: ObjectId,
      status: {
        type: String,
        default: 'NOT STARTED',
        enum: DEVELOPMENT_PLAN_STATUS
      },
      startDate: Date,
      endDate: Date
    }
  ],
  organizationId: ObjectId,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  selectedGoalId: ObjectId // TRACKING GOAL PREFERENCES
})

const DevelopmentPlan = mongoose.model('DevelopmentPlan', developmentPlanSchema)
export default DevelopmentPlan
