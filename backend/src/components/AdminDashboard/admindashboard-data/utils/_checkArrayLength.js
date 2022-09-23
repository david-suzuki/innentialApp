export const checkArrayLength = (array, timeSpan) => {
  const fillArray = (arr, length) => {
    while (arr.length < length) {
      arr.unshift(0)
    }
    // NULL CHECK: The return statement was missing, so the fillArray function always returned null
    return arr
  }

  switch (timeSpan) {
    case 'LAST_WEEK':
      return array.length < 7
        ? fillArray(array, 7)
        : array.length > 7
        ? array.slice(-7)
        : array
    case 'LAST_MONTH':
      return array.length < 30
        ? fillArray(array, 30)
        : array.length > 30
        ? array.slice(-29)
        : array
    default:
      return array
  }
}
