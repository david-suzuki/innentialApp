export const removeDuplicates = (myArr, prop) => {
  return myArr.filter((obj, pos, arr) => {
    return (
      arr.map(mapObj => String(mapObj[prop])).indexOf(String(obj[prop])) === pos
    )
  })
}
