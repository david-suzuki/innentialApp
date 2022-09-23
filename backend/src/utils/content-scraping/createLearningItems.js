import { Skills, LearningContent, ContentSources } from '~/models'
import { Types } from 'mongoose'
import { skillLevelsBySpider } from './skillLevels'
import { algolia } from '~/config'
import { ENVIRONMENT } from '~/environment'

const ObjectId = Types.ObjectId

const createLearningItem = async item => {
  if (!Array.isArray(item.primary_skills)) {
    console.log(`No primary skills for item:${item.source_url}`)
    return
  }
  // console.log(`Full item: `, item)

  // URL check
  // const formattedSource = item.source_url
  //   .replace('?', '\\?')
  //   .replace('https:', 'https?:')
  //   .replace('http:', 'https?:')
  //   .trim()
  // let srcRegExp
  // if (formattedSource.endsWith('/')) {
  //   srcRegExp = new RegExp(formattedSource.slice(0, -1))
  // } else srcRegExp = new RegExp(formattedSource)

  let { skillLevel } =
    skillLevelsBySpider[item.scraper_name] || skillLevelsBySpider['default']

  if (item.difficulty_level !== null && item.difficulty_level !== undefined)
    skillLevel = item.difficulty_level

  const existingContent = await LearningContent.findOne({
    url: item.source_url
  })
    .select({ _id: 1 })
    .lean()

  const relatedPrimarySkills = (
    await Promise.all(
      item.primary_skills.map(async ({ slug, importance }) => {
        const skill = await Skills.findOne({ slug, organizationSpecific: null })
          .select({ _id: 1, name: 1 })
          .lean()

        if (!skill) return null

        return {
          _id: skill._id,
          name: skill.name,
          skillLevel,
          importance
        }
      })
    )
  ).filter(item => !!item) // REMOVE NULLS

  // Skills.find({
  //   slug: { $in: item.primary_skills.split(', ') },
  //   organizationSpecific: null
  // })

  if (relatedPrimarySkills.length === 0)
    throw new Error(
      `${item.primary_skills} none of the skills found in database`
    )

  let relatedSecondarySkills = []

  if (item.secondary_skills) {
    relatedSecondarySkills = await Skills.find({
      slug: {
        $in: item.secondary_skills.split(', '),
        $nin: item.primary_skills.map(({ slug }) => slug)
      },
      organizationSpecific: null
    })
      .select({ _id: 1, name: 1 })
      .lean()
  }

  // const relatedPrimarySkills = relatedPrimarySkills.map(skill => {
  //   return {
  //     _id: skill._id,
  //     name: skill.name,
  //     importance,
  //     skillLevel
  //   }
  // })
  // const primarySkillIds = relatedPrimarySkills.map(({ _id }) => _id)

  // const mappedSecondarySkills = relatedSecondarySkills.map(skill => {
  //   return {
  //     _id: skill._id,
  //     name: skill.name
  //   }
  // })
  // const secondarySkillIds = mappedSecondarySkills.map(({ _id }) => _id)

  // console.log('Item related secondary skills: ', relatedSecondarySkills)
  if (existingContent) {
    // await LearningContent.findOneAndUpdate(
    //   { _id: existingContent._id },
    //   {
    //     $pull: {
    //       relatedPrimarySkills: {
    //         _id: { $in: primarySkillIds }
    //       },
    //       relatedSecondarySkills: {
    //         _id: { $in: secondarySkillIds }
    //       }
    //     }
    //   }
    // )

    LearningContent.findOneAndUpdate(
      { _id: existingContent._id },
      {
        // $addToSet: {
        //   relatedPrimarySkills: {
        //     $each: relatedPrimarySkills
        //   },
        //   relatedSecondarySkills: {
        //     $each: mappedSecondarySkills
        //   }
        // },
        $set: {
          relatedPrimarySkills,
          relatedSecondarySkills,
          updatedAt: new Date(),
          certified: item.certified,
          toCleanup: false,
          lastCleanedAt: new Date(),
          ...(item.new_url && { url: item.new_url }),
          ...(item.title && { title: item.title }),
          ...(typeof item.price === 'number' && { 'price.value': item.price }),
          ...(item.duration && { duration: item.duration }),
          ...(item.external_rating && { externalRating: item.external_rating }),
          ...(item.n_of_reviews && { nOfReviews: item.n_of_reviews })
        }
      }
    )
      .then(() => console.log(`Updated item with ID:${existingContent._id}`))
      .catch(err => {
        throw new Error(err)
      })
  } else {
    const _id = new ObjectId()
    const url = item.original_url ? item.original_url : item.source_url
    const pathArray = url.split('/')
    const protocol = pathArray[0]
    let host = pathArray[2]
    if (host.split('.')[0] === 'www') {
      host = host.slice(4)
    }
    const baseUrl = protocol + '//' + host
    const urlRegExp = new RegExp(
      baseUrl.replace('https:', 'https?:').replace('http:', 'https?:')
    )
    const contentSource = await ContentSources.findOne({
      $or: [
        {
          baseUrls: { $in: [urlRegExp] }
        },
        {
          slug: item.scraper_name
        }
      ]
    })
    if (!contentSource)
      throw new Error(
        `Content source for url:${baseUrl} not on the source whitelist`
      )
    const inputData = {
      _id,
      title: item.title,
      publishedDate: item.date ? new Date(item.date) : new Date(),
      author: item.author,
      source: contentSource._id,
      url,
      type: item.item_type.toUpperCase(),
      relatedPrimarySkills,
      relatedSecondarySkills,
      duration: item.duration,
      price: {
        currency: 'EUR',
        value: item.price || 0
      },
      externalRating: item.external_rating,
      nOfReviews: item.n_of_reviews,
      spider: item.scraper_name,
      certified: item.certified
    }
    LearningContent.create(inputData)
      .then(() => {
        if (process.env.SERVER === ENVIRONMENT.PRODUCTION) {
          algolia
            .saveObject({
              objectID: _id,
              title: item.title,
              author: item.author,
              relatedPrimarySkills: relatedPrimarySkills.map(
                skill => skill.name
              )
            })
            .then(() => console.log(`Created item with ID:${_id}`))
            .catch(e => {
              throw new Error(e)
            })
        }
      })
      .catch(err => {
        throw new Error(err)
      })
  }
}

export default createLearningItem
