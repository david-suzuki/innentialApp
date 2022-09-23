import { UserEvaluation } from '~/models'
import { sentryCaptureException } from '~/utils'

const jobName = 'takeSkillFeedbackSnapshot'

const callback = async (job, done) => {
  try {
    const evaluations = await UserEvaluation.find().lean()

    await Promise.all(
      evaluations.map(async evaluation => {
        const { skillsFeedback } = evaluation
        if (skillsFeedback && skillsFeedback.length > 0) {
          const newSkillsFeedback = skillsFeedback.map(
            ({ _id, skillId, feedback, snapshots }) => {
              const sum = feedback.reduce((acc, curr) => {
                return acc + curr.level
              }, 0)
              const average = sum / feedback.length
              const newSnapshots = [
                ...snapshots,
                {
                  average,
                  takenAt: new Date()
                }
              ]

              return {
                _id,
                skillId,
                feedback,
                snapshots: newSnapshots
              }
            }
          )
          await UserEvaluation.findOneAndUpdate(
            { _id: evaluation._id },
            {
              $set: {
                skillsFeedback: newSkillsFeedback
              }
            }
          )
        }
      })
    )
  } catch (e) {
    sentryCaptureException(e)
    job.fail(e)
    await job.save()
  } finally {
    done()
  }
}

export default {
  jobName,
  callback,
  interval: '4 weeks',
  options: { timezone: 'Europe/Berlin' },
  type: 'single'
}
