import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const userEvaluationSchema = new Schema({
  // evaluations: {
  //   type: [
  //     {
  //       evaluatedBy: ObjectId,
  //       evaluatedAt: {
  //         type: Date,
  //         default: Date.now
  //       },
  //       skills: {
  //         type: [
  //           {
  //             skillId: ObjectId,
  //             membersLevel: Number,
  //             evaluatedLevel: Number
  //           }
  //         ]
  //       }
  //     }
  //   ]
  // },
  feedback: {
    type: [
      {
        evaluatedBy: ObjectId,
        evaluatedAt: {
          type: Date,
          default: Date.now
        },
        external: {
          _id: ObjectId,
          firstName: String,
          lastName: String,
          email: String
        },
        content: String,
        skillFeedback: [
          {
            skillId: ObjectId,
            level: Number
          }
        ]
      }
    ],
    default: []
  },
  requests: [
    {
      userId: ObjectId,
      requestedAt: {
        type: Date,
        default: new Date()
      }
    }
  ],
  skillsFeedback: [
    {
      skillId: ObjectId,
      feedback: [
        {
          evaluatedBy: ObjectId,
          external: {
            _id: ObjectId,
            firstName: String,
            lastName: String,
            email: String
          },
          evaluatedAt: {
            type: Date,
            default: Date.now
          },
          level: Number
        }
      ],
      snapshots: [
        {
          takenAt: {
            type: Date,
            default: Date.now
          },
          average: Number
        }
      ]
    }
  ],
  user: {
    type: ObjectId,
    required: true
  }
})

const UserEvaluation = mongoose.model('UserEvaluation', userEvaluationSchema)
export default UserEvaluation
