import { Skills, Categories } from '~/models'
import slug from 'slug'
import { skillsData } from './_skillsData.js'
import { categoriesData } from './_categoriesData'

export default async () => {
  const categories = await Categories.find()
  if (categories.length === 0) {
    try {
      await new Promise((resolve, reject) => {
        Categories.insertMany(categoriesData, (error, docs) => {
          if (error) {
            reject(new Error(error))
          } else {
            console.log('Categories added sucessfully')
            Skills.find()
              .lean()
              .then(skills => {
                if (skills.length === 0) {
                  Promise.all(
                    skillsData.map(async skill => {
                      const category = await Categories.findOne({
                        slug: skill.category
                      })
                      if (!category) return null
                      return {
                        name: skill.name,
                        enabled: skill.enabled,
                        category: category._id,
                        slug: slug(skill.name, {
                          replacement: '_',
                          lower: true
                        })
                      }
                    })
                  ).then(updatedSkills => {
                    Skills.insertMany(
                      updatedSkills.filter(s => !!s),
                      (error, docs) => {
                        if (error) {
                          reject(new Error(error))
                        } else {
                          console.log('Skills added sucessfully')
                          resolve()
                        }
                      }
                    )
                  })
                }
              })
          }
        })
      })
    } catch (e) {
      console.error(e)
    }
  }
}
