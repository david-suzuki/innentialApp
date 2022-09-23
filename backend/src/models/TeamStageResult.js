import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const stageSchema = new Schema({
  teamId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  closedAt: Date,
  assessmentIterator: {
    type: Number,
    default: 0
  },
  engagement: Number,
  stage: String,
  keyPerformance: {
    _id: ObjectId,
    goalsManagement: Number,
    independence: Number,
    rolesClarity: Number,
    structure: Number,
    leadership: Number,
    comsAndFeedback: Number,
    planningAndDecisionMaking: Number,
    followUps: Number,
    acceptanceAndNorms: Number,
    cooperation: Number
  },
  comments: [String],
  membersParticipated: [ObjectId],
  reminders: {
    type: Number,
    default: 0
  },
  lastChecked: {
    type: Number,
    default: 0
  }
})

const TeamStageResult = mongoose.model('TeamStageResult', stageSchema)
export default TeamStageResult
