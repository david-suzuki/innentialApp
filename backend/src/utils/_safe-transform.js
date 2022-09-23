import to from 'await-to-js'
import GokuArray from 'goku-array'
import {
  Goal,
  LearningPathTemplate,
  GoalTemplate,
  User,
  DevelopmentPlan,
  Organization,
  LearningContent,
  ContentSources
} from '~/models'
import { sentryCaptureException } from '.'
import checkAvailableSubscription from '../datasources/utils/learning-content/checkAvailableSubscription'

// TRANSFORM FUNCTION WHICH DOESN'T REQUIRE IMPORTING DATASOURCES FOLDER
// FOR SAFE USAGE WITHIN ./models

const setDevelopmentPlan = async ({
  setBy,
  organizationId,
  user,
  content,
  mentors,
  goalId,
  isFirstGoal
}) => {
  const checkStatus = (organization, contentSource, content) => {
    return (
      content.status ||
      ((organization &&
        organization.fulfillment &&
        content.price > 0 &&
        !content.subscriptionAvailable) ||
      (contentSource &&
        contentSource.accountRequired &&
        organization.fulfillment)
        ? 'AWAITING FULFILLMENT'
        : 'NOT STARTED')
    )
  }
  const userData = await User.findById(user)
    .select({ roles: 1 })
    .lean()

  const devPlan = await DevelopmentPlan.findOne({ user, active: true })
    .select({ _id: 1 })
    .lean()

  const organization = await Organization.findById(organizationId)
    .select({ approvals: 1, fulfillment: 1 })
    .lean()

  if (devPlan) {
    let result
    if (goalId) {
      // let status, active

      // const goal = await Goal.findById(goalId)
      //   .select({ status: 1 })
      //   .lean()

      // if (goal && goal.status === 'ACTIVE') {
      //   status = organization && organization.fulfillment ? 'AWAITING FULFILLMENT' : 'NOT STARTED'
      //   active = true
      // } else {
      //   status = 'INACTIVE'
      //   active = false
      // }

      const pullResult = await DevelopmentPlan.findOneAndUpdate(
        { user, active: true },
        {
          $pull: {
            content: {
              goalId
            },
            mentors: {
              goalId
            }
          }
        },
        { new: true, lean: true }
      )

      const { content: existingContent, mentors: existingMentors } = pullResult

      const updatedContent = await Promise.all(
        // await Promise.all(
        content
          .filter(
            ({ contentId }) =>
              !existingContent.some(
                ({ contentId: existingId }) =>
                  String(existingId) === String(contentId)
              )
          )
          .map(
            /* async */ async content => {
              const approved =
                !organization ||
                !organization.approvals ||
                userData.roles.includes('ADMIN') ||
                content.price === 0

              const learningContent = await LearningContent.findById(
                content.contentId
              )
              const contentSource = await ContentSources.findById(
                learningContent.source
              )
              const status = checkStatus(organization, contentSource, content)

              // if (!approved) {
              //   await LearningRequest.requestLearning(
              //     {
              //       contentId: content.contentId,
              //       goalId
              //     },
              //     {
              //       user,
              //       organizationId
              //     }
              //   )
              // }
              return {
                ...content,
                status,
                approved
              }
            }
          )
      )
      // )

      const updatedMentors = mentors
        .filter(
          ({ mentorId }) =>
            !existingMentors.some(
              ({ mentorId: existingId }) =>
                String(existingId) === String(mentorId)
            )
        )
        .map(mentor => ({
          ...mentor,
          active: true
        }))

      const pushResult = await DevelopmentPlan.findOneAndUpdate(
        { user, active: true },
        {
          $push: {
            content: {
              $each: updatedContent
            },
            mentors: {
              $each: updatedMentors
            }
          },
          $set: {
            updatedAt: new Date(),
            ...(isFirstGoal &&
              (!pullResult.selectedGoalId ||
                String(setBy) === String(user)) && { selectedGoalId: goalId })
          }
        },
        { new: true, lean: true }
      )

      if (
        isFirstGoal &&
        (!pullResult.selectedGoalId || String(setBy) === String(user))
      ) {
        await Goal.updateOne({ _id: goalId }, { seen: true })
      }

      const filteredContent = pushResult.content.filter(
        item => String(goalId) === String(item.goalId)
      )

      const filteredMentors = pushResult.mentors.filter(
        item => String(goalId) === String(item.goalId)
      )

      result = {
        ...pushResult,
        content: filteredContent,
        mentors: filteredMentors
      }
    } else {
      const pullResult = await DevelopmentPlan.findOneAndUpdate(
        { user, active: true },
        {
          $pull: {
            content: {
              status: { $ne: 'INACTIVE' }
            },
            mentors: {
              active: true
            }
          }
        },
        { new: true, lean: true }
      )

      const { content: existingContent, mentors: existingMentors } = pullResult

      const updatedContent = await Promise.all(
        content
          .filter(
            ({ contentId }) =>
              !existingContent.some(
                ({ contentId: existingId }) =>
                  String(existingId) === String(contentId)
              )
          )
          .map(
            /* async */ async content => {
              const approved =
                !organization ||
                !organization.approvals ||
                userData.roles.includes('ADMIN') ||
                content.price === 0

              const learningContent = await LearningContent.findById(
                content.contentId
              )
              const contentSource = await ContentSources.findById(
                learningContent.source
              )
              const status = checkStatus(organization, contentSource, content)

              // if (!approved) {
              //   await LearningRequest.requestLearning(
              //     {
              //       contentId: content.contentId,
              //       goalId
              //     },
              //     {
              //       user,
              //       organizationId
              //     }
              //   )
              // }
              return {
                ...content,
                status,
                approved
              }
            }
          )
      )

      const updatedMentors = mentors.filter(
        ({ mentorId }) =>
          !existingMentors.some(
            ({ mentorId: existingId }) =>
              String(existingId) === String(mentorId)
          )
      )

      result = await DevelopmentPlan.findOneAndUpdate(
        { user, active: true },
        {
          $push: {
            content: {
              $each: updatedContent
            },
            mentors: {
              $each: updatedMentors
            }
          },
          $set: {
            updatedAt: new Date()
          }
        },
        { new: true }
      )
    }
    return result
  } else {
    const newPlan = await DevelopmentPlan.create({
      user,
      setBy,
      content: await Promise.all(
        content.map(
          /* async */ async content => {
            const approved =
              !organization ||
              !organization.approvals ||
              userData.roles.includes('ADMIN') ||
              content.price === 0

            const learningContent = await LearningContent.findById(
              content.contentId
            )
            const contentSource = await ContentSources.findById(
              learningContent.source
            )
            const status = checkStatus(organization, contentSource, content)

            // if (!approved) {
            //   await LearningRequest.requestLearning(
            //     {
            //       contentId: content.contentId,
            //       goalId
            //     },
            //     {
            //       user,
            //       organizationId
            //     }
            //   )
            // }
            return {
              ...content,
              status,
              approved
            }
          }
        )
      ),
      mentors,
      organizationId,
      selectedGoalId: goalId
    })

    await Goal.updateOne({ _id: goalId }, { seen: true })

    return newPlan
  }
}

