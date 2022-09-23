import { UserEvaluation } from './'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userProfileSchema = new Schema({
  user: String,
  organizationId: String,
  relatedLineOfWork: { name: String, _id: String },
  roleAtWork: String,
  roleId: Schema.Types.ObjectId,
  neededWorkSkills: [
    {
      // category: String,
      // level: Number,
      // name: String,
      slug: String,
      _id: String
    }
  ],
  selectedWorkSkills: [
    {
      // category: String,
      level: Number,
      // name: String,
      slug: String,
      _id: String
    }
  ],
  selectedInterests: [
    {
      name: String,
      slug: String,
      _id: String
    }
  ],
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  }
})

userProfileSchema.methods.getEvaluatedSkills = async function() {
  if (!this) throw new Error('Cant get evaluated profile')

  const usersEval = await UserEvaluation.findOne({ user: this.user })
    .select({ skillsFeedback: 1 })
    .lean()

  if (!usersEval) return this.selectedWorkSkills

  const { skillsFeedback } = usersEval

  return this.selectedWorkSkills.map(sk => {
    const evaluatedSkill = skillsFeedback.find(
      e => String(e.skillId) === sk._id
    )
    if (evaluatedSkill) {
      const { snapshots, feedback } = evaluatedSkill
      if (snapshots && snapshots.length > 0) {
        return {
          _id: sk._id,
          slug: sk.slug,
          level: snapshots[snapshots.length - 1].average
        }
      } else {
        const sum = feedback.reduce((acc, curr) => {
          return acc + curr.level
        }, 0)
        const average = sum / feedback.length
        return {
          _id: sk._id,
          slug: sk.slug,
          level: average
        }
      }
    } else {
      return {
        _id: sk._id,
        slug: sk.slug,
        level: 0
      }
    }
  })
}

const UserProfile = mongoose.model('UserProfile', userProfileSchema)
export default UserProfile
