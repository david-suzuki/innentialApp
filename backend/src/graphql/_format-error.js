import { UNAUTHORIZED, FORBIDDEN, ERROR, NOT_FOUND } from '~/environment'

const e401s = [
  ERROR.USER.WRONG_CREDENTIALS,
  ERROR.USER.WRONG_PASSWORD,
  UNAUTHORIZED
]

const e403s = [FORBIDDEN]

const e404s = [NOT_FOUND]

export const formatError = (err, response) => {
  if (e401s.includes(err.message)) {
    // We need this response status in the apollo client afterware
    response.status(401)
  }
  if (e403s.includes(err.message)) {
    // We need this response status in the apollo client afterware
    response.status(403)
  }
  if (e404s.includes(err.message)) {
    response.status(404)
  }
  return err
}
