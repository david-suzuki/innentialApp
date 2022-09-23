import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const commentSchema = new Schema(
  {
    pathId: {
      type: ObjectId,
      required: true
    },
    user: {
      type: ObjectId,
      required: true
    },
    organizationId: {
      type: ObjectId,
      required: true
    },
    replies: {
      type: [ObjectId],
      default: []
    },
    deleted: Boolean,
    likes: [ObjectId],
    resolved: Boolean,
    replyTo: ObjectId,
    accepted: Boolean,
    abstract: String,
    content: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

const Comment = mongoose.model('Comment', commentSchema)
export default Comment
