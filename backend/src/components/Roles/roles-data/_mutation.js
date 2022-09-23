import { isAdmin, isUser } from '~/directives'
import { UserProfile, RoleRequirements, RoleGroup } from '~/models'
import { Types } from 'mongoose'
import { sentryCaptureException } from '~/utils'

export const mutationTypes = `
  type Mutation {
    createRoleInOrganization(roleData: CreateRoleInput!): RoleRequirements @${isAdmin}
    deleteRole(roleId: String!): ID @${isAdmin}
    deleteRoleGroup(groupId: String!): ID @${isAdmin}
    addRoleRequirements(inputData: CreateRoleInput!): RoleRequirements @${isAdmin}
    addRoleGroup(inputData: CreateRoleGroupInput!): RoleGroup @${isAdmin}
    addRoleSuggestion(title: String!): RoleRequirements @${isUser}
  }
`

export const mutationResolvers = {
  Mutation: {
    createRoleInOrganization: async (_, { roleData }) => {
      const { organizationId } = roleData
      const previousRole = await RoleRequirements.findOne({
        _id: roleData._id
      })
      if (previousRole) {
        return RoleRequirements.findOneAndUpdate(
          { _id: previousRole._id },
          { $set: roleData },
          { new: true }
        )
      } else {
        const existingRole = await RoleRequirements.findOne({
          title: roleData.title,
          organizationId
        })
          .select({ _id: 1 })
          .lean()
        if (existingRole) {
          // AVOID DUPLICATE ROLES
          throw new Error(
            `Role with that name already exists${
              roleData.organizationId === null
                ? ' on the platform'
                : ' in the organization'
            }`
          )
        }
        return RoleRequirements.create(roleData)
      }
    },
    deleteRole: async (_, { roleId }) => {
      try {
        const result = await RoleRequirements.findByIdAndRemove(roleId)
        return result._id
      } catch (e) {
        sentryCaptureException(e)
        return null
      }
    },
    deleteRoleGroup: async (_, { groupId }) => {
      try {
        await RoleGroup.findByIdAndRemove(groupId)
        return groupId
      } catch (e) {
        sentryCaptureException(e)
        return null
      }
    },
    addRoleRequirements: async (
      _,
      { inputData },
      { user: { organizationId } }
    ) => {
      try {
        const previousRole = await RoleRequirements.findOne({
          _id: inputData._id
        })
        if (previousRole) {
          const result = await RoleRequirements.findOneAndUpdate(
            { _id: previousRole._id },
            {
              $set: {
                ...inputData,
                suggestion: false
              }
            },
            { new: true }
          )
          return result
        } else {
          const existingRole = await RoleRequirements.findOne({
            title: inputData.title,
            organizationId
          })
            .select({ _id: 1 })
            .lean()
          if (existingRole) {
            // AVOID DUPLICATE ROLES
            throw new Error(
              `Role with that name already exists in the organization`
            )
          } else {
            const result = await RoleRequirements.create({
              ...inputData,
              organizationId
            })
            return result
          }
        }
      } catch (e) {
        sentryCaptureException(e)
        return null
      }
    },
    addRoleGroup: async (_, { inputData }, { user: { organizationId } }) => {
      try {
        const withId = inputData.relatedRoles.map(role => ({
          ...role,
          _id: role._id || new Types.ObjectId(),
          organizationId
        }))

        const relatedRoles = withId.map(({ _id }) => _id)

        const withSteps = withId.map((role, i, array) => {
          if (array[i + 1]) {
            const { _id } = array[i + 1]
            return {
              ...role,
              nextSteps: [_id]
            }
          }
          return role
        })

        await Promise.all(
          withSteps.map(async role => {
            const existingRole = await RoleRequirements.findById(role._id)
              .select({ _id: 1 })
              .lean()
            if (existingRole) {
              await RoleRequirements.findOneAndUpdate(
                { _id: role._id },
                {
                  $set: {
                    ...role
                  }
                }
              )
            } else {
              await RoleRequirements.create({ ...role })
            }
          })
        )

        if (inputData._id) {
          // EDIT
          const result = await RoleGroup.findOneAndUpdate(
            { _id: inputData._id },
            {
              $set: {
                ...inputData,
                relatedRoles
              }
            },
            { new: true }
          )
          return result
        } else {
          // ADD
          const result = await RoleGroup.create({
            ...inputData,
            organizationId,
            relatedRoles
          })
          return result
        }
      } catch (e) {
        sentryCaptureException(e)
        return null
      }
    },
    addRoleSuggestion: async (
      _,
      { title },
      { user: { _id, organizationId } }
    ) => {
      try {
        const previousSuggestion = await RoleRequirements.findOne({
          title,
          suggestion: true
        })

        if (previousSuggestion) return previousSuggestion

        const userProfile = await UserProfile.findOne({ user: _id })
          .select({ selectedWorkSkills: 1 })
          .lean()

        const result = await RoleRequirements.create({
          title,
          userId: _id,
          organizationId,
          coreSkills: userProfile
            ? userProfile.selectedWorkSkills.map(({ _id, slug, level }) => ({
                skillId: _id,
                slug,
                level
              }))
            : [],
          suggestion: true
        })
        return result
      } catch (e) {
        sentryCaptureException(e)
        return null
      }
    }
  }
}
