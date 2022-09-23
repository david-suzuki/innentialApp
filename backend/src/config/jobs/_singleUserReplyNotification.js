import { User, Comment, UserContentInteractions } from '~/models'
import {
  sentryCaptureException,
  sendEmail,
  questionReplyNotification,
  appUrls,
  getDownloadLink
} from '~/utils'
import { analytics } from '../'

const appLink = `${appUrls['user']}`

const jobName = 'singleUserReplyNotification'

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
      data: { user, reply }
    } = job.attrs

    const contentProfile = await UserContentInteractions.findOne({
      user
    })
      .select({ _id: 1, isReceivingContentEmails: 1 })
      .lean()

    if (!contentProfile || !contentProfile.isReceivingContentEmails) {
      try {
        done()
        await job.remove()
        return null
      } catch (err) {
        console.error(err)
      }
    }

    const userData = await User.findById(user)
      .select({ _id: 1, firstName: 1, email: 1, organizationId: 1 })
      .lean()

    const replyData = await Comment.findById(reply)
      .select({ _id: 1, user: 1, content: 1 })
      .lean()

    if (userData && replyData) {
      const replyingUser = await User.findById(replyData.user).lean()

      const { _id, firstName: name, email, organizationId } = userData

      try {
        const statusCode = await sendEmail(
          email,
          `${(replyingUser && replyingUser.firstName) ||
            'Someone'} answered your question`,
          questionReplyNotification({
            content: replyData.content,
            replyId: replyData._id,
            user: {
              _id: replyingUser._id,
              name: `${replyingUser.firstName} ${replyingUser.lastName}`,
              imgLink: await getDownloadLink({
                key: 'users/profileImgs',
                expires: 500 * 60,
                _id: replyingUser._id
              })
            },
            appLink,
            name
          })
        )
        await analytics.trackSafe({
          userId: String(_id),
          event: 'question_reply_email',
          properties: {
            replyId: String(reply)
          }
        })
        console.log(`Email sent with status code ${statusCode}`)
      } catch (err) {
        sentryCaptureException(err)
        job.fail(err)
        job.save()
        done()
        return
      }
    } else {
      const err = new Error(`No user/reply data found for ID:${reply}`)
      sentryCaptureException(err)
      job.fail(err)
      job.save()
      done()
      return
    }

    try {
      done()
      await job.remove()
    } catch (err) {
      console.error(err)
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
