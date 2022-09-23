const createRandomGenerator = seed => {
  const a = 5486230734
  const b = 6908969830
  const m = 9853205067
  var x = seed
  return function(seed = x) {
    x = (seed * a + b) % m
    return x / m
  }
}

const cyrb53 = function(str, seed = 0) {
  let h1 = 0xdeadbeef ^ seed
  let h2 = 0x41c6ce57 ^ seed
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }
  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  return 4294967296 * (2097151 & h2) + (h1 >>> 0)
}

export const shuffleLearningContent = (
  contentArray, // [LearningContent]
  requiredSkills // [String]
) => {
  if (contentArray.length === 0) return []
  const shuffledContent = []
  const hashSeed = cyrb53(requiredSkills.join(''), 19319)
  const random = createRandomGenerator(hashSeed)

  let relevance = 100
  let i = 0
  const contentByRelevance = contentArray.reduce(
    (acc, curr) => {
      if (curr.relevanceRating < relevance) {
        relevance = curr.relevanceRating
        i += 1
        return [...acc, [curr]]
      } else {
        acc[i].push(curr)
        return acc
      }
    },
    [[]]
  )

  const shuffledContentByRelevance = []
  contentByRelevance.forEach(contentlist => {
    if (contentlist.length > 0) {
      const shuffledContent = []
      while (contentlist.length > 1) {
        shuffledContent.push(
          contentlist.splice(Math.floor(random() * contentlist.length), 1)[0]
        )
      }
      shuffledContent.push(contentlist[0])
      shuffledContentByRelevance.push(shuffledContent)
    }
  })

  shuffledContentByRelevance.forEach(contentlist => {
    contentlist.forEach(content => shuffledContent.push(content))
  })

  return shuffledContent // [LearningContent]
}
