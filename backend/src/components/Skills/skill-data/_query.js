import { isUser, isInnentialAdmin, isAdmin } from '~/directives'
import {
  Skills,
  Organization,
  LearningContent,
  Team,
  UserProfile,
  User,
  UserEvaluation,
  SkillsFramework
} from '~/models'
import { sentryCaptureException } from '~/utils'
import { LearningPathTemplate } from '../../../models'

export const queryTypes = `
  type Query {
    fetchAllSkills: [Skill] @${isInnentialAdmin}
    fetchSkillEditForm(skillId: ID!): SkillEdit @${isInnentialAdmin}
    fetchRegularSkills: [Skill] @${isUser}
    fetchOrganizationSpecificSkills: [Skill] @${isUser}
    fetchOrganizationSkillsForAdmin(organizationId: ID!): [Skill] @${isInnentialAdmin}
    fetchAmountOfContentForSkill(skillId: ID!): Int @${isInnentialAdmin}
    fetchSkillDeleteInfo(skillId: ID!): String @${isInnentialAdmin}
    fetchSkillStats: [SkillStats] @${isInnentialAdmin}
    fetchDuplicateSkillInfo(name: String): Int @${isInnentialAdmin}
    fetchNeededSkillUserList(skillId: ID!, teamId: ID): [User] @${isUser}
    fetchNeededSkillTeamList(skillId: ID!): [Team] @${isAdmin}
    skillsExistInPaths(skillIds: [ID!]): Boolean @${isUser}
  }
`

