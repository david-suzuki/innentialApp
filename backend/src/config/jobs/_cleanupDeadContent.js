import { LearningContent } from '~/models'
import { sentryCaptureException } from '~/utils'
import { cleanupScript } from './utils'
import AsyncLock from 'async-lock'

const lock = new AsyncLock()

const jobName = 'cleanupDeadContent'

const callback = async (job, done) => {
  try {
    const now = new Date()
    if (now.getHours() !== 19 || now.getMinutes() !== 0) {
      done()
      job.schedule('today at 7:00 pm')
      job.save()
    } else {
      if (lock.isBusy()) {
        console.log(`Lengthy job already running`)
        job.schedule('tomorrow at 7:00 pm')
      } else {
        LearningContent.find({
          toCleanup: true
        })
          .sort({ createdAt: 1 })
          // .limit(1100)
          .lean()
          .exec(async (err, docs) => {
            if (err) {
              console.error(err)
            } else {
              // const docIds = docs.map(({ _id }) => _id)
              // await LearningContent.updateMany(
              //   { _id: { $in: docIds } },
              //   {
              //     toCleanup: false,
              //     lastCleanedAt: new Date()
              //   }
              // )
              cleanupScript(docs, lock)
            }
          })
      }
    }
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
  interval: '1 day',
  options: { timezone: 'Europe/Berlin' },
  type: 'single'
}
