import { LearningContent, ContentSources } from '~/models'
import { learningContentSearch } from './'
import GokuArray from 'goku-array' // MUCH BETTER
// import { removeDuplicates } from '../../../../utils' TOO EXPENSIVE!

// The helper function for getting ID's
const getAllIds = data => {
  let arrayOfAllIds = []
  if (Array.isArray(data)) {
    data.forEach(element => {
      const result = getAllIds(element)
      arrayOfAllIds = [...arrayOfAllIds, ...result]
    })
  } else {
    for (const property in data) {
      // If an object has _id property, it is then pushed to arrayOfAllIds
      if (property === '_id') {
        arrayOfAllIds = [data[property], ...arrayOfAllIds]
      } else {
        if (typeof data[property] === 'object') {
          const result = getAllIds(data[property])
          arrayOfAllIds = [...arrayOfAllIds, ...result]
        }
      }
    }
  }

  return arrayOfAllIds
}

// THIS FUNCTION RETURNS LEARNING CONTENT SORTED BY RELEVANCE FOR GIVEN ARGUMENTS

export const learningContentForArgs = async (
  cleanArgs,
  likedContent,
  dislikedContent,
  filterDisabled
) => {
  let relevantLearningContent = []

  const skillsNotFound = []

  const { neededSkills } = cleanArgs

  if (!neededSkills) return []

  const disabledSources = await ContentSources.find({ enabled: false }).lean()

  const relevantContentBySkill = await Promise.all(
    neededSkills.map(async skill => {
      const { _id } = skill
      const name = skill.name || skill.slug

      const skillRelatedContent = await LearningContent.find({
        'relatedPrimarySkills._id': _id,
        inactive: { $ne: true },
        ...(filterDisabled && {
          source: { $nin: disabledSources.map(({ _id }) => _id) }
        })
      }).lean()

      if (skillRelatedContent.length > 0) return skillRelatedContent

      skillsNotFound.push(skill)
      return learningContentSearch(name)
    })
  )

  const array = new GokuArray(
    relevantContentBySkill.reduce((acc, curr) => [...acc, ...curr], [])
  )

  relevantLearningContent = array.unique(({ _id }) => String(_id)).toArray()

  // for (let argumentName in cleanArgs) {
  //   const nestedItem = cleanArgs[argumentName]
  //   if (cleanArgs.neededSkills && argumentName === 'neededSkills') {
  //     // GET RELEVANT CONTENT FOR SKILL, EITHER BY CATEGORIZATION OR SEARCH
  //     // If neededSkills are not available then check for selectedSkills
  //   } else if (!cleanArgs.neededSkills && argumentName === 'selectedSkills') {
  //     const argumentValues = nestedItem.map(item => item._id)
  //     relevantLearningContent = await LearningContent.find({
  //       'relatedPrimarySkills._id': { $in: argumentValues }
  //     }).lean()
  //   }
  // }

  // Clear the disliked and liked content from the list
  let filteredLearningContent = relevantLearningContent
    .filter(content => {
      if (!dislikedContent || dislikedContent.length === 0) return true
      else
        return !dislikedContent.some(
          dislike => content._id.toString() === dislike.toString()
        )
    })
    .filter(content => {
      if (!likedContent || likedContent.length === 0) return true
      else
        return !likedContent.some(
          like => content._id.toString() === like.toString()
        )
    })

  // if (filterDisabled) {
  //   const disabledSources = await ContentSources.find({ enabled: false }).lean()
  //   if (disabledSources.length > 0) {
  //     filteredLearningContent = filteredLearningContent.filter(content => {
  //       return !disabledSources.some(
  //         disabled => String(content.source) === String(disabled._id)
  //       )
  //     })
  //   }
  // }

  const now = new Date()
  const week = 604800000

  const allRequestIds = getAllIds(cleanArgs)

  const selectedSkillsIds = getAllIds(cleanArgs.selectedSkills)
  const neededSkillsIds = getAllIds(cleanArgs.neededSkills)

  let highestRelevanceValue = 0
  const rankedLearningContent =
    filteredLearningContent &&
    filteredLearningContent.length > 0 &&
    filteredLearningContent.map((learningContent, i) => {
      let argumentCount = 0
      const { relatedPrimarySkills = [], title } = learningContent

      // See if relatedPrimarySkill of the learning content is available in the request Arguments
      const allNeededSkills = relatedPrimarySkills
        .map(item => {
          if (neededSkillsIds.includes(item._id)) {
            argumentCount++
            // find out how many times relatedPrimarySkill is available in the request Arguments
            // It is possible that it appears both in neededSkills and selectedSkills
            // const numberOfSkillAppereance = allRequestIds.filter(
            //   id => id === item._id
            // ).length
            // argumentCount = argumentCount + numberOfSkillAppereance

            // See if selectedSkill matches relatedPrimarySkill and compare their skillLevels.

            if (item.skillLevel !== 0) argumentCount++

            if (selectedSkillsIds.includes(item._id)) {
              const { level } = cleanArgs.selectedSkills.find(
                skill => skill._id === item._id
              )
              const distance = item.skillLevel - level
              const score =
                distance < 0
                  ? Math.max(0, 3 + distance * 2)
                  : Math.max(0, 3 - distance)
              argumentCount += score
            } else if (item.skillLevel === 1) {
              argumentCount++
            }

            // See how big is the importance of the learning content to the skill
            if (item.importance < 3) {
              const calculatedPoints = 3 - item.importance
              argumentCount = argumentCount + calculatedPoints
            }
            return true
          }
          return false
        })
        .every(hasNeededContent => hasNeededContent)

      // EXTRA POINT FOR CONTENT WITH PURELY THE DESIRED SKILLS IN RELATED SKILLS
      if (allNeededSkills) argumentCount++

      const matchedSearch = skillsNotFound.map(skill => {
        const query = skill.name || skill.slug

        const regex = new RegExp(query, 'i')

        return regex.test(title)
      })

      const searchArguments = matchedSearch.reduce(
        (acc, curr) => acc + Number(curr),
        0
      )
      argumentCount += searchArguments

      // if (learningContent.externalRating) {
      //   // ADDITIONAL POINTS FOR HIGH RATINGS
      //   argumentCount += Math.max(learningContent.externalRating - 4, 0) * 2.5
      // }

      // if (learningContent.certified) {
      //   // ADDITIONAL POINT FOR CERTIFICATE
      //   argumentCount++
      // }

      // See if relatedSecondarySkills are available in any of the request Arguments
      // WE ONLY GIVE 0.5 POINT FOR ADDITIONAL SECONDARY SKILLS IN THE LEARNING CONTENT
      if (
        learningContent.relatedSecondarySkills &&
        learningContent.relatedSecondarySkills.length > 0 &&
        !!learningContent.relatedSecondarySkills.find(e =>
          neededSkillsIds.includes(e._id)
        )
      ) {
        argumentCount += 0.5
      }

      // See if related line of work is available in the request Arguments
      if (
        learningContent.relatedLineOfWork &&
        allRequestIds.includes(learningContent.relatedLineOfWork._id)
      ) {
        argumentCount++
      }

      // See if related interests are available in the request Arguments
      if (
        learningContent.relatedInterests &&
        learningContent.relatedInterests.length > 0
      ) {
        learningContent.relatedInterests.forEach(e => {
          if (allRequestIds.includes(e._id)) {
            argumentCount++
          }
        })
      }

      // See if related industries are available in the request Arguments
      if (
        learningContent.relatedIndustries &&
        learningContent.relatedIndustries.length > 0
      ) {
        learningContent.relatedIndustries.forEach(e => {
          if (allRequestIds.includes(e._id)) {
            argumentCount++
          }
        })
      }

      // See if content is newer than 1 week; if so, we give an additional half a point
      if (now - learningContent.publishedDate < week) {
        const maxSkillLevel = relatedPrimarySkills
          .map(skill => skill.skillLevel)
          .reduce((a, b) => {
            if (a > b) {
              return a
            } else return b
          })

        if (maxSkillLevel === 0) {
          argumentCount += 0.5
        }
      }

      if (highestRelevanceValue < argumentCount)
        highestRelevanceValue = argumentCount

      return {
        ...learningContent,
        argumentCount
      }
    })

  const learningContentWithRating =
    rankedLearningContent &&
    rankedLearningContent.length > 0 &&
    rankedLearningContent.map((learningContent, i) => {
      let relevanceRating =
        (learningContent.argumentCount * 100) / highestRelevanceValue

      delete learningContent.argumentCount

      return {
        ...learningContent,
        relevanceRating
      }
    })

  return learningContentWithRating || []
}
