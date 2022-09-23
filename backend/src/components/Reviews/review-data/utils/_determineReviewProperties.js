import { Team, Organization, User } from '~/models'
import { appUrls, sendEmail, reviewPreparationReminder } from '~/utils'

const appLink = appUrls['user']

export const sendRequestEmails = async (reviewScope, scopeType) => {
  // GET REVIEWEES
  let uniqueReviewees = []
  if (scopeType === 'PERSONAL') {
    uniqueReviewees = reviewScope.map(({ userId, reviewers }) => ({
      userId,
      reviewer: reviewers[0]
    }))
  } else {
    const usersPerTeam = await Promise.all(
      reviewScope.map(async ({ teamId, reviewers }) => {
        const team = await Team.findOne({ _id: teamId, active: true })
          .select({ _id: 1, leader: 1, members: 1 })
          .lean()
        if (!team) {
          throw new Error(
            `Team with ID:${teamId} in review not found in database`
          )
        }
        const { leader, members } = team
        const usersInTeam = [leader, ...members].filter(
          id => !reviewers.some(reviewerId => String(reviewerId) === String(id))
        )
        return {
          reviewer: reviewers[0],
          usersInTeam
        }
      })
    )
    uniqueReviewees = usersPerTeam.reduce((acc, { reviewer, usersInTeam }) => {
      const uniqueUsers = usersInTeam.filter(
        id => !acc.some(({ userId }) => String(id) === String(userId))
      )
      return [...acc, ...uniqueUsers.map(userId => ({ userId, reviewer }))]
    }, [])
  }

  if (uniqueReviewees.length > 0) {
    // REMINDER TO DRAFT GOALS/ADD DEV PLANS
    await Promise.all(
      uniqueReviewees.map(async ({ userId, reviewer: reviewerId }) => {
        const user = await User.findOne({
          _id: userId,
          status: 'active'
        })
          .select({ _id: 1, firstName: 1, email: 1 })
          .lean()
        const reviewer = await User.findOne({
          _id: reviewerId,
          status: 'active'
        })
          .select({ _id: 1, firstName: 1, lastName: 1 })
          .lean()

        if (user) {
          const { email } = user
          await sendEmail(
            email,
            `Action required: next review starting soon!`,
            reviewPreparationReminder({
              name: user.firstName,
              reviewer: reviewer
                ? `${reviewer.firstName} ${reviewer.lastName}`
                : 'your reviewer',
              hasPreviousGoals: false,
              appLink
            })
          )
        }
      })
    )
  }
}

export const sendEventEmails = (reviewerIds, reviewId) =>
  Promise.all(
    reviewerIds.map(async reviewerId => {
      const user = await User.findById(reviewerId)
        .select({ status: 1, email: 1, _id: 1 })
        .lean()

      if (user && user.status === 'active') {
        // INSERT HERE: SEND REVIEW SCHEDULING EMAIL
        console.log(`Sending email to ${user.email}, for review: ${reviewId}`)
      }
    })
  )

const rearrangeScope = (userScope, scheduledEvents) =>
  Object.entries(
    userScope.reduce((acc, { userId, reviewers }) => {
      const reviewer = reviewers[0]
      if (
        !scheduledEvents.some(
          ({ userId: scheduledId }) => String(scheduledId) === String(userId)
        )
      ) {
        if (acc[reviewer]) {
          if (!acc[reviewer].some(id => String(id) === String(userId))) {
            return {
              ...acc,
              [reviewer]: [...acc[reviewer], userId]
            }
          }
        } else {
          return {
            ...acc,
            [reviewer]: [userId]
          }
        }
      }
      return acc
    }, {})
  )

export const getUnscheduledUsers = async (
  reviewScope,
  scopeType,
  scheduledEvents
) => {
  // RETURN [ [reviewerId, [unscheduledUserIds]] ]
  if (scopeType === 'PERSONAL') {
    return rearrangeScope(reviewScope, scheduledEvents)
  } else {
    const usersPerTeam = await Promise.all(
      reviewScope.map(async ({ teamId, reviewers }) => {
        const team = await Team.findOne({ _id: teamId, active: true })
          .select({ _id: 1, leader: 1, members: 1 })
          .lean()
        if (!team) {
          throw new Error(
            `Team with ID:${teamId} in review not found in database`
          )
        }
        const { leader, members } = team
        const usersInTeam = [leader, ...members].filter(
          id => !reviewers.some(reviewerId => String(reviewerId) === String(id))
        )
        return {
          reviewers,
          usersInTeam
        }
      })
    )

    const userScope = usersPerTeam.reduce((acc, { reviewers, usersInTeam }) => {
      const uniqueUsers = usersInTeam.filter(
        id => !acc.some(({ userId }) => String(id) === String(userId))
      )
      return [...acc, ...uniqueUsers.map(userId => ({ userId, reviewers }))]
    }, [])

    return rearrangeScope(userScope, scheduledEvents)
  }
}

