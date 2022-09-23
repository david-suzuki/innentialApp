import { isInnentialAdmin } from '~/directives'
import { Categories, Organization, Skills, SkillsFramework } from '~/models'
import slug from 'slug'
import { Types } from 'mongoose'

const defaultLevelTexts = {
  level1Text:
    'Basic theoretical understanding of the concepts around the skill',
  level2Text:
    'Ability to use the skill in the work environment with strong support from a mentor/expert',
  level3Text:
    'Ability to use the skill effectively in work environment with light guidance from a mentor/expert',
  level4Text: 'Ability to use the skill effectively in work environment',
  level5Text: 'Full professional proficiency with ability to mentor others'
}

export const mutationTypes = `
  type Mutation {
    addSkillCategory(inputData: SkillCategoryInput!): SkillCategory @${isInnentialAdmin}
    disableSelectedCategoriesForOrganization(categoryIDs: [ID!], organizationId: ID): [SkillCategory] @${isInnentialAdmin}
    enableSelectedCategoriesForOrganization(categoryIDs: [ID!], organizationId: ID): [SkillCategory] @${isInnentialAdmin}
    deleteCategoryFromOrganization(categoryId: ID!, organizationId: ID!): String @${isInnentialAdmin}
    deleteCategory(categoryId: ID!): String @${isInnentialAdmin}
    renameCategory(categoryId: ID!, name: String!): SkillCategory @${isInnentialAdmin}
  }
`

const { ObjectId } = Types

