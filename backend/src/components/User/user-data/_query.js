import {
  User,
  UserProfile,
  UserContentInteractions,
  Team,
  UserEvaluation
  // Review,
  // Goal
} from '~/models'
import { canReadProfile, isInnentialAdmin, isUser, isAdmin } from '~/directives'
import { getUploadLink, sentryCaptureException, getDownloadLink } from '~/utils'
import getUserOnboardingInfo from './utils/_getUserOnboardingInfo'

export const queryTypes = `
  type Query {
    fetchAllUsers(filter: String, limit: Int, offset: Int): [User] @${isInnentialAdmin}
    findUsers(search: String!): [User] @${isInnentialAdmin}
    fetchUsersListLength: Int @${isInnentialAdmin}
    fetchUser(userId: ID!): AdminUserDetails @${isInnentialAdmin}
    currentUser: User @${canReadProfile}
    currentUserProfile: CompleteUserProfile @${canReadProfile}
    currentUserSkillsProfile: UserProfile @${canReadProfile}
    currentUserPreferredTypes: UserLearningPreferences @${canReadProfile}
    getImgUploadLink(contentType: String): String @${isUser}
    fetchOrganizationUserProfiles: [UserProfile] @${isAdmin}
    fetchUsersProfile(userId: String!): CompletePublicProfile @${isUser}
  }`

export const queryResolvers = {
  Query: {
    currentUser: async (_, args, context) => {
      const user = await User.findById(context.user._id)
      return user
    },
    fetchAllUsers: async (_, { filter = '', offset, limit }, context) => {
      try {
        const users = await User.find({
          $or: [
            { firstName: new RegExp(filter, 'i') },
            { lastname: new RegExp(filter, 'i') },
            { email: new RegExp(filter, 'i') }
          ]
        })
          .sort({
            _id: -1
          })
          .skip(limit * (offset - 1))
          .limit(limit)
          .lean()
        return users
      } catch (e) {
        sentryCaptureException(e)
        console.log('There is an error while fetching users', e)
        return []
      }
    },
    findUsers: async (_, { search }) => {
      const searchRegex = new RegExp(
        `${search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}`,
        'i'
      )
      return User.find({
        $or: [
          { firstName: { $regex: searchRegex } },
          { lastName: { $regex: searchRegex } },
          { email: { $regex: searchRegex } }
        ]
      })
    },
    fetchUsersListLength: async (_, args) => {
      return User.countDocuments()
    },
    fetchUser: async (_, { userId }, context) => {
      try {
        const user = await User.findOne({ _id: userId })

        return user
      } catch (e) {
        sentryCaptureException(e)
        console.log('There is an error while fetching user', e)
        throw new Error(`User with provided id ${userId} has not ben found`)
      }
    },
    currentUserProfile: async (_, args, { user: { _id } }) => {
      try {
        const user = await User.findOne({ _id })

        if (!user) throw new Error(`User ${_id} not found`)

        return {
          user,
          onboardingInfo: await getUserOnboardingInfo(_id)
        }
      } catch (e) {
        sentryCaptureException(e)
        return null
      }
    },
    currentUserSkillsProfile: async (_, args, context) => {
      const { _id } = context.user
      if (_id !== undefined) {
        try {
          const userProfile = await UserProfile.findOne({ user: _id })
          if (userProfile) {
            return userProfile
          } else {
            return null
          }
        } catch (e) {
          sentryCaptureException(e)
          return null
        }
      }
    },
    getImgUploadLink: async (_, { contentType }, { user }) => {
      const userId = user._id
      return getUploadLink({
        key: 'users/profileImgs',
        _id: userId,
        contentType
      })
    },
    fetchOrganizationUserProfiles: async (
      _,
      args,
      { user: { organizationId } }
    ) => {
      try {
        const allUsers = await User.find({ organizationId })
        const allProfiles = await Promise.all(
          allUsers.map(async m => {
            const mProfile = await UserProfile.find({ user: m._id })
            return mProfile
          })
        )

        if (allProfiles.length > 0) return allProfiles
        else return []
      } catch (e) {
        sentryCaptureException(e)
        return null
      }
    },
    currentUserPreferredTypes: async (_, args, { user: { _id } }) => {
      if (_id !== undefined) {
        try {
          const contentProfile = await UserContentInteractions.findOne({
            user: _id
          })
          if (contentProfile) {
            const { preferredTypes, sortMethod, price } = contentProfile
            return {
              types: preferredTypes,
              sortMethod,
              price
            }
          } else {
            return {
              types: [],
              sortMethod: '',
              price: []
            }
          }
        } catch (e) {
          sentryCaptureException(e)
          return {
            types: [],
            sortMethod: '',
            price: []
          }
        }
      }
    },
    fetchUsersProfile: async (_, { userId }, { user: { organizationId } }) => {
      const user = await User.findById(userId)
      if (!user || String(user.organizationId) !== String(organizationId))
        return new Error('User not found!')

      const { _id, status, email, roles, firstName, lastName, location } = user
      const employeeTeams = await Team.find({
        $or: [{ leader: _id }, { members: _id }],
        active: true
      })

      const previousTeams = await Team.find({
        $or: [{ leader: _id }, { members: _id }],
        active: false
      })

      const employeeProfile = await UserProfile.findOne({ user: _id })
      // if (!employeeProfile) return new Error('User not found')

      const membersEvaluation = await UserEvaluation.findOne({ user: _id })
      let evaluatedSkills = []
      let rawFeedback = []
      if (membersEvaluation) {
        const { skillsFeedback } = membersEvaluation
        skillsFeedback.forEach(skill => {
          // const ownSkill = employeeProfile.selectedWorkSkills.find(s => String(s._id) === String(skill.skillId))
          evaluatedSkills.push({
            _id: skill._id,
            skillId: skill.skillId,
            // membersLevel: ownSkill ? ownSkill.level : 0,
            evaluatedLevel:
              skill.feedback.length > 0
                ? skill.feedback.reduce((acc, curr) => (acc += curr.level), 0) /
                  skill.feedback.length
                : 0
          })

          rawFeedback.push({
            _id: skill._id,
            skillId: skill.skillId,
            feedback: skill.feedback.map(({ evaluatedAt, level, _id }) => ({
              _id,
              evaluatedAt,
              evaluatedLevel: level
            }))
          })
        })
      } // else not evaluated

      const imageLink = await getDownloadLink({
        key: 'users/profileImgs',
        expires: 500 * 60,
        _id: _id
      })
      return {
        _id,
        status,
        email,
        roles,
        organizationId,
        firstName,
        lastName,
        imageLink,
        location,
        roleAtWork: employeeProfile ? employeeProfile.roleAtWork : '',
        roleId: employeeProfile ? employeeProfile.roleId : null,
        teamInfo:
          employeeTeams.length > 0
            ? employeeTeams.map(team => team.teamName)
            : [],
        previousTeams:
          previousTeams.length > 0
            ? `${previousTeams.map(team => team.teamName).join(', ')}`
            : null,
        skillsProfile: employeeProfile,
        evaluatedSkills,
        rawFeedback
      }
    }
  }
}
