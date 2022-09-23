import mongoose from 'mongoose'

const Schema = mongoose.Schema

const ObjectId = Schema.Types.ObjectId

const schema = new Schema(
  {
    pathId: {
      required: true,
      type: ObjectId
    },
    organizationId: {
      required: true,
      type: ObjectId
    },
    everyone: Boolean,
    autoassign: Boolean,
    teams: [
      {
        teamId: ObjectId,
        autoassign: Boolean
      }
    ],
    users: [ObjectId]
  },
  {
    timestamps: true
  }
)

export default mongoose.model('PathAssignee', schema)
