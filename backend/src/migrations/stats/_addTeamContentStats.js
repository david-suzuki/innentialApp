import { TeamContentStats, Team } from '~/models'
import { calculateContentStats } from '~/utils'
;(async () => {
  let listCount = 0
  const teams = await Team.find({ active: true }).lean()

  await Promise.all(
    teams.map(async team => {
      const { _id: teamId } = team

      const contentStatList = await TeamContentStats.findOne({ teamId })
      if (!contentStatList) {
        const snapshot = await calculateContentStats(teamId)
        listCount++
        await TeamContentStats.create({
          teamId,
          total: {
            ...snapshot
          }
        })
      }
    })
  )

  listCount && console.log(`${listCount} team content stat lists created`)
})()
