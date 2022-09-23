const freshTag = {
  name: 'FRESH',
  color: '#BA0913',
  backgroundColor: '#FFDAD8'
}

const paidTag = {
  name: 'PAID',
  color: '#BF7817',
  backgroundColor: '#FFECD0'
}

const freeTag = {
  name: 'FREE',
  color: '#128945',
  backgroundColor: '#D1F2E1'
}

const levels = ['NOVICE', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']

export default ({ path }) => {
  const {
    _id,
    name,
    author,
    publishedDate,
    abstract,
    duration,
    prerequisites = '',
    trending,
    targetGroup = '',
    imageLink,
    skills,
    paid: isPaid,
    // goalTemplate: goalTemplates = [],
    organization,
    team,
    recommendedToTeams,
    userProgress
  } = path

  // const skills = goalTemplates.reduce((acc, { relatedSkills }) => {
  //   const array = [...acc]
  //   relatedSkills.forEach(skill => {
  //     if (!array.some(({ _id }) => skill._id === _id)) array.push(skill)
  //   })
  //   return [...array]
  // }, [])

  // const isPaid = goalTemplates.some(({ content }) =>
  //   content.some(({ price }) => price.value > 0)
  // )

  const isFresh = new Date() - new Date(publishedDate) < 6.048e8

  // const levelIx = skills
  //   .map(skill => skill.level)
  //   .reduce((a, b) => {
  //     if (a > b) {
  //       return a
  //     } else return b
  //   }, 0)

  // const level = levels[levelIx]

  const labels = []

  if (isPaid) {
    labels.push(paidTag)
  } else {
    labels.push(freeTag)
  }

  if (isFresh) labels.push(freshTag)

  const mainTags = skills
    // .filter(tag =>
    //   neededWorkSkills.length > 0
    //     ? neededWorkSkills.some(skill => tag._id.indexOf(skill.skillId) !== -1)
    //     : true
    // )
    .map(({ _id, name }) => ({
      _id,
      name,
      main: true
    }))

  // const secondaryTags = skills
  //   .filter(skill => !mainTags.some(tag => tag._id.indexOf(skill._id) !== -1))
  //   .map(({ _id, name }) => ({
  //     _id,
  //     name,
  //     main: false
  //   }))

  // const skillTags = [...mainTags, ...secondaryTags]

  let firstTeamName = null
  if (recommendedToTeams && recommendedToTeams.length > 0) {
    recommendedToTeams.sort(function(team1, team2) {
      const t1 = team1.teamName
      const t2 = team2.teamName

      if (t1 < t2) return -1
      if (t1 > t2) return +1
      return 0
    })

    firstTeamName = recommendedToTeams[0].teamName
  }

  return {
    _id,
    labels,
    abstract,
    duration,
    skillTags: mainTags,
    name,
    // level,
    author,
    // goalTemplates,
    targetGroup,
    isFresh,
    imageLink,
    trending,
    organization,
    team,
    firstTeamName,
    userProgress
  }
}
