// TBD: GET COURSE LIST FROM UDEMY
import { Skills, ContentSources, LearningContent } from '~/models'
import axios from 'axios'
import { sentryCaptureException } from '../../../../utils'
import { Types } from 'mongoose'
// import { debounce } from 'debounce'
import series from 'async/series'
import { algolia } from '~/config'
import { ENVIRONMENT } from '~/environment'
// import fs from 'fs'

const whitelistedCategories = [
  'business',
  'design',
  'development',
  'finance-and-accounting',
  'it-and-software',
  'marketing',
  'office-productivity',
  'personal-development'
]

const ObjectId = Types.ObjectId
const { UDEMY_CLIENT_ID, UDEMY_CLIENT_SECRET } = process.env
const pageSize = 100

const skillLevelsByCourse = {
  beginner: 1,
  intermediate: 3,
  expert: 5
}

export default async (skillIds, lock) => {
  lock.acquire(
    'udemy',
    async done => {
      console.log(
        'Begin downloading courses from Udemy. This may take a while...'
      )
      console.time('Udemy courses downloaded in')
      const courseLevels = ['beginner', 'intermediate', 'expert']
      const allSkills = await Skills.find({ _id: { $in: skillIds } }).lean()
      const udemySource = await ContentSources.findOne({
        baseUrls: { $in: 'https://www.udemy.com' }
      })
      if (!udemySource) {
        sentryCaptureException(`Source for Udemy not found`)
        return 1
      }

      series(
        courseLevels.map(level => {
          return async callback => {
            console.log(`Begin downloading ${level} courses`)
            let updatedCount = 0
            let createdCount = 0
            try {
              series(
                allSkills.map((skill, ix) => {
                  return async callback => {
                    try {
                      console.log(
                        `Begin downloading courses for skill: ${skill.name}`
                      )
                      const initialUrl = `https://www.udemy.com/api-2.0/courses/?page_size=${pageSize}&search=${'"' +
                        skill.slug +
                        '"'}&language=en&instructional_level=${level}&ratings=4&fields[course]=title,url,created,is_paid,visible_instructors,primary_category&fields[user]=title`

                      const courseList = []
                      let timeout = 250
                      let nextUrl = ''
                      let coursesLeft = true
                      let lowPredictiveScores = false
                      let page = 1

                      await axios
                        .get(initialUrl, {
                          auth: {
                            username: UDEMY_CLIENT_ID,
                            password: UDEMY_CLIENT_SECRET
                          }
                        })
                        .then(async res => {
                          if (res.status === 200) {
                            const { next, results } = res.data
                            if (
                              results &&
                              results.length &&
                              results.length > 0
                            ) {
                              results.forEach(result => {
                                const { predictive_score, primary_category: { title_cleaned } } = result // eslint-disable-line
                                if (predictive_score > 5 && whitelistedCategories.includes(title_cleaned)) { //eslint-disable-line
                                  courseList.push(result)
                                } else lowPredictiveScores = true
                              })
                            }
                            if (next) {
                              nextUrl = next
                            } else coursesLeft = false
                          } else {
                            coursesLeft = false
                          }
                        })
                        .catch(err => {
                          coursesLeft = false
                          console.log(`Failed to fetch Udemy courses: ${err}`)
                        })

                      while (coursesLeft && !lowPredictiveScores && page < 10) {
                        timeout += 250
                        page++
                        await axios
                          .get(nextUrl, {
                            auth: {
                              username: UDEMY_CLIENT_ID,
                              password: UDEMY_CLIENT_SECRET
                            }
                          })
                          .then(async res => {
                            if (res.status === 200) {
                              const { next, results } = res.data
                              if (
                                results &&
                                results.length &&
                                results.length > 0
                              ) {
                                results.forEach(result => {
                                  const { predictive_score, primary_category: { title_cleaned } } = result // eslint-disable-line
                                  if (predictive_score > 5 && whitelistedCategories.includes(title_cleaned)) { //eslint-disable-line
                                    courseList.push(result)
                                  } else lowPredictiveScores = true
                                })
                                if (next) {
                                  nextUrl = next
                                } else coursesLeft = false
                              } else {
                                coursesLeft = false
                              }
                            }
                          })
                          .catch(err => {
                            coursesLeft = false
                            console.log(`Failed to fetch Udemy courses: ${err}`)
                          })
                      }

                      await Promise.all(
                        courseList.map(async course => {
                          const { title, url, is_paid, created, visible_instructors } = course // eslint-disable-line
                          const existingContent = await LearningContent.findOne(
                            {
                              title
                            }
                          ).lean()
                          if (existingContent) {
                            const { relatedPrimarySkills } = existingContent
                            if (
                              relatedPrimarySkills.some(
                                related =>
                                  related._id.toString() ===
                                  skill._id.toString()
                              )
                            ) {
                              return 0
                            } else {
                              const newRelatedPrimarySkills = [
                                ...relatedPrimarySkills,
                                {
                                  ...skill,
                                  importance: 3, // low importance
                                  skillLevel: skillLevelsByCourse[level] // 1, 3 or 5
                                }
                              ]
                              await LearningContent.findOneAndUpdate(
                                { _id: existingContent._id },
                                {
                                  $set: {
                                    updatedAt: new Date(),
                                    relatedPrimarySkills: newRelatedPrimarySkills
                                  }
                                }
                              )
                              updatedCount++
                            }
                          } else {
                            const _id = new ObjectId()
                            const updatedUrl = 'https://www.udemy.com' + url
                            const price = {
                              currency: 'EUR',
                              value: is_paid ? 1 : 0 //eslint-disable-line
                            }
                            const author = visible_instructors
                              .map(instructor => instructor.title)
                              .join(' ,')
                            const relatedPrimarySkills = [
                              {
                                ...skill,
                                importance: 3, // low importance
                                skillLevel: skillLevelsByCourse[level] // 1, 3 or 5
                              }
                            ]
                            const inputData = {
                              _id,
                              title,
                              publishedDate: created,
                              author,
                              source: udemySource._id,
                              url: updatedUrl,
                              type: 'E-LEARNING',
                              relatedPrimarySkills,
                              price,
                              spider: 'udemy'
                            }
                            await LearningContent.create(inputData)
                            if (process.env.SERVER === ENVIRONMENT.PRODUCTION) {
                              algolia
                                .saveObject({
                                  objectID: _id,
                                  title,
                                  author,
                                  relatedPrimarySkills: relatedPrimarySkills.map(
                                    skill => skill.name
                                  )
                                })
                                .then(() => {})
                                .catch(e => sentryCaptureException(e))
                            }
                            createdCount++
                          }
                        })
                      )
                      setTimeout(() => callback(null), timeout)
                      return 0
                    } catch (e) {
                      console.log(e)
                      callback(e)
                      return 1
                    }
                  }
                }),
                () => {
                  console.log(
                    `Created ${createdCount} content items for ${level}; updated ${updatedCount}`
                  )
                  callback(null)
                }
              )
            } catch (e) {
              callback(e)
              console.log(e)
            }
          }
        }),
        err => {
          console.timeEnd('Udemy courses downloaded in')
          if (!err) {
            done()
          } else done(new Error(err))
        }
      )
    },
    err => {
      if (err) {
        console.log(err.message)
        return 1
      } else return 0
    }
  )
}
