import { isInnentialAdmin, isUser, isAdmin } from '~/directives'
import {
  Team,
  TeamLearningContent,
  User,
  UserProfile,
  UserEvaluation,
  Skills,
  Categories,
  Organization,
  DevelopmentPlan,
  Goal,
  LearningPathTemplate
} from '~/models'
import { Types } from 'mongoose'
import {
  removeDuplicates,
  sentryCaptureException,
  getDownloadLink
} from '~/utils'
import { findFrameworkForSkill } from '../../Skills/skill-data/utils/_findFrameworkForSkill'
import { fetchDevelopmentPlanWithStats } from '../../DevelopmentPlan/development-plan-data/_query'

export const queryTypes = `
  type Query {
    fetchTeamLearningContent: [TeamLearningContent] @${isInnentialAdmin}
    fetchCurrentUserOrganizationTeamsIds : [ID] @${isUser}
    fetchUsersTeam(userId: String!): Team @${isUser}
    fetchTeam(teamId : ID!): Team @${isUser}
    fetchFilteredEmployeesNotPartOfTeam(teamId : ID! , email : String ) : [Employees]
    fetchFilteredEmployees(email : String , alreadyAssigned : [ID]) : [Employees]
   
    fetchTeamMembers(teamId : ID! , membersLimit : Int , membersSkip : Int) : TeamMembers @${isUser}
    
    fetchArchivedTeams: [Team] @${isAdmin}
    fetchEvaluationInfo: EvaluateInfoType @${isUser}
    fetchRequiredTeamSkills(teamId: String!): [UserProfileSkills] @${isUser}
    fetchTeamEvaluationsForOrganization(offset: Int, search: String): [TeamSkillGapItem] @${isUser}
    fetchLatestTeamEvaluation(teamId: String! , search : String): [TeamEvaluatedSkill] @${isUser}
    fetchOrganizationEvaluation: OrganizationEvaluation @${isUser}
    fetchOrganizationEvaluationToo: [TeamEvaluatedSkill] @${isUser}

    fetchSkillDetailsInTeam(teamId: String!, skillId: String!): [SkillDetailsData] @${isUser}
    fetchSkillAvailableInOrganization(teamId: String!, skillId: String!): [SkillDetailsData] @${isUser}
    fetchTeamFeedbackEvaluation(teamId: ID!): [TeamEvaluatedSkill] @${isUser}

    fetchTeamLearningPathsProgress(teamId: ID!, filter: String): [TeamPathStatistics] @${isUser}
  }
`

// type TeamEvaluatedSkill {
//   _id: ID!
//   name: String
//   skillAvailable: Float
//   skillNeeded: Float
//   users: [String]
//   usersInOrganization: [String]
// }
/* UTILITY FUNCTION FOR EVALUATIONS! */
// const getLatestTeamEvaluation = async ({ teamId }) => {
//   const team = await Team.findById(teamId)
//   const leadersProfile = await UserProfile.findOne({ user: team.leader })
//   // THE LEADER HASN'T ONBOARDED YET!
//   if (!leadersProfile) return null

//   let memberEvaluations = []
//   let allProfiles = await Promise.all(
//     team.members.map(async member => {
//       const memberProf = await UserProfile.findOne({ user: member })
//       const membersEvaluation = await UserEvaluation.findOne({ user: member })
//       if (membersEvaluation) {
//         // TODO: SELECT Relevant evaluation to display
//         const { skillsFeedback } = membersEvaluation

//         const skills = skillsFeedback.map(skill => {
//           // const ownSkill = memberProf.selectedWorkSkills.find(s => String(s._id) === String(skill.skillId))
//           return {
//             _id: skill._id,
//             skillId: skill.skillId,
//             // membersLevel: ownSkill ? ownSkill.level : 0,
//             evaluatedLevel:
//               skill.feedback.length > 0
//                 ? skill.feedback.reduce((acc, curr) => (acc += curr.level), 0) /
//                   skill.feedback.length
//                 : 0
//           }
//         })

//         memberEvaluations.push({
//           _id: membersEvaluation._id,
//           userId: membersEvaluation.user,
//           skills
//         })
//       }
//       return memberProf
//     })
//   )

//   allProfiles.push(leadersProfile)

