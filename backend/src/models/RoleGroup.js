const mongoose = require('mongoose')
const Schema = mongoose.Schema

const { ObjectId } = Schema.Types

const roleGroupSchema = new Schema({
  groupName: {
    type: String,
    required: true
  },
  organizationId: {
    type: String,
    default: null
  },
  description: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  relatedRoles: [ObjectId]
})

const RoleGroup = mongoose.model('RoleGroup', roleGroupSchema)
export default RoleGroup
