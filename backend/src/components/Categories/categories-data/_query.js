import { isInnentialAdmin, isAdmin, isUser } from '~/directives'
import { Categories, Organization, Skills, SkillsFramework } from '~/models'
import slug from 'slug'

export const queryTypes = `
  type Query {
      fetchAllSkillCategories: [SkillCategory] @${isInnentialAdmin}
      fetchSkillCategoriesForOrganization(organizationId: ID!): [SkillCategory] @${isInnentialAdmin}
      fetchSkillCategoriesForOrganizationAdmin: [SkillCategory] @${isUser}
      fetchRegularSkillCategories: [SkillCategory] @${isInnentialAdmin}
      fetchCategoryDuplicateInfo(name: String): Int @${isInnentialAdmin}
      fetchSkillListForCategory(categoryId: ID!): [String] @${isAdmin}
  }
`

export const queryResolvers = {
  Query: {
    fetchAllSkillCategories: async (_, args, context) => {
      const allCategories = await Categories.find().sort({ createdAt: -1 })
      return allCategories
    },
    fetchRegularSkillCategories: async (_, args, context) => {
      const regularCategories = await Categories.find({
        organizationSpecific: null
      }).sort({ createdAt: -1 })
      return regularCategories
    },
    fetchSkillCategoriesForOrganization: async (
      _,
      { organizationId },
      context
    ) => {
      const organization = await Organization.findById(organizationId)
      if (!organization) throw new Error(`Organization not found`)
      const allCategories = await Categories.find({
        $or: [
          {
            organizationSpecific: null
          },
          {
            organizationSpecific: organizationId
          }
        ]
      })
        .sort({ createdAt: -1 })
        .lean()

      const enabledCategories = allCategories.map(category => ({
        ...category,
        enabled: !organization.disabledSkillCategories.some(disabled =>
          disabled._id.equals(category._id)
        )
      }))

      const withFrameworkId = await Promise.all(
        enabledCategories.map(async category => {
          const orgFramework = await SkillsFramework.findOne({
            connectedTo: category._id,
            organizationId
          }).lean()
          return {
            ...category,
            orgFrameworkId: orgFramework ? orgFramework._id : 'no_org'
          }
        })
      )

      return withFrameworkId
    },
    fetchSkillCategoriesForOrganizationAdmin: async (
      _,
      args,
      { user: { organizationId } }
    ) => {
      const organization = await Organization.findById(organizationId)
      if (organization) {
        const allCategories = await Categories.find({
          $or: [
            {
              organizationSpecific: null
            },
            {
              organizationSpecific: organizationId
            }
          ]
        })
          .sort({ createdAt: -1 })
          .lean()
        const enabledCategories = allCategories.filter(
          category =>
            !organization.disabledSkillCategories.some(disabled =>
              disabled._id.equals(category._id)
            )
        )
        return enabledCategories || []
      } else return []
    },
    fetchCategoryDuplicateInfo: async (_, { name }) => {
      if (name && name !== '') {
        const categorySlug = slug(name, {
          replacement: '_',
          lower: true
        }).toUpperCase()
        const existingCategory = await Categories.findOne({
          slug: categorySlug,
          organizationSpecific: null
        })
        if (existingCategory) return -1

        const duplicateCategories = await Categories.find({
          slug: categorySlug,
          organizationSpecific: { $ne: null }
        })
        if (duplicateCategories.length > 0) {
          return duplicateCategories.length
        } else return 0
      } else return 0
    },
    fetchSkillListForCategory: async (
      _,
      { categoryId },
      { user: { organizationId } }
    ) => {
      const organization = await Organization.findById(organizationId)
      if (organization) {
        const allSkills = await Skills.find({
          category: categoryId,
          $or: [
            { organizationSpecific: null },
            { organizationSpecific: organizationId }
          ]
        }).lean()

        const { disabledSkills } = organization
        const filteredSkills = allSkills.filter(
          skill =>
            !disabledSkills.some(
              disabled => String(disabled._id) === String(skill._id)
            )
        )

        const skillNames = filteredSkills.map(skill => skill.name)
        return skillNames
      } else {
        const allSkills = await Skills.find({
          category: categoryId,
          enabled: true,
          organizationSpecific: null
        })
          .select({ name: 1 })
          .lean()
        const skillNames = allSkills.map(skill => skill.name)
        return skillNames
      }
    }
  }
}
