import { isInnentialAdmin, isAdmin } from '~/directives'
import { SkillsFramework } from '~/models'
import { sentryCaptureException } from '~/utils'
import { SCOPES } from '~/config'

export const mutationTypes = `
  type Mutation {
    addFramework(inputData: AddFrameworkInput!): String @${isInnentialAdmin}
    addFrameworkForOrganization(inputData: AddFrameworkInput!, organizationId: ID!): String @${isInnentialAdmin}
    editFramework(inputData: EditFrameworkInput!): String @${isInnentialAdmin}
    deleteFramework(frameworkId: ID!): String @${isAdmin}
    modifyFrameworkForOrganization(inputData: AddFrameworkInput!): Framework @${isAdmin}
  }
`

export const mutationResolvers = {
  Mutation: {
    addFramework: async (_, { inputData }) => {
      const { connectedTo } = inputData
      const existingFramework = await SkillsFramework.findOne({
        connectedTo,
        organizationId: null
      })
      if (existingFramework)
        throw new Error(`A framework for that category already exists`)
      try {
        await SkillsFramework.create(inputData)
        return 'Success'
      } catch (e) {
        throw new Error(e)
      }
    },
    addFrameworkForOrganization: async (_, { inputData, organizationId }) => {
      const { connectedTo } = inputData
      const existingFramework = await SkillsFramework.findOne({
        connectedTo,
        organizationId
      })
      if (existingFramework)
        throw new Error(`A framework for that category already exists`)
      try {
        await SkillsFramework.create({
          ...inputData,
          organizationId
        })
        return 'Success'
      } catch (e) {
        throw new Error(e)
      }
    },
    editFramework: async (_, { inputData }) => {
      const framework = await SkillsFramework.findById(inputData.frameworkId)
      if (!framework) {
        throw new Error(`Framework with ID:${inputData.frameworkId} not found`)
      } else {
        try {
          delete inputData.frameworkId
          await SkillsFramework.findOneAndUpdate(
            { _id: framework._id },
            {
              $set: {
                ...inputData,
                updatedAt: new Date()
              }
            }
          )
          return 'Success'
        } catch (e) {
          throw new Error(e)
        }
      }
    },
    deleteFramework: async (
      _,
      { frameworkId },
      { user: { roles, organizationId } }
    ) => {
      if (roles.indexOf(SCOPES.ROLES.INNENTIAL_ADMIN) !== -1) {
        const framework = await SkillsFramework.findById(frameworkId)
        if (framework) {
          try {
            await SkillsFramework.deleteOne({ _id: frameworkId })
            return 'Success'
          } catch (e) {
            return 'Error'
          }
        }
      } else if (organizationId) {
        const orgFramework = await SkillsFramework.findOne({
          _id: frameworkId,
          organizationId
        })
        if (orgFramework) {
          try {
            await SkillsFramework.deleteOne({ _id: frameworkId })
            return 'Success'
          } catch (e) {
            return 'Error'
          }
        }
      }
      return 'OK'
    },
    modifyFrameworkForOrganization: async (
      _,
      { inputData },
      { user: { organizationId } }
    ) => {
      const { connectedTo } = inputData
      const existingFramework = await SkillsFramework.findOne({
        connectedTo,
        organizationId
      })
      if (existingFramework) {
        delete inputData.type
        delete inputData.connectedTo
        try {
          const result = await SkillsFramework.findOneAndUpdate(
            { _id: existingFramework._id },
            {
              $set: {
                ...inputData,
                updatedAt: new Date()
              }
            },
            { new: true }
          )
          return result
        } catch (e) {
          sentryCaptureException(e)
          return null
        }
      } else {
        try {
          const added = await SkillsFramework.create({
            ...inputData,
            organizationId
          })
          return added
        } catch (e) {
          sentryCaptureException(e)
          return null
        }
      }
    }
  }
}
