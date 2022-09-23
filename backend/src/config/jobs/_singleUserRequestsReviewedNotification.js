import {
  LearningRequest,
  User,
  UserContentInteractions,
  ContentSources,
  Organization,
  LearningContent
} from '~/models'
import {
  sentryCaptureException,
  sendEmail,
  userLearningApprovalNotification,
  appUrls,
  getDownloadLink
} from '~/utils'

const appLink = `${appUrls['user']}`

const jobName = 'singleUserRequestsReviewedNotification'

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
      data: { user }
    } = job.attrs

    const userData = await User.findById(user)
      .select({ _id: 1, firstName: 1, email: 1, organizationId: 1 })
      .lean()

    if (userData) {
      const { _id, firstName: name, email, organizationId } = userData

      const organization = await Organization.findById(organizationId)
        .select({ fulfillment: 1 })
        .lean()

      const contentProfile = await UserContentInteractions.findOne({
        user: _id
      })
        .select({ _id: 1, isReceivingContentEmails: 1 })
        .lean()

      if (!contentProfile || !contentProfile.isReceivingContentEmails) {
        return null
      }

      try {
        const reviewedRequests = await LearningRequest.find({
          user,
          approved: { $ne: null },
          sent: { $ne: true }
        }).lean()

        if (reviewedRequests.length === 0) return

        const content = (
          await Promise.all(
            reviewedRequests.map(async request => {
              const item = await LearningContent.findById(
                request.contentId
              ).lean()
              if (!item) return null
              const {
                _id,
                title,
                url: link,
                source,
                type,
                relatedPrimarySkills,
                price
                // sharedBy
              } = item
              // let highestSkillLevel = 0
              const skills = relatedPrimarySkills.map(({ name }) => name)
              const paid = price.value > 0

              const reviewer = await User.findById(request.reviewedBy)
                .select({ firstName: 1, lastName: 1 })
                .lean()
              const normalisedSource = await ContentSources.findById(source)
                .select({ name: 1 })
                .lean()

              let sourceName = ''
              let name = ''

              if (!normalisedSource) {
                sentryCaptureException(
                  `Source for source ID: ${source} not found`
                )
                return null
              } else {
                sourceName = normalisedSource.name
              }

              if (!reviewer) {
                sentryCaptureException(
                  `User with id:${request.reviewedBy} not found`
                )
                return null
              } else {
                name = `${reviewer.firstName}${
                  reviewer.lastName ? ' ' + reviewer.lastName : ''
                }`
              }

              await LearningRequest.findOneAndUpdate(
                { _id: request._id },
                {
                  $set: {
                    sent: true
                  }
                }
              )

              return {
                _id,
                title,
                type,
                source: sourceName,
                link,
                skills,
                sharedBy: {
                  _id: request.reviewedBy,
                  name,
                  imgLink: await getDownloadLink({
                    key: 'users/profileImgs',
                    expires: 500 * 60,
                    _id: request.reviewedBy
                  })
                },
                note: request.note,
                request: true,
                approved: request.approved,
                paid
              }
            })
          )
        ).filter(item => !!item)

        content.length > 0 &&
          (await sendEmail(
            email,
            `Your requests have been reviewed`,
            userLearningApprovalNotification({
              name,
              content,
              delivery: !!(organization && organization.fulfillment),
              // usersAndGoalsInReview,
              appLink
            })
          ))
      } catch (err) {
        sentryCaptureException(err)
        job.fail(err)
        job.save()
        done()
        return
      }
    } else {
      job.fail(new Error(`No user data found for ID:${user}`))
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