export const queryResolvers = {
  Query: {
    fetchAllSkills: async (_, args, context) => {
      const allSkills = await Skills.find().sort({
        createdAt: -1
      })
      return allSkills
    },
    fetchRegularSkills: async (_, args, context) => {
      const regularSkills = await Skills.find({
        organizationSpecific: null
      })
      return regularSkills
    },
    fetchSkillEditForm: async (_, { skillId }) => {
      const skill = await Skills.findById(skillId).lean()
      if (!skill) throw new Error(`Skill with provided id couldn't be found`)
      else return skill
    },
    fetchOrganizationSpecificSkills: async (
      _,
      args,
      { user: { organizationId } }
    ) => {
      const allSkills = await Skills.find()

      const organization = await Organization.findById(organizationId)
      if (!organization) {
        sentryCaptureException(
          `Couldn't find organization with id:${organizationId}`
        )
        return allSkills.filter(skill => {
          const { organizationSpecific } = skill
          return !organizationSpecific
        })
      } else {
        const organizationSpecificSkills = allSkills
          .filter(
            skill =>
              !organization.disabledSkills.some(
                disabled => disabled._id.toString() === skill._id.toString()
              )
          )
          .filter(skill => {
            const { organizationSpecific } = skill
            return (
              !organizationSpecific ||
              organizationSpecific.toString() === organization._id.toString()
            )
          })

        return organizationSpecificSkills.map(skill => {
          const ix = skill.customCategories.findIndex(
            custom =>
              custom.organizationId.toString() === organizationId.toString()
          )
          if (ix !== -1) {
            return {
              ...skill._doc,
              useCustomCategory: skill.customCategories[ix].category
            }
          } else
            return {
              ...skill._doc
            }
        })
      }
    },
    fetchOrganizationSkillsForAdmin: async (_, { organizationId }) => {
      const organization = await Organization.findById(organizationId)
      if (!organization) throw new Error(`Organization not found`)

      const allSkills = await Skills.find({
        $or: [
          { organizationSpecific: organizationId },
          { organizationSpecific: null }
        ]
      })
        .sort({
          createdAt: -1
        })
        .lean()

      const withFrameworkId = await Promise.all(
        allSkills.map(async skill => {
          const orgFramework = await SkillsFramework.findOne({
            connectedTo: skill._id,
            organizationId
          }).lean()
          return {
            ...skill,
            orgFrameworkId: orgFramework ? orgFramework._id : 'no_org'
          }
        })
      )

      const organizationSpecificSkills = withFrameworkId
        // .filter(skill => {
        //   const { organizationSpecific } = skill
        //   return (
        //     !organizationSpecific ||
        //     organizationSpecific.equals(organization._id)
        //   )
        // })
        .map(skill => ({
          ...skill,
          enabled: !organization.disabledSkills.some(
            disabled => disabled._id.toString() === skill._id.toString()
          )
        }))
        .map(skill => ({
          ...skill,
          mandatory: organization.mandatorySkills.some(
            mS => String(mS._id) === String(skill._id)
          )
        }))
        .map(skill => {
          if (skill.customCategories && skill.customCategories.length > 0) {
            const ix = skill.customCategories.findIndex(
              custom =>
                custom.organizationId.toString() === organizationId.toString()
            )
            if (ix !== -1) {
              return {
                ...skill,
                useCustomCategory: skill.customCategories[ix].category
              }
            }
          }
          return skill
        })

      return organizationSpecificSkills
    },
    fetchAmountOfContentForSkill: async (_, { skillId }) => {
      return LearningContent.countDocuments({
        'relatedPrimarySkills._id': { $in: skillId }
      })
    },
    fetchSkillDeleteInfo: async (_, { skillId }) => {
      let confirmMessage = ''

      const teams = await Team.find({
        requiredSkills: { $elemMatch: { skillId } }
      })
        .select({ teamName: 1 })
        .lean()

      if (teams.length > 0) {
        confirmMessage = 'Teams with skill: '
        const teamNames = teams.map(t => t.teamName)
        confirmMessage = confirmMessage + teamNames.join(', ') + '; '
      }
      const nOfContent = await LearningContent.countDocuments({
        'relatedPrimarySkills._id': { $in: skillId }
      })

      if (nOfContent > 0) {
        confirmMessage =
          confirmMessage +
          `Learning content with skill: ${nOfContent} amount of content;`
      }

      const allProfiles = await UserProfile.find({
        $or: [
          { 'neededWorkSkills._id': { $in: skillId } },
          { 'selectedWorkSkills._id': { $in: skillId } }
        ]
      })
        .select({ user: 1 })
        .lean()

      if (allProfiles.length > 0) {
        const allNames = await Promise.all(
          allProfiles.map(async up => {
            const user = await User.findById(up.user)
              .select({ firstName: 1 })
              .lean()

            if (user) {
              return user.firstName
            } else {
              return 'Not found'
            }
          })
        )
        confirmMessage =
          confirmMessage + `Users with skill: ${allNames.join(', ')}; `
      }

      const evaluatedUsers = await UserEvaluation.find({
        'skillsFeedback.skillId': skillId
      })
        .select({ user: 1 })
        .lean()

      if (evaluatedUsers.length > 0) {
        const allNames = await Promise.all(
          evaluatedUsers.map(async eu => {
            const user = await User.findById(eu.user)
              .select({ firstName: 1 })
              .lean()
            if (user) {
              return user.firstName
            } else {
              return 'Not found'
            }
          })
        )
        confirmMessage =
          confirmMessage +
          `Users who were evaluated with skill: ${allNames.join(', ')} ;`
      }

      return confirmMessage
    },
    fetchSkillStats: async () => {
      const allSkills = await Skills.find()
        .select({ _id: 1, name: 1 })
        .lean()

      const allSkillIds = allSkills.map(skill => skill._id)

      const allProfiles = await UserProfile.find({
        'neededWorkSkills._id': { $in: allSkillIds }
      })
        .select({ user: 1, neededWorkSkills: 1 })
        .lean()

      const skillProfilesMap = allProfiles.reduce((map, profile) => {
        profile['neededWorkSkills'].forEach(skill => {
          if (!map[skill._id]) {
            map[skill._id] = [profile]
          } else {
            map[skill._id].push(profile)
          }
        })
        return map
      }, {})

      const allUserIds = allProfiles.map(p => p.user)

      const allUsers = await User.find({ _id: { $in: allUserIds } })
        .select({ _id: 1, email: 1 })
        .lean()

      const allUsersMap = allUsers.reduce(
        (map, user) => ((map[user._id] = user), map),
        {}
      )

      const allLearningContents = await LearningContent.find({
        'relatedPrimarySkills._id': { $in: allSkillIds }
      })
        .select({
          _id: 1,
          publishedDate: 1,
          type: 1,
          relatedPrimarySkills: 1
        })
        .lean()

      const skillLearningContentsMap = allLearningContents.reduce(
        (map, content) => {
          content['relatedPrimarySkills'].forEach(skill => {
            if (!map[skill._id]) {
              map[skill._id] = [content]
            } else {
              map[skill._id].push(content)
            }
          })
          return map
        },
        {}
      )

      const now = new Date()
      const oneWeek = 604800000

      const skillStats = await Promise.all(
        allSkills.map(async skill => {
          const profiles = skillProfilesMap[skill._id] || []

          const realProfiles = await Promise.all(
            profiles.map(async profile => {
              const user = allUsersMap[profile.user]

              if (user) {
                const dummyCheck = user.email.split('@')
                if (
                  String(dummyCheck[0]) === String(profile.user) &&
                  dummyCheck[1] === 'innential.com'
                ) {
                  return null
                }

                const testAccount = dummyCheck[0].split('+')
                return testAccount.length > 1 ? null : true
              } else {
                return null
              }
            })
          )

          const count = realProfiles.reduce(
            (acc, curr) => (curr ? acc + 1 : acc),
            0
          )

          const content = skillLearningContentsMap[skill._id] || []

          const {
            ARTICLE: articles = [],
            'E-LEARNING': eLearning = [],
            BOOK: books = []
          } = content.reduce((acc, curr) => {
            const { type } = curr
            return {
              ...acc,
              [type]: [...(acc[type] || []), curr]
            }
          }, {})

          const newArticles = articles.reduce((acc, { publishedDate }) => {
            if (now - publishedDate < oneWeek) return acc + 1
            else return acc
          }, 0)
          // const eLearning = await LearningContent.find({
          //   'relatedPrimarySkills._id': skill._id,
          //   type: 'E-LEARNING'
          // }).lean()
          const newELearning = eLearning.reduce((acc, { publishedDate }) => {
            if (now - publishedDate < oneWeek) return acc + 1
            else return acc
          }, 0)
          // const books = await LearningContent.find({
          //   'relatedPrimarySkills._id': skill._id,
          //   type: 'BOOK'
          // }).lean()
          const newBooks = books.reduce((acc, { publishedDate }) => {
            if (now - publishedDate < oneWeek) return acc + 1
            else return acc
          }, 0)
          // const tools = await LearningContent.find({
          //   'relatedPrimarySkills._id': skill._id,
          //   type: 'TOOL'
          // }).lean()

          const newContent = newArticles + newBooks + newELearning
          return {
            _id: skill._id,
            name: skill.name,
            count,
            articles: articles.length,
            eLearning: eLearning.length,
            books: books.length,
            tools: 0,
            newContent
          }
        })
      )
      return skillStats
    },
    fetchDuplicateSkillInfo: async (_, { name }) => {
      if (name && name !== '') {
        const existingSkill = await Skills.findOne({
          name,
          organizationSpecific: null
        })
        if (existingSkill) return -1

        const duplicateSkills = await Skills.find({
          name,
          organizationSpecific: { $ne: null }
        })
        if (duplicateSkills.length > 0) {
          return duplicateSkills.length
        } else return 0
      } else return 0
    },
    fetchNeededSkillUserList: async (
      _,
      { skillId, teamId },
      { user: { organizationId } }
    ) => {
      let userProfiles = []
      if (teamId) {
        const team = await Team.findById(teamId)
          .select({ leader: 1, members: 1 })
          .lean()

        if (team) {
          userProfiles = await UserProfile.find({
            user: { $in: [...team.members, team.leader] },
            'neededWorkSkills._id': skillId
          })
        } else sentryCaptureException(`Team ${teamId} not found`)
      } else {
        userProfiles = await UserProfile.find({
          'neededWorkSkills._id': skillId,
          organizationId
        })
      }
      const userData = []
      await Promise.all(
        userProfiles.map(async profile => {
          const user = await User.findById(profile.user).lean()
          if (user) {
            const { roleAtWork } = profile
            const neededSkills = await Promise.all(
              profile.neededWorkSkills.map(async skill => {
                const { _id } = skill
                const normalisedSkill = await Skills.findById(_id).lean()
                return {
                  ...normalisedSkill
                }
              })
            )
            userData.push({
              ...user,
              roleAtWork,
              neededSkills
            })
          } else sentryCaptureException(`User:${profile.user} not found`)
        })
      )
      return userData
    },
    fetchNeededSkillTeamList: async (
      _,
      { skillId },
      { user: { organizationId } }
    ) => {
      const teams = await Team.find({
        active: true,
        'requiredSkills.skillId': skillId,
        organizationId
      })
      return teams
    },
    skillsExistInPaths: async (_, { skillIds }) => {
      const paths = await LearningPathTemplate.find({
        active: true, // EXTRA CONDITIONS FOR PUBLISHED LPs
        hasContent: true,
        skills: {
          $in: skillIds
        }
      })
        .select({ _id: 1 })
        .lean()

      return paths.length > 0
    }
  }
}
