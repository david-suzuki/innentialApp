import { ENVIRONMENT } from '../../environment'
import { BootcampResult } from '../../models'
import { sendEmail, newBootcampUserTemplate } from '../email'
import appUrls from '../_app-urls'
import bootcampData from './constants/_bootcamps.js'
// import fs from 'fs'

// MOCK DATA

// RESULT PREPARATION ALGORITHM

const verifyResult = async (key, environment) => {
  const existingResult = await BootcampResult.findOne({
    'confirmation.key': key
  })

  if (!existingResult) return

  if (!existingResult.confirmation.verifiedAt) {
    await BootcampResult.findOneAndUpdate(
      { 'confirmation.key': key },
      {
        $set: {
          'confirmation.verifiedAt': new Date()
        }
      }
    )

    const {
      email,
      bootcampsMatched,
      contact,
      background,
      education,
      criteria,
      name,
      codingExperience,
      changeProfession,
      feedback
    } = existingResult

    const bootcamps = bootcampsMatched
      .map(url => bootcampData.find(bootcamp => bootcamp.url === url))
      .filter(item => !!item)

    // TBD: SEND EMAIL WITH RESULTS TO USER

    if (process.env.SERVER === ENVIRONMENT.PRODUCTION) {
      try {
        await sendEmail(
          'careercompass@innential.com',
          'New micro-site acquisition',
          newBootcampUserTemplate({
            email,
            nBootcamps: bootcamps.length,
            bootcamps,
            contact,
            background,
            education,
            criteria,
            name,
            codingExperience,
            changeProfession,
            feedback
          }),
          'My Career Compass'
        )
      } catch (err) {
        throw new Error(
          `Failed to send acquisition email: ${err.message}, email: ${email}`
        )
      }
    }
  }
}

export default verifyResult
