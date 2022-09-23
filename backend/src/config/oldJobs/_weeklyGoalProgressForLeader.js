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
  leaderTeamProgressNotification,
  getDownloadLink
} from '~/utils'

const jobName = 'weeklyGoalProgressForLeader'

const appLink = `${appUrls['user']}`

const getDueDate = async goal => {
  if (goal.deadline) return goal.deadline
  if (goal.reviewedAt) return goal.reviewedAt
  const review = await Review.findById(goal.reviewId)
    .select({ startsAt: 1, closedAt: 1 })
    .lean()
  if (review) {
    if (review.closedAt) {
      return review.closedAt
    } else return review.startsAt
  }
  return null
}

const callback = async (job, done) => {
  const now = new Date()
  if (now.getHours() !== 8 || now.getDay() !== 1 || now.getMinutes() !== 0) {
    job.schedule('monday at 8:00 am')
    job.save()
    done()
  } else {
    try {
      const users = await User.find({
        status: 'active'
        // createdAt: { $gt: new Date(2020, 1, 1).getTime() }
      })
        .select({ _id: 1, email: 1 })
        .lean()
      await Promise.all(
        users.map(async user => {
          const userTeams = await Team.find({ leader: user._id, active: true })
            .select({ _id: 1, teamName: 1, members: 1 })
            .lean()

          if (userTeams.length === 0) return

          const teams = []
          await Promise.all(
            userTeams.map(async ({ _id, teamName, members }) => {
              // GET DEV PLANS OF THE WHOLE TEAM
              const devPlans = await DevelopmentPlan.find({
                user: { $in: members },
                selectedGoalId: { $ne: null }
              })
                .select({ _id: 1, content: 1, user: 1, selectedGoalId: 1 })
                .lean()

              if (devPlans.length === 0) return

              // FIND THE ACTIVE GOAL, DO PRIVATE CHECK, GET USER INFORMATION
              const users = []
              await Promise.all(
                devPlans.map(
                  async ({ _id, content, user: userId, selectedGoalId }) => {
                    const activeGoal = await Goal.findOne({
                      _id: selectedGoalId,
                      reviewId: { $ne: null }
                    })
                      .select({
                        _id: 1,
                        goalName: 1,
                        reviewedAt: 1,
                        reviewId: 1
                      })
                      .lean()
                    if (!activeGoal) return

                    const member = await User.findById(userId).select({
                      _id: 1,
                      firstName: 1,
                      lastName: 1
                    })
                    if (!member) {
                      sentryCaptureException(
                        new Error(`User: ${userId} not found`)
                      )
                      return
                    }

                    const activeContent = content.filter(
                      ({ goalId }) => String(goalId) === String(selectedGoalId)
                    )
                    const NCompleted = activeContent.reduce((acc, curr) => {
                      if (curr.status === 'COMPLETED') return acc + 1
                      else return acc
                    }, 0)

                    users.push({
                      _id: userId,
                      name: `${member.firstName} ${member.lastName}`,
                      imgLink: await getDownloadLink({
                        key: 'users/profileImgs',
                        expires: 500 * 60,
                        _id: userId
                      }),
                      roleAtWork: await member.getRoleAtWork(),
                      goals: await Goal.find({
                        user: userId,
                        status: 'ACTIVE',
                        reviewId: { $ne: null }
                      })
                        .select({ _id: 1 })
                        .lean(),
                      activeGoal: {
                        _id: activeGoal._id,
                        goalName: activeGoal.goalName,
                        NCompleted,
                        NAll: activeContent.length,
                        dueDate: await getDueDate(activeGoal)
                      }
                    })
                  }
                )
              )

              if (users.length === 0) return

              teams.push({
                _id,
                teamName,
                users
              })
            })
          )

          if (teams.length > 0) {
            const { _id, email } = user

            const contentProfile = await UserContentInteractions.findOne({
              user: _id
            })
              .select({ _id: 1, isReceivingContentEmails: 1 })
              .lean()

            if (!contentProfile || !contentProfile.isReceivingContentEmails) {
              return null
            }

            appLink &&
              (await sendEmail(
                email,
                'Team progress weekly check-in',
                leaderTeamProgressNotification({
                  teams,
                  appLink
                })
              ))
          }
        })
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
