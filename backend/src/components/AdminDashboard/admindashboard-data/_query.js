import { isAdmin, isUser } from '~/directives'
import { countFetch } from '../../Stats/stats-data/_query'
import {
  User,
  DevelopmentPlan,
  ActivityChartStats,
  Team,
  Skills,
  UserProfile
} from '~/models'
import { sentryCaptureException } from '~/utils'
import { checkArrayLength } from './utils/_checkArrayLength'
import { DAYS } from '../../../environment/_enums'
import { DateTime, Interval } from 'luxon'

export const queryTypes = `
  type Query {
    fetchMostPopularResources(organizationId: ID!): [PopularResource] @${isAdmin}
    fetchMostPopularResourcesForTeams(leaderId: ID!): [PopularResource] @${isUser}
    fetchTopInDemandSkills(organizationId: ID!): TopInDemand @${isAdmin}
    fetchTopInDemandSkillsForTeam(teamId: ID!): TopInDemand @${isUser}
    fetchActivity(timeSpan: String): Activity @${isAdmin}
    fetchActivityForTeam(teamId: ID!, timeSpan: String): Activity @${isUser}
    fetchActivityForTeams(leaderId: ID!, timeSpan: String): Activity @${isUser}
    fetchActivityForDevPlans(devPlans: [DevelopmentPlanInput], whitelist: [String], timeSpan: String): Activity @${isUser}
  }
`
export const countFetchForTeam = async ({ teamId }) => {
  const team = await Team.findById(teamId)
    .select({ leader: 1, members: 1 })
    .lean()

  if (!team) return []

  const teamMemberProfiles = await UserProfile.find({
    user: { $in: [team.leader, ...team.members] }
  })
    .select({ neededWorkSkills: 1 })
    .lean()

  const allSkillIds = teamMemberProfiles
    .map(({ neededWorkSkills = [] }) => neededWorkSkills)
    .reduce((acc, curr) => [...acc, ...curr], [])
    .map(({ _id }) => _id)

  const allSkills = await Skills.find({
    _id: { $in: allSkillIds }
  })
    .select({ _id: 1, name: 1 })
    .lean()

  return allSkills
    .map(({ _id, name }) => {
      return {
        _id: `${_id}:neededInTeam`,
        name,
        employeesCount: allSkillIds.reduce((acc, curr) => {
          if (String(curr) === String(_id)) return acc + 1
          else return acc
        }, 0)
      }
    })
    .sort((a, b) => parseFloat(b.employeesCount) - parseFloat(a.employeesCount))
}

// const getWeeksToFirstDate = date => {
//   const now = new Date()

//   const year = now.getFullYear()
//   const month = now.getMonth()

//   const weeks = [],
//     firstDate = new Date(year, month, 1),
//     lastDate = new Date(year, month + 1, 0),
//     numDays = lastDate.getDate();

//   let dayOfWeekCounter = firstDate.getDay();

//   for (let date = 1; date <= numDays; date++) {
//     if (dayOfWeekCounter === 0 || weeks.length === 0) {
//       weeks.push([]);
//     }
//     weeks[weeks.length - 1].push(date);
//     dayOfWeekCounter = (dayOfWeekCounter + 1) % 7;
//   }

