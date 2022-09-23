import { Categories, SkillsFramework, Organization } from '~/models'
import { findFrameworkForSkill } from './utils/_findFrameworkForSkill'

export const types = `
  input NeededSkillInput {
    _id: String!
    name: String!
  }

  type NeededSkill {
    _id: String!
    name: String!
  }

  type Skill {
    _id: String!
    name: String!
    slug: String!
    category: String!
    enabled: Boolean!
    createdAt: DateTime
    updatedAt: DateTime
    organizationSpecific: ID
    usersId: ID
    useCustomCategory: ID
    frameworkId: ID
    orgFrameworkId: ID
    level: Int
    skillId: ID
    contentCount: Int
    mandatory: Boolean
    framework: LevelTexts
  }

  type SkillEdit {
    _id: String!
    name: String!
    category: String
  }

  type SkillStats {
    _id: ID
    name: String
    count: Int
    articles: Int
    books: Int
    eLearning: Int
    tools: Int
    newContent: Int
  }
`

export const typeResolvers = {
  Skill: {
    //   updatedAt: ({ updatedAt, createdAt }) => {
    //     return updatedAt || createdAt
    //   }
    category: async skill => {
      if (skill.useCustomCategory) {
        const customCategory = await Categories.findById(
          skill.useCustomCategory
        )
        if (customCategory) {
          return customCategory.name
        }
        // else {
        //   await Skills.findOneAndUpdate(
        //     { _id: skill._id },
        //     {
        //       $set: {
        //         customCategories: skill.customCategories.filter(
        //           custom =>
        //             custom.category.toString() !==
        //             skill.useCustomCategory.toString()
        //         )
        //       }
        //     }
        //   )
        // }
      }
      const category = await Categories.findById(skill.category)
      if (category) {
        return category.name
      } else return 'Uncagetorised'
    },
    frameworkId: async ({ _id, category, useCustomCategory }, _, context) => {
      const user = context.user
      if (!user) return ''
      let categoryId = ''
      if (useCustomCategory) categoryId = useCustomCategory
      else categoryId = category

      const frameworkId = await findFrameworkForSkill(
        _id,
        categoryId,
        user.organizationId
      )
      return frameworkId
    },
    orgFrameworkId: async ({ _id, orgFrameworkId }, _, context) => {
      const user = context.user
      if (!user) return ''
      if (orgFrameworkId) {
        if (orgFrameworkId === 'no_org') return null
        return orgFrameworkId
      }
      const orgFramework = await SkillsFramework.findOne({
        connectedTo: _id,
        organizationId: user.organizationId
      }).lean()
      if (orgFramework) return orgFramework._id
      else return null
    },
    skillId: ({ _id, skillId }) => skillId || _id,
    mandatory: async ({ _id, mandatory }, _, { user: { organizationId } }) => {
      if (mandatory) return mandatory

      const organization = await Organization.findById(organizationId)
        .select({ mandatorySkills: 1 })
        .lean()

      if (!organization) return false

      const { mandatorySkills = [] } = organization

      return mandatorySkills.some(({ _id: m }) => String(m) === String(_id))
    }
    // displayNeeded: async ({ _id, skillId }) => {
    //   const id = _id || skillId

    //   const count = await LearningContent.countDocuments({ 'relatedPrimarySkills._id': id })

    //   return count > 20
    // }
  }
}
