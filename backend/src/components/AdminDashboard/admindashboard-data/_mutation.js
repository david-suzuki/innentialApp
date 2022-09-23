import { isAdmin } from '~/directives'
import { ActivityChartStats } from '~/models'
import { callback } from '../../../config/jobs/_countActivityChart'
import { checkArrayLength } from './utils/_checkArrayLength'

export const mutationTypes = `
  type Mutation {
    testMutation: Activity @${isAdmin}
  }
`

export const mutationResolvers = {
  Mutation: {
    testMutation: async (_, __, { user: { organizationId } }) => {
      await callback()

      // const learningActivity = await ActivityChartStats.findOne({
      //   organizationId
      // })

      // const snapshots = learningActivity.snapshots.filter(
      //   ({ calculatedAt }) => calculatedAt >= timeSpanQuery
      // )

      // // if (snapshots.length < 7) {
      // //   return { learningStarted: [], learningCompleted: [], xAxis: [] }
      // // }
      // const learningStartedArr = snapshots.map(
      //   ({ count }) => count.startedCount
      // )
      // const learningStarted = checkArrayLength(learningStartedArr, timeSpan)

      // const learningCompletedArr = snapshots.map(
      //   ({ count }) => count.completedCount
      // )
      // const learningCompleted = checkArrayLength(learningCompletedArr, timeSpan)

      // xAxis = checkArrayLength(
      //   snapshots.map(({ calculatedAt }) => {
      //     return calculatedAt.toDateString()
      //   }),
      //   timeSpan
      // )

      return null
    }
  }
}
