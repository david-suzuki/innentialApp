import { isUser } from '~/directives'
import { ReviewTemplate, Review, Goal, ReviewResults } from '~/models'
import {
  determineScope,
  checkSameDay,
  addDateInterval,
  determineStartDate,
  sendEventEmails,
  sendRequestEmails
} from './utils'
import { sentryCaptureException } from '~/utils'

export const mutationTypes = `
  type Mutation {
    createReviewTemplate(inputData: ReviewTemplateInput): String @${isUser}
    deleteReviewTemplate(templateId: ID!): String @${isUser}
    startReview(reviewId: ID!): [Review] @${isUser}
    closeReview(reviewId: ID!, goalIds: [ID]): Review @${isUser}
    scheduleEvent(userId: ID!, scheduledDate: DateTime!, reviewId: ID!): String @${isUser}
  }
`

export const mutationResolvers = {
  Mutation: {
    scheduleEvent: async (
      _,
      { userId, scheduledDate, reviewId },
      { user: { _id: scheduledBy } }
    ) => {
      try {
        await Review.findOneAndUpdate(
          {
            $or: [
              {
                _id: reviewId
              },
              {
                templateId: reviewId,
                status: 'UPCOMING'
              }
            ],
            'hasScheduledEvent.userId': { $ne: userId }
          },
          {
            $addToSet: {
              hasScheduledEvent: {
                userId,
                scheduledDate,
                scheduledBy
              }
            }
          }
        )
        return 'Success'
      } catch (e) {
        sentryCaptureException(e)
        return `${e.message}`
      }
    },
    createReviewTemplate: async (
      _,
      { inputData },
      { user: { organizationId, _id } }
    ) => {
      try {
        const isToday = checkSameDay(
          new Date(inputData.firstReviewStart),
          new Date()
        )

        if (inputData.edittingId) {
          // we are editting
          const updatedTemplate = await ReviewTemplate.findOneAndUpdate(
            { _id: inputData.edittingId },
            { $set: inputData },
            { new: true }
          )

          if (inputData.updateReview) {
            const upcomingReview = await Review.findOne({
              templateId: inputData.edittingId,
              status: 'UPCOMING'
            }).select({ startsAt: 1 })
            if (upcomingReview) {
              const { startsAt } = upcomingReview
              const {
                name,
                goalType,
                scopeType,
                specificScopes,
                reviewers,
                specificReviewers,
                progressCheckFrequency,
                specificUsers,
                leadersReview
              } = inputData

              const reviewScope = await determineScope({
                scopeType,
                specificScopes,
                reviewers,
                specificReviewers,
                organizationId,
                specificUsers,
                currentUserId: _id,
                leadersReview
              })

              const reviewData = {
                name,
                organizationId,
                templateId: updatedTemplate._id,
                startsAt,
                progressCheckFrequency,
                goalsToReview: goalType,
                reviewScope,
                status: 'UPCOMING',
                scopeType
              }

              await Review.findByIdAndRemove(upcomingReview._id)
              await Review.create(reviewData)
            }
          }

          return updatedTemplate._id
        } else {
          const createdReview = await ReviewTemplate.create({
            ...inputData,
            organizationId,
            createdBy: inputData.leadersReview ? _id : null
          })
          const {
            name,
            goalType,
            scopeType,
            specificScopes,
            reviewers,
            reviewFrequency,
            specificReviewers,
            specificUsers,
            firstReviewStart,
            progressCheckFrequency,
            leadersReview
          } = inputData

          // PREDETERMINING THE REVIEW SCOPE (TEAMS, REVIEWERS)

          const reviewScope = await determineScope({
            scopeType,
            specificScopes,
            specificUsers,
            reviewers,
            specificReviewers,
            organizationId,
            currentUserId: _id,
            leadersReview
          })

          const reviewData = {
            name,
            organizationId,
            templateId: createdReview._id,
            startsAt: isToday
              ? addDateInterval(
                  reviewFrequency.repeatInterval,
                  reviewFrequency.repeatCount,
                  firstReviewStart
                )
              : firstReviewStart,
            progressCheckFrequency,
            goalsToReview: goalType,
            reviewScope,
            status: 'UPCOMING',
            scopeType
          }

          const reviewDataOpen = {
            name,
            organizationId,
            templateId: createdReview._id,
            startsAt: firstReviewStart,
            progressCheckFrequency,
            goalsToReview: goalType,
            reviewScope,
            status: 'OPEN',
            scopeType
          }

          const isCloserThan2Weeks =
            new Date(inputData.firstReviewStart) - new Date() < 14 * 8.64e7
          if (isCloserThan2Weeks && !isToday) {
            await sendRequestEmails(reviewScope, scopeType)
          }

          // SEND EMAILS TO REVIEWERS TO SCHEDULE EVENTS WITH THEIR REVIEWEES

          const review = await Review.create(reviewData)
          if (!leadersReview) {
            const reviewerIds = []
            reviewScope.forEach(({ reviewers }) => {
              const [reviewerId] = reviewers
              if (
                !reviewerIds.some(_id => String(reviewerId) === String(_id))
              ) {
                reviewerIds.push(reviewerId)
              }
            })
            await sendEventEmails(reviewerIds, review._id)
          }
          isToday && (await Review.create(reviewDataOpen))
          return createdReview._id
        }
      } catch (e) {
        sentryCaptureException(e)
        return e.message
      }
    },
    deleteReviewTemplate: async (_, { templateId }) => {
      try {
        // IF THERE ARE NO GOALS SET FOR THE CURRENT OPEN REVIEW, IT SHOULD BE DELETED
        const openReview = await Review.findOne({ templateId, status: 'OPEN' })
        if (openReview) {
          const goalsToReview = await Goal.countDocuments({
            reviewId: openReview._id
          })
          if (goalsToReview === 0) {
            await Review.findByIdAndRemove(openReview._id)
          }
        }
        // CLEANUP GOAL DATA FROM THE REVIEW THAT WE'LL DELETE
        const upcomingReview = await Review.findOne({
          templateId,
          status: 'UPCOMING'
        })
        if (upcomingReview) {
          await Goal.deleteMany({ reviewId: upcomingReview._id })
          await Review.findByIdAndRemove(upcomingReview._id)
        }

        await ReviewTemplate.findByIdAndRemove(templateId)
        return 'Success'
      } catch (e) {
        sentryCaptureException(e)
        return e.message
      }
    },
    startReview: async (_, { reviewId }, { user: { organizationId } }) => {
      const review = await Review.findById(reviewId)
      if (review) {
        try {
          const reviewSchedule = await ReviewTemplate.findById(
            review.templateId
          )
          if (reviewSchedule) {
            const { _id: templateId } = reviewSchedule

            const openReview = await Review.findOne({
              templateId,
              status: 'OPEN'
            })
            if (openReview) {
              console.log('Review already open')
              return null
            }

            const {
              name,
              goalType,
              scopeType,
              specificScopes,
              reviewers,
              specificReviewers,
              specificUsers,
              reviewFrequency,
              progressCheckFrequency,
              createdBy
              // oneTimeReview
            } = reviewSchedule

            // PREDETERMINING THE REVIEW SCOPE (TEAMS, REVIEWERS)
            const result = await Review.findOneAndUpdate(
              { _id: review._id },
              {
                $set: {
                  startsAt: new Date(),
                  status: 'OPEN'
                }
              },
              { new: true }
            )
            // if (oneTimeReview) return [result]

            const reviewScope = await determineScope({
              scopeType,
              specificScopes,
              reviewers,
              specificReviewers,
              organizationId,
              specificUsers,
              currentUserId: createdBy,
              leadersReview: createdBy !== null
            })

            const reviewData = {
              name,
              organizationId,
              templateId,
              startsAt: determineStartDate({
                reviewFrequency,
                firstReviewStart: new Date()
              }),
              progressCheckFrequency,
              goalsToReview: goalType,
              reviewScope,
              scopeType
            }

            const created = await Review.create(reviewData)

            return [result, created]
          } else {
            const result = await Review.findOneAndUpdate(
              { _id: review._id },
              {
                $set: {
                  startsAt: new Date(),
                  status: 'OPEN'
                }
              },
              { new: true }
            )
            return [result]
          }
        } catch (e) {
          sentryCaptureException(e)
          return null
        }
      }
      return null
    },
    closeReview: async (_, { reviewId, goalIds }) => {
      try {
        const result = await Review.findOneAndUpdate(
          { _id: reviewId },
          {
            $set: {
              status: 'CLOSED',
              closedAt: new Date()
            }
          },
          { new: true }
        )
        await ReviewResults.findOneAndUpdate(
          { reviewId },
          {
            $set: {
              closedAt: new Date()
            }
          }
        )
        if (goalIds && goalIds.length > 0) {
          const { templateId } = result
          const upcomingReview = await Review.findOne({
            templateId,
            status: 'UPCOMING'
          })
          if (upcomingReview) {
            await Goal.updateMany(
              { _id: { $in: goalIds } },
              {
                $set: {
                  reviewId: upcomingReview._id
                }
              }
            )
          } else {
            await Goal.updateMany(
              { _id: { $in: goalIds } },
              {
                $unset: {
                  reviewId
                }
              }
            )
          }
        } else {
          await Goal.updateMany(
            { reviewId },
            {
              $set: {
                reviewedAt: new Date(),
                status: 'PAST'
              }
            }
          )
        }
        return result
      } catch (e) {
        sentryCaptureException(e)
        return null
      }
    }
  }
}
