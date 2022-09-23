import {
  User,
  UserContentInteractions,
  UserProfile,
  Skills,
  DevelopmentPlan,
  Goal
} from '../../models'
import {
  sendEmail,
  appUrls,
  sentryCaptureException,
  weeklyContentNotification
} from '~/utils'
import {
  getContentForWeeklyEmail /*, mapContentToTemplate */
} from '../jobs/utils'
const appLink = `${appUrls['user']}`

const jobName = 'fetchNewLearningContent'

const callback = async (job, done) => {
  const now = new Date()
  if (now.getHours() !== 7 || now.getDay() !== 1 || now.getMinutes() !== 0) {
    job.schedule('monday at 7:00 am')
    job.save()
    done()
  } else {
    try {
      // const users = await User.find({
      //   email: [
      //     'sadun@waat.eu',
      //     'wojciech@waat.eu',
      //     'kris@innential.com',
      //     'adam@innential.com',
      //     'tomek.pazio@waat.eu'
      //   ]
      // })

      // const contentProfiles = await Promise.all(
      //   users.map(async ({ _id }) => {
      //     const contentProfile = await UserContentInteractions.findOne({
      //       user: _id
      //     })
      //     return contentProfile
      //   })
      // )

      const contentProfiles = await UserContentInteractions.find({
        isReceivingContentEmails: true
      }).lean()
      // if (contentProfiles.length === 0) {
      //   done()
      //   return null
      // }
      await Promise.all(
        contentProfiles.map(async profile => {
          const { isReceivingContentEmails } = profile

          if (!isReceivingContentEmails) {
            return null
          }

          const devPlan = await DevelopmentPlan.findOne({ user: profile.user })
            .select({ selectedGoalId: 1 })
            .lean()

          if (!devPlan) {
            sentryCaptureException(
              `Development plan for user: ${profile.user} cannot be found`
            )
            return null
          }

          const activeGoal = await Goal.findOne({
            _id: devPlan.selectedGoalId,
            status: 'ACTIVE'
          })
            .select({ relatedSkills: 1 })
            .lean()

          let skillIds = []

          if (!activeGoal) {
            const userProfile = await UserProfile.findOne({
              user: profile.user
            }).lean()

            if (!userProfile) {
              return null
            }

            skillIds = userProfile.neededWorkSkills.map(skill => skill._id)
          } else {
            skillIds = activeGoal.relatedSkills
          }

          if (skillIds.length === 0) return null

          const user = await User.findOne({ _id: profile.user }).lean()
          if (!user) {
            sentryCaptureException(`User: ${profile.user} cannot be found`)
            return null
          }

          const { organizationId } = user

          const normalisedSkills = await Skills.find({ _id: { $in: skillIds } })
            .select({ name: 1 })
            .lean()

          const contentToSend = await getContentForWeeklyEmail(
            skillIds,
            organizationId
          )

          if (contentToSend !== null) {
            const { topPaidContent, topWeeklyContent } = contentToSend
            // await Promise.all(
            //   neededWorkSkills.map(async skill => {
            //     const normalisedSkill = await Skills.findById(skill._id)
            //     if (normalisedSkill) {
            //       return normalisedSkill.name
            //     } else {
            //       sentryCaptureException(`Skill with id:${skill._id} not found`)
            //       return null
            //     }
            //   })
            // )

            const usersSkills = normalisedSkills.map(({ name }) => name)
            // .reduce((acc, curr) => {
            //   if (curr !== null) {
            //     return [...acc, curr]
            //   } else return acc
            // }, [])

            const { email } = user
            appLink &&
              (await sendEmail(
                email,
                'New learning available at Innential',
                weeklyContentNotification({
                  usersSkills,
                  topWeeklyContent,
                  topPaidContent,
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
  interval: '1 week',
  options: { timezone: 'Europe/Berlin' },
  type: 'single'
}
