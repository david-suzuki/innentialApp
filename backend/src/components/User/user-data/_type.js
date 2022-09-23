import {
  Organization,
  Team,
  UserContentInteractions,
  UserProfile,
  Skills,
  Categories,
  Review,
  User,
  UserEvaluation
} from '~/models'
import { getDownloadLink, appUrls } from '~/utils'
import { findFrameworkForSkill } from '../../Skills/skill-data/utils/_findFrameworkForSkill'

const appLink = `${appUrls['user']}`

export const types = `
  type User {
    _id: String!
    firstName: String
    lastName: String
    email: String
    organizationName: String
    hasEvent: Boolean
    leader: Boolean
    roles: [String]
    status: String
    imageLink: String
    location: String
    neededSkills: [NeededSkill]
    roleAtWork: String
    roleId: ID
    selectedWorkSkills: [Skill]
    isReviewer: Boolean
    feedbackLink: String
    publicLink: PublicLink
    isDemoUser: Boolean
    premium: Boolean
    approvals: Boolean
    approvalPromptDisabled: Boolean
    approvalLink: URL
    pendingFeedbackRequests: Int
    corporate: Boolean
    fulfillment: Boolean
    technician: Boolean
    noPaid: Boolean
    hasTeams : Boolean
  }

  type OnboardingInfo {
    onboarded: Boolean
    firstAdmin: Boolean
    userDetailsProvided: Boolean
    skillsToEvaluate: [Skill]
    shortOnboarding: Boolean
    technicianOnboarding: Boolean
    hasAssignedPath: Boolean
  }

  type CompleteUserProfile {
    onboardingInfo: OnboardingInfo
    user: User
  }

  type UserProfileSkills {
    category: String
    level: Int
    name: String
    slug: String
    skillId: String
    _id: String
    frameworkId: ID
  }
  type UserProfileInterests {
    name: String,
    slug: String,
    _id: String
  }
  type UserProfileRelatedLineOfWork {
    name: String,
    _id: String
  }
  type UserProfile {
    _id: String
    user: String
    relatedLineOfWork: UserProfileRelatedLineOfWork
    roleAtWork: String
    roleId: ID
    neededWorkSkills: [UserProfileSkills]
    selectedWorkSkills: [UserProfileSkills]
    selectedInterests: [UserProfileInterests]
  }

  type CompletePublicProfile {
    _id: ID
    status: String
    email: String
    roles: [String]
    firstName: String
    lastName: String
    roleAtWork: String
    roleId: ID
    leader: Boolean
    teamInfo: [String]
    previousTeams: String
    imageLink: String
    location: String
    skillsProfile: UserProfile
    evaluatedSkills:  [EvaluatedSkills]
    rawFeedback: [RawFeedback]
  }

  type UserLearningPreferences {
    types: [String]
    sortMethod: String
    price: [String]
  }

  type AdminUserDetails {
    _id: String!
    firstName: String
    lastName: String
    email: String
    organizationName: String
    leader: Boolean
    roles: [String]
    status: String
    imageLink: String
    isReceivingContentEmails: Boolean
    profile: UserProfile
  }
`

