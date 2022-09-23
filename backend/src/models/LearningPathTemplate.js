import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import { LP_TARGETS } from '../environment'

const Schema = mongoose.Schema

const schema = new Schema(
  {
    active: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      required: true
    },
    description: String,
    abstract: String,
    duration: String,
    targetGroup: String,
    prerequisites: String,
    author: String,
    authorDescription: String,
    authorPosition: String,
    // category: {
    //   type: String,
    //   enum: LP_TARGETS
    // },
    paid: Boolean,
    hasContent: Boolean,
    trending: {
      type: Boolean,
      default: false
    },
    publishedDate: {
      type: Date,
      default: new Date()
    },
    setByUser: Schema.Types.ObjectId,
    team: {
      teamId: Schema.Types.ObjectId,
      teamName: String
    },
    organization: Schema.Types.ObjectId,
    roles: [Schema.Types.ObjectId],
    skills: [Schema.Types.ObjectId],
    goalTemplate: [Schema.Types.ObjectId],
    onboarding: Boolean,
    startConditions: [String]
  },
  {
    timestamps: true
  }
)

schema.plugin(uniqueValidator)

export default mongoose.model('LearningPathTemplate', schema)
