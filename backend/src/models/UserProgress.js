const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userProgressSchema = new Schema({
  user: String,
  selectedWorkSkills: {
    type: [
      {
        changedAt: {
          type: Date,
          default: Date.now
        },
        snapshot: {
          type: [
            {
              skillId: String,
              slug: String,
              level: Number
            }
          ]
        }
      }
    ]
  },
  neededWorkSkills: {
    type: [
      {
        changedAt: {
          type: Date,
          default: Date.now
        },
        snapshot: {
          type: [
            {
              skillId: String,
              slug: String
            }
          ]
        }
      }
    ]
  },
  selectedInterests: {
    type: [
      {
        changedAt: {
          type: Date,
          default: Date.now
        },
        snapshot: {
          type: [
            {
              interestId: String,
              slug: String
            }
          ]
        }
      }
    ]
  }
})

const UserProgress = mongoose.model('UserProgress', userProgressSchema)
export default UserProgress
