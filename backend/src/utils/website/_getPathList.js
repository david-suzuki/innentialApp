import {
  LearningPathTemplate,
  Skills,
  GoalTemplate,
  LearningContent
} from '~/models'
import { getDownloadLink } from '../'
import { prepLearningForWebsite } from './'

const listOrder = [
  'Learning Paths you would love',
  'Digital Skills',
  'Personal Productivity',
  'Product and Innovation',
  'DevOps',
  'Sales',
  'For Leaders',
  'Marketing',
  'Human Resources',
  'People Development',
  'Teamwork',
  'Other'
].reverse()

const uncategorised = 'Other'

const getPathList = async () => {
  const paths = await LearningPathTemplate.find({
    active: true,
    organization: null
  })
    .select({
      _id: 1,
      name: 1,
      description: 1,
      abstract: 1,
      duration: 1,
      skills: 1,
      goalTemplate: 1,
      prerequisites: 1,
      publishedDate: 1,
      targetGroup: 1,
      author: 1,
      authorDescription: 1,
      authorPosition: 1,
      trending: 1,
      paid: 1,
      startConditions: 1
      // category: 1
    })
    .sort({ createdAt: -1 })
    .lean()

  const denormalisedPaths = await Promise.all(
    paths.map(async ({ _id, goalTemplate, targetGroup, skills, ...path }) => {
      const goalTemplates = await GoalTemplate.find({
        _id: { $in: goalTemplate }
      })
        .select({ _id: 1, goalName: 1, content: 1 })
        .lean()

      const stringifiedArray = goalTemplate.map(String)

      goalTemplates.sort((a, b) => {
        const i1 = stringifiedArray.indexOf(String(a._id))
        const i2 = stringifiedArray.indexOf(String(b._id))

        return i1 - i2
      })

      const bannerSrc = await getDownloadLink({
        _id,
        key: 'learning-paths/banners'
      })
      const authorImageSrc = await getDownloadLink({
        _id,
        key: 'learning-paths/authors'
      })
      const authorCompanyLogoSrc = await getDownloadLink({
        _id,
        key: 'learning-paths/company-logos'
      })
      return {
        _id,
        ...path,
        targetGroup: targetGroup || uncategorised,
        authorImageSrc:
          authorImageSrc === null ? '' : String(authorImageSrc).split('?')[0],
        bannerSrc: bannerSrc === null ? '' : String(bannerSrc).split('?')[0],
        authorCompanyLogoSrc:
          authorCompanyLogoSrc === null
            ? ''
            : String(authorCompanyLogoSrc).split('?')[0],
        skills: await Skills.find({ _id: { $in: skills } })
          .select({ name: 1, _id: 0 })
          .lean(),
        goalTemplate: await Promise.all(
          goalTemplates.map(
            async (
              { _id: _, relatedSkills, content = [], ...goalTemplate },
              i
            ) => {
              const learning = (
                await Promise.all(
                  content
                    .slice(0, i > 0 ? undefined : 2)
                    .map(async ({ contentId, note }) => {
                      const item = await LearningContent.findById(contentId)
                        .select({
                          _id: 1,
                          title: 1,
                          url: 1,
                          author: 1,
                          type: 1,
                          price: 1,
                          source: 1,
                          duration: 1
                        })
                        .lean()
                      if (!item) return null
                      return {
                        ...item,
                        note
                      }
                    })
                )
              ).filter(item => !!item)
              return {
                ...goalTemplate,
                content: await prepLearningForWebsite(learning, false, i)
              }
            }
          )
        )
      }
    })
  )

  denormalisedPaths.sort(
    (a, b) =>
      listOrder.indexOf(b.targetGroup) - listOrder.indexOf(a.targetGroup)
  )

  // PATH GROUPING BY TARGET GROUP ([] => { 'TARGET1': [], 'TARGET2': []... })
  return denormalisedPaths.reduce((acc, curr) => {
    const group = curr.targetGroup
    return {
      ...acc,
      [group]: [...(acc[group] || []), curr]
    }
  }, {})
}

export default getPathList
