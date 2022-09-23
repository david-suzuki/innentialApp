export function removeTypename(array) {
  const resp = array.reduce((acc, curr) => {
    const { __typename, ...rest } = { ...curr }
    return [...acc, rest]
  }, [])
  return resp
}
