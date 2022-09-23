import { SkillsFramework } from '~/models'

export const types = `
  type SkillCategory {
    _id: String!
    name: String!
    slug: String!
    organizationSpecific: String
    createdAt: DateTime
    updatedAt: DateTime
    enabled: Boolean
    frameworkId: ID
    orgFrameworkId: ID
  }
`

export const typeResolvers = {
  SkillCategory: {
    frameworkId: async ({ _id }) => {
      const framework = await SkillsFramework.findOne({
        connectedTo: _id,
        organizationId: null
      }).lean()
      if (framework) return framework._id
      else return null
    },
    orgFrameworkId: async (
      { _id, orgFrameworkId },
      _,
      { user: { organizationId } }
    ) => {
      if (orgFrameworkId) {
        if (orgFrameworkId === 'no_org') return null
        return orgFrameworkId
      }
      const orgFramework = await SkillsFramework.findOne({
        connectedTo: _id,
        organizationId
      }).lean()
      if (orgFramework) return orgFramework._id
      else return null
    }
  }
}