//   const unEvaluatedUsers = allProfiles.reduce((acc = [], curr) => {
//     if (curr) return [...acc, curr]
//     else return acc
//   }, [])
//   const latestEval = {
//     evaluatedBy: team.leader,
//     requiredSkills: team.requiredSkills,
//     memberEvaluations,
//     teamId: team._id,
//     _id: new Types.ObjectId()
//   }

//   if (latestEval)
//     return {
//       _id: `${latestEval._id}+${teamId}`,
//       evaluation: latestEval,
//       unEvaluatedUsers
//     }

//   return null
// }

const getTeamSkillGapInfo = async ({
  team,
  userProfiles,
  userData,
  filterSkills = () => true,
  search
}) => {
  const { leader, members, requiredSkills = [] } = team

  const teamUserIds = [leader, ...members]

  const selectedSkills = userProfiles.reduce((acc, curr) => {
    const skills = curr.selectedWorkSkills || []
    return [
      ...acc,
      ...skills.map(skill => ({
        ...skill._doc,
        user: curr.user
      }))
    ]
  }, [])

  const selectedTeamSkills = selectedSkills.filter(({ user }) =>
    teamUserIds.some(userId => String(userId) === String(user))
  )

  const evaluatedSkills = (
    await Promise.all(
      userProfiles.map(async profile => ({
        user: profile.user,
        evaluatedSkills: await profile.getEvaluatedSkills()
      }))
    )
  ).reduce(
    (acc, curr) => [
      ...acc,
      ...curr.evaluatedSkills.map(skill => ({
        ...skill,
        user: curr.user
      }))
    ],
    []
  )

  const evaluatedTeamSkills = evaluatedSkills.filter(({ user }) =>
    teamUserIds.some(userId => String(userId) === String(user))
  )

  const skills = await Skills.find({
    _id: {
      $in: [
        ...selectedTeamSkills.map(({ _id }) => _id),
        ...requiredSkills.map(({ skillId }) => skillId)
      ]
    },
    ...(search && {
      name: {
        $regex: new RegExp(
          `${search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}`,
          'i'
        )
      }
    })
  })
    .select({ _id: 1, name: 1 })
    .lean()

  const finalSkills = skills
    .filter(filterSkills)
    .map(({ _id: skillId, name }) => {
      const available = selectedSkills.filter(
        ({ _id }) => String(_id) === String(skillId)
      )

      const evaluated = evaluatedSkills.filter(
        ({ _id }) => String(_id) === String(skillId)
      )

      let skillNeeded

      const required = requiredSkills.find(
        req => String(req.skillId) === String(skillId)
      )

      if (required) {
        skillNeeded = required.level
      }

      const usersInOrganization = userData
        .filter(user =>
          available.some(skill => String(skill.user) === String(user._id))
        )
        .map(user => {
          let level = 0

          const evaluatedSkill = evaluated.find(
            skill => String(skill.user) === String(user._id)
          )

          if (!evaluatedSkill || evaluatedSkill.level === 0) {
            const availableSkill = selectedSkills.find(
              skill => String(skill.user) === String(user._id)
            )
            if (availableSkill) level = availableSkill.level
          } else level = evaluatedSkill.level

          return {
            _id: new Types.ObjectId(),
            userId: user._id,
            name: user.firstName
              ? `${user.firstName} ${user.lastName}`
              : user.email,
            level
          }
        })

      const availableInTeam = selectedTeamSkills.filter(
        skill => skill.level > 0 && String(skill._id) === String(skillId)
      )

      const evaluatedInTeam = evaluatedTeamSkills.filter(
        skill => skill.level > 0 && String(skill._id) === String(skillId)
      )

      const users = usersInOrganization.filter(({ userId }) =>
        teamUserIds.some(inTeam => String(inTeam) === String(userId))
      )

      users.sort((a, b) => b.level - a.level)

      const skillAvailable =
        evaluatedInTeam.length > 0
          ? Math.max(...evaluatedInTeam.map(skill => skill.level))
          : availableInTeam.length > 0
          ? Math.max(...availableInTeam.map(skill => skill.level))
          : 0

      return {
        _id: new Types.ObjectId(),
        skillId,
        name,
        skillAvailable,
        skillNeeded,
        usersForTooltip: users.slice(0, 10),
        users: users.length,
        usersInOrganization: usersInOrganization.length
      }
    })
    .filter(skill => skill.skillAvailable > 0 || skill.skillNeeded > 0)

  return finalSkills
}

