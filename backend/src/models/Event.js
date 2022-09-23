import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: String,
    eventType: {
      type: String,
      enum: ['Internal', 'External']
    },
    format: {
      type: String,
      enum: ['', 'Online', 'On-site']
    },
    eventLink: String,
    eventLinkExternal: String,
    eventLocation: String,
    scheduleFromDate: {
      type: Date,
      default: Date.now
    },
    scheduleToDate: {
      type: Date,
      default: Date.now
    },
    isOnedayEvent: Boolean,
    isPaid: Boolean,
    currency: {
      type: String,
      enum: ['EUR', 'CHF', 'USD', 'GBP']
    },
    price: {
      type: Number,
      min: 0
    },
    inviteLink: {
      url: String,
      status: Boolean
    },
    skillIds: [ObjectId],
    attendee: {
      attendeeType: {
        type: String,
        enum: ['everyone', 'specificusers', 'specificteams', 'myteams']
      },
      attendeeIds: [ObjectId]
    },
    createrId: ObjectId,
    invitationDate: {
      type: Date,
      default: Date.now
    },
    invitations: [
      {
        _id: false,
        invitationId: ObjectId,
        invitationStatus: {
          type: String,
          enum: ['pending', 'accept', 'decline']
        }
      }
    ],
    isDraft: Boolean
  },
  {
    timestamps: true
  }
)

const Event = mongoose.model('Event', eventSchema)
export default Event
