import validator from 'validator'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const microSiteSchema = new Schema({
  name: String,
  email: {
    type: String,
    validate: {
      validator: value => validator.isEmail(value)
    }
  },
  results: [
    {
      resultId: String,
      chartData: {
        labels: [String],
        skillsAvailable: [Number],
        skillsNeeded: [Number]
      },
      hours: Number,
      neededSkills: [
        {
          _id: String,
          name: String
        }
      ],
      selectedSkills: [
        {
          _id: String,
          name: String,
          level: Number
        }
      ],
      selectedContent: [Schema.Types.ObjectId],
      situation: String,
      roleChosen: Schema.Types.ObjectId,
      submittedAt: Date,
      updatedAt: Date
    }
  ],
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  }
})

const MicroSiteResult = mongoose.model('MicroSiteResult', microSiteSchema)
export default MicroSiteResult
