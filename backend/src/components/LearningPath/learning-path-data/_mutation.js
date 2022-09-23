import { isUser, isAdmin, isInnentialAdmin } from '~/directives'
import { User, Organization, Team } from '~/models'
import allSettled from 'promise.allsettled'
import {
  GoalTemplate,
  LearningPathTemplate,
  PathAssignee
} from '../../../models'
import { series } from 'async'
import { sentryCaptureException } from '../../../utils'
import { duplicateImage } from '../../../utils/aws'

export const mutationTypes = `
  type Mutation {
    createLearningPath(input: LearningPathInput!): LearningPath @${isUser}
    createLearningPathAdmin(input: LearningPathInput!): LearningPath @${isInnentialAdmin}
    duplicateLearningPathAdmin(id: ID!): LearningPath @${isInnentialAdmin}
    updateLearningPath(input: LearningPathInput!, updateExisting: Boolean): LearningPath @${isUser}
    updateLearningPathAdmin(input: LearningPathInput!, updateExisting: Boolean): LearningPath @${isInnentialAdmin}
    deleteOrganizationLearningPath(id: ID!): LearningPath @${isUser}
    deleteOrganizationLearningPathByAdmin(id: ID!): LearningPath @${isInnentialAdmin}
    transformLearningPathToGoals(id: ID!, targetUser: ID, forApproval: Boolean): [Goal] @${isUser}
    transformLearningPathToGoalsAdmin(id: ID!, targetUser: ID!): [Goal] @${isInnentialAdmin}
    transformLearningPathMultiple(id: ID!, users: [ID!], deadline: DateTime, addReview: Boolean): [Goal] @${isUser}
    changeLearningPathsStatus(pathIds: [ID!], value: Boolean!): [LearningPath] @${isUser}
    assignLearningPaths(input: AssignLearningPathInput!): LearningPath @${isAdmin}
    assignLearningPathsLeader(input: AssignLearningPathInput!): LearningPath @${isUser}
  }
`

