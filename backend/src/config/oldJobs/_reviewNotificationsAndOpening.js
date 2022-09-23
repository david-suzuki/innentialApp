import {
  User,
  Team,
  Review,
  ReviewTemplate,
  ReviewResults,
  Goal,
  UserContentInteractions
} from '~/models'
import {
  sendEmail,
  appUrls,
  sentryCaptureException,
  reviewSchedulingReminder,
  reviewPreparationReminder,
  getDownloadLink
} from '~/utils'
import {
  determineScope,
  determineStartDate,
  // sendEventEmails,
  getUnscheduledUsers
} from '~/components/Reviews/review-data/utils'

const appLink = `${appUrls['user']}`

// FINALISED

const jobName = 'reviewNotificationsAndOpening'

const callback = async (job, done) => {
  try {
    const upcomingReviews = await Review.find({
      status: 'UPCOMING'
      // createdAt: { $gt: new Date(2020, 1, 1).getTime() }
    }).lean()
    const now = new Date()
    const [day, month, year] = [
      now.getDate(),
      now.getMonth(),
      now.getFullYear()
    ]

    await Promise.all(
      upcomingReviews.map(async review => {
        const { startsAt } = review
        const startDate = new Date(startsAt)
        // const oneDayBefore = new Date(startDate.getTime() - 1 * 8.64e7)
        // const twoDaysBefore = new Date(startDate.getTime() - 2 * 8.64e7)
        const oneWeekBefore = new Date(startDate.getTime() - 7 * 8.64e7)
        const twoWeeksBefore = new Date(startDate.getTime() - 14 * 8.64e7)

        const [startDay, startMonth, startYear] = [
          startDate.getDate(),
          startDate.getMonth(),
          startDate.getFullYear()
        ]

        if (startDay === day && startMonth === month && startYear === year) {
          const {
            _id,
            // reviewScope,
            // name: reviewName,
            templateId,
            organizationId
          } = review

          // CLOSING REVIEW
          const closedReview = await Review.findOneAndUpdate(
            { templateId, status: 'OPEN' },
            {
              $set: {
                status: 'CLOSED',
                closedAt: new Date()
              }
            },
            { new: true }
          )
          await ReviewResults.findOneAndUpdate(
            { reviewId: closedReview._id },
            {
              $set: {
                closedAt: new Date()
              }
            }
          )
          await Goal.updateMany(
            { reviewId: closedReview._id },
            {
              $set: {
                status: 'PAST'
              }
            }
          )

          // UPDATE REVIEW STATUS
          await Review.findOneAndUpdate(
            { _id },
            {
              $set: {
                status: 'OPEN'
              }
            }
          )

          // CREATE NEW REVIEW
          const reviewSchedule = await ReviewTemplate.findById(
            templateId
          ).lean()

          if (reviewSchedule) {
            const {
              name,
              goalType,
              scopeType,
              specificScopes,
              reviewers,
              specificReviewers,
              reviewFrequency,
              progressCheckFrequency,
              specificUsers,
              oneTimeReview
            } = reviewSchedule

            if (!oneTimeReview) {
              // PREDETERMINING THE REVIEW SCOPE (TEAMS, REVIEWERS)
              const newReviewScope = await determineScope({
                scopeType,
                specificScopes,
                reviewers,
                specificReviewers,
                organizationId,
                specificUsers
              })

              const reviewData = {
                name,
                organizationId,
                templateId,
                startsAt: determineStartDate({
                  reviewFrequency,
                  firstReviewStart: startDate
                }),
                progressCheckFrequency,
                goalsToReview: goalType,
                reviewScope: newReviewScope,
                scopeType
              }

              await Review.create(reviewData)

              // SEND EMAILS TO REVIEWERS TO SCHEDULE EVENTS

              // const reviewerIds = []
              // newReviewScope.forEach(({ reviewers }) => {
              //   const [reviewerId] = reviewers
              //   if (
              //     !reviewerIds.some(_id => String(reviewerId) === String(_id))
              //   ) {
              //     reviewerIds.push(reviewerId)
              //   }
              // })
              // await sendEventEmails(reviewerIds, createdReview._id)
            }
          }

          // IF NOT FOUND, WE DISREGARD THE NEW REVIEW CREATION

          // WE NO LONGER SEND EMAILS ON REVIEW START, THEY SHOULD HAVE EVENTS SCHEDULED ALREADY FOR THAT TIME
        } else if (
          oneWeekBefore.getDate() === day &&
          oneWeekBefore.getMonth() === month &&
          oneWeekBefore.getFullYear() === year
        ) {
          // REVIEW WILL START IN 1 WEEK
          const {
            reviewScope,
            scopeType,
            hasScheduledEvent: scheduledEvents = []
          } = review

          // GET REVIEWERS AND UNSCHEDULED USERS
          const unscheduledUsers = await getUnscheduledUsers(
            reviewScope,
            scopeType,
            scheduledEvents
          )
          if (unscheduledUsers.length > 0) {
            // REMINDER TO SCHEDULE EVENTS WITH USERS
            await Promise.all(
              unscheduledUsers.map(async ([reviewer, userIds]) => {
                // GET REVIEWER INFO
                const user = await User.findOne({
                  _id: reviewer,
                  status: 'active'
                }).lean()
                // GET INFO OF UNSCHEDULED USERS
                const unmappedUsers = await User.find({
                  _id: { $in: userIds },
                  status: 'active'
                }).select({ _id: 1, firstName: 1, lastName: 1 })
                // GET WORK ROLES AND PROFILE PICS OF USERS
                const users = await Promise.all(
                  unmappedUsers.map(async u => {
                    const { _id, firstName, lastName } = u
                    const roleAtWork = await u.getRoleAtWork()
                    const imgLink = await getDownloadLink({
                      key: 'users/profileImgs',
                      expires: 500 * 60,
                      _id: _id
                    })

                    return {
                      _id,
                      name: `${firstName} ${lastName}`,
                      roleAtWork,
                      imgLink
                    }
                  })
                )
                // SEND EMAIL
                if (user) {
                  const { _id, email } = user

                  const contentProfile = await UserContentInteractions.findOne({
                    user: _id
                  })
                    .select({ _id: 1, isReceivingContentEmails: 1 })
                    .lean()

                  if (
                    !contentProfile ||
                    !contentProfile.isReceivingContentEmails
                  ) {
                    return null
                  }

                  sendEmail(
                    email,
                    `Action required: you don't have all meetings scheduled for your review`,
                    reviewSchedulingReminder({
                      name: user.firstName,
                      reviewName: review.name,
                      reviewId: review._id,
                      reviewStartsOn: startsAt,
                      users,
                      appLink
                    })
                  )
                }
              })
            )
          }
        } else if (
          twoWeeksBefore.getDate() === day &&
          twoWeeksBefore.getMonth() === month &&
          twoWeeksBefore.getFullYear() === year
        ) {
          // REVIEW WILL START IN 2 WEEKS
          const { reviewScope, scopeType } = review

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
                  id =>
                    !reviewers.some(
                      reviewerId => String(reviewerId) === String(id)
                    )
                )
                return {
                  reviewer: reviewers[0],
                  usersInTeam
                }
              })
            )
            uniqueReviewees = usersPerTeam.reduce(
              (acc, { reviewer, usersInTeam }) => {
                const uniqueUsers = usersInTeam.filter(
                  id => !acc.some(({ userId }) => String(id) === String(userId))
                )
                return [
                  ...acc,
                  ...uniqueUsers.map(userId => ({ userId, reviewer }))
                ]
              },
              []
            )
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

                const previousGoal = await Goal.findOne({
                  reviewId: review._id,
                  user: userId,
                  status: 'ACTIVE'
                })
                  .select({ _id: 1 })
                  .lean()

                if (user) {
                  const { _id, email } = user

                  const contentProfile = await UserContentInteractions.findOne({
                    user: _id
                  })
                    .select({ _id: 1, isReceivingContentEmails: 1 })
                    .lean()

                  if (
                    !contentProfile ||
                    !contentProfile.isReceivingContentEmails
                  ) {
                    return null
                  }

                  sendEmail(
                    email,
                    `Action required: next review starting soon!`,
                    reviewPreparationReminder({
                      name: user.firstName,
                      reviewName: review.name,
                      reviewer: reviewer
                        ? `${reviewer.firstName} ${reviewer.lastName}`
                        : 'your reviewer',
                      reviewStartsOn: startsAt,
                      hasPreviousGoals: !!previousGoal,
                      appLink
                    })
                  )
                }
              })
            )
          }
        }
      })
    )
  } catch (e) {
    sentryCaptureException(e)
    job.fail(e)
    await job.save()
  } finally {
    done()
  }
}

export default {
  jobName,
  callback,
  // interval: '6 hours', // TEST
  interval: '1 day',
  options: { timezone: 'Europe/Berlin' },
  type: 'single'
}
