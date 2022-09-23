import mongoose from 'mongoose'

const Schema = mongoose.Schema

export const contentSourceSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  baseUrls: {
    type: [String],
    required: true
  },
  enabled: {
    type: Boolean,
    default: true
  },
  affiliate: {
    type: Boolean,
    default: false
  },
  certText: String,
  subscription: {
    type: Boolean,
    default: false
  },
  accountRequired: {
    type: Boolean,
    default: false
  },
  tags: [String],
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

const ContentSources = mongoose.model('ContentSources', contentSourceSchema)
export default ContentSources
