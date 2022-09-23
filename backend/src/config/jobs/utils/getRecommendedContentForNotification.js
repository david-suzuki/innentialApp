import {
  UserContentInteractions,
  ContentSources,
  LearningContent,
  User
} from '~/models'
import { sentryCaptureException } from '~/utils'

const skillLevels = [
  'BEGINNER',
  'BEGINNER',
  'INTERMEDIATE',
  'INTERMEDIATE',
  'ADVANCED'
]

export const getRecommendedContentForNotification = async user => {
  const userContentProfile = await UserContentInteractions.findOne({ user })
    .select({ recommended: 1 })
    .lean()
  if (userContentProfile) {
    const { recommended = [] } = userContentProfile

    const unsentContent = recommended.reduce((acc, curr) => {
      if (!curr.includedInEmail) {
        return [...acc, curr]
      } else return acc
    }, [])

    if (unsentContent.length > 0) {
      const normalisedContentList = await Promise.all(
        unsentContent.map(async unsent => {
          const { recommendedBy: sharedBy, contentId } = unsent
          const normalisedContent = await LearningContent.findById(
            contentId
          ).lean()
          if (!normalisedContent) {
            sentryCaptureException(`Content with id:${contentId} not found`)
            return null
          } else
            return {
              ...normalisedContent,
              sharedBy
            }
        })
      )

      const filteredContent = normalisedContentList.reduce((acc, curr) => {
        if (curr !== null) {
          return [...acc, curr]
        } else return acc
      }, [])

      const recommendationsToSend = await Promise.all(
        filteredContent.map(async content => {
          const {
            _id,
            title,
            url,
            source,
            type,
            relatedPrimarySkills,
            price,
            sharedBy
          } = content
          let highestSkillLevel = 0
          const remappedSkills = relatedPrimarySkills.map(skill => {
            const { skillLevel, name } = skill
            if (skillLevel > highestSkillLevel) {
              highestSkillLevel = skillLevel
            }
            return name
          })
          const paid = price.value > 0

          const userShared = await User.findById(sharedBy)
          const normalisedSource = await ContentSources.findById(source)
          let sourceName = ''
          let sharedByName = ''
          if (!normalisedSource) {
            sentryCaptureException(`Source for content ${_id} not found`)
          } else {
            sourceName = normalisedSource.name
          }
          if (!userShared) {
            sentryCaptureException(`User with id:${sharedBy} not found`)
          } else {
            sharedByName = `${userShared.firstName}${
              userShared.lastName ? ' ' + userShared.lastName : ''
            }`
          }

          return {
            _id,
            title,
            paid,
            type,
            link: url,
            source: sourceName,
            level: skillLevels[highestSkillLevel],
            skills: remappedSkills,
            sharedBy: {
              _id: sharedBy,
              name: sharedByName
            }
          }
        })
      )

      return recommendationsToSend
    }
  }
  return null
}
