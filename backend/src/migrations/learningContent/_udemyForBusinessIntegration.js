import axios from 'axios'
import { ContentSources, LearningContent, Subscription } from '../../models'
import fs from 'fs'

const {
  UDEMY_CLIENT_ID,
  UDEMY_CLIENT_SECRET,
  UDEMY_ACCOUNT_NAME,
  UDEMY_ACCOUNT_ID
} = process.env

const whitelistedCategories = [
  'business',
  'design',
  'development',
  'finance and accounting',
  'it and software',
  'marketing',
  'office productivity'
]

const token = Buffer.from(
  `${UDEMY_CLIENT_ID}:${UDEMY_CLIENT_SECRET}`,
  'utf8'
).toString('base64')

const timeout = 1000

const Authorization = `Basic ${token}`

const initialUrl = `https://${UDEMY_ACCOUNT_NAME}.udemy.com/api-2.0/organizations/${UDEMY_ACCOUNT_ID}/courses/list/?fields[course]=title,url,id,estimated_content_length,locale,primary_category&page=1&page_size=100`

;(async () => {
  try {
    const updated = await LearningContent.findOne({
      udemyCourseId: { $ne: null }
    })
      .select({ _id: 1 })
      .lean()

    if (updated) return

    let courses = []
    let next = null
    let updatedCount = 0

    const sleep = ms => {
      return new Promise(resolve => setTimeout(resolve, ms))
    }

    const getPage = async prevNext => {
      try {
        console.log('Beginning request')
        const response = await axios.get(prevNext || initialUrl, {
          headers: {
            Authorization
          }
        })

        const { results, next: newNext } = response.data

        console.log('Next url: ', newNext)

        const filteredResults = results
          .filter(
            ({ locale }) =>
              locale && locale.locale && locale.locale.indexOf('en') === 0
          )
          .filter(
            ({ primary_category: pc }) =>
              pc && whitelistedCategories.includes(pc.title.toLowerCase())
          )

        courses = [...courses, ...filteredResults]

        return newNext
      } catch (err) {
        console.error(err.message)
        return null
      }
    }

    let file

    // try {
    //   file = fs.readFileSync('UFBCourses.json')
    // } catch (err) {
    //   file = null
    // }

    // if (!file) {
    while (true) {
      next = await getPage(next)

      if (!next) break

      await sleep(timeout)
    }
    // } else {
    //   courses = JSON.parse(file)
    // }

    console.log(`Obtained ${courses.length} legal courses`)

    // if (!file) {
    //   fs.writeFileSync('UFBCourses.json', JSON.stringify(courses))
    // }

    const udemySource = await ContentSources.findOne({
      name: 'Udemy'
    }).select({ _id: 1 })

    let adcashSubscription = await Subscription.findOne({
      source: udemySource._id,
      organizationId: '5dcee5d6d102a00029b2ff7e'
    })
      .select({ _id: 1 })
      .lean()

    if (!adcashSubscription) {
      adcashSubscription = await Subscription.create({
        source: udemySource._id,
        organizationId: '5dcee5d6d102a00029b2ff7e',
        accountName: UDEMY_ACCOUNT_NAME,
        name: 'Udemy for Business'
      })
    }

    const matchedUdemyContent = await LearningContent.find({
      title: { $in: courses.map(({ title }) => title) },
      source: udemySource._id
    }).select({ _id: 1, title: 1 })

    console.log(
      `Matched ${matchedUdemyContent.length} courses from ${courses.length} available`
    )

    const matchedTitles = matchedUdemyContent.map(({ title }) => title)

    const unmatchedUFBCourses = courses.filter(
      ({ title }) => !matchedTitles.includes(title)
    )

    // if (process.env.NODE_ENV === 'development') {
    //   fs.writeFileSync('UFBunmatched.json', JSON.stringify(unmatchedUFBCourses))
    // }

    await Promise.all(
      courses.map(async ({ title, id, estimated_content_length: ecl }) => {
        const hours = ecl ? Math.floor(ecl / 60) : null
        const minutes = ecl ? ecl % 60 : null

        const updated = await LearningContent.findOneAndUpdate(
          { title, source: udemySource._id, udemyCourseId: null },
          {
            $set: {
              udemyCourseId: id,
              ...(ecl && {
                duration: {
                  hours,
                  minutes,
                  basis: 'ONE TIME'
                }
              })
            }
          }
        )

        if (updated) updatedCount++
      })
    )

    console.log(`Updated ${updatedCount} courses from Udemy with new data`)
  } catch (err) {
    console.error(err.message)
  }
})()
