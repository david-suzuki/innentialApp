import {
  User,
  Team,
  UserEvaluation,
  UserProfile,
  Skills,
  Organization,
  UserContentInteractions
} from '~/models'
import { isUser } from '~/directives'
import {
  appUrls,
  sendEmail,
  feedbackRequestNotification,
  feedbackNotification,
  teamFeedbackNotification,
  sentryCaptureException
} from '~/utils'
import cryptoRandomString from 'crypto-random-string'
import { Types } from 'mongoose'

export const mutationTypes = `
  type Mutation {
    generateUserFeedbackLinks: User @${isUser}
    generateTeamFeedbackLinks(teamId: ID): Team @${isUser}
    generateExternalFeedbackLink: String @${isUser}
    generateExternalTeamFeedbackLink(teamId: ID): String @${isUser}
    requestUserFeedback(userId: ID!, teamId: ID): [FeedbackRequest] @${isUser}
    setUsersEvaluation(inputData: UserEvaluationInput!): User @${isUser}
    publicSetUsersEvaluation(feedbackData: UserEvaluationInput!, personalData: UserRegisterInput!): Boolean
    addLearningItemFeedback(value: Int, interesting: Boolean, contentId: ID!): Boolean
  }
`
const appLink = `${appUrls['user']}`

export const mutationResolvers = {
  Mutation: {
    generateUserFeedbackLinks: async (_, args, { user: { _id } }) => {
      // INTERNAL KEY
      const feedbackShareKey = (
        Number(_id.replace(/[^0-9]/g, '')) +
        Math.floor(4665645832 * Math.random())
      )
        .toString(36)
        .slice(-9)

      // EXTERNAL KEY
      const token = cryptoRandomString({
        length: 32,
        type: 'url-safe'
      })

      return User.findOneAndUpdate(
        { _id },
        {
          $set: {
            feedbackShareKey,
            externalFeedback: {
              token,
              active: true
            }
          }
        },
        { new: true }
      )
    },
    generateTeamFeedbackLinks: async (_, { teamId }) => {
      // INTERNAL KEY
      const feedbackShareKey = (
        Number(teamId.replace(/[^0-9]/g, '')) +
        Math.floor(4665645832 * Math.random())
      )
        .toString(36)
        .slice(-9)

      // EXTERNAL KEY
      const token = cryptoRandomString({
        length: 32,
        type: 'url-safe'
      })

      return Team.findOneAndUpdate(
        { _id: teamId },
        {
          $set: {
            feedbackShareKey,
            externalFeedback: {
              token,
              active: true
            }
          }
        },
        { new: true }
      )
    },
    // generateExternalFeedbackLink: async (_, args, { user: { _id } }) => {
    //   const token = cryptoRandomString({
    //     length: 32,
    //     type: 'url-safe'
    //   })
    //   await User.findOneAndUpdate(
    //     { _id },
    //     {
    //       $set: {
    //         externalFeedback: {
    //           token,
    //           active: true
    //         }
    //       }
    //     }
    //   )
    //   return `${appLink}/public-feedback?token=${token}`
    // },
    // generateExternalTeamFeedbackLink: async (_, { teamId }) => {
    //   const token = cryptoRandomString({
    //     length: 32,
    //     type: 'url-safe'
    //   })
    //   await Team.findOneAndUpdate(
    //     { _id: teamId },
    //     {
    //       $set: {
    //         externalFeedback: {
    //           token,
    //           active: true
    //         }
    //       }
    //     }
    //   )
    //   return `${appLink}/public-feedback?token=${token}`
    // },
    requestUserFeedback: async (
      _,
      { userId, teamId },
      { user: { _id: currentUserId } }
    ) => {
      const user = teamId || currentUserId

      const requestingUser = await User.findById(currentUserId)
        .select({ feedbackShareKey: 1, firstName: 1, lastName: 1 })
        .lean()
      const requestingForTeam = await Team.findById(teamId)
        .select({ teamName: 1, feedbackShareKey: 1 })
        .lean()
      const requestedUser = await User.findById(userId)
        .select({ firstName: 1, lastName: 1, email: 1 })
        .lean()

      if (requestedUser && requestingUser) {
        const { firstName: name, email } = requestedUser
        const feedbackShareKey = requestingForTeam
          ? requestingForTeam.feedbackShareKey
          : requestingUser.feedbackShareKey
        const { firstName, lastName } = requestingUser
        const appLink = `${appUrls['user']}`
        appLink &&
          (await sendEmail(
            email,
            `${firstName} just sent you a feedback request${
              requestingForTeam ? ' for their team' : ''
            }!`,
            feedbackRequestNotification({
              name,
              from: {
                firstName,
                lastName
              },
              ...(requestingForTeam && {
                teamName: requestingForTeam.teamName
              }),
              appLink,
              feedbackShareKey
            })
          ))
        const evaluationInfo = await UserEvaluation.findOneAndUpdate(
          { user, 'requests.userId': { $ne: userId } },
          {
            $push: {
              requests: {
                userId
              }
            }
          },
          { new: true }
        )
        let requests = []
        if (!evaluationInfo) {
          const existingEvaluation = await UserEvaluation.findOne({
            user
          })
          if (!existingEvaluation) {
            const created = await UserEvaluation.create({
              user,
              requests: [
                {
                  userId
                }
              ]
            })
            requests = created.requests
          } else {
            requests = existingEvaluation.requests
          }
        } else {
          requests = evaluationInfo.requests
        }
        return requests.reverse()
      }
      return []
    },
    setUsersEvaluation: async (
      _,
      { inputData: { userId, skills, recommendedSkills = [], feedback } },
      { user: { _id: evaluatedBy, organizationId }, dataSources }
    ) => {
      try {
        const updatedSkills = skills.map(
          ({ skillId, evaluatedLevel: level }) => {
            return {
              skillId,
              feedback: [
                {
                  evaluatedBy,
                  level
                }
              ]
            }
          }
        )

        const user = await User.findById(userId)
          .select({ firstName: 1, email: 1, status: 1 })
          .lean()

        let usersProfile = await UserProfile.findOne({ user: userId }).lean()
        if (user && !usersProfile) {
          usersProfile = await dataSources.UserProfile.createOne({
            user: userId,
            organizationId
          })
        }

        const selectedWorkSkills =
          (usersProfile && usersProfile.selectedWorkSkills) || []

        const skillsToAddToUser = []
        await Promise.all(
          recommendedSkills.map(async ({ skillId, evaluatedLevel }) => {
            const s = await Skills.findById(skillId).lean()
            if (!s)
              throw new Error(
                `Invalid skill id passed for recommended skills ${skillId}`
              )

            const sa = selectedWorkSkills.find(({ _id }) => {
              if (String(_id) === String(s._id)) return true
            })

            if (!sa)
              skillsToAddToUser.push({
                _id: s._id,
                slug: s.slug,
                level: 0
              })

            return {
              skillId,
              recommendedBy: evaluatedBy,
              recommendedLevel: evaluatedLevel
            }
          })
        )

        await UserProfile.findOneAndUpdate(
          { user: userId },
          {
            $push: {
              selectedWorkSkills: { $each: skillsToAddToUser }
            }
          }
        )

        const newFeedback = [
          {
            evaluatedBy,
            evaluatedAt: new Date(),
            content: feedback,
            skillFeedback: skills.map(({ skillId, evaluatedLevel: level }) => ({
              skillId,
              level
            }))
          }
        ]

        const previousEvaluation = await UserEvaluation.findOne({
          user: userId
        }).lean()

        if (previousEvaluation) {
          // REMOVE FEEDBACK REQUEST
          await UserEvaluation.findOneAndUpdate(
            { user: userId, 'requests.userId': evaluatedBy },
            {
              $pull: {
                requests: { userId: evaluatedBy }
              }
            }
          )

          const { skillsFeedback } = previousEvaluation

          if (skillsFeedback && skillsFeedback.length > 0) {
            const newSkillsFeedback = skillsFeedback.map(
              ({ _id, skillId, feedback, snapshots }) => {
                const updatedSkill = updatedSkills.find(
                  ({ skillId: updatedId }) =>
                    String(updatedId) === String(skillId)
                )
                if (updatedSkill) {
                  const evaluatorInFeedbackIx = feedback.findIndex(
                    ({ evaluatedBy: previous }) =>
                      String(previous) === String(evaluatedBy)
                  )
                  if (evaluatorInFeedbackIx !== -1) {
                    feedback[evaluatorInFeedbackIx].level =
                      updatedSkill.feedback[0].level
                  } else {
                    feedback = [...feedback, updatedSkill.feedback[0]]
                  }
                }
                return {
                  _id,
                  skillId,
                  feedback,
                  snapshots
                }
              }
            )

            updatedSkills.forEach(sk => {
              if (
                !skillsFeedback.find(
                  skf => String(skf.skillId) === String(sk.skillId)
                )
              )
                newSkillsFeedback.push(sk)
            })

            await UserEvaluation.findOneAndUpdate(
              { user: userId },
              {
                $set: {
                  skillsFeedback: newSkillsFeedback
                },
                $push: {
                  feedback: {
                    $each: newFeedback
                  }
                }
              }
            )
          } else {
            await UserEvaluation.findOneAndUpdate(
              { user: userId },
              {
                $set: {
                  skillsFeedback: updatedSkills
                },
                $push: {
                  feedback: {
                    $each: newFeedback
                  }
                }
              }
            )
          }
        } else {
          await UserEvaluation.create({
            user: userId,
            skillsFeedback: updatedSkills,
            feedback: newFeedback
          })
        }

        const evaluatingUser = await User.findById(evaluatedBy)
          // .select({ firstName: 1, lastName: 1 })
          .lean()
        const organization = await Organization.findById(organizationId)
          .select({ feedbackVisible: 1 })
          .lean()

        const feedbackVisible = organization && organization.feedbackVisible

        const appLink = `${appUrls['user']}`

        if (user) {
          if (user.status === 'active' && appLink)
            await sendEmail(
              user.email,
              `${
                feedbackVisible ? evaluatingUser.firstName : 'Someone'
              } just gave you feedback!`,
              feedbackNotification({
                name: user.firstName,
                from: feedbackVisible
                  ? `${evaluatingUser.firstName} ${evaluatingUser.lastName}`
                  : null,
                userId,
                appLink,
                feedback
              })
            )
        } else {
          const team = await Team.findById(userId)
            .select({ leader: 1, teamName: 1 })
            .lean()

          if (team) {
            const leader = await User.findOne({
              _id: team.leader,
              status: 'active'
            })
              .select({ firstName: 1, email: 1 })
              .lean()

            if (leader && String(team.leader) !== String(evaluatedBy))
              await sendEmail(
                leader.email,
                `${
                  feedbackVisible ? evaluatingUser.firstName : 'Someone'
                } just gave feedback to your team!`,
                teamFeedbackNotification({
                  name: leader.firstName,
                  teamName: team.teamName,
                  teamId: userId,
                  from: feedbackVisible
                    ? `${evaluatingUser.firstName} ${evaluatingUser.lastName}`
                    : null,
                  appLink,
                  feedback
                })
              )
          }
        }

        return evaluatingUser
      } catch (e) {
        sentryCaptureException(e)
        return null
      }
    },
    publicSetUsersEvaluation: async (
      _,
      {
        feedbackData: { userId, skills, recommendedSkills = [], feedback },
        personalData
      },
      { dataSources }
    ) => {
      try {
        const updatedSkills = skills.map(
          ({ skillId, evaluatedLevel: level }) => {
            return {
              skillId,
              feedback: [
                {
                  external: {
                    ...personalData,
                    _id: new Types.ObjectId()
                  },
                  level
                }
              ]
            }
          }
        )

        const user = await User.findById(userId)
          .select({ firstName: 1, email: 1, status: 1, organizationId: 1 })
          .lean()

        let usersProfile = await UserProfile.findOne({ user: userId }).lean()
        if (user && !usersProfile) {
          usersProfile = await dataSources.UserProfile.createOne({
            user: userId,
            organizationId: user.organizationId
          })
        }

        const selectedWorkSkills =
          (usersProfile && usersProfile.selectedWorkSkills) || []

        const skillsToAddToUser = []
        await Promise.all(
          recommendedSkills.map(async ({ skillId }) => {
            const s = await Skills.findById(skillId).lean()
            if (!s)
              throw new Error(
                `Invalid skill id passed for recommended skills ${skillId}`
              )

            const sa = selectedWorkSkills.find(
              ({ _id }) => String(_id) === String(s._id)
            )

            if (!sa)
              skillsToAddToUser.push({
                _id: s._id,
                slug: s.slug,
                level: 0
              })

            // return {
            //   skillId,
            //   recommendedBy: evaluatedBy,
            //   recommendedLevel: evaluatedLevel
            // }
          })
        )

        await UserProfile.findOneAndUpdate(
          { user: userId },
          {
            $push: {
              selectedWorkSkills: { $each: skillsToAddToUser }
            }
          }
        )

        const newFeedback = [
          {
            external: {
              ...personalData,
              _id: new Types.ObjectId()
            },
            evaluatedAt: new Date(),
            content: feedback,
            skillFeedback: skills.map(({ skillId, evaluatedLevel: level }) => ({
              skillId,
              level
            }))
          }
        ]

        const previousEvaluation = await UserEvaluation.findOne({
          user: userId
        }).lean()

        if (previousEvaluation) {
          const { skillsFeedback } = previousEvaluation

          if (skillsFeedback && skillsFeedback.length > 0) {
            const newSkillsFeedback = skillsFeedback.map(
              ({ _id, skillId, feedback, snapshots }) => {
                const updatedSkill = updatedSkills.find(
                  ({ skillId: updatedId }) =>
                    String(updatedId) === String(skillId)
                )
                if (updatedSkill) {
                  // const evaluatorInFeedbackIx = feedback.findIndex(
                  //   ({ evaluatedBy: previous }) =>
                  //     String(previous) === String(evaluatedBy)
                  // )
                  // if (evaluatorInFeedbackIx !== -1) {
                  //   feedback[evaluatorInFeedbackIx].level =
                  //     updatedSkill.feedback[0].level
                  // } else {
                  feedback = [...feedback, updatedSkill.feedback[0]]
                  // }
                }
                return {
                  _id,
                  skillId,
                  feedback,
                  snapshots
                }
              }
            )

            updatedSkills.forEach(sk => {
              if (
                !skillsFeedback.find(
                  skf => String(skf.skillId) === String(sk.skillId)
                )
              )
                newSkillsFeedback.push(sk)
            })

            await UserEvaluation.findOneAndUpdate(
              { user: userId },
              {
                $set: {
                  skillsFeedback: newSkillsFeedback
                },
                $push: {
                  feedback: {
                    $each: newFeedback
                  }
                }
              }
            )
          } else {
            await UserEvaluation.findOneAndUpdate(
              { user: userId },
              {
                $set: {
                  skillsFeedback: updatedSkills
                },
                $push: {
                  feedback: {
                    $each: newFeedback
                  }
                }
              }
            )
          }
        } else {
          await UserEvaluation.create({
            user: userId,
            skillsFeedback: updatedSkills,
            feedback: newFeedback
          })
        }

        // const evaluatingUser = await User.findById(evaluatedBy)
        //   // .select({ firstName: 1, lastName: 1 })
        //   .lean()
        const organization = await Organization.findById(user.organizationId)
          .select({ feedbackVisible: 1 })
          .lean()

        const feedbackVisible = organization && organization.feedbackVisible

        const appLink = `${appUrls['user']}`

        if (user) {
          if (user.status === 'active' && appLink)
            await sendEmail(
              user.email,
              `${
                feedbackVisible ? personalData.firstName : 'Someone'
              } just gave you feedback!`,
              feedbackNotification({
                name: user.firstName,
                from: feedbackVisible
                  ? `${personalData.firstName} ${personalData.lastName} (${personalData.email})`
                  : null,
                userId,
                appLink,
                feedback
              })
            )
        } else {
          const team = await Team.findById(userId)
            .select({ leader: 1, teamName: 1 })
            .lean()

          if (team) {
            const leader = await User.findOne({
              _id: team.leader,
              status: 'active'
            })
              .select({ firstName: 1, email: 1 })
              .lean()

            // if (leader && String(team.leader) !== String(evaluatedBy))
            await sendEmail(
              leader.email,
              `${
                feedbackVisible ? personalData.firstName : 'Someone'
              } just gave feedback to your team!`,
              teamFeedbackNotification({
                name: leader.firstName,
                teamName: team.teamName,
                teamId: userId,
                from: feedbackVisible
                  ? `${personalData.firstName} ${personalData.lastName} (${personalData.email})`
                  : null,
                appLink,
                feedback
              })
            )
          }
        }

        return false
      } catch (e) {
        sentryCaptureException(e)
        return true
      }
    },
    addLearningItemFeedback: async (
      _,
      { value, interesting, contentId },
      { user }
    ) => {
      const interaction = await UserContentInteractions.findOneAndUpdate(
        { user: user._id },
        {
          $push: {
            feedback: {
              value,
              contentId,
              interesting,
              timestamp: Math.round(Date.now() / 1000)
            }
          }
        }
      )

      return !!interaction
    }
  }
}
