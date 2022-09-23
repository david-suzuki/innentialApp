import {
  Team,
  User,
  Goal,
  UserContentInteractions /*, Review */
} from '~/models'
import {
  sentryCaptureException,
  sendEmail,
  leaderApproveGoalsNotification,
  appUrls,
  getDownloadLink
} from '~/utils'

const appLink = `${appUrls['user']}`

const jobName = 'leaderReadyGoalsReminder'

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

  try {
    const teams = await Team.find({ active: true })
      .select({ _id: 1, teamName: 1, leader: 1, members: 1 })
      .lean()

    await Promise.all(
      teams.map(
        async ({
          _id: teamId,
          teamName,
          leader: leaderId,
          members: memberIds
        }) => {
          const readyGoals = await Goal.find({
            user: { $in: memberIds },
            status: 'READY FOR REVIEW'
            // createdAt: { $gt: new Date(2020, 1, 1).getTime() }
          }).lean()
          if (readyGoals.length > 0) {
            const leader = await User.findOne({
              _id: leaderId,
              status: 'active'
            })
              .select({ _id: 1, firstName: 1, email: 1 })
              .lean()
            if (leader) {
              const { _id, firstName: name, email } = leader

              const contentProfile = await UserContentInteractions.findOne({
                user: _id
              })
                .select({ _id: 1, isReceivingContentEmails: 1 })
                .lean()

              if (!contentProfile || !contentProfile.isReceivingContentEmails) {
                return null
              }

              const usersAndGoals = []
              // const usersAndGoalsInReview = []
              await Promise.all(
                memberIds.map(async memberId => {
                  const user = await User.findOne({
                    _id: memberId,
                    status: 'active'
                  }).select({ _id: 1, firstName: 1, lastName: 1, email: 1 })
                  const goals = await Goal.find({
                    user: memberId,
                    status: 'READY FOR REVIEW'
                  })
                    .select({ _id: 1, goalName: 1 })
                    .lean()
                  // const inReview = await Review.findOne({
                  //   status: 'UPCOMING',
                  //   'reviewScope.reviewers': leaderId,
                  //   $or: [
                  //     { 'reviewScope.userId': memberId },
                  //     { 'reviewScope.teamId': teamId }
                  //   ]
                  // })
                  //   .select({ _id: 1 })
                  //   .lean()

                  if (user && goals.length > 0) {
                    // if (inReview) {
                    //   usersAndGoalsInReview.push({
                    //     _id: user._id,
                    //     name: `${user.firstName} ${user.lastName}`,
                    //     imgLink: await getDownloadLink({ key: 'users/profileImgs', expires: 500*60,  _id: user._id }),
                    //     roleAtWork: await user.getRoleAtWork(),
                    //     goals: goals.map(({ goalName }) => goalName)
                    //   })
                    // } else {
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
                    // }
                  }
                })
              )

              await sendEmail(
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
              )
            } else {
              throw new Error(`Leader not found:${leaderId}`)
            }
          }
        }
      )
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
  // interval: '3 hours', // TEST
  interval: '3 days',
  options: { timezone: 'Europe/Berlin' },
  type: 'single'
}
