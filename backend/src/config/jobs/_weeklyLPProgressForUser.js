import {
  User,
  Goal,
  Team,
  DevelopmentPlan,
  Review,
  UserContentInteractions
} from '~/models'
import {
  sendEmail,
  appUrls,
  sentryCaptureException,
  learningPathNotification
} from '~/utils'
import { getLearningPathProgressForNotification } from './utils'

const jobName = 'weeklyLPProgressForUser'

const appLink = `${appUrls['user']}`

const callback = async (job, done) => {
  const now = new Date()
  if (now.getHours() !== 8 || now.getDay() !== 1 || now.getMinutes() !== 0) {
    job.schedule('monday at 8:00 am')
    job.save()
  } else {
    try {
      // const users = await User.find({
      //   email: { $in: ['wojciech@innential.com', 'wojciech@waat.eu']}
      // })
      //   .select({ _id: 1 })
      //   .lean()

      const activeDevPlans = await DevelopmentPlan.find({
        selectedGoalId: { $ne: null }
        // user: { $in: users.map(({ _id }) => _id) }
        // createdAt: { $gt: new Date(2020, 1, 1).getTime() }
      })
        .select({ _id: 1, content: 1, user: 1, selectedGoalId: 1 })
        .lean()

      await Promise.all(
        activeDevPlans.map(
          async ({ content, user: userId, selectedGoalId }) => {
            const contentProfile = await UserContentInteractions.findOne({
              user: userId
            })
              .select({ _id: 1, isReceivingContentEmails: 1 })
              .lean()

            if (!contentProfile || !contentProfile.isReceivingContentEmails) {
              return
            }

            const user = await User.findById(userId).select({
              _id: 1,
              email: 1
            })

            if (!user) {
              sentryCaptureException(new Error(`User: ${userId} not found`))
              return
            }

            const { _id, email } = user

            try {
              const data = await getLearningPathProgressForNotification({
                userId: _id,
                selectedGoalId,
                content,
                appLink
              })

              if (appLink && data) {
                const statusCode = await sendEmail(
                  email,
                  data.status === 'COMPLETED'
                    ? 'The next step in your Learning Path'
                    : 'Your Learning Path progress',
                  learningPathNotification({
                    ...data,
                    appLink
                  }),
                  'Innential',
                  'Weekly LP Progress'
                )
                console.log(`Email sent with status: ${statusCode}`)
              }
            } catch (err) {
              sentryCaptureException(err)
            }
          }
        )
      )
    } catch (e) {
      sentryCaptureException(e)
      job.fail(e)
      job.save()
    }
  }
  done()
}

export default {
  jobName,
  callback,
  // interval: '1 day',
  interval: '1 week',
  options: { timezone: 'Europe/Berlin' },
  type: 'single'
}