export const determineScope = async ({
  scopeType,
  specificScopes,
  specificUsers,
  reviewers,
  specificReviewers,
  organizationId,
  currentUserId,
  leadersReview
}) => {
  const reviewScope = []
  switch (scopeType) {
    case 'ALL':
      const allTeams = await Team.find({ organizationId, active: true })
        .select({ _id: 1, leader: 1 })
        .lean()

      switch (reviewers) {
        case 'ADMIN':
          const organization = await Organization.findById(
            organizationId
          ).select({ admins: 1 })
          const { admins: allAdmins } = organization
          allTeams.forEach(({ _id: teamId }) =>
            reviewScope.push({ teamId, reviewers: allAdmins })
          )
          break
        case 'SPECIFIC':
          allTeams.forEach(({ _id: teamId }) =>
            reviewScope.push({ teamId, reviewers: specificReviewers })
          )
          break
        default:
          allTeams.forEach(({ _id: teamId, leader }) =>
            reviewScope.push({ teamId, reviewers: [leader] })
          )
          break
      }
      break
    case 'SPECIFIC':
      const specificTeams = await Team.find({
        _id: { $in: specificScopes }
      }).select({ _id: 1, leader: 1 })
      switch (reviewers) {
        case 'ADMIN':
          const organization = await Organization.findById(
            organizationId
          ).select({ admins: 1 })
          const { admins: allAdmins } = organization
          specificTeams.forEach(({ _id: teamId }) =>
            reviewScope.push({ teamId, reviewers: allAdmins })
          )
          break
        case 'SPECIFIC':
          specificTeams.forEach(({ _id: teamId }) =>
            reviewScope.push({ teamId, reviewers: specificReviewers })
          )
          break
        default:
          specificTeams.forEach(({ _id: teamId, leader }) =>
            reviewScope.push({ teamId, reviewers: [leader] })
          )
          break
      }
      break
    case 'PERSONAL':
      switch (reviewers) {
        case 'ADMIN':
          const organization = await Organization.findById(
            organizationId
          ).select({ admins: 1 })
          const { admins: allAdmins } = organization
          specificUsers.forEach(userId =>
            reviewScope.push({ userId, reviewers: allAdmins })
          )
          break
        case 'SPECIFIC':
          specificUsers.forEach(userId =>
            reviewScope.push({ userId, reviewers: specificReviewers })
          )
          break
        default:
          if (leadersReview) {
            specificUsers.forEach(userId =>
              reviewScope.push({ userId, reviewers: [currentUserId] })
            )
          } else {
            await Promise.all(
              specificUsers.map(async userId => {
                const membersTeam = await Team.findOne({
                  members: userId
                }).select({ _id: 1, leader: 1 })
                if (membersTeam) {
                  reviewScope.push({ userId, reviewers: [membersTeam.leader] })
                }
              })
            )
          }
      }
      break
  }
  return reviewScope
}

export const addDateInterval = (
  repeatInterval,
  repeatCount,
  firstReviewStart
) => {
  const now = new Date(firstReviewStart)
  const timeIntervals = {
    WEEK: 604800000,
    MONTH: 2592000000,
    YEAR: 31104000000
  }
  const addedTime = timeIntervals[repeatInterval] * repeatCount

  return new Date(now.getTime() + addedTime)
}

export const determineStartDate = ({
  reviewFrequency: { repeatInterval, repeatCount },
  firstReviewStart
}) => {
  const now = new Date(firstReviewStart)
  const timeIntervals = {
    WEEK: 604800000,
    MONTH: 2592000000,
    YEAR: 31104000000
  }
  const addedTime = timeIntervals[repeatInterval] * repeatCount

  return new Date(now.getTime() + addedTime)
}

export const checkSameDay = (dateToCheck, actualDate) => {
  return (
    dateToCheck.getDate() === actualDate.getDate() &&
    dateToCheck.getMonth() === actualDate.getMonth() &&
    dateToCheck.getFullYear() === actualDate.getFullYear()
  )
}
