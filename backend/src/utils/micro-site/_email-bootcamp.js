import { BootcampResult } from '../../models'
import { sendEmail, emailConfirmationBootcampTemplate } from '../email'
import appUrls from '../_app-urls'
// import bootcampData from './constants/_bootcamps.js'

const bootcampEmail = async (resultId, email, contact, environment) => {
  const result = await BootcampResult.findOneAndUpdate(
    { resultId },
    {
      $set: {
        email,
        contact
      }
    }
  )

  if (!result) throw new Error(`Not found`)

  const {
    confirmation: { key }
  } = result

  try {
    await sendEmail(
      email,
      'Your bootcamp result',
      emailConfirmationBootcampTemplate({
        key,
        resultId,
        micrositeLink: appUrls.bootcamp(environment)
      }),
      'My Career Compass'
    )
  } catch (err) {
    throw new Error(
      `Failed to send confirmation email: ${err.message}, email: ${email}`
    )
  }
}

export default bootcampEmail
