import { isAdmin, isUser, isInnentialAdmin } from '~/directives'
import {
  Team,
  User,
  Skills,
  UserProfile,
  Interests,
  TeamContentStats,
  UserEvaluation,
  LearningPathTemplate,
  Goal,
  GoalTemplate,
  LearningContent,
  DevelopmentPlan,
  Organization
} from '~/models'
import { DateTime } from 'luxon'
import { ENVIRONMENT } from '../../../environment'
import { countFetchForTeam } from '../../AdminDashboard/admindashboard-data/_query'

export const queryTypes = `
  type Query {
    fetchStatsOverviewData: StatsOverviewData @${isAdmin}
    fetchStatsTeamsData: StatsTeamsData @${isAdmin}
    fetchStatsGrowthData: FetchStatsGrowthData @${isAdmin}
    fetchOrganizationStatsGrowthData(organizationId: ID!): FetchStatsGrowthData @${isInnentialAdmin}
    fetchOrganizationRequiredSkillData(organizationId: ID!): [SkillCount]! @${isInnentialAdmin}
    fetchAllGrowthData(showActiveClients: Boolean, showLastSixMonths: Boolean): FetchStatsGrowthData @${isInnentialAdmin}
    fetchTopUsedSkills: [Skill] @${isUser}
    fetchGrowthDetails(key: String!, teamId: ID): [SkillCount] @${isUser}
    fetchRequiredSkillsDetails: [SkillCount] @${isAdmin}
    fetchSkillGapDetails: [TeamSkillGap] @${isAdmin}
    fetchAdminTeamContentStats(organizationId: ID!): [AdminTeamStats] @${isInnentialAdmin}
   fetchLearningPathStatistics(organizationId : ID) : [LearningPathStatistics] @${isInnentialAdmin}
    fetchOneLearningPathStatistics(learningPathId: ID!, minDate: DateTime, organizationId: ID, realUsers: [ID]): LearningPathStatistics @${isInnentialAdmin}
    fetchLearningGoalStatistics(goalTemplateId: ID!, minDate: DateTime, organizationId: ID, realUsers: [ID]): LearningGoalStatistics @${isInnentialAdmin}
    fetchLearningContentStatistics(learningContentId: ID!, goalTemplateId: ID!, minDate: DateTime, organizationId: ID, realUsers: [ID]): LearningContentStatistics @${isInnentialAdmin}
    fetchSkillBreakdown(skillId: ID!, showActiveClients: Boolean, showLastSixMonths: Boolean): [Evaluated] @${isInnentialAdmin}
  }
`

const fetchOneLearningPathStatistics = async (
  _,
  { learningPathId, minDate, organizationId, realUsers }
) => {
  const learningPath = await LearningPathTemplate.findById(learningPathId)
    .select({ _id: 1, name: 1, organization: 1, goalTemplate: 1 })
    .lean()

  const goalStats = await Promise.all(
    learningPath.goalTemplate.map(async goalTemplateId =>
      fetchLearningGoalStatistics(null, {
        goalTemplateId,
        minDate,
        organizationId,
        realUsers
      })
    )
  )

  const userGoalPairs = await Promise.all(
    learningPath.goalTemplate.map(async goalTemplate => {
      const goals = await Goal.find({
        ...(organizationId && { organizationId }),
        fromTemplate: goalTemplate,
        createdAt: { $gte: minDate },
        user: { $in: realUsers }
      })
        .select({ user: 1, status: 1 })
        .lean()

      return goals.map(goal => {
        return {
          user: goal.user,
          status: goal.status
        }
      })
    })
  )

  const userGoalsMap = userGoalPairs
    .reduce((acc, curr) => [...acc, ...curr], [])
    .reduce((acc, b) => {
      if (!acc[b.user]) {
        acc[b.user] = {
          activeCount: b.status === 'ACTIVE' ? 1 : 0,
          pastCount: b.status === 'PAST' ? 1 : 0
        }
      } else {
        if (b.status === 'ACTIVE') {
          acc[b.user].activeCount++
        } else if (b.status === 'PAST') {
          acc[b.user].pastCount++
        }
      }
      return acc
    }, [])

  let inProgressCount = 0
  let completedCount = 0

  const noGoals = learningPath.goalTemplate.length

  for (const [key, pair] of Object.entries(userGoalsMap)) {
    if (pair.pastCount === noGoals) {
      completedCount++
    } else if (pair.activeCount > 0) {
      inProgressCount++
    }
  }

  const pathOrganization = learningPath.organization
    ? learningPath.organization
    : null

  return {
    learningPathId: learningPath._id,
    name: learningPath.name,
    organization: pathOrganization,
    inProgressCount,
    completedCount,
    learningGoalStatistics: goalStats
  }
}

