import SORT_METHODS from '~/environment'
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const ObjectId = Schema.Types.ObjectId

const userInteractionsSchema = new Schema({
  user: {
    type: String,
    required: true,
    unique: true
  },
  interactions: [
    {
      eventType: String,
      impression: [String],
      contentId: String,
      timestamp: Number
    }
  ],
  feedback: [
    {
      value: Number,
      contentId: String,
      // relevant: Boolean,
      interesting: Boolean,
      timestamp: Number
    }
  ],
  likedContent: {
    type: [String],
    default: []
  },
  dislikedContent: {
    type: [String],
    default: []
  },
  currentContent: {
    type: [String],
    default: []
  },
  clickedContent: {
    type: [String],
    default: []
  },
  pastContent: {
    type: [String],
    default: []
  },
  sharedContent: {
    type: [String],
    default: []
  },
  downloadedPdfs: {
    type: [String],
    default: []
  },
  recommended: {
    type: [
      {
        contentId: String,
        recommendedBy: String,
        recommendedAt: {
          type: Date,
          default: Date.now
        },
        includedInEmail: Boolean
      }
    ],
    default: []
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  // displayNewOnly: {
  //   type: Boolean,
  //   default: false
  // },
  sortMethod: {
    type: String,
    enum: SORT_METHODS,
    default: 'RELEVANCE'
  },
  updatedAt: Date,
  isReceivingContentEmails: {
    type: Boolean,
    default: true
  },
  // FILTERS
  preferredSkills: {
    type: [ObjectId],
    default: []
  },
  price: {
    type: [String],
    default: []
  },
  priceRange: {
    minPrice: Number,
    maxPrice: Number
  },
  preferredSources: {
    type: [ObjectId],
    default: []
  },
  preferredTypes: {
    type: [String],
    default: []
  },
  preferredDuration: {
    type: [String],
    default: []
  },
  preferredDifficulty: {
    type: [String],
    default: []
  },
  learningCredentials: {
    email: String,
    password: String
  }
})

const UserContentInteractions = mongoose.model(
  'UserContentInteractions',
  userInteractionsSchema
)
export default UserContentInteractions
