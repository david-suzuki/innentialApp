import { LearningContent, DevelopmentPlan, GoalTemplate } from '~/models'
import axios from 'axios'
import series from 'async/series'
import { ENVIRONMENT } from '~/environment'
import dataSources from '~/datasources'
import { createLearningItem } from '../../../utils'
import slug from 'slug'

const withTimestamp = s => `${new Date().toISOString()}::${s}`

const remapItemForScraper = ({
  title,
  author,
  url: source_url, // eslint-disable-line
  publishedDate: date,
  type: item_type, // eslint-disable-line
  nOfReviews,
  relatedPrimarySkills = [],
  relatedSecondarySkills = [],
  duration,
  price: { value: price },
  externalRating: external_rating, // eslint-disable-line
  spider,
  certified
}) => [
  {
    title,
    author,
    source_url,
    date,
    item_type,
    duration: duration || null,
    price,
    certified,
    difficulty_level: relatedPrimarySkills.reduce((acc, { skillLevel }) => {
      if (skillLevel > acc) return skillLevel
      return acc
    }, 0),
    external_rating,
    scraper_name: spider || null,
    n_of_reviews: nOfReviews || 0,
    primary_skills: relatedPrimarySkills.map(({ name }) =>
      slug(name, {
        replacement: '_',
        lower: true
      })
    ),
    secondary_skills: relatedSecondarySkills
      .map(({ name }) =>
        slug(name, {
          replacement: '_',
          lower: true
        })
      )
      .join(', ')
  }
]

const handleContentDeletion = async (contentId, sensitive) => {
  if (sensitive) {
    const inDevPlan = await DevelopmentPlan.findOne({
      'content.contentId': contentId
    })
      .select({ _id: 1 })
      .lean()

    const inGoalTemplate = await GoalTemplate.findOne({
      content: contentId
    })
      .select({ _id: 1 })
      .lean()

    if (inGoalTemplate || inDevPlan) {
      console.log(
        `Content deletion omitted for ${contentId}: marked as inactive`
      )

      await LearningContent.findOneAndUpdate(
        { _id: contentId },
        {
          $set: {
            inactive: true,
            updatedAt: new Date()
          }
        }
      )

      return
    }
  }

  return dataSources().LearningContent.singleDelete({ _id: contentId })
}

const cleanupScript = async (docs, lock) => {
  let deletedCount = 0
  let updatedCount = 0
  let reviewCount = 0
  const timeout = 250

  const scraperUrl = `http://admin-sc.innential.com${
    process.env.SERVER === ENVIRONMENT.PRODUCTION ? '' : ':7070'
  }/api/check_content/`

  console.time('Content cleanup ran in')

  console.log(withTimestamp('Begin crawling through learning items'))

  lock.acquire(
    'cleanup',
    async done => {
      series(
        docs.map(({ _id, ...item }, i) => {
          return async callback => {
            if ((i + 1) % 100 === 0)
              console.log(
                withTimestamp(`Crawled through ${i + 1} learning items`)
              )
            try {
              // console.log(JSON.stringify(remapItemForScraper(item)))
              const response = await axios.post(
                scraperUrl,
                JSON.stringify(remapItemForScraper(item)),
                {
                  headers: {
                    'Content-Type': 'application/json'
                  }
                }
              )
              if (response) {
                const { status /*, statusText */, data } = response
                // console.log(status, statusText)
                if (status === 206) {
                  updatedCount++
                  // UPDATE CONTENT WITH MISSING INFO
                  createLearningItem(data)
                }
              }
            } catch (e) {
              const response = e.response
              if (response) {
                const { status, statusText, data: reason } = response
                console.log(status, statusText)
                if (status === 404) {
                  // URL RETURNS 404/410; CAN'T FIND CONTENT IN API; BAD CONTENT
                  if (reason !== 'other') {
                    // DELETE CONTENT THAT DOESN'T NEED TO BE REVIEWED MANUALLY
                    deletedCount++
                    console.log(`Deleting item: ${item.url}`)
                    handleContentDeletion(_id, reason !== 'not_found')
                  } else {
                    // SCHEDULE FOR MANUAL REVIEW
                    reviewCount++
                    await LearningContent.findOneAndUpdate(
                      { _id },
                      {
                        $set: {
                          toReview: true,
                          toCleanup: false,
                          lastCleanedAt: new Date(),
                          updatedAt: new Date()
                        }
                      }
                    )
                  }
                } else {
                  console.error(
                    `${status} ${statusText}`,
                    JSON.stringify(remapItemForScraper(item))
                  )
                }
              } else {
                console.error(
                  e.message,
                  JSON.stringify(remapItemForScraper(item))
                )
              }
            }
            setTimeout(() => callback(null), timeout)
            return 0
          }
        }),
        error2 => {
          if (!error2) {
            done()
          } else done(new Error(error2))
        }
      )
    },
    async error => {
      if (error) {
        console.error(error.message)
        return 1
      } else {
        updatedCount && console.log(`${updatedCount} items updated`)
        deletedCount && console.log(`${deletedCount} items deleted`)
        reviewCount && console.log(`${reviewCount} items marked for review`)
        console.log(withTimestamp('Finished crawling through learning items'))
        console.timeEnd('Content cleanup ran in')
        return 0
      }
    }
  )
}

export default cleanupScript
