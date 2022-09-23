import mongoose from 'mongoose'

const Schema = mongoose.Schema

const ObjectId = Schema.Types.ObjectId

export const subscriptionSchema = new Schema(
  {
    organizationId: {
      type: ObjectId,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    source: {
      type: ObjectId,
      required: true
    },
    endsAt: Date,
    active: {
      type: Boolean,
      default: true
    },
    accountName: String
  },
  {
    timestamps: true
  }
)

const Subscription = mongoose.model('Subscription', subscriptionSchema)
export default Subscription