const fetchLearningGoalStatistics = async (
  _,
  { goalTemplateId, minDate, organizationId, realUsers }
) => {
  const goalTemplate = await GoalTemplate.findById(goalTemplateId).lean()

  if (!goalTemplate.content) {
    return {}
  }

  const contentStats = await Promise.all(
    goalTemplate.content.map(async content =>
      fetchLearningContentStatistics(null, {
        learningContentId: content.contentId,
        goalTemplateId,
        minDate,
        organizationId,
        realUsers
      })
    )
  )

  const seenCount = await Goal.countDocuments({
    ...(organizationId && { organizationId }),
    fromTemplate: goalTemplateId,
    $or: [{ status: 'PAST' }, { seen: true }],
    createdAt: { $gte: minDate },
    user: { $in: realUsers }
  })

  const completedCount = await Goal.countDocuments({
    ...(organizationId && { organizationId }),
    fromTemplate: goalTemplateId,
    status: 'PAST',
    createdAt: { $gte: minDate },
    user: { $in: realUsers }
  })

  return {
    goalId: goalTemplateId,
    name: goalTemplate.goalName,
    inProgressCount: seenCount,
    completedCount,
    learningContentStatistics: contentStats
  }
}

const fetchLearningContentStatistics = async (
  _,
  { learningContentId, goalTemplateId, minDate, organizationId, realUsers }
) => {
  const learningGoals = await Goal.find({
    ...(organizationId && { organizationId }),
    fromTemplate: goalTemplateId,
    createdAt: { $gte: minDate },
    user: { $in: realUsers }
  })
    .select({ _id: 1 })
    .lean()

  const learningGoalIds = learningGoals.map(goal => String(goal._id))

  const developmentPlans = await DevelopmentPlan.find({
    ...(organizationId && { organizationId }),
    'content.contentId': learningContentId,
    user: { $in: realUsers }
  })
    .select({ content: 1 })
    .lean()

  const learningContents = developmentPlans
    .map(plan => plan.content)
    .reduce((acc, curr) => [...acc, ...curr], [])
    .filter(
      content =>
        String(content.contentId) === String(learningContentId) &&
        content.goalId &&
        learningGoalIds.includes(String(content.goalId))
    )

  // for title
  const learningContent = await LearningContent.findById(learningContentId)
    .select({ title: 1, type: 1 })
    .lean()

  const notStartedContents = learningContents.filter(
    content => content.status === 'NOT STARTED'
  )
  const inProgressContents = learningContents.filter(
    content => content.status === 'IN PROGRESS'
  )
  const completedContents = learningContents.filter(
    content => content.status === 'COMPLETED'
  )

  return {
    contentId: learningContentId,
    title: learningContent ? learningContent.title : 'Content not found',
    type: learningContent ? learningContent.type : '',
    notStartedCount: notStartedContents.length,
    inProgressCount: inProgressContents.length,
    completedCount: completedContents.length
  }
}

