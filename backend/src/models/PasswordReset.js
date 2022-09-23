import mongoose from 'mongoose'

const Schema = mongoose.Schema

const passwordResetSchema = new Schema({
  userEmail: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  acceptedAt: {
    type: Date
  }
})

const PasswordReset = mongoose.model('PasswordReset', passwordResetSchema)
export default PasswordReset
