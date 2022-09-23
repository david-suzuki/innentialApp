import { Organization, ActivityChartStats, DevelopmentPlan } from '~/models'
import { sentryCaptureException } from '~/utils'

const jobName = 'TEST_countActivityStats'

const calculateActivity = async organizationId => {
  // NOTE: as we said before, you can filter out only the data you need in this query
  // this is not required, but it will make it more optimised for the future
  const devPlans = await DevelopmentPlan.find({
    organizationId,
    'content.status': { $in: ['IN PROGRESS', 'COMPLETED'] }
  })
    .select({ content: 1 })
    .lean()

  const content = devPlans
    .map(({ content }) => content)
    .filter(content => content.length > 0)
    .reduce((acc, curr) => [...acc, ...curr], [])
    .reduce((acc, curr) => {
      return {
        ...acc,
        [curr.status]: (acc[curr.status] || 0) + 1
      }
    }, {})

  const startedCount = content['IN PROGRESS'] || 0
  const completedCount = content['COMPLETED'] || 0

  return { startedCount, completedCount }
}

export const callback = async job => {
  try {
    const organizations = await Organization.find()
      .select({ _id: 1 })
      .lean()

    await Promise.all(
      organizations.map(async ({ _id }) => {
        const { startedCount, completedCount } = await calculateActivity(_id)

        const foundActivityRecord = await ActivityChartStats.findOne({
          organizationId: _id
        })
        const snapshots = {
          count: {
            startedCount,
            completedCount
          },
          calculatedAt: new Date()
        }

        if (foundActivityRecord) {
          if (foundActivityRecord.snapshots.length > 0) {
            const snapshotExist = element =>
              snapshots.calculatedAt.getFullYear() ===
                element.calculatedAt.getFullYear() &&
              snapshots.calculatedAt.getMonth() ===
                element.calculatedAt.getMonth() &&
              snapshots.calculatedAt.getDate() ===
                element.calculatedAt.getDate()

            if (foundActivityRecord.snapshots.some(snapshotExist)) return null
          }

          await ActivityChartStats.findOneAndUpdate(
            { organizationId: _id },
            {
              $push: { snapshots },
              $set: {
                'total.lastUpdated': snapshots.calculatedAt
              }
            }
          )
        } else {
          await ActivityChartStats.create({
            organizationId: _id,
            snapshots
          })
        }
      })
    )
  } catch (e) {
    sentryCaptureException(e)
    job.fail(e)
    await job.save()
  }
  //   finally {
  //     done()
  //   }
}

export default {
  jobName,
  callback,
  interval: '1 day',
  options: { timezone: 'Europe/Berlin', skipImmediate: true },
  type: 'single'
}
