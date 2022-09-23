import { format, addMinutes } from 'date-fns'

const localizedTime = (date, dateFormat = 'DD/MM/YYYY - HH:mm') => {
  const localDate = new Date()
  const localTimezoneOffset = localDate.getTimezoneOffset()
  const localTime = addMinutes(date, -localTimezoneOffset)
  return format(localTime, dateFormat)
}

export default localizedTime
