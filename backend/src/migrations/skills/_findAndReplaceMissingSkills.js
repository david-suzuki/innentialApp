import { UserEvaluation, UserProfile, Skills, Team, User } from '~/models'
;(async () => {
  let updatedProfileCounter = 0
  let updatedEvaluationCounter = 0
  let updatedTeamCounter = 0

  const teams = await Team.find().lean()
  await Promise.all(
    teams.map(async team => {
      const { requiredSkills } = team
      let updatedFlag = false
      const newRequiredSkills = []
      await Promise.all(
        requiredSkills.map(async required => {
          if (!required) {
            console.log(team._id)
          }
          const skill = await Skills.findById(required.skillId)
          if (!skill) {
            const previousProfile = await UserProfile.findOne({
              $or: [
                { 'selectedWorkSkills._id': required.skillId },
                { 'neededWorkSkills._id': required.skillId }
              ]
            }).lean()

            if (!previousProfile) {
              console.log(
                `WE COULDNT FIND A BACKUP PROFILE FOR SKILL :  ${required.skillId}`
              )
            } else {
              const prevSkill = [
                ...previousProfile.selectedWorkSkills,
                ...previousProfile.neededWorkSkills
              ].find(sk => String(sk._id) === String(required.skillId))
              if (!prevSkill) {
                console.log(`ERROR: ${required.skillId} is missing `)
              }

              const updatedSkill = await Skills.find({
                slug: prevSkill.slug
              }).lean()
              if (updatedSkill.length === 0) {
                console.log(`Couldn't find skill ${required.skillId}`)
              } else if (updatedSkill.length === 1) {
                newRequiredSkills.push({
                  _id: required._id,
                  skillId: updatedSkill[0]._id,
                  level: required.level
                })
              } else {
                console.log('more than one update possbilitacions')

                const relevantSkill = updatedSkill.find(
                  sk =>
                    String(sk.organizationSpecific) ===
                    String(team.organizationId)
                )
                if (!relevantSkill) {
                  console.log('probably c eh', updatedSkill)
                } else {
                  newRequiredSkills.push({
                    _id: required._id,
                    skillId: relevantSkill._id,
                    level: required.level
                  })
                }
              }
            }
            updatedFlag = true
          } else newRequiredSkills.push(required)
        })
      )

      if (updatedFlag) {
        updatedTeamCounter++
        await Team.findOneAndUpdate(
          { _id: team._id },
          {
            $set: {
              requiredSkills: newRequiredSkills
            }
          }
        )
        updatedFlag = false
      }
    })
  )

  const evaluations = await UserEvaluation.find().lean()
  await Promise.all(
    evaluations.map(async item => {
      const { skillsFeedback } = item
      let updatedFlag = false
      const newFeedback = await Promise.all(
        skillsFeedback.map(async skillFb => {
          const skill = await Skills.findById(skillFb.skillId)

          if (!skill) {
            updatedFlag = true
            const previousProfile = await UserProfile.findOne({
              $or: [
                { 'selectedWorkSkills._id': skillFb.skillId },
                { 'neededWorkSkills._id': skillFb.skillId }
              ]
            }).lean()

            if (previousProfile) {
              const prevSkill = [
                ...previousProfile.selectedWorkSkills,
                ...previousProfile.neededWorkSkills
              ].find(sk => String(sk._id) === String(skillFb.skillId))
              if (!prevSkill) {
                console.log(`ERROR: ${skillFb.skillId} is missing from profile`)
              } else {
                const updatedSkills = await Skills.find({
                  slug: prevSkill.slug
                }).lean()
                if (updatedSkills.length === 0) {
                  console.log(`CANT FIND BACKUP SKILL: ${skillFb.skillId}`)
                } else if (updatedSkills.length === 1) {
                  return {
                    ...skillFb,
                    skillId: updatedSkills[0]._id
                  }
                } else {
                  const skillsUser = await User.findById(item.user).lean()
                  const relevantSkill = updatedSkills.find(
                    sk =>
                      String(sk.organizationSpecific) ===
                      String(skillsUser.organizationId)
                  )
                  if (!relevantSkill) {
                    console.log(`CANT FIND BACKUP SKILL: ${skillFb.skillId}`)
                  } else {
                    return {
                      ...skillFb,
                      skillId: relevantSkill._id
                    }
                  }
                }
              }
            } else {
              console.log(
                `WE COULDNT FIND A BACKUP PROFILE FOR SKILL: ${skillFb.skillId}`
              )
            }
            return null
          } else {
            return {
              ...skillFb
            }
          }
        })
      )

      const nullsRemoved = newFeedback.reduce((acc, curr) => {
        if (curr === null) {
          return acc
        } else return [...acc, curr]
      }, [])

      if (updatedFlag) {
        updatedEvaluationCounter++
        await UserEvaluation.findOneAndUpdate(
          { _id: item._id },
          {
            $set: {
              skillsFeedback: nullsRemoved
            }
          }
        )
        updatedFlag = false
      }
    })
  )

  const userProfiles = await UserProfile.find().lean()
  await Promise.all(
    userProfiles.map(async profile => {
      const { selectedWorkSkills, neededWorkSkills } = profile
      let updatedFlag = false
      const newSelectedSkills = []
      await Promise.all(
        selectedWorkSkills.map(async selectedSkill => {
          const skill = await Skills.findById(selectedSkill._id)
          if (!skill) {
            updatedFlag = true
            const updatedSkill = await Skills.findOne({
              slug: selectedSkill.slug
            })
            if (!updatedSkill) {
              console.log(
                `Couldn't find skill with slug ${selectedSkill.slug}; Profile:${profile._id}`
              )
            } else {
              newSelectedSkills.push({
                _id: updatedSkill._id,
                level: selectedSkill.level,
                slug: updatedSkill.slug
              })
            }
          } else newSelectedSkills.push(selectedSkill)
        })
      )
      const newNeededSkills = []
      await Promise.all(
        neededWorkSkills.map(async neededSkill => {
          const skill = await Skills.findById(neededSkill._id)
          if (!skill) {
            updatedFlag = true
            const updatedSkill = await Skills.findOne({
              slug: neededSkill.slug
            })
            if (!updatedSkill) {
              console.log(
                `Couldn't find skill with slug ${neededSkill.slug}; Profile:${profile._id}`
              )
            } else {
              newNeededSkills.push({
                _id: updatedSkill._id,
                slug: updatedSkill.slug
              })
            }
          } else return newNeededSkills.push(neededSkill)
        })
      )
      if (updatedFlag) {
        updatedProfileCounter++
        await UserProfile.findOneAndUpdate(
          { _id: profile._id },
          {
            $set: {
              selectedWorkSkills: newSelectedSkills,
              neededWorkSkills: newNeededSkills
            }
          }
        )
        updatedFlag = false
      }
    })
  )

  if (updatedEvaluationCounter + updatedProfileCounter + updatedTeamCounter)
    console.log(
      `Updated ${updatedEvaluationCounter} evaluations, ${updatedTeamCounter} teams and ${updatedProfileCounter} profiles`
    )
})()
