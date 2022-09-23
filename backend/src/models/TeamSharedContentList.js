import mongoose from 'mongoose'

const Schema = mongoose.Schema

const teamSharedContentListSchema = new Schema({
  teamId: {
    type: String,
    required: true
  },
  sharedContent: {
    type: [
      {
        contentId: String,
        sharedBy: String,
        lastShared: {
          type: Date,
          default: Date.now
        },
        notes: {
          type: [
            {
              userId: String,
              note: String
            }
          ]
        },
        includedInEmail: Boolean
      }
    ]
  }
})

const TeamSharedContentListModel = mongoose.model(
  'TeamSharedContentList',
  teamSharedContentListSchema
)

export default TeamSharedContentListModel