export const mutationResolvers = {
  Mutation: {
    addSkillCategory: async (
      _,
      { inputData: { name, organizationSpecific, merge } }
    ) => {
      const categorySlug = slug(name, {
        replacement: '_'
      }).toUpperCase()
      if (organizationSpecific) {
        const category = await Categories.findOne({
          slug: categorySlug,
          $or: [
            {
              organizationSpecific: null
            },
            {
              organizationSpecific
            }
          ]
        })
        if (category)
          throw new Error(`A category with name:${name} already exists`)
        const result = await Categories.create({
          name,
          organizationSpecific,
          slug: categorySlug
        })
        const defaultFrameworkData = {
          connectedTo: result._id,
          ...defaultLevelTexts
        }
        await SkillsFramework.create({
          ...defaultFrameworkData,
          organizationId: organizationSpecific
        })
        return result
      } else {
        const category = await Categories.findOne({
          slug: categorySlug,
          organizationSpecific: null
        })
        if (category)
          throw new Error(`A category with name:${name} already exists`)
        const duplicateCategories = await Categories.find({
          slug: categorySlug
        })
        if (duplicateCategories.length && duplicateCategories.length > 0) {
          const _id = new ObjectId()
          await Promise.all(
            duplicateCategories.map(async category => {
              const skills = await Skills.find({ category: category._id })
              await Promise.all(
                skills.map(async skill => {
                  await Skills.findOneAndUpdate(
                    { _id: skill._id },
                    { $set: { category: _id } }
                  )
                })
              )
              await Categories.findByIdAndRemove(category._id)
            })
          )
          const result = await Categories.create({
            _id,
            name,
            slug: categorySlug
          })

          const defaultFrameworkData = {
            connectedTo: _id,
            ...defaultLevelTexts
          }
          await SkillsFramework.create({
            ...defaultFrameworkData
          })
          return result
        }
        const result = await Categories.create({ name, slug: categorySlug })

        const defaultFrameworkData = {
          connectedTo: result._id,
          ...defaultLevelTexts
        }
        await SkillsFramework.create({
          ...defaultFrameworkData
        })
        return result
      }
    },
    disableSelectedCategoriesForOrganization: async (
      _,
      { categoryIDs, organizationId }
    ) => {
      const organization = await Organization.findById(organizationId)
      if (!organization) throw new Error(`Organization not found`)

      const normalisedCategories = await Promise.all(
        categoryIDs.map(async id => {
          const category = await Categories.findById(id)
          if (!category) throw new Error(`Category with id: ${id} not found`)

          return category
        })
      )

      const updatedCategories = normalisedCategories.map(category => {
        return {
          _id: category._id,
          slug: category.slug
        }
      })

      const filteredCategories = updatedCategories.filter(
        category =>
          !organization.disabledSkillCategories.some(disabled =>
            disabled._id.equals(category._id)
          )
      )

      await Organization.findOneAndUpdate(
        { _id: organization._id },
        {
          $set: {
            disabledSkillCategories: [
              ...organization.disabledSkillCategories,
              ...filteredCategories
            ]
          }
        }
      )

      return normalisedCategories
    },
    enableSelectedCategoriesForOrganization: async (
      _,
      { categoryIDs, organizationId }
    ) => {
      const organization = await Organization.findById(organizationId)
      if (!organization) throw new Error(`Organization not found`)

      const normalisedCategories = await Promise.all(
        categoryIDs.map(async id => {
          const category = await Categories.findById(id)
          if (!category) throw new Error(`Category with id: ${id} not found`)

          return category
        })
      )

      const filteredCategories = organization.disabledSkillCategories.filter(
        disabled =>
          !normalisedCategories.some(category =>
            category._id.equals(disabled._id)
          )
      )

      await Organization.findOneAndUpdate(
        { _id: organization._id },
        {
          $set: {
            disabledSkillCategories: filteredCategories
          }
        }
      )

      return normalisedCategories
    },
    deleteCategoryFromOrganization: async (
      _,
      { categoryId, organizationId }
    ) => {
      const organization = await Organization.findById(organizationId)
      if (!organization) throw new Error(`Organization not found`)

      const category = await Categories.findById(categoryId)
      if (!category) {
        return 'OK'
      } else {
        if (
          category.organizationSpecific.toString() !== organizationId.toString()
        )
          throw new Error(`Category is not specific to this organization`)

        const skillsInCategory = await Skills.find({
          organizationSpecific: organizationId,
          category: categoryId
        })

        await Promise.all(
          skillsInCategory.map(async skill => {
            await Skills.findOneAndUpdate(
              { _id: skill._id },
              {
                $set: { category: null }
              }
            )
          })
        )

        const filteredSkills = skillsInCategory
          .map(skill => ({
            _id: skill._id,
            name: skill.name
          }))
          .filter(
            skill =>
              !organization.disabledSkills.some(disabled =>
                disabled._id.equals(skill._id)
              )
          )

        const filteredSkillCategories = organization.disabledSkillCategories.filter(
          disabled => category._id.toString() !== disabled._id.toString()
        )

        await Organization.findOneAndUpdate(
          { _id: organization._id },
          {
            $set: {
              disabledSkillCategories: filteredSkillCategories,
              disabledSkills: [
                ...organization.disabledSkills,
                ...filteredSkills
              ]
            }
          }
        )

        const result = await Categories.findByIdAndRemove(category._id)
        return result._id
      }
    },
    deleteCategory: async (_, { categoryId }) => {
      const category = await Categories.findById(categoryId)
      if (!category) {
        return 'OK'
      } else {
        const skills = await Skills.find({ category: category._id })
        await Promise.all(
          skills.map(async skill => {
            await Skills.findOneAndUpdate(
              { _id: skill._id },
              { $set: { category: null, enabled: false } }
            )
          })
        )
        const organizations = await Organization.find()
        await Promise.all(
          organizations.map(async organization => {
            const { disabledSkills } = organization
            const uniqueSkills = skills.filter(
              skill =>
                !disabledSkills.some(
                  disabled => disabled._id.toString() === skill._id.toString()
                )
            )
            const newDisabledSkills = [...disabledSkills, ...uniqueSkills]
            await Organization.findOneAndUpdate(
              { _id: organization._id },
              {
                $set: { disabledSkills: newDisabledSkills }
              }
            )
          })
        )
        const result = await Categories.findByIdAndRemove(category._id)
        return result._id
      }
    },
    renameCategory: async (_, { categoryId, name }) => {
      const category = await Categories.findById(categoryId)
      const categorySlug = slug(name, {
        replacement: '_'
      }).toUpperCase()
      const existing = await Categories.findOne({
        slug: categorySlug
      })
      if (existing && existing._id.toString() !== category._id.toString())
        throw new Error(`A category with name:${name} already exists`)
      if (!category) {
        throw new Error(`Category with id:${categoryId} not found`)
      } else {
        const result = await Categories.findOneAndUpdate(
          { _id: category._id },
          { $set: { name, updatedAt: new Date(), slug: categorySlug } },
          { new: true }
        )
        return result
      }
    }
  }
}
