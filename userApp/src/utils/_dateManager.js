export const dateCombiner = (date1, date2) => {
  const year = date1.getFullYear()
  const month = date1.getMonth()
  const date = date1.getDate()
  const hours = date2.getHours()
  const minutes = date2.getMinutes()
  const seconds = date2.getSeconds()

  return new Date(year, month, date, hours, minutes, seconds)
}
