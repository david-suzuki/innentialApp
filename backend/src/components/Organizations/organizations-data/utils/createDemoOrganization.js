import {
  User,
  UserProfile,
  Team,
  TeamSharedContentList,
  Skills,
  Categories,
  Interests,
  ReviewTemplate,
  Review,
  ReviewResults,
  Goal,
  DevelopmentPlan,
  LearningContent,
  UserContentInteractions,
  RoleRequirements,
  RoleGroup
} from '~/models'
import { Types } from 'mongoose'
import { ROLES_PERMISSIONS, SCOPES } from '~/config'
import { sentryCaptureException } from '~/utils'
import * as DEMO_SETTINGS from './demoOrganizationSettings'
const slugfunction = require('slug')

const createUsersForTeam = async ({
  organizationId,
  teamMembers,
  // skills,
  allInterests,
  // roleAtWork,
  guaranteedSkill,
  createGoals,
  goals
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      let teamsRequiredSkills = []
      let mentors = []
      const teamsMembers = await Promise.all(
        teamMembers.map(async (dev, idx) => {
          const usersId = new Types.ObjectId()
          const newUser = await User.create({
            ...dev,
            _id: usersId,
            email: `${usersId}@innential.com`,
            roles: [ROLES_PERMISSIONS.USER.NAME],
            permissions: [
              ...ROLES_PERMISSIONS.USER.PERMISSIONS[SCOPES.OPERATION.READ].map(
                permission => `${SCOPES.OPERATION.READ}:${permission}`
              )
            ],
            organizationId,
            status: 'active',
            invitation: {
              pendingInvitation: new Types.ObjectId(),
              invitedOn: Date.now()
            }
          })
          if (newUser) {
            mentors.push(newUser._id)
            // let selectedSkills = []
            // let neededSkills = []
            let interests = []
            // for (let i = 0; i < 3; ++i) {
            //   const skillSelect =
            //     idx === 0 && i === 0
            //       ? skills[0]
            //       : skills[Math.floor(Math.random() * skills.length)]
            //   const level = Math.floor(Math.random() * 3) + 1
            //   const prev = selectedSkills.find(
            //     s => s && s._id === skillSelect._id
            //   )
            //   if (prev) continue
            //   teamsRequiredSkills.push(skillSelect)
            //   selectedSkills.push({
            //     _id: skillSelect._id,
            //     category: skillSelect.category,
            //     name: skillSelect.name,
            //     slug: skillSelect.slug,
            //     level
            //   })
            // }

            // for (let i = 0; i < 3; ++i) {
            //   const skillSelect =
            //     idx === 0 && i === 0
            //       ? skills[0]
            //       : skills[Math.floor(Math.random() * skills.length)]
            //   const prev = neededSkills.find(
            //     s => s && s._id === skillSelect._id
            //   )
            //   if (prev) continue
            //   neededSkills.push({
            //     _id: skillSelect._id,
            //     category: skillSelect.category,
            //     name: skillSelect.name,
            //     slug: skillSelect.slug
            //   })
            // }

            for (let i = 0; i < 2; ++i) {
              const interestSelect =
                idx === 0 && i === 0
                  ? allInterests[0]
                  : allInterests[
                      Math.floor(Math.random() * allInterests.length)
                    ]
              const prev = interests.find(
                s => s && s._id === interestSelect._id
              )
              if (prev) continue
              interests.push({
                _id: interestSelect._id,
                name: interestSelect.name,
                slug: interestSelect.slug
              })
            }

            const title = dev.roleAtWork

            const role = await RoleRequirements.findOne({
              title,
              organizationId
            }).select({ _id: 1, coreSkills: 1 })

            const selectedWorkSkills = role.coreSkills.map(
              ({ skillId: _id, level, slug }) => ({
                _id,
                slug,
                level: level - Math.round(Math.random() * (level - 1))
              })
            )

            teamsRequiredSkills.push(selectedWorkSkills[idx])

            // SORT BY HIGHEST SKILL GAP
            const withSkillGapSize = selectedWorkSkills.map(
              ({ _id, level, slug }) => {
                const skillInRole = role.coreSkills.find(
                  skill => skill.slug === slug
                )
                const skillGapSize = skillInRole.level - level
                return {
                  _id,
                  slug,
                  skillGapSize
                }
              }
            )

            withSkillGapSize.sort((a, b) => b.skillGapSize - a.skillGapSize)

            const neededWorkSkills = withSkillGapSize
              .slice(0, 3)
              .map(({ _id, slug }) => ({ _id, slug }))

            const usersProfile = await UserProfile.create({
              user: usersId,
              roleAtWork: title,
              roleId: role._id,
              // roleAtWork,
              selectedWorkSkills,
              neededWorkSkills,
              selectedInterests: interests,
              organizationId
            })

            await UserContentInteractions.create({
              user: usersId
            })

            // CREATE DEVELOPMENT PLAN FOR USER
            const contentForUser = await LearningContent.find({
              'relatedPrimarySkills._id': {
                $in: usersProfile.neededWorkSkills.map(sk => sk._id)
              },
              type: { $in: ['E-LEARNING'] }
            })
              .select({ _id: 1, type: 1 })
              .sort({ createdAt: -1 })
              .limit(10)
              .lean()

            if (contentForUser.length > 0) {
              await DevelopmentPlan.create({
                user: newUser._id,
                setBy: newUser._id,
                content: contentForUser.map(c => ({
                  contentId: c._id,
                  contentType: c.type
                })),
                mentors:
                  idx > 0
                    ? [
                        {
                          mentorId: mentors[idx - 1]._id
                        }
                      ]
                    : []
              })
            } else {
              const gs = await Skills.find({ name: guaranteedSkill })
              const jsContentForUser = await LearningContent.find({
                'relatedPrimarySkills._id': gs._id
              })
                .select({ _id: 1, type: 1 })
                .sort({ createdAt: -1 })
                .limit(5)
                .lean()
              await DevelopmentPlan.create({
                user: newUser._id,
                setBy: newUser._id,
                content: jsContentForUser.map(c => ({
                  contentId: c._id,
                  contentType: c.type
                })),
                mentors:
                  idx > 0
                    ? [
                        {
                          mentorId: mentors[idx - 1]._id
                        }
                      ]
                    : []
              })
            }

            if (createGoals) {
              const { goalName, measureName, feedback, relatedSkill } = goals[
                idx
              ]

              const relatedSkills = await Skills.find({
                name: { $in: relatedSkill }
              })
              await Goal.create({
                goalName,
                goalType: 'PERSONAL',
                setBy: newUser._id,
                organizationId,
                user: newUser._id,
                measures: measureName.map(measureName => ({
                  measureName,
                  completed: true,
                  successRate: Math.floor(Math.random() * 30) + 70
                })),
                relatedSkills: relatedSkills.map(k => k._id),
                skills: relatedSkills.map(k => ({
                  skillId: k._id,
                  level: 4,
                  related: true
                })),
                feedback,
                status: 'ACTIVE'
              })
            }
          }
          return {
            ...dev,
            _id: usersId
          }
        })
      )

      resolve({
        requiredSkills: teamsRequiredSkills,
        teamsMembers
      })
    } catch (e) {
      sentryCaptureException(e)
      reject(e)
    }
  })
}

