const sgMail = require('@sendgrid/mail')

const { SENDGRID_API_SECRET } = process.env

sgMail.setApiKey(SENDGRID_API_SECRET)

const sendEmail = async (
  email,
  subject,
  content,
  name = 'Innential',
  category = 'Uncategorized'
) => {
  // check if the first half of the email has 24 length (length of a mongo id)
  // check if the 2nd part of the email is innential
  // means it's just a dummy user, do not send email
  const dummyCheck = email
    .split('@')
    .join(', ')
    .split('.')[0]
    .split(', ')
  if (dummyCheck[0].length === 24 && dummyCheck[1] === 'innential') {
    return
  }
  // const category =
  //   subject === 'New learning available at Innential'
  //     ? 'Weekly Content'
  //     : subject === `Your team's top shared learning at Innential`
  //     ? 'Daily Shared Content'
  //     : 'Uncatagorized'
  const message = {
    to: email,
    from: {
      name,
      email: 'info@innential.com'
    },
    subject,
    content: [
      {
        type: 'text/html',
        value: content
      }
    ],
    category
  }

  let response

  try {
    response = await sgMail.send(message)
    const [{ statusCode }] = response
    return statusCode
  } catch (error) {
    // console.log('SENDGRID ERROR', error) // eslint-disable-line no-console
    // console.log('SENDGRID ERROR', JSON.stringify(error)) // eslint-disable-line no-console
    console.log('SENDGRID ERROR', JSON.stringify(error.response)) // eslint-disable-line no-console
  }

  return response
}

export default sendEmail
