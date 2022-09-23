import { Types } from 'mongoose'
import { isInnentialAdmin, isUser, isAdmin } from '~/directives'
import {
  Organization,
  User,
  Team,
  UserProfile,
  OrganizationSettings
} from '~/models'
import { sentryCaptureException } from '~/utils'

export const queryTypes = `
  type Query {
    fetchAllOrganizations(limit: Int, offset: Int, displayPaid: Boolean): [Organization] @${isInnentialAdmin}
    fetchOrganizationsListLength(displayPaid: Boolean):Int @${isInnentialAdmin}
    fetchOrganization(organizationId: ID!): Organization @${isInnentialAdmin}
    fetchCurrentUserOrganization: Organization @${isUser}
    fetchCurrentUserTeams:[Team] @${isUser}
    fetchUserTeamsInOrganization(userId : ID!) : [Team] @${isUser}
    fetchNonUserTeamsInOrganization(userId : ID!) : [Team] @${isUser}
    fetchUsersFromOrganizationWithSkill(skillId : ID) : [Employees] @${isUser}
    fetchCurrentUserOrganizationEmployees : UserEmployees @${isUser}
    fetchIfUserOrganizationExist: ID @${isUser}
    fetchOrganizationLocations: [String] @${isUser}
    fetchOnboardedTeamsInOrganization: [Team] @${isUser}
    fetchRelevantUsersInOrganization: [RelevantUser] @${isUser}
    fetchOrganizationCustomInvitation: CustomInvitationMessage @${isAdmin}
    publicFetchOrganizationIDForToken(token: String!): Organization
  }
`

