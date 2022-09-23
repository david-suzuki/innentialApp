import { skillsData, categoriesData } from '~/fixtures'
import { Skills, Categories } from '~/models'
import slug from 'slug'
;(async () => {
  const categories = await Categories.find({
    organizationSpecific: null
  }).lean()
  if (categories.length === 0) return

  let categoryCounter = 0
  let updatedCounter = 0
  let createdCounter = 0

  try {
    Promise.all(
      categoriesData.map(async category => {
        if (!categories.some(existing => existing.slug === category.slug)) {
          try {
            categoryCounter++
            await Categories.create(category)
          } catch (e) {
            throw new Error(
              `Failed to add category ${category.name}: ${e.message}`
            )
          }
        }
      })
    )
      .then(() => {
        if (categoryCounter > 0) {
          console.log('Categories updated sucessfully')
        }
        try {
          Promise.all(
            skillsData.map(async skill => {
              try {
                const category = await Categories.findOne({
                  slug: skill.category
                })
                if (category) {
                  const existingSkill = await Skills.findOne({
                    name: skill.name
                  }).lean()
                  if (existingSkill) {
                    if (
                      String(category._id) === String(existingSkill.category)
                    ) {
                      return
                    } else {
                      updatedCounter++
                      await Skills.findOneAndUpdate(
                        { _id: existingSkill._id },
                        {
                          $set: {
                            category: category._id
                          }
                        }
                      )
                    }
                  } else {
                    createdCounter++
                    await Skills.create({
                      name: skill.name,
                      enabled: skill.enabled,
                      category: category._id,
                      slug: slug(skill.name, {
                        replacement: '_',
                        lower: true
                      })
                    })
                  }
                } else
                  throw new Error(`Failed to find category ${skill.category}`)
              } catch (e) {
                throw new Error(
                  `Failed to add skill ${skill.name}: ${e.message}`
                )
              }
            })
          ).catch(e => {
            throw new Error(e)
          })
        } catch (e) {
          throw new Error(e)
        }
        if (updatedCounter > 0 || createdCounter > 0) {
          console.log(
            `Successfully updated ${updatedCounter} and created ${createdCounter} skills`
          )
        }
      })
      .catch(e => {
        throw new Error(e)
      })
  } catch (e) {
    console.log(`Failed to update skill data: ${e.message}`)
  }
})()
