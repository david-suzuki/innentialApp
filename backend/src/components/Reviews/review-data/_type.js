import {
  ReviewTemplate,
  Review,
  User,
  Team,
  ReviewResults,
  Goal
} from '~/models'
import { getDownloadLink } from '~/utils'

const scopeLabels = {
  ALL: () => 'All Teams',
  SPECIFIC: async ({ specificScopes: teamIds }) => {
    const teams = await Team.find({ _id: { $in: teamIds } })
      .select({ teamName: 1 })
      .lean()

    return `Team${teams.length > 1 ? 's' : ''} ${teams
      .slice(0, 2)
      .map(({ teamName }) => teamName)
      .join(', ')}${teams.length > 2 ? `and ${teams.length - 2} more` : ''}`
  },
  PERSONAL: async ({ specificUsers: userIds }) => {
    const users = await User.find({ _id: { $in: userIds } })
      .select({ firstName: 1, lastName: 1, email: 1 })
      .lean()

    return `${users
      .slice(0, 2)
      .map(({ firstName, lastName, email }) =>
        firstName ? `${firstName} ${lastName}` : email
      )
      .join(', ')}${users.length > 2 ? `and ${users.length - 2} more` : ''}`
  }
}

const findTeamLeads = async ({
  scopeType,
  organizationId,
  specificUsers: userIds,
  specificScopes: teamIds
}) => {
  const queries = {
    ALL: { organizationId },
    SPECIFIC: { _id: { $in: teamIds } },
    PERSONAL: { members: { $in: userIds } }
  }

  const teams = await Team.find(queries[scopeType])
    .select({ leader: 1 })
    .lean()

  const users = await User.find({
    _id: { $in: teams.map(({ leader }) => leader) }
  })
    .select({ firstName: 1, lastName: 1, email: 1 })
    .lean()

  return `${users
    .slice(0, 2)
    .map(({ firstName, lastName, email }) =>
      firstName ? `${firstName} ${lastName}` : email
    )
    .join(', ')}${users.length > 2 ? `and ${users.length - 2} more` : ''}`
}

const reviewerLabels = {
  ADMIN: async ({ organizationId }) => {
    const users = await User.find({ organizationId, roles: 'ADMIN' })
      .select({ firstName: 1, lastName: 1, email: 1 })
      .lean()

    return `${users
      .slice(0, 2)
      .map(({ firstName, lastName, email }) =>
        firstName ? `${firstName} ${lastName}` : email
      )
      .join(', ')}${users.length > 2 ? `and ${users.length - 2} more` : ''}`
  },
  TEAMLEAD: findTeamLeads,
  SPECIFIC: async ({ specificReviewers: userIds }) => {
    const users = await User.find({ _id: { $in: userIds } })
      .select({ firstName: 1, lastName: 1, email: 1 })
      .lean()

    return `${users
      .slice(0, 2)
      .map(({ firstName, lastName, email }) =>
        firstName ? `${firstName} ${lastName}` : email
      )
      .join(', ')}${users.length > 2 ? `and ${users.length - 2} more` : ''}`
  }
}

export const types = `
  type Review {
    _id: ID!
    name: String!
    startsAt: DateTime!
    closedAt: DateTime
    status: String!
    createdBy: ID
    progressChecks: String
    scope: String
    reviewers: String
    hasResult: Boolean
    unreviewedGoals: [ID]
  }

  type ReviewSchedule {
    _id: ID!
    name: String!
    scope: String!
    reviewers: String!
    firstReviewStart: DateTime!
    nextReviewStart: DateTime
    reviewFrequency: String
    progressChecks: String
    oneTimeReview: Boolean
  }

  type ReviewScheduleEditInfo {
    _id: ID!
    name: String!
    goalType: String!
    scopeType: String!
    firstReviewStart: DateTime!
    specificScopes: [Team]
    specificUsers: [Employees]
    reviewers: String!
    specificReviewers: [Employees]
    reviewFrequency: DetailedFrequency!
    progressCheckFrequency: DetailedFrequency!
    oneTimeReview: Boolean
  }

  type ReviewResult {
    _id: ID!
    name: String!
    closedAt: DateTime
    userResults: [UserResult]
  }

  type DetailedFrequency {
    _id: ID!
    repeatCount: Int!
    repeatInterval: String!
    day: Int
  }

  type ReviewStartInfo {
    _id: ID!
    name: String!
    teams: [ReviewTeamInfo]
    type: String!
  }

  type ReviewTeamInfo {
    _id: ID!
    teamName: String!
    users: [ReviewUserInfo]
    isReviewer: Boolean
  }

  type ReviewUserInfo {
    _id: ID!
    userName: String!
    email: String!
    active: Boolean
    roleAtWork: String
    location: String
    numberOfGoals: Int
    imageLink: String
    goalsSet: DateTime
    hasEventScheduled: DateTime
  }

  type ReviewScopeInfo {
    _id: ID!
    status: String!
    startsAt: DateTime
    reviewStartInfo: ReviewStartInfo
  }
`

