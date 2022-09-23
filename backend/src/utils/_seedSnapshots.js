import { ActivityChartStats } from '~/models'
import db from '../config/_db'

const mockStats = () => {
  let statsArray = []

  for (let i = 18; i > 0; i--) {
    const today = new Date()
    const finalDate = new Date(today)
    const currentDate = today.getDate()
    finalDate.setDate(currentDate - i)

    const snapshot = {
      calculatedAt: finalDate.toISOString(),
      count: {
        startedCount: Math.floor(Math.random() * 10 + 1),
        completedCount: Math.floor(Math.random() * 10 + 1)
      }
    }
    statsArray.push(snapshot)
  }

  return statsArray
}

export default async () => {
  // NOTE: If the reason for dropping the collection is to not duplicate documents,
  // you can just run a find() / findOne() query to check if the docs exist
  await db.dropCollection('activitychartstats')

  return ActivityChartStats.create({
    // INNENTIAL FOR REAL
    organizationId: '5d4d42e85886d00027983114',
    snapshots: mockStats()
  })
}
