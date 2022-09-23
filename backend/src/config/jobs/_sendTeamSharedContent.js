import {
  User,
  TeamSharedContentList,
  Team,
  UserContentInteractions
} from '~/models'
import {
  sendEmail,
  appUrls,
  sentryCaptureException,
  sharedContentNotification
} from '~/utils'
import {
  getSharedContentForNotification
  // mapContentToSharedEmail
} from './utils'

const jobName = 'sendTeamSharedContent'

const appLink = `${appUrls['user']}`

const callback = async (job, done) => {
  const now = new Date()
  const today = now.getDay()
  const [sunday, saturday] = [0, 6]
  if (now.getHours() !== 6 || now.getMinutes() !== 30) {
    done()
    job.schedule('today at 6:30 am')
    job.save()
  } else {
    if (today !== sunday && today !== saturday) {
      // const teams = await Team.find().lean()

      const users = await User.find({ status: 'active' })
        .select({ _id: 1, email: 1, firstName: 1 })
        .lean()

      // const users = await User.find({
      //   email: [
      //     'sadun@waat.eu',
      //     'wojciech@waat.eu',
      //     'kris@innential.com',
      //     'adam@innential.com',
      //     'tomek.pazio@waat.eu'
      //   ]
      // })

      await Promise.all(
        users.map(async user => {
          try {
            const { _id, email, firstName } = user

            const contentProfile = await UserContentInteractions.findOne({
              user: _id
            })
              .select({ _id: 1, isReceivingContentEmails: 1 })
              .lean()

            if (!contentProfile || !contentProfile.isReceivingContentEmails) {
              return null
            }

            const userTeams = await Team.find({
              $or: [{ leader: _id }, { members: { $in: _id } }],
              active: true
            })

            if (!userTeams || userTeams.length === 0) {
              return null
            }

            const topTeamSharedContents = await Promise.all(
              userTeams.map(async team => {
                const sharedContentList = await TeamSharedContentList.findOne({
                  teamId: team._id
                }).lean()
                if (!sharedContentList) {
                  return {
                    key: team._id,
                    name: team.teamName,
                    content: null
                  }
                }

                const { sharedContent } = sharedContentList

                const sortedContent = await getSharedContentForNotification(
                  team._id,
                  sharedContent
                )

                return {
                  key: team._id,
                  name: team.teamName,
                  content: sortedContent
                }
              })
            )

            const reducedTeamContentLists = topTeamSharedContents.reduce(
              (acc, curr) => {
                if (curr.content !== null) {
                  return [...acc, curr]
                } else return acc
              },
              []
            )

            if (reducedTeamContentLists.length > 0) {
              appLink &&
                sendEmail(
                  email,
                  `Your team's top shared learning at Innential`,
                  sharedContentNotification({
                    name: firstName,
                    topSharedContent: reducedTeamContentLists,
                    appLink
                  })
                )
                  .then(async () => {
                    await Promise.all(
                      reducedTeamContentLists.map(async ({ key, content }) => {
                        const sharedContentList = await TeamSharedContentList.findOne(
                          {
                            teamId: key
                          }
                        ).lean()
                        if (sharedContentList) {
                          const { sharedContent } = sharedContentList
                          const newSharedContent = sharedContent.map(shared => {
                            if (
                              content.some(
                                sorted =>
                                  sorted._id.toString() === shared.contentId
                              )
                            ) {
                              return {
                                ...shared,
                                includedInEmail: true
                              }
                            } else return shared
                          })
                          await TeamSharedContentList.findOneAndUpdate(
                            { teamId: key },
                            {
                              $set: {
                                sharedContent: newSharedContent
                              }
                            }
                          )
                        }
                      })
                    )
                  })
                  .catch(e => {
                    sentryCaptureException(e)
                  })
            }
          } catch (e) {
            sentryCaptureException(e)
            job.fail(e)
            job.save()
          }
        })
      )
    }
  }
  done()
}

export default {
  jobName,
  callback,
  interval: '1 hour',
  options: { timezone: 'Europe/Berlin' },
  type: 'single'
}
