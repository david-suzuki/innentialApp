import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const Schema = mongoose.Schema

const schema = new Schema(
  {
    goalName: {
      type: String,
      required: true
    },
    goalType: String,
    measures: [String],
    relatedSkills: [Schema.Types.ObjectId],
    content: [
      {
        contentId: Schema.Types.ObjectId,
        note: String,
        order: Number
      }
    ],
    mentors: [Schema.Types.ObjectId],
    tasks: [Schema.Types.ObjectId]
  },
  {
    timestamps: true
  }
)

schema.plugin(uniqueValidator)

export default mongoose.model('GoalTemplate', schema)
