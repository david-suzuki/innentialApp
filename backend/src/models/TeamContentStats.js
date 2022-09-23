const mongoose = require('mongoose')
const Schema = mongoose.Schema

const teamContentStatSchema = new Schema({
  teamId: {
    type: String,
    required: true,
    unique: true
  },
  total: {
    lastUpdated: {
      type: Date,
      default: new Date()
    },
    added: {
      type: Number,
      default: 0
    },
    shared: {
      type: Number,
      default: 0
    },
    opened: {
      type: Number,
      default: 0
    },
    liked: {
      type: Number,
      default: 0
    }
  },
  snapshots: [
    {
      calculatedAt: {
        type: Date,
        default: new Date()
      },
      added: {
        type: Number,
        default: 0
      },
      shared: {
        type: Number,
        default: 0
      },
      opened: {
        type: Number,
        default: 0
      },
      liked: {
        type: Number,
        default: 0
      },
      firstCount: Boolean
    }
  ]
})

const TeamContentStats = mongoose.model(
  'TeamContentStats',
  teamContentStatSchema
)
export default TeamContentStats
