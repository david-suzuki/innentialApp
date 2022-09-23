import {
  Team,
  UserContentInteractions,
  ContentSources,
  LearningContent,
  User
} from '~/models'
import { sentryCaptureException } from '~/utils'

const day = 86400000
const skillLevels = [
  'BEGINNER',
  'BEGINNER',
  'INTERMEDIATE',
  'INTERMEDIATE',
  'ADVANCED'
]

export const getSharedContentForNotification = async (
  teamId,
  sharedContent
) => {
  const unsentContent = sharedContent.reduce((acc, curr) => {
    if (!curr.includedInEmail) {
      return [...acc, curr]
    } else return acc
  }, [])

  if (unsentContent.length === 0) {
    return null
  }

  const firstSharedContent = unsentContent.reduce((acc, curr) => {
    if (!acc.lastShared) {
      return { ...curr }
    } else if (acc.lastShared > curr.lastShared) {
      return { ...curr }
    } else return { ...acc }
  }, {})

  const { lastShared } = firstSharedContent

  if (new Date() - new Date(lastShared) > day) {
    const team = await Team.findById(teamId).lean()

    const peopleInTeam = [team.leader, ...team.members]

    const memberContentClicks = await Promise.all(
      peopleInTeam.map(async user => {
        const contentProfile = await UserContentInteractions.findOne({ user })
        if (contentProfile) {
          return contentProfile.clickedContent
        } else return []
      })
    )

    // let highestClickNumber = 0
    const sharedByClickNumber = unsentContent.map(shared => {
      const { contentId } = shared

      const nOfClicks = memberContentClicks
        .map(list => {
          if (list.includes(contentId)) {
            return 1
          } else return 0
        })
        .reduce((acc, curr) => acc + curr, 0)
      // if(nOfClicks > highestClickNumber) {
      //   highestClickNumber = nOfClicks
      // }

      return {
        ...shared,
        nOfClicks
      }
    })

    const sortedByHighestClicks = sharedByClickNumber
      .sort((a, b) => {
        return b.nOfClicks - a.nOfClicks
      })
      .slice(0, 3)

    const normalisedContentList = await Promise.all(
      sortedByHighestClicks.map(async shared => {
        const { sharedBy, contentId } = shared
        const normalisedContent = await LearningContent.findById(
          contentId
        ).lean()
        if (!normalisedContent) {
          sentryCaptureException(`Content with id:${contentId} not found`)
        } else
          return {
            ...normalisedContent,
            sharedBy
          }
      })
    )

    const topSharedContent = await Promise.all(
      normalisedContentList.map(async content => {
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

    return topSharedContent
  } else return null
}
