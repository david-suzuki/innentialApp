import {
  Skills,
  Interests,
  ContentSources,
  Categories,
  TeamSharedContentList,
  Team,
  User,
  UserContentInteractions,
  DevelopmentPlan,
  Goal,
  Organization,
  Subscription
} from '../../../models'
import { appUrls, getDownloadLink } from '~/utils'
import { Types } from 'mongoose'
import { findFrameworkForSkill } from '~/components/Skills/skill-data/utils/_findFrameworkForSkill'

export const types = `
  type Duration {
    _id: ID!
    basis: String
    hoursMin: Int
    hoursMax: Int
    hours: Int
    minutes: Int
    weeks: Int
  }

 type Price {
  _id: ID!
  currency: String!
  value: Float!
 }
 type RelatedPrimarySkill {
   _id: String
   name: String
   skillLevel: Int
   importance: Float
   frameworkId: ID
 }
 type RelatedPrimarySkillEditForm {
   value: [String]
   skillLevel: Int
   importance: Float
    _id: String
 }
 type RelatedSecondarySkill {
  _id: String
  name: String
 }

 type RelatedInterest {
  _id: String
  name: String
 }
 type RelatedIndustry {
  _id: String
  name: String
 }
 type RelatedLineOfWork {
  _id: String
  name: String
 }
 
 type SelectedSecondarySkill {
    key: Int
    value: [String]
    skillId: String
    _id: String
 }
 type SelectedInterest {
    key: Int
    value: String
    _id: String
 }
 type SelectedIndustry {
    key: Int
    value: String
    _id: String
 }
 
 type SelectedPrimarySkill {
    key: Int
    value: [String]
    skillId: String
    _id: String
    skillLevel: Int
    importance: Float
 }
 type LearningContent {
   _id: String!
   title: String!
   url: URL!
   source: ContentSource
   author: String
   type: String!
   price: Price
   duration: Duration
   certified: Boolean
   german: Boolean
   externalRating: Float
   nOfReviews: Int
   organizationSpecific: ID
   relatedPrimarySkills: [RelatedPrimarySkill]
   relatedSecondarySkills: [RelatedSecondarySkill]
   relatedInterests: [RelatedInterest]
   relatedIndustries: [RelatedIndustry]
   relatedLineOfWork: RelatedLineOfWork
   relevanceRating: Float
   publishedDate: DateTime
   startDate: DateTime
   createdAt: DateTime
   spider: String
   newContent: Boolean
   clicked: Boolean
   sharedIn: [String]
   liked: Boolean
   disliked: Boolean
   canUnshare: Boolean
   canShare: Boolean
   canAddToGoal: Boolean
   inDevelopmentPlan: Boolean
   needsApproval: Boolean
   recommended: Boolean
   recommendedBy: Employees
   recommendedAt: DateTime
   imageLink: URL
   averageRating: Float
   uploadedBy: User
   availableWithSubscription: Boolean
 }

 type SharedContent {
  _id: String
  teams: String
  sharedContent: LearningContent
  lastShared: String
  sharedBy: String
  notes: [ContentNotes]
 }

 type ContentNotes {
   _id: String
   userId: String
   note: String
 }

  type LearningContentEditType {
   _id: String!
   title: String!
   url: URL
   source: ContentSource
   author: String
   type: String!
   price: Price
   duration: Duration
   certified: Boolean
   german: Boolean
   externalRating: Float
   nOfReviews: Int
   organizationSpecific: ID
   relatedPrimarySkills: [RelatedPrimarySkillEditForm]
   relatedSecondarySkills: [RelatedSecondarySkill]
   relatedInterests: [RelatedInterest]
   relatedIndustries: [RelatedIndustry]
   relatedLineOfWork: RelatedLineOfWork
   relevanceRating: Float
   publishedDate: DateTime
   startDate: DateTime
   createdAt: DateTime
   selectedSecondarySkills: [SelectedSecondarySkill]
   selectedIndustries: [SelectedIndustry]
   selectedInterests: [SelectedInterest]
   selectedPrimarySkills: [SelectedPrimarySkill]
   imageLink: URL
 }

 type UserContentInteractions {
   user: String
   likedContent: [String],
   dislikedContent: [String]
   currentContent: [String]
   clickedContent: [String]
   pastContent: [String]
   downloadedPdfs: [String]
   learningCredentials: LearningCredentials
 }

 type ScraperData {
   title: String
   publishedDate: DateTime
   author: String
 }

 type URLContentInfo {
   exists: Boolean
   content: LearningContent
   data: ScraperData
 }

 type SearchedContent {
   count: Int
   content: [LearningContent]
 }
 
 type LearningContentGradeRating {
   _id: ID,
   grade: Int,
   count: Int,
   countRatio: Float,
   interesting: Int,
   uninteresting: Int 
 }

 type LearningContentRating {
   _id: ID,
   contentId: ID,
   average: Float,
   count: Int,
   rating: [LearningContentGradeRating]
 }
`

