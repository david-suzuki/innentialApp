import validator from 'validator'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bootcampResultSchema = new Schema({
  resultId: {
    type: String,
    required: true
  },
  confirmation: {
    key: String,
    verifiedAt: Date
  },
  bootcampsMatched: [String],
  email: {
    type: String,
    validate: {
      validator: validator.isEmail
    }
  },
  contact: Boolean,
  background: String,
  education: String,
  jobCharacteristics: [String],
  codingExperience: String,
  changeProfession: String,
  name: String,
  feedback: String,
  criteria: {
    isGermanResident: Boolean,
    isAgenturSigned: Boolean,
    startsAt: Date,
    language: [String],
    format: String,
    location: String,
    remote: String
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  }
})

const BootcampResult = mongoose.model('BootcampResult', bootcampResultSchema)
export default BootcampResult
