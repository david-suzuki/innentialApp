// TODO: Update and define details of methods
import { ERROR } from '~/environment'
import { encryptor } from '~/utils'
import { sentryCaptureException, safeTransform } from '../utils'
import { UserProfile, Skills } from './'
import Organization from './Organization'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  roles: [String],
  permissions: [String],
  status: {
    type: String,
    enum: ['disabled', 'invited', 'not-onboarded', 'active'],
    default: 'disabled'
  },
  organizationId: String,
  location: String,
  invitation: {
    pendingInvitation: {
      type: String,
      default: ''
    },
    invitedOn: {
      type: Date
    },
    acceptedOn: {
      type: Date
    },
    reminded: {
      type: Boolean,
      default: false
    }
  },
  feedbackShareKey: String,
  externalFeedback: {
    _id: {
      type: Schema.Types.ObjectId,
      default: new mongoose.Types.ObjectId()
    },
    token: String,
    active: Boolean
  },
  isDemoUser: {
    type: Boolean,
    default: false
  },
  registeredFrom: String,
  approvalPromptDisabled: {
    type: Boolean,
    default: false
  },
  technician: Boolean, // USED FOR SMA TECHS
  inbound: {
    path: Schema.Types.ObjectId,
    engagedOn: Date,
    completedPath: Boolean,
    startedNewPath: Boolean
  }
})

userSchema.methods.getPassword = function() {
  if (this) {
    return this.password
  }
  throw new Error(ERROR.USER.DOES_NOT_EXIST)
}

userSchema.methods.checkPassword = async function(password) {
  if (this) {
    const validPassword = await encryptor.verify(
      { digest: password },
      this.password
    )
    if (!validPassword) {
      throw new Error(ERROR.USER.WRONG_PASSWORD)
    }
    return this
  }
  throw new Error(ERROR.USER.WRONG_CREDENTIALS)
}

userSchema.methods.getRoleAtWork = async function() {
  if (this) {
    const profile = await UserProfile.findOne({ user: this._id })
      .select({ roleAtWork: 1 })
      .lean()

    if (profile) {
      return profile.roleAtWork
    }
  }
  return ''
}

userSchema.methods.getRoleId = async function() {
  if (this) {
    const profile = await UserProfile.findOne({ user: this._id })
      .select({ roleId: 1 })
      .lean()

    if (profile) {
      return profile.roleId
    }
  }
  return null
}

userSchema.methods.getWorkSkills = async function() {
  if (this) {
    const profile = await UserProfile.findOne({ user: this._id })
      .select({ selectedWorkSkills: 1 })
      .lean()

    if (profile) {
      return profile.selectedWorkSkills.map(async ({ _id, level }) => {
        const skill = await Skills.findById(_id).lean()
        return {
          ...skill,
          level
        }
      })
    }
  }
  return []
}

userSchema.post('save', async ({ _id, organizationId }) => {
  const organization = await Organization.findById(organizationId)
    .select({ autoassignedPaths: 1 })
    .lean()

  if (organization) {
    const pathIds = organization.autoassignedPaths || []

    if (pathIds.length > 0) {
      try {
        await Promise.all(
          pathIds.map(pathId =>
            safeTransform({
              organization: organizationId,
              userId: null,
              id: pathId,
              targetUser: _id
            })
          )
        )
      } catch (err) {
        sentryCaptureException(
          `Failed to assign paths to ${_id}: ${err.message}`
        )
      }
    }

    // CONTINUE ASSIGNMENT OF SPECIFIED PATH IDS
  } else {
    sentryCaptureException(`Organization with ID:${organizationId} not found`)
  }
})

const User = mongoose.model('User', userSchema)
export default User