export const typeResolvers = {
  User: {
    status: ({ status }) => {
      if (status === 'disabled') return 'inactive'
      return status
    },
    organizationName: async ({ organizationId }) => {
      if (organizationId) {
        const organization = await Organization.findOne({ _id: organizationId })
        return organization ? organization.organizationName : ''
      }
      return ''
    },
    hasEvent: async ({ organizationId }) => {
      if (organizationId) {
        const organization = await Organization.findOne({ _id: organizationId })
        return organization ? organization.events : false
      }
      return false
    },
    leader: async ({ organizationId, _id }) => {
      if (organizationId) {
        const teams = await Team.find({ organizationId })
        const leaders = teams.map(team => team.leader)
        return leaders.some(leader => leader.equals(_id))
      }
      return false
    },
    imageLink: async ({ _id }) => {
      const link = await getDownloadLink({
        key: 'users/profileImgs',
        expires: 500 * 60,
        _id: _id
      })
      return link
    },
    isReviewer: async ({ _id }) => {
      const userReviewCount = await Review.countDocuments({
        'reviewScope.reviewers': _id
      })
      return userReviewCount > 0
    },
    feedbackLink: ({ feedbackShareKey }) => {
      if (feedbackShareKey) {
        return appLink + '/feedback/' + feedbackShareKey
      } else return ''
    },
    publicLink: ({ externalFeedback }) => externalFeedback,
    roleAtWork: async parent => {
      if (typeof parent.getRoleAtWork === 'function') {
        return parent.getRoleAtWork()
      } else {
        const user = await User.findById(parent._id)
        return user ? user.getRoleAtWork() : ''
      }
    },
    roleId: async parent => {
      if (typeof parent.getRoleId === 'function') {
        return parent.getRoleId()
      } else {
        const user = await User.findById(parent._id)
        return user ? user.getRoleId() : ''
      }
    },
    selectedWorkSkills: async parent => {
      if (typeof parent.getWorkSkills === 'function') {
        return parent.getWorkSkills()
      } else {
        const user = await User.findById(parent._id)
        return user ? user.getWorkSkills() : ''
      }
    },
    premium: async ({ organizationId }) => {
      const organization = await Organization.findById(organizationId)
        .select({ premium: 1 })
        .lean()
      if (organization) return organization.premium
      return false
    },
    corporate: async ({ organizationId }) => {
      const organization = await Organization.findById(organizationId)
        .select({ corporate: 1 })
        .lean()
      if (organization) return organization.corporate
      return false
    },
    approvals: async ({ organizationId }) => {
      const organization = await Organization.findById(organizationId)
        .select({ approvals: 1 })
        .lean()
      if (organization) return organization.approvals
      return false
    },
    fulfillment: async ({ organizationId }) => {
      const organization = await Organization.findById(organizationId)
        .select({ fulfillment: 1 })
        .lean()
      if (organization) return organization.fulfillment
      return false
    },
    approvalLink: ({ _id }) => `${appLink}/user-requests/${_id}`,
    pendingFeedbackRequests: async ({ _id }) =>
      UserEvaluation.countDocuments({ 'requests.userId': _id }),
    noPaid: async ({ organizationId }) => {
      const organization = await Organization.findById(organizationId)
        .select({ noPaid: 1 })
        .lean()
      if (organization) return organization.noPaid
      return false
    },
    hasTeams: async (_, __, context) => {
      const { _id, organizationId } = context.user
      if (_id) {
        try {
          const organization = await Organization.findById(organizationId)
            .select({ corporate: 1 })
            .lean()

          if (organization && organization.corporate) {
            const team = await Team.find({
              organizationId,
              active: true
            })
            if (team) {
              return true
            } else {
              return false
            }
          }
          const team = await Team.find({
            $or: [{ leader: _id }, { members: _id }],
            active: true
          })
          if (team) {
            return true
          } else {
            return false
          }
        } catch (e) {
          return false
        }
      }
    }
  },
  CompletePublicProfile: {
    status: ({ status }) => {
      if (status === 'disabled') return 'inactive'
      return status
    },
    leader: async ({ organizationId, _id }) => {
      if (organizationId) {
        const teams = await Team.find({ organizationId })
          .select({ _id: 1, leader: 1 })
          .lean()
        const leaders = teams.map(team => team.leader)
        return leaders.some(leader => String(leader) === String(_id))
      }
      return false
    }
  },
  AdminUserDetails: {
    organizationName: async ({ organizationId }) => {
      if (organizationId) {
        const organization = await Organization.findOne({ _id: organizationId })
        return organization ? organization.organizationName : ''
      }
      return ''
    },
    leader: async ({ organizationId, _id }) => {
      if (organizationId) {
        const teams = await Team.find({ organizationId })
        const leaders = teams.map(team => team.leader)
        return leaders.some(leader => leader.equals(_id))
      }
      return false
    },
    imageLink: async ({ _id }) => {
      const link = await getDownloadLink({
        key: 'users/profileImgs',
        expires: 500 * 60,
        _id: _id
      })
      return link
    },
    isReceivingContentEmails: async ({ _id }) => {
      const ci = await UserContentInteractions.findOne({ user: _id })
      if (ci) {
        return ci.isReceivingContentEmails
      } else return null
    },
    profile: async ({ _id }) => {
      const up = await UserProfile.findOne({ user: _id })
      if (up) return up
      else return null
    }
  },
  UserProfile: {
    _id: obj => {
      if (Array.isArray(obj)) {
        return obj[0]._id
      } else return obj._id
    },
    user: obj => {
      if (Array.isArray(obj)) {
        return obj[0].user
      } else return obj.user
    },
    neededWorkSkills: async obj => {
      if (Array.isArray(obj)) {
        const finalSkills = await Promise.all(
          obj[0].neededWorkSkills.map(async (sk, idx) => {
            const normalisedSkill = await Skills.findById(sk._id)
            if (normalisedSkill) {
              const { name, category } = normalisedSkill
              const normalisedCategory = await Categories.findById(category)
              if (normalisedCategory) {
                return {
                  _id: `${obj[0]._id}pn${idx}`,
                  skillId: sk._id,
                  category: normalisedCategory.name,
                  name,
                  slug: sk.slug
                }
              } else
                return {
                  _id: `${obj[0]._id}pn${sk._id}`,
                  skillId: sk._id,
                  category: 'Uncategorised',
                  name,
                  slug: sk.slug
                }
            }
          })
        )
        return finalSkills
      } else {
        const { _id, neededWorkSkills } = obj
        const normalisedSkills = await Promise.all(
          neededWorkSkills.map(async (sk, idx) => {
            const normalisedSkill = await Skills.findById(sk._id)
            if (normalisedSkill) {
              const { name, category } = normalisedSkill
              const normalisedCategory = await Categories.findById(category)
              if (normalisedCategory) {
                return {
                  _id: `${_id}sws${sk._id}`,
                  skillId: sk._id,
                  category: normalisedCategory.name,
                  name,
                  slug: sk.slug
                }
              } else
                return {
                  _id: `${_id}sws${sk._id}`,
                  skillId: sk._id,
                  category: 'Uncategorised',
                  name,
                  slug: sk.slug
                }
            }
          })
        )
        return normalisedSkills
      }
    },
    selectedWorkSkills: async (obj, _, { user: { organizationId } }) => {
      if (Array.isArray(obj)) {
        const finalSkills = await Promise.all(
          obj[0].selectedWorkSkills.map(async (sk, idx) => {
            const normalisedSkill = await Skills.findById(sk._id)
            if (normalisedSkill) {
              const { name, category } = normalisedSkill
              const normalisedCategory = await Categories.findById(category)
              if (normalisedCategory) {
                return {
                  _id: `${obj[0]._id}pn${idx}`,
                  skillId: sk._id,
                  level: sk.level,
                  category: normalisedCategory.name,
                  name,
                  slug: sk.slug
                }
              } else
                return {
                  _id: `${obj[0]._id}pn${sk._id}`,
                  skillId: sk._id,
                  level: sk.level,
                  category: 'Uncategorised',
                  name,
                  slug: sk.slug
                }
            }
          })
        )
        return finalSkills
      } else {
        const { _id, selectedWorkSkills } = obj
        const normalisedSkills = await Promise.all(
          selectedWorkSkills.map(async (sk, idx) => {
            const normalisedSkill = await Skills.findById(sk._id)
            if (normalisedSkill) {
              const { name, category, customCategories } = normalisedSkill
              let categoryId = category

              const useCustomCategory = customCategories.find(
                custom =>
                  String(custom.organizationId) === String(organizationId)
              )
              if (useCustomCategory) {
                categoryId = useCustomCategory.category
              }
              let categoryName = 'Uncategorised'
              const normalisedCategory = await Categories.findById(categoryId)
              if (normalisedCategory) {
                categoryName = normalisedCategory.name
              }
              const frameworkId = findFrameworkForSkill(
                sk._id,
                categoryId,
                organizationId
              )

              return {
                _id: `${_id}sws${sk._id}`,
                skillId: sk._id,
                level: sk.level,
                category: categoryName,
                name,
                slug: sk.slug,
                frameworkId
              }
            }
          })
        )
        return normalisedSkills
      }
    }
  }
}
