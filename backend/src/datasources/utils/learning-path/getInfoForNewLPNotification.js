import { ContentSources, LearningContent } from '~/models'
import { getDownloadLink } from '~/utils'

const getLearningPathForNewLPNotification = async ({
  pathId,
  pathName,
  pathGoals,
  content,
  appLink
}) => {
  if (!pathId) throw new Error(`Not enough arguments provided`)

  if (content.length === 0) return

  // GET NEXT STEPS FOR USER
  const contentId = content[0].contentId

  const item = await LearningContent.findById(contentId).lean()

  if (!item) throw new Error(`Next resource not found: ${pathId}`)

  const { _id, title, url, source, type, relatedPrimarySkills } = item

  const skills = relatedPrimarySkills.map(({ name }) => name)

  const normalisedSource = await ContentSources.findById(source)
    .select({ name: 1 })
    .lean()

  const nextResource = {
    _id,
    title,
    link: url,
    type,
    source: normalisedSource ? normalisedSource.name : '',
    skills,
    delivery: true,
    appLink
  }

  const goals = pathGoals.map(() => 'ACTIVE')

  const bannerSrc = await getDownloadLink({
    _id: pathId,
    key: 'learning-paths/banners'
  })

  return {
    activePath: {
      pathId,
      pathName,
      imgLink: bannerSrc === null ? null : String(bannerSrc).split('?')[0]
    },
    goals,
    status: 'NOT STARTED',
    nextResource
  }
}

export default getLearningPathForNewLPNotification