export const countFetch = async ({
  field,
  limit,
  organizationId = null,
  collection,
  compareWithCollection,
  excludeDemo = false,
  showActiveClients = false,
  showLastSixMonths = false
}) => {
  const col = collection || Skills
  const compareWithCol = compareWithCollection || UserProfile

  const allSkills = await col
    .find()
    .select({ _id: 1, name: 1 })
    .lean()

  const allSkillIds = allSkills.map(skill => skill._id)

  const allProfiles = await compareWithCol
    .find({
      [field]: { $in: allSkillIds },
      ...(organizationId && { organizationId })
    })
    .select({ _id: 1, [field]: 1, user: 1, createdAt: 1 })
    .lean()

  const fieldName = field.split('.')[0]

  const skillProfilesMap = allProfiles.reduce((map, profile) => {
    profile[fieldName].forEach(skill => {
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
    .select({ _id: 1, email: 1, organizationId: 1 })
    .lean()

  const allUsersMap = allUsers.reduce(
    (map, user) => ({ ...map, [user._id]: user }),
    {}
  )

  const payingOrganizations = await Organization.find({
    isPayingOrganization: true
  })
    .select({ _id: 1 })
    .lean()

  const skillCount = await Promise.all(
    allSkills.map(async skill => {
      let count = 0

      const profiles = skillProfilesMap[skill._id] || []

      const withConditions = await Promise.all(
        profiles.map(async profile => {
          const demoUser = allUsersMap[profile.user]

          if (demoUser) {
            const { email = '' } = demoUser
            const [emailUsername, emailDomain] = email.split('@')

            return {
              ...profile,
              demo:
                emailUsername === String(profile.user) ||
                emailUsername.includes('+') ||
                emailDomain === 'innential.com',
              isActiveClient: payingOrganizations
                .map(o => String(o._id))
                .includes(String(demoUser.organizationId)),
              isFromTheLastSixMonths:
                DateTime.fromJSDate(new Date()).toMillis() -
                  DateTime.fromJSDate(profile.createdAt).toMillis() <=
                1.577e10 // six months in milliseconds
            }
          } else {
            return null
          }
        })
      )

      count = withConditions.reduce((acc, curr) => {
        if (curr === null) {
          return acc
        }

        const demoCheck = !excludeDemo || !curr.demo
        const activeClientsCheck = !showActiveClients || curr.isActiveClient
        const lastSixMonthsCheck =
          !showLastSixMonths || curr.isFromTheLastSixMonths

        return curr !== null &&
          demoCheck &&
          activeClientsCheck &&
          lastSixMonthsCheck
          ? acc + 1
          : acc
      }, 0)

      return {
        _id: `${skill._id}:${
          field.split('.')[0]
        }:${showActiveClients
          .toString()
          .substr(0, 1)}${showLastSixMonths.toString().substr(0, 1)}`,
        name: skill.name,
        employeesCount: count
      }
    })
  )

  skillCount.sort(
    (a, b) => parseFloat(b.employeesCount) - parseFloat(a.employeesCount)
  )

  return skillCount.filter(item => item.employeesCount !== 0).slice(0, limit)
}

export const queryResolvers = {
  Query: {
    fetchStatsOverviewData: async (_, args, { user: { organizationId } }) => {
      const users = await User.find({
        organizationId,
        status: { $in: ['active', 'not-onboarded', 'invited'] }
      }).lean()

      const teams = await Team.find({ active: true, organizationId })

      const evaluations = await UserEvaluation.find({
        user: { $in: users.map(({ _id: userId }) => userId) }
      })

      const monthStart = DateTime.fromJSDate(new Date())
        .startOf('month')
        .toJSDate()

      const { feedback, newFeedback } = evaluations.reduce(
        (acc, { feedback: fArray }) => {
          const total = fArray.length
          const fresh = fArray.reduce((sum, { evaluatedAt }) => {
            return new Date(evaluatedAt) > monthStart ? sum + 1 : sum
          }, 0)
          return {
            feedback: acc.feedback + total,
            newFeedback: acc.newFeedback + fresh
          }
        },
        { feedback: 0, newFeedback: 0 }
      )

      return {
        employees: users.length,
        teams: teams.length,
        newTeams: teams.reduce((acc, { createdAt }) => {
          if (createdAt) {
            return new Date(createdAt) > monthStart ? acc + 1 : acc
          }
          return acc
        }, 0),
        newEmployees: users.reduce((acc, { invitation: { acceptedOn } }) => {
          if (acceptedOn) {
            return new Date(acceptedOn) > monthStart ? acc + 1 : acc
          }
          return acc
        }, 0),
        feedback,
        newFeedback
      }
    },
    fetchStatsTeamsData: async (_, args, { user: { organizationId } }) => {
      const teams = await Team.find({ active: true, organizationId }).lean()
      const allSkills = await Skills.find().lean()

      const filteredTeams = teams
        .filter(item => item.members.length > 0)
        .filter(team => team.requiredSkills && team.requiredSkills.length > 0)

      const skillGapPromise = Promise.all(
        filteredTeams.map(async team => {
          const skills = team.requiredSkills || []

          if (skills.length > 0) {
            const neededSkills = skills.map(skill => skill.level)
            const skillsIds = skills.map(skill => skill.skillId)
            const neededSkillsNames = skillsIds.map(skillId => {
              const foundSkill = allSkills.find(
                item => item._id.toString() === skillId.toString()
              )
              if (foundSkill) {
                return foundSkill.name
              }
              return ''
            })

            const membersIds = [...team.members, team.leader]
            const profiles = await UserProfile.find({
              user: { $in: membersIds }
            })
            // const evals = await UserEvaluation.find({
            //   user: { $in: membersIds }
            // }).lean()

            const availableSkills = []
            const memberSkills = await Promise.all(
              profiles.map(async profile => {
                const evaluatedSkills = await profile.getEvaluatedSkills()
                if (evaluatedSkills) {
                  return evaluatedSkills
                } else return profile.selectedWorkSkills
              })
            )

            skillsIds.forEach(skillId => {
              //  I'M CHANGING THINGS UP A BIT HERE. SINCE membersLevel FIELD IN EVALUATION IS LARGELY
              //  REDUNDANT (not really used anywhere), I'M REPLACING IT WITH THE USERS LEVEL IN THE PROFILE

              const memberSkillLevels = memberSkills.map(skillArray => {
                const skill = skillArray.find(
                  s => s._id.toString() === skillId.toString()
                )
                if (skill) {
                  return skill.level
                } else return 0
              })
              availableSkills.push(Math.max(...memberSkillLevels))
              // profiles.forEach(async usersProfile => {
              //   const evaluatedSkills = await usersProfile.getEvaluatedSkills()
              //   if (evaluatedSkills) {
              //     const skill = evaluatedSkills.find(
              //       s => s._id.toString() === skillId.toString()
              //     )
              //     if (skill) memberSkillLevels.push(skill.level)
              //   } else {
              //     const { selectedWorkSkills } = profile
              //     const skill = selectedWorkSkills.find(
              //       s => s._id.toString() === skillId.toString()
              //     )
              //     if (skill) memberSkillLevels.push(skill.level)
              //   }
              // })
              // if(memberSkillLevels.length === 0) {
              //   availableSkills.push(0)
              // } else availableSkills.push(Math.max(...memberSkillLevels))
            })

            const skillObjectArray = []
            neededSkills.forEach((level, i) => {
              skillObjectArray.push({
                needed: level,
                available: availableSkills[i],
                name: neededSkillsNames[i]
              })
            })
            skillObjectArray.sort((a, b) => {
              const aGapSize = a.needed - a.available
              const bGapSize = b.needed - b.available

              return bGapSize - aGapSize
            })

            const sortedNeededSkills = []
            const sortedAvailableSkills = []
            const sortedSkillNames = []

            skillObjectArray.forEach(skillObject => {
              const { needed, available, name } = skillObject
              sortedNeededSkills.push(needed)
              sortedAvailableSkills.push(available)
              sortedSkillNames.push(name)
            })

            const skillGapSize =
              neededSkills.reduce((acc, curr) => acc + curr, 0) -
              availableSkills.reduce((acc, curr) => acc + curr, 0)

            return {
              _id: team._id,
              teamName: team.teamName,
              teamMemberCount: membersIds.length,
              neededSkills: sortedNeededSkills,
              availableSkills: sortedAvailableSkills,
              neededSkillsNames: sortedSkillNames,
              skillGapSize
            }
          }
        })
      )

      const skillGap = await skillGapPromise
      skillGap.sort((a, b) => b.skillGapSize - a.skillGapSize)

      const teamsSkillGap = skillGap.slice(0, 2)

      teamsSkillGap.forEach(skillGap => {
        delete skillGap.skillGapSize
      })

      let requiredSkills = {}
      await Promise.all(
        teams.map(async team => {
          const teamRequiredSkills = await Skills.find({
            _id: { $in: team.requiredSkills.map(sk => sk.skillId) }
          }).lean()
          teamRequiredSkills.forEach(sk => {
            const prev = requiredSkills[sk._id]
            if (!prev)
              requiredSkills[sk._id] = {
                name: sk.name,
                employeesCount: 1
              }
            else
              requiredSkills[sk._id] = {
                ...prev,
                employeesCount: prev.employeesCount + 1
              }
          })
        })
      )
      const reqSkills = Object.keys(requiredSkills).map((_id, idx) => ({
        ...requiredSkills[_id],
        _id: `${_id}+req${idx}`
      }))

      reqSkills.sort(
        (a, b) => parseFloat(b.employeesCount) - parseFloat(a.employeesCount)
      )

      return {
        teamsSkillGap,
        mostRequiredSkills: reqSkills.slice(0, 8)
      }
    },
    fetchAllGrowthData: async (_, { showActiveClients, showLastSixMonths }) => {
      const excludeDemo = true

      return {
        skillsPeopleHave: await countFetch({
          field: 'selectedWorkSkills._id',
          excludeDemo,
          showActiveClients,
          showLastSixMonths
        }),
        mostNeededSkills: await countFetch({
          field: 'neededWorkSkills._id',
          excludeDemo,
          showActiveClients,
          showLastSixMonths
        }),
        interests: await countFetch({
          field: 'selectedInterests._id',
          excludeDemo,
          collection: Interests,
          showActiveClients,
          showLastSixMonths
        })
      }
    },
    fetchTopUsedSkills: async () => {
      const mostNeededSkills = (
        await countFetch({
          field: 'neededWorkSkills._id',
          // EXCLUDED THESE FILTER CONDITIONS ON NON-PROD ENVIRONMENTS
          // FOR BETTER TESTING
          ...(process.env.SERVER === ENVIRONMENT.PRODUCTION && {
            excludeDemo: true,
            showActiveClients: true,
            showLastSixMonths: true
          })
        })
      ).map(({ _id }) => String(_id.split(':')[0])) // THE ID IS 2-PART IN THIS CASE, 1ST IS THE SKILL ID

      const learningPaths = await LearningPathTemplate.find({
        active: true, // EXTRA CONDITIONS FOR PUBLISHED LPs
        hasContent: true,
        skills: {
          $in: mostNeededSkills
        }
      })
        .select({ _id: 1, skills: 1 })
        .lean()

      const learningPathSkills = learningPaths
        .map(p => p.skills)
        .reduce((acc, curr) => [...curr, ...acc], []) // REDUCE INSTEAD OF .flat() TO PREVENT ERRORS ON THE SERVER
        .map(skillId => String(skillId))

      const sixMostNeeded = mostNeededSkills
        .filter(skill => learningPathSkills.includes(skill))
        .slice(0, 6)

      return Skills.find({
        _id: { $in: sixMostNeeded }
      })
    },
    fetchOrganizationStatsGrowthData: async (_, { organizationId }) => {
      return {
        skillsPeopleHave: await countFetch({
          field: 'selectedWorkSkills._id',
          organizationId
        }),
        mostNeededSkills: await countFetch({
          field: 'neededWorkSkills._id',
          organizationId
        }),
        interests: await countFetch({
          field: 'selectedInterests._id',
          organizationId,
          collection: Interests
        })
      }
    },
    fetchOrganizationRequiredSkillData: async (_, { organizationId }) => {
      const teams = await Team.find({
        organizationId,
        active: true
        // members: { $size: { $gt: 0 } },
        // requiredSkills: { $size: { $gt: 0 } }
      })
        .select({ requiredSkills: 1 })
        .lean()

      let requiredSkills = {}
      await Promise.all(
        teams.map(async team => {
          const teamRequiredSkills = await Skills.find({
            _id: { $in: team.requiredSkills.map(sk => sk.skillId) }
          }).lean()
          teamRequiredSkills.forEach(sk => {
            const prev = requiredSkills[sk._id]
            if (!prev)
              requiredSkills[sk._id] = {
                name: sk.name,
                employeesCount: 1
              }
            else
              requiredSkills[sk._id] = {
                ...prev,
                employeesCount: prev.employeesCount + 1
              }
          })
        })
      )
      const reqSkills = Object.keys(requiredSkills).map((_id, idx) => ({
        ...requiredSkills[_id],
        _id: `${_id}+req${idx}`
      }))

      reqSkills.sort(
        (a, b) => parseFloat(b.employeesCount) - parseFloat(a.employeesCount)
      )

      return reqSkills
    },
    fetchStatsGrowthData: async (_, args, { user: { organizationId } }) => {
      return {
        skillsPeopleHave: await countFetch({
          field: 'selectedWorkSkills._id',
          limit: 4,
          organizationId
        }),
        mostNeededSkills: await countFetch({
          field: 'neededWorkSkills._id',
          limit: 4,
          organizationId
        }),
        interests: await countFetch({
          field: 'selectedInterests._id',
          limit: 4,
          organizationId,
          collection: Interests
        })
      }
    },
    fetchGrowthDetails: async (
      _,
      { key, teamId },
      { user: { organizationId } }
    ) => {
      let collection
      if (key === 'selectedInterests') collection = Interests
      let details

      if (teamId) {
        details = await countFetchForTeam({
          teamId
        })
      } else {
        details = await countFetch({
          field: `${key}._id`,
          limit: undefined,
          organizationId,
          collection
        })
      }

      return details
    },
    fetchRequiredSkillsDetails: async (
      _,
      args,
      { user: { organizationId } }
    ) => {
      const teams = await Team.find({ active: true, organizationId }).lean()

      let requiredSkills = {}
      await Promise.all(
        teams.map(async team => {
          const teamRequiredSkills = await Skills.find({
            _id: { $in: team.requiredSkills.map(sk => sk.skillId) }
          }).lean()
          teamRequiredSkills.forEach(sk => {
            const prev = requiredSkills[sk._id]
            if (!prev)
              requiredSkills[sk._id] = {
                name: sk.name,
                employeesCount: 1
              }
            else
              requiredSkills[sk._id] = {
                ...prev,
                employeesCount: prev.employeesCount + 1
              }
          })
        })
      )
      const reqSkills = Object.keys(requiredSkills).map((_id, idx) => ({
        ...requiredSkills[_id],
        _id: `${_id}+req${idx}`
      }))

      reqSkills.sort(
        (a, b) => parseFloat(b.employeesCount) - parseFloat(a.employeesCount)
      )

      return reqSkills
    },
    fetchSkillGapDetails: async (_, args, { user: { organizationId } }) => {
      const teams = await Team.find({ active: true, organizationId }).lean()
      const allSkills = await Skills.find().lean()

      const filteredTeams = teams
        .filter(item => item.members.length > 0)
        .filter(team => team.requiredSkills && team.requiredSkills.length > 0)

      const skillGapPromise = Promise.all(
        filteredTeams.map(async team => {
          const skills = team.requiredSkills || []

          if (skills.length > 0) {
            const neededSkills = skills.map(skill => skill.level)
            const skillsIds = skills.map(skill => skill.skillId)
            const neededSkillsNames = skillsIds.map(skillId => {
              const foundSkill = allSkills.find(
                item => item._id.toString() === skillId.toString()
              )
              if (foundSkill) {
                return foundSkill.name
              }
              return ''
            })

            const membersIds = [...team.members, team.leader]
            const profiles = await UserProfile.find({
              user: { $in: membersIds }
            })
            // const evals = await UserEvaluation.find({
            //   user: { $in: membersIds }
            // }).lean()

            const availableSkills = []
            const memberSkills = await Promise.all(
              profiles.map(async profile => {
                const evaluatedSkills = await profile.getEvaluatedSkills()
                if (evaluatedSkills) {
                  return evaluatedSkills
                } else return profile.selectedWorkSkills
              })
            )

            skillsIds.forEach(skillId => {
              //  I'M CHANGING THINGS UP A BIT HERE. SINCE membersLevel FIELD IN EVALUATION IS LARGELY
              //  REDUNDANT (not really used anywhere), I'M REPLACING IT WITH THE USERS LEVEL IN THE PROFILE

              const memberSkillLevels = memberSkills.map(skillArray => {
                const skill = skillArray.find(
                  s => s._id.toString() === skillId.toString()
                )
                if (skill) {
                  return skill.level
                } else return 0
              })
              availableSkills.push(Math.max(...memberSkillLevels))
              // profiles.forEach(async usersProfile => {
              //   const evaluatedSkills = await usersProfile.getEvaluatedSkills()
              //   if (evaluatedSkills) {
              //     const skill = evaluatedSkills.find(
              //       s => s._id.toString() === skillId.toString()
              //     )
              //     if (skill) memberSkillLevels.push(skill.level)
              //   } else {
              //     const { selectedWorkSkills } = profile
              //     const skill = selectedWorkSkills.find(
              //       s => s._id.toString() === skillId.toString()
              //     )
              //     if (skill) memberSkillLevels.push(skill.level)
              //   }
              // })
              // if(memberSkillLevels.length === 0) {
              //   availableSkills.push(0)
              // } else availableSkills.push(Math.max(...memberSkillLevels))
            })

            const skillObjectArray = []
            neededSkills.forEach((level, i) => {
              skillObjectArray.push({
                needed: level,
                available: availableSkills[i],
                name: neededSkillsNames[i]
              })
            })
            skillObjectArray.sort((a, b) => {
              const aGapSize = a.needed - a.available
              const bGapSize = b.needed - b.available

              return bGapSize - aGapSize
            })

            const sortedNeededSkills = []
            const sortedAvailableSkills = []
            const sortedSkillNames = []

            skillObjectArray.forEach(skillObject => {
              const { needed, available, name } = skillObject
              sortedNeededSkills.push(needed)
              sortedAvailableSkills.push(available)
              sortedSkillNames.push(name)
            })

            const skillGapSize =
              neededSkills.reduce((acc, curr) => acc + curr, 0) -
              availableSkills.reduce((acc, curr) => acc + curr, 0)

            return {
              _id: team._id,
              teamName: team.teamName,
              teamMemberCount: membersIds.length,
              neededSkills: sortedNeededSkills,
              availableSkills: sortedAvailableSkills,
              neededSkillsNames: sortedSkillNames,
              skillGapSize
            }
          }
        })
      )

      const skillGap = await skillGapPromise
      skillGap.sort((a, b) => b.skillGapSize - a.skillGapSize)

      skillGap.forEach(skillGap => {
        delete skillGap.skillGapSize
      })

      return skillGap
    },
    fetchAdminTeamContentStats: async (_, { organizationId }) => {
      const teams = await Team.find({ active: true, organizationId }).lean()

      const teamStats = await Promise.all(
        teams.map(async team => {
          const { _id, teamName } = team
          const contentStatList = await TeamContentStats.findOne({
            teamId: _id
          }).lean()

          if (contentStatList) {
            const { total } = contentStatList

            delete total.lastUpdated

            return {
              _id,
              teamName,
              total: {
                _id,
                ...total
              }
            }
          } else return null
        })
      )

      return teamStats.reduce((acc, curr) => {
        if (curr !== null) {
          return [...acc, curr]
        }
        return acc
      }, [])
    },
    fetchLearningPathStatistics: async (
      _,
      { organizationId },
      { dataSources }
    ) => {
      const totalUsers = await User.find({ organizationId }).countDocuments()
      if (totalUsers > 300) {
        return null
      }
      const learningPaths = await dataSources.LearningPath.getAll(
        organizationId
          ? {
              $or: [
                {
                  organization: null
                },
                {
                  organization: organizationId
                }
              ]
            }
          : {}
      )
      const learningPathIds = learningPaths.map(path => path._id)
      const minDate = DateTime.fromJSDate(new Date(2021, 3, 1))
      const allUsers = await User.find({
        status: { $ne: 'disabled' }
      }) // non-Innential users
        .select({ _id: 1, email: 1 })
        .lean()
      const realUsers = allUsers
        .filter(user => {
          const emailParts = user.email.split('@')
          return emailParts.length > 1 && emailParts[1] !== 'innential.com'
        })
        .map(user => String(user._id))
      const pathStats = await Promise.all(
        await learningPathIds.map(async learningPathId =>
          fetchOneLearningPathStatistics(null, {
            learningPathId,
            minDate,
            organizationId,
            realUsers
          })
        )
      )
      return pathStats.filter(p => {
        if (
          organizationId &&
          p.organization == null &&
          p.inProgressCount === 0 &&
          p.completedCount === 0
        ) {
          return false
        }
        return true
      })
    },
    fetchOneLearningPathStatistics,
    fetchLearningGoalStatistics,
    fetchLearningContentStatistics,
    fetchSkillBreakdown: async (
      _,
      { skillId, showActiveClients, showLastSixMonths }
    ) => {
      const excludedUserIDs = (
        await User.find({ $or: [{ email: /innential.com/ }, { email: /\+/ }] })
          .select({ _id: 1 })
          .lean()
      ).map(u => u._id)

      const payingOrganizationIDs = (
        await Organization.find({
          isPayingOrganization: true
        })
          .select({ _id: 1 })
          .lean()
      ).map(o => o._id)

      const activeClientUserIDs = (
        await User.find({ organizationId: { $in: payingOrganizationIDs } })
          .select({ _id: 1 })
          .lean()
      ).map(u => u._id)

      const profilesWithSkill = await UserProfile.find({
        'neededWorkSkills._id': skillId,
        user: {
          $nin: excludedUserIDs,
          ...(showActiveClients && { $in: activeClientUserIDs })
        },
        ...(showLastSixMonths && {
          createdAt: {
            $gte: new Date(
              Date.now() - 1.577e10 // six months in milliseconds
            )
          }
        })
      })
        .select({ user: 1 })
        .lean()

      return User.find({
        _id: { $in: profilesWithSkill.map(p => p.user) }
      })
        .select({ _id: 1, firstName: 1, lastName: 1, email: 1 })
        .lean()
    }
  }
}
