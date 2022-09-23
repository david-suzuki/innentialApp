import {
  User,
  DevelopmentPlan,
  Goal,
  ContentSources,
  Skills,
  UserContentInteractions
} from '~/models'
import {
  sendEmail,
  appUrls,
  sentryCaptureException,
  setUpDevPlanReminder
} from '~/utils'
import {
  learningContentForArgs,
  learningContentSearch
} from '../../components/LearningContent/form-data/utils'

const jobName = 'singleUserDevPlanReminder'

const appLink = `${appUrls['user']}`

const mapItemsToEmail = items =>
  Promise.all(
    items.map(
      async ({
        _id,
        title,
        url: link,
        type,
        source: sourceId,
        relatedPrimarySkills,
        relatedSecondarySkills
      }) => {
        const contentSource = await ContentSources.findById(sourceId)
          .select({ _id: 1, name: 1 })
          .lean()
        const source = contentSource ? contentSource.name : ''
        const skills = [...relatedPrimarySkills, ...relatedSecondarySkills].map(
          ({ name }) => name
        )

        return {
          _id,
          title,
          type,
          source,
          link,
          skills,
          appLink,
          recommended: true
        }
      }
    )
  )

const callback = async (job, done) => {
  const today = new Date().getDay()
  const [sunday, saturday] = [0, 6]

  if (today === sunday) {
    job.schedule('tomorrow')
    job.save()
    done()
    return
  }
  if (today === saturday) {
    job.schedule('in two days')
    job.save()
    done()
    return
  }

  if (job.attrs) {
    const {
      priority,
      data: { user }
    } = job.attrs

    const userData = await User.findById(user).lean()

    if (userData) {
      try {
        const { _id } = userData

        const contentProfile = await UserContentInteractions.findOne({
          user: _id
        })
          .select({ _id: 1, isReceivingContentEmails: 1 })
          .lean()

        if (!contentProfile || !contentProfile.isReceivingContentEmails) {
          return null
        }

        const activeGoals = await Goal.find({
          user,
          $or: [{ status: 'ACTIVE' }, { status: 'READY FOR REVIEW' }]
        })
          .select({ _id: 1, relatedSkills: 1 })
          .lean()
        if (activeGoals.length > 0) {
          // USER HAS ACTIVE GOALS
          const devPlan = await DevelopmentPlan.findOne({ user })
            .select({ _id: 1, content: 1, mentors: 1 })
            .lean()
          if (
            !devPlan ||
            devPlan.content.length + devPlan.mentors.length === 0
          ) {
            // USER HAS NOTHING IN DEV PLAN
            // GET ALL SKILL IDS FROM USER ACTIVE GOALS
            const relevantSkillIds = activeGoals.reduce((acc, goal) => {
              const uniqueSkills = []
              goal.relatedSkills.forEach(skillId => {
                if (
                  !uniqueSkills.some(
                    uniqueId => String(skillId) === String(uniqueId)
                  )
                )
                  uniqueSkills.push(skillId)
              })
              return [...acc, ...uniqueSkills]
            }, [])
            let content = []
            if (relevantSkillIds.length > 0) {
              // PREPARE ARGS FOR LEARNING CONTENT ALGORITHM
              const args = {
                neededSkills: await Promise.all(
                  relevantSkillIds.map(async _id => {
                    const skill = await Skills.findById(_id)
                      .select({ _id: 1, name: 1 })
                      .lean()
                    return skill || { _id, name: '' }
                  })
                )
              }
              // GET LEARNING CONTENT
              let relevantContent = await learningContentForArgs(args)
              if (relevantContent.length === 0) {
                const skillNames = args.neededSkills
                  .map(skill => skill.name)
                  .join(' ')
                relevantContent = await learningContentSearch(
                  skillNames,
                  userData.organizationId
                )
              }
              content = await mapItemsToEmail(relevantContent.slice(0, 2))
            }

            const { email, firstName } = userData
            await sendEmail(
              email,
              'Action required: set up your development plan!',
              setUpDevPlanReminder({
                name: firstName,
                content,
                appLink
              })
            )
          } else {
            // USER HAS CONTENT IN HIS PLAN, THE JOB IS NO LONGER NEEDED
            done()
            await job.remove()
            return
          }
        }
      } catch (err) {
        sentryCaptureException(err)
        job.fail(err)
        job.save()
        done()
        return
      }
    } else {
      job.fail(new Error(`No user data found for ID:${user}`))
      job.save()
      done()
      return
    }

    // I USE PRIORITY AS A WAY TO TELL HOW MANY TIMES A SINGLE JOB HAS RAN,
    // AND TO SCHEDULE THE NEXT NOTIFICATION ACCORDINGLY
    switch (priority) {
      case 0:
        // JOB HAS RAN ONCE
        job.priority(10)
        job.schedule('tomorrow')
        job.save()
        break
      case 10:
        // JOB HAS RAN TWICE
        job.priority(20)
        job.schedule('in 3 days')
        job.save()
        break
      case 20:
        // JOB HAS RAN THRICE
        job.priority(-10)
        job.schedule('in a week')
        job.save()
        break
      default:
        // JOB HAS RAN THREE TIMES, NO FURTHER NOTIFICATIONS TO SEND
        try {
          done()
          await job.remove()
        } catch (err) {
          console.error(err)
        }
        break
    }
  }
  done()
}

export default {
  jobName,
  callback,
  // interval: null,
  // options: { timezone: 'Europe/Berlin' },
  type: 'normal'
}
