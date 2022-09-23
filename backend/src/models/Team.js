import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId

const teamSchema = new Schema({
  active: {
    type: Boolean,
    default: true,
    required: true
  },
  teamName: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  organizationId: String,
  leader: {
    type: ObjectId,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  updatedAt: Date,
  members: [ObjectId],
  stageAssessments: {
    type: Number,
    default: 0
  },
  membersGetStageReport: {
    type: Boolean,
    default: false
  },
  feedbackShareKey: String,
  externalFeedback: {
    _id: {
      type: ObjectId,
      default: new mongoose.Types.ObjectId()
    },
    token: String,
    active: Boolean
  },
  requiredSkills: {
    type: [
      {
        skillId: ObjectId,
        level: Number
      }
    ]
  },
  recommendedPaths: {
    type: [ObjectId],
    default: []
  },
  autoassignedPaths: {
    type: [ObjectId]
  }
})

const Team = mongoose.model('Team', teamSchema)
export default Team
