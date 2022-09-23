import {
  LearningContent,
  UserContentInteractions,
  ContentSources,
  // User,
  // UserProfile,
  Team,
  TeamSharedContentList,
  DevelopmentPlan,
  Skills
  // Skills
} from '~/models'
import { isInnentialAdmin, isUser } from '~/directives'
import {
  sentryCaptureException,
  // sendEmail,
  // appUrls,
  getDownloadLink,
  deleteAWSContent
} from '~/utils'
// import {
//   getContentForWeeklyEmail,
//   mapContentToTemplate
// } from '../../../config/jobs/utils'
import { getUdemyCourses } from './utils'
import AsyncLock from 'async-lock'
import slug from 'slug'
import { algolia } from '~/config'
import { ENVIRONMENT } from '~/environment'

const lock = new AsyncLock()

export const mutationTypes = `
  type Mutation {
    addLearningContent(inputData: LearningContentInput!): LearningContent @${isInnentialAdmin}
    addLearningContentFile(inputData: LearningContentInput!): LearningContent @${isInnentialAdmin}
    editLearningContent(inputData: LearningContentInput!, learningContentId: ID!): LearningContent @${isInnentialAdmin}
    deleteLearningContent(learningContentId: ID!): String @${isInnentialAdmin}
    keepCurrentContent(contentIds: [ID]!): String @${isUser}
    dislikeContent(learningContentId: ID!): String @${isUser}
    likeContent(learningContentId: ID!): String @${isUser}
    markContentAsViewed(learningContentId: ID!): String @${isUser}
    addDownloadedPdfs(downloadedPdf: String): String @${isUser}
    deleteSpiderContent(spider: String!, date: DateTime!): Int @${isInnentialAdmin}
    sendTestEmail(email: String!): String @${isInnentialAdmin}
    shareLearningContentInTeam(
      teamIds: [String],
      contentId: String,
      note: String
    ): [SharedContent] @${isUser}
    getUdemyCoursesForIDs(skillIds: [ID]!): String @${isUser}
    unshareLearningContent(contentId: String, teamIds: [String]): String
    userAddLearningContent(inputData: LearningContentInput!): LearningContent @${isUser}
    userEditLearningContent(inputData: LearningContentInput!, learningContentId: ID!): LearningContent @${isUser}
    userAddLearningContentPDF(inputData: LearningContentInput!): LearningContent @${isUser}
    deleteUserLearningContent(learningContentId: ID!): String @${isUser}
    recommendContent(userIds: [ID]!, contentId: ID!): String @${isUser}
    cleanupDeadContent(source: ID!): String @${isInnentialAdmin}
    trackContentEvent(inputData: EventInput!): String @${isUser}
    fetchLearningContentIDBySource(url: String!): String @${isInnentialAdmin}
    deleteLearningPathBanner(pathId : ID! , key : String) : String @${isUser}
  }
`

// const appLink = `${appUrls['user']}`

