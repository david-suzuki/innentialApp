import { Goal } from '~/models'
;(async () => {
  let updatedCounter = 0
  const goals = await Goal.find({ status: 'ACTIVE' })
    .select({ _id: 1, isPrivate: 1, reviewId: 1 })
    .lean()

  await Promise.all(
    goals.map(async goal => {
      if (goal.isPrivate === undefined) {
        await Goal.findOneAndUpdate(
          { _id: goal._id },
          { $set: { isPrivate: !goal.reviewId } }
        )
        updatedCounter++
      }
    })
  )

  if (updatedCounter)
    console.log(`Added "isPrivate" field to ${updatedCounter} goals`)
})()
