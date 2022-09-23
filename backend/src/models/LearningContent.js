import { CONTENT_TYPE, CURRENCIES, CONTENT_DURATION } from '~/environment'
import mongoose from 'mongoose'
import validator from 'validator'

const Schema = mongoose.Schema

const learningContentSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  source: {
    type: Schema.Types.ObjectId
  },
  url: {
    type: String,
    required: false,
    validate: {
      validator: value => validator.isURL(value)
    }
  },
  awsId: {
    type: Schema.Types.ObjectId
  },
  author: String,
  duration: {
    hoursMin: Number,
    hoursMax: Number,
    basis: {
      type: String,
      enum: CONTENT_DURATION
    },
    hours: Number,
    weeks: Number,
    minutes: Number
  },
  externalRating: Number,
  nOfReviews: Number,
  type: {
    type: String,
    required: true,
    enum: CONTENT_TYPE
  },
  price: {
    value: Number,
    currency: {
      type: String,
      enum: CURRENCIES
    }
  },
  relatedPrimarySkills: {
    type: [
      {
        _id: String,
        name: String,
        skillLevel: {
          type: Number,
          min: 0,
          max: 5
        },
        importance: {
          type: Number,
          min: 1,
          max: 3,
          default: 3
        }
      }
    ]
  },
  relatedSecondarySkills: {
    type: [
      {
        _id: String,
        name: String
      }
    ]
  },
  relatedInterests: {
    type: [
      {
        _id: String,
        name: String
      }
    ]
  },
  relatedIndustries: {
    type: [
      {
        _id: {
          type: String,
          ref: 'Industries'
        },
        name: {
          type: String
        }
      }
    ]
  },
  relatedLineOfWork: {
    _id: String,
    name: String
  },
  publishedDate: {
    type: Date
  },
  startDate: {
    type: Date
  },
  organizationSpecific: {
    type: Schema.Types.ObjectId
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
  dislikes: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  shareCount: {
    type: Number,
    default: 0
  },
  spider: String,
  uploadedBy: Schema.Types.ObjectId,
  toCleanup: Boolean,
  lastCleanedAt: Date,
  toReview: Boolean,
  inactive: {
    type: Boolean,
    default: false
  },
  certified: Boolean,
  german: Boolean,
  udemyCourseId: Number
})

const LearningContent = mongoose.model('LearningContent', learningContentSchema)
export default LearningContent