export const typeResolvers = {
  Review: {
    createdBy: async ({ templateId }) => {
      const template = await ReviewTemplate.findById(templateId)
        .select({ createdBy: 1 })
        .lean()
      if (template) return template.createdBy
      return null
    },
    unreviewedGoals: async ({ _id: reviewId }) => {
      const activeGoals = await Goal.find({ reviewId, status: 'ACTIVE' })
        .select({ _id: 1 })
        .lean()
      return activeGoals.map(({ _id }) => _id)
    },
    // completedReview: async (
    //   { _id: reviewId, templateId, reviewScope },
    //   _,
    //   { user: { _id } }
    // ) => {
    //   const nextReview = await Review.findOne({
    //     templateId,
    //     status: 'UPCOMING'
    //   })
    //     .select({ _id: 1 })
    //     .lean()

    //   const teamsToReview = reviewScope
    //     .filter(({ reviewers }) =>
    //       reviewers.some(userId => String(userId) === String(_id))
    //     )
    //     .map(({ teamId }) => teamId)

    //   const allTeams = await Team.find({ _id: { $in: teamsToReview } }).lean()
    //   const userIds = []
    //   allTeams.forEach(({ leader, members }) => {
    //     ;[leader, ...members].forEach(userId => {
    //       if (!userIds.some(unique => String(unique) === String(userId))) {
    //         userIds.push(userId)
    //       }
    //     })
    //   })

    //   if (nextReview) {
    //     // THIS ARRAY REPRESENTS WHICH OF THE REQUIRED USERS HAVE THEIR GOALS ALREADY SET
    //     const haveGoalsSet = await Promise.all(
    //       userIds.map(async user => {
    //         const newGoalsLength = await Goal.countDocuments({
    //           reviewId: nextReview._id,
    //           user
    //         })
    //         return newGoalsLength > 0
    //       })
    //     )

    //     // IF ALL OF THEM HAVE SET GOALS, THE REVIEW IS DONE
    //     return haveGoalsSet.every(isSet => isSet)
    //   } else {
    //     return false
    //   }
    // },
    // isReviewer: async ({ reviewScope }, _, { user: { _id } }) => {
    //   return reviewScope.some(({ reviewers }) =>
    //     reviewers.some(userId => String(userId) === String(_id))
    //   )
    // },
    hasResult: async ({ _id: reviewId }) => {
      const reviewResult = await ReviewResults.findOne({ reviewId })
      if (reviewResult) return true
      return false
    },
    scope: async ({ templateId }) => {
      const template = await ReviewTemplate.findById(templateId)
      if (template) {
        return scopeLabels[template.scopeType](template)
      }
      return ''
    },
    // affectedTeams: async (
    //   { _id: reviewId, reviewScope },
    //   _,
    //   { user: { _id } }
    // ) => {
    //   const teamIds = reviewScope.map(({ teamId }) => teamId)
    //   const teamsToReview = await Team.find({ _id: { $in: teamIds } })
    //     .select({ _id: 1, teamName: 1 })
    //     .lean()

    //   return teamsToReview.map(({ _id: teamId, teamName }) => {
    //     const teamScope = reviewScope.find(
    //       ({ teamId: scopeId }) => String(scopeId) === String(teamId)
    //     )
    //     return {
    //       _id: reviewId + teamId,
    //       teamName,
    //       adminIsReviewer:
    //         teamScope &&
    //         teamScope.reviewers.some(userId => String(userId) === String(_id))
    //     }
    //   })
    // },
    reviewers: async ({ templateId }) => {
      const template = await ReviewTemplate.findById(templateId)
      if (template) return reviewerLabels[template.reviewers](template)
      return ''
    },
    progressChecks: async ({
      progressCheckFrequency: { repeatCount, repeatInterval, day }
    }) => {
      const weekdays = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
      ]
      if (repeatCount === 0) return 'No progress checks'
      return `Every ${repeatCount === 1 ? '' : `${repeatCount} `}${
        repeatCount > 1
          ? repeatInterval.toLowerCase() + 's'
          : repeatInterval.toLowerCase()
      } on ${weekdays[day]}`
    }
  },
  ReviewSchedule: {
    scope: async template => scopeLabels[template.scopeType](template),
    reviewers: async template => reviewerLabels[template.reviewers](template),
    nextReviewStart: async ({ _id: templateId, firstReviewStart }) => {
      const nextReview = await Review.findOne({
        templateId,
        status: 'UPCOMING'
      }).lean()
      if (
        nextReview &&
        Date.parse(nextReview.startsAt) !== Date.parse(firstReviewStart)
      )
        return nextReview.startsAt
      return null
    },
    reviewFrequency: async ({
      reviewFrequency: { repeatCount, repeatInterval },
      oneTimeReview
    }) => {
      if (oneTimeReview) return `Just once`
      const isHalfyearly = repeatCount === 6 && repeatInterval === 'MONTH'
      if (isHalfyearly) return `Every half year`
      const isQuarterly = repeatCount === 3 && repeatInterval === 'MONTH'
      if (isQuarterly) return `Every quarter`
      return `Every ${repeatCount === 1 ? '' : `${repeatCount} `}${
        repeatCount > 1
          ? repeatInterval.toLowerCase() + 's'
          : repeatInterval.toLowerCase()
      }`
    },
    progressChecks: async ({
      progressCheckFrequency: { repeatCount, repeatInterval, day }
    }) => {
      const weekdays = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
      ]
      if (repeatCount === 0) return 'No progress checks'
      return `Every ${repeatCount === 1 ? '' : `${repeatCount} `}${
        repeatCount > 1
          ? repeatInterval.toLowerCase() + 's'
          : repeatInterval.toLowerCase()
      } on ${weekdays[day]}`
    }
  },
  ReviewScheduleEditInfo: {
    specificUsers: async ({ scopeType, specificUsers }) => {
      if (scopeType === 'PERSONAL') {
        const normalisedUsers = await Promise.all(
          specificUsers.map(async userId => {
            const user = await User.findById(userId)
            if (user) return user
            return {
              _id: '',
              email: '',
              firstName: '',
              lastName: ''
            }
          })
        )
        return normalisedUsers
      } else return []
    },
    specificScopes: async ({ scopeType, specificScopes }) => {
      if (scopeType === 'SPECIFIC') {
        const normalisedScopes = await Promise.all(
          specificScopes.map(async scopeId => {
            const team = await Team.findById(scopeId).lean()
            if (team) return team
            return {
              _id: '',
              teamName: ''
            }
          })
        )
        return normalisedScopes
      } else return []
    },
    specificReviewers: async ({ reviewers, specificReviewers }) => {
      if (reviewers === 'SPECIFIC') {
        const normalisedReviewers = await Promise.all(
          specificReviewers.map(async reviewerId => {
            const reviewer = await User.findById(reviewerId)
            if (reviewer) return reviewer
            return {
              _id: '',
              email: '',
              firstName: '',
              lastName: ''
            }
          })
        )
        return normalisedReviewers
      } else return []
    },
    reviewFrequency: async ({
      _id,
      reviewFrequency: { repeatCount, repeatInterval }
    }) => {
      return {
        _id: `${_id}+rf`,
        repeatCount,
        repeatInterval
      }
    },
    progressCheckFrequency: async ({
      _id,
      progressCheckFrequency: { repeatCount, repeatInterval, day }
    }) => {
      return {
        _id: `${_id}+pcf`,
        repeatCount,
        repeatInterval,
        day
      }
    }
  },
  ReviewResult: {
    name: async ({ reviewId }) => {
      const review = await Review.findById(reviewId)
      if (review) return review.name
      return ''
    }
  },
  ReviewUserInfo: {
    imageLink: async ({ _id: userId }) => {
      const link = await getDownloadLink({
        key: 'users/profileImgs',
        expires: 500 * 60,
        _id: userId
      })
      return link
    }
    // hasEventScheduled: ({ _id: userId }) => {

    // }
    // goalsCompleted: async ({ _id, goals }, args, context, { variableValues: { reviewId } }) => {
    //   if(goals.length > 0) {
    //     //NOTE: THIS IS NOT YET TESTED, BUT IT SHOULD FIND THE GOALS WHOSE RESULTS HAVE ALREADY BEEN SAVED
    //     const reviewResults = await ReviewResults.findOne({ reviewId }).select({ goalResults: 1 }).lean()
    //     if(reviewResults) {
    //       const { goalResults } = reviewResults
    //       return goals.every(goalId => goalResults.some(({ _id }) => String(_id) === String(goalId)))
    //     }
    //   }
    //   return false
    // }
  }
}
