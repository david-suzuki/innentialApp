import Analytics from 'analytics-node'
import { ENVIRONMENT } from '../environment'
import { sentryCaptureException } from '../utils'
import { User } from '../models'

const production = process.env.SERVER === ENVIRONMENT.PRODUCTION

const analytics = production
  ? new Analytics('74wTgiQ4QN1xSFkMnZWdMCf81FBlVhId')
  : {}

analytics.trackSafe = async ({ userId, event, properties }) => {
  try {
    // EXCLUDE INNENTIAL USERS
    const user = await User.findById(userId)
      .select({ email: 1 })
      .lean()

    if (!user || user.email.split('@')[1] === 'innential.com') return

    if (production) {
      analytics.track({
        userId,
        event,
        properties
      })
    } else console.log({ userId, event, properties })
  } catch (e) {
    sentryCaptureException(
      `Failed to track event: ${event} for user: ${userId}`
    )
  }
}

export default analytics
