import Agenda from 'agenda'
import db from './_db'
import { sentryCaptureException } from '~/utils'

const agenda = new Agenda({ mongo: db })

agenda.on('error', err => sentryCaptureException(`Agenda error: ${err}`))

export default agenda
