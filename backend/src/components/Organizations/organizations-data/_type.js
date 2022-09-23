import { Types } from 'mongoose'
import { Team, User, UserProfile, Skills, SkillsFramework } from '~/models'
import { getDownloadLink, sentryCaptureException, appUrls } from '~/utils'

const appLink = `${appUrls['user']}`

export const types = `
  type DisabledNeededSkill {
    _id: ID!
    name: String!
  }

  type InviteLink {
    link: URL!
    active: Boolean
  }

  type Organization {
    _id: ID!
    organizationName: String!
    isPayingOrganization: Boolean
    createdAt: DateTime!
    admins: [String]!
    slug: String!
    employees(employeesLimit : Int , employeesSkip : Int , selectedSkillsFilter : [ID] , nameFilter : String): [Employees]
    totalEmployees(selectedSkillsFilter : [ID] , nameFilter : String) : Int
    teams (membersLimit :Int , membersSkip : Int): [Team]
    isDemoOrganization: Boolean
    neededSkillsEnabled: Boolean
    disabledNeededSkills: [DisabledNeededSkill]
    locations: [String]
    hasCustomFrameworks: Boolean
    industry: String
    size: String
    feedbackVisible: Boolean
    disabled: Boolean
    premium: Boolean
    inviteLink: InviteLink
    approvals: Boolean
    teamLeadApprovals: Boolean
    corporate: Boolean
    fulfillment: Boolean
    technicians: Boolean
    events: Boolean
  }
  type UserEmployees {
    _id : ID
    organizationId : ID
    totalEmployees(selectedSkillsFilter : [ID] , nameFilter : String) : Int
    employees(employeesLimit : Int , employeesSkip : Int , selectedSkillsFilter : [ID] , nameFilter : String): [Employees]
  }

  type Member {
    _id: ID!
    firstName: String
    lastName: String
    email: String
    roles: [String]
    status: String!
    roleAtWork: String
    imageLink: String
    location: String
    neededSkills: [Skill]
    selectedSkills: [Skill]
  }
  type Inbound {
    _id: ID
    path: String
  }

  type Employees {
    _id: ID
    status: String
    email: String
    roles: [String]
    firstName: String
    lastName: String
    roleAtWork: String
    teamInfo: String
    imageLink: String
    location: String
    registeredFrom: String
    neededSkills: [Skill]
    selectedSkills: [Skill]
    inbound: Inbound

  }

  type TeamRequiredSkills {
    _id: ID
    skillId: ID
    level: Int
  }

  type Team {
    _id: ID
    teamName: String
    slug: String
    leader: Member
    members: [Member]
    membersGetStageReport: Boolean
    totalMembers : Int
    active: Boolean
    createdAt: String
    requiredSkills: [TeamRequiredSkills]
    createdAt: String
    feedbackLink: URL
    publicLink: PublicLink
    recommendedPaths: [LearningPath]
  }
  type PaginatedTeam {
    _id: ID
    teamId : ID
    teamName: String
    slug: String
    leader: Member
    members: [Member]
    membersGetStageReport: Boolean
    totalMembers : Int
    active: Boolean
    createdAt: String
    requiredSkills: [TeamRequiredSkills]
    createdAt: String
    feedbackLink: URL
    publicLink: PublicLink
    recommendedPaths: [LearningPath]

  }

  type TeamMembers {
    _id : ID
    totalTeamMembers : Int
    members: [Member]
  }

  type RelevantUser {
    _id: ID
    img: String
    isActive: Boolean
    label: String
    location: String
    name: String
    profession: String
    status: String
    profileRelevancy: Int
    skills: [RelevantUserSkills]
    goalName: String
    goalId: ID
    goalCompleted: Boolean
    goalEnds: DateTime
  }

  type RelevantUserSkills {
    _id: ID
    level: Int
    name: String
    skillId: String
    relevancyRating: Int
  }

  type CustomInvitationMessage {
    _id: ID!
    customInvitationMessage: String
    customInvitationEnabled: Boolean
  }
`

