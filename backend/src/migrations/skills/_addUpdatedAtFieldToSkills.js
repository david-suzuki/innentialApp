import { Skills } from '~/models'
;(async () => {
  let updatedCounter = 0
  const skills = await Skills.find().lean()

  await Promise.all(
    skills.map(async skill => {
      if (!skill.updatedAt) {
        await Skills.findOneAndUpdate(
          { _id: skill._id },
          { $set: { updatedAt: skill.createdAt } }
        )
        updatedCounter++
      }
    })
  )

  if (updatedCounter) console.log(`Updated ${updatedCounter} skills`)
})()
