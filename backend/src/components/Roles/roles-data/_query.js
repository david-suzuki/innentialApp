import { isInnentialAdmin, isUser, isAdmin } from '~/directives'
import { RoleRequirements, RoleGroup } from '~/models'

export const queryTypes = `
  type Query {
    fetchAllRoles(organizationId: String): [RoleRequirements] @${isInnentialAdmin}
    fetchRoles(organizationOnly: Boolean): [RoleRequirements] @${isUser}
    fetchRoleSuggestions: [RoleRequirements] @${isAdmin}
    fetchRoleGroups: [RoleGroup] @${isUser}
    fetchUserRoleGap(user: ID, roleId: ID): [SkillDetailsData] @${isUser}
    fetchNextRoles(roleId: ID): [RoleRequirements] @${isUser}
  }
`

export const queryResolvers = {
  Query: {
    fetchAllRoles: async (_, { organizationId }) => {
      return RoleRequirements.find({
        organizationId
      })
        .sort({ _id: -1 })
        .lean()
      // let organizationRoles = []
      // let restOfRoles = []
      // if (organizationId && organizationId.length > 12) {
      //   organizationRoles = await RoleRequirements.find({
      //     organizationId
      //   }).lean()
      //   restOfRoles = await RoleRequirements.find({
      //     organizationId: null
      //   }).lean()
      // } else {
      //   restOfRoles = await RoleRequirements.find().lean()
      // }

      // const allRoles = [...organizationRoles, ...restOfRoles]
      // return allRoles
    },
    fetchRoles: async (_, args, { user: { organizationId } }) => {
      // const orQuery = organizationOnly
      //   ? [{ organizationId }]
      //   : [{ organizationId }, { organizationId: null }]

      const roles = await RoleRequirements.find({
        organizationId
      })
        .sort({ createdAt: -1 })
        .lean()
      return roles
    },
    fetchRoleSuggestions: async (_, args, { user: { organizationId } }) => {
      const suggestions = await RoleRequirements.find({
        organizationId,
        suggestion: true
      })
        .sort({ createdAt: -1 })
        .lean()

      return suggestions
    },
    fetchRoleGroups: async (_, args, { user: { organizationId } }) => {
      const roleGroups = await RoleGroup.find({
        organizationId
      })
        .sort({ createdAt: -1 })
        .lean()

      const roleIds = roleGroups.reduce((acc, { relatedRoles }) => {
        const array = acc
        relatedRoles.forEach(related => {
          if (!array.some(roleId => String(roleId) === String(related)))
            array.push(related)
        })
        return array
      }, [])

      const ungroupedRoles = await RoleRequirements.find({
        _id: { $nin: roleIds },
        organizationId,
        suggestion: false
      })
        .sort({ createdAt: -1 })
        .lean()

      const ungroupedGroup = {
        _id: 'default:ungrouped',
        groupName: 'Ungrouped',
        relatedRoles: ungroupedRoles
      }

      return [...roleGroups, ungroupedGroup]
    },
    fetchUserRoleGap: async (_, args, { dataSources }) => {
      return dataSources.UserProfile.getRoleGapInfo(args)
    },
    fetchNextRoles: async (_, { roleId }) => {
      const role = await RoleRequirements.findById(roleId)
        .select({ nextSteps: 1 })
        .lean()
      if (role) return RoleRequirements.find({ _id: { $in: role.nextSteps } })
      return []
    }
  }
}
