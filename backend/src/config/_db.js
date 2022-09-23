import mongoose from 'mongoose'

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  // useUnifiedTopology: true,
  connectTimeoutMS: 0,
  useFindAndModify: false,
  useCreateIndex: true,
  dbName: 'innential',
  poolSize: process.env.NODE_ENV === 'production' ? 10 : 5
})

const db = mongoose.connection

export default db
