import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const organizationSettingsSchema = new Schema({
  organizationId: {
    type: ObjectId,
    required: true
  },
  customInvitationMessage: {
    type: String
  },
  customInvitationEnabled: {
    type: Boolean,
    default: false
  }
})

const OrganizationSettings = mongoose.model(
  'OrganizationSettings',
  organizationSettingsSchema
)

export default OrganizationSettings
