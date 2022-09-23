import {
  DevelopmentPlan,
  Goal,
  GoalTemplate,
  User,
  Organization,
  LearningContent,
  ContentSources,
  Subscription,
  LearningPathTemplate
} from '../../models'
import series from 'async/series'

const subscriptionAvailable = async (
  { udemyCourseId, source },
  { _id: organizationId }
) => {
  const availableSubscription = await Subscription.findOne({
    source,
    organizationId,
    active: true
  }).select({ name: 1 })

  if (!availableSubscription) return false

  if (availableSubscription) {
    return availableSubscription.name === 'Udemy for Business'
      ? !!udemyCourseId
      : true
  }
}

const checkStatus = async (organization, contentSource, content) => {
  const status =
    (organization &&
      organization.fulfillment &&
      content.price.value > 0 &&
      !(await subscriptionAvailable(content, organization))) ||
    (contentSource && contentSource.accountRequired && organization.fulfillment)
      ? 'AWAITING FULFILLMENT'
      : 'NOT STARTED'

  return status
}

;(async () => {
  const affectedUsers = []

  let goalCounter = 0

  // FIND ALL GOALS CREATED AFTER 15 OF MARCH (BAD CODE RELEASED)
  const newGoals = await Goal.find({
    fromTemplate: { $ne: null },
    createdAt: { $gt: new Date('2022-03-15') },
    status: 'ACTIVE'
  })
    .select({ _id: 1, user: 1, fromTemplate: 1 })
    .lean()

  // FIND GOALS FROM THE PATHS THAT ARE MISSING IN USERS' ACCOUNTS
  const missingGoals = []

  await Promise.all(
    newGoals.map(async goal => {
      const goalTemplate = await GoalTemplate.findOne({
        _id: goal.fromTemplate
      })
        .select({ _id: 1 })
        .lean()

      const path = await LearningPathTemplate.findOne({
        goalTemplate: goalTemplate._id
      })
        .select({ goalTemplate: 1 })
        .lean()

      const pathGoals = path.goalTemplate

      await Promise.all(
        pathGoals.map(async templateId => {
          const existingGoal = await Goal.findOne({
            fromTemplate: templateId,
            user: goal.user
          })
            .select({ _id: 1 })
            .lean()

          if (!existingGoal) {
            affectedUsers.push(goal.user)
            missingGoals.push({ templateId, user: goal.user })
          }
        })
      )
    })
  )

  // CREATE GOALS IN SERIES TO PREVENT DUPLICATION
  series(
    missingGoals.map(({ templateId, user }) => {
      return async callback => {
        const goalTemplate = await GoalTemplate.findById(templateId).lean()

        const userData = await User.findById(user)
          .select({ organizationId: 1 })
          .lean()

        if (!userData) {
          console.error(`User not found: ${user}`)
          callback(null)
          return
        }

        const {
          createdAt,
          updatedAt,
          tasks,
          _id,
          measures = [],
          relatedSkills = [],
          ...goalData
        } = goalTemplate

        const existingGoal = await Goal.findOne({
          goalName: goalData.goalName,
          user
        })
          .select({ _id: 1 })
          .lean()

        if (existingGoal) {
          console.error(`Found existing goal for ${user}: ${goalData.goalName}`)
          callback(null)
          return
        }

        const data = {
          ...goalData,
          measures: measures.map(m => ({ measureName: m })),
          setBy: user,
          user,
          status: 'ACTIVE',
          relatedSkills,
          organizationId: userData.organizationId, // use user's organization
          fromTemplate: _id
        }

        await Goal.create(data)

        callback(null)
      }
    }),
    async err => {
      if (err) {
        console.error(err)
      } else {
        // IF EVERYTHING IS GOOD, ADD CONTENT TO UPDATED GOALS
        const updatedGoals = await Goal.find({
          fromTemplate: { $ne: null },
          createdAt: { $gt: new Date('2022-03-15') },
          status: 'ACTIVE'
        })
          .select({ _id: 1, user: 1, fromTemplate: 1 })
          .lean()

        await Promise.all(
          updatedGoals.map(async goal => {
            const planWithContent = await DevelopmentPlan.findOne({
              user: goal.user,
              'content.goalId': goal._id
            })
              .select({ _id: 1 })
              .lean()

            if (!planWithContent) {
              // CONTENT IS MISSING FROM GOAL
              affectedUsers.push(goal.user)

              const userData = await User.findById(goal.user)
                .select({ _id: 1, roles: 1, organizationId: 1 })
                .lean()

              if (!userData) return

              const organization = await Organization.findById(
                userData.organizationId
              )
                .select({ _id: 1, approvals: 1, fulfillment: 1 })
                .lean()

              const goalTemplate = await GoalTemplate.findOne({
                _id: goal.fromTemplate
              })
                .select({ content: 1 })
                .lean()

              const updatedContent = await Promise.all(
                goalTemplate.content.map(async ({ contentId, note, order }) => {
                  const content = await LearningContent.findById(contentId)

                  const contentSource = await ContentSources.findById(
                    content.source
                  )

                  if (!contentSource) {
                    console.error(`Content source not found: ${content.source}`)
                  }

                  const approved =
                    !organization ||
                    !organization.approvals ||
                    userData.roles.includes('ADMIN') ||
                    content.price.value === 0

                  return {
                    contentId,
                    note: note || '',
                    status: await checkStatus(
                      organization,
                      contentSource,
                      content
                    ),
                    order: order || null,
                    approved: approved,
                    contentType: content.type,
                    goalId: goal._id
                  }
                })
              )

              if (updatedContent.length === 0) return

              goalCounter++

              await DevelopmentPlan.findOneAndUpdate(
                { user: goal.user },
                {
                  $push: {
                    content: {
                      $each: updatedContent
                    }
                  }
                }
              )
            }
          })
        )

        const usersAffected = await User.find({
          _id: {
            $in: affectedUsers
          },
          email: { $not: /innential.com/ }
        })
          .select({ email: 1 })
          .lean()

        console.log({ usersAffected })
        goalCounter && console.log(`Updated ${goalCounter} goals`)
      }
    }
  )
})()
