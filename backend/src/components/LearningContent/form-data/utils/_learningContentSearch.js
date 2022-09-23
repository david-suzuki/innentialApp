import { algolia } from '../../../../config'
import { LearningContent, Skills, ContentSources } from '~/models'
import { ENVIRONMENT } from '~/environment'

// export const contentMatch = async (skillName, contentId) => {
//   return algolia
//     .findObject(hit => hit.objectID == contentId, {
//       query: skillName
//     })
//     .then(({ object: { _highlightResult: match } }) => {
//       return Object.entries(match).some(
//         ([key, value]) => value.matchLevel === 'full' || 'partial'
//       )
//     })
//     .catch(() => false)
// }

export default async searchString => {
  const forbiddenSkills = (
    await Skills.find({
      contentCount: { $lt: 5 }
    })
      .select({ _id: 1 })
      .lean()
  ).map(({ _id }) => _id)

  const disabledSources = await ContentSources.find({ enabled: false }).lean()

  if (process.env.SERVER === ENVIRONMENT.PRODUCTION) {
    const { hits } = await algolia.search(searchString, {
      hitsPerPage: 200
    })
    const hitIds = hits.map(hit => hit.objectID)

    return LearningContent.find({
      _id: { $in: hitIds },
      inactive: { $ne: true },
      'relatedPrimarySkills._id': { $nin: forbiddenSkills },
      source: { $nin: disabledSources.map(({ _id }) => _id) }
    }).lean()
  } else {
    const searchRegexp = new RegExp(
      `${searchString.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}`,
      'i'
    )

    let searchQuery
    let searchedContent = []

    searchQuery = {
      $and: [
        {
          $or: [
            { title: { $regex: searchRegexp } },
            { 'relatedPrimarySkills.name': { $regex: searchRegexp } }
          ]
        },
        { 'relatedPrimarySkills._id': { $nin: forbiddenSkills } },
        { inactive: { $ne: true } },
        { source: { $nin: disabledSources.map(({ _id }) => _id) } }
        // {
        //   $or: [
        //     { organizationSpecific: null },
        //     { organizationSpecific: organizationId }
        //   ]
        // }
        // { type: ['WORKSHOP', 'EVENT', 'E-LEARNING', 'BOOK'] }
      ]
    }

    searchedContent = await LearningContent.find(searchQuery)
      // .sort({ createdAt: -1 })
      .lean()

    if (searchedContent.length === 0) {
      const individualStrings = searchString
        .split(' ')
        .reduce((acc = [], curr) => {
          if (curr.length === 1) return acc
          else return [...acc, curr]
        }, [])
        .map(
          st =>
            new RegExp(`^${st.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}`, 'i')
        )

      searchQuery = {
        $and: [
          {
            $or: [
              { title: { $in: individualStrings } },
              { 'relatedPrimarySkills.name': { $in: individualStrings } },
              { author: { $in: individualStrings } }
            ]
          },
          { inactive: { $ne: true } },
          { 'relatedPrimarySkills._id': { $nin: forbiddenSkills } },
          { source: { $nin: disabledSources.map(({ _id }) => _id) } }
          // {
          //   $or: [
          //     { organizationSpecific: null },
          //     { organizationSpecific: organizationId }
          //   ]
          // }
          // { type: ['WORKSHOP', 'EVENT', 'E-LEARNING', 'BOOK'] }
        ]
      }

      searchedContent = await LearningContent.find(searchQuery)
        // .sort({ createdAt: -1 })
        .lean()
    }
    return searchedContent
  }
}
