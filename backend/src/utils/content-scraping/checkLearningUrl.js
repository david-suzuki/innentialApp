import { LearningContent, Skills } from '~/models'

const checkLearningUrl = async source => {
  const formattedSource = source
    .replace('?', '\\?')
    .replace('https:', 'https?:')
    .replace('http:', 'https?:')
    .trim()
  let srcRegExp
  if (formattedSource.endsWith('/')) {
    srcRegExp = new RegExp(formattedSource.slice(0, -1))
  } else srcRegExp = new RegExp(formattedSource)
  const content = await LearningContent.findOne({
    url: { $regex: srcRegExp }
  }).lean()
  if (content) {
    const skillSlugs = await Promise.all(
      content.relatedPrimarySkills.map(async skill => {
        const normalisedSkill = await Skills.findById(skill._id).lean()
        if (normalisedSkill.slug) {
          return normalisedSkill.slug
        }
      })
    )
    const {
      duration,
      price: { value: price },
      externalRating,
      nOfReviews,
      title,
      certified
    } = content
    return {
      "related_skills": skillSlugs.join(","), // eslint-disable-line
      duration,
      price,
      title,
      certified,
      "external_rating": externalRating, // eslint-disable-line
      "n_of_reviews": nOfReviews // eslint-disable-line
    }
  } else return false
}

export default checkLearningUrl
