import {
  Goal,
  LearningPathTemplate,
  ContentSources,
  LearningContent
} from '~/models'
import { getDownloadLink } from '~/utils'

const getLearningPathProgressForNotification = async ({
  userId,
  selectedGoalId,
  content,
  appLink
}) => {
  if (!userId || !selectedGoalId)
    throw new Error(`Not enough arguments provided`)

  const selectedGoal = await Goal.findById(selectedGoalId)
    .select({ fromTemplate: 1, _id: 1, status: 1, goalName: 1 })
    .lean()

  if (!selectedGoal)
    throw new Error(`Selected goal not found for ID:${selectedGoalId}`)

  const { _id: goalId, fromTemplate, goalName } = selectedGoal

  // GET NEXT STEPS FOR USER
  const goalContent = content.filter(
    ({ goalId: planGoalId }) => String(planGoalId) === String(goalId)
  )

  if (goalContent.length === 0) return null

  const inProgressContent = goalContent.filter(
    ({ status }) => status === 'IN PROGRESS'
  )

  const notStartedContent = goalContent.filter(
    ({ status }) => status !== 'IN PROGRESS' && status !== 'COMPLETED'
  )

  const status = inProgressContent.length > 0 ? 'IN PROGRESS' : 'COMPLETED'

  const nextContent =
    inProgressContent.length > 0 ? inProgressContent[0] : notStartedContent[0]

  if (!nextContent)
    throw new Error(`Next resource not found: ${selectedGoalId}`)

  const item = await LearningContent.findById(nextContent.contentId).lean()

  const {
    _id: contentId,
    title,
    url,
    source,
    type,
    relatedPrimarySkills
  } = item

  const skills = relatedPrimarySkills.map(({ name }) => name)

  const normalisedSource = await ContentSources.findById(source)
    .select({ name: 1 })
    .lean()

  const nextResource = {
    _id: contentId,
    title,
    link: url,
    type,
    source: normalisedSource ? normalisedSource.name : '',
    skills,
    delivery: true,
    appLink
  }

  if (fromTemplate) {
    const path = await LearningPathTemplate.findOne({
      goalTemplate: fromTemplate
    })
      .select({ _id: 1, name: 1, goalTemplate: 1 })
      .lean()

    if (!path)
      throw new Error(`Path not found for template ID: ${fromTemplate}`)

    const pathGoals = await Goal.find({
      fromTemplate: { $in: path.goalTemplate },
      user: userId
    })
      .select({ _id: 1, status: 1 })
      .lean()

    const goals = pathGoals
      .map(goal => {
        const status =
          String(goal._id) === String(goalId)
            ? 'SELECTED' // SELECTED GOAL EXCEPTION
            : goal.status

        const pathIndex = path.goalTemplate.findIndex(
          id => String(id) === String(goal._id)
        )

        return {
          status,
          pathIndex
        }
      })
      .sort((a, b) => b.pathIndex - a.pathIndex)
      .map(({ status }) => status)

    const bannerSrc = await getDownloadLink({
      _id: path._id,
      key: 'learning-paths/banners'
    })

    return {
      activePath: {
        pathId: path._id,
        pathName: path.name,
        imgLink: bannerSrc === null ? null : String(bannerSrc).split('?')[0]
      },
      goals,
      status,
      nextResource
    }
  } else {
    // USER CREATED PATH: CONTAINS ONLY THE SELECTED GOAL
    return {
      activePath: {
        pathName: goalName,
        imgLink: null
      },
      goals: ['SELECTED'],
      status,
      nextResource
    }
  }
}

export default getLearningPathProgressForNotification
