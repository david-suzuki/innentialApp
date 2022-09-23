const mongoose = require('mongoose')
const Schema = mongoose.Schema

const archivedInteractionsSchema = new Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  likedContent: {
    type: [String],
    default: []
  },
  dislikedContent: {
    type: [String],
    default: []
  }
})

const ArchivedContentInteractionData = mongoose.model(
  'ArchivedContentInteractionData',
  archivedInteractionsSchema
)
export default ArchivedContentInteractionData
