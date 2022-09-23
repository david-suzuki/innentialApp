module.exports = {
  AUTH_SECRET_TOKEN: {
    default: '12345'
  },
  AUTH_SECRET_REFRESH_TOKEN: {
    default: '123456789'
  },
  MONGO_URL: {
    default: 'mongodb://localhost'
  },
  NODE_ENV: {
    default: 'development'
  },
  AUTH_ENDPOINT: {
    default: 'localhost'
  },
  TZ: {
    default: 'TZ=Europe/Berlin'
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
  }
}