export const typeResolvers = {
  Employees: {
    status: ({ status }) => {
      if (status === 'disabled') return 'inactive'
      return status
    },
    imageLink: async ({ _id: userId, args }) => {
      return getDownloadLink({
        key: 'users/profileImgs',
        expires: 500 * 60,
        _id: userId
      })
    },
    roleAtWork: async ({ _id: user }) => {
      const employeeProfile = await UserProfile.findOne({ user })
        .select({ roleAtWork: 1 })
        .lean()
      if (employeeProfile) return employeeProfile.roleAtWork
      return ''
    },
    teamInfo: async ({ _id }) => {
      const employeeTeams = await Team.find({
        $or: [{ leader: _id }, { members: _id }],
        active: true
      })
      return employeeTeams.length > 0
        ? `Teams: ${employeeTeams.map(team => team.teamName).join(', ')}`
        : 'Teams: -'
    },
    neededSkills: async ({ _id: user }) => {
      const employeeProfile = await UserProfile.findOne({ user })
        .select({ neededWorkSkills: 1 })
        .lean()
      if (employeeProfile) {
        const skillIds = employeeProfile.neededWorkSkills.map(({ _id }) => _id)
        return Skills.find({ _id: { $in: skillIds } })
      }
      return []
    },
    selectedSkills: async ({ _id: user }) => {
      const employeeProfile = await UserProfile.findOne({ user })
        .select({ selectedWorkSkills: 1 })
        .lean()
      if (employeeProfile) {
        return Promise.all(
          employeeProfile.selectedWorkSkills.map(async ({ _id, level }) => {
            const skill = await Skills.findById(_id).lean()
            return {
              ...skill,
              _id: `${user}-${_id}`,
              skillId: _id,
              level
            }
          })
        )
      }
      return []
    },
    inbound: async (parent, _, { dataSources }) => {
      return {
        _id: parent._id,
        path: async () => {
          const pathId = parent.inbound.path
          if (pathId === undefined) {
            return null
          } else {
            const path = await dataSources.LearningPath.getOne({ _id: pathId })
            return path ? path.name : null
          }
        }
      }
    }
  },
  Organization: {
    admins: async ({ admins }) => {
      const adminEmails = await Promise.all(
        admins.map(async admin => {
          const adminUser = await User.findById(admin)
          if (adminUser) {
            return adminUser.email
          } else return 'User deleted'
        })
      )
      return adminEmails
    },
    employees: async (
      { _id: organizationId },
      { employeesLimit, employeesSkip, nameFilter, selectedSkillsFilter }
    ) => {
      let firstName = ''
      let lastName = ''
      let spacer = false
      if (nameFilter) {
        for (let i = 0; i < nameFilter.length; i++) {
          if (nameFilter.charAt(i) === ' ' && !spacer) {
            spacer = true
          } else {
            if (!spacer) {
              firstName = firstName + nameFilter.charAt(i)
            } else if (spacer) {
              lastName = lastName + nameFilter.charAt(i)
            }
          }
        }
      }

      let users = await User.find({
        organizationId,
        ...(firstName !== '' && { firstName }),
        ...(lastName !== '' && { lastName })
      })
        .skip(employeesSkip)
        .limit(employeesLimit)
      if (selectedSkillsFilter) {
        let usersProfiles = await UserProfile.find({})
      }
      users = users.filter(value => {
        return value !== undefined
      })

      return users
    },
    totalEmployees: async ({ _id: organizationId }, args) => {
      const nameFilter = args.nameFilter
      const selectedSkillsFilter = args.selectedSkillsFilter
      let firstName = ''
      let lastName = ''
      let spacer = false
      if (nameFilter) {
        for (let i = 0; i < nameFilter.length; i++) {
          if (nameFilter.charAt(i) === ' ' && !spacer) {
            spacer = true
          } else {
            if (!spacer) {
              firstName = firstName + nameFilter.charAt(i)
            } else if (spacer) {
              lastName = lastName + nameFilter.charAt(i)
            }
          }
        }
      }

      let users = await User.find({
        organizationId,
        ...(firstName !== '' && { firstName }),
        ...(lastName !== '' && { lastName })
      })

      if (selectedSkillsFilter) {
        users = await Promise.all(
          users.map(async user => {
            const userProfile = await UserProfile.find({
              user: user._id,
              ...(selectedSkillsFilter.length > 0 && {
                selectedWorkSkills: {
                  $elemMatch: {
                    _id: selectedSkillsFilter
                  }
                }
              })
            })

            if (userProfile.length > 0) {
              return user
            }
          })
        )
      }
      users = users.filter(value => {
        return value !== undefined
      })

      return users.length
    },

    teams: async ({ _id }, { membersLimit, membersSkip }) => {
      const teams = await Team.find(
        { organizationId: _id, active: true },
        membersLimit
          ? membersSkip
            ? {
                members: {
                  $slice: [membersSkip, membersLimit]
                }
              }
            : {
                members: { $slice: [0, membersLimit] }
              }
          : membersSkip
          ? {
              members: {
                $slice: [membersSkip, membersLimit]
              }
            }
          : null
      )

      return teams.map(
        ({
          _id,
          teamName,
          slug,
          leader,
          members,
          membersGetStageReport,
          active,
          createdAt,
          recommendedPaths
        }) => ({
          _id,
          teamName,
          slug,
          leader,
          members,
          membersGetStageReport,
          active,
          createdAt,
          recommendedPaths
        })
      )
    },
    hasCustomFrameworks: async ({ _id }) => {
      const frameworkCount = await SkillsFramework.countDocuments({
        organizationId: _id
      })
      return frameworkCount > 0
    },
    inviteLink: async ({ inviteLink }) => {
      if (inviteLink && inviteLink.token) {
        const { token, active } = inviteLink

        return {
          link: `${appLink}/invite?token=${token}`,
          active
        }
      }
      return null
    }
  },
  UserEmployees: {
    _id: new Types.ObjectId(),
    organizationId: parent => {
      return parent._id
    },
    employees: async (
      { _id: organizationId },
      { nameFilter, selectedSkillsFilter, employeesLimit, employeesSkip }
    ) => {
      if (
        (!nameFilter || nameFilter == '') &&
        selectedSkillsFilter &&
        selectedSkillsFilter.length == 0
      ) {
        return User.find({ organizationId: String(organizationId) })
          .skip(employeesSkip)
          .limit(employeesLimit)
      } else {
        const regex = string => {
          const specialCharacters = /[`@!#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.toString()
          let filterString = [...string]
            .map(char => {
              if (specialCharacters.includes(char)) {
                return '\\' + char
              } else {
                return char
              }
            })
            .join('')

          return new RegExp(`((?<!\w)${filterString}\w+)|${filterString}`, 'i')
        }

        let spaceIndex = nameFilter.indexOf(' ')

        let usersProfiles = await UserProfile.find({
          organizationId: String(organizationId),
          ...(nameFilter && nameFilter.length !== 0
            ? { roleAtWork: { $regex: regex(nameFilter) } }
            : {})
        })
        let profilesIds = usersProfiles.map(({ user }) => Types.ObjectId(user))

        let users = await User.find({
          organizationId: String(organizationId),
          ...(nameFilter && nameFilter.length
            ? spaceIndex !== -1
              ? {
                  $or: [
                    {
                      firstName: {
                        $regex: regex(nameFilter.slice(0, spaceIndex))
                      },
                      lastName: {
                        $regex: regex(
                          nameFilter.slice(spaceIndex + 1, nameFilter.length)
                        )
                      }
                    },
                    { _id: profilesIds }
                  ]
                }
              : {
                  $or: [
                    {
                      $or: [
                        { firstName: { $regex: regex(nameFilter) } },
                        { email: { $regex: regex(nameFilter) } }
                      ]
                    },
                    { _id: profilesIds }
                  ]
                }
            : {})
        })

        if (selectedSkillsFilter && selectedSkillsFilter.length > 0) {
          let usersWithSkill = await UserProfile.find({
            organizationId: String(organizationId),
            user: users.map(({ _id }) => String(_id)),
            selectedWorkSkills: {
              $elemMatch: {
                _id: selectedSkillsFilter
              }
            }
          })
          users = users.filter(user => {
            return usersWithSkill.some(userWithSkill => {
              return String(user._id) == String(userWithSkill.user)
            })
          })
        }

        users.splice(0, employeesSkip ? employeesSkip : 0)
        employeesLimit ? users.splice(employeesLimit, users.length) : null
        return users
      }
    },
    totalEmployees: async (
      { _id: organizationId },
      { selectedSkillsFilter, nameFilter }
    ) => {
      if (
        (!nameFilter || nameFilter == '') &&
        selectedSkillsFilter &&
        selectedSkillsFilter.length == 0
      ) {
        return User.find({
          organizationId: String(organizationId)
        }).countDocuments()
      } else {
        const regex = string => {
          const specialCharacters = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.toString()
          let filterString = [...string]
            .map(char => {
              if (specialCharacters.includes(char)) {
                return '\\' + char
              } else {
                return char
              }
            })
            .join('')

          return new RegExp(`((?<!\w)${filterString}\w+)|${filterString}`, 'i')
        }
        let spaceIndex = nameFilter.indexOf(' ')

        let usersProfiles = await UserProfile.find({
          organizationId: String(organizationId),
          ...(nameFilter && nameFilter.length !== 0
            ? { roleAtWork: { $regex: regex(nameFilter) } }
            : {})
        })
        let profilesIds = usersProfiles.map(({ user }) => Types.ObjectId(user))

        let users = await User.find({
          organizationId: String(organizationId),
          ...(nameFilter && nameFilter.length
            ? spaceIndex !== -1
              ? {
                  $or: [
                    {
                      firstName: {
                        $regex: regex(nameFilter.slice(0, spaceIndex))
                      },
                      lastName: {
                        $regex: regex(
                          nameFilter.slice(spaceIndex + 1, nameFilter.length)
                        )
                      }
                    },
                    { _id: profilesIds }
                  ]
                }
              : {
                  $or: [
                    {
                      $or: [
                        { firstName: { $regex: regex(nameFilter) } },
                        { email: { $regex: regex(nameFilter) } }
                      ]
                    },
                    { _id: profilesIds }
                  ]
                }
            : {})
        })

        if (selectedSkillsFilter && selectedSkillsFilter.length > 0) {
          let usersWithSkill = await UserProfile.find({
            organizationId: String(organizationId),
            user: users.map(({ _id }) => String(_id)),
            selectedWorkSkills: {
              $elemMatch: {
                _id: selectedSkillsFilter
              }
            }
          })
          users = users.filter(user => {
            return usersWithSkill.some(userWithSkill => {
              return String(user._id) == String(userWithSkill.user)
            })
          })
        }

        return users.length
      }
    }
  },

  Member: {
    status: ({ status }) => {
      if (status === 'disabled') return 'inactive'
      return status
    }
  },
  Team: {
    leader: async ({ leader, active }) => {
      const user = await User.findById(leader)
      if (!user)
        return {
          _id: '',
          firstName: 'User',
          lastName: 'deleted',
          email: '',
          roles: [],
          status: '',
          roleAtWork: '',
          imageLink: ''
        }
      const { _id, firstName, lastName, email, roles, status, location } = user
      const uProfile = await UserProfile.findOne({ user: user._id })
      const roleAtWork = uProfile && uProfile.roleAtWork
      const imageLink = await getDownloadLink({
        key: 'users/profileImgs',
        expires: 500 * 60,
        _id: leader
      })
      return {
        _id,
        firstName,
        lastName,
        email,
        roles,
        status,
        roleAtWork,
        imageLink,
        location
      }
    },
    members: async ({ members, active }) => {
      if (members && members.length && members.length > 0) {
        let allMembers = await User.find({ _id: members })

        const uProfiles = await UserProfile.find({ user: members })
        allMembers = allMembers.map(async member => {
          const uProfile = uProfiles.find(value => {
            return value.user === Types.ObjectId(member._id).toString()
          })
          const imageLink = await getDownloadLink({
            key: 'users/profileImgs',
            expires: 500 * 60,
            _id: member
          })
          const roleAtWork = uProfile && uProfile.roleAtWork
          return {
            _id: member._id,
            firstName: member.firstName,
            lastName: member.lastName,
            email: member.email,
            roles: member.roles,
            status: member.status,
            roleAtWork: roleAtWork,
            location: member.location,
            imageLink
          }
        })

        return allMembers
        /*
        AllMembers = Promise.all(
          AllMembers.map(async member => {
            const uProfile = await UserProfile.findOne({ user: member._id })
            const roleAtWork = uProfile && uProfile.roleAtWork
            const imageLink = await getDownloadLink({
              key: 'users/profileImgs',
              expires: 500 * 60,
              _id: member._id
            })
            return {
              _id: member._id,
              firstName: member.firstName,
              lastName: member.lastName,
              email: member.email,
              roles: member.roles,
              status: member.status,
              roleAtWork: roleAtWork,
              imageLink: imageLink,
              location: member.location
            }
          })
        )

        return AllMembers
        */
      } else {
        return []
      }
    },
    totalMembers: async ({ _id }) => {
      const totalMembers = (
        await Team.aggregate([
          { $match: { _id: _id } },
          {
            $project: {
              item: 1,
              totalMembers: { $size: '$members' }
            }
          }
        ])
      )[0].totalMembers

      return totalMembers
    },
    createdAt: async ({ createdAt }) => {
      return String(createdAt)
    },
    feedbackLink: ({ feedbackShareKey }) => {
      if (feedbackShareKey) {
        return appLink + '/feedback/' + feedbackShareKey
      } else return null
    },
    publicLink: ({ externalFeedback }) => externalFeedback,
    recommendedPaths: async ({ recommendedPaths }, _, { dataSources }) => {
      const paths = await dataSources.LearningPath.getAll({
        _id: { $in: recommendedPaths }
      })
      return paths
    }
    // stageResultInfo: async ({ _id }) => {
    //   const allResults = await TeamStageResult.find({ teamId: _id })
    //   allResults.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    //   if (allResults.length === 1) {
    //     if (allResults[0].engagement) {
    //       return {
    //         _id: allResults[0]._id,
    //         engagement: allResults[0].engagement,
    //         engagementDelta: 0,
    //         stage: allResults[0].stage
    //       }
    //     } else {
    //       return {
    //         _id: allResults[0]._id,
    //         engagement: 0,
    //         engagementDelta: 0,
    //         stage: 'N/A'
    //       }
    //     }
    //   } else {
    //     if (allResults.length === 0) {
    //       return {
    //         _id: 0,
    //         engagement: 0,
    //         engagementDelta: 0,
    //         stage: 'N/A'
    //       }
    //     }
    //     if (allResults[0].engagement) {
    //       return {
    //         _id: allResults[0]._id,
    //         engagement: allResults[0].engagement,
    //         engagementDelta:
    //           allResults[0].engagement - allResults[1].engagement,
    //         stage: allResults[0].stage
    //       }
    //     } else if (allResults.length > 2) {
    //       return {
    //         _id: allResults[0]._id,
    //         engagement: allResults[1].engagement,
    //         engagementDelta:
    //           allResults[1].engagement - allResults[2].engagement,
    //         stage: allResults[1].stage
    //       }
    //     } else {
    //       return {
    //         _id: allResults[0]._id,
    //         engagement: allResults[1].engagement,
    //         engagementDelta: 0,
    //         stage: allResults[1].stage
    //       }
    //     }
    //   }
    // }
  },
  PaginatedTeam: {
    _id: () => {
      return new Types.ObjectId()
    },
    teamId: ({ _id }) => {
      return _id
    },
    leader: async ({ leader, active }) => {
      const user = await User.findById(leader)
      if (!user)
        return {
          _id: '',
          firstName: 'User',
          lastName: 'deleted',
          email: '',
          roles: [],
          status: '',
          roleAtWork: '',
          imageLink: ''
        }
      const { _id, firstName, lastName, email, roles, status, location } = user
      const uProfile = await UserProfile.findOne({ user: user._id })
      const roleAtWork = uProfile && uProfile.roleAtWork
      const imageLink = await getDownloadLink({
        key: 'users/profileImgs',
        expires: 500 * 60,
        _id: leader
      })
      return {
        _id,
        firstName,
        lastName,
        email,
        roles,
        status,
        roleAtWork,
        imageLink,
        location
      }
    },
    members: async ({ members, active }) => {
      if (members && members.length && members.length > 0) {
        let allMembers = await User.find({ _id: members })

        const uProfiles = await UserProfile.find({ user: members })
        allMembers = allMembers.map(async member => {
          const uProfile = uProfiles.find(value => {
            return value.user === Types.ObjectId(member._id).toString()
          })
          const imageLink = await getDownloadLink({
            key: 'users/profileImgs',
            expires: 500 * 60,
            _id: member
          })
          const roleAtWork = uProfile && uProfile.roleAtWork
          return {
            _id: member._id,
            firstName: member.firstName,
            lastName: member.lastName,
            email: member.email,
            roles: member.roles,
            status: member.status,
            roleAtWork: roleAtWork,
            location: member.location,
            imageLink
          }
        })

        return allMembers
        /*
        AllMembers = Promise.all(
          AllMembers.map(async member => {
            const uProfile = await UserProfile.findOne({ user: member._id })
            const roleAtWork = uProfile && uProfile.roleAtWork
            const imageLink = await getDownloadLink({
              key: 'users/profileImgs',
              expires: 500 * 60,
              _id: member._id
            })
            return {
              _id: member._id,
              firstName: member.firstName,
              lastName: member.lastName,
              email: member.email,
              roles: member.roles,
              status: member.status,
              roleAtWork: roleAtWork,
              imageLink: imageLink,
              location: member.location
            }
          })
        )

        return AllMembers
        */
      } else {
        return []
      }
    },
    totalMembers: async ({ _id }) => {
      const totalMembers = (
        await Team.aggregate([
          { $match: { _id: _id } },
          {
            $project: {
              item: 1,
              totalMembers: { $size: '$members' }
            }
          }
        ])
      )[0].totalMembers

      return totalMembers
    },
    createdAt: async ({ createdAt }) => {
      return String(createdAt)
    },
    feedbackLink: ({ feedbackShareKey }) => {
      if (feedbackShareKey) {
        return appLink + '/feedback/' + feedbackShareKey
      } else return null
    },
    publicLink: ({ externalFeedback }) => externalFeedback,
    recommendedPaths: async ({ recommendedPaths }, _, { dataSources }) => {
      const paths = await dataSources.LearningPath.getAll({
        _id: { $in: recommendedPaths }
      })
      return paths
    }
  },

  RelevantUser: {
    status: ({ status }) => {
      if (status === 'disabled') return 'inactive'
      return status
    },
    img: async ({ _id }) => {
      const imageLink = await getDownloadLink({
        key: 'users/profileImgs',
        expires: 500 * 60,
        _id: _id
      })
      return imageLink
    },
    label: async ({ _id }) => {
      const employeeTeams = await Team.find({
        $or: [{ leader: _id }, { members: _id }],
        active: true
      })

      return employeeTeams.length > 0
        ? `Teams: ${employeeTeams.map(team => team.teamName).join(', ')}`
        : 'Teams: -'
    },
    skills: async ({ _id, skills }) => {
      const mappedSkills = await Promise.all(
        skills.map(async skill => {
          const skillInDb = await Skills.findOne({ _id: skill._id }).lean()
          if (skillInDb) {
            const { level, relevancyRating } = skill
            return {
              _id: `${_id}sws${skill._id}`,
              skillId: skill._id,
              level,
              relevancyRating,
              name: skillInDb.name
            }
          } else {
            sentryCaptureException(
              new Error(`MISSING SKILL IN PROFILE! id=${skill._id}`)
            )
          }
        })
      )
      return mappedSkills
    }
  }
}

// type StageResultInfo {
//   _id: ID
//   engagement: Float
//   stage: String
//   engagementDelta: Float
// }

// stageResultInfo: StageResultInfo
