// import SKILLS_CATEGORY from '~/environment'
import mongoose from 'mongoose'

const Schema = mongoose.Schema

const ObjectId = Schema.Types.ObjectId

export const skillsRecommendationSchema = new Schema({
  userId: ObjectId,
  history: [
    {
      skills: [
        {
          skillId: ObjectId,
          score: Number
        }
      ],
      date: { type: Date, default: Date.now }
    }
  ]
})

const SkillsRecommendation = mongoose.model(
  'SkillsRecommendation',
  skillsRecommendationSchema
)
export default SkillsRecommendation