export const mutationResolvers = {
  Mutation: {
    addLearningContent: async (_, { inputData }) => {
      const { url } = inputData

      const contentCheck = await LearningContent.findOne({ url })
        .select({ _id: 1 })
        .lean()
      if (contentCheck)
        throw new Error(
          `Content with URL: ${contentCheck} already exists; ID:${contentCheck._id}`
        )

      const pathArray = url.split('/')
      const protocol = pathArray[0]
      const host = pathArray[2]
      const baseUrl = protocol + '//' + host
      const urlRegExp = new RegExp(
        baseUrl
          .replace('https:', 'https?:')
          .replace('http:', 'https?:')
          .replace('www.', '(www.)?')
      )

      let source
      const contentSource = await ContentSources.findOne({
        baseUrls: { $in: [urlRegExp] }
      })
      if (!contentSource) {
        source = await ContentSources.create({
          slug: slug(host, {
            replacement: '_',
            lower: true
          }),
          name: host,
          baseUrls: [baseUrl],
          accountRequired: false
        })
      } else source = contentSource

      const result = await LearningContent.create({
        ...inputData,
        source: source._id
      })
      await Promise.all(
        inputData.relatedPrimarySkills.map(async skill => {
          await Skills.updateOne(
            { _id: skill._id },
            { $inc: { contentCount: 1 } }
          )
        })
      )
      if (process.env.SERVER === ENVIRONMENT.PRODUCTION) {
        algolia
          .saveObject({
            objectID: result._id,
            title: result.title,
            author: result.author,
            relatedPrimarySkills: result.relatedPrimarySkills.map(
              skill => skill.name
            )
          })
          .then(() => {})
          .catch(e => sentryCaptureException(e))
      }
      return result
    },
    addLearningContentFile: async (_, { inputData }) => {
      // check if it was uploaded to aws successfully
      const validLink = await getDownloadLink({
        _id: inputData.awsId,
        key: 'user-content',
        expires: 500 * 60
      })
      if (validLink) {
        const result = await LearningContent.create({
          ...inputData
        })

        if (result) {
          await Promise.all(
            inputData.relatedPrimarySkills.map(async skill => {
              await Skills.updateOne(
                { _id: skill._id },
                { $inc: { contentCount: 1 } }
              )
            })
          )
          return result
        } else {
          await deleteAWSContent({ awsId: inputData.awsId })
          return null
        }
      } else {
        sentryCaptureException(new Error(`AWS UPLOAD WAS UNSUCCESSFUL`))
        return null
      }
    },
    editLearningContent: async (_, { inputData, learningContentId }) => {
      const learningContent = await LearningContent.findById(learningContentId)
      if (learningContent) {
        const result = await LearningContent.findOneAndUpdate(
          { _id: learningContentId },
          { ...inputData, updatedAt: new Date(), toReview: false }
        )
        const oldLearningContent = await LearningContent.findById(
          learningContentId
        )

        let oldSkills = oldLearningContent.relatedPrimarySkills.filter(
          skill => {
            let oldId = skill._id
            let newIds = inputData.relatedPrimarySkills.map(value => {
              return value._id
            })

            return !newIds.includes(oldId)
          }
        )
        await Promise.all(
          oldSkills.map(async skill => {
            await Skills.updateOne(
              { _id: skill._id },
              { $inc: { contentCount: -1 } }
            )
          })
        )
        if (oldSkills.length > 0) {
          await Promise.all(
            inputData.relatedPrimarySkills.map(async skill => {
              await Skills.updateOne(
                { _id: skill._id },
                { $inc: { contentCount: 1 } }
              )
            })
          )
        }
        return result
      } else {
        console.log(
          `No learning content had been found with provided id ${learningContentId}`
        )
        return {}
      }
    },
    deleteLearningContent: async (
      _,
      { learningContentId },
      { dataSources }
    ) => {
      const content = await LearningContent.findOne({ _id: learningContentId })
      if (content) {
        await Promise.all(
          content.relatedPrimarySkills.map(async skill => {
            await Skills.updateOne(
              { _id: skill._id },
              { $inc: { contentCount: -1 } }
            )
          })
        )
        try {
          await dataSources.LearningContent.singleDelete({
            _id: learningContentId
          })

          return learningContentId
        } catch (err) {
          sentryCaptureException(err)
        }
      }
      return 'OK'
    },
    deleteLearningPathBanner: async (_, args, { dataSources }) => {
      await deleteAWSContent({ awsId: args.pathId, key: args.key })
      return 'Banner deleted'
    },
    keepCurrentContent: async (_, { contentIds }, { user }) => {
      const interactionsProfile = await UserContentInteractions.findOne({
        user: user._id
      }).lean()
      if (!interactionsProfile)
        throw new Error(`Content interaction profile not found`)
      if (interactionsProfile.currentContent.length < 5) {
        await UserContentInteractions.findOneAndUpdate(
          { _id: interactionsProfile._id },
          {
            $set: {
              currentContent: [...contentIds]
            }
          }
        )
        return 'Content updated'
      }
      return 'OK'
    },
    dislikeContent: async (_, { learningContentId }, { user }) => {
      const interactionsProfile = await UserContentInteractions.findOne({
        user: user._id
      })
      const content = await LearningContent.findOne({ _id: learningContentId })
      if (interactionsProfile && content) {
        if (
          interactionsProfile.likedContent.some(
            liked => learningContentId === liked
          )
        ) {
          await UserContentInteractions.findOneAndUpdate(
            { _id: interactionsProfile._id },
            {
              $set: {
                likedContent: interactionsProfile.likedContent.filter(
                  liked => content._id.toString() !== liked.toString()
                )
              }
            }
          )
          await LearningContent.findOneAndUpdate(
            { _id: content._id },
            {
              $set: {
                likes: content.likes ? content.likes - 1 : 0
              }
            }
          )
        }
        if (
          interactionsProfile.dislikedContent.some(
            disliked => learningContentId === disliked
          )
        ) {
          return 'OK'
        } else {
          try {
            await LearningContent.findOneAndUpdate(
              { _id: content._id },
              {
                $set: {
                  dislikes: content.dislikes + 1
                }
              }
            )
            await UserContentInteractions.findOneAndUpdate(
              { _id: interactionsProfile._id },
              {
                $set: {
                  // currentContent: interactionsProfile.currentContent.filter(
                  //   currContent => !content._id.equals(currContent)
                  // ),
                  likedContent: interactionsProfile.likedContent.filter(
                    liked => !content._id.equals(liked)
                  ),
                  dislikedContent: [
                    ...interactionsProfile.dislikedContent,
                    content._id
                  ]
                }
              }
            )
            return content._id
          } catch (e) {
            sentryCaptureException(e)
          }
        }
      } else throw new Error('Not found')
    },
    likeContent: async (_, { learningContentId }, { user }) => {
      const interactionsProfile = await UserContentInteractions.findOne({
        user: user._id
      })
      const content = await LearningContent.findOne({ _id: learningContentId })
      if (interactionsProfile && content) {
        if (
          interactionsProfile.dislikedContent.some(
            disliked => learningContentId === disliked
          )
        ) {
          await UserContentInteractions.findOneAndUpdate(
            { _id: interactionsProfile._id },
            {
              $set: {
                dislikedContent: interactionsProfile.dislikedContent.filter(
                  disliked => content._id.toString() !== disliked.toString()
                )
              }
            }
          )
          await LearningContent.findOneAndUpdate(
            { _id: content._id },
            {
              $set: {
                dislikes: content.dislikes ? content.dislikes - 1 : 0
              }
            }
          )
        }
        if (
          interactionsProfile.likedContent.some(
            liked => learningContentId === liked
          )
        ) {
          return 'OK'
        } else {
          await LearningContent.findOneAndUpdate(
            { _id: content._id },
            {
              $set: {
                likes: content.likes ? content.likes + 1 : 1
              }
            }
          )
          await UserContentInteractions.findOneAndUpdate(
            { _id: interactionsProfile._id },
            {
              $set: {
                likedContent: [
                  ...interactionsProfile.likedContent,
                  learningContentId
                ]
              }
            }
          )
          return content._id
        }
      } else {
        sentryCaptureException('Not found')
        return null
      }
    },
    markContentAsViewed: async (_, { learningContentId }, { user }) => {
      const interactionsProfile = await UserContentInteractions.findOne({
        user: user._id
      })
      const content = await LearningContent.findOne({ _id: learningContentId })
      if (interactionsProfile && content) {
        if (
          interactionsProfile.clickedContent.some(
            clicked => learningContentId === clicked
          )
        )
          return 'OK'
        else {
          await UserContentInteractions.findOneAndUpdate(
            { _id: interactionsProfile._id },
            {
              $set: {
                clickedContent: [
                  ...interactionsProfile.clickedContent,
                  learningContentId
                ]
              }
            }
          )
          return content._id
        }
      } else throw new Error(`Not found`)
    },
    addDownloadedPdfs: async (_, { downloadedPdf }, { user }) => {
      try {
        const { _id } = user
        const interactions = await UserContentInteractions.findOne({
          user: _id
        })
        const previousPdfs = interactions.downloadedPdfs

        if (previousPdfs.indexOf(downloadedPdf) === -1) {
          const finalPdfs = [...previousPdfs, downloadedPdf]

          await UserContentInteractions.findOneAndUpdate(
            {
              user: _id
            },
            {
              $set: {
                downloadedPdfs: finalPdfs
              }
            }
          )

          return 'success'
        } else {
          return null
        }
      } catch (e) {
        sentryCaptureException(e)
        return null
      }
    },
    deleteSpiderContent: async (_, { spider, date }, { dataSources }) => {
      return dataSources.LearningContent.bulkDelete({
        spider,
        createdAt: { $gt: date }
      })

      // if (spiderContent.length > 0) {
      //   const deletedContent = await Promise.all(
      //     spiderContent.map(async content => {
      //       try {
      //         await LearningContent.deleteOne({ _id: content._id })
      //         if (process.env.SERVER === ENVIRONMENT.PRODUCTION) {
      //           algolia.deleteObject(`${content._id}`)
      //         }

      //         const contentProfiles = await UserContentInteractions.find({
      //           $or: [
      //             {
      //               likedContent: { $in: content._id }
      //             },
      //             {
      //               dislikedContent: { $in: content._id }
      //             }
      //           ]
      //         })

      //         await DevelopmentPlan.updateMany(
      //           { 'content.contentId':  }
      //         )

      //         await Promise.all(
      //           contentProfiles.map(async profile => {
      //             const { likedContent, dislikedContent } = profile

      //             const newLikedContent = likedContent.filter(
      //               liked => !content._id.equals(liked)
      //             )
      //             const newDislikedContent = dislikedContent.filter(
      //               disliked => !content._id.equals(disliked)
      //             )

      //             await UserContentInteractions.findOneAndUpdate(
      //               { _id: profile._id },
      //               {
      //                 $set: {
      //                   likedContent: newLikedContent,
      //                   dislikedContent: newDislikedContent
      //                 }
      //               }
      //             )
      //           })
      //         )
      //         return content._id
      //       } catch (e) {
      //         sentryCaptureException(e)
      //       }
      //     })
      //   )
      //   return deletedContent.length
      // } else return 0
    },
    // sendTestEmail: async (_, { email }) => {
    //   const user = await User.findOne({ email }).lean()

    //   if (!user) {
    //     throw new Error(`User: ${email} cannot be found`)
    //   }

    //   const userProfile = await UserProfile.findOne({
    //     user: user._id
    //   }).lean()

    //   if (user.status !== 'active' || !userProfile) {
    //     throw new Error(`User: ${user._id.toString()} is not active`)
    //   }

    //   const profile = await UserContentInteractions.findOne({ user: user._id })

    //   const { isReceivingContentEmails } = profile

    //   if (!isReceivingContentEmails) {
    //     return null
    //   }

    //   const { organizationId } = user
    //   const { neededWorkSkills } = userProfile

    //   const skillIds = neededWorkSkills.map(skill => skill._id)
    //   const contentToSend = await getContentForWeeklyEmail(
    //     skillIds,
    //     organizationId
    //   )

    //   if (contentToSend !== null) {
    //     const { topPaidContent, topWeeklyContent } = contentToSend
    //     const normalisedSkills = await Promise.all(
    //       neededWorkSkills.map(async skill => {
    //         const normalisedSkill = await Skills.findById(skill._id)
    //         if (normalisedSkill) {
    //           return normalisedSkill.name
    //         } else {
    //           console.log(`Skill with id:${skill._id} not found`)
    //           return null
    //         }
    //       })
    //     )

    //     const usersSkills = normalisedSkills.reduce((acc, curr) => {
    //       if (curr !== null) {
    //         return [...acc, curr]
    //       } else return acc
    //     }, [])

    //     const { email } = user
    //     appLink &&
    //       (await sendEmail(
    //         email,
    //         'New content available at Innential',
    //         mapContentToTemplate({
    //           usersSkills,
    //           topWeeklyContent,
    //           topPaidContent,
    //           appLink
    //         })
    //       ))
    //     return 'Email sent'
    //   } else return 'No content to send'
    // },
    shareLearningContentInTeam: async (
      _,
      { contentId, teamIds, note },
      { user: { _id } }
    ) => {
      const contentCheck = await LearningContent.findById(contentId).lean()
      if (!contentCheck) {
        sentryCaptureException(
          new Error(`content with id: ${contentId} not found`)
        )
        return new Error(`Something went wrong`)
      }

      const employeeContentProfile = await UserContentInteractions.findOne({
        user: _id
      }).lean()
      if (!employeeContentProfile) {
        sentryCaptureException(
          new Error(
            `User content interactions where not initialized: ${_id} user`
          )
        )
        return new Error(`Something went wrong`)
      }

      const { likedContent } = employeeContentProfile

      let allSharedContent = []
      await Promise.all(
        teamIds.map(async teamId => {
          const teamCheck = await Team.findById(teamId)
          if (!teamCheck) {
            sentryCaptureException(
              new Error(`team with id: ${teamId} not found`)
            )
            return new Error(
              `One of the teams you're looking for doesn't exist`
            )
          }
          const teamsContentList = await TeamSharedContentList.findOne({
            teamId
          }).lean()
          if (!teamsContentList) {
            const notes = [{ userId: _id, note }]
            const sharedContent = [
              {
                contentId,
                sharedBy: _id,
                notes
              }
            ]

            const newList = await TeamSharedContentList.create({
              teamId,
              sharedContent
            })

            if (newList) {
              const liked = likedContent.some(
                like => contentCheck._id.toString() === like.toString()
              )

              allSharedContent.push({
                sharedContent: {
                  ...contentCheck,
                  liked
                },
                _id: `${newList._id}==${contentCheck._id}`,
                teams: teamCheck.teamName,
                sharedBy: _id,
                lastShared: newList.sharedContent[0].lastShared
              })
            }
          } else {
            const previousContent = teamsContentList.sharedContent.find(
              c => c.contentId === contentId
            )
            if (previousContent) {
              /* TODO: APPEND NOTES */
              const sharedContent = teamsContentList.sharedContent.map(sc => {
                if (sc.contentId === contentId) {
                  const previousNote = sc.notes.find(n => n.userId === _id)
                  if (previousNote) {
                    const notes = sc.notes.map(n => {
                      if (n.userId === _id) {
                        return { ...n, note }
                      } else return n
                    })

                    return { ...sc, notes }
                  } else {
                    const notes = [{ userId: _id, note }, ...sc.notes]
                    return { ...sc, notes }
                  }
                } else return sc
              })

              const newList = await TeamSharedContentList.findOneAndUpdate(
                {
                  teamId
                },
                {
                  $set: {
                    sharedContent
                  }
                },
                { new: true }
              ).lean()
              if (newList) {
                const liked = likedContent.some(
                  like => contentCheck._id.toString() === like.toString()
                )

                const sharedContent = newList.sharedContent.find(
                  content => content.contentId === contentCheck._id.toString()
                )
                allSharedContent.push({
                  sharedContent: {
                    ...contentCheck,
                    liked
                  },
                  _id: `${newList._id}==${contentCheck._id}`,
                  teams: teamCheck.teamName,
                  notes: sharedContent.notes,
                  sharedBy: sharedContent.sharedBy,
                  lastShared: sharedContent.lastShared
                })
              }
            } else {
              const notes = [{ userId: _id, note }]
              const sharedContent = [
                {
                  contentId,
                  sharedBy: _id,
                  notes
                },
                ...teamsContentList.sharedContent
              ]

              const newList = await TeamSharedContentList.findOneAndUpdate(
                {
                  teamId
                },
                {
                  $set: {
                    sharedContent
                  }
                },
                { new: true }
              )

              if (newList) {
                const liked = likedContent.some(
                  like => contentCheck._id.toString() === like.toString()
                )

                const sharedContent = newList.sharedContent.find(
                  content => content.contentId === contentCheck._id.toString()
                )
                allSharedContent.push({
                  sharedContent: {
                    ...contentCheck,
                    liked
                  },
                  _id: `${newList._id}==${contentCheck._id}`,
                  teams: teamCheck.teamName,
                  notes: sharedContent.notes,
                  sharedBy: sharedContent.sharedBy,
                  lastShared: sharedContent.lastShared
                })
              }
            }
          }
        })
      )

      await LearningContent.findOneAndUpdate(
        { _id: contentId },
        {
          $set: {
            shareCount: contentCheck.shareCount
              ? contentCheck.shareCount + teamIds.length
              : teamIds.length
          }
        }
      )

      return allSharedContent
    },
    getUdemyCoursesForIDs: async (_, { skillIds }) => {
      getUdemyCourses(skillIds, lock)
        .then(() => {
          return 'DONE'
        })
        .catch(() => {
          return 'ERROR'
        })
        .finally(() => {
          return 'DONE'
        })
    },
    unshareLearningContent: async (
      _,
      { contentId, teamIds },
      { user: { _id } }
    ) => {
      const content = await LearningContent.findById(contentId)
      if (!content) return `Couldn't find content`

      try {
        await Promise.all(
          teamIds.map(async teamId => {
            await TeamSharedContentList.findOneAndUpdate(
              { teamId },
              {
                $pull: {
                  sharedContent: {
                    contentId,
                    sharedBy: _id
                  }
                }
              }
            )
          })
        )
      } catch (e) {
        console.log(e)
        return 'Something went wrong'
      }
      return 'success'
    },
    userAddLearningContent: async (_, { inputData }, { user }) => {
      const { _id, organizationId } = user
      if (_id !== undefined && organizationId !== undefined) {
        const { url } = inputData

        const pathArray = url.split('/')
        const protocol = pathArray[0]
        const host = pathArray[2]
        const baseUrl = protocol + '//' + host
        const urlRegExp = new RegExp(
          baseUrl
            .replace('https:', 'https?:')
            .replace('http:', 'https?:')
            .replace('www.', '(www.)?')
        )
        let source
        const contentSource = await ContentSources.findOne({
          baseUrls: { $in: [urlRegExp] }
        })
        if (!contentSource) {
          source = await ContentSources.create({
            slug: slug(host, {
              replacement: '_',
              lower: true
            }),
            name: host,
            baseUrls: [baseUrl],
            accountRequired: false
          })
        } else source = contentSource

        const result = await LearningContent.create({
          ...inputData,
          organizationSpecific: organizationId,
          source: source._id,
          uploadedBy: _id
        })
        return result
      }
      return null
    },
    userEditLearningContent: async (
      _,
      { inputData, learningContentId },
      { user: { _id: userId } }
    ) => {
      const learningContent = await LearningContent.findById(learningContentId)
        .select({ uploadedBy: 1 })
        .lean()

      if (learningContent) {
        if (String(learningContent.uploadedBy) !== String(userId))
          throw new Error('FORBIDDEN')

        const result = await LearningContent.findOneAndUpdate(
          { _id: learningContentId },
          { ...inputData, updatedAt: new Date() },
          { new: true }
        )
        return result
      } else {
        throw new Error(`NOT FOUND`)
      }
    },
    deleteUserLearningContent: async (
      _,
      { learningContentId },
      { user: { _id }, dataSources }
    ) => {
      const content = await LearningContent.findOne({ _id: learningContentId })

      if (content && String(content.uploadedBy) === String(_id)) {
        try {
          if (content.awsId) {
            deleteAWSContent({ awsId: content.awsId })
          }

          await dataSources.LearningContent.singleDelete({
            _id: learningContentId
          })
          return learningContentId
        } catch (err) {
          sentryCaptureException(err)
        }
      }
      return 'OK'
    },
    userAddLearningContentPDF: async (_, { inputData }, { user }) => {
      const { _id, organizationId } = user

      // check if it was uploaded to aws successfully
      const validLink = await getDownloadLink({
        _id: inputData.awsId,
        key: 'user-content',
        expires: 500 * 60
      })
      if (validLink) {
        const result = await LearningContent.create({
          ...inputData,
          organizationSpecific: organizationId,
          uploadedBy: _id
        })

        if (result) {
          return result
        } else {
          await deleteAWSContent({ awsId: inputData.awsId })
          return null
        }
      } else {
        sentryCaptureException(
          new Error(` AWS UPLOAD WAS UNSUCCESSFUL FOR USER ${_id}`)
        )
        return null
      }
    },
    recommendContent: async (_, { userIds, contentId }, { user: { _id } }) => {
      try {
        // const users = await User.find({ _id: { $in: userIds } })
        //   .select({ firstName: 1, lastName: 1, email: 1 })
        //   .lean()
        await UserContentInteractions.updateMany(
          {
            user: { $in: userIds },
            'recommended.contentId': { $ne: contentId }
          },
          {
            $addToSet: {
              recommended: {
                contentId,
                recommendedBy: _id,
                recommendedAt: new Date()
              }
            }
          }
        )
        return 'OK'
      } catch (e) {
        sentryCaptureException(e)
        return 'ERROR'
      }
    },
    cleanupDeadContent: async (_, { source }) => {
      // if (!lock.isBusy()) {
      try {
        const { nModified } = await LearningContent.updateMany(
          {
            uploadedBy: null,
            url: { $ne: null },
            source,
            $or: [
              {
                lastCleanedAt: {
                  $lt: Date.now() - 28 * 8.64e7 // 4 WEEKS
                }
              },
              {
                lastCleanedAt: null
              }
            ]
          },
          {
            $set: {
              toCleanup: true
            }
          }
        )
        return String(nModified)
      } catch (err) {
        return err.message
      }
      // } else {
      //   return 'BUSY'
      // }
    },
    trackContentEvent: async (_, { inputData }, { user: { _id: user } }) => {
      try {
        const result = await UserContentInteractions.findOneAndUpdate(
          { user },
          {
            $push: {
              interactions: {
                ...inputData,
                timestamp: Math.round(Date.now() / 1000)
              }
            },
            $set: {
              updatedAt: new Date()
            }
          }
        )

        if (result) return 'OK'

        return 'NOT FOUND'
      } catch (e) {
        sentryCaptureException(
          new Error(`Failed to track impression: ${e.message}`)
        )
        return 'ERROR'
      }
    },
    fetchLearningContentIDBySource: async (_, { url }) => {
      if (url !== '') {
        const formattedUrl = url
          .replace('https:', 'https?:')
          .replace('http:', 'https?:')
          .trim()
        let srcRegExp
        if (formattedUrl.endsWith('/')) {
          srcRegExp = new RegExp(formattedUrl.slice(0, -1))
        } else srcRegExp = new RegExp(formattedUrl)
        const learningContent = await LearningContent.findOne({
          url: { $regex: srcRegExp }
        })
          .select({ _id: 1 })
          .lean()
        if (learningContent) {
          return learningContent._id
        }
      }
      return ''
    }
  }
}
