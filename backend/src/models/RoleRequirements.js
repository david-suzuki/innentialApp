const mongoose = require('mongoose')
const Schema = mongoose.Schema

const { ObjectId } = Schema.Types

const roleRequirementsSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    default: null
  },
  organizationId: {
    type: String,
    default: null
  },
  description: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  nextSteps: {
    type: [ObjectId]
  },
  coreSkills: {
    type: [
      {
        skillId: String,
        slug: String,
        level: Number
      }
    ]
  },
  secondarySkills: {
    type: [
      {
        skillId: String,
        slug: String,
        level: Number
      }
    ]
  },
  otherRequirements: {
    type: [String],
    default: []
  },
  suggestion: {
    type: Boolean,
    default: false
  }
})

const RoleRequirements = mongoose.model(
  'RoleRequirements',
  roleRequirementsSchema
)
export default RoleRequirements
