import { User, Comment, UserContentInteractions } from '~/models'
import {
  sentryCaptureException,
  sendEmail,
  commentLikedNotification,
  appUrls,
  getDownloadLink
} from '~/utils'
import { analytics } from '..'

const appLink = `${appUrls['user']}`

const jobName = 'singleUserCommentLikedNotification'

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
      const commentData = await Comment.findById(comment)
        .select({ _id: 1, user: 1, content: 1, replyTo: 1, pathId: 1 })
        .lean()

      if (commentData) {
        const likingUser = await User.findById(user)
          .select({ _id: 1, firstName: 1, lastName: 1 })
          .lean()

        const commentAuthor = await User.findById(commentData.user).lean()

        if (!commentAuthor) throw new Error(`Author of comment not found`)

        if (String(commentAuthor._id) === String(likingUser._id)) {
          // USER LIKED HIS OWN COMMENT, ABORTING
          try {
            done()
            await job.remove()
            return null
          } catch (err) {
            console.error(err)
          }
        }

        const isReceivingEmails = await UserContentInteractions.findOne({
          user: commentData.user,
          isReceivingContentEmails: true
        })
          .select({ _id: 1 })
          .lean()

        if (!isReceivingEmails) {
          try {
            done()
            await job.remove()
            return null
          } catch (err) {
            console.error(err)
          }
        }

        const { _id, firstName: name, email, organizationId } = commentAuthor

        const isReply = !!commentData.replyTo

        const statusCode = await sendEmail(
          email,
          `${(likingUser && likingUser.firstName) || 'Someone'} liked your ${
            isReply ? 'reply' : 'question'
          }`,
          commentLikedNotification({
            pathId: commentData.pathId,
            isReply,
            commentId: commentData._id,
            content: commentData.content,
            user: {
              _id: likingUser._id,
              name: `${likingUser.firstName} ${likingUser.lastName}`,
              imgLink: await getDownloadLink({
                key: 'users/profileImgs',
                expires: 500 * 60,
                _id: likingUser._id
              })
            },
            appLink,
            name
          })
        )
        await analytics.trackSafe({
          userId: String(_id),
          event: 'comment_liked_email',
          properties: {
            commentId: String(comment)
          }
        })
        console.log(`Email sent with status code ${statusCode}`)
      } else throw new Error(`No user/reply data found for ID:${comment}`)
    } catch (err) {
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
