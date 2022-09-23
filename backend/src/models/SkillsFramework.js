import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId

const skillsFrameworkSchema = new Schema({
  connectedTo: {
    type: ObjectId,
    required: true
  },
  organizationId: {
    type: ObjectId,
    default: null
  },
  level1Text: {
    type: String,
    default: ''
  },
  level2Text: {
    type: String,
    default: ''
  },
  level3Text: {
    type: String,
    default: ''
  },
  level4Text: {
    type: String,
    default: ''
  },
  level5Text: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

const SkillsFramework = mongoose.model('SkillsFramework', skillsFrameworkSchema)
export default SkillsFramework
