import { Team, TeamContentStats } from '~/models'
import { sentryCaptureException, calculateContentStats } from '~/utils'

const jobName = 'countContentStats'

const callback = async (job, done) => {
  try {
    const teams = await Team.find({ active: true }).lean()

    await Promise.all(
      teams.map(async team => {
        const snapshot = await calculateContentStats(team._id)
        const { liked, opened, shared, added } = snapshot
        await TeamContentStats.findOneAndUpdate(
          { teamId: team._id },
          {
            $push: {
              snapshots: {
                ...snapshot,
                calculatedAt: new Date()
              }
            },
            $inc: {
              'total.liked': liked,
              'total.opened': opened,
              'total.shared': shared,
              'total.added': added
            },
            $set: {
              'total.lastUpdated': new Date()
            }
          }
        )
      })
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
  interval: '1 week',
  options: { timezone: 'Europe/Berlin', skipImmediate: true },
  type: 'single'
}
