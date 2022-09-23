// TODO: ADD GRAPHQL TESTER (WITH AUTH SKIP FOR TESTING)

import express from 'express'
import { graphqlExpress } from 'apollo-server-express'
import bodyParser from 'body-parser'
import { SERVER, db, agenda, jobs } from '~/config'
import { schema } from '~/schema'
import { handleAuthentication } from '~/authentication'
import enableCors from '~/cors'
import {
  context as buildContext,
  formatResponse,
  formatError,
  formatParams,
  graphiql
} from '~/graphql'
import { startupMessages, RESPONSE, ENVIRONMENT } from '~/environment'
import {
  autoclose,
  checkLearningUrl,
  createLearningItem,
  getSkillList,
  getSkillListWithCategory,
  getPathList,
  prepareResultForMicroSite,
  fetchResultForMicroSite,
  saveResultForMicroSite,
  sentryCaptureException,
  prepareBootcampResult,
  fetchBootcampResult,
  verifyBootcampResult,
  saveEmailForBootcamp,
  prepareCareerResult,
  handleIntercomHook,
  saveSurveyData
} from './utils'
import * as Sentry from '@sentry/node'
import https from 'https'
import _mockEmail from './utils/email/_mock-email'
import fs from 'fs'
import seedSnapshots from './utils/_seedSnapshots'
import { Skills, SkillsRecommendation } from '~/models'

const production = process.env.SERVER === ENVIRONMENT.PRODUCTION
// const staging = process.env.SERVER === ENVIRONMENT.STAGING

if (production)
  Sentry.init({
    dsn: 'https://d406f02b24c041c98691969eecf72f28@sentry.io/1432094'
  })
else console.log('Not production, sentry is not initialized')

db.on('error', error => {
  console.error(`Mongo connection error: ${error.message}`)
  process.exit(1)
})
db.once('open', async () => {
  console.log('Connected to the Database')
})
;(async () => {
  jobs.forEach(({ callback, jobName }) => {
    agenda.define(jobName, callback)
  })
  if (production) {
    await agenda.start()
    jobs.forEach(({ interval, jobName, options, type }) => {
      if (jobName.indexOf('TEST') !== 0 && type === 'single')
        agenda.every(interval, jobName, [], options)
    })
    console.log('Agenda started')
  } else {
    /**********************/
    /* RUN TEST JOBS HERE */
    /**********************/
    // if (staging) {

    // await seedSnapshots()

    await agenda.start()
    console.log('Testgenda started')
    jobs.forEach(({ interval, jobName, options, type }) => {
      if (type === 'single' && jobName.indexOf('TEST') === 0)
        agenda.every(interval, jobName, [], options)
    })
    // }
  }
})()

const expressServer = express()

expressServer.use(enableCors())

expressServer.get('/', (req, res) => {
  res.writeHead(200, { Connection: 'close' })
  res.end(RESPONSE.MESSAGES.UP_RUNNING)
})

expressServer.use(bodyParser.json())

expressServer.get('/website/fetch-paths', async (req, res) => {
  try {
    const pathList = await getPathList()
    res.send(pathList)
  } catch (err) {
    sentryCaptureException(err)
    res.sendStatus(500)
  }
})

expressServer.post('/intercom/hook', async (req, res) => {
  const { id, data, topic } = req.body
  if (topic === 'ping') {
    res.sendStatus(200)
    return
  }
  if (!id || !data || !topic) {
    res.sendStatus(400)
    return
  }
  handleIntercomHook(req.body)
    .then(() => {
      res.sendStatus(200)
    })
    .catch(err => {
      sentryCaptureException(err)
      res.sendStatus(500)
    })
})

expressServer.post('/micro-site/hook', async (req, res) => {
  const { event_id: eventId, form_response: response } = req.body
  if (!eventId || !response) {
    res.sendStatus(400)
    return
  }
  prepareResultForMicroSite(response)
    .then(() => {
      res.sendStatus(200)
    })
    .catch(err => {
      sentryCaptureException(err)
      res.sendStatus(500)
    })
})

expressServer.post('/micro-site/bootcamp/hook', async (req, res) => {
  const { event_id: eventId, form_response: response } = req.body
  if (!eventId || !response) {
    res.sendStatus(400)
    return
  }
  prepareBootcampResult(response)
    .then(() => {
      res.sendStatus(200)
    })
    .catch(err => {
      sentryCaptureException(err)
      res.sendStatus(500)
    })
})

expressServer.post('/micro-site/career/hook', async (req, res) => {
  const { event_id: eventId, form_response: response } = req.body
  if (!eventId || !response) {
    res.sendStatus(400)
    return
  }
  prepareCareerResult(response)
    .then(() => {
      res.sendStatus(200)
    })
    .catch(err => {
      sentryCaptureException(err)
      res.sendStatus(500)
    })
})

