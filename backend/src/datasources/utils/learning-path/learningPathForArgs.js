// THIS FUNCTION RETURNS LEARNING PATHS SORTED BY RELEVANCE FOR GIVEN ARGUMENTS

// import { GoalTemplate } from '../../../models'

const learningPathsForArgs = async (
  dataSource,
  neededSkills = [],
  role
  // organizationId
) => {
  const roleId = role ? role._id : null
  const neededSkillIds = neededSkills.map(skill => skill._id)

  const relevantPaths = await dataSource.getAllLean({
    organization: null,
    active: true,
    hasContent: true,
    $or: [
      { skills: { $in: neededSkillIds } },
      roleId && { roles: roleId }
    ].filter(condition => !!condition)
    // $and: [
    //   {
    //     $or: [{ organization: organizationId }, { organization: null }]
    //   },
    //   { active: true },
    //   { hasContent: true }
    // ]
  })

  const now = new Date()
  const week = 6.048e8

  let highestRelevanceValue = 0

  const rankedPaths = relevantPaths.map(path => {
    let argumentCount = 0

    const { skills, roles } = path

    // WE ASSIGN 2 POINTS FOR ROLE MATCH
    if (roles.some(pathRoleId => String(pathRoleId) === String(roleId)))
      argumentCount += 2

    // AND 0.5 POINT FOR EVERY MATCHING SKILL
    neededSkillIds.forEach(neededId => {
      if (skills.some(skillId => String(skillId) === String(neededId)))
        argumentCount += 0.5
    })

    // ANOTHER 0.5 POINT IF THE PATH HAS BEEN RECENTLY ADDED
    if (now - path.createdAt < week) argumentCount += 0.5

    if (highestRelevanceValue < argumentCount)
      highestRelevanceValue = argumentCount

    return {
      ...path,
      argumentCount
    }
  })

  const ratedPaths = rankedPaths.map(({ argumentCount, ...path }) => {
    const relevanceRating = (argumentCount * 100) / highestRelevanceValue

    return {
      ...path,
      relevanceRating
    }
  })

  return ratedPaths
}

export default learningPathsForArgs