export const typeResolvers = {
  LearningContent: {
    canAddToGoal: async ({ _id }, _, { user: { _id: user } }) => {
      // const devPlan = await DevelopmentPlan.findOne({ user })
      //   .select({ content: 1 })
      //   .lean()
      // if (!devPlan) return false
      // const contentInDevPlan = devPlan.content.some(
      //   ({ contentId }) => String(contentId) === String(_id)
      // )
      const activeGoal = await Goal.findOne({
        user,
        status: 'ACTIVE'
      })
        .select({ _id: 1 })
        .lean()

      return /*! contentInDevPlan && */ !!activeGoal
    },
    inDevelopmentPlan: async ({ _id }, _, { user: { _id: user } }) => {
      const devPlan = await DevelopmentPlan.findOne({
        user,
        'content.contentId': _id
      })
        .select({ _id: 1 })
        .lean()
      return !!devPlan
    },
    needsApproval: async (
      { price: { value } },
      _,
      { user: { organizationId, roles } }
    ) => {
      const organization = await Organization.findById(organizationId)
        .select({ approvals: 1, fulfillment: 1 })
        .lean()
      return (
        organization &&
        organization.approvals &&
        value !== 0 &&
        !roles.includes('ADMIN')
      )
    },
    duration: ({ _id, duration }) => {
      if (!duration) return null
      return {
        ...duration,
        _id
      }
    },
    url: async (
      { awsId, url, source, udemyCourseId },
      _,
      { user: { organizationId } }
    ) => {
      if (url) {
        const availableSubscription = await Subscription.findOne({
          source,
          organizationId,
          active: true
        }).select({ name: 1, accountName: 1 })

        if (availableSubscription) {
          const isUfB =
            availableSubscription.name === 'Udemy for Business' &&
            availableSubscription.accountName
          if (isUfB && udemyCourseId) {
            return `https://${availableSubscription.accountName}.udemy.com/course/${udemyCourseId}/enroll`
          }
        }
        return url
      } else if (awsId) {
        const goodLink = await getDownloadLink({
          _id: awsId,
          key: 'user-content',
          expires: 500 * 60
        })
        if (goodLink) return goodLink
        else return `${appUrls['user']}/bad-aws-link` // TODO: add a route for badlink === delete content etc...
      } else return `${appUrls['user']}/bad-aws-link`
    },
    imageLink: ({ _id }) => {
      return getDownloadLink({ _id, key: 'learning-content/thumbnails' })
    },
    price: async ({ _id, price }) => {
      if (price) {
        const { value, currency } = price
        const priceField = {
          currency,
          value,
          _id
        }
        return priceField
      } else
        return {
          currency: 'EUR',
          value: 0,
          _id
        }
    },
    relatedPrimarySkills: async ({ _id, relatedPrimarySkills }) => {
      if (relatedPrimarySkills.length > 0) {
        return relatedPrimarySkills.map(skill => {
          if (skill._doc) {
            return {
              ...skill._doc,
              _id: _id + ':' + skill._id
            }
          } else {
            return {
              ...skill,
              _id: _id + ':' + skill._id
            }
          }
        })
      }
      return []
    },
    relatedSecondarySkills: async ({ _id, relatedSecondarySkills }) => {
      if (relatedSecondarySkills.length > 0) {
        return relatedSecondarySkills.map(skill => {
          return {
            ...skill,
            _id: _id + ':' + skill._id
          }
        })
      }
      return relatedSecondarySkills
    },
    source: async ({ _id, source, uploadedBy }) => {
      if (source) {
        const contentSource = await ContentSources.findOne({ _id: source })
        if (contentSource) return contentSource
        else
          return {
            _id: '',
            name: ''
          }
      } else if (uploadedBy) {
        const user = await User.findById(uploadedBy)
        if (user) {
          return {
            _id: `${_id}user`,
            name: `Uploaded by: ${user.firstName} ${user.lastName}`
          }
        }
        return {
          _id: `${_id}user`,
          name: 'User uploaded'
        }
      } else
        return {
          _id: `${_id}user`,
          name: 'User uploaded'
        }
    },
    canShare: async (
      { _id },
      someThing,
      { user: { _id: userId, roles, organizationId } }
    ) => {
      const queryParams = roles.includes('ADMIN')
        ? { organizationId, active: true }
        : {
            $or: [{ leader: userId }, { members: userId }],
            active: true
          }
      const usersTeamCount = await Team.count(queryParams)
      const lists = await TeamSharedContentList.find({
        'sharedContent.sharedBy': userId,
        'sharedContent.contentId': _id
      })

      return lists.length !== usersTeamCount
    },
    canUnshare: async ({ _id }, someThing, { user: { _id: userId } }) => {
      const lists = await TeamSharedContentList.find({
        'sharedContent.contentId': _id
      })

      const isUnshareable = lists.some(list => {
        const content = list.sharedContent.find(
          shared => String(shared.contentId) === String(_id)
        )
        if (content) {
          return String(content.sharedBy) === String(userId)
        } else return false
      })

      return isUnshareable
    },
    newContent: ({ publishedDate }) => {
      const now = new Date()
      const week = 604800000
      if (now - publishedDate < week) {
        return true
      } else return false
    },
    liked: async ({ _id }, _, { user: { _id: user } }) => {
      const contentProfile = await UserContentInteractions.findOne({ user })
        .select({ likedContent: 1 })
        .lean()
      if (contentProfile) {
        const { likedContent } = contentProfile
        if (likedContent && likedContent.length > 0) {
          return likedContent.some(likedId => String(likedId) === String(_id))
        }
      }
      return false
    },
    disliked: async ({ _id }, _, { user: { _id: user } }) => {
      const contentProfile = await UserContentInteractions.findOne({ user })
        .select({ dislikedContent: 1 })
        .lean()
      if (contentProfile) {
        const { dislikedContent } = contentProfile
        if (dislikedContent && dislikedContent.length > 0) {
          return dislikedContent.some(
            dislikedId => String(dislikedId) === String(_id)
          )
        }
      }
      return false
    },
    recommended: async ({ _id }, _, { user: { _id: user } }) => {
      const contentProfile = await UserContentInteractions.findOne({ user })
        .select({ recommended: 1 })
        .lean()
      if (contentProfile) {
        const { recommended } = contentProfile
        if (recommended && recommended.length > 0) {
          return recommended.some(
            ({ contentId }) => String(contentId) === String(_id)
          )
        }
      }
      return false
    },
    recommendedBy: async ({ recommendedBy }) => {
      const user = await User.findOne({ _id: recommendedBy })
        .select({ _id: 1, firstName: 1, lastName: 1 })
        .lean()
      if (user) {
        const { _id, firstName, lastName } = user
        return {
          _id,
          firstName,
          lastName,
          imageLink: await getDownloadLink({
            key: 'users/profileImgs',
            expires: 500 * 60,
            _id
          })
        }
      }
      return null
    },
    availableWithSubscription: async (
      { udemyCourseId, source },
      _,
      { user: { organizationId } }
    ) => {
      const availableSubscription = await Subscription.findOne({
        source,
        organizationId,
        active: true
      }).select({ name: 1 })

      if (!availableSubscription) return false

      if (availableSubscription) {
        return availableSubscription.name === 'Udemy for Business'
          ? !!udemyCourseId
          : true
      }
    },
    uploadedBy: async (parent, args, { user, dataSources }) => {
      if (parent.uploadedBy) {
        return User.findById(parent.uploadedBy)
      } else {
        return null
      }
    }
  },
  LearningContentEditType: {
    duration: ({ _id, duration }) => {
      if (Object.entries(duration || {}).length === 0) return null
      return {
        ...duration,
        _id
      }
    },
    price: async ({ _id, price }) => {
      if (price) {
        const { value, currency } = price
        const priceField = {
          currency,
          value,
          _id
        }
        return priceField
      } else
        return {
          currency: 'EUR',
          value: 0,
          _id
        }
    },
    imageLink: ({ _id }) => {
      return getDownloadLink({ _id, key: 'learning-content/thumbnails' })
    },
    selectedSecondarySkills: async ({ relatedSecondarySkills }) => {
      const selectedSecondarySkills = await Promise.all(
        relatedSecondarySkills.map(async (skill, ix) => {
          const rawSkill = await Skills.findById(skill._id).lean()
          if (rawSkill) {
            const category = await Categories.findById(rawSkill.category)
            const categoryName = category ? category.name : 'Uncategorised'
            return {
              key: ix,
              value: [categoryName, rawSkill._id],
              skillId: rawSkill._id,
              _id: rawSkill._id + `${ix}`
            }
          } else
            return {
              key: ix,
              value: [],
              skillId: '',
              _id: `${ix}`
            }
        })
      )

      return selectedSecondarySkills
    },
    selectedIndustries: async ({ relatedIndustries }) => {
      const selectedIndustries = relatedIndustries.map((industry, ix) => ({
        key: ix,
        value: industry._id,
        _id: industry._id
      }))

      return selectedIndustries
    },
    selectedInterests: async ({ relatedInterests }) => {
      const selectedInterest = await Promise.all(
        relatedInterests.map(async (skill, ix) => {
          const rawInterest = await Interests.findById(skill._id).lean()
          if (rawInterest) {
            return {
              key: ix,
              value: rawInterest._id,
              _id: rawInterest._id
            }
          } else
            return {
              key: ix,
              value: '',
              _id: ''
            }
        })
      )

      return selectedInterest
    },
    selectedPrimarySkills: async ({ relatedPrimarySkills }) => {
      const selectedPrimarySkills = await Promise.all(
        relatedPrimarySkills.map(async (skill, ix) => {
          const rawSkill = await Skills.findById(skill._id).lean()
          if (rawSkill) {
            const category = await Categories.findById(rawSkill.category)
            const categoryName = category ? category.name : 'Uncategorised'
            return {
              key: ix,
              value: [categoryName, rawSkill._id],
              skillLevel: skill.skillLevel,
              importance: skill.importance,
              skillId: rawSkill._id,
              _id: rawSkill._id + `${ix}`
            }
          } else
            return {
              key: ix,
              value: [],
              skillLevel: 0,
              importance: 3,
              skillId: '',
              _id: `${ix}`
            }
        })
      )

      return selectedPrimarySkills
    },
    relatedPrimarySkills: async ({ relatedPrimarySkills }) => {
      const relatedPrimarySkillsEditForm = await Promise.all(
        relatedPrimarySkills.map(async (skill, ix) => {
          const rawSkill = await Skills.findById(skill._id).lean()
          if (rawSkill) {
            const category = await Categories.findById(rawSkill.category)
            const categoryName = category ? category.name : 'Uncategorised'
            return {
              value: [categoryName, rawSkill._id],
              skillLevel: skill.skillLevel,
              importance: skill.importance,
              _id: skill._id
            }
          } else
            return {
              value: [],
              skillLevel: 0,
              importance: 3,
              _id: ''
            }
        })
      )

      return relatedPrimarySkillsEditForm
    },
    source: async ({ _id, source }) => {
      if (source) {
        const contentSource = await ContentSources.findOne({ _id: source })
        if (contentSource) return contentSource
        else
          return {
            _id: null,
            name: ''
          }
      } else
        return {
          _id: null,
          name: ''
        }
    }
  },
  UserContentInteractions: {
    learningCredentials: async ({ _id, learningCredentials }) => ({
      ...learningCredentials,
      _id
    })
  },
  LearningContentRating: {
    _id: () => new Types.ObjectId()
  },
  LearningContentGradeRating: {
    _id: () => new Types.ObjectId()
  },
  RelatedPrimarySkill: {
    frameworkId: async ({ _id }, _, context) => {
      const skillId = _id.split(':')[1]

      const user = context.user
      if (!user) return ''

      const skill = await Skills.findById(skillId)
        .select({ category: 1 })
        .lean()

      if (!skill) return ''

      const frameworkId = await findFrameworkForSkill(
        skillId,
        skill.category,
        user.organizationId
      )

      return frameworkId
    }
  }
}
