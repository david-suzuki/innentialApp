// import SKILLS_CATEGORY from '~/environment'
import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

export const skillsSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  // category: {
  //   type: String,
  //   required: true,
  //   enum: SKILLS_CATEGORY
  // },
  category: {
    type: ObjectId,
    required: true
  },
  customCategories: [
    {
      organizationId: ObjectId,
      category: ObjectId
    }
  ],
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  enabled: {
    type: Boolean,
    default: true
  },
  organizationSpecific: ObjectId,
  usersId: ObjectId,
  contentCount: Number
})

const Skills = mongoose.model('Skills', skillsSchema)
export default Skills
