import { User } from '~/models'
import {
  sendEmail,
  appUrls,
  sentryCaptureException,
  onboardingReminderTemplate
} from '~/utils'

const jobName = 'sendOnboardingReminder'

const appLink = `${appUrls['user']}`

const callback = async (job, done) => {
  try {
    const today = new Date().getDay()
    const [sunday, saturday] = [0, 6]
    const twoDays = 172800000
    if (today !== sunday && today !== saturday) {
      // console.log(Date.now() > firstOfFeb.getTime())
      const invitedUsers = await User.find({
        status: 'invited',
        // createdAt: { $gt: new Date(2020, 1, 1).getTime() },
        'invitation.reminded': { $ne: true },
        'invitation.invitedOn': { $lt: Date.now() - twoDays }
      })
        .select({ _id: 1, email: 1, invitation: 1 })
        .lean()

      await Promise.all(
        invitedUsers.map(async user => {
          const {
            _id,
            email,
            invitation: { pendingInvitation }
          } = user
          try {
            appLink &&
              (await sendEmail(
                email,
                'Reminder to onboard',
                onboardingReminderTemplate({
                  pendingInvitation,
                  appLink
                })
              ))
          } catch (e) {
            sentryCaptureException(`Failed to send email: ${e}`)
            return null
          }
          await User.findOneAndUpdate(
            { _id },
            {
              $set: {
                'invitation.reminded': true
              }
            }
          )
        })
      )
    }
  } catch (err) {
    sentryCaptureException(err)
    job.fail(err)
    job.save()
  }
  done()
}

export default {
  jobName,
  callback,
  // interval: '10 minutes',
  interval: '6 hours',
  options: { timezone: 'Europe/Berlin' },
  type: 'single'
}