export const queryResolvers = {
  Query: {
    fetchAllOrganizations: async (
      _,
      { limit, offset, displayPaid },
      context
    ) => {
      const queryParams = displayPaid
        ? { isPayingOrganization: displayPaid }
        : {}
      try {
        const allOrganizations = await Organization.find(queryParams)
          .skip(limit * (offset - 1))
          .limit(limit)
          .sort({ createdAt: -1 })
          .lean()
        return allOrganizations
      } catch (e) {
        sentryCaptureException(e)
        return []
      }
    },
    fetchOrganizationsListLength: async (_, { displayPaid }, args) => {
      const queryParams = displayPaid
        ? { isPayingOrganization: displayPaid }
        : {}
      return Organization.countDocuments(queryParams)
      //   {
      //   organizationSpecific: null,
      //   ...(source && { source }),
      //   ...(filter && { type: filter })
      // })
    },
    fetchUsersFromOrganizationWithSkill: async (_, { skillId }, { user }) => {
      const employees = await User.find({
        organizationId: user.organizationId
      })
      const employeesUserProfile = await UserProfile.find({
        user: employees.map(employee => employee._id),
        selectedWorkSkills: {
          $elemMatch: {
            _id: skillId
          }
        }
      })

      const employeesWithSkill = employeesUserProfile.map(userProfile => {
        return employees.filter(employee => {
          return employee._id.toString() === userProfile.user
        })[0]
      })
      return employeesWithSkill
    },
    fetchOrganization: async (_, { organizationId }, context) => {
      try {
        const organization = await Organization.findOne({ _id: organizationId })
        return organization
      } catch (e) {
        sentryCaptureException(e)
        console.log('There is an error while fetching organizations', e)
        throw new Error('Organization with provided Id has not ben found')
      }
    },
    fetchCurrentUserOrganization: async (_, args, context) => {
      const { _id } = context.user

      if (_id !== undefined) {
        try {
          const user = await User.findById(_id)

          const organizationId = user.organizationId ? user.organizationId : ''
          const organization = await Organization.findById(organizationId)

          if (organization) {
            return organization
          } else {
            return null
          }
        } catch (e) {
          sentryCaptureException(e)
          return null
        }
      } else {
        return null
      }
    },
    fetchCurrentUserTeams: async (_, __, context) => {
      const teams = await Team.find({
        organizationId: context.user.organizationId,
        $or: [
          { leader: context.user._id },
          {
            members: context.user._id
          }
        ]
      })
      return teams
    },
    fetchUserTeamsInOrganization: async (_, { userId }, context) => {
      return Team.find({
        organizationId: context.user.organizationId,
        $or: [
          { leader: { _id: userId } },
          {
            members: userId
          }
        ]
      })
    },
    fetchNonUserTeamsInOrganization: async (_, { userId }, context) => {
      return Team.find({
        organizationId: context.user.organizationId,
        $nor: [{ leader: { _id: userId } }, { members: userId }]
      })
    },
    fetchCurrentUserOrganizationEmployees: async (_, __, context) => {
      const { _id } = context.user

      if (_id !== undefined) {
        try {
          const user = await User.findById(_id)

          const organizationId = user.organizationId ? user.organizationId : ''
          const organization = await Organization.findById(organizationId)

          if (organization) {
            return organization
          } else {
            return null
          }
        } catch (e) {
          sentryCaptureException(e)
          return null
        }
      } else {
        return null
      }
    },

    fetchIfUserOrganizationExist: async (_, __, context) => {
      const { _id } = context.user
      if (_id !== undefined) {
        try {
          const user = await User.findOne({ _id })
          const organizationId = user.organizationId ? user.organizationId : ''
          const organization = await Organization.findOne({
            _id: organizationId
          })
          if (organization) {
            return organization._id
          }
        } catch (e) {
          return null
        }
      } else {
        return null
      }
    },
    fetchOrganizationLocations: async (
      _,
      args,
      { user: { organizationId } }
    ) => {
      if (!organizationId) {
        /*  TODO: HANDLE WITHOUT ORG USERS */
        console.log('Organization id is null')
      }

      const organization = await Organization.findById(organizationId)
      if (organization.locations) {
        return organization.locations
      } else return []
    },
    fetchOnboardedTeamsInOrganization: async (
      _,
      args,
      { user: { organizationId } }
    ) => {
      if (!organizationId) return []
      const teams = await Team.find({ active: true, organizationId })
        .sort({ createdAt: 1 })
        .lean()
      let activeTeams = []
      await Promise.all(
        teams.map(async team => {
          const leadersProfile = await UserProfile.findOne({
            user: team.leader
          })
            .select({ _id: 1 })
            .lean()

          if (leadersProfile) {
            // leader is active, display skill gap
            activeTeams.push(team)
          }
        })
      )
      return activeTeams
    },
    fetchRelevantUsersInOrganization: async (
      _,
      args,
      { user: { _id, organizationId } }
    ) => {
      const currentUserProfile = await UserProfile.findOne({ user: _id }).lean()
      if (currentUserProfile) {
        let relevantprofiles = []
        const { neededWorkSkills, selectedWorkSkills } = currentUserProfile

        const allProfiles = await UserProfile.find({
          organizationId,
          user: { $ne: _id }
        }).lean()
        await Promise.all(
          allProfiles.map(async profile => {
            let profileRelevancy = 0
            const skills = profile.selectedWorkSkills.map(sk => {
              let relevancyRating = 0
              const relevantSkill = neededWorkSkills.find(f => f._id === sk._id)
              const usersOwnSkill = selectedWorkSkills.find(
                f => f._id === sk._id
              )
              if (relevantSkill) {
                ++relevancyRating
                profileRelevancy += sk.level
                if (usersOwnSkill) {
                  if (usersOwnSkill.level <= sk.level) {
                    ++relevancyRating
                    profileRelevancy += sk.level - usersOwnSkill.level + 1
                  } else {
                    profileRelevancy -= sk.level
                  }
                }

                return { ...sk, relevancyRating }
              } else {
                return { ...sk, relevancyRating }
              }
            })

            if (profileRelevancy > 0) {
              const foundEmployee = await User.findOne({
                _id: profile.user,
                status: 'active'
              })
              if (foundEmployee) {
                skills.sort((a, b) => {
                  if (a.relevancyRating === b.relevancyRating) {
                    return b.level - a.level
                  } else return b.relevancyRating - a.relevancyRating
                })
                relevantprofiles.push({
                  _id: foundEmployee._id,
                  isActive: true,
                  status: foundEmployee.status,
                  location: foundEmployee.location || '',
                  name: `${foundEmployee.firstName} ${foundEmployee.lastName}`,
                  profession: profile.roleAtWork,
                  skills,
                  profileRelevancy
                })
              }
            }
          })
        )
        relevantprofiles.sort((a, b) => b.profileRelevancy - a.profileRelevancy)
        return relevantprofiles
      } else {
        return []
      }
    },
    fetchOrganizationCustomInvitation: async (
      _,
      args,
      { user: { organizationId } }
    ) => {
      const settingsCheck = await OrganizationSettings.findOne({
        organizationId
      })
      if (settingsCheck) return settingsCheck
      const newSettings = await OrganizationSettings.create({ organizationId })
      return newSettings
    },
    publicFetchOrganizationIDForToken: async (_, { token }) => {
      return Organization.findOne({
        'inviteLink.token': token,
        'inviteLink.active': true
      })
    }
  }
}
