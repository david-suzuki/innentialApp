import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const Schema = mongoose.Schema

const schema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: String
  },
  {
    timestamps: true
  }
)

schema.plugin(uniqueValidator)

export default mongoose.model('Task', schema)
