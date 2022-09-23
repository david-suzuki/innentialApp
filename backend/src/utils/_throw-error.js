const fillError = (error, filteredErrors) => {
  const err = error.message || error
  const errors = Object.entries(filteredErrors).reduce((arr, [k, v]) => {
    if (err.includes(k)) return [...arr, v]
    return arr
  }, [])
  return errors[0] || err
}

export default obj => {
  const { error, customErrors, message } = obj || {}
  if (error) {
    if (message) {
      throw new Error(message)
    }
    if (customErrors) {
      throw new Error(fillError(error, customErrors))
    }
    throw new Error(error)
  }
  return null
}
