import {
  DevelopmentPlan,
  Goal,
  Organization,
  UserContentInteractions,
  ContentSources
} from '~/models'
import { isUser } from '~/directives'
import { sentryCaptureException } from '~/utils'

export const mutationTypes = `
  type Mutation {
    setDevelopmentPlan(inputData: DevelopmentPlanInput!): Goal @${isUser}
    setContentStatus(status: String!, contentId: ID!): Goal @${isUser}
    changeGoalPreferences(selectedGoalId: ID, pathId: ID): ID @${isUser}
    addContentToActiveGoal(contentId: ID!, contentType: String, price: Float, goalId: ID!, subscriptionAvailable: Boolean): Goal @${isUser}
    removeItemFromDevPlan(contentId: ID!): Goal @${isUser}
    moveToSavedForLater(contentId: ID!): Goal @${isUser}
  }
`

const pullContentFromDevPlan = async ({ contentId, user }) => {
  const result = await DevelopmentPlan.findOneAndUpdate(
    { user },
    {
      $pull: {
        content: {
          contentId
        }
      }
    }
  )
  const removed = result.content.find(
    ({ contentId: inPlan }) => String(contentId) === String(inPlan)
  )
  return removed ? Goal.findById(removed.goalId) : null
}

export const mutationResolvers = {
  Mutation: {
    setDevelopmentPlan: async (
      _,
      { inputData: { user, content, mentors, goalId } },
      { user: { _id: setBy, organizationId, roles }, dataSources }
    ) => {
      const checkStatus = (organization, contentSource, content) => {
        return (
          content.status ||
          ((organization &&
            organization.fulfillment &&
            content.price > 0 &&
            !content.subscriptionAvailable) ||
          (contentSource.accountRequired && organization.fulfillment)
            ? 'AWAITING FULFILLMENT'
            : 'NOT STARTED')
        )
      }
      const devPlan = await DevelopmentPlan.findOne({ user, active: true })
        .select({ _id: 1 })
        .lean()

      const goal = await Goal.findById(goalId)
        // .select({ status: 1 })
        .lean()

      const organization = await Organization.findById(organizationId)
        .select({ approvals: 1, fulfillment: 1 })
        .lean()

      if (devPlan) {
        if (goal) {
          // let status, active

          // if (goal && goal.status === 'DRAFT') {
          //   // status = 'NOT STARTED'
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
            { lean: true }
          )

          const { content: existingContent } = pullResult

          const updatedContent = await Promise.all(
            content.map(async content => {
              const approved =
                !organization ||
                !organization.approvals ||
                !!content.approved ||
                roles.includes('ADMIN') ||
                content.price === 0

              const learningContent = await dataSources.LearningContent.findById(
                content.contentId
              )
              const contentSource = await ContentSources.findById(
                learningContent.source
              )

              const status = checkStatus(organization, contentSource, content)

              return {
                ...content,
                status,
                approved
              }
            })
          )

          const removedContent = existingContent.filter(
            ({ contentId }) =>
              !updatedContent.some(
                ({ contentId: existingId }) =>
                  String(existingId) === String(contentId)
              )
          )

          try {
            await dataSources.LearningRequest.cancelMany(removedContent, user)
          } catch (err) {
            sentryCaptureException(`Failed to cancel requests: ${err.message}`)
          }

          // const updatedMentors = mentors.filter(
          //   ({ mentorId }) =>
          //     !existingMentors.some(
          //       ({ mentorId: existingId }) =>
          //         String(existingId) === String(mentorId)
          //     )
          // )
          // .map(mentor => ({
          //   ...mentor,
          //   active
          // }))

          await DevelopmentPlan.findOneAndUpdate(
            { user, active: true },
            {
              $push: {
                content: {
                  $each: updatedContent
                },
                mentors: {
                  $each: mentors
                }
              },
              $set: {
                updatedAt: new Date()
              }
            },
            { new: true, lean: true }
          )

          if (updatedContent.every(({ status }) => status === 'COMPLETED')) {
            // COMPLETING GOAL WHEN ALL OTHER ITEMS ARE COMPLETED
            const result = await Goal.findOneAndUpdate(
              { _id: goalId },
              {
                $set: {
                  status: 'PAST'
                }
              },
              { new: true }
            )

            const devPlanGoalFilter = await DevelopmentPlan.findOne({
              user,
              selectedGoalId: goalId
            })
              .select({ _id: 1 })
              .lean()

            if (devPlanGoalFilter) {
              const newGoalId = await dataSources.Goal.fetchNextGoalId(result)
              await DevelopmentPlan.findOneAndUpdate(
                { user },
                {
                  $set: {
                    selectedGoalId: newGoalId
                  }
                }
              )

              await Goal.updateOne({ _id: newGoalId }, { seen: true })
            }
            return result
          }

          return goal
        } else {
          return null
        }
        //   const pullResult = await DevelopmentPlan.findOneAndUpdate(
        //     { user, active: true },
        //     {
        //       $pull: {
        //         content: {
        //           status: { $ne: 'INACTIVE' }
        //         },
        //         mentors: {
        //           active: true
        //         }
        //       }
        //     },
        //     { new: true, lean: true }
        //   )

        //   const {
        //     content: existingContent,
        //     mentors: existingMentors
        //   } = pullResult

        //   const updatedContent = content.filter(
        //     ({ contentId }) =>
        //       !existingContent.some(
        //         ({ contentId: existingId }) =>
        //           String(existingId) === String(contentId)
        //       )
        //   )

        //   const updatedMentors = mentors.filter(
        //     ({ mentorId }) =>
        //       !existingMentors.some(
        //         ({ mentorId: existingId }) =>
        //           String(existingId) === String(mentorId)
        //       )
        //   )

        //   result = await DevelopmentPlan.findOneAndUpdate(
        //     { user, active: true },
        //     {
        //       $push: {
        //         content: {
        //           $each: updatedContent
        //         },
        //         mentors: {
        //           $each: updatedMentors
        //         }
        //       },
        //       $set: {
        //         updatedAt: new Date()
        //       }
        //     },
        //     { new: true }
        //   )
        // }
        // return result
      } else {
        await DevelopmentPlan.create({
          user,
          setBy,
          content: await Promise.all(
            content.map(async content => {
              const approved =
                !organization ||
                !organization.approvals ||
                roles.includes('ADMIN') ||
                content.price === 0
              const learningContent = await dataSources.LearningContent.findById(
                content.contentId
              )
              const contentSource = await ContentSources.findById(
                learningContent.source
              )
              const status = checkStatus(organization, contentSource, content)

              return {
                ...content,
                status,
                approved
              }
            })
          ),
          mentors,
          organizationId
        })
        return goal
      }
    },
    setContentStatus: async (
      _,
      { status, contentId },
      { user: { _id: user } }
    ) => {
      let update = {
        'content.$.status': status
      }

      // MODIFY START/END DATE VALUES
      switch (status) {
        case 'IN PROGRESS':
          update['content.$.endDate'] = null
          update['content.$.startDate'] = new Date()
          break
        case 'COMPLETED':
          update['content.$.endDate'] = new Date()
          break
        default:
          update['content.$.startDate'] = null
          break
      }

      try {
        const result = await DevelopmentPlan.findOneAndUpdate(
          { user, 'content.contentId': contentId },
          {
            $set: {
              ...update
            }
          },
          { new: true, lean: true }
        )
        if (result) {
          const { content = [] } = result
          const item = content.find(
            ({ contentId: inPlan }) => String(inPlan) === contentId
          )
          if (item) {
            return Goal.findById(item.goalId)
          }
          return null
        }
      } catch (e) {
        sentryCaptureException(e)
        return null
      }
    },
    changeGoalPreferences: async (
      _,
      { selectedGoalId, pathId },
      { user: { _id: user }, dataSources }
    ) => {
      try {
        let goalId = selectedGoalId

        if (pathId) {
          const nextGoalIDInPath = await dataSources.Goal.getNextGoalInPath(
            pathId,
            user
          )
          if (nextGoalIDInPath) goalId = nextGoalIDInPath
        }

        if (!goalId) throw new Error(`Goal not found for path ID: ${pathId}`)

        const result = await DevelopmentPlan.findOneAndUpdate(
          { user },
          {
            $set: {
              selectedGoalId: goalId
            }
          },
          { new: true, lean: true }
        )

        await Goal.updateOne({ _id: goalId }, { seen: true })

        return result.selectedGoalId
      } catch (e) {
        sentryCaptureException(e)
        return null
      }
    },
    addContentToActiveGoal: async (
      _,
      {
        contentId,
        contentType,
        price,
        goalId,
        subscriptionAvailable,
        status: contentStatus
      },
      { user: { _id: user, roles, organizationId }, dataSources }
    ) => {
      const checkStatus = (organization, contentSource, content) => {
        return (
          content.status ||
          ((organization &&
            organization.fulfillment &&
            content.price > 0 &&
            !content.subscriptionAvailable) ||
          (contentSource.accountRequired && organization.fulfillment)
            ? 'AWAITING FULFILLMENT'
            : 'NOT STARTED')
        )
      }
      try {
        const goal = await Goal.findOne({
          _id: goalId,
          status: 'ACTIVE'
        }).lean()

        if (!goal) {
          sentryCaptureException(`Active goal not found for user:${user}`)
          return null
        }

        const organization = await Organization.findById(organizationId)
          .select({ approvals: 1, fulfillment: 1 })
          .lean()

        const approved =
          !organization ||
          !organization.approvals ||
          price === 0 ||
          roles.includes('ADMIN')
        const learningContent = await dataSources.LearningContent.findById(
          contentId
        )
        const contentSource = await ContentSources.findById(
          learningContent.source
        )

        const status = checkStatus(organization, contentSource, {
          price,
          subscriptionAvailable,
          contentStatus
        })

        // if (!approved) {
        //   await dataSources.LearningRequest.requestLearning(
        //     {
        //       contentId,
        //       goalId
        //     },
        //     {
        //       user,
        //       organizationId
        //     }
        //   )
        // }

        await DevelopmentPlan.findOneAndUpdate(
          { user },
          {
            $push: {
              content: {
                contentId,
                contentType,
                goalId,
                status,
                approved
              }
            }
          }
          // },
          // { new: true, lean: true }
        )

        return goal
      } catch (e) {
        sentryCaptureException(e)
        return null
      }
    },
    removeItemFromDevPlan: async (
      _,
      { contentId },
      { user: { _id: user } }
    ) => {
      return pullContentFromDevPlan({ contentId, user })
    },
    moveToSavedForLater: async (_, { contentId }, { user: { _id: user } }) => {
      await UserContentInteractions.findOneAndUpdate(
        { user },
        {
          $addToSet: {
            likedContent: contentId
          }
        }
      )
      return pullContentFromDevPlan({ contentId, user })
    }
  }
}