const getTeamSkillGapInfoForSearch = async ({ search, organizationId }) => {
  const searchRegExp = new RegExp(
    `${search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}`, //eslint-disable-line
    'i'
  )

  const skills = await Skills.find({ name: { $regex: searchRegExp } })
    .select({ _id: 1, name: 1 })
    .lean()

  const userProfiles = await UserProfile.find({
    'selectedWorkSkills._id': { $in: skills.map(({ _id }) => _id) },
    organizationId
  }).select({ user: 1, selectedWorkSkills: 1 })

  const userIds = userProfiles.map(({ user }) => user)

  const userData = await User.find({ _id: { $in: userIds } })
    .select({ _id: 1, firstName: 1, lastName: 1, email: 1 })
    .lean()

  const teams = await Team.find({
    $or: [{ leader: { $in: userIds } }, { members: { $in: userIds } }]
  })
    .select({ _id: 1, teamName: 1, requiredSkills: 1, members: 1, leader: 1 })
    .sort({ createdAt: -1 })
    .lean()

  return Promise.all(
    teams.map(async team => ({
      _id: team._id,
      teamName: team.teamName,
      skills: await getTeamSkillGapInfo({
        team,
        userProfiles,
        userData,
        filterSkills: skill =>
          skills.some(
            ({ _id: skillId }) => String(skillId) === String(skill._id)
          )
      })
    }))
  )
}

