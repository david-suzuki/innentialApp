import {
  LearningRequest,
  User,
  Team,
  UserContentInteractions,
  UserProfile,
  LearningContent
} from '~/models'
import {
  sentryCaptureException,
  sendEmail,
  adminApprovalsReminder,
  appUrls,
  getDownloadLink
} from '~/utils'

const appLink = `${appUrls['user']}`

const jobName = 'singleLeaderRequestsReminder'

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

      const contentProfile = await UserContentInteractions.findOne({
        user: _id
      })
        .select({ _id: 1, isReceivingContentEmails: 1 })
        .lean()

      if (!contentProfile || !contentProfile.isReceivingContentEmails) {
        console.log(`User:${user} is not active, aborting`)

        try {
          done()
          await job.remove()
        } catch (err) {
          sentryCaptureException(`Could not remove job: ${err}`)
        }
        return
      }

      try {
        const teams = await Team.find({ leader: _id }).lean()
        const members = teams
          .map(({ members }) => [...members])
          .reduce((acc, curr) => [...acc, ...curr], [])

        const pendingRequests = await LearningRequest.find({
          user: { $in: members },
          approved: null
        }).lean()

        if (pendingRequests.length === 0) {
          console.log(`No requests found`)

          try {
            done()
            await job.remove()
          } catch (err) {
            sentryCaptureException(`Could not remove job: ${err}`)
          }
          return
        }

        const users = (
          await Promise.all(
            pendingRequests
              .reduce((acc, curr) => {
                const arr = acc

                const findUser = ({ userId }) =>
                  String(userId) === String(curr.user)

                if (!arr.some(findUser)) {
                  arr.push({
                    userId: curr.user,
                    contentIds: [curr.contentId]
                  })
                } else {
                  const ix = arr.findIndex(findUser)
                  const { contentIds } = arr[ix]
                  arr.splice(ix, 1, {
                    userId: curr.user,
                    contentIds: [...contentIds, curr.contentId]
                  })
                }

                return [...arr]
              }, [])
              .map(async ({ userId, contentIds }) => {
                const user = await User.findOne({
                  _id: userId,
                  status: 'active'
                })
                  .select({ _id: 1, firstName: 1, lastName: 1 })
                  .lean()
                const profile = await UserProfile.findOne({ user: userId })
                  .select({ roleAtWork: 1 })
                  .lean()

                const content = await LearningContent.find({
                  _id: { $in: contentIds }
                })
                  .select({ price: 1 })
                  .lean()

                if (!user || !profile || content.length === 0) {
                  console.log(
                    `User:${user} is not active, not including in email`
                  )
                  return null
                }

                return {
                  _id: user._id,
                  name: `${user.firstName} ${user.lastName}`,
                  imgLink: await getDownloadLink({
                    key: 'users/profileImgs',
                    expires: 500 * 60,
                    _id: user._id
                  }),
                  roleAtWork: profile.roleAtWork,
                  total: content.reduce(
                    (acc, { price: { value } }) => acc + value,
                    0
                  ),
                  nItems: content.length
                }
              })
          )
        ).filter(userItem => !!userItem) // filter nulls

        // const teams = await Team.find({ active: true, leader: user })
        //   .select({ _id: 1, teamName: 1, members: 1 })
        //   .lean()

        if (users.length > 0) {
          const statusCode = await sendEmail(
            email,
            `Action required: there are requests awaiting approval`,
            adminApprovalsReminder({
              name,
              users,
              // usersAndGoalsInReview,
              appLink
            })
          )
          console.log(`Email sent with ${statusCode} status`)
        } else {
          console.log(`No users to send in email for user: ${user}`)
        }
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
      sentryCaptureException(`Could not remove job: ${err}`)
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