export const mutationResolvers = {
  Mutation: {
    createLearningPath: async (_, args, { dataSources, user }) => {
      const {
        input: { organizationId: organization, ...data }
      } = args || {}
      const { _id: userId = null, organizationId = null } = user || {}
      return dataSources.LearningPath.createOne({
        ...data,
        organization, // PROVIDED AS ARGUMENT
        setByUser: userId,
        ...(organizationId && { organization: organizationId }) // READ FROM CONTEXT (TAKES PRECEDENCE)
      })
    },
    duplicateLearningPathAdmin: async (_, { id }) => {
      const learningPath = await LearningPathTemplate.findById(id)
        .select({ _id: 0 })
        .lean()

      const duplicatedGoalTemplates = await Promise.all(
        learningPath.goalTemplate.map(async goalTemplateId => {
          let goalTemplateObject = await GoalTemplate.findById(goalTemplateId)
            .select({ _id: 0 })
            .lean()
          if (goalTemplateObject) {
            const createdGoalTemplate = await GoalTemplate.create({
              ...goalTemplateObject
            })
            return createdGoalTemplate._id
          }
        })
      )
      const newPath = await LearningPathTemplate.create({
        ...learningPath,
        goalTemplate: duplicatedGoalTemplates,
        name: `${learningPath.name} Duplicate`,
        organization: null,
        active: false,
        team: null,
        publishedDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        author: '',
        setByUser: null
      })
      await duplicateImage({
        oldPathId: id,
        newPathId: newPath._id,
        key: 'learning-paths/banners'
      })
      return newPath
    },
    updateLearningPath: async (_, args, { dataSources, user }) => {
      const { input, updateExisting } = args || {}
      const { _id: userId = null, organizationId = null } = user || {}

      const { id, organizationId: organization, ...data } = input

      await Promise.all(
        input.goalTemplate.map(async goal => {
          await dataSources.GoalTemplate.updateOne({
            filter: { _id: goal.id },
            update: goal
          })
        })
      )
      return dataSources.LearningPath.updateOne({
        filter: {
          _id: id
          // ...(organizationId && { organization: organizationId }) // no organizationId means INNENTIAL_ADMIN
        },
        update: {
          setBy: userId,
          ...data,
          organization, // PROVIDED AS ARGUMENT
          ...(organizationId && { organization: organizationId }) // READ FROM CONTEXT (TAKES PRECEDENCE)
        },
        updateExisting
      })
    },
    createLearningPathAdmin: async (_, args, { dataSources }) => {
      const {
        input: { organizationId: organization, ...data }
      } = args || {}
      return dataSources.LearningPath.createOne({
        ...data,
        organization // PROVIDED AS ARGUMENT
      })
    },
    updateLearningPathAdmin: async (_, args, { dataSources }) => {
      const { input, updateExisting } = args || {}
      const { id, organizationId: organization, ...data } = input
      return dataSources.LearningPath.updateOne({
        filter: {
          _id: id
          // ...(organizationId && { organization: organizationId }) // no organizationId means INNENTIAL_ADMIN
        },
        update: {
          ...data,
          organization // PROVIDED AS ARGUMENT
        },
        updateExisting
      })
    },
    deleteOrganizationLearningPath: async (_, args, { user, dataSources }) => {
      const { id } = args || {}
      const { organizationId } = user || {}
      return dataSources.LearningPath.remove({
        id,
        organization: organizationId
      })
    },
    deleteOrganizationLearningPathByAdmin: async (_, args, { dataSources }) => {
      const { id } = args || {}
      if (!id) return null
      return dataSources.LearningPath.remove({
        id
      })
    },
    transformLearningPathToGoals: async (_, args, { dataSources, user }) => {
      const { id, targetUser, forApproval } = args || {}
      if (!id) return null
      const { organizationId, _id: userId } = user
      return dataSources.LearningPath.transform({
        organization: organizationId,
        userId,
        id,
        targetUser: targetUser || userId,
        forApproval
      })
    },
    transformLearningPathToGoalsAdmin: async (_, args, { dataSources }) => {
      const { id, targetUser } = args || {}
      if (!id || !targetUser) return null
      const targetUserData = await User.findById(targetUser)
        .select({ organizationId: 1 })
        .lean()
      if (!targetUserData) return null
      return dataSources.LearningPath.transform({
        organization: targetUserData.organizationId,
        userId: null,
        id,
        targetUser: targetUser,
        forApproval: false
      })
    },
    transformLearningPathMultiple: async (_, args, { dataSources, user }) => {
      const { id, users = [], deadline, addReview } = args || {}
      if (!id || users.length === 0) return null
      const { organizationId, _id: userId } = user

      let reviewId
      if (addReview && deadline) {
        const learningPath = await dataSources.LearningPath.findById(id)

        const review = await dataSources.Review.createOne(
          {
            name: `Progress review for learning path: ${learningPath.name}`,
            goalType: 'PERSONAL',
            scopeType: 'PERSONAL',
            specificScopes: [],
            specificUsers: users,
            reviewers: 'SPECIFIC',
            specificReviewers: [userId],
            firstReviewStart: deadline,
            organizationId,
            oneTimeReview: true,
            progressCheckFrequency: {
              repeatCount: 0
            },
            reviewFrequency: {
              repeatCount: 3,
              repeatInterval: 'MONTH'
            },
            createdBy: userId,
            leadersReview: false
          },
          { user: userId }
        )

        reviewId = review._id
      }

      const goalArrays = allSettled(
        users.map(targetUser =>
          dataSources.LearningPath.transform({
            organization: organizationId,
            userId,
            id,
            targetUser,
            forApproval: false,
            deadline,
            reviewId
          })
        )
      )
      return goalArrays.reduce((acc, curr) => {
        if (curr.status === 'fulfilled') return [...acc, ...curr.value]
        return acc
      }, [])
    },
    changeLearningPathsStatus: async (
      _,
      { pathIds, value },
      { dataSources }
    ) => {
      return dataSources.LearningPath.changePublishedStatus({
        pathIds,
        value
      })
    },
    assignLearningPaths: async (_, args, { dataSources, user }) => {
      const {
        input: { everyone, autoassign, teams, users, pathId }
      } = args || { input: {} }

      const existingAssignee = await PathAssignee.findOneAndUpdate(
        { pathId, organizationId: user.organizationId },
        {
          $set: {
            everyone,
            autoassign,
            teams,
            users,
            updatedAt: new Date()
          }
        },
        { lean: true }
      )

      if (!existingAssignee) {
        await PathAssignee.create({
          pathId,
          organizationId: user.organizationId,
          autoassign,
          everyone,
          teams,
          users
        })
      }

      const path = await LearningPathTemplate.findById(pathId).lean()

      if (everyone) {
        const allUsersInOrganization = await User.find({
          organizationId: user.organizationId
        })
          .select({ _id: 1 })
          .lean()

        series(
          allUsersInOrganization.map(targetUser => {
            return async callback => {
              dataSources.LearningPath.transform({
                organization: user.organizationId,
                userId: user._id,
                id: pathId,
                targetUser: targetUser._id
              })
              setTimeout(() => callback(null), 200)
            }
          })
        )

        await Organization.findOneAndUpdate(
          { _id: user.organizationId },
          {
            ...(autoassign
              ? {
                  $addToSet: {
                    autoassignedPaths: pathId
                  }
                }
              : {
                  $pull: {
                    autoassignedPaths: pathId
                  }
                })
          }
        )
      } else {
        if (teams.length > 0) {
          await Promise.all(
            teams.map(async item => {
              const team = await Team.findById(item.teamId)

              if (!team) throw new Error(`Team: ${item.teamId} not found`)

              const allUsersInTeam = [team.leader, ...team.members]

              allSettled(
                await allUsersInTeam.reduce(async (arr, targetUser) => {
                  try {
                    await arr
                    return [
                      ...(await arr),
                      await dataSources.LearningPath.transform({
                        organization: user.organizationId,
                        userId: user._id,
                        id: pathId,
                        targetUser
                      })
                    ]
                  } catch (e) {
                    sentryCaptureException(new Error(`Error : ${e}`))
                  }
                }, [])
              )

              await Team.findOneAndUpdate(
                { _id: team._id },
                {
                  ...(item.autoassign
                    ? {
                        $addToSet: {
                          autoassignedPaths: pathId
                        }
                      }
                    : {
                        $pull: {
                          autoassignedPaths: pathId
                        }
                      })
                }
              )
            })
          )
        }

        allSettled(
          await users.reduce(async (arr, targetUser) => {
            try {
              await arr
              return [
                ...(await arr),
                await dataSources.LearningPath.transform({
                  organization: user.organizationId,
                  userId: user._id,
                  id: pathId,
                  targetUser
                })
              ]
            } catch (e) {
              sentryCaptureException(new Error(`Error : ${e}`))
            }
          }, [])
        )
      }

      return path
    },
    assignLearningPathsLeader: async (_, args, { dataSources, user }) => {
      const {
        input: { teams, users, pathId }
      } = args || { input: {} }

      const existingAssignee = await PathAssignee.findOneAndUpdate(
        { pathId, organizationId: user.organizationId },
        {
          $pull: {
            teams: {
              teamId: { $in: teams.map(({ teamId }) => teamId) }
            }
          }
        },
        { lean: true }
      )

      if (!existingAssignee) {
        await PathAssignee.create({
          pathId,
          organizationId: user.organizationId,
          teams,
          users
        })
      } else {
        await PathAssignee.findOneAndUpdate(
          { _id: existingAssignee._id },
          {
            $addToSet: {
              teams,
              users
            }
          }
        )
      }

      const path = await LearningPathTemplate.findById(pathId).lean()

      if (teams.length > 0) {
        await Promise.all(
          teams.map(async item => {
            const team = await Team.findById(item.teamId)

            if (!team) throw new Error(`Team: ${item.teamId} not found`)

            const allUsersInTeam = [team.leader, ...team.members]

            allSettled(
              await allUsersInTeam.reduce(async (arr, targetUser) => {
                try {
                  await arr
                  return [
                    ...(await arr),
                    await dataSources.LearningPath.transform({
                      organization: user.organizationId,
                      userId: user._id,
                      id: pathId,
                      targetUser
                    })
                  ]
                } catch (e) {
                  sentryCaptureException(new Error(`Error : ${e}`))
                }
              }, [])
            )

            await Team.findOneAndUpdate(
              { _id: team._id },
              {
                ...(item.autoassign
                  ? {
                      $addToSet: {
                        autoassignedPaths: pathId
                      }
                    }
                  : {
                      $pull: {
                        autoassignedPaths: pathId
                      }
                    })
              }
            )
          })
        )
      }

      allSettled(
        await users.reduce(async (arr, targetUser) => {
          try {
            await arr
            return [
              ...(await arr),
              dataSources.LearningPath.transform({
                organization: user.organizationId,
                userId: user._id,
                id: pathId,
                targetUser
              })
            ]
          } catch (e) {
            sentryCaptureException(new Error(`Error : ${e}`))
          }
        }, [])
      )

      return path
    }
  }
}
