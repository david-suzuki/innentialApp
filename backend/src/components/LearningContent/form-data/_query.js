import { isInnentialAdmin, isUser } from '~/directives'
import {
  LearningContent,
  UserProfile,
  UserContentInteractions,
  TeamSharedContentList,
  Team,
  User,
  DevelopmentPlan,
  ContentSources
} from '~/models'
import {
  sentryCaptureException,
  getUploadLink,
  userCanUploadFile
} from '~/utils'
import {
  learningContentForArgs,
  shuffleLearningContent,
  learningContentSearch
} from './utils'
import { ENVIRONMENT } from '~/environment'
import axios from 'axios'
import { Types } from 'mongoose'

export const queryTypes = `
  type Query {
    fetchAllLearningContent(filter: String, source: ID, limit: Int, offset: Int): [LearningContent] @${isInnentialAdmin}
    fetchLearningContentListLength(filter: String, source: ID): Int @${isInnentialAdmin}
    fetchLearningContent(learningContentId: ID): LearningContent @${isUser}
    fetchLearningContentEditForm(learningContentId: ID!): LearningContentEditType @${isInnentialAdmin}
    fetchRelevantLearningContent(
      selectedSkills: [SelectedSkillInput!]!,
      neededSkills: [SkillsInput],
      selectedLineOfWork: RelatedLineOfWorkInput,
      selectedInterests: [RelatedInterestInput]
      selectedIndustry: RelatedIndustryInput
      filter: String
      source: ID
    ): [LearningContent] @${isInnentialAdmin}
    fetchRelevantContentForUser(
      limit: Int, 
      filters: FilterInput,
      neededSkills: [SkillsInput]!,
      sortMethod: String
    ): [LearningContent] @${isUser}
    fetchLikedContentForUser: [LearningContent] @${isUser}
    fetchUserContentInteractions: UserContentInteractions @${isUser}
    fetchOrganizationSpecificContent(
      organizationId: ID!, 
      filter: String, 
      source: ID, 
      limit: Int, 
      offset: Int
    ): [LearningContent] @${isInnentialAdmin}
    fetchOrganizationContentListLength(organizationId: ID!, filter: String, source: ID): Int @${isInnentialAdmin}
    fetchSharedInTeamContent: [SharedContent] @${isUser}
    fetchSharedByMeContent: [LearningContent] @${isUser}
    fetchDislikedContentForUser: [LearningContent] @${isUser}
    requestContentInformationForUrl(url: String!): URLContentInfo @${isUser}
    fetchUserUploadedContent: [LearningContent] @${isUser}
    fetchDevelopmentPlanRelatedContent(
      neededSkills: [SkillsInput]!, 
      limit: Int, 
      userId: ID, 
      filters: FilterInput
      inPath: Boolean
    ): DevelopmentPlanRelatedContent @${isUser}
    searchLearningContent(searchString: String, filters: FilterInput, limit:Int): SearchedContent @${isUser}
    fetchPDFUploadLink(contentType: String, contentId: ID): [String] @${isUser}
    fetchThumbnailUploadLink(contentId: ID!, contentType: String): URL @${isInnentialAdmin}
    fetchContentForOnboardingPlan(
      neededSkills: [SelectedSkillInput]!, 
      filters: FilterInput,
      contentSeen: [ID]!,
    ): [LearningContent] @${isUser}
    fetchAllRatedLearningContent(limit: Int): [LearningContent] @${isInnentialAdmin}
    fetchLearningContentRating(learningContentId: ID!, organizationId: ID): LearningContentRating @${isInnentialAdmin}
    fetchRatedLearningContentListLength: Int @${isInnentialAdmin}
    fetchContentForNextStepPlan(
      neededSkills: [NeededSkillInput]!, 
      filters: FilterInput,
      contentSeen: [ID]!,
    ): [LearningContent] @${isUser}
  }
`

const { ObjectId } = Types

const arrangeLearning = async content => {
  const recommendation = []

  const mostRelevantCourses = content
    .filter(({ type }) => type === 'E-LEARNING')
    .sort((a, b) => b.relevanceRating - a.relevanceRating)
  // .slice(0, 3)

  mostRelevantCourses.forEach(item => {
    if (
      !recommendation.some(
        ({ source }) => String(source) === String(item.source)
      ) &&
      recommendation.length < 3
    ) {
      recommendation.push(item)
    }
  })

  const mostRelevantBooks = content
    .filter(({ type }) => type === 'BOOK')
    .sort((a, b) => b.relevanceRating - a.relevanceRating)
    .slice(0, 1)

  recommendation.push(...mostRelevantBooks)

  const mostRelevantArticles = content
    .filter(({ type }) => type === 'ARTICLE')
    .sort((a, b) => b.relevanceRating - a.relevanceRating)
    .slice(0, 5 - recommendation.length)

  recommendation.push(...mostRelevantArticles)

  return recommendation
}

