import {
  Skills,
  Organization,
  LearningContent,
  UserProfile,
  Categories,
  User,
  UserEvaluation,
  Team,
  SkillsFramework,
  RoleRequirements,
  Goal,
  GoalTemplate,
  LearningPathTemplate
} from '~/models'
import { isInnentialAdmin, isUser } from '~/directives'
import slug from 'slug'
import { Types } from 'mongoose'

const defaultLevelTexts = {
  level1Text:
    'Basic theoretical understanding of the concepts around the skill',
  level2Text:
    'Ability to use the skill in the work environment with strong support from a mentor/expert',
  level3Text:
    'Ability to use the skill effectively in work environment with guidance from a mentor/expert',
  level4Text: 'Ability to use the skill effectively in work environment',
  level5Text: 'Full professional proficiency with ability to mentor others'
}

export const mutationTypes = `
  type Mutation {
    userAddSkill(inputData: SkillInput!): Skill @${isUser}
    addSkill(inputData: SkillInput!): Skill @${isInnentialAdmin}
    removeSkill(skillId: ID!): String @${isInnentialAdmin}
    editSkill(inputData: SkillEditInput!, skillId: ID!): Skill @${isInnentialAdmin}
    disableSelectedSkills(skillIDs: [ID!]): [Skill] @${isInnentialAdmin}
    enableSelectedSkills(skillIDs: [ID!]): [Skill] @${isInnentialAdmin}
    addSkillForOrganization(inputData: SkillInput!, organizationId: ID!): Skill @${isInnentialAdmin}
    deleteSkillFromOrganization(skillId: ID!, organizationId: ID!): String @${isInnentialAdmin}
    disableSelectedSkillsForOrganization(skillIDs: [ID!], organizationId: ID!): Boolean @${isInnentialAdmin}
    enableSelectedSkillsForOrganization(skillIDs: [ID!], organizationId: ID!): Boolean @${isInnentialAdmin}
    makeNotMandatoryForOrganization(skills: [NeededSkillInput!], organizationId: ID!): Boolean @${isInnentialAdmin}
    makeMandatoryForOrganization(skills: [NeededSkillInput!], organizationId: ID!): Boolean @${isInnentialAdmin}
    disableNeededSkillsForOrganization(skills: [NeededSkillInput!], organizationId: ID!): [NeededSkill] @${isInnentialAdmin}
    enableNeededSkillsForOrganization(skills: [NeededSkillInput!], organizationId: ID!): [NeededSkill] @${isInnentialAdmin}
    setCustomCategoryForSkill(skillId: ID!, categoryId: ID!, organizationId: ID!): Skill @${isInnentialAdmin}
    resetCustomCategoryForSkill(skillId: ID!, organizationId: ID!): Skill @${isInnentialAdmin}
    initializeNeededSkills(organizationId: ID!): String @${isInnentialAdmin}
  }
`