const createReviewsAndGoalsForItTeam = async ({
  organizationId,
  teamId,
  members,
  leader
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const threeMonthsAgoTdai = new Date(new Date().getTime() - 3 * 2.628e9)
      const threeMonthsFromTdai = new Date(new Date().getTime() + 3 * 2.628e9)
      const tdai = new Date()

      const createdTemplate = await ReviewTemplate.create({
        name: 'Quarterly IT Review',
        organizationId,
        goalType: 'PERSONAL',
        scopeType: 'SPECIFIC',
        specificScopes: [teamId],
        reviewers: 'TEAMLEAD',
        firstReviewStart: threeMonthsAgoTdai,
        reviewFrequency: {
          repeatCount: 3,
          repeatInterval: 'MONTH'
        },
        progressCheckFrequency: {
          repeatCount: 2,
          repeatInterval: 'WEEK',
          day: 1
        }
      })

      const createdReview = await Review.create({
        name: 'Quarterly IT Review',
        organizationId,
        templateId: createdTemplate._id,
        startsAt: threeMonthsAgoTdai,
        closedAt: threeMonthsAgoTdai,
        status: 'CLOSED',
        goalsToReview: 'PERSONAL',
        scopeType: 'SPECIFIC',
        reviewScope: [
          {
            teamId,
            reviewers: [teamId],
            completed: true
          }
        ],
        progressCheckFrequency: {
          repeatCount: 2,
          repeatInterval: 'WEEK',
          day: 1
        }
      })

      const currentReview = await Review.create({
        name: 'Quarterly IT Review',
        organizationId,
        templateId: createdTemplate._id,
        startsAt: tdai,
        status: 'OPEN',
        goalsToReview: 'PERSONAL',
        scopeType: 'SPECIFIC',
        reviewScope: [
          {
            teamId,
            reviewers: [teamId],
            completed: false
          }
        ],
        progressCheckFrequency: {
          repeatCount: 2,
          repeatInterval: 'WEEK',
          day: 1
        }
      })

      await Review.create({
        name: 'Quarterly IT Review',
        organizationId,
        templateId: createdTemplate._id,
        startsAt: threeMonthsFromTdai,
        status: 'UPCOMING',
        goalsToReview: 'PERSONAL',
        scopeType: 'SPECIFIC',
        reviewScope: [
          {
            teamId,
            reviewers: [teamId],
            completed: false
          }
        ],
        progressCheckFrequency: {
          repeatCount: 2,
          repeatInterval: 'WEEK',
          day: 1
        }
      })

      const ITGoals = DEMO_SETTINGS.devTeamSettings.goals

      await Promise.all(
        members.map(async (memberId, idx) => {
          const { goalName, measureName, relatedSkill } = ITGoals[idx]
          const relatedSkills = await Skills.find({
            name: { $in: relatedSkill }
          })

          const goal = await Goal.create({
            goalName,
            goalType: 'PERSONAL',
            setBy: leader,
            reviewId: currentReview._id,
            organizationId,
            user: memberId,
            measures: measureName.map(measureName => ({
              measureName,
              completed: false
            })),
            relatedSkills: relatedSkills.map(k => k._id)
          })
          return goal
        })
      )

      const reviewedGoals = await Promise.all(
        members.map(async (memberId, idx) => {
          const { goalName, measureName, feedback, relatedSkill } = ITGoals[idx]
          const relatedSkills = await Skills.find({
            name: { $in: relatedSkill }
          })

          const goal = await Goal.create({
            goalName,
            goalType: 'PERSONAL',
            setBy: leader,
            reviewId: createdReview._id,
            organizationId,
            user: memberId,
            measures: measureName.map(measureName => ({
              measureName,
              completed: true,
              successRate: Math.floor(Math.random() * 30) + 70
            })),
            relatedSkills: relatedSkills.map(k => k._id),
            skills: relatedSkills.map(k => ({
              skillId: k._id,
              level: 4,
              related: true
            })),
            feedback,
            reviewedAt: threeMonthsAgoTdai
          })

          return goal
        })
      )

      await ReviewResults.create({
        reviewId: createdReview._id,
        templateId: createdTemplate._id,
        closedAt: threeMonthsAgoTdai,
        userResults: reviewedGoals.map(({ _id, setBy, user, reviewedAt }) => ({
          user,
          reviewer: setBy,
          goalsReviewed: [_id],
          reviewedAt
        }))
      })

      resolve('ok')
    } catch (e) {
      sentryCaptureException(e)
      reject(e)
    }
  })
}
export default async ({ organizationId, addedUsersId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const allInterests = await Interests.find().lean()

      // CREATE ROLES FOR ORGANIZATION
      await Promise.all(
        DEMO_SETTINGS.roleSettings.map(async ({ groupName, relatedRoles }) => {
          const roles = await Promise.all(
            relatedRoles.map(async ({ coreSkills: skillSlugs, title }) => {
              const coreSkills = await Promise.all(
                skillSlugs.map(async ({ slug, level }) => {
                  const skill = await Skills.findOne({
                    slug,
                    organizationSpecific: null
                  }).select({ _id: 1 })
                  if (!skill) {
                    console.error(`Skill not found: ${slug}`)
                    return null
                  }
                  return {
                    slug,
                    level,
                    skillId: skill._id
                  }
                })
              )

              return RoleRequirements.create({
                title,
                coreSkills: coreSkills.filter(skill => skill !== null),
                organizationId
              })
            })
          )

          // ADD NEXT STEPS FOR ROLES
          await Promise.all(
            relatedRoles.map(async ({ nextSteps, title }) => {
              if (nextSteps.length > 0) {
                const nextRole = roles.find(role => role.title === nextSteps[0])
                if (nextRole) {
                  return RoleRequirements.findOneAndUpdate(
                    { title, organizationId },
                    {
                      $set: {
                        nextSteps: [nextRole._id]
                      }
                    }
                  )
                } else
                  console.error(`Error finding next step role for ${title}`)
              }
              return null
            })
          )

          await RoleGroup.create({
            groupName,
            relatedRoles: roles.map(({ _id }) => _id),
            organizationId
          })
        })
      )

      {
        // IT TEAM SCOPE
        const {
          teamName,
          teamMembers,
          // roleAtWork,
          categoriesSlugs,
          guaranteedSkill,
          goals
        } = DEMO_SETTINGS.devTeamSettings
        const techCategories = await Categories.find({
          slug: categoriesSlugs
        }).lean()
        const techSkills = await Skills.find({
          category: techCategories.map(tc => tc._id),
          organizationSpecific: null,
          enabled: true
        }).lean()

        const createdDevUsers = await createUsersForTeam({
          organizationId,
          teamMembers,
          // roleAtWork,
          skills: techSkills,
          allInterests,
          guaranteedSkill,
          createGoals: true,
          goals
        })

        if (
          createdDevUsers &&
          createdDevUsers.teamsMembers &&
          createdDevUsers.requiredSkills
        ) {
          const { teamsMembers, requiredSkills } = createdDevUsers

          const leader = teamsMembers[0]._id
          const members = teamsMembers.reduce((acc = [], curr, idx) => {
            if (idx === 0) return acc
            else return [...acc, curr._id]
          }, [])

          const unavailableSkill = await Skills.findOne({
            slug: 'deep_learning',
            organizationSpecific: null,
            enabled: true
          })

          const itRequiredSkills = [
            { skillId: requiredSkills[0]._id, level: 5 },
            { skillId: requiredSkills[1]._id, level: 5 },
            { skillId: requiredSkills[2]._id, level: 3 },
            { skillId: requiredSkills[3]._id, level: 5 },
            { skillId: requiredSkills[4]._id, level: 4 },
            { skillId: unavailableSkill._id, level: 3 }
          ]

          const itTeam = await Team.create({
            teamName,
            slug: slugfunction(teamName, {
              replacement: '_'
            }),
            leader,
            members,
            organizationId,
            requiredSkills: itRequiredSkills
          })

          if (!itTeam) throw new Error('IT TEAM CREATION FAILED')
          else {
            await createReviewsAndGoalsForItTeam({
              organizationId,
              teamId: itTeam._id,
              members,
              leader
            })
          }
        } else {
          throw new Error('SOMETHING WENT WRONG WHILE CREATING THE IT-TEAM!')
        }
      } // END IT TEAM SCOPE

      {
        // BEGIN PRODUCT TEAM SCOPE
        const {
          teamName,
          teamMembers,
          // roleAtWork,
          categoriesSlugs,
          guaranteedSkill,
          goals
        } = DEMO_SETTINGS.productTeamSettings

        const productCategories = await Categories.find({
          slug: categoriesSlugs
        }).lean()
        const productSkills = await Skills.find({
          category: productCategories.map(pc => pc._id),
          organizationSpecific: null,
          enabled: true
        })

        const createdProductUsers = await createUsersForTeam({
          organizationId,
          teamMembers,
          // roleAtWork,
          skills: productSkills,
          allInterests,
          guaranteedSkill,
          createGoals: true,
          goals
        })
        if (
          createdProductUsers &&
          createdProductUsers.teamsMembers &&
          createdProductUsers.requiredSkills
        ) {
          const prodMembers = createdProductUsers.teamsMembers.map(u => u._id)
          const requiredProductSkills = [
            { skillId: createdProductUsers.requiredSkills[0]._id, level: 5 },
            { skillId: createdProductUsers.requiredSkills[1]._id, level: 5 },
            { skillId: createdProductUsers.requiredSkills[2]._id, level: 3 },
            { skillId: createdProductUsers.requiredSkills[3]._id, level: 4 }
          ]

          const pTeam = await Team.create({
            teamName,
            slug: slugfunction(teamName, {
              replacement: '_'
            }),
            leader: addedUsersId,
            members: prodMembers,
            organizationId,
            requiredSkills: requiredProductSkills
          })

          if (!pTeam)
            throw new Error(
              'SOMETHING WENT WRONG WHILE CREATING THE PRODUCT-TEAM!'
            )
          {
            // create admin scope
            // const { goalName, measureName, feedback, relatedSkill } = goals[3]
            // const relatedSkills = await Skills.find({
            //   name: { $in: relatedSkill }
            // })
            // await Goal.create({
            //   goalName,
            //   goalType: 'PERSONAL',
            //   setBy: addedUsersId,
            //   organizationId,
            //   user: addedUsersId,
            //   measures: measureName.map(measureName => ({
            //     measureName
            //   })),
            //   relatedSkills: relatedSkills.map(k => k._id),
            //   skills: relatedSkills.map(k => ({
            //     skillId: k._id,
            //     level: 4,
            //     related: true
            //   })),
            //   feedback
            // })
            // const contentForUser = await LearningContent.find({
            //   'relatedPrimarySkills._id': {
            //     $in: relatedSkills.map(k => k._id)
            //   },
            //   type: { $in: ['E-LEARNING', 'BOOK'] }
            // })
            //   .sort({ createdAt: -1 })
            //   .limit(10)

            const likedContentForAdmin = await LearningContent.findOne({
              title: 'Deep Learning  and Machine Learning Practical Workout' // NOTE TO SELF: NOT A TYPO :D
            })
            if (likedContentForAdmin) {
              await UserContentInteractions.create({
                user: addedUsersId,
                likedContent: [likedContentForAdmin._id]
              })
            }

            // if (contentForUser.length > 0) {
            //   await DevelopmentPlan.create({
            //     user: addedUsersId,
            //     setBy: addedUsersId,
            //     content: contentForUser.map(c => ({
            //       contentId: c._id,
            //       contentType: c.type
            //     })),
            //     mentors: [
            //       {
            //         mentorId: createdProductUsers.teamsMembers[0]._id
            //       }
            //     ]
            //   })
            // } else {
            //   const productSkill = await Skills.find({ name: 'Branding' })
            //   const productContentForUser = await LearningContent.find({
            //     'relatedPrimarySkills._id': productSkill._id
            //   })
            //     .sort({ createdAt: -1 })
            //     .limit(5)
            //   await DevelopmentPlan.create({
            //     user: addedUsersId,
            //     setBy: addedUsersId,
            //     content: productContentForUser.map(c => ({
            //       contentId: c._id,
            //       contentType: c.type
            //     })),
            //     mentors: [
            //       {
            //         mentorId: createdProductUsers.teamsMembers[0]._id
            //       }
            //     ]
            //   })
            // }
          } // end admin scope
          {
            // create team content
            const eoiae = await Skills.find({
              name: { $in: ['Google Analytics', 'Product Management'] }
            })
            const contentForTeam = await LearningContent.find({
              'relatedPrimarySkills._id': { $in: eoiae.map(k => k._id) },
              type: { $in: ['E-LEARNING', 'BOOK'] }
            })
              .select({ _id: 1 })
              .limit(3)
              .lean()

            await TeamSharedContentList.create({
              teamId: pTeam._id,
              sharedContent: contentForTeam.map((c, i) => ({
                contentId: c._id,
                sharedBy: createdProductUsers.teamsMembers[0]._id,
                includedInEmail: true
              }))
            })
          } // end team content
        } else {
          throw new Error(
            'SOMETHING WENT WRONG WHILE CREATING THE PRODUCT-TEAM!'
          )
        }
      } // END PRODUCT TEAM SCOPE

      {
        // BEGIN HR TEAM

        const {
          teamName,
          teamMembers,
          // roleAtWork,
          categoriesSlugs,
          guaranteedSkill,
          goals
        } = DEMO_SETTINGS.hrTeamSettings

        const hrCategories = await Categories.find({
          slug: categoriesSlugs
        }).lean()

        const hrSkills = await Skills.find({
          category: hrCategories.map(pc => pc._id),
          organizationSpecific: null,
          enabled: true
        })

        const createdHRUsers = await createUsersForTeam({
          organizationId,
          teamMembers,
          // roleAtWork,
          skills: hrSkills,
          allInterests,
          guaranteedSkill,
          createGoals: true,
          goals
        })

        if (
          createdHRUsers &&
          createdHRUsers.teamsMembers &&
          createdHRUsers.requiredSkills
        ) {
          const leaderHR = createdHRUsers.teamsMembers[0]._id
          const membersHR = createdHRUsers.teamsMembers.reduce(
            (acc = [], curr, idx) => {
              if (idx === 0) return acc
              else return [...acc, curr._id]
            },
            []
          )

          const requiredHRSkills = [
            { skillId: createdHRUsers.requiredSkills[0]._id, level: 5 },
            { skillId: createdHRUsers.requiredSkills[1]._id, level: 5 },
            { skillId: createdHRUsers.requiredSkills[2]._id, level: 5 }
          ]

          await Team.create({
            teamName: teamName,
            slug: slugfunction(teamName, {
              replacement: '_'
            }),
            leader: leaderHR,
            members: membersHR,
            organizationId,
            requiredSkills: requiredHRSkills
          })
        }
      }
      resolve('ok')
    } catch (e) {
      sentryCaptureException(e)
      reject(e)
    }
  })
}
