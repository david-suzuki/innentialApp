import { User, UserContentInteractions } from '~/models'
import {
  sendEmail,
  appUrls,
  sentryCaptureException,
  recommendedContentNotification
} from '~/utils'
import {
  getRecommendedContentForNotification
  // mapContentToRecommendationEmail
} from './utils'

const jobName = 'sendRecommendedContentEmail'

const appLink = `${appUrls['user']}`

const callback = async (job, done) => {
  const now = new Date()
  const today = now.getDay()
  const [sunday, saturday] = [0, 6]
  if (today !== sunday && today !== saturday) {
    const users = await User.find({
      status: 'active'
      // createdAt: { $gt: new Date(2020, 1, 1).getTime() }
    })
      .select({ _id: 1, email: 1, firstName: 1 })
      .lean()

    // const users = await User.find({ email: { $in: [
    //   'wojciech+1@waat.eu',
    //   'wojciech+2@waat.eu'
    // ]} })

    await Promise.all(
      users.map(async user => {
        try {
          const { _id, email, firstName } = user

          const contentProfile = await UserContentInteractions.findOne({
            user: _id
          })
            .select({ _id: 1, recommended: 1, isReceivingContentEmails: 1 })
            .lean()

          if (!contentProfile || !contentProfile.isReceivingContentEmails) {
            return null
          }

          const content = await getRecommendedContentForNotification(_id)

          if (content !== null) {
            const aggregatedContent = content.reduce((acc, curr) => {
              if (acc[curr.sharedBy.name]) {
                return {
                  ...acc,
                  [curr.sharedBy.name]: [...acc[curr.sharedBy.name], curr]
                }
              } else {
                return {
                  ...acc,
                  [curr.sharedBy.name]: [curr]
                }
              }
            }, {})

            Object.entries(aggregatedContent).forEach(([key, value]) => {
              appLink &&
                sendEmail(
                  email,
                  `You have new recommendations${key ? ` from ${key}` : ''}`,
                  recommendedContentNotification({
                    content: value,
                    recommendedBy: key,
                    name: firstName,
                    appLink
                  })
                )
                  .then()
                  .catch(e => {
                    sentryCaptureException(e)
                  })
            })

            const contentProfile = await UserContentInteractions.findOne({
              user: _id
            })
              .select({ _id: 1, recommended: 1 })
              .lean()
            if (contentProfile) {
              const { recommended } = contentProfile
              const newRecommended = recommended.map(
                ({ contentId, ...rest }) => {
                  if (
                    content.some(({ _id }) => String(_id) === String(contentId))
                  )
                    return {
                      contentId,
                      includedInEmail: true,
                      ...rest
                    }
                  else
                    return {
                      contentId,
                      ...rest
                    }
                }
              )

              await UserContentInteractions.findByIdAndUpdate(
                contentProfile._id,
                {
                  $set: {
                    recommended: newRecommended
                  }
                }
              )
            }
          }
        } catch (e) {
          sentryCaptureException(e)
          job.fail(e)
          job.save()
        }
      })
    )
  }
  done()
}

export default {
  jobName,
  callback,
  interval: '1 hour',
  options: { timezone: 'Europe/Berlin' },
  type: 'single'
}
