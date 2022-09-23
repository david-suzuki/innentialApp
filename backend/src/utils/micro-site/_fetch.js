import {
  MicroSiteResult,
  RoleRequirements,
  LearningContent
} from '../../models'
import { learningContentForArgs } from '../../components/LearningContent/form-data/utils'
import { prepLearningForWebsite } from '../'

// DEPRECATED

const sortByRelevance = (a, b) => b.relevanceRating - a.relevanceRating

const hasPrimarySkill = skill => ({ title, relatedPrimarySkills }) =>
  new RegExp(skill.name, 'i').test(title) ||
  relatedPrimarySkills.some(({ _id: skillId }) => skill._id === skillId)

const fetchResult = async resultId => {
  const userResults = await MicroSiteResult.findOne({
    'results.resultId': resultId
  }).lean()

  if (!userResults) throw new Error('Not found')

  const { name, results } = userResults
  const newResult = results.find(result => result.resultId === resultId)

  const {
    neededSkills = [],
    selectedSkills = [],
    chartData,
    roleChosen,
    hours,
    selectedContent = []
  } = newResult

  const role = await RoleRequirements.findById(roleChosen)
    .select({ title: 1 })
    .lean()

  if (selectedContent.length > 0) {
    const selectedLearningItems = await LearningContent.find({
      _id: { $in: selectedContent }
    }).lean()

    return {
      name,
      chartData,
      roleChosen: role ? role.title : 'Your role fit',
      hours,
      selectedContent: await prepLearningForWebsite(selectedLearningItems)
    }
  }

  const primarySkill = neededSkills[0]

  console.time('Content found in')

  const learning = await learningContentForArgs(
    {
      neededSkills,
      selectedSkills
    },
    [],
    [],
    true
  )
  console.timeEnd('Content found in')

  if (learning.length === 0) throw new Error(`No content found`)

  console.time('Content processed in')

  const courses = learning.filter(({ type }) => type === 'E-LEARNING')
  const freeContent = learning.filter(
    ({ price: { value }, type }) => type !== 'E-LEARNING' && value === 0
  )

  const primarySkillCourses = courses.filter(hasPrimarySkill(primarySkill))

  const freeCourses = courses.filter(({ price: { value } }) => value === 0)

  const maxPrimarySkillRelevance = primarySkillCourses.reduce(
    (acc, { relevanceRating }) =>
      relevanceRating > acc ? relevanceRating : acc,
    0
  )
  const maxRelevance = courses.reduce(
    (acc, { relevanceRating }) =>
      relevanceRating > acc ? relevanceRating : acc,
    0
  )
  const maxFreeRelevance = freeContent.reduce(
    (acc, { relevanceRating }) =>
      relevanceRating > acc ? relevanceRating : acc,
    0
  )

  const mostRelevantPrimarySkillCourses = primarySkillCourses.filter(
    ({ relevanceRating }) => relevanceRating > 0.75 * maxPrimarySkillRelevance
  )
  const mostRelevantCourses = courses.filter(
    ({ relevanceRating }) => relevanceRating > 0.75 * maxRelevance
  )
  const mostRelevantBites = freeContent.filter(
    ({ relevanceRating }) => relevanceRating > 0.65 * maxFreeRelevance
  )

  mostRelevantCourses.sort(sortByRelevance)
  mostRelevantBites.sort(sortByRelevance)

  const recommendedBites = mostRelevantBites.slice(0, 2)
  const otherBites = mostRelevantBites.slice(2, mostRelevantBites.length - 1)

  const [highestRelevanceCourse] = mostRelevantCourses.splice(0, 1)

  const highestRelevanceSource = String(highestRelevanceCourse.source)
  const highestIsCertified = highestRelevanceCourse.certified
  const highestHasPrimarySkill =
    new RegExp(primarySkill.name, 'i').test(highestRelevanceCourse.title) ||
    highestRelevanceCourse.relatedPrimarySkills.some(
      ({ _id: skillId }) => primarySkill._id === skillId
    )

  const certifiedCourses = mostRelevantCourses
    .filter(({ certified }) => certified)
    .filter(({ source }) => String(source) !== highestRelevanceSource)

  const primarySkillRecommendation = mostRelevantPrimarySkillCourses[0]

  const nCertToReturn =
    highestIsCertified ||
    (!highestHasPrimarySkill && primarySkillRecommendation)
      ? 1
      : 2

  certifiedCourses.sort(sortByRelevance)

  const certifiedCourseRecommendations = certifiedCourses
    .filter(
      ({ _id: contentId }) =>
        highestHasPrimarySkill ||
        !primarySkillRecommendation ||
        String(contentId) !== String(primarySkillRecommendation._id)
    )
    .splice(0, nCertToReturn)

  const recommendedCourses = [
    highestRelevanceCourse,
    ...certifiedCourseRecommendations,
    ...(!highestHasPrimarySkill && primarySkillRecommendation
      ? [primarySkillRecommendation]
      : [])
  ]

  const isNotInRecommended = ({ _id: contentId }) =>
    !recommendedCourses.some(
      ({ _id: recommendedId }) => String(recommendedId) === String(contentId)
    )

  const freeCoursesLeft = freeCourses.filter(isNotInRecommended)

  freeCoursesLeft.sort(sortByRelevance)

  if (freeCoursesLeft.length > 0) recommendedCourses.push(freeCoursesLeft[0])

  const otherCourses = courses.filter(isNotInRecommended)

  otherCourses.sort(sortByRelevance)
  otherBites.sort(sortByRelevance)

  console.timeEnd('Content processed in')

  return {
    name,
    chartData,
    roleChosen: role ? role.title : 'Your role fit',
    hours,
    recommendedBites: await prepLearningForWebsite(recommendedBites, true),
    otherBites: await prepLearningForWebsite(otherBites.slice(0, 10), true),
    recommendedCourses: await prepLearningForWebsite(recommendedCourses, true),
    otherCourses: await prepLearningForWebsite(otherCourses.slice(0, 10), true)
  }
}

export default fetchResult