//   return weeks
//     .filter((w) => !!w.length)
//     .map((w) => ({
//       start: new Date(year, month, w[0], 0),
//       end: new Date(year, month, w[w.length - 1], )
//     }));
// }

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const fetchActivityForDevPlans = async ({ devPlans, whitelist, timeSpan }) => {
  const now = new Date()

  const content = devPlans
    .map(({ content }) => content)
    .reduce((acc, curr) => [...acc, ...curr], [])
    .filter(
      ({ status, startDate, endDate }) =>
        whitelist.includes(status) && (startDate || endDate)
    )

  const firstDate = content.reduce((acc, { startDate }) => {
    const parsed = new Date(startDate)
    return parsed < acc ? parsed : acc
  }, new Date())

  const dateRanges = {
    THIS_WEEK: {
      d1: DateTime.fromJSDate(now).startOf('week'),
      d2: DateTime.fromJSDate(now),
      interval: { days: 1 }
    },
    THIS_MONTH: {
      d1: DateTime.fromJSDate(now).startOf('month'),
      d2: DateTime.fromJSDate(now),
      interval: { weeks: 1 }
    },
    LAST_MONTH: {
      d1: DateTime.fromJSDate(new Date(now - 2.628e9)).startOf('month'),
      d2: DateTime.fromJSDate(now).startOf('month'),
      interval: { weeks: 1 }
    },
    THIS_YEAR: {
      d1: DateTime.fromJSDate(now).startOf('year'),
      d2: DateTime.fromJSDate(now),
      interval: { weeks: 1 }
    },
    ALL_TIME: {
      d1: DateTime.fromJSDate(firstDate),
      d2: DateTime.fromJSDate(now),
      interval: now - firstDate < 3 * 2.628e9 ? { weeks: 1 } : { months: 1 }
    },
    default: {
      d1: DateTime.fromJSDate(now).startOf('month'),
      d2: DateTime.fromJSDate(now),
      interval: { weeks: 1 }
    }
  }

  const { d1, d2, interval } = dateRanges[timeSpan] || dateRanges.default

  const timeRanges = Interval.fromDateTimes(d1, d2).splitBy(interval)

  let xAxis = []
  xAxis = timeRanges.map(({ start, end }) => {
    if (interval.days) {
      return daysOfWeek[start.toJSDate().getDay()]
    }

    return `${start.toLocaleString({
      day: '2-digit',
      month: 'short'
    })} - ${end.toLocaleString({
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })}`
  })

  const {
    COMPLETED: completedContent = [],
    'IN PROGRESS': startedContent = []
  } = content.reduce(
    (acc, curr) => ({
      ...acc,
      [curr.status]: [...(acc[curr.status] || []), curr]
    }),
    {}
  )

  const learningCompleted = timeRanges.map(({ start, end }) => {
    return completedContent.reduce((acc, curr) => {
      const completedAt = new Date(curr.endDate)
      if (completedAt >= start.toJSDate() && completedAt < end.toJSDate())
        return acc + 1
      return acc
    }, 0)
  })

  const learningStarted = timeRanges.map(({ start, end }) => {
    return startedContent.reduce((acc, curr) => {
      const completedAt = new Date(curr.startDate)
      if (completedAt >= start.toJSDate() && completedAt < end.toJSDate())
        return acc + 1
      return acc
    }, 0)
  })

  if (
    xAxis.length < 2 ||
    (!learningCompleted.some(value => value > 0) &&
      !learningStarted.some(value => value > 0))
  ) {
    return { learningStarted: [], learningCompleted: [], xAxis: [] }
  }

  return { learningStarted, learningCompleted, xAxis }
}

