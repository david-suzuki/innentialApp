import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const organizationSchema = new Schema({
  isPayingOrganization: {
    type: Boolean,
    default: false
  },
  slug: {
    type: String,
    required: true
  },
  size: {
    type: String
  },
  industry: {
    type: String
  },
  organizationName: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  admins: {
    type: [ObjectId],
    required: true
  },
  disabledNeededSkills: [
    {
      _id: ObjectId,
      name: String
    }
  ],
  disabledSkills: [
    {
      _id: ObjectId,
      name: String,
      migrated: {
        type: Boolean,
        default: true
      }
    }
  ],
  disabledSkillCategories: [
    {
      _id: ObjectId,
      slug: String
    }
  ],
  isDemoOrganization: {
    type: Boolean,
    default: false
  },
  neededSkillsEnabled: {
    type: Boolean,
    default: false
  },
  locations: {
    type: [String]
  },
  feedbackVisible: {
    type: Boolean,
    default: false
  },
  disabled: Boolean,
  premium: Boolean,
  approvals: Boolean,
  teamLeadApprovals: Boolean,
  inviteLink: {
    token: String,
    createdAt: Date,
    active: Boolean
  },
  corporate: Boolean, // CURRENTLY INTRODUCING THIS FOR POSTFINANCE LIMITATIONS
  fulfillment: Boolean,
  technicians: Boolean, // ONBOARDING SKIP FOR SMA TECHS
  events: Boolean, // ONBOARDING SKIP FOR SMA TECHS
  mandatorySkills: [
    {
      _id: ObjectId,
      name: String
    }
  ],
  noPaid: Boolean, // PAID CONTENT DISABLED FOR RUNA
  autoassignedPaths: {
    type: [ObjectId]
  }
  // useCustomFrameworks: {
  //   type: Boolean,
  //   default: false
  // }
})

const Organization = mongoose.model('Organization', organizationSchema)
export default Organization
