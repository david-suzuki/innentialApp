import { isAdmin, isUser } from '~/directives'
import { LearningRequest, User, Team, Organization } from '../../../models'
import { NOT_FOUND } from '../../../environment'
import { filterRequestsWithNoUserOrContent } from './utils'

export const queryTypes = `
  type Query {
    fetchRequestsForOrganization: [Request] @${isUser}
    fetchRequestsForUser(user: ID!): [Request] @${isUser}
    fetchUserRequests: [Request] @${isUser}
    fetchRequestsForTeamLeader: [Request] @${isUser}
  }
`

export const queryResolvers = {
  Query: {
    fetchRequestsForOrganization: async (
      _,
      args,
      { user: { organizationId } }
    ) => {
      const requests = await LearningRequest.find({ organizationId })
      return filterRequestsWithNoUserOrContent(requests)
    },
    fetchRequestsForUser: async (
      _,
      { user },
      { user: { _id: approver, organizationId, roles } }
    ) => {
      const userCheck = await User.findOne({ _id: user, organizationId })
        .select({ _id: 1 })
        .lean()

      if (!userCheck) {
        throw new Error(NOT_FOUND)
      }

      const requests = await LearningRequest.find({ user })
      const filteredRequests = filterRequestsWithNoUserOrContent(requests)

      if (roles.includes('ADMIN')) {
        return filteredRequests
      }

      const organization = await Organization.findOne({ _id: organizationId })
        .select({ _id: 1, teamLeadApprovals: 1 })
        .lean()

      if (organization.teamLeadApprovals) {
        const userTeams = await Team.find({ members: user })
          .select({ _id: 1, leader: 1 })
          .lean()

        const userTeamLeads = userTeams.map(t => String(t.leader))

        if (userTeamLeads.includes(String(approver))) {
          return filteredRequests
        }
      }

      return null
    },
    fetchUserRequests: async (_, args, { user: { _id: user } }) => {
      const requests = await LearningRequest.find({ user })
      return filterRequestsWithNoUserOrContent(requests)
    },
    fetchRequestsForTeamLeader: async (_, args, { user: { _id: user } }) => {
      const teams = await Team.find({ leader: user }).lean()
      const members = teams
        .map(({ members }) => [...members])
        .reduce((acc, curr) => [...acc, ...curr], [])

      const requests = await LearningRequest.find({ user: { $in: members } })
      return filterRequestsWithNoUserOrContent(requests)
    }
  }
}