// expressServer.post('/micro-site/bootcamp/verify', async (req, res) => {
//   const { key } = req.body
//   if (!key) {
//     res.sendStatus(400)
//     return
//   }
//   verifyBootcampResult(key)
//     .then(() => {
//       res.sendStatus(200)
//     })
//     .catch(err => {
//       sentryCaptureException(err)
//       const status = err.message === 'Not found' ? 404 : 500
//       res.sendStatus(status)
//     })
// })

expressServer.post('/micro-site/bootcamp/email', async (req, res) => {
  const { resultId, email, contact, environment = 'local' } = req.body
  if (!resultId || !email) {
    res.sendStatus(400)
    return
  }
  saveEmailForBootcamp(resultId, email, contact, environment)
    .then(() => {
      res.sendStatus(200)
    })
    .catch(err => {
      sentryCaptureException(err)
      const status = err.message === 'Not found' ? 404 : 500
      res.sendStatus(status)
    })
})

expressServer.post('/micro-site/bootcamp/results', async (req, res) => {
  const { resultId, key } = req.body
  if (!resultId) {
    res.sendStatus(400)
    return
  }
  fetchBootcampResult(resultId, key)
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      sentryCaptureException(err)
      const status = err.message === 'Not found' ? 404 : 500
      res.sendStatus(status)
    })
})

expressServer.get('/micro-site/result/:resultId', async (req, res) => {
  const resultId = req.params.resultId
  if (!resultId) {
    res.sendStatus(400)
    return
  }
  fetchResultForMicroSite(resultId)
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      sentryCaptureException(err)
      const status = err.message === 'Not found' ? 404 : 500
      res.sendStatus(status)
    })
})

expressServer.post('/micro-site/save/:resultId', async (req, res) => {
  const resultId = req.params.resultId
  const { data } = req.body
  if (!resultId) {
    res.sendStatus(400)
    return
  }
  saveResultForMicroSite(data, resultId)
    .then(() => {
      res.send(200)
    })
    .catch(err => {
      sentryCaptureException(err)
      const status = err.message === 'Not found' ? 404 : 500
      res.sendStatus(status)
    })
})

expressServer.post('/close_assessment=:assessmentId', async (req, res) => {
  const forms = req.body
  const assessment = req.params.assessmentId
  await autoclose(forms, assessment)
    .then(() => {
      res.sendStatus(200)
    })
    .catch(err => {
      console.log(err)
      res.sendStatus(400)
    })
})

expressServer.post('/test/mock-email', async (req, res) => {
  const data = req.body
  if (data) {
    try {
      await _mockEmail(data)
      res.sendStatus(200)
    } catch (e) {
      console.log(e.message)
      res.status(e.statusCode).send({ message: e.message })
    }
  }
})

expressServer.get('/scraper/skills-categories/public', async (req, res) => {
  const skillList = await getSkillListWithCategory(true)
  res.send(skillList)
})

expressServer.get('/scraper/skills-list/public', async (req, res) => {
  const skillList = await getSkillList(true)
  res.send(skillList)
})

expressServer.get('/scraper/skills-list', async (req, res) => {
  const skillList = await getSkillList()
  res.send(skillList)
})

expressServer.post('/scraper/item-exists', async (req, res) => {
  const sourceUrl = req.body.source_url
  const exists = await checkLearningUrl(sourceUrl)
  if (exists) res.send(exists)
  else res.sendStatus(404)
})

expressServer.post('/scraper/item-create', async (req, res) => {
  const item = req.body[0]
  await createLearningItem(item)
    .then(() => {
      res.sendStatus(200)
    })
    .catch(err => {
      console.log(err)
      res.sendStatus(404)
    })
})

expressServer.post('/survey/submit', async (req, res) => {
  const data = req.body

  if (data) {
    try {
      await saveSurveyData({ data })
      res.sendStatus(200)
    } catch (e) {
      sentryCaptureException(e)
      res.sendStatus(500)
    }
  }
})

expressServer.use(handleAuthentication)

// Error handler for unexpected html responses (instead of json)
const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  const { status } = err
  return res.status(status).json(err)
}

expressServer.use(errorHandler)

expressServer.use(
  SERVER.GRAPHQL,
  graphqlExpress(async (request, response) => ({
    schema,
    context: await buildContext(request),
    formatResponse: (res, { context }) =>
      formatResponse(res, { context }, response, request),
    formatError: err => formatError(err, response),
    formatParams: params => formatParams(params)
  }))
)

// Graphiql + some initial queries
expressServer.use(graphiql.path, graphiql.server)

const { PORT } = SERVER

expressServer.listen(PORT, () => {
  startupMessages()
})
