const mongoose = require('mongoose')
const Schema = mongoose.Schema

const activityChartStats = new Schema({
  organizationId: {
    type: String,
    required: true,
    unique: true
  },
  total: {
    lastUpdated: {
      type: Date,
      default: new Date()
    }
  },
  snapshots: [
    {
      calculatedAt: {
        type: Date,
        default: new Date()
      },
      count: {
        startedCount: { type: Number, default: 0 },
        completedCount: {
          type: Number,
          default: 0
        }
      },
      firstCount: Boolean
    }
  ]
})

const ActivityChartStats = mongoose.model(
  'ActivityChartStats',
  activityChartStats
)
export default ActivityChartStats
