import {
  Goal,
  ReviewResults,
  Review,
  ReviewTemplate,
  Team,
  User,
  UserEvaluation,
  UserProfile,
  Skills,
  DevelopmentPlan,
  Organization,
  JourneyNextSteps,
  ContentSources
} from '~/models'
import { isUser } from '~/directives'
import {
  sentryCaptureException,
  userGoalsApprovedNotification,
  sendEmail,
  appUrls
} from '~/utils'
import { agenda, analytics } from '~/config'

const appLink = appUrls['user']

export const mutationTypes = `
  type Mutation {
    addGoalsToReview(inputData: UserGoalInput!): Review @${isUser}
    draftGoals(goals: [SingleGoalInput]!): [Goal] @${isUser}
    createLearningGoal(goal: SingleGoalInput!): Goal @${isUser}
    reviewGoals(inputData: UserGoalResultInput!): UserGoalInfo @${isUser}
    reviewFeedback(inputData: ReviewFeedbackInput!): UserGoalInfo @${isUser}
    updateGoal(inputData: GoalResultInput!): Goal @${isUser}
    updateGoalRelatedSkills (goalId : ID! , skills : [ID] ): Goal @${isUser}
    setGoalStatus(goalId: ID!, status: String!): Goal @${isUser}
    approveGoals(goals: [GoalApproveInput]!, deadline: DateTime, addReview: Boolean, user: ID!): String @${isUser}
    deleteGoal(goalId: ID!): ID @${isUser}
  }
`

const calculateSkillProgression = (
  newFeedback = [], // [{ skillId, level }]
  oldFeedback = [], // [{ skillId, feedback: [{ evaluatedBy, level }], snapshots }]
  reviewer
) => {
  return newFeedback.map(({ skillId: _id, level }) => {
    let oldValue = 0
    let newValue = level
    const previousFeedback = oldFeedback.find(
      ({ skillId }) => String(skillId) === String(_id)
    )
    if (previousFeedback) {
      const { snapshots, feedback } = previousFeedback
      const oldSum = feedback.reduce((acc, curr) => acc + curr.level, 0) // SUM ALL PREVIOUS FEEDBACK
      if (
        feedback.some(
          ({ evaluatedBy }) => String(evaluatedBy) === String(reviewer)
        )
      ) {
        const newSum = feedback.reduce((acc, curr) => {
          if (String(curr.evaluatedBy) === String(reviewer)) {
            return acc + level
          } else return acc + curr.level
        }, 0)
        newValue = newSum / feedback.length
      } else {
        newValue = (oldSum + level) / (feedback.length + 1)
      }
      if (snapshots && snapshots.length > 0) {
        oldValue = snapshots[snapshots.length - 1].average // TAKE LAST SNAPSHOT
      } else {
        oldValue = oldSum / feedback.length
      }
    }
    return {
      _id,
      oldValue,
      newValue
    }
  })
}

const giveSkillsFeedback = async (
  user,
  skillFeedback,
  skillProgression,
  reviewer
) => {
  const userProfile = await UserProfile.findOne({
    user
  }).lean()

  // IF USER HAS RECEIVED FEEDBACK FOR SKILLS HE DOESN'T HAVE, THEY WILL BE ADDED TO HIS PROFILE

  if (userProfile) {
    const { selectedWorkSkills } = userProfile
    const newSkillIds = []

    skillFeedback.forEach(({ skillId }) => {
      if (
        !selectedWorkSkills.some(({ _id }) => String(skillId) === String(_id))
      ) {
        newSkillIds.push(skillId)
      }
    })

    const newSkills = await Skills.find({ _id: { $in: newSkillIds } })
      .select({ _id: 1, slug: 1 })
      .lean()

    await UserProfile.findOneAndUpdate(
      { _id: userProfile._id },
      {
        $push: {
          selectedWorkSkills: {
            $each: newSkills.map(({ _id, slug }) => ({
              _id,
              slug,
              level: 0
            }))
          }
        }
      }
    )
  }

  // PRELIMINARY SKILL FEEDBACK

  let newSkillsFeedback = skillFeedback.map(feedback => {
    const { skillId, level } = feedback
    return {
      skillId,
      feedback: [
        {
          level,
          evaluatedBy: reviewer
        }
      ]
    }
  })

  const previousEvaluation = await UserEvaluation.findOne({
    user
  }).lean()

  if (previousEvaluation) {
    const { skillsFeedback } = previousEvaluation

    const newSkillProgression = calculateSkillProgression(
      skillFeedback,
      skillsFeedback && skillsFeedback.length ? skillsFeedback : [],
      reviewer
    )

    // ADD INFO TO SKILLS PROGRESSION COMPONENT
    const skillProgressionInfo = skillProgression.map(oldSP => {
      const newSP = newSkillProgression.find(
        ({ _id }) => String(oldSP._id) === String(_id)
      )
      if (newSP) {
        return newSP
      }
      return oldSP
    })
    newSkillProgression.forEach(({ _id: newSPid, oldValue, newValue }) => {
      if (
        !skillProgressionInfo.some(
          ({ _id: oldSPid }) => String(oldSPid) === String(newSPid)
        )
      ) {
        skillProgressionInfo.push({
          _id: newSPid,
          oldValue,
          newValue
        })
      }
    })
    if (skillsFeedback && skillsFeedback.length > 0) {
      // MODIFY EXISTING SKILLS FEEDBACK BASED ON REVIEW DATA
      newSkillsFeedback = skillsFeedback.map(
        ({ _id, skillId, feedback, snapshots }) => {
          const updatedFeedback = skillFeedback.find(
            ({ skillId: updatedId }) => String(updatedId) === String(skillId)
          )
          if (updatedFeedback) {
            const { level } = updatedFeedback
            const oldFbIx = feedback.findIndex(
              ({ evaluatedBy }) => String(evaluatedBy) === String(reviewer)
            )
            if (oldFbIx !== -1) {
              feedback[oldFbIx].level = level
            } else
              feedback.push({
                evaluatedBy: reviewer,
                level
              })
          }
          return {
            _id,
            skillId,
            feedback,
            snapshots
          }
        }
      )

      // APPEND THE REST OF THE REVIEW DATA
      skillFeedback.forEach(({ skillId: updatedId, level }) => {
        if (
          !newSkillsFeedback.some(
            ({ skillId }) => String(skillId) === String(updatedId)
          )
        ) {
          newSkillsFeedback.push({
            skillId: updatedId,
            feedback: [
              {
                level,
                evaluatedBy: reviewer
              }
            ]
          })
        }
      })
    }

    // IF NO EXISTING FEEDBACK EXISTS, WE JUST SAVE THE REVIEW DATA

    await UserEvaluation.findOneAndUpdate(
      { user },
      {
        $set: {
          skillsFeedback: newSkillsFeedback
        }
      }
    )

    return skillProgressionInfo
  } else {
    await UserEvaluation.create({
      user,
      skillsFeedback: newSkillsFeedback
    })
    return null
  }
}

