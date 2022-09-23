import mongoose from 'mongoose'

const Schema = mongoose.Schema

export const invitationSchema = new Schema({
  // info about the organization and the admin who sent out the invite
  createdBy: {
    type: {
      organizationName: { type: String, required: true },
      organizationAdmin: { type: String, required: true }
    },
    required: true
  },
  createdAt: { type: Date, required: true, default: Date.now },
  // TODO: expiration date
  // user object TODO: add more info?
  userEmail: { type: String, required: true },
  status: {
    type: String,
    enum: ['active', 'accepted', 'expired'],
    default: 'active'
  }
})

const Invitations = mongoose.model('Invitations', invitationSchema)
export default Invitations
