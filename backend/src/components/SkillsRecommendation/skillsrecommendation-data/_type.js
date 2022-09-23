import Mongoose from 'mongoose'

export const types = `
  type RecommendedSkill {
    _id: ID!
    skillId: ID!
    name: String
  }
`

export const typeResolvers = {
  RecommendedSkill: {
    _id: () => new Mongoose.Types.ObjectId()
  }
}
