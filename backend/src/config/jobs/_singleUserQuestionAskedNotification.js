import {
  User,
  Comment,
  UserContentInteractions,
  LearningPathTemplate,
  Goal,
  Team
} from '~/models'
import {
  sentryCaptureException,
  sendEmail,
  questionAskedNotification,
  appUrls,
  getDownloadLink
} from '~/utils'
import { analytics } from '../'

const appLink = `${appUrls['user']}`

const jobName = 'singleUserQuestionAskedNotification'

const callback = async (job, done) => {
  const today = new Date().getDay()
  const [sunday, saturday] = [0, 6]

  if (today === sunday) {
    job.schedule('tomorrow')
    job.save()
    done()
    return
  }
  if (today === saturday) {
    job.schedule('in two days')
    job.save()
    done()
    return
  }

  if (job.attrs) {
    const {
      // priority,
      data: { user, comment }
    } = job.attrs

    try {
      const userData = await User.findById(user)
        .select({ _id: 1, firstName: 1, lastName: 1 })
        .lean()

      const commentData = await Comment.findById(comment)
        .select({
          _id: 1,
          abstract: 1,
          content: 1,
          pathId: 1,
          organizationId: 1
        })
        .lean()

      if (userData && commentData) {
        const { abstract, content, pathId, organizationId } = commentData

        const learningPath = await LearningPathTemplate.findById(pathId)
          .select({ name: 1, goalTemplate: 1 })
          .lean()

        if (!learningPath) throw new Error(`LP not found: ${pathId}`)

        const { name: pathname, goalTemplate } = learningPath

        const goalsInProgress = await Goal.find({
          status: 'ACTIVE',
          organizationId,
          fromTemplate: { $in: goalTemplate }
        })
          .select({ user: 1 })
          .lean()

        const goalsCompleted = await Goal.find({
          status: 'PAST',
          organizationId,
          fromTemplate: { $in: goalTemplate }
        })
          .select({ _id: 1, fromTemplate: 1, user: 1 })
          .lean()

        const byUser = Object.entries(
          goalsCompleted.reduce((acc, curr) => {
            return {
              ...acc,
              [curr.user]: [...(acc[curr.user] || []), curr.fromTemplate]
            }
          }, {})
        )

        const usersCompleted = byUser
          .filter(([userId, goals]) => goals.length === goalTemplate.length)
          .map(([userId]) => userId)

        const usersInProgress = goalsInProgress.map(({ user }) => user)

        const userTeams = await Team.find({
          members: user,
          organizationId,
          active: true
        })
          .select({ leader: 1 })
          .lean()

        const teamLeads = userTeams.map(({ leader }) => leader)

        const userIds = [...teamLeads, ...usersInProgress, ...usersCompleted]

        const users = await User.find({
          $and: [{ _id: { $in: userIds } }, { _id: { $ne: user } }],
          status: 'active'
        })
          .select({ _id: 1, email: 1, firstName: 1 })
          .lean()

        await Promise.all(
          users.map(async ({ _id, email, firstName }) => {
            const isReceivingEmails = await UserContentInteractions.findOne({
              user: _id,
              isReceivingContentEmails: true
            })
              .select({ _id: 1 })
              .lean()

            if (!isReceivingEmails) {
              console.log(`User ${_id} is not receiving emails, aborting`)
              return
            }

            const statusCode = await sendEmail(
              email,
              `${(userData && userData.firstName) ||
                'Someone'} asked a question in a learning path`,
              questionAskedNotification({
                pathId,
                pathname,
                questionId: comment,
                abstract,
                content,
                user: {
                  _id: userData._id,
                  name: `${userData.firstName} ${userData.lastName}`,
                  imgLink: await getDownloadLink({
                    key: 'users/profileImgs',
                    expires: 500 * 60,
                    _id: userData._id
                  })
                },
                appLink,
                name: firstName
              })
            )
            await analytics.trackSafe({
              userId: String(_id),
              event: 'question_asked_email',
              properties: {
                questionId: String(comment)
              }
            })
            console.log(`Email sent with status code ${statusCode}`)
          })
        )
      } else {
        throw new Error(`No user/comment data found for ID:${comment}`)
      }

      try {
        done()
        await job.remove()
      } catch (err) {
        console.error(err)
      }
    } catch (err) {
      sentryCaptureException(err)
      job.fail(err)
      job.save()
      done()
      return
    }
  }
  done()
}

export default {
  jobName,
  callback,
  options: { timezone: 'Europe/Berlin' },
  type: 'normal'
}
