import { Team, User, Goal, UserContentInteractions } from '~/models'
import {
  sentryCaptureException,
  sendEmail,
  leaderApproveGoalsNotification,
  appUrls,
  getDownloadLink
} from '~/utils'

const appLink = `${appUrls['user']}`

const jobName = 'singleLeaderReadyGoalsReminder'

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
      .select({ _id: 1, firstName: 1, email: 1 })
      .lean()

    if (userData) {
      const { _id, firstName: name, email } = userData

      const contentProfile = await UserContentInteractions.findOne({
        user: _id
      })
        .select({ _id: 1, isReceivingContentEmails: 1 })
        .lean()

      if (!contentProfile || !contentProfile.isReceivingContentEmails) {
        return null
      }

      try {
        const teams = await Team.find({ active: true, leader: user })
          .select({ _id: 1, teamName: 1, members: 1 })
          .lean()

        await Promise.all(
          teams.map(async team => {
            const { members: memberIds, teamName } = team

            const readyGoals = await Goal.find({
              user: { $in: memberIds },
              status: 'READY FOR REVIEW'
            }).lean()

            if (readyGoals.length > 0) {
              const usersAndGoals = []
              await Promise.all(
                memberIds.map(async memberId => {
                  const user = await User.findOne({
                    _id: memberId,
                    status: 'active'
                  }).select({ _id: 1, firstName: 1, lastName: 1 })
                  const goals = await Goal.find({
                    user: memberId,
                    status: 'READY FOR REVIEW'
                  })
                    .select({ _id: 1, goalName: 1 })
                    .lean()

                  if (user && goals.length > 0) {
                    usersAndGoals.push({
                      _id: user._id,
                      name: `${user.firstName} ${user.lastName}`,
                      imgLink: await getDownloadLink({
                        key: 'users/profileImgs',
                        expires: 500 * 60,
                        _id: user._id
                      }),
                      roleAtWork: await user.getRoleAtWork(),
                      goals: goals.map(({ goalName }) => goalName)
                    })
                  }
                })
              )

              usersAndGoals.length > 0 &&
                (await sendEmail(
                  email,
                  `Action required: your teammates at ${
                    teamName.toLowerCase().includes('team')
                      ? teamName
                      : `team ${teamName}`
                  } have goals pending`,
                  leaderApproveGoalsNotification({
                    name,
                    usersAndGoals,
                    // usersAndGoalsInReview,
                    appLink
                  })
                ))
            }
          })
        )
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