export const mutationResolvers = {
  Mutation: {
    userAddSkill: async (
      _,
      { inputData: { name, category } },
      { user: { organizationId, _id } }
    ) => {
      const skillSlug = slug(name, {
        replacement: '_',
        lower: true
      })

      const skillCheck = await Skills.findOne({
        name,
        organizationSpecific: [organizationId, null]
      })
      if (skillCheck) throw new Error('A skill with that name already exists')

      let categoryId
      let customCategories = []
      if (category === 'not-listed') {
        const organization = await Organization.findById(organizationId)
        const orgCategory = await Categories.findOne({
          name: organization.organizationName,
          organizationSpecific: organizationId
        })
        if (orgCategory) {
          categoryId = orgCategory._id
          customCategories.push({
            organizationId,
            category: categoryId
          })
        } else {
          const parsedCategoryData = {
            name: organization.organizationName,
            slug: slug(organization.organizationName, {
              replacement: '_',
              lower: true
            }),
            organizationSpecific: organizationId
          }

          const newOrgCategory = await Categories.create(parsedCategoryData)
          categoryId = newOrgCategory._id

          try {
            const defaultFrameworkData = {
              connectedTo: categoryId,
              ...defaultLevelTexts
            }
            await SkillsFramework.create({
              ...defaultFrameworkData,
              organizationId
            })
          } catch (err) {
            console.log(
              `Error while creating default framework: ${err.message}`
            )
          }

          customCategories.push({
            organizationId,
            category: categoryId
          })
        }
      } else categoryId = category

      try {
        const parsedData = {
          name,
          category: categoryId,
          slug: skillSlug,
          usersId: _id,
          organizationSpecific: organizationId,
          customCategories
        }
        const result = await Skills.create(parsedData)
        return result
      } catch (e) {
        console.log(e)
        return null
      }
    },
    addSkill: async (_, { inputData: { name, category } }, { dataSources }) => {
      const skillSlug = slug(name, {
        replacement: '_',
        lower: true
      })

      const skill = await Skills.findOne({ name, organizationSpecific: null })
        .select({ _id: 1 })
        .lean()

      if (skill) throw new Error(`A skill with that name already exists`)

      const skillId = new Types.ObjectId()

      const parsedData = {
        _id: skillId,
        name,
        category,
        slug: skillSlug
      }

      const result = await Skills.create(parsedData)

      const organizationDuplicates = await Skills.find({
        name,
        organizationSpecific: { $ne: null }
      })
        .select({ _id: 1 })
        .lean()

      if (organizationDuplicates.length > 0) {
        const duplicateIds = organizationDuplicates.map(s => s._id)

        await dataSources.Skills.mergeDuplicates(duplicateIds, skillId)

        await Skills.deleteMany({ _id: { $in: duplicateIds } })
      }

      return result
    },
    removeSkill: async (_, { skillId }) => {
      const removedSkill = await Skills.findByIdAndRemove(skillId)
      return removedSkill.name
    },
    editSkill: async (_, { inputData, skillId }) => {
      const skill = await Skills.findById(skillId)
      if (!skill) throw new Error(`Skill not found`)

      const existing = await Skills.findOne({
        name: inputData.name
      })
      if (existing && existing._id.toString() !== skill._id.toString())
        throw new Error(`A skill with name:${inputData.name} already exists`)

      const result = await Skills.findOneAndUpdate(
        { _id: skillId },
        { ...inputData, updatedAt: new Date() },
        { new: true }
      )
      return result
    },
    disableSelectedSkills: async (_, { skillIDs }) => {
      const allOrganizations = await Organization.find()

      const updatedSkills = await Promise.all(
        skillIDs.map(async id => {
          const skill = await Skills.findById(id)
          if (!skill) throw new Error(`Skill with id: ${id} not found`)

          const result = await Skills.findOneAndUpdate(
            { _id: skill._id },
            { $set: { enabled: false, updatedAt: new Date() } },
            { new: true }
          )

          return result
        })
      )

      await Promise.all(
        allOrganizations.map(async organization => {
          const { disabledSkills } = organization
          const uniqueSkills = updatedSkills.filter(
            skill =>
              !disabledSkills.some(
                disabled => disabled._id.toString() === skill._id.toString()
              )
          )
          const newDisabledSkills = [...disabledSkills, ...uniqueSkills]
          const result = await Organization.findOneAndUpdate(
            { _id: organization._id },
            {
              $set: { disabledSkills: newDisabledSkills }
            }
          )
          return result
        })
      )

      return updatedSkills
    },
    enableSelectedSkills: async (_, { skillIDs }) => {
      const allOrganizations = await Organization.find()

      const updatedSkills = await Promise.all(
        skillIDs.map(async id => {
          const skill = await Skills.findById(id)
          if (!skill) throw new Error(`Skill with id: ${id} not found`)
          if (skill.category === null)
            throw new Error(`Skill with id: ${id} has no category`)

          const result = await Skills.findOneAndUpdate(
            { _id: skill._id },
            { $set: { enabled: true, updatedAt: new Date() } },
            { new: true }
          )

          return result
        })
      )

      await Promise.all(
        allOrganizations.map(async organization => {
          const { disabledSkills } = organization
          const newDisabledSkills = disabledSkills.filter(
            disabled =>
              !updatedSkills.some(
                skill => skill._id.toString() === disabled._id.toString()
              )
          )
          const result = await Organization.findOneAndUpdate(
            { _id: organization._id },
            {
              $set: { disabledSkills: newDisabledSkills }
            }
          )
          return result
        })
      )

      return updatedSkills
    },
    addSkillForOrganization: async (
      _,
      { inputData: { name, category }, organizationId }
    ) => {
      const organization = await Organization.findById(organizationId)
      if (!organization) throw new Error(`Organization not found`)

      const skill = await Skills.findOne({
        name,
        organizationSpecific: organization._id
      })
      if (skill)
        throw new Error(
          `A skill with that name already exists for organization with id:${organizationId}`
        )

      const parsedData = {
        name,
        category,
        slug: slug(name, {
          replacement: '_',
          lower: true
        }),
        organizationSpecific: organization._id
      }
      const result = await Skills.create(parsedData)
      return result
    },
    deleteSkillFromOrganization: async (_, { skillId, organizationId }) => {
      const organization = await Organization.findById(organizationId)
      if (!organization) throw new Error(`Organization not found`)

      const skill = await Skills.findById(skillId)
      if (!skill) {
        return 'OK'
      } else {
        await LearningContent.updateMany(
          { 'relatedPrimarySkills._id': skill._id },
          {
            $pull: {
              relatedPrimarySkills: {
                _id: skill._id
              }
            }
          }
        )
        // await dataSources.LearningContent.bulkDelete({
        //   'relatedPrimarySkills._id': { $in: skill._id },
        //   organizationSpecific: organizationId
        // })

        const filteredSkills = organization.disabledSkills.filter(
          disabled => skill._id.toString() !== disabled._id.toString()
        )

        const allProfiles = await UserProfile.find({
          $or: [
            { 'selectedWorkSkills._id': skill._id },
            { 'neededWorkSkills._id': skill._id }
          ]
        })
        if (allProfiles.length > 0) {
          await Promise.all(
            allProfiles.map(async profile => {
              await UserProfile.findOneAndUpdate(
                { _id: profile._id },
                {
                  $pull: {
                    selectedWorkSkills: { _id: skill._id },
                    neededWorkSkills: { _id: skill._id }
                  }
                }
              )
            })
          )
        }
        const allEvaluations = await UserEvaluation.find({
          'skillsFeedback.skillId': skill._id
        }).lean()
        try {
          await Promise.all(
            allEvaluations.map(async evaluation => {
              await UserEvaluation.findOneAndUpdate(
                { _id: evaluation._id },
                {
                  $pull: {
                    skillsFeedback: {
                      skillId: skill._id
                    }
                  }
                }
              )
            })
          )
        } catch (e) {
          throw new Error(
            `Error while removing skill from evaluations: ${e.message}`
          )
        }

        await Organization.findOneAndUpdate(
          { _id: organization._id },
          {
            $set: {
              disabledSkills: filteredSkills
            }
          }
        )

        const result = await Skills.findByIdAndRemove(skill._id)
        return result._id
      }
    },
    disableSelectedSkillsForOrganization: async (
      _,
      { skillIDs, organizationId }
    ) => {
      const organization = await Organization.findById(organizationId)
      if (!organization) throw new Error(`Organization not found`)

      const skills = await Skills.find({
        enabled: true,
        $or: [
          {
            organizationSpecific: null
          },
          {
            organizationSpecific: organizationId
          }
        ]
      })

      const normalisedSkills = await Skills.find({ _id: { $in: skillIDs } })

      const updatedSkills = normalisedSkills.map(skill => {
        return {
          _id: skill._id,
          name: skill.name
        }
      })

      const filteredSkills = updatedSkills.filter(
        skill =>
          !organization.disabledSkills.some(disabled =>
            disabled._id.equals(skill._id)
          )
      )

      if (
        skills.length ===
        organization.disabledSkills.length + filteredSkills.length
      )
        throw new Error(
          `There must be at least one skill available in the organization`
        )

      const employees = await User.find({ organizationId }).lean()
      const employeeIds = employees.map(employee => employee._id)
      const allProfiles = await UserProfile.find({
        $or: [
          { 'selectedWorkSkills._id': { $in: skillIDs } },
          { 'neededWorkSkills._id': { $in: skillIDs } }
        ],
        user: { $in: employeeIds }
      })
      if (allProfiles.length > 0) {
        await Promise.all(
          allProfiles.map(async profile => {
            await UserProfile.findOneAndUpdate(
              { _id: profile._id },
              {
                $pull: {
                  selectedWorkSkills: { _id: { $in: skillIDs } },
                  neededWorkSkills: { _id: { $in: skillIDs } }
                }
              }
            )
          })
        )
      }
      await Organization.findOneAndUpdate(
        { _id: organization._id },
        {
          $set: {
            disabledSkills: [...organization.disabledSkills, ...filteredSkills]
          }
        }
      )

      return true
    },
    enableSelectedSkillsForOrganization: async (
      _,
      { skillIDs, organizationId }
    ) => {
      const organization = await Organization.findById(organizationId)
      if (!organization) throw new Error(`Organization not found`)

      const normalisedSkills = await Skills.find({ _id: { $in: skillIDs } })

      const filteredSkills = organization.disabledSkills.filter(
        disabled =>
          !normalisedSkills.some(
            skill => skill._id.toString() === disabled._id.toString()
          )
      )

      await Organization.findOneAndUpdate(
        { _id: organization._id },
        {
          $set: {
            disabledSkills: filteredSkills
          }
        }
      )

      return true
    },
    makeNotMandatoryForOrganization: async (_, { skills, organizationId }) => {
      await Organization.findOneAndUpdate(
        { _id: organizationId },
        {
          $pullAll: {
            mandatorySkills: [...skills]
          }
        }
      )
      return true
    },
    makeMandatoryForOrganization: async (_, { skills, organizationId }) => {
      await Promise.all(
        skills.map(async ({ _id, name }) => {
          return UserProfile.updateMany(
            {
              organizationId,
              'selectedWorkSkills._id': {
                $ne: _id
              }
            },
            {
              $push: {
                selectedWorkSkills: {
                  _id,
                  slug: slug(name, {
                    replacement: '_',
                    lower: true
                  }),
                  level: 0
                }
              },
              $set: {
                updatedAt: new Date()
              }
            }
          )
        })
      )

      await Organization.findOneAndUpdate(
        { _id: organizationId },
        {
          $addToSet: {
            mandatorySkills: {
              $each: skills
            }
          }
        }
      )
      return true
    },
    enableNeededSkillsForOrganization: async (
      _,
      { skills, organizationId }
    ) => {
      const organization = await Organization.findById(organizationId)
      if (!organization) throw new Error(`Organization not found`)
      await Organization.findOneAndUpdate(
        { _id: organizationId },
        {
          $pullAll: {
            disabledNeededSkills: [...skills]
          }
        }
      )
    },
    disableNeededSkillsForOrganization: async (
      _,
      { skills, organizationId }
    ) => {
      const organization = await Organization.findById(organizationId)
      if (!organization) throw new Error(`Organization not found`)

      const orgSkills = await Skills.find({
        enabled: true,
        $or: [
          {
            organizationSpecific: null
          },
          {
            organizationSpecific: organizationId
          }
        ]
      })

      const orgSkillsIds = orgSkills.map(skill => skill._id)

      const skillsValidated = () => {
        return !!skills.find(skill => !orgSkillsIds.includes(skill._id))
      }

      if (skillsValidated()) {
        const skillIds = skills.map(skill => skill._id)
        const employees = await User.find({ organizationId }).lean()
        const employeeIds = employees.map(employee => employee._id)
        const allProfiles = await UserProfile.find({
          'neededWorkSkills._id': { $in: skillIds },
          user: { $in: employeeIds }
        })
        if (allProfiles.length > 0) {
          await Promise.all(
            allProfiles.map(async profile => {
              await UserProfile.findOneAndUpdate(
                { _id: profile._id },
                {
                  $pull: {
                    neededWorkSkills: { _id: { $in: skillIds } }
                  }
                }
              )
            })
          )
        }
        await Organization.findOneAndUpdate(
          { _id: organizationId },
          {
            $set: {
              disabledNeededSkills: [
                ...organization.disabledNeededSkills,
                ...skills
              ]
            }
          }
        )
      }
      return [...organization.disabledNeededSkills, ...skills]
    },
    setCustomCategoryForSkill: async (
      _,
      { skillId, categoryId, organizationId }
    ) => {
      const organization = await Organization.findById(organizationId)
      if (!organization)
        throw new Error(`Organization with ID:${organizationId} not found`)

      const skill = await Skills.findById(skillId)
      if (!skill) throw new Error(`Skills with ID:${skillId} not found`)

      const category = await Categories.findById(categoryId)
      if (!category) throw new Error(`Skills with ID:${categoryId} not found`)

      const { organizationSpecific } = skill
      if (
        organizationSpecific &&
        organizationSpecific.toString() === organizationId.toString()
      ) {
        const result = await Skills.findOneAndUpdate(
          { _id: skill._id },
          {
            $set: {
              category: category._id
            }
          }
        )
        return result
      } else {
        const result = await Skills.findOneAndUpdate(
          { _id: skill._id },
          {
            $set: {
              customCategories: [
                ...skill.customCategories,
                {
                  organizationId,
                  category: category._id
                }
              ]
            }
          }
        )
        return result
      }
    },
    resetCustomCategoryForSkill: async (_, { skillId, organizationId }) => {
      const organization = await Organization.findById(organizationId).lean()
      if (!organization)
        throw new Error(`Organization with ID:${organizationId} not found`)

      const skill = await Skills.findById(skillId).lean()
      if (!skill) throw new Error(`Skills with ID:${skillId} not found`)

      const filteredCustomCategories = skill.customCategories.filter(
        custom =>
          custom.organizationId.toString() !== organization._id.toString()
      )

      const result = await Skills.findOneAndUpdate(
        { _id: skill._id },
        {
          $set: {
            customCategories: filteredCustomCategories
          }
        }
      )

      if (
        !skill.category &&
        !organization.disabledSkills.some(
          disabled => disabled._id.toString() === skillId.toString()
        )
      ) {
        await Organization.findOneAndUpdate(
          { _id: organization._id },
          {
            $set: {
              disabledSkills: [...organization.disabledSkills, { ...skill }]
            }
          }
        )
      }

      return result
    },
    initializeNeededSkills: async (_, { organizationId }) => {
      const organization = await Organization.findById(organizationId).lean()
      if (!organization)
        throw new Error(`Organization with ID:${organizationId} not found`)
      await Organization.findOneAndUpdate(
        { _id: organization._id },
        {
          $set: {
            neededSkillsEnabled: true
          }
        }
      )
    }
  }
}
