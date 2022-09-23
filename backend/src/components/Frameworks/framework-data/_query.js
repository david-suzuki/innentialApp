import { isInnentialAdmin, isAdmin, isUser } from '~/directives'
import { SkillsFramework /*, Organization */ } from '~/models'

export const queryTypes = `
  type Query {
    fetchOrganizationSkillFrameworks: [Framework] @${isUser}
    fetchSkillFrameworkForID(connectedTo: ID!): Framework @${isAdmin}
    fetchFrameworkEditInfo(frameworkId: ID!): Framework @${isInnentialAdmin}
  }
`

export const queryResolvers = {
  Query: {
    fetchOrganizationSkillFrameworks: async (
      _,
      args,
      { user: { organizationId } }
    ) => {
      if (organizationId) {
        const frameworks = await SkillsFramework.find({
          $or: [{ organizationId: null }, { organizationId }]
        })
        return frameworks
      }
      const frameworks = await SkillsFramework.find({
        organizationId: null
      })
      return frameworks
    },
    fetchSkillFrameworkForID: async (
      _,
      { connectedTo },
      { user: { organizationId } }
    ) => {
      const organizationFramework = await SkillsFramework.findOne({
        connectedTo,
        organizationId
      }).lean()
      if (organizationFramework)
        return {
          ...organizationFramework,
          orgFramework: organizationFramework._id
        }
      else {
        const regularFramework = await SkillsFramework.findOne({
          connectedTo,
          organizationId: null
        }).lean()
        if (regularFramework)
          return {
            ...regularFramework,
            orgFramework: null
          }
        else
          return {
            _id: 'no_framework',
            level1Text: '',
            level2Text: '',
            level3Text: '',
            level4Text: '',
            level5Text: '',
            orgFramework: null
          }
      }
    },
    fetchFrameworkEditInfo: async (_, { frameworkId }) => {
      const framework = await SkillsFramework.findById(frameworkId)
      if (!framework) {
        throw new Error(`Framework with ID:${frameworkId} not found`)
      }
      return framework
    }
  }
}
