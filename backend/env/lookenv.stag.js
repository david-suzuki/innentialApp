module.exports = {
  AUTH_SECRET_TOKEN: {
    required: true
  },
  AUTH_SECRET_REFRESH_TOKEN: {
    required: true
  },
  MONGO_URL: {
    required: true
  },
  NODE_ENV: {
    default: 'production'
  },
  SERVER: {
    default: 'staging'
  },
  AUTH_ENDPOINT: {
    default: 'localhost'
  },
  TZ: {
    required: true
  },
  SENDGRID_API_SECRET: {
    required: true
  },
  S3_BUCKET: {
    required: true
  },
  X_AWS_ACCESS_KEY_ID: {
    required: true
  },
  X_AWS_SECRET_ACCESS_KEY: {
    required: true
  },
  UDEMY_CLIENT_ID: {
    required: true
  },
  UDEMY_CLIENT_SECRET: {
    required: true
  },
  MAILCHIMP_API_KEY: {
    required: true
  },
  MAILCHIMP_LIST_ID: {
    required: true
  },
  MAILCHIMP_ONBOARDING_JOURNEY_ID: {
    required: true
  },
  MAILCHIMP_ONBOARDING_JOURNEY_STEP_ID: {
    required: true
  }
}