export const queryResolvers = {
  Query: {
    fetchMostPopularResources: async (_, { organizationId }, context) => {
      try {
        const foundUsers = await User.find({
          organizationId
        })
          .select({ _id: 1 })
          .lean()
        const userIdsInOrg = foundUsers.map(({ _id }) => _id)

        const devPlans = await DevelopmentPlan.find({
          user: { $in: foundUsers.map(({ _id }) => _id) }
        }).lean()

        if (devPlans.length === 0) {
          return []
        }

        const content = devPlans.map(devPlan => {
          devPlan.content.forEach(content => (content.user = devPlan.user))
          return devPlan.content
        })

        const documentCount = async (type, usersArr) =>
          DevelopmentPlan.countDocuments({
            user: { $in: usersArr },
            'content.contentType': type
          })

        const mostPopularResources = Object.entries(
          content
            .reduce((acc, curr) => [...acc, ...curr], []) // FLATTEN ARRAY
            .reduce((acc, curr) => {
              return {
                // GROUP && COUNT CONTENT ITEMS BY TYPE
                ...acc,
                [curr.contentType ? curr.contentType : 'Not Specified']:
                  (acc[curr.contentType] || 0) + 1
              }
            }, {})
        ).map(([type, qty], idx) => {
          const userCount = documentCount(type, userIdsInOrg)
          return {
            // FORMAT OBJECT INTO ARRAY
            type,
            users: userCount,
            qty,
            _id: `${type}${idx}`
          }
        })

        return mostPopularResources
      } catch (e) {
        sentryCaptureException(e)
        console.log('There was an error while fetching Most Popular Resources')
      }
    },
    fetchMostPopularResourcesForTeams: async (_, { leaderId }, context) => {
      try {
        const teams = await Team.find({ leader: leaderId }).lean()

        const userIds = teams
          .map(({ members }) => [...members])
          .reduce((acc, curr) => [...acc, ...curr], [])

        const devPlans = await DevelopmentPlan.find({
          user: { $in: userIds }
        }).lean()

        if (devPlans.length === 0) {
          return []
        }

        const content = devPlans.map(devPlan => {
          devPlan.content.forEach(content => (content.user = devPlan.user))
          return devPlan.content
        })

        const documentCount = async (type, usersArr) =>
          DevelopmentPlan.countDocuments({
            user: { $in: usersArr },
            'content.contentType': type
          })

        const mostPopularResources = Object.entries(
          content
            .reduce((acc, curr) => [...acc, ...curr], []) // FLATTEN ARRAY
            .reduce((acc, curr) => {
              return {
                // GROUP && COUNT CONTENT ITEMS BY TYPE
                ...acc,
                [curr.contentType ? curr.contentType : 'Not Specified']:
                  (acc[curr.contentType] || 0) + 1
              }
            }, {})
        ).map(([type, qty], idx) => {
          const userCount = documentCount(type, userIds)
          return {
            // FORMAT OBJECT INTO ARRAY
            type,
            users: userCount,
            qty,
            _id: `${type}${idx}`
          }
        })

        return mostPopularResources
      } catch (e) {
        sentryCaptureException(e)
        console.log('There was an error while fetching Most Popular Resources')
      }
    },
    fetchTopInDemandSkills: async (_, args, { user: { organizationId } }) => {
      return {
        mostNeededSkills: await countFetch({
          field: 'neededWorkSkills._id',
          organizationId
        })
      }
    },
    fetchTopInDemandSkillsForTeam: async (_, { teamId }) => {
      return {
        mostNeededSkills: await countFetchForTeam({
          teamId
        })
      }
    },
    fetchActivity: async (_, { timeSpan }, { user: { organizationId } }) => {
      try {
        const whitelist = ['COMPLETED', 'IN PROGRESS']

        const devPlans = await DevelopmentPlan.find({
          organizationId,
          'content.status': { $in: whitelist }
        })
          .select({ content: 1 })
          .lean()

        return fetchActivityForDevPlans({
          devPlans,
          whitelist,
          timeSpan
        })
      } catch (e) {
        console.log(e)
      }
    },
    fetchActivityForTeam: async (_, { teamId, timeSpan }, context) => {
      try {
        const whitelist = ['COMPLETED', 'IN PROGRESS']

        const team = await Team.findById(teamId)
          .select({ leader: 1, members: 1 })
          .lean()

        const devPlans = await DevelopmentPlan.find({
          user: { $in: [team.leader, ...team.members] },
          'content.status': { $in: whitelist }
        })
          .select({ content: 1 })
          .lean()

        return fetchActivityForDevPlans({
          devPlans,
          whitelist,
          timeSpan
        })
      } catch (e) {
        console.log(e)
      }
    },
    fetchActivityForTeams: async (_, { leaderId, timeSpan }, context) => {
      try {
        const whitelist = ['COMPLETED', 'IN PROGRESS']

        const teams = await Team.find({ leader: leaderId }).lean()

        const userIds = teams
          .map(({ members }) => [...members])
          .reduce((acc, curr) => [...acc, ...curr], [])

        const devPlans = await DevelopmentPlan.find({
          user: { $in: userIds },
          'content.status': { $in: whitelist }
        })
          .select({ content: 1 })
          .lean()

        return fetchActivityForDevPlans({
          devPlans,
          whitelist,
          timeSpan
        })
      } catch (e) {
        console.log(e)
      }
    },
    fetchActivityForDevPlans
  }
}
