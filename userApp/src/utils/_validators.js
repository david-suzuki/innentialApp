export const emailCharacterValidator = (rule, value, callback, isUser) => {
  const pattern = /^[a-zA-Z0-9!#$%&'*+-/=?^_`{|}~@.]*$/

  if (!value.match(pattern)) {
    callback(`This email address contains invalid characters`)
  } else {
    callback()
  }
}
