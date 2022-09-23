import { isInnentialAdmin, isUser, isAdmin } from '~/directives'
import { SkillsRecommendation, Skills } from '~/models'
import { Types } from 'mongoose'

export const queryTypes = `
  type Query {
    fetchRecommendedSkills: [Skill] @${isUser}
  }
`

export const queryResolvers = {
  Query: {
    fetchRecommendedSkills: async (_, __, { user: { _id: userId } }) => {
      const recommendation = await SkillsRecommendation.findOne({
        userId
      })
        .select({ _id: 1, history: 1 })
        .lean()

      if (recommendation && recommendation.history) {
        const history = recommendation.history
        const finalSkills = history[history.length - 1].skills || []

        return Skills.find({
          _id: { $in: finalSkills.map(s => s.skillId) }
        }).lean()

        // return (
        //   await Promise.all(
        //     (finalSkills || []).map(async s => {
        //       const skill = await Skills.findById(s.skillId).lean()

        //       if (!skill) return null

        //       return skill
        //     })
        //   )
        // ).filter(skill => !!skill)
      }

      return null
    }
  }
}