const transformTemplateToGoal = async ({
  userId,
  targetUser,
  forApproval,
  goalTemplate,
  deadline,
  reviewId,
  organization,
  isFirstGoal
}) => {
  const {
    createdAt,
    updatedAt,
    tasks,
    _id,
    measures = [],
    relatedSkills = [],
    content: rawContent = [],
    mentors = [],
    ...goalData
  } = goalTemplate

  const data = {
    ...goalData,
    measures: measures.map(m => ({ measureName: m })),
    setBy: userId,
    user: targetUser,
    status: forApproval ? 'READY FOR REVIEW' : 'ACTIVE',
    relatedSkills,
    organizationId: organization, // use user's organization
    fromTemplate: _id,
    // isPrivate: !forApproval && targetUser === userId,
    deadline,
    reviewId
  }

  // const contentIds = rawContent.map(({ contentId }) => contentId)
  const newGoal = await Goal.create(data)

  if (newGoal) {
    const goalId = newGoal._id
    await setDevelopmentPlan({
      setBy: userId || targetUser,
      user: targetUser,
      organizationId: organization,
      content: (
        await Promise.all(
          rawContent.map(async ({ contentId, note }) => {
            const content = await LearningContent.findById(contentId)
              .select({
                _id: 1,
                type: 1,
                price: 1,
                source: 1,
                udemyCourseId: 1
              })
              .lean()
            if (!content) return null
            return {
              contentId,
              goalId,
              contentType: content.type,
              price: content.price.value,
              note,
              subscriptionAvailable: await checkAvailableSubscription(content, {
                organizationId: organization
              })
              // ...(content.status && { status: content.status })
            }
          })
        )
      ).filter(item => !!item),
      mentors: mentors.map(mentor => ({
        mentorId: mentor._id,
        goalId
      })),
      goalId,
      isFirstGoal
    })
    return newGoal
  }
  return null
}

const transform = async ({ id, organization, userId, targetUser }) => {
  const [err, learningPath] = await to(LearningPathTemplate.findById(id))
  if (!learningPath) throw new Error(`LP not found`)
  if (err) throw new Error(err)
  const allowedToTransform = // user can transform only Innential LP (organization === null) or his own organization LPs
    learningPath.organization === null ||
    organization === learningPath.organization.toString()
  if (!allowedToTransform) throw new Error(`Not allowed to transform`)
  const { goalTemplate: goalTemplates, name } = learningPath

  const existingGoals = await Promise.all(
    goalTemplates.map(async goalId =>
      Goal.findOne({
        user: targetUser,
        fromTemplate: goalId
      })
    )
  )

  if (existingGoals.some(goal => goal !== null)) {
    throw new Error(`already_assigned`)
  }

  // try {
  //   const firstGoal = await GoalTemplate.findById(goalTemplates[0])
  //     .select({ content: 1 })
  //     .lean()

  //   await sendTransformNotifications({
  //     targetUser,
  //     userId,
  //     forApproval,
  //     name,
  //     organizationId: organization,
  //     pathGoals: goalTemplates,
  //     pathId: id,
  //     content: firstGoal.content
  //   })
  // } catch (err) {
  //   sentryCaptureException(err)
  // }

  if (goalTemplates && Array.isArray(goalTemplates) && goalTemplates.length) {
    const templates = new GokuArray(goalTemplates)
    return templates.asyncMap(async (goalId, i) => {
      // const existingGoal = await Goal.findOne({
      //   user: targetUser,
      //   fromTemplate: goalId
      // })
      // if (existingGoal) throw new Error(`already_assigned`)
      const goal = await GoalTemplate.findById(goalId)
      return transformTemplateToGoal({
        goalTemplate: goal._doc || goal,
        userId,
        targetUser,
        organization,
        isFirstGoal: i === 0
      })
    })
  }
  return null
}

export default transform
