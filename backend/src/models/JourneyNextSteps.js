import mongoose from 'mongoose'

const Schema = mongoose.Schema

const ObjectId = Schema.Types.ObjectId

export const journeyNextStepsSchema = new Schema(
  {
    user: {
      type: ObjectId,
      required: true
    },
    awaitingXLP: Boolean
  },
  {
    timestamps: true
  }
)

const JourneyNextSteps = mongoose.model(
  'JourneyNextSteps',
  journeyNextStepsSchema
)
export default JourneyNextSteps