export const queryResolvers = {
  Query: {
    //

    fetchCurrentUserOrganizationTeamsIds: async (_, args, context) => {
      const { _id, organizationId } = context.user
      if (_id) {
        try {
          const organization = await Organization.findById(organizationId)
            .select({ corporate: 1 })
            .lean()

          if (organization && organization.corporate) {
            let teams = await Team.find({
              organizationId,
              active: true
            })
            let teamsIds = []
            for (const team of teams) {
              teamsIds = [...teamsIds, team._id]
            }

            return teamsIds
          }
          let teams = await Team.find({
            $or: [{ leader: _id }, { members: _id }],
            active: true
          })
          let teamsIds = []
          for (const team of teams) {
            teamsIds = [...teamsIds, team._id]
          }

          return teamsIds
        } catch (e) {
          sentryCaptureException(e)
          return []
        }
      }
    },
    fetchUsersTeam: async (_, { userId }) => {
      try {
        const usersTeam = await Team.findOne({
          $or: [{ leader: userId }, { members: userId }],
          active: true
        })
        return usersTeam
      } catch (e) {
        sentryCaptureException(e)
        return null
      }
    },
    fetchFilteredEmployees: async (
      _,
      { email, alreadyAssigned },
      { user: { organizationId, _id } }
    ) => {
      if (email && email.length > 0) {
        const reg = new RegExp(`((?<!\w)${email}\w+)|${email}`, 'i')
        const users = await User.find({
          organizationId,
          _id: { $nin: [_id, ...alreadyAssigned] },
          $or: [{ email: { $regex: reg } }, { firstName: { $regex: reg } }]
        })
        return users
      } else {
        return []
      }
    },
    fetchFilteredEmployeesNotPartOfTeam: async (
      _,
      { teamId, email },
      { user: { organizationId } }
    ) => {
      const team = await Team.findById(teamId)
      let members = [...team.members, team.leader]
      members = members.map(member => {
        return Types.ObjectId(member)
      })
      if (email && email.length > 0) {
        const reg = new RegExp(`((?<!\w)${email}\w+)|${email}`, 'i')
        const suggestedEmployees = await User.find({
          organizationId,
          _id: { $nin: members },
          $or: [{ email: { $regex: reg } }, { firstName: { $regex: reg } }]
        })

        return suggestedEmployees
      } else {
        return []
      }
    },
    fetchTeam: async (
      _,
      { teamId, membersLimit, membersSkip },
      { user: { organizationId } }
    ) => {
      try {
        const team = await Team.findById(
          teamId,
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
        if (team && String(team.organizationId) === String(organizationId)) {
          return team
        } else {
          throw new Error('Team not found')
        }
      } catch (e) {
        sentryCaptureException(e)
        throw new Error('Team not found!')
      }
    },

    fetchTeamMembers: async (_, args, { user: { organizationId } }) => {
      try {
        const team = await Team.findById(args.teamId)

        if (team && String(team.organizationId) === String(organizationId)) {
          const totalMembers = team.members.length + 1

          let members = await User.find({
            _id: team.members
          })
            .skip(args.membersSkip)
            .limit(args.membersLimit)

          members = await Promise.all(
            members.map(async user => {
              const userProfile = await UserProfile.findOne({ user: user._id })

              const imageLink = await getDownloadLink({
                key: 'users/profileImgs',
                expires: 500 * 60,
                _id: user._id
              })

              const {
                _id,
                firstName,
                lastName,
                email,
                roles,
                status,
                location
              } = user
              const updatedMember = {
                _id,
                firstName,
                lastName,
                email,
                roles,
                status,
                location,
                roleAtWork: userProfile ? userProfile.roleAtWork : null,
                imageLink: imageLink
              }
              return updatedMember
            })
          )

          return {
            _id: new Types.ObjectId(),
            totalTeamMembers: totalMembers,
            members
          }
        } else {
          throw new Error('Team not found')
        }
      } catch (e) {
        sentryCaptureException(e)
        throw new Error('Team not found!')
      }
    },
    fetchTeamLearningContent: async (_, args, context) => {
      const allTeamContent = await TeamLearningContent.find().sort({
        createdAt: -1
      })
      return allTeamContent
    },
    fetchArchivedTeams: async (_, args, { user }) => {
      const { _id } = user
      try {
        if (_id === undefined) throw new Error('User id is undefined')
        const adminUser = await User.findById(_id)
        const archivedTeams = await Team.find({
          organizationId: adminUser.organizationId,
          active: false
        })
        return archivedTeams
      } catch (e) {
        sentryCaptureException(e)
        return []
      }
    },
    fetchEvaluationInfo: async (_, args, { user }) => {
      const { _id, roles, organizationId } = user
      try {
        const leadersTeams = roles.includes('ADMIN')
          ? await Team.find({ organizationId, active: true })
          : await Team.find({
              leader: _id,
              active: true
            })

        let evaluatedUsers = []
        if (leadersTeams.length > 0) {
          const teamsToEvaluate = await Promise.all(
            leadersTeams.map(async team => {
              let allCompleted = true
              let shouldSetRequired = false
              if (team.requiredSkills.length === 0) shouldSetRequired = true
              const usersToEvaluate = await Promise.all(
                team.members.map(async member => {
                  const membersProfile = await UserProfile.findOne({
                    user: member
                  })
                  // Member is onboarded
                  if (membersProfile) {
                    const membersEvaluation = await UserEvaluation.findOne({
                      user: member
                    })
                    if (!membersEvaluation)
                      return {
                        shouldEvaluate: true,
                        completed: true,
                        userId: member
                      }
                    else {
                      evaluatedUsers.push(member)
                      return {
                        shouldEvaluate: false,
                        completed: true,
                        userId: member
                      }
                    }
                  } else {
                    allCompleted = false
                    return {
                      shouldEvaluate: false,
                      completed: false,
                      userId: member
                    }
                  }
                })
              )
              return {
                teamName: team.teamName,
                _id: new Types.ObjectId(),
                teamId: team._id,
                shouldSetRequired,
                usersToEvaluate,
                evaluatedUsers,
                allCompleted
              }
            })
          )
          return {
            _id: new Types.ObjectId(),
            teamInformations: teamsToEvaluate
          }
        } else {
          // USER IS NOT A LEADER
          return null
        }
      } catch (e) {
        sentryCaptureException(e)
        return null
      }
    },
    fetchRequiredTeamSkills: async (
      _,
      { teamId },
      { user: { organizationId } }
    ) => {
      try {
        const team = await Team.findById(teamId)
        if (!team) throw new Error('Team not found')

        let relevantSkills = []
        // const leadersProfile = await UserProfile.findOne({ user: team.leader })

        // relevantSkills.push(...leadersProfile.selectedWorkSkills)

        // await Promise.all(
        //   team.members.map(async member => {
        //     const membersProfile = await UserProfile.findOne({ user: member })
        //     if (membersProfile) {
        //       relevantSkills.push(...membersProfile.selectedWorkSkills)
        //     }
        //   })
        // )

        await Promise.all(
          team.requiredSkills.map(async skill => {
            const sk = await Skills.findById(skill.skillId)
            if (sk) {
              const { _id, name, category, slug } = sk
              relevantSkills.push({
                _id: String(_id),
                name,
                category,
                slug,
                level: 0
              })
            }
          })
        )

        const evaluationSkillInfo = await Promise.all(
          removeDuplicates(relevantSkills, '_id').map(async (sk, idx) => {
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
                _id: new Types.ObjectId(),
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

        return evaluationSkillInfo
      } catch (e) {
        sentryCaptureException(e)
        return []
      }
    },
    fetchLatestTeamEvaluation: async (
      _,
      { teamId, search },
      { user: { organizationId } }
    ) => {
      const team = await Team.findById(teamId)
        .select({ requiredSkills: 1, members: 1, leader: 1 })
        .lean()

      const userProfiles = await UserProfile.find({ organizationId }).select({
        user: 1,
        selectedWorkSkills: 1
      })

      const userData = await User.find({
        organizationId,
        status: { $in: ['active', 'disabled'] }
      })
        .select({ _id: 1, firstName: 1, lastName: 1, email: 1 })
        .lean()

      return getTeamSkillGapInfo({ team, userProfiles, userData, search })
    },
    fetchTeamEvaluationsForOrganization: async (
      _,
      { limit, offset, search },
      { user: { organizationId } }
    ) => {
      if (search) {
        return getTeamSkillGapInfoForSearch({ search, organizationId })
      }

      const teams = await Team.find({ organizationId, active: true })
        .select({
          _id: 1,
          teamName: 1,
          requiredSkills: 1,
          members: 1,
          leader: 1
        })
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(1)
        .lean()

      const userProfiles = await UserProfile.find({ organizationId }).select({
        user: 1,
        selectedWorkSkills: 1
      })

      const userData = await User.find({
        organizationId,
        status: { $in: ['active', 'disabled'] }
      })
        .select({ _id: 1, firstName: 1, lastName: 1, email: 1 })
        .lean()

      return Promise.all(
        teams.map(async team => ({
          _id: team._id,
          teamName: team.teamName,
          skills: await getTeamSkillGapInfo({ team, userProfiles, userData })
        }))
      )
    },
    fetchOrganizationEvaluationToo: async (
      _,
      args,
      { user: { organizationId } }
    ) => {
      const userProfiles = await UserProfile.find({ organizationId }).select({
        user: 1,
        selectedWorkSkills: 1
      })

      const userData = await User.find({
        organizationId,
        status: { $in: ['active', 'disabled'] }
      })
        .select({ _id: 1, firstName: 1, lastName: 1, email: 1 })
        .lean()

      const selectedSkills = userProfiles.reduce((acc, curr) => {
        const skills = curr.selectedWorkSkills || []
        return [
          ...acc,
          ...skills.map(skill => ({
            ...skill._doc,
            user: curr.user
          }))
        ]
      }, [])

      const evaluatedSkills = (
        await Promise.all(
          userProfiles.map(async profile => ({
            user: profile.user,
            evaluatedSkills: await profile.getEvaluatedSkills()
          }))
        )
      ).reduce(
        (acc, curr) => [
          ...acc,
          ...curr.evaluatedSkills.map(skill => ({
            ...skill,
            user: curr.user
          }))
        ],
        []
      )

      const skills = await Skills.find({
        _id: { $in: selectedSkills.map(({ _id }) => _id) }
      })
        .select({ _id: 1, name: 1 })
        .lean()

      const finalSkills = skills
        .map(({ _id: skillId, name }) => {
          const available = selectedSkills.filter(
            skill => skill.level > 0 && String(skill._id) === String(skillId)
          )

          const evaluated = evaluatedSkills.filter(
            skill => skill.level > 0 && String(skill._id) === String(skillId)
          )

          const users = userData
            .filter(user =>
              available.some(skill => String(skill.user) === String(user._id))
            )
            .map(user => {
              let level = 0

              const evaluatedSkill = evaluated.find(
                skill => String(skill.user) === String(user._id)
              )

              if (!evaluatedSkill || evaluatedSkill.level === 0) {
                const availableSkill = selectedSkills.find(
                  skill => String(skill.user) === String(user._id)
                )
                if (availableSkill) level = availableSkill.level
              } else level = evaluatedSkill.level

              return {
                _id: new Types.ObjectId(),
                userId: user._id,
                name: user.firstName
                  ? `${user.firstName} ${user.lastName}`
                  : user.email,
                level
              }
            })

          users.sort((a, b) => b.level - a.level)

          const skillAvailable =
            evaluated.length > 0
              ? Math.max(...evaluated.map(skill => skill.level))
              : available.length > 0
              ? Math.max(...available.map(skill => skill.level))
              : 0

          return {
            _id: new Types.ObjectId(),
            skillId,
            name,
            skillAvailable,
            skillNeeded: 0,
            usersForTooltip: users.slice(0, 10),
            users: users.length,
            usersInOrganization: 0
          }
        })
        .sort((a, b) => b.skillAvailable - a.skillAvailable)

      return finalSkills

      // let organizationUserProfiles = []
      // // let orgUsers = []
      // await Promise.all(
      //   userProfiles.map(async usersProfile => {
      //     const evaluatedSkills = await usersProfile.getEvaluatedSkills()
      //     if (user && evaluatedSkills) {
      //       organizationUserProfiles.push({
      //         user: usersProfile.user,
      //         selectedWorkSkills: usersProfile.selectedWorkSkills,
      //         evaluatedSkills
      //       })
      //     }
      //   })
      // )

      // let availableSkills = {}
      // organizationUserProfiles.forEach(profile => {
      //   profile.evaluatedSkills.forEach(({ _id, level }) => {
      //     let skillNeeded = 0
      //     const prev = availableSkills[_id]
      //     let newLevel = 0
      //     if (level > 0) {
      //       newLevel = level
      //     } else {
      //       const userSkill = profile.selectedWorkSkills.find(
      //         sk => String(sk._id) === String(_id)
      //       )
      //       if (userSkill) newLevel = userSkill.level
      //     }
      //     if (prev) {
      //       availableSkills[_id] = {
      //         skillAvailable: [...prev.skillAvailable, newLevel],
      //         skillNeeded,
      //         users: [...prev.users, profile.user]
      //       }
      //     } else {
      //       availableSkills[_id] = {
      //         skillNeeded,
      //         skillAvailable: [newLevel],
      //         users: [profile.user]
      //       }
      //     }
      //   })
      // })

      // const accumulatedSkills = Object.keys(availableSkills).map(skillId => {
      //   const count = availableSkills[skillId].skillAvailable.length
      //   return {
      //     _id: `${organizationId}-${skillId}`,
      //     skillId,
      //     skillAvailable:
      //       count > 0
      //         ? Math.max(...availableSkills[skillId].skillAvailable)
      //         : 0,
      //     skillNeeded: availableSkills[skillId].skillNeeded,
      //     users: availableSkills[skillId].users
      //   }
      // })

      // let finalSkills = await Promise.all(
      //   accumulatedSkills.map(async skill => {
      //     const skillInDb = await Skills.findOne({ _id: skill.skillId })

      //     const users = skill.users.map(userId => {
      //       const user = orgUsers.find(u => String(u._id) === String(userId))
      //       const usersProfile = organizationUserProfiles.find(
      //         u => String(u.user) === String(userId)
      //       )

      //       let level = 0

      //       const evaluatedSkill = usersProfile.evaluatedSkills.find(
      //         sk => String(sk._id) === String(skill.skillId)
      //       )
      //       if (evaluatedSkill && evaluatedSkill.level === 0) {
      //         const userSkill = usersProfile.selectedWorkSkills.find(
      //           sk => String(sk._id) === String(skill.skillId)
      //         )
      //         if (userSkill) level = userSkill.level
      //       } else level = evaluatedSkill.level

      //       return {
      //         name: user.firstName
      //           ? `${user.firstName} ${user.lastName}`
      //           : user.email,
      //         userId,
      //         _id: new Types.ObjectId(),
      //         level
      //       }
      //     })

      //     return {
      //       _id: skill._id,
      //       skillId: skill.skillId,
      //       name: skillInDb.name,
      //       skillAvailable: skill.skillAvailable,
      //       skillNeeded: skill.skillNeeded,
      //       users,
      //       usersInOrganization: []
      //     }
      //   })
      // )
      // finalSkills.sort((a, b) => b.skillAvailable - a.skillAvailable)

      // return finalSkills
    },
    fetchSkillDetailsInTeam: async (_, { teamId, skillId }) => {
      const team = await Team.findById(teamId)
      if (team) {
        let availableUsers = []
        const teamUserIds = [team.leader, ...team.members]
        await Promise.all(
          teamUserIds.map(async userId => {
            const user = await User.findById(userId).lean()
            const usersProfile = await UserProfile.findOne({
              user: userId,
              'selectedWorkSkills._id': skillId
            })
            if (usersProfile && user) {
              const hasEvaluation = await UserEvaluation.findOne({
                user: userId
              })
              let evaluatedLevel = 0
              let skillNeeded = 0
              if (hasEvaluation) {
                const evaluatedSkills = await usersProfile.getEvaluatedSkills()
                const evaluatedSkill = evaluatedSkills.find(
                  es => es._id === skillId
                )
                if (evaluatedSkill) {
                  evaluatedLevel = evaluatedSkill.level
                }
              }
              if (team.requiredSkills && team.requiredSkills.length > 0) {
                const requiredSkill = team.requiredSkills.find(
                  rs => String(rs.skillId) === skillId
                )
                if (requiredSkill) {
                  skillNeeded = requiredSkill.level
                }
              }
              const ownSkill = usersProfile.selectedWorkSkills.find(
                sws => String(sws._id) === skillId
              )

              availableUsers.push({
                _id: new Types.ObjectId(),
                skillId,
                name: user.firstName
                  ? `${user.firstName} ${user.lastName}`
                  : user.email,
                evaluatedLevel,
                skillAvailable: ownSkill.level,
                skillNeeded,
                userId
              })
            }
          })
        )

        availableUsers.sort((a, b) => b.evaluatedLevel - a.evaluatedLevel)
        return availableUsers
      }
      return []
    },
    fetchSkillAvailableInOrganization: async (
      _,
      { teamId, skillId },
      { user: { organizationId } }
    ) => {
      let availableUsers = []
      const profilesWithSkill = await UserProfile.find({
        'selectedWorkSkills._id': skillId,
        organizationId
      })
      if (teamId === '') {
        if (profilesWithSkill.length > 0) {
          await Promise.all(
            profilesWithSkill.map(async usersProfile => {
              const user = await User.findById(usersProfile.user)
              if (usersProfile && user) {
                const hasEvaluation = await UserEvaluation.findOne({
                  user: usersProfile.user
                })
                let evaluatedLevel = 0
                let skillNeeded = 0
                if (hasEvaluation) {
                  const evaluatedSkills = await usersProfile.getEvaluatedSkills()
                  const evaluatedSkill = evaluatedSkills.find(
                    es => es._id === skillId
                  )
                  if (evaluatedSkill) {
                    evaluatedLevel = evaluatedSkill.level
                  }
                }

                const ownSkill = usersProfile.selectedWorkSkills.find(
                  sws => String(sws._id) === skillId
                )
                availableUsers.push({
                  _id: new Types.ObjectId(),
                  skillId,
                  name: user.firstName
                    ? `${user.firstName} ${user.lastName}`
                    : user.email,
                  evaluatedLevel,
                  skillAvailable: ownSkill.level,
                  skillNeeded,
                  userId: usersProfile.user
                })
              }
            })
          )
        }
        availableUsers.sort((a, b) => b.skillAvailable - a.skillAvailable)
        return availableUsers
      } else {
        const team = await Team.findById(teamId)
        if (team) {
          const teamUserIds = [team.leader, ...team.members]

          if (profilesWithSkill.length > 0) {
            await Promise.all(
              profilesWithSkill.map(async usersProfile => {
                if (!teamUserIds.some(id => String(id) === usersProfile.user)) {
                  const user = await User.findById(usersProfile.user)
                  if (usersProfile && user) {
                    const hasEvaluation = await UserEvaluation.findOne({
                      user: usersProfile.user
                    })
                    let evaluatedLevel = 0
                    let skillNeeded = 0
                    if (hasEvaluation) {
                      const evaluatedSkills = await usersProfile.getEvaluatedSkills()
                      const evaluatedSkill = evaluatedSkills.find(
                        es => es._id === skillId
                      )
                      if (evaluatedSkill) {
                        evaluatedLevel = evaluatedSkill.level
                      }
                    }

                    const ownSkill = usersProfile.selectedWorkSkills.find(
                      sws => String(sws._id) === skillId
                    )

                    availableUsers.push({
                      _id: new Types.ObjectId(),
                      skillId,
                      name: user.firstName
                        ? `${user.firstName} ${user.lastName}`
                        : user.email,
                      evaluatedLevel,
                      skillAvailable: ownSkill.level,
                      skillNeeded,
                      userId: usersProfile.user
                    })
                  }
                }
              })
            )
          }
          availableUsers.sort((a, b) => b.skillAvailable - a.skillAvailable)
          return availableUsers
        }
      }
      return []
    },
    fetchTeamFeedbackEvaluation: async (
      _,
      { teamId },
      { user: { organizationId } }
    ) => {
      const team = await Team.findById(teamId).lean()

      const teamEvaluation = await UserEvaluation.findOne({
        user: teamId
      }).lean()

      if (!team || !teamEvaluation) return []

      const { requiredSkills } = team
      const { skillsFeedback } = teamEvaluation

      const getFeedbackLevel = skillId => {
        const skill = skillsFeedback.find(
          ({ skillId: inFeedback }) => String(inFeedback) === String(skillId)
        )
        if (!skill) return 0
        return skill.feedback.length > 0
          ? skill.feedback.reduce((acc, curr) => (acc += curr.level), 0) /
              skill.feedback.length
          : 0
      }

      const feedbackGapInfo = (
        await Promise.all(
          requiredSkills.map(async ({ skillId, level: skillNeeded }) => {
            const skill = await Skills.findById(skillId)
              .select({ name: 1 })
              .lean()
            if (!skill) return null

            return {
              _id: `feedback-gap:${skillId}`,
              skillId,
              name: skill.name,
              skillNeeded,
              skillAvailable: getFeedbackLevel(skillId)
            }
          })
        )
      ).filter(item => !!item)

      return feedbackGapInfo
    },
    fetchTeamLearningPathsProgress: async (
      _,
      { teamId, filter },
      { user: { _id: contextUser } }
    ) => {
      const team = await Team.findById(teamId)
        .select({ _id: 1, leader: 1, members: 1 })
        .lean()

      if (!team) {
        return null
      }

      const developmentPlans = await Promise.all(
        [team.leader, ...team.members].map(async member => {
          const devPlan = await DevelopmentPlan.findOne({
            user: member,
            active: true
          }).lean()

          if (!devPlan) {
            return null
          }

          const devPlanWithStats = await fetchDevelopmentPlanWithStats(
            _,
            { userId: member, filter },
            { user: { _id: contextUser } }
          )

          const user = await User.findById(member)
            .select({
              _id: 1,
              firstName: 1,
              lastName: 1
              // imageLink: 1
            })
            .lean()

          if (!user) {
            return null
          }

          devPlanWithStats.user = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName
            // imageLink: user.imageLink ? user.imageLink : null
          }

          return devPlanWithStats
        })
      )

      const progress = developmentPlans.reduce((acc, curr) => {
        if (!curr) return acc

        curr.forEach(c => {
          if (!acc[c.path.pathId]) {
            acc[c.path.pathId] = {
              pathId: c.path.pathId,
              pathName: c.path.name,
              assignedTo: []
            }
          }

          acc[c.path.pathId].assignedTo.push({
            _id: curr.user._id,
            firstName: curr.user.firstName,
            lastName: curr.user.lastName,
            // imageLink: curr.user.imageLink,
            status: c.path.status
          })
        })

        return acc
      }, {})

      return Object.values(progress)
    }
  }
}