export const queryResolvers = {
  Query: {
    fetchAllLearningContent: async (_, { filter, source, limit, offset }) => {
      return LearningContent.find({
        organizationSpecific: null,
        ...(source && { source }),
        ...(filter && { type: filter })
      })
        .sort({
          _id: -1
        })
        .skip(limit * (offset - 1))
        .limit(limit)
        .lean()
    },
    fetchLearningContentListLength: async (_, { filter, source }) => {
      return LearningContent.countDocuments({
        organizationSpecific: null,
        ...(source && { source }),
        ...(filter && { type: filter })
      })
    },
    fetchLearningContent: async (_, { learningContentId }, context) => {
      try {
        const learningContent = await LearningContent.findOne({
          _id: learningContentId
        }).lean()
        return learningContent
      } catch (e) {
        sentryCaptureException(e)
        // console.log('There is an error while fetching learning content', e)
        throw new Error('Learning Content with provided Id has not ben found')
      }
    },
    fetchLearningContentEditForm: async (_, { learningContentId }, context) => {
      try {
        const learningContent = await LearningContent.findOne({
          _id: learningContentId
        })
        return learningContent
      } catch (e) {
        sentryCaptureException(e)
        console.log('There is an error while fetching learning content', e)
        throw new Error('Learning Content with provided Id has not ben found')
      }
    },
    fetchRelevantLearningContent: async (_, args, context) => {
      // Clean the arguments from empty properties
      let cleanArgs = {}
      Object.keys(args).forEach(key => {
        if (
          (Array.isArray(args[key]) && args[key].length > 0) ||
          Object.keys(args[key]).length > 0
        ) {
          cleanArgs = {
            ...cleanArgs,
            [key]: args[key]
          }
        }
      })
      const { filter, source } = args

      const learningContent = (await learningContentForArgs(cleanArgs)) || []

      return learningContent
        .sort((a, b) => {
          return b.relevanceRating - a.relevanceRating
        })
        .filter(({ organizationSpecific }) => !organizationSpecific)
        .filter(item => (filter ? item.type === filter : true))
        .filter(item =>
          source ? item.source.toString() === source.toString() : true
        )
    },
    fetchRelevantContentForUser: async (
      _,
      { limit, filters, neededSkills },
      { user, dataSources }
    ) => {
      const { _id, organizationId } = user
      // Here we collect all necessary arguments from the user and organization profile
      const profile = await UserProfile.findOne({ user: _id }).lean()
      if (!profile) throw new Error(`User not onboarded`)
      const interactionsProfile = await UserContentInteractions.findOne({
        user: _id
      }).lean()
      if (!interactionsProfile)
        throw new Error(`Content interaction profile not found`)

      const {
        likedContent,
        dislikedContent,
        clickedContent,
        pastContent,
        // displayNewOnly
        sortMethod
      } = interactionsProfile

      const {
        relatedLineOfWork,
        selectedWorkSkills,
        // neededWorkSkills,
        selectedInterests
      } = profile

      const cleanArgs = {
        selectedLineOfWork: relatedLineOfWork,
        selectedSkills: selectedWorkSkills,
        neededSkills,
        selectedInterests
      }

      const learningContent =
        (await learningContentForArgs(
          cleanArgs,
          likedContent,
          dislikedContent,
          true
        )) || []
      const updatedLearningContent = learningContent.map(item => {
        if (clickedContent.indexOf(item._id.toString()) !== -1) {
          return {
            ...item,
            clicked: true
          }
        } else return item
      })

      const filteredLearningContent = updatedLearningContent
        .filter(item =>
          pastContent && pastContent.length && pastContent.length > 0
            ? !pastContent.some(past => item._id.toString() === past)
            : true
        )
        .filter(({ organizationSpecific }) =>
          organizationSpecific
            ? organizationSpecific.toString() === organizationId.toString()
            : true
        )
        .filter(
          dataSources.Filters.filterContent({
            filters,
            user: _id,
            organizationId
          })
        )

      const sortedLearningContent = filteredLearningContent.sort((a, b) => {
        switch (sortMethod) {
          case 'DATE':
            if (b.publishedDate && a.publishedDate) {
              return new Date(b.publishedDate) - new Date(a.publishedDate)
            } else {
              if (!b.publishedDate) {
                return -1
              } else return 1
            }
          case 'RELEVANCE':
            // if (a.relevanceRating === b.relevanceRating) {
            //   const aDate = new Date(a.publishedDate)
            //   const bDate = new Date(b.publishedDate)
            //   if (aDate === bDate) {
            //     return a.title.localeCompare(b.title)
            //   }
            //   return bDate - aDate
            // }
            return b.relevanceRating - a.relevanceRating
          default:
            return b.relevanceRating - a.relevanceRating
        }
      })

      const neededSkillsNames = neededSkills.map(skill => skill.slug)
      let shuffledLearningContent = []
      if (sortMethod === 'RELEVANCE') {
        shuffledLearningContent = shuffleLearningContent(
          sortedLearningContent,
          neededSkillsNames
        )
      } else shuffledLearningContent = sortedLearningContent

      // console.log(shuffledLearningContent.slice(0, limit))

      return shuffledLearningContent.slice(0, limit)
    },
    fetchLikedContentForUser: async (_, args, { user }) => {
      const { _id } = user
      const interactionsProfile = await UserContentInteractions.findOne({
        user: _id
      }).lean()
      if (!interactionsProfile)
        throw new Error(`Content interaction profile not found`)

      const { likedContent /*, preferredTypes, price */ } = interactionsProfile

      const likedLearningContent = await Promise.all(
        likedContent.map(async liked => {
          const content = await LearningContent.findOne({ _id: liked }).lean()
          if (!content) {
            console.log(`Content with ID:${liked} not found`)
            return null
          }
          return content
        })
      )

      return (
        likedLearningContent
          .reduce((acc = [], curr) => {
            if (curr) return [...acc, curr]
            else return acc
          }, [])
          // .filter(item =>
          //   preferredTypes && preferredTypes.length
          //     ? preferredTypes.some(filter => item.type === filter)
          //     : true
          // )
          // .filter(item => {
          //   if (price && price.length) {
          //     if (price.length === 2) return true
          //     else if (price.indexOf('Paid') !== -1) {
          //       return item.price.value > 0
          //     } else return item.price.value === 0
          //   } else return true
          // })
          .reverse()
      )
    },
    fetchUserContentInteractions: async (_, args, { user }) => {
      const interactions = await UserContentInteractions.findOne({
        user: user._id
      })
      return interactions
    },
    fetchOrganizationSpecificContent: async (
      _,
      { organizationId, filter, source, limit, offset }
    ) => {
      let organizationContent = []
      if (source) {
        organizationContent = await LearningContent.find({
          organizationSpecific: organizationId,
          source
        })
          .sort({
            createdAt: -1
          })
          .lean()
      } else {
        organizationContent = await LearningContent.find({
          organizationSpecific: organizationId
        })
          .sort({
            createdAt: -1
          })
          .lean()
      }
      if (limit && offset)
        return organizationContent
          .filter(item => (filter ? item.type === filter : true))
          .slice(limit * (offset - 1), limit * offset)
      else
        return organizationContent.filter(item =>
          filter ? item.type === filter : true
        )
    },
    fetchOrganizationContentListLength: async (
      _,
      { organizationId, filter, source }
    ) => {
      let organizationContent = []
      if (source) {
        organizationContent = await LearningContent.find({
          organizationSpecific: organizationId,
          source
        })
          .sort({
            createdAt: -1
          })
          .lean()
      } else {
        organizationContent = await LearningContent.find({
          organizationSpecific: organizationId
        })
          .sort({
            createdAt: -1
          })
          .lean()
      }
      return (
        organizationContent.filter(item =>
          filter ? item.type === filter : true
        ).length || 0
      )
    },
    fetchSharedInTeamContent: async (_, args, { user: { _id } }) => {
      const employeeTeams = await Team.find({
        $or: [{ leader: _id }, { members: _id }],
        active: true
      })
      const employeeContentProfile = await UserContentInteractions.findOne({
        user: _id
      })
      if (!employeeContentProfile) {
        sentryCaptureException(`Content profile for user:${_id} not found`)
        return null
      }
      const {
        likedContent,
        dislikedContent
        // preferredTypes,
        // price
      } = employeeContentProfile

      let allSharedContent = []
      if (employeeTeams.length > 0) {
        await Promise.all(
          employeeTeams.map(async team => {
            const sharedList = await TeamSharedContentList.findOne({
              teamId: team._id
            }).lean()
            if (sharedList) {
              await Promise.all(
                sharedList.sharedContent.map(async sc => {
                  const learningContent = await LearningContent.findById(
                    sc.contentId
                  ).lean()
                  if (!learningContent) {
                    console.log(' LEARNING CONTENT IS MISSING!! ')
                    return
                  }
                  const liked = likedContent.some(
                    like => learningContent._id.toString() === like.toString()
                  )
                  const disliked = dislikedContent.some(
                    dislike =>
                      learningContent._id.toString() === dislike.toString()
                  )

                  allSharedContent.push({
                    sharedContent: {
                      ...learningContent,
                      liked,
                      disliked
                    },
                    _id: `${sharedList._id}==${learningContent._id}`,
                    teams: team.teamName,
                    notes: sc.notes,
                    sharedBy: sc.sharedBy,
                    lastShared: sc.lastShared
                  })
                })
              )
            }
          })
        )
      }

      const filteredSharedContent = allSharedContent
      // .filter(shared =>
      //   preferredTypes && preferredTypes.length
      //     ? preferredTypes.some(
      //         filter => shared.sharedContent.type === filter
      //       )
      //     : true
      // )
      // .filter(shared => {
      //   if (price && price.length) {
      //     if (price.length === 2) return true
      //     else if (price.indexOf('Paid') !== -1) {
      //       return shared.sharedContent.price.value > 0
      //     } else return shared.sharedContent.price.value === 0
      //   } else return true
      // })

      return filteredSharedContent
    },
    fetchSharedByMeContent: async (
      _,
      args,
      { user: { _id, organizationId } }
    ) => {
      const organizationTeams = await Team.find({
        organizationId,
        active: true
      })

      const employeeContentProfile = await UserContentInteractions.findOne({
        user: _id
      })
      if (!employeeContentProfile) {
        sentryCaptureException(`Content profile for user:${_id} not found`)
        return null
      }
      const {
        likedContent,
        dislikedContent
        // preferredTypes,
        // price
      } = employeeContentProfile

      let userSharedContent = []
      await Promise.all(
        organizationTeams.map(async team => {
          const teamsContent = await TeamSharedContentList.findOne({
            teamId: team._id
          }).lean()
          if (teamsContent) {
            const sharedInTeamByUser = []
            await Promise.all(
              teamsContent.sharedContent.map(async shared => {
                const { contentId, sharedBy, lastShared } = shared
                if (String(sharedBy) === String(_id)) {
                  const learningContent = await LearningContent.findById(
                    contentId
                  ).lean()

                  if (learningContent) {
                    const liked = likedContent.some(
                      like => learningContent._id.toString() === like.toString()
                    )
                    const disliked = dislikedContent.some(
                      dislike =>
                        learningContent._id.toString() === dislike.toString()
                    )
                    sharedInTeamByUser.push({
                      ...learningContent,
                      lastShared,
                      sharedIn: [team.teamName],
                      liked,
                      disliked
                    })
                  }
                }
              })
            )
            if (sharedInTeamByUser.length > 0) {
              sharedInTeamByUser.forEach(content => {
                const ix = userSharedContent.findIndex(
                  shared => shared._id.toString() === content._id.toString()
                )
                if (ix !== -1) {
                  const sharedTeamList = userSharedContent[ix].sharedIn
                  userSharedContent[ix].sharedIn = [
                    ...sharedTeamList,
                    ...content.sharedIn
                  ]
                  if (
                    new Date(content.lastShared) >
                    new Date(userSharedContent[ix].lastShared)
                  ) {
                    userSharedContent[ix].lastShared = content.lastShared
                  }
                } else userSharedContent.push(content)
              })
            }
          }
        })
      )

      userSharedContent.sort((a, b) => {
        if (b.lastShared && a.lastShared) {
          return new Date(b.lastShared) - new Date(a.lastShared)
        } else {
          if (!b.lastShared) {
            return -1
          } else return 1
        }
      })

      const filteredUserSharedContent = userSharedContent
      // .filter(item =>
      //   preferredTypes && preferredTypes.length
      //     ? preferredTypes.some(filter => item.type === filter)
      //     : true
      // )
      // .filter(item => {
      //   if (price && price.length) {
      //     if (price.length === 2) return true
      //     else if (price.indexOf('Paid') !== -1) {
      //       return item.price.value > 0
      //     } else return item.price.value === 0
      //   } else return true
      // })

      return filteredUserSharedContent
    },
    fetchDislikedContentForUser: async (_, args, { user }) => {
      const { _id } = user
      const interactionsProfile = await UserContentInteractions.findOne({
        user: _id
      }).lean()
      if (!interactionsProfile)
        throw new Error(`Content interaction profile not found`)

      const {
        dislikedContent /*, preferredTypes, price */
      } = interactionsProfile

      const dislikedLearningContent = await Promise.all(
        dislikedContent.map(async disliked => {
          const content = await LearningContent.findOne({
            _id: disliked
          }).lean()
          if (!content) {
            console.log(`Content with ID:${disliked} not found`)
            return null
          }
          return content
        })
      )

      return (
        dislikedLearningContent
          .reduce((acc = [], curr) => {
            if (curr) return [...acc, curr]
            else return acc
          }, [])
          // .filter(item =>
          //   preferredTypes && preferredTypes.length
          //     ? preferredTypes.some(filter => item.type === filter)
          //     : true
          // )
          // .filter(item => {
          //   if (price && price.length) {
          //     if (price.length === 2) return true
          //     else if (price.indexOf('Paid') !== -1) {
          //       return item.price.value > 0
          //     } else return item.price.value === 0
          //   } else return true
          // })
          .reverse()
      )
    },
    requestContentInformationForUrl: async (
      _,
      { url },
      { user: { organizationId } }
    ) => {
      const { SERVER } = process.env
      const production = SERVER === ENVIRONMENT.PRODUCTION
      // const formattedUrl = url
      //   .replace('https:', 'https?:')
      //   .replace('http:', 'https?:')
      //   .trim()
      // let srcRegExp
      // if (formattedUrl.endsWith('/')) {
      //   srcRegExp = new RegExp(formattedUrl.slice(0, -1))
      // } else srcRegExp = new RegExp(formattedUrl)
      const existingContent = await LearningContent.findOne({
        url,
        $or: [
          { organizationSpecific: null },
          { organizationSpecific: organizationId }
        ]
      }).lean()
      //   url: { $regex: srcRegExp }
      // }).lean()
      if (existingContent) {
        const organizationTeams = await Team.find({ organizationId })
        const sharedIn = []
        await Promise.all(
          organizationTeams.map(async team => {
            const teamsContent = await TeamSharedContentList.findOne({
              teamId: team._id
            }).lean()
            if (
              teamsContent &&
              teamsContent.sharedContent.some(
                shared =>
                  String(shared.contentId) === String(existingContent._id)
              )
            ) {
              sharedIn.push(team.teamName)
            }
          })
        )
        return {
          exists: true,
          content: {
            ...existingContent,
            sharedIn
          }
        }
      } else {
        let scrapedInfo

        try {
          const abort = axios.CancelToken.source()

          const timeout = setTimeout(() => {
            // FALLBACK IN CASE AXIOS CANNOT CONNECT TO SERVER
            abort.cancel()
          }, 1000 * 20) // 20 seconds when no connection

          const res = await axios.get(
            `http://admin-sc.innential.com${
              production ? '' : ':7070'
            }/api/analyze-url/?url=${url}`,
            {
              cancelToken: abort.token,
              timeout: 1000 * 15 // 15 seconds to respond
            }
          )

          clearTimeout(timeout)

          if (res && res.status === 200) {
            const { title, date, author } = res.data
            scrapedInfo = {
              title: title || '',
              publishedDate: date ? new Date(date) : new Date(),
              author: author || ''
            }
          } else throw new Error('Invalid response')
        } catch (err) {
          scrapedInfo = {
            title: '',
            author: '',
            publishedDate: new Date()
          }
        }

        return {
          exists: false,
          data: scrapedInfo
        }
      }
    },
    fetchUserUploadedContent: async (
      _,
      args,
      { user: { _id, organizationId } }
    ) => {
      const userUploaded = await LearningContent.find({ uploadedBy: _id })
        .sort({ createdAt: -1 })
        .lean()

      const employeeContentProfile = await UserContentInteractions.findOne({
        user: _id
      })
      if (!employeeContentProfile) {
        sentryCaptureException(`Content profile for user:${_id} not found`)
        return null
      }
      const {
        likedContent,
        dislikedContent
        // preferredTypes,
        // price
      } = employeeContentProfile

      const organizationTeams = await Team.find({ organizationId })

      const contentWithShareInfo = await Promise.all(
        userUploaded.map(async content => {
          const liked = likedContent.some(
            like => content._id.toString() === like.toString()
          )
          const disliked = dislikedContent.some(
            dislike => content._id.toString() === dislike.toString()
          )
          const sharedIn = []
          await Promise.all(
            organizationTeams.map(async team => {
              const teamsContent = await TeamSharedContentList.findOne({
                teamId: team._id
              }).lean()
              if (
                teamsContent &&
                teamsContent.sharedContent.some(
                  shared => String(shared.contentId) === String(content._id)
                )
              ) {
                sharedIn.push(team.teamName)
              }
            })
          )
          return {
            ...content,
            sharedIn,
            liked,
            disliked
          }
        })
      )

      // const filteredOwnContent = contentWithShareInfo
      //   .filter(item =>
      //     preferredTypes && preferredTypes.length
      //       ? preferredTypes.some(filter => item.type === filter)
      //       : true
      //   )
      //   .filter(item => {
      //     if (price && price.length) {
      //       if (price.length === 2) return true
      //       else if (price.indexOf('Paid') !== -1) {
      //         return item.price.value > 0
      //       } else return item.price.value === 0
      //     } else return true
      //   })

      return contentWithShareInfo
    },
    fetchDevelopmentPlanRelatedContent: async (
      _,
      { limit, userId, filters, neededSkills, inPath },
      { user: { _id, organizationId }, dataSources }
    ) => {
      // const { limit, userId, filters, neededSkills } = args
      // delete args.limit
      // delete args.userId
      // delete args.filters

      // let parsedLimits = {
      //   'E-LEARNING': 10,
      //   BOOK: 10,
      //   EVENT: 10,
      //   ARTICLE: 10
      // }

      // if (limits) {
      //   const { courses, books, events, articles } = limits

      //   parsedLimits = {
      //     'E-LEARNING': courses,
      //     BOOK: books,
      //     EVENT: events,
      //     ARTICLE: articles
      //   }
      // }

      let user
      if (userId) user = userId
      else user = _id

      const profile = await UserProfile.findOne({ user }).lean()
      if (!profile) throw new Error(`User not onboarded`)
      const interactionsProfile = await UserContentInteractions.findOne({
        user
      }).lean()
      if (!interactionsProfile)
        throw new Error(`Content interaction profile not found`)

      const devPlan = await DevelopmentPlan.findOne({ user })
        .select({ content: 1 })
        .lean()

      const { selectedWorkSkills } = profile

      const {
        likedContent,
        dislikedContent,
        // pastContent,
        recommended: recommendations = []
        // price
      } = interactionsProfile

      const learningContent =
        (await learningContentForArgs(
          { neededSkills, selectedSkills: selectedWorkSkills },
          likedContent,
          dislikedContent,
          true
        )) || []

      let filteredContent = learningContent
        .filter(
          item =>
            inPath ||
            !devPlan ||
            !devPlan.content.some(
              ({ contentId }) => String(contentId) === String(item._id)
            )
        )
        .filter(({ organizationSpecific }) =>
          organizationSpecific
            ? organizationSpecific.toString() === organizationId.toString()
            : true
        )
        .sort((a, b) => b.relevanceRating - a.relevanceRating)

      if (filteredContent.length === 0) {
        // PERFORM SEARCH
        const skillNames = neededSkills.map(skill => skill.name).join(' ')
        filteredContent = await learningContentSearch(
          skillNames,
          organizationId
        )
      }

      filteredContent = filteredContent.filter(
        dataSources.Filters.filterContent({
          filters,
          user: _id,
          organizationId
        })
      )

      const neededSkillIds = neededSkills.map(({ _id: skillId }) => skillId)

      // WE ACCUMULATE THE CONTENT BASED ON THE RELATED PRIMARY SKILL TO ENSURE EACH NEEDED SKILL HAS A CONTENT PIECE ATTACHED
      // (MAYBE THIS ISN'T SO NECESSARY)

      // const contentPerSkill = finalContent.reduce((acc, curr) => {
      //   const { relatedPrimarySkills } = curr
      //   relatedPrimarySkills.forEach(({ _id: skillId, name }) => {
      //     if (
      //       neededSkillIds.some(
      //         neededId => String(neededId) === String(skillId)
      //       ) ||
      //       filteredContent.length === 0
      //     ) {
      //       if (acc[name]) {
      //         acc[name] = [...acc[name], curr]
      //       } else {
      //         acc[name] = [curr]
      //       }
      //     }
      //   })
      //   return acc
      // }, {})

      // const relatedContentLengthByType = filteredContent.reduce(
      //   (acc, curr) => {
      //     return {
      //       ...acc,
      //       [curr.type]: acc[curr.type] + 1
      //     }
      //   },
      //   {
      //     'E-LEARNING': 0,
      //     BOOK: 0,
      //     EVENT: 0,
      //     ARTICLE: 0
      //   }
      // )

      // [Int, Int, Int, Int]

      const relatedContentLength = []
      // Object.entries(
      //   relatedContentLengthByType
      // ).map(([key, value]) => value)

      // WE LIMIT THE CONTENT TO A CERTAIN AMOUNT OF ITEMS
      let totalRelatedContent = filteredContent.length
      const relatedContent = filteredContent.slice(0, limit)

      // .reduce((acc, item) => {
      //   // GET NUMBER OF ITEMS OF TYPE ALREADY IN ARRAY
      //   if (
      //     acc.reduce(
      //       (total, { type }) => (type === item.type ? total + 1 : total),
      //       0
      //     ) <= parsedLimits[item.type]
      //   ) {
      //     return [...acc, item]
      //   }
      //   return acc
      // }, [])

      // const relatedContent = typeLimitedContent.reduce((acc, [key, value]) => {
      //   // IN THIS ARRAY WE WILL ACCUMULATE FINAL CONTENT ITEMS
      //   const array = []
      //   value.forEach(item => {
      //     // REMOVE DUPLICATES
      //     if (!acc.some(item2 => String(item2._id) === String(item._id))) {
      //       array.push(item)
      //     }
      //   })
      //   return [...acc, ...array]
      // }, [])

      const allProfiles = await UserProfile.find({
        organizationId,
        user: { $ne: user },
        'selectedWorkSkills._id': { $in: neededSkillIds }
      }).lean()

      const relevantProfiles = allProfiles
        .map(profile => {
          let profileRelevancy = 0

          const skills = profile.selectedWorkSkills.map(sk => {
            let relevancyRating = 0
            const relevantSkill = neededSkills.find(f => f._id === sk._id)
            if (relevantSkill) {
              ++relevancyRating
              const usersOwnSkill = selectedWorkSkills.find(
                f => f._id === sk._id
              )
              profileRelevancy += sk.level
              if (usersOwnSkill) {
                if (usersOwnSkill.level <= sk.level) {
                  ++relevancyRating
                  profileRelevancy += sk.level - usersOwnSkill.level + 1
                } else {
                  profileRelevancy -= sk.level
                }
              }
            }
            return { ...sk, relevancyRating }
          })

          return {
            ...profile,
            skills,
            profileRelevancy
          }
        })
        .filter(({ profileRelevancy }) => profileRelevancy > 0)

      const relatedMentors = []
      await Promise.all(
        relevantProfiles.map(async profile => {
          profile.skills.sort((a, b) => {
            if (a.relevancyRating === b.relevancyRating) {
              return b.level - a.level
            } else return b.relevancyRating - a.relevancyRating
          })
          const foundEmployee = await User.findOne({
            _id: profile.user,
            status: 'active'
          })
          if (foundEmployee) {
            relatedMentors.push({
              _id: foundEmployee._id,
              isActive: true,
              status: foundEmployee.status,
              location: foundEmployee.location || '',
              name: `${foundEmployee.firstName} ${foundEmployee.lastName}`,
              profession: profile.roleAtWork,
              profileRelevancy: profile.profileRelevancy,
              skills: profile.skills
            })
          }
        })
      )

      const recommended = await Promise.all(
        recommendations
          .filter(
            ({ contentId }) =>
              !devPlan.content.some(
                ({ contentId: selectedId, status }) =>
                  String(contentId) === String(selectedId) &&
                  status !== 'INACTIVE'
              )
          )
          .map(async ({ contentId, recommendedBy, recommendedAt }) => {
            const content = await LearningContent.findOne({
              _id: contentId
            }).lean()
            if (content) {
              return {
                ...content,
                recommendedBy,
                recommendedAt
              }
            } else return null
          })
          .filter(item => item !== null)
      )

      relatedMentors.sort((a, b) => b.profileRelevancy - a.profileRelevancy)

      return {
        recommended,
        relatedContentLength,
        relatedContent,
        relatedMentors,
        totalRelatedContent,
        savedForLater: await LearningContent.find({
          _id: { $in: likedContent }
        }).lean()
      }
    },
    // searchLearningContent: async (
    //   _,
    //   { searchString, filters, limit },
    //   { user: { organizationId }, dataSources }
    // ) => {
    //   try {
    //     const foundLearningContent = await LearningContent.find({
    //       ...(searchString && { title: new RegExp(searchString, 'i') })
    //     })
    //       .sort({
    //         _id: -1
    //       })
    //       .limit(limit)
    //       .lean()

    //     const filteredFoundContent = foundLearningContent
    //       .filter(
    //         ({ organizationSpecific }) =>
    //           !organizationSpecific ||
    //           String(organizationSpecific) === organizationId
    //       )
    //       .filter(dataSources.Filters.filterContent({ filters }))

    //     return filteredFoundContent
    //   } catch (e) {
    //     return new Error(e)
    //   }
    // },
    searchLearningContent: async (
      _,
      { searchString, filters, limit },
      { user: { organizationId, _id }, dataSources }
    ) => {
      const interactionsProfile = await UserContentInteractions.findOne({
        user: _id
      }).lean()
      if (!interactionsProfile)
        throw new Error(`Content interaction profile not found`)

      const { sortMethod } = interactionsProfile
      const contentFound = await learningContentSearch(searchString)

      const filteredContentFound = contentFound
        .filter(
          ({ organizationSpecific }) =>
            !organizationSpecific ||
            String(organizationSpecific) === organizationId
        )
        .filter(
          dataSources.Filters.filterContent({
            filters,
            user: _id,
            organizationId
          })
        )

      const sortedSearchedContent = filteredContentFound.sort((a, b) => {
        switch (sortMethod) {
          case 'DATE':
            if (b.publishedDate && a.publishedDate) {
              return new Date(b.publishedDate) - new Date(a.publishedDate)
            } else {
              if (!b.publishedDate) {
                return -1
              } else return 1
            }
          case 'RELEVANCE':
            // if (a.relevanceRating === b.relevanceRating) {
            //   const aDate = new Date(a.publishedDate)
            //   const bDate = new Date(b.publishedDate)
            //   if (aDate === bDate) {
            //     return a.title.localeCompare(b.title)
            //   }
            //   return bDate - aDate
            // }
            return b.relevanceRating - a.relevanceRating
          default:
            return b.relevanceRating - a.relevanceRating
        }
      })

      const slicedContent = sortedSearchedContent.slice(0, limit)

      return { count: filteredContentFound.length, content: slicedContent }
    },
    fetchPDFUploadLink: async (
      _,
      { contentType, contentId },
      { user: { _id } }
    ) => {
      if (contentId) {
        // EDIT CASE
        const content = await LearningContent.findById(contentId)
          .select({ awsId: 1 })
          .lean()

        if (!content) throw new Error(`NOT_FOUND`)

        const contentLink = await getUploadLink({
          _id: content.awsId,
          contentType,
          key: 'user-content'
        })

        return [content.awsId, contentLink]
      }

      // NEW CONTENT CASE
      const usersContent = await LearningContent.find({ uploadedBy: _id })
        .select({ awsId: 1 })
        .lean()

      const usersFileQuota = await userCanUploadFile(
        usersContent.map(c => c.awsId)
      )

      if (usersFileQuota && usersFileQuota.canUpload) {
        const awsId = new ObjectId()
        const contentLink = await getUploadLink({
          _id: awsId,
          contentType,
          key: 'user-content'
        })
        if (contentLink) {
          return [awsId, contentLink]
        } else
          throw new Error(`Could not get content upload link for user: ${_id}`)
      } else return ['MAX_QUOTA_REACHED']
    },
    fetchThumbnailUploadLink: async (_, { contentId, contentType }) => {
      return getUploadLink({
        _id: contentId,
        key: 'learning-content/thumbnails',
        contentType
      })
    },
    fetchContentForOnboardingPlan: async (
      _,
      { neededSkills, filters, contentSeen },
      { user: { organizationId, _id }, dataSources }
    ) => {
      const learningContent = (
        await learningContentForArgs(
          {
            neededSkills,
            selectedSkills: neededSkills.map(
              ({ skillLevel: level, ...rest }) => ({ ...rest, level })
            )
          },
          [],
          [],
          true
        )
      )
        .filter(
          ({ organizationSpecific }) =>
            !organizationSpecific ||
            String(organizationSpecific) === String(organizationId)
        )
        .filter(
          ({ _id: contentId }) =>
            !contentSeen.some(id => String(id) === String(contentId))
        )
        .filter(
          dataSources.Filters.filterContent({
            filters,
            user: _id,
            organizationId
          })
        )

      return arrangeLearning(learningContent)
    },
    fetchContentForNextStepPlan: async (
      _,
      { neededSkills, filters, contentSeen },
      { user: { _id: user, organizationId }, dataSources }
    ) => {
      const userProfile = await UserProfile.findOne({ user })
        .select({ selectedWorkSkills: 1 })
        .lean()

      const developmentPlan = await DevelopmentPlan.findOne({ user })
        .select({ 'content.contentId': 1 })
        .lean()

      const filterDevelopmentPlan = ({ _id }) => {
        if (!developmentPlan || developmentPlan.content.length === 0)
          return true
        return !developmentPlan.content.some(
          ({ contentId }) => String(contentId) === String(_id)
        )
      }

      const learningContent = await learningContentForArgs(
        {
          neededSkills,
          selectedSkills: userProfile ? userProfile.selectedWorkSkills : []
        },
        [],
        [],
        true
      )

      const validContent = learningContent
        .filter(
          ({ organizationSpecific }) =>
            !organizationSpecific ||
            String(organizationSpecific) === String(organizationId)
        )
        .filter(
          ({ _id: contentId }) =>
            !contentSeen.some(id => String(id) === String(contentId))
        )
        .filter(filterDevelopmentPlan)
        .filter(
          dataSources.Filters.filterContent({
            filters,
            user,
            organizationId
          })
        )

      return arrangeLearning(validContent)
    },
    fetchLearningContentRating: async (
      _,
      { learningContentId, organizationId }
    ) => {
      const interactions = await UserContentInteractions.find({
        feedback: { $exists: true },
        'feedback.contentId': learningContentId
      })
        .select({ _id: 1, user: 1, feedback: 1 })
        .lean()

      const userIds = interactions.map(i => i.user)
      const users = await User.find({
        _id: { $in: userIds },
        ...(organizationId && { organizationId })
      })
        .select({
          _id: 1,
          email: 1
        })
        .lean()

      const realUserIds = users
        .filter(user => {
          const emailParts = user.email.split('@')
          return emailParts.length > 1 && emailParts[1] !== 'innential.com'
        })
        .map(user => String(user._id))

      const realInteractions = interactions.filter(i =>
        realUserIds.includes(String(i.user))
      )

      const feedbacks = realInteractions
        .map(i => i.feedback)
        .reduce((acc, curr) => [...acc, ...curr], [])
        .filter(f => f.contentId.toString() === learningContentId.toString())

      const rating = [1, 2, 3, 4, 5].reduce((array, grade) => {
        const gradeRating = {
          grade,
          count: 0,
          interesting: 0,
          uninteresting: 0
        }
        array.push(gradeRating)

        return array
      }, [])

      feedbacks.forEach(feedback => {
        const grade = feedback.value
        const interesting = feedback.interesting

        if (grade >= 1 && grade <= 5) {
          const gradeRating = rating[grade - 1]
          gradeRating.count += 1
          gradeRating.interesting += interesting ? 1 : 0
          gradeRating.uninteresting += !interesting ? 1 : 0
        }
      })

      const sumReducer = (sum, c) => sum + c

      const gradesCount = rating.map(r => r.count).reduce(sumReducer, 0)
      if (gradesCount === 0) {
        return {
          average: 0,
          count: 0,
          rating: []
        }
      }

      rating.forEach(r => (r.countRatio = r.count / gradesCount))

      const gradesSum = rating.map(r => r.grade * r.count).reduce(sumReducer, 0)

      return {
        contentId: learningContentId,
        average: gradesSum / gradesCount,
        count: gradesCount,
        rating
      }
    },
    fetchAllRatedLearningContent: async _ => {
      const interactions = await UserContentInteractions.find({
        feedback: { $exists: true }
      })
        .select({ _id: 1, user: 1, feedback: 1 })
        .lean()

      const userIds = interactions.map(i => i.user)
      const users = await User.find({ _id: { $in: userIds } })
        .select({
          _id: 1,
          email: 1
        })
        .lean()

      const realUserIds = users
        .filter(user => {
          const emailParts = user.email.split('@')
          return emailParts.length > 1 && emailParts[1] !== 'innential.com'
        })
        .map(user => String(user._id))

      const realInteractions = interactions.filter(i =>
        realUserIds.includes(String(i.user))
      )
      const feedbacks = realInteractions
        .map(i => i.feedback)
        .reduce((acc, curr) => [...acc, ...curr], [])

      const allContentIds = feedbacks.map(f => f.contentId)
      const uniqueContentIds = [...new Set(allContentIds)]

      const content = await Promise.all(
        uniqueContentIds.map(async contentId => {
          const rating = [1, 2, 3, 4, 5].reduce((array, grade) => {
            const gradeRating = {
              grade,
              count: 0,
              interesting: 0,
              uninteresting: 0
            }
            array.push(gradeRating)

            return array
          }, [])

          feedbacks.forEach(feedback => {
            if (String(feedback.contentId) === String(contentId)) {
              const grade = feedback.value
              const interesting = feedback.interesting

              if (grade >= 1 && grade <= 5) {
                const gradeRating = rating[grade - 1]
                gradeRating.count += 1
                gradeRating.interesting += interesting ? 1 : 0
                gradeRating.uninteresting += !interesting ? 1 : 0
              }
            }
          })

          const sumReducer = (sum, c) => sum + c

          const gradesCount = rating.map(r => r.count).reduce(sumReducer, 0)
          if (gradesCount === 0) return {}

          rating.forEach(r => (r.countRatio = r.count / gradesCount))

          const gradesSum = rating
            .map(r => r.grade * r.count)
            .reduce(sumReducer, 0)

          const average = gradesSum / gradesCount

          const content = await LearningContent.findById(contentId).lean()
          if (!content) return {}

          content.averageRating = average
          return content
        })
      )

      return content
        .filter(c => Object.keys(c).length !== 0)
        .sort((a, b) => a.averageRating - b.averageRating)
    },
    fetchRatedLearningContentListLength: async _ => {
      const interactions = await UserContentInteractions.find({
        feedback: { $exists: true }
      })
        .select({ _id: 1, user: 1, feedback: 1 })
        .lean()

      const userIds = interactions.map(i => i.user)
      const users = await User.find({ _id: { $in: userIds } })
        .select({
          _id: 1,
          email: 1
        })
        .lean()

      const realUserIds = users
        .filter(user => {
          const emailParts = user.email.split('@')
          return emailParts.length > 1 && emailParts[1] !== 'innential.com'
        })
        .map(user => String(user._id))

      const realInteractions = interactions.filter(i =>
        realUserIds.includes(String(i.user))
      )
      const feedbacks = realInteractions
        .map(i => i.feedback)
        .reduce((acc, curr) => [...acc, ...curr], [])

      const allContentIds = feedbacks.map(f => f.contentId)
      const uniqueContentIds = [...new Set(allContentIds)]

      return uniqueContentIds.length
    }
  }
}