export const mutationResolvers = {
  Mutation: {
    addGoalsToReview: async (
      _,
      { inputData: { user, reviewId, goals } },
      { user: { _id: setBy, organizationId }, dataSources }
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
        // NOTE: HERE THE REVIEWID IS THE ID OF THE NEXT (UPCOMING) REVIEW
        const review = await Review.findById(reviewId)
        if (!review) {
          sentryCaptureException(`No review found for ID:${reviewId}`)
          return null
        }
        const { templateId } = review

        const organization = await Organization.findById(organizationId)
          .select({ approvals: 1, fulfillment: 1 })
          .lean()

        const userData = await User.findById(user)
          .select({ roles: 1 })
          .lean()

        // DEVELOPMENT PLAN
        let existingContent = []
        let existingMentors = []
        const devPlan = await DevelopmentPlan.findOne({ user, active: true })
          .select({ content: 1, mentors: 1 })
          .lean()

        if (devPlan) {
          existingContent = devPlan.content
          existingMentors = devPlan.mentors
        }

        const contentToAdd = []
        const mentorsToAdd = []

        const createdGoals = await Promise.all(
          goals.map(async goal => {
            let finalGoal

            const {
              _id,
              goalName,
              goalType,
              measures: measureNames,
              relatedSkills,
              developmentPlan: { content, mentors }
            } = goal

            if (_id) {
              finalGoal = await Goal.findOneAndUpdate(
                { _id },
                {
                  $set: {
                    goalName,
                    goalType,
                    relatedSkills,
                    reviewId,
                    setBy,
                    measures: measureNames.map(measureName => ({
                      measureName
                    })),
                    status: 'ACTIVE',
                    updatedAt: new Date()
                  }
                },
                { new: true }
              )
            } else {
              finalGoal = await Goal.create({
                goalName,
                goalType,
                relatedSkills,
                user,
                reviewId,
                setBy,
                organizationId,
                measures: measureNames.map(measureName => ({
                  measureName
                })),
                status: 'ACTIVE'
              })
            }

            const goalId = finalGoal._id

            if (content && content.length > 0) {
              // await Promise.all(
              await Promise.all(
                content.map(
                  /* async */ async ({ contentId, contentType, price }) => {
                    if (
                      !existingContent.some(
                        ({
                          contentId: existingId,
                          status,
                          goalId: existingGoalId
                        }) =>
                          String(existingId) === contentId &&
                          existingGoalId !== null &&
                          status !== 'INACTIVE'
                      ) &&
                      !contentToAdd.some(
                        ({ contentId: existingId }) =>
                          String(existingId) === contentId
                      )
                    ) {
                      // console.log({ price, userData })
                      const approved =
                        !organization ||
                        !organization.approvals ||
                        userData.roles.includes('ADMIN') ||
                        price === 0
                      const learningContent = await dataSources.LearningContent.findById(
                        contentId
                      )
                      const contentSource = await ContentSources.findById(
                        learningContent.source
                      )

                      const status = checkStatus(
                        organization,
                        contentSource,
                        content
                      )

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
                      contentToAdd.push({
                        contentId,
                        contentType,
                        goalId,
                        status,
                        approved
                      })
                    }
                  }
                )
              )
              // )
            }

            if (mentors && mentors.length > 0) {
              mentors.forEach(({ mentorId }) => {
                if (
                  !existingMentors.some(
                    ({
                      mentorId: existingId,
                      active,
                      goalId: existingGoalId
                    }) =>
                      String(existingId) === mentorId &&
                      existingGoalId !== null &&
                      active
                  ) &&
                  !mentorsToAdd.some(
                    ({ mentorId: existingId }) =>
                      String(existingId) === mentorId
                  )
                ) {
                  mentorsToAdd.push({ mentorId, goalId, active: true })
                }
              })
            }

            return finalGoal
          })
        )

        const goalIds = createdGoals.map(({ _id: goalId }) => goalId)

        if (devPlan) {
          await DevelopmentPlan.findOneAndUpdate(
            { _id: devPlan._id },
            {
              $pull: {
                content: {
                  goalId: { $in: goalIds }
                },
                mentors: {
                  goalId: { $in: goalIds }
                }
              }
            }
          )
          await DevelopmentPlan.findOneAndUpdate(
            { _id: devPlan._id },
            {
              $push: {
                content: {
                  $each: contentToAdd
                },
                mentors: {
                  $each: mentorsToAdd
                }
              },
              $set: {
                updatedAt: new Date()
              }
            }
          )
        } else {
          await DevelopmentPlan.create({
            user,
            setBy,
            content: contentToAdd,
            mentors: mentorsToAdd,
            organizationId
          })
        }

        // SET UP DEV PLAN REMINDER
        agenda
          .create('singleUserDevPlanReminder', { user: String(user) })
          .unique({ 'data.user': String(user) }, { insertOnly: true })
          .schedule('in one hour')
          .save()

        // HERE WE CHECK WHETHER OR NOT TO CLOSE THE REVIEW, AND SAVE THE RESULTS

        const openReview = await Review.findOne({
          templateId,
          status: 'OPEN'
        }).lean()

        if (openReview) {
          const reviewResult = await ReviewResults.findOne({
            reviewId: openReview._id
          }).lean()

          const userResult = {
            user,
            reviewer: setBy,
            goalsSet: goalIds
          }

          if (reviewResult) {
            const { userResults } = reviewResult
            if (
              userResults.some(
                ({ user: resultUserId }) => String(resultUserId) === user
              )
            ) {
              await ReviewResults.findOneAndUpdate(
                { _id: reviewResult._id, 'userResults.user': userResult.user },
                {
                  $set: {
                    'userResults.$.goalsSet': goalIds
                  }
                }
              )
            } else {
              await ReviewResults.findOneAndUpdate(
                { _id: reviewResult._id },
                {
                  $push: {
                    userResults: userResult
                  }
                }
              )
            }
          } else {
            await ReviewResults.create({
              reviewId: openReview._id,
              templateId,
              userResults: [userResult]
            })
          }

          const { reviewScope, scopeType } = openReview
          const allUserIds = []
          if (scopeType === 'PERSONAL') {
            reviewScope.forEach(({ userId }) => allUserIds.push(userId))
          } else {
            const allTeamIds = reviewScope.map(({ teamId }) => teamId)
            const allTeams = await Team.find({
              _id: { $in: allTeamIds }
            }).lean()

            allTeams.forEach(team => {
              const { leader, members } = team
              const allInTeam = [leader, ...members]

              allInTeam.forEach(userId => {
                if (!allUserIds.some(id => String(id) === String(userId))) {
                  allUserIds.push(userId)
                }
              })
            })
          }

          // THIS ARRAY REPRESENTS WHICH OF THE REQUIRED USERS HAVE THEIR GOALS ALREADY SET
          const haveGoalsSet = await Promise.all(
            allUserIds.map(async userId => {
              // const user = await User.findById(userId)
              // HERE WE GET RID OF CASES WHERE USER ISN'T ACTIVE OR DOESN'T EXIST
              // if (!user) return true
              // if (user.status !== 'active') return true
              const newGoalsLength = await Goal.countDocuments({
                reviewId,
                user: userId
              })
              return newGoalsLength > 0
            })
          )

          // IF ALL OF THEM HAVE SET GOALS, THE REVIEW WILL CLOSE
          if (haveGoalsSet.every(isSet => isSet)) {
            const result = await Review.findOneAndUpdate(
              { _id: openReview._id },
              {
                $set: {
                  status: 'CLOSED',
                  closedAt: new Date()
                }
              },
              { new: true }
            )
            await ReviewResults.findOneAndUpdate(
              { reviewId: openReview._id },
              {
                $set: {
                  closedAt: new Date()
                }
              }
            )
            // await Goal.deleteMany({ reviewId: openReview._id })
            return result
          }
        }

        return review
      } catch (e) {
        sentryCaptureException(e)
        return null
      }
    },
    draftGoals: async (
      _,
      { goals },
      { user: { _id: user, organizationId } }
    ) => {
      try {
        const content = []
        const mentors = []

        // const organization = await Organization.findById(organizationId)
        //   .select({ approvals: 1, fulfillment: 1 })
        //   .lean()

        let existingContent = []
        let existingMentors = []
        const devPlan = await DevelopmentPlan.findOne({ user, active: true })
          .select({ content: 1, mentors: 1 })
          .lean()

        if (devPlan) {
          existingContent = devPlan.content
          existingMentors = devPlan.mentors
        }

        const createdGoals = await Promise.all(
          goals.map(async goal => {
            const {
              goalName,
              goalType,
              measures: measureNames,
              relatedSkills,
              developmentPlan: { content: addedContent, mentors: addedMentors }
            } = goal

            const createdGoal = await Goal.create({
              goalName,
              goalType,
              relatedSkills,
              user,
              setBy: user,
              organizationId,
              measures: measureNames.map(measureName => ({
                measureName
              }))
            })

            addedContent.forEach(({ contentId, contentType }) => {
              if (
                !existingContent.some(
                  ({ contentId: existingId, goalId: existingGoalId }) =>
                    String(existingId) === contentId && existingGoalId !== null
                ) &&
                !content.some(
                  ({ contentId: existingId }) =>
                    String(existingId) === contentId
                )
              )
                content.push({
                  contentId,
                  contentType,
                  status: 'INACTIVE',
                  goalId: createdGoal._id
                })
            })
            addedMentors.forEach(({ mentorId }) => {
              if (
                !existingMentors.some(
                  ({ mentorId: existingId, goalId: existingGoalId }) =>
                    String(existingId) === mentorId && existingGoalId !== null
                ) &&
                !mentors.some(
                  ({ mentorId: existingId }) => String(existingId) === mentorId
                )
              )
                mentors.push({
                  mentorId,
                  active: false,
                  goalId: createdGoal._id
                })
            })

            return createdGoal
          })
        )

        let result
        const contentIds = content.map(({ contentId }) => contentId)
        const mentorIds = mentors.map(({ mentorId }) => mentorId)
        await DevelopmentPlan.findOneAndUpdate(
          { user, active: true },
          {
            $pull: {
              content: {
                contentId: { $in: contentIds }
              },
              mentors: {
                mentorId: { $in: mentorIds }
              }
            }
          }
        )
        result = await DevelopmentPlan.findOneAndUpdate(
          { user, active: true },
          {
            $push: {
              content: {
                $each: content
              },
              mentors: {
                $each: mentors
              }
            },
            $set: {
              updatedAt: new Date()
            }
          }
        )

        if (!result) {
          await DevelopmentPlan.create({
            user,
            setBy: user,
            content,
            mentors,
            organizationId
          })
        }

        return createdGoals
      } catch (e) {
        sentryCaptureException(e)
        return null
      }
    },
    createLearningGoal: async (
      _,
      { goal: goalData },
      { user: { _id: user, organizationId, roles }, dataSources }
    ) => {
      const checkStatus = (
        organization,
        contentSource,
        price,
        subscriptionAvailable
      ) => {
        return (organization &&
          organization.fulfillment &&
          price > 0 &&
          !subscriptionAvailable) ||
          (contentSource.accountRequired && organization.fulfillment)
          ? 'AWAITING FULFILLMENT'
          : 'NOT STARTED'
      }
      try {
        let existingContent = []
        let existingMentors = []
        const devPlan = await DevelopmentPlan.findOne({ user, active: true })
          .select({ content: 1, mentors: 1 })
          .lean()

        if (devPlan) {
          existingContent = devPlan.content
          existingMentors = devPlan.mentors
        }

        const organization = await Organization.findById(organizationId)
          .select({ approvals: 1, fulfillment: 1 })
          .lean()

        const {
          goalName,
          goalType,
          measures: measureNames,
          relatedSkills,
          developmentPlan: { content: addedContent, mentors: addedMentors }
        } = goalData

        const goal = await Goal.create({
          goalName,
          goalType,
          relatedSkills,
          user,
          setBy: user,
          organizationId,
          measures: measureNames.map(measureName => ({
            measureName
          })),
          status: 'ACTIVE'
        })

        const content =
          // await Promise.all(
          await Promise.all(
            addedContent
              .filter(
                ({ contentId }) =>
                  !existingContent.some(
                    ({ contentId: existingId, goalId: existingGoalId }) =>
                      String(existingId) === contentId &&
                      existingGoalId !== null
                  )
              )
              .map(
                async ({
                  contentId,
                  contentType,
                  price,
                  subscriptionAvailable
                }) => {
                  const approved =
                    !organization ||
                    !organization.approvals ||
                    roles.includes('ADMIN') ||
                    price === 0
                  const learningContent = await dataSources.LearningContent.findById(
                    contentId
                  )
                  const contentSource = await ContentSources.findById(
                    learningContent.source
                  )

                  const status = checkStatus(
                    organization,
                    contentSource,
                    subscriptionAvailable
                  )

                  return {
                    contentId,
                    contentType,
                    status,
                    goalId: goal._id,
                    approved
                  }
                }
              )
          )
        // )

        const mentors = addedMentors
          .filter(
            ({ mentorId }) =>
              !existingMentors.some(
                ({ mentorId: existingId, goalId: existingGoalId }) =>
                  String(existingId) === mentorId && existingGoalId !== null
              )
          )
          .map(({ mentorId }) => ({
            mentorId,
            active: false,
            goalId: goal._id
          }))

        let result
        const contentIds = content.map(({ contentId }) => contentId)
        const mentorIds = mentors.map(({ mentorId }) => mentorId)
        await DevelopmentPlan.findOneAndUpdate(
          { user },
          {
            $pull: {
              content: {
                contentId: { $in: contentIds }
              },
              mentors: {
                mentorId: { $in: mentorIds }
              }
            }
          }
        )
        result = await DevelopmentPlan.findOneAndUpdate(
          { user },
          {
            $push: {
              content: {
                $each: content
              },
              mentors: {
                $each: mentors
              }
            },
            $set: {
              updatedAt: new Date(),
              selectedGoalId: goal._id
            }
          }
        )

        await JourneyNextSteps.findOneAndUpdate(
          { user },
          {
            $set: {
              awaitingXLP: false
            }
          }
        )

        await Goal.updateOne({ _id: goal._id }, { seen: true })

        return goal
      } catch (e) {
        sentryCaptureException(e)
        return null
      }
    },
    reviewFeedback: async (
      _,
      { inputData: { skills, feedback, reviewId, user } },
      { user: { _id: reviewer } }
    ) => {
      try {
        const review = await Review.findById(reviewId)
        if (!review) {
          sentryCaptureException(`No review found for ID:${reviewId}`)
          return null
        }
        const reviewResult = await ReviewResults.findOne({ reviewId })

        const skillFeedback = skills
          .reduce((acc, curr) => {
            if (curr.level !== null) {
              return [...acc, curr]
            } else return acc
          }, [])
          .map(({ skillId, level }) => {
            return {
              skillId,
              level
            }
          })

        let firstProgression = skillFeedback.map(
          ({ skillId: _id, level: newValue }) => ({
            _id,
            newValue,
            oldValue: 0
          })
        )

        let userHasResult = false
        if (reviewResult) {
          const { userResults } = reviewResult
          const userResult = userResults.find(
            ({ user: resultUserId }) => String(resultUserId) === user
          )
          if (userResult) {
            userHasResult = true
            if (
              userResult.skillProgression &&
              userResult.skillProgression.length > 0
            ) {
              firstProgression = userResult.skillProgression
            }
          }
        }

        const skillProgression = await giveSkillsFeedback(
          user,
          skillFeedback,
          firstProgression,
          reviewer
        )

        const userResult = {
          user,
          reviewer,
          goalsReviewed: [],
          skillProgression,
          feedback
        }

        if (reviewResult) {
          if (userHasResult) {
            await ReviewResults.findOneAndUpdate(
              { _id: reviewResult._id, 'userResults.user': userResult.user },
              {
                $set: {
                  'userResults.$.goalsReviewed': [],
                  'userResults.$.skillProgression': skillProgression,
                  'userResults.$.feedback': feedback
                }
              }
            )
          } else {
            await ReviewResults.findOneAndUpdate(
              { _id: reviewResult._id },
              {
                $push: {
                  userResults: userResult
                }
              }
            )
          }
        } else {
          const { templateId } = review

          await ReviewResults.create({
            reviewId,
            templateId,
            userResults: [userResult]
          })
        }

        return {
          _id: user,
          feedback,
          skillProgression
        }
      } catch (e) {
        sentryCaptureException(e)
        return null
      }
    },
    reviewGoals: async (
      _,
      { inputData: { user, reviewId, goals, peer } },
      { user: { _id: reviewer } }
    ) => {
      // NOTE: HERE THE REVIEWID IS THE ID OF THE CURRENT (OPEN) REVIEW
      try {
        const review = await Review.findById(reviewId)
        if (!review) {
          sentryCaptureException(`No review found for ID:${reviewId}`)
          return null
        }
        const reviewResult = await ReviewResults.findOne({ reviewId })

        const goalIds = goals.map(({ _id: goalId }) => goalId)

        const devPlanGoalFilter = await DevelopmentPlan.findOne({
          user,
          selectedGoalId: { $in: goalIds }
        })
          .select({ _id: 1 })
          .lean()

        if (devPlanGoalFilter) {
          await DevelopmentPlan.findOneAndUpdate(
            { _id: devPlanGoalFilter._id },
            {
              $set: {
                updatedAt: new Date()
              },
              $unset: {
                selectedGoalId: 1
              }
            }
          )
        }

        const goalSkillFeedback = await Promise.all(
          goals.map(async goal => {
            const {
              measures /* [OBJ] */,
              skills /* [OBJ] */,
              feedback /* STRING */
            } = goal
            if (!peer) {
              // IF THIS IS NOT A PEER REVIEW, THE GOALS WILL BE UPDATED
              await Goal.findOneAndUpdate(
                { _id: goal._id },
                {
                  $set: {
                    measures,
                    skills,
                    feedback,
                    updatedAt: new Date(),
                    reviewedAt: new Date(),
                    status: 'PAST'
                  }
                }
              )
            }
            return skills
              .reduce((acc, curr) => {
                if (curr.level !== null) {
                  return [...acc, curr]
                } else return acc
              }, [])
              .map(({ skillId, level }) => {
                return {
                  skillId,
                  level
                }
              })
          })
        )

        // GROUP MULTIPLE GOAL FEEDBACK RESULTS INTO ONE SKILL FEEDBACK RESULT

        const skillFeedback = goalSkillFeedback.reduce((acc, curr) => {
          const array = []
          curr.forEach(feedback => {
            const existingIx = acc.findIndex(
              ({ skillId }) => String(skillId) === String(feedback.skillId)
            )
            if (existingIx === -1) {
              array.push(feedback)
            } else {
              acc[existingIx].level = feedback.level
            }
          })
          return [...acc, ...array]
        }, [])

        // PRELIMINARY SKILL PROGRESSION

        let firstProgression = skillFeedback.map(
          ({ skillId: _id, level: newValue }) => ({
            _id,
            newValue,
            oldValue: 0
          })
        )

        let userHasResult = false
        if (reviewResult) {
          const { userResults } = reviewResult
          const userResult = userResults.find(
            ({ user: resultUserId }) => String(resultUserId) === user
          )
          if (userResult) {
            userHasResult = true
            if (
              userResult.skillProgression &&
              userResult.skillProgression.length > 0
            ) {
              firstProgression = userResult.skillProgression
            }
          }
        }

        const skillProgression = await giveSkillsFeedback(
          user,
          skillFeedback,
          firstProgression,
          reviewer
        )

        const userResult = {
          user,
          reviewer,
          goalsReviewed: goalIds,
          skillProgression
        }

        if (reviewResult) {
          if (userHasResult) {
            await ReviewResults.findOneAndUpdate(
              { _id: reviewResult._id, 'userResults.user': userResult.user },
              {
                $set: {
                  'userResults.$.goalsReviewed': goalIds,
                  'userResults.$.skillProgression': skillProgression
                }
              }
            )
          } else {
            await ReviewResults.findOneAndUpdate(
              { _id: reviewResult._id },
              {
                $push: {
                  userResults: userResult
                }
              }
            )
          }
        } else {
          const { templateId } = review

          await ReviewResults.create({
            reviewId,
            templateId,
            userResults: [userResult]
          })
        }

        return {
          _id: user,
          goals,
          skillProgression
        }
      } catch (e) {
        sentryCaptureException(e)
        return null
      }
    },
    updateGoalRelatedSkills: async (_, { goalId, skills }) => {
      try {
        const result = await Goal.findOneAndUpdate(
          { _id: goalId },
          { relatedSkills: skills }
        )
        return result
      } catch (e) {
        sentryCaptureException(e)
        return null
      }
    },
    updateGoal: async (
      _,
      { inputData: { _id, goalName, relatedSkills, measures } }
    ) => {
      try {
        const result = await Goal.findOneAndUpdate(
          { _id },
          {
            $set: {
              goalName,
              relatedSkills,
              measures,
              updatedAt: new Date()
            }
          },
          { new: true }
        )
        return result
      } catch (e) {
        sentryCaptureException(e)
        return null
      }
    },
    setGoalStatus: async (
      _,
      { goalId: _id, status },
      { user: { email }, dataSources }
    ) => {
      try {
        let update = {
          status,
          updatedAt: new Date()
        }

        // THIS FIELD'S VALUE IS ONLY UPDATED IF USER ACTIVATES GOAL PRIVATELY
        if (status === 'ACTIVE') update.isPrivate = true

        const result = await Goal.findOneAndUpdate(
          { _id },
          {
            $set: {
              ...update
            }
          },
          { new: true, lean: true }
        )
        if (result) {
          const { user } = result
          switch (status) {
            case 'ACTIVE':
              // ACTIVATE CONTENT FOR GOAL IN DEV PLAN
              const devPlan = await DevelopmentPlan.findOne({ user })
                .select({ content: 1, mentors: 1 })
                .lean()
              if (devPlan) {
                const content = devPlan.content.map(
                  ({ goalId, status, ...rest }) => {
                    return {
                      goalId,
                      status:
                        String(goalId) === String(_id) && status === 'INACTIVE'
                          ? 'NOT STARTED'
                          : status,
                      ...rest
                    }
                  }
                )
                const mentors = devPlan.mentors.map(
                  ({ goalId, active, ...rest }) => {
                    return {
                      goalId,
                      active: active || String(goalId) === String(_id),
                      ...rest
                    }
                  }
                )
                await DevelopmentPlan.findOneAndUpdate(
                  { user },
                  {
                    $set: {
                      content,
                      mentors,
                      updatedAt: new Date()
                    }
                  }
                )
              }
              // SET UP DEV PLAN REMINDER
              agenda
                .create('singleUserDevPlanReminder', {
                  user: String(user)
                })
                .unique({ 'data.user': String(user) }, { insertOnly: true })
                .schedule('in one hour')
                .save()
              break
            case 'PAST':
              // REMOVE ACTIVE GOAL FILTER
              const devPlanGoalFilter = await DevelopmentPlan.findOne({
                user,
                selectedGoalId: _id
              })
                .select({ _id: 1 })
                .lean()

              if (devPlanGoalFilter) {
                const newGoalId = await dataSources.Goal.fetchNextGoalId(result)
                await DevelopmentPlan.findOneAndUpdate(
                  { user },
                  {
                    $set: {
                      updatedAt: new Date(),
                      selectedGoalId: newGoalId
                    }
                    // $unset: {
                    //   selectedGoalId: 1
                    // }
                  }
                )

                await Goal.updateOne({ _id: newGoalId }, { seen: true })
              }

              const completedPathId = await dataSources.LearningPath.completedPath(
                result
              )

              if (completedPathId) {
                // analytics &&
                //   email &&
                //   email.split('@')[1] !== 'innential.com' &&
                await analytics.trackSafe({
                  userId: String(user),
                  event: 'finished_LP',
                  properties: {
                    pathId: String(completedPathId)
                  }
                })
                await User.findOneAndUpdate(
                  { _id: user, 'inbound.path': { $ne: null } },
                  {
                    $set: {
                      'inbound.completedPath': true
                    }
                  }
                )
              }

              return {
                ...result,
                finishedPath: completedPathId
              }
            case 'READY FOR REVIEW':
              // SEND EMAIL NOTIFICATIONS TO USER LEADERS
              const userTeams = await Team.find({ members: user })
                .select({ leader: 1 })
                .lean()
              userTeams.forEach(({ leader }) => {
                agenda
                  .create('singleLeaderReadyGoalsReminder', {
                    user: String(leader)
                  })
                  .unique({ 'data.user': String(leader) }, { insertOnly: true })
                  .schedule('in 10 minutes')
                  .save()
              })

              break
            default:
              break
          }
        }
        return result
      } catch (e) {
        sentryCaptureException(e)
        return null
      }
    },
    approveGoals: async (
      _,
      { goals, addReview, deadline, user },
      { user: { _id: leaderId, organizationId }, dataSources }
    ) => {
      const checkStatus = (
        organization,
        contentSource,
        price,
        subscriptionAvailable
      ) => {
        return (organization &&
          organization.fulfillment &&
          price > 0 &&
          !subscriptionAvailable) ||
          (contentSource.accountRequired && organization.fulfillment)
          ? 'AWAITING FULFILLMENT'
          : 'NOT STARTED'
      }
      try {
        const userData = await User.findById(user)
          .select({ firstName: 1, email: 1, roles: 1 })
          .lean()

        if (!userData) {
          throw new Error('User not found')
        }

        const leaderData = await User.findById(leaderId)
          .select({ firstName: 1, lastName: 1 })
          .lean()

        const organization = await Organization.findById(organizationId)
          .select({ approvals: 1, fulfillment: 1 })
          .lean()

        const { firstName: leaderName, lastName: leaderSurname } = leaderData

        const { firstName, email, roles } = userData

        let reviewId
        if (addReview && deadline) {
          const template = await ReviewTemplate.create({
            name: `${firstName}'s goal review`,
            goalType: 'PERSONAL',
            scopeType: 'PERSONAL',
            specificScopes: [],
            specificUsers: [user],
            reviewers: 'SPECIFIC',
            specificReviewers: [leaderId],
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
            createdBy: leaderId
          })

          const review = await Review.create({
            name: `${firstName}'s goal review`,
            goalsToReview: 'PERSONAL',
            scopeType: 'PERSONAL',
            organizationId,
            templateId: template._id,
            startsAt: deadline,
            progressCheckFrequency: {
              repeatCount: 0
            },
            status: 'UPCOMING',
            reviewScope: [
              {
                userId: user,
                reviewers: [leaderId]
              }
            ]
          })

          reviewId = review._id
        }
        // DEVELOPMENT PLAN
        let existingContent = []
        let existingMentors = []

        const devPlan = await DevelopmentPlan.findOne({ user })
          .select({ content: 1, mentors: 1 })
          .lean()

        if (devPlan) {
          existingContent = devPlan.content
          existingMentors = devPlan.mentors
        }

        const contentToAdd = []
        const mentorsToAdd = []

        const goalsToSend = await Promise.all(
          goals.map(
            async ({
              goalId,
              approved,
              note,
              developmentPlan: { content, mentors }
            }) => {
              const status = approved ? 'ACTIVE' : 'DRAFT'
              const result = await Goal.findOneAndUpdate(
                { _id: goalId },
                {
                  $set: {
                    status,
                    updatedAt: new Date(),
                    reviewId,
                    deadline
                  }
                }
              )
              if (approved) {
                if (content && content.length > 0) {
                  // await Promise.all(
                  await Promise.all(
                    content.map(
                      /* async */ async ({ contentId, contentType, price }) => {
                        if (
                          !existingContent.some(
                            ({
                              contentId: existingId,
                              status,
                              goalId: existingGoalId
                            }) =>
                              String(existingId) === contentId &&
                              existingGoalId !== null &&
                              status !== 'INACTIVE'
                          ) &&
                          !contentToAdd.some(
                            ({ contentId: existingId }) =>
                              String(existingId) === contentId
                          )
                        ) {
                          // console.log({ price, roles })
                          const contentApproved =
                            !organization ||
                            !organization.approvals ||
                            roles.includes('ADMIN') ||
                            price === 0
                          const learningContent = await dataSources.LearningContent.findById(
                            contentId
                          )
                          const contentSource = await ContentSources.findById(
                            learningContent.source
                          )

                          const status = checkStatus(
                            organization,
                            contentSource,
                            content.price,
                            content.subscriptionAvailable
                          )

                          // if (!contentApproved) {
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
                          contentToAdd.push({
                            contentId,
                            contentType,
                            goalId,
                            status,
                            approved: contentApproved
                          })
                        }
                      }
                    )
                  )
                  // )
                }

                if (mentors && mentors.length > 0) {
                  mentors.forEach(({ mentorId }) => {
                    if (
                      !existingMentors.some(
                        ({
                          mentorId: existingId,
                          active,
                          goalId: existingGoalId
                        }) =>
                          String(existingId) === mentorId &&
                          existingGoalId !== null &&
                          active
                      ) &&
                      !mentorsToAdd.some(
                        ({ mentorId: existingId }) =>
                          String(existingId) === mentorId
                      )
                    ) {
                      mentorsToAdd.push({ mentorId, goalId, active: true })
                    }
                  })
                }
              }
              const { goalName } = result
              return {
                goalName,
                note,
                approved
              }
            }
          )
        )

        const { goalsApproved, goalsDisapproved } = goalsToSend.reduce(
          (acc, curr) => {
            if (curr.approved) {
              return {
                ...acc,
                goalsApproved: [...acc.goalsApproved, curr]
              }
            } else {
              return {
                ...acc,
                goalsDisapproved: [...acc.goalsDisapproved, curr]
              }
            }
          },
          { goalsApproved: [], goalsDisapproved: [] }
        )

        // ACTIVATE CONTENT FOR GOAL IN DEV PLAN
        const activatedIds = []
        goals.forEach(({ goalId, approved }) => {
          if (approved) activatedIds.push(goalId)
        })

        if (activatedIds.length > 0) {
          if (devPlan) {
            await DevelopmentPlan.findOneAndUpdate(
              { _id: devPlan._id },
              {
                $pull: {
                  content: {
                    goalId: { $in: activatedIds }
                  },
                  mentors: {
                    goalId: { $in: activatedIds }
                  }
                }
              }
            )
            await DevelopmentPlan.findOneAndUpdate(
              { _id: devPlan._id },
              {
                $push: {
                  content: {
                    $each: contentToAdd
                  },
                  mentors: {
                    $each: mentorsToAdd
                  }
                },
                $set: {
                  updatedAt: new Date()
                }
              }
            )
          } else {
            await DevelopmentPlan.create({
              user,
              setBy: leaderId,
              content: contentToAdd,
              mentors: mentorsToAdd,
              organizationId
            })
          }
          // SEND EMAIL THAT GOALS ARE ACTIVATED

          await sendEmail(
            email,
            'Your goals have been reviewed',
            userGoalsApprovedNotification({
              name: firstName,
              reviewer: `${leaderName} ${leaderSurname}`,
              goalsApproved,
              goalsDisapproved,
              deadline,
              appLink
            })
          )

          // SET UP DEV PLAN REMINDER
          agenda
            .create('singleUserDevPlanReminder', { user: String(user) })
            .unique({ 'data.user': String(user) }, { insertOnly: true })
            .schedule('in one hour')
            .save()
        }
        return 'Success'
      } catch (e) {
        sentryCaptureException(e)
        return null
      }
    },
    deleteGoal: async (
      _,
      { goalId },
      { user: { _id, roles }, dataSources }
    ) => {
      const goal = await Goal.findById(goalId)
        .select({ _id: 1, setBy: 1 })
        .lean()
      if (goal) {
        await Goal.findByIdAndRemove(goalId)

        // if (roles.indexOf('ADMIN') !== -1) {
        //   await Goal.findByIdAndRemove(goalId)
        // } else {
        //   const { setBy } = goal
        //   if (String(setBy) === String(_id)) {
        //     await Goal.findByIdAndRemove(goalId)
        //   } else {
        //     throw new Error(`User doesn't have permission to delete the goal`)
        //   }
        // }

        // Update the selected goal
        await DevelopmentPlan.findOneAndUpdate(
          {
            user: _id,
            selectedGoalId: goalId
          },
          {
            $set: {
              selectedGoalId: null
            }
          }
        )
        const pullResult = await DevelopmentPlan.findOneAndUpdate(
          { user: _id },
          {
            $pull: {
              content: {
                goalId: goal._id
              },
              mentors: {
                goalId: goal._id
              }
            },
            $set: {
              updatedAt: new Date()
            }
          }
        )

        const contentDeleted = pullResult.content.filter(
          ({ goalId }) => String(goalId) === String(goal._id)
        )

        await dataSources.LearningRequest.cancelMany(contentDeleted, _id)

        return goal._id
      }
      return null
    }
  }
}
