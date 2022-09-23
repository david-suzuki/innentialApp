require('dotenv').config()
require('./server')
require('./fixtures')
if (process.env.NODE_ENV === 'production') {
  require('./migrations')
}
