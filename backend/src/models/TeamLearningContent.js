import { KEY_PERFORMANCE } from '~/environment'
import mongoose from 'mongoose'
import validator from 'validator'

const Schema = mongoose.Schema

const teamLearningSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String
  },
  pdfSource: {
    type: String,
    required: true,
    validate: {
      validator: value => validator.isURL(value)
    }
  },
  relatedPerformanceArea: {
    type: String,
    required: true,
    enum: KEY_PERFORMANCE
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
  }
})

const TeamLearningContent = mongoose.model(
  'TeamLearningContent',
  teamLearningSchema
)
export default TeamLearningContent
