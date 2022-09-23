import mailchimp from '@mailchimp/mailchimp_marketing'

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: 'us6'
})
;(async () => {
  try {
    await mailchimp.ping.get()
    console.log('Mailchimp is up and running')
  } catch (err) {
    console.error(`Mailchimp error: ${err.message}`)
  }
})()

export default mailchimp
