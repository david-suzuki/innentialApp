import { User, Review } from '~/models'
import {
  sendEmail,
  appUrls,
  sentryCaptureException,
  reviewClosingReminder
} from '~/utils'

const appLink = `${appUrls['user']}`

// REQUIRES FURTHER ELABORATION, WHAT IS THE REAL USE CASE OF THIS?

const jobName = 'TEST_reviewClosingReminder'

const callback = async (job, done) => {
  try {
    const openReviews = await Review.find({
      status: 'OPEN',
      createdAt: { $gt: new Date(2020, 1, 1).getTime() }
    }).lean()
    const now = new Date()
    // const [day, month, year] = [
    //   now.getDate(),
    //   now.getMonth(),
    //   now.getFullYear()
    // ]

    await Promise.all(
      openReviews.map(async review => {
        const { startsAt } = review
        const startDate = new Date(startsAt)
        // const oneWeekAfter = new Date(startDate.getTime() + 7 * 8.64e7)

        if (
          // *NOTE: HERE, TWO HOURS
          now.getTime() >= startDate.getTime() + 7200000 &&
          now.getTime() < startDate.getTime() + 10800000
          // oneWeekAfter.getDate() === day &&
          // oneWeekAfter.getMonth() === month &&
          // oneWeekAfter.getFullYear() === year
        ) {
          // REVIEW HAS BEEN OPEN FOR A WEEK*
          const { reviewScope } = review

          // GET REVIEWEES
          const uniqueReviewers = []
          reviewScope.forEach(({ reviewers }) => {
            reviewers.forEach(reviewerId => {
              if (
                !uniqueReviewers.some(
                  uniqueId => String(uniqueId) === String(reviewerId)
                )
              ) {
                uniqueReviewers.push(reviewerId)
              }
            })
          })

          // REMINDER TO DRAFT GOALS/ADD DEV PLANS
          await Promise.all(
            uniqueReviewers.map(async userId => {
              const user = await User.findOne({
                _id: userId,
                status: 'active'
              })
                .select({ _id: 1, firstName: 1, email: 1 })
                .lean()

              if (user) {
                const { email } = user
                sendEmail(
                  email,
                  `Action required: are you done reviewing?`,
                  reviewClosingReminder({
                    name: user.firstName,
                    reviewName: review.name,
                    appLink
                  })
                )
              }
            })
          )
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
  interval: '1 hour',
  // interval: '1 day',
  options: { timezone: 'Europe/Berlin' },
  type: 'single'
}
