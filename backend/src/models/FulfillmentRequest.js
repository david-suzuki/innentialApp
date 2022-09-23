import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const requestSchema = new Schema(
  {
    contentId: {
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
    fulfilled: Boolean,
    note: String,
    reviewedAt: Date
  },
  {
    timestamps: true
  }
)

const FulfillmentRequest = mongoose.model('FulfillmentRequest', requestSchema)
export default FulfillmentRequest
