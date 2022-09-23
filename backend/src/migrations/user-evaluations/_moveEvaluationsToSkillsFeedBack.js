import {
  // User,
  // UserProfile,
  // UserProgress,
  // Organization,
  UserEvaluation
} from '~/models'
;(async () => {
  const allEvals = await UserEvaluation.find().lean()
  await Promise.all(
    allEvals.map(async ev => {
      let skillsFeedback = []
      const { evaluations } = ev
      if (evaluations && evaluations.length > 0) {
        evaluations.forEach(({ skills, evaluatedBy, evaluatedAt }) => {
          skills.forEach(({ skillId, evaluatedLevel }) => {
            const prevSkill = skillsFeedback.find(
              f => String(f.skillId) === String(skillId)
            )
            if (prevSkill) {
              // previously evaluated
              // check if it was the same person
              const prevFeedback = prevSkill.feedback.find(
                f => String(f.evaluatedBy) === String(evaluatedBy)
              )
              if (prevFeedback) {
                // was user replace
                skillsFeedback.map(sk => {
                  if (String(sk.skillId) === String(skillId)) {
                    return {
                      ...sk,
                      feedback: sk.feedback.map(fb => {
                        if (
                          String(fb.evaluatedBy) === String(evaluatedBy) &&
                          new Date(fb.evaluatedAt).getTime() <
                            new Date(evaluatedAt).getTime()
                        ) {
                          return {
                            evaluatedBy,
                            evaluatedAt,
                            level: evaluatedLevel
                          }
                        } else return fb
                      })
                    }
                  } else return sk
                })
              } else {
                // wasnt user just insert
                skillsFeedback.map(sk => {
                  if (String(sk.skillId) === String(skillId)) {
                    return {
                      ...sk,
                      feedback: [
                        ...sk.feedback,
                        {
                          evaluatedBy,
                          evaluatedAt,
                          level: evaluatedLevel
                        }
                      ]
                    }
                  } else return sk
                })
              }
            } else {
              // not evaluated just insert
              skillsFeedback.push({
                skillId,
                feedback: [
                  {
                    evaluatedBy,
                    evaluatedAt,
                    level: evaluatedLevel
                  }
                ]
              })
            }
          })
        })

        await UserEvaluation.findOneAndUpdate(
          { _id: ev._id },
          {
            $set: {
              skillsFeedback,
              evaluations: []
            }
          }
        )
      }
    })
  )
})()
