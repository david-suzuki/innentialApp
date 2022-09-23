import { Skills, Categories } from '~/models'

const changeCategoryFieldToID = async () => {
  const categories = await Categories.find().lean()

  if (categories.length === 0) {
    console.log(`Timing error`)
    return null
  }

  let updatedCounter = 0
  const skills = await Skills.find().lean()

  await Promise.all(
    skills.map(async skill => {
      if (typeof skill.category === 'string') {
        const category = await Categories.findOne({ slug: skill.category })
        if (category) {
          await Skills.findOneAndUpdate(
            { _id: skill._id },
            {
              category: category._id
            }
          )
          updatedCounter++
        } else {
          console.log(
            `Error updating skill '${skill.name}', category not found`
          )
        }
      }
    })
  )

  if (updatedCounter) console.log(`Updated ${updatedCounter} skills`)
}
;(async () => {
  setTimeout(changeCategoryFieldToID, 20000)
})()
