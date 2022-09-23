import MongoDataSourceClass from './_mongo-datasource-class'
import {
  learningContentForArgs,
  learningContentSearch
} from '~/components/LearningContent/form-data/utils'
import {
  UserContentInteractions,
  Skills,
  ContentSources,
  Subscription,
  User
} from '../models'
import { sentryCaptureException } from '~/utils'
import { checkAvailableSubscriptionForSource } from './utils/learning-content'

const escapeRegExp = text => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

const contentTypes = [
  'ARTICLE',
  'E-LEARNING',
  'BOOK',
  'TOOL',
  'EVENT',
  'WORKSHOP',
  'VIDEO',
  'FILE'
]

const difficulties = [
  '',
  'BEGINNER',
  'NOVICE',
  'INTERMEDIATE',
  'ADVANCED',
  'EXPERT'
]
const durationPeriods = ['<1h', '1-3h', '3-6h', '6-9h', '>9h']

const certKey = isCertified => (isCertified ? 'Certified' : 'Not certified')

const langKey = german => (german ? 'German' : 'English')

const countReducer = (acc, curr) => ({
  ...acc,
  [curr]: []
})

const capitalize = str => {
  return str.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

// const skillReducer = (acc, curr) => {
//   const { relatedPrimarySkills } = curr
//   const obj = {}
//   relatedPrimarySkills.forEach(({ _id }) => {
//     if (Array.isArray(acc[_id])) {
//       Object.assign(obj, { [_id]: [...acc[_id], curr] })
//     }
//   })
//   return {
//     ...acc,
//     ...obj
//   }
// }

const priceReducer = (acc, curr) => {
  const price = curr.price.value
  const key = price === 0 ? 'Free' : 'Paid'
  return {
    ...acc,
    [key]: [...(acc[key] || []), curr]
  }
}

// const priceRangeReducer = (acc, curr) => {
//   const price = curr.price.value
//   const low = acc.lowestPrice || price
//   const high = acc.highestPrice || price
//   return {
//     lowestPrice: price < low ? price : low,
//     highestPrice: price > high ? price : high
//   }
// }

const sourceReducer = (acc, curr) => {
  if (!curr.source) {
    return acc
  }
  const source = String(curr.source)
  return {
    ...acc,
    [source]: [...(acc[source] || []), curr]
  }
}

const subscriptionReducer = (content = []) => {
  return (acc, curr) => {
    const key = String(curr.source)

    return {
      ...acc,
      [key]: content.filter(item =>
        checkAvailableSubscriptionForSource(curr, item)
      )
    }
  }
}

// const durationReducer = (acc, curr) => {
//   switch (curr.type) {
//     case 'E-LEARNING':
//       if (curr.duration) {
//         if (curr.duration.hoursMax < 5) {
//           return {
//             ...acc,
//             SHORT: [...acc.SHORT, curr]
//           }
//         } else if (curr.duration.hoursMax < 10) {
//           return {
//             ...acc,
//             MEDIUM: [...acc.MEDIUM, curr]
//           }
//         } else {
//           return {
//             ...acc,
//             LONG: [...acc.LONG, curr]
//           }
//         }
//       }
//       return acc
//     case 'BOOK':
//       return {
//         ...acc,
//         LONG: [...acc.LONG, curr]
//       }
//     case 'TOOL':
//       return acc
//     case 'EVENT':
//       return acc
//     case 'WORKSHOP':
//       return acc
//     default:
//       return {
//         ...acc,
//         SHORT: [...acc.SHORT, curr]
//       }
//   }
// }

const typeReducer = (acc, curr) => {
  const type = curr.type
  if (Array.isArray(acc[type])) {
    return {
      ...acc,
      [type]: [...(acc[type] || []), curr]
    }
  } else {
    return {
      ...acc,
      FILE: [...(acc.FILE || []), curr]
    }
  }
}

const levelReducer = (acc, curr) => {
  const i = curr.relatedPrimarySkills.reduce(
    (acc, { skillLevel: l }) => (l > acc ? l : acc),
    0
  )
  if (i === 0) return acc
  else
    return {
      ...acc,
      [difficulties[i]]: [...(acc[difficulties[i]] || []), curr]
    }
}

const certReducer = (acc, curr) => {
  const key = certKey(curr.certified)
  return {
    ...acc,
    [key]: [...(acc[key] || []), curr]
  }
}

const langReducer = (acc, curr) => {
  const key = langKey(curr.german)
  return {
    ...acc,
    [key]: [...(acc[key] || []), curr]
  }
}

const getContentListForArgs = async ({
  organizationId,
  neededSkills,
  interactionsProfile
}) => {
  const { likedContent, dislikedContent, pastContent } = interactionsProfile

  const cleanArgs = {
    neededSkills
  }

  const learningContent =
    (await learningContentForArgs(
      cleanArgs,
      likedContent,
      dislikedContent,
      true
    )) || []

  return learningContent
    .filter(item =>
      pastContent && pastContent.length && pastContent.length > 0
        ? !pastContent.some(past => String(item._id) === past)
        : true
    )
    .filter(({ organizationSpecific }) =>
      organizationSpecific
        ? String(organizationSpecific) === String(organizationId)
        : true
    )
}

const estimatedDurationByType = {
  ARTICLE: 0,
  VIDEO: 0,
  PODCAST: 1.5,
  BOOK: 6,
  'E-LEARNING': 3,
  default: 0
}

export default new (class extends MongoDataSourceClass {
  // reads
  async findById(docId) {
    return this.model.findById(docId)
  }

  async findByUser(user) {
    return this.model.findOne({ user })
  }

  async getAllResolvers(ids) {
    return this.loadManyByIds(ids)
  }

  filterContent({ filters, excludeFilter, user, organizationId }) {
    if (!filters) return () => true

    const {
      preferredSkills = [],
      price = [],
      priceRange,
      preferredSources = [],
      preferredTypes = [],
      durationEnabled,
      durationRanges,
      preferredDifficulty = [],
      preferredCertified = [],
      preferredLanguage = [],
      preferredSubscription = []
    } = filters

    return ({
      title,
      relatedPrimarySkills,
      price: { value },
      source,
      udemyCourseId,
      type,
      duration,
      certified,
      german,
      uploadedBy,
      organizationSpecific
    }) => {
      const skillIds = relatedPrimarySkills.map(skill => skill._id)
      const skillCheck =
        preferredSkills.length === 0 ||
        preferredSkills.every(
          ({ _id: skillId, name }) =>
            skillIds.some(_id => String(_id) === String(skillId)) ||
            new RegExp(escapeRegExp(name), 'i').test(title)
        )

      const priceTag = value === 0 ? 'FREE' : 'PAID'
      const priceCheck =
        excludeFilter === 'price' ||
        price.length === 0 ||
        price.includes(priceTag)

      const priceRangeCheck =
        !priceRange ||
        (value === 0 && price.includes('FREE')) ||
        price.length === 0 ||
        ((!priceRange.maxPrice ||
          (priceRange.maxPrice && value <= priceRange.maxPrice)) &&
          value >= priceRange.minPrice)

      const sourceCheck =
        excludeFilter === 'preferredSources' ||
        preferredSources.length === 0 ||
        preferredSources.some(
          sourceId => String(sourceId) === String(source)
        ) ||
        preferredSources.some(
          sourceId => String(sourceId) === String(uploadedBy)
        ) ||
        preferredSources.some(
          sourceId =>
            String(organizationId) === String(sourceId) &&
            String(organizationSpecific) === String(sourceId)
        )

      const typeCheck =
        excludeFilter === 'preferredTypes' ||
        preferredTypes.length === 0 ||
        preferredTypes.includes(type) ||
        (preferredTypes.includes('FILE') && !contentTypes.includes(type))

      const i = relatedPrimarySkills.reduce(
        (acc, { skillLevel: l }) => (l > acc ? l : acc),
        0
      )
      const difficulty = difficulties[i]
      const difficultyCheck =
        excludeFilter === 'preferredDifficulty' ||
        preferredDifficulty.length === 0 ||
        preferredDifficulty.includes(difficulty)

      const durationCheck =
        !durationEnabled ||
        durationRanges.some(range => {
          const maxHours = duration && duration.hours
          const hoursMax = duration && !maxHours ? duration.hoursMax : null
          const hoursMin = duration && !maxHours ? duration.hoursMin : null

          if (maxHours !== null && maxHours !== undefined) {
            if (duration.minutes) {
              return (
                range.maxHours >= maxHours + 0.5 &&
                range.minHours <= maxHours + 0.5
              )
            } else {
              return range.maxHours >= maxHours && range.minHours <= maxHours
            }
          } else if (
            hoursMax !== null &&
            hoursMax !== undefined &&
            hoursMin !== null &&
            hoursMin !== undefined
          ) {
            return hoursMax <= range.maxHours && hoursMin >= range.minHours
          } else {
            return false
          }
        }) ||
        (durationRanges.length == 1 &&
          durationRanges[0].minHours == 0 &&
          durationRanges[0].maxHours == 10)

      const certifiedCheck =
        excludeFilter === 'preferredCertified' ||
        preferredCertified.length === 0 ||
        preferredCertified.includes(certKey(certified))

      const langCheck =
        excludeFilter === 'preferredLanguage' ||
        preferredLanguage.length === 0 ||
        preferredLanguage.includes(langKey(german))

      const subCheck =
        preferredSubscription.length === 0 ||
        preferredSubscription.some(({ name, _id: sourceId }) =>
          checkAvailableSubscriptionForSource(
            { name, source: sourceId },
            { source, udemyCourseId }
          )
        )

      return (
        skillCheck &&
        priceCheck &&
        priceRangeCheck &&
        sourceCheck &&
        typeCheck &&
        difficultyCheck &&
        durationCheck &&
        certifiedCheck &&
        langCheck &&
        subCheck
      )
    }
  }

  async getFiltersForUser({
    user,
    organizationId,
    neededSkills = [],
    extraSkills = [],
    filters,
    search,
    inDPSetting
  }) {
    const interactionsProfile = await UserContentInteractions.findOne({
      user
    }).lean()

    if (!interactionsProfile)
      throw new Error(`Content interaction profile not found`)

    if (neededSkills.length === 0) {
      return {
        _id: interactionsProfile._id,
        skillPrefs: [],
        extraSkillPrefs: [],
        languagePref: [],
        pricePref: [],
        // priceRangePref,
        sourcePrefs: [],
        // durationPref,
        typePrefs: [],
        levelPref: [],
        certPref: []
      }
    }

    // const organization = await Organization.findById(organizationId)
    //   .select({ corporate: 1 })
    //   .lean()

    let content = []
    if (!search) {
      const skills = [...neededSkills, ...extraSkills]
      content = await getContentListForArgs({
        organizationId,
        neededSkills: skills,
        interactionsProfile
      })
      if (content.length === 0 && inDPSetting) {
        const skillNames = skills.map(skill => skill.name).join(' ')
        content = await learningContentSearch(skillNames, organizationId)
      }
    } else {
      content = await learningContentSearch(search, organizationId)
    }

    // content = content.filter(this.filterContent({ filters }))

    // const skillObj = neededSkills.reduce(
    //   (acc, { _id }) => ({
    //     ...acc,
    //     [_id]: []
    //   }),
    //   {}
    // )

    // // REDUCE BY SKILL
    // const skillCount = content.reduce(skillReducer, skillObj)

    const skillPrefWithNull = await Promise.all(
      neededSkills
        .map(({ _id, name }) => {
          return {
            _id,
            value: content.filter(
              ({ title, relatedPrimarySkills }) =>
                relatedPrimarySkills
                  .map(skill => skill._id)
                  .some(skillId => String(_id) === String(skillId)) ||
                new RegExp(escapeRegExp(name), 'i').test(title)
            )
          }
        })
        .sort(
          ({ value: value1 }, { value: value2 }) =>
            value2.length - value1.length
        )
        .map(async ({ _id, value }) => {
          const skill = await Skills.findById(_id)
          if (!skill) {
            sentryCaptureException(
              `Skill with ID:${_id} from user profile:${user} not found`
            )
            return null
          }
          return {
            _id,
            name: skill.name,
            count: value.filter(
              this.filterContent({
                filters,
                user: user,
                organizationId: organizationId
              })
            ).length
          }
        })
    )
    const skillPrefs = skillPrefWithNull.filter(skill => skill !== null)

    // const extraSkillObj = extraSkills.reduce(
    //   (acc, { _id }) => ({
    //     ...acc,
    //     [_id]: []
    //   }),
    //   {}
    // )

    // REDUCE BY SKILL
    // const extraSkillCount = content.reduce(skillReducer, extraSkillObj)

    const extraSkillPrefWithNull = await Promise.all(
      extraSkills
        .map(({ _id, name }) => {
          return {
            _id,
            value: content.filter(
              ({ title, relatedPrimarySkills }) =>
                relatedPrimarySkills
                  .map(skill => skill._id)
                  .some(skillId => String(_id) === String(skillId)) ||
                new RegExp(escapeRegExp(name), 'i').test(title)
            )
          }
        })
        .sort(
          ({ value: value1 }, { value: value2 }) =>
            value2.length - value1.length
        )
        .map(async ({ _id, value }) => {
          const skill = await Skills.findById(_id)
          if (!skill) {
            sentryCaptureException(
              `Skill with ID:${_id} from user profile:${user} not found`
            )
            return null
          }
          return {
            _id,
            name: skill.name,
            count: value.filter(
              this.filterContent({
                filters,
                user: user,
                organizationId: organizationId
              })
            ).length
          }
        })
    )
    const extraSkillPrefs = extraSkillPrefWithNull.filter(
      skill => skill !== null
    )

    const durationPref = durationPeriods.map(period => {
      if (period === '<1h') {
        return {
          _id: period,
          maxHours: 1,
          minHours: 0,
          count: content.filter(content => {
            const maxHours = content.duration
              ? content.duration.basis === 'ONE TIME'
                ? content.duration.hours
                : null
              : estimatedDurationByType[content.type] ||
                estimatedDurationByType.default
            const hoursMax =
              content.duration && !maxHours ? content.duration.hoursMax : null
            const hoursMin =
              content.duration && !maxHours ? content.duration.hoursMin : null
            if (maxHours !== null && maxHours !== undefined && maxHours < 1) {
              return true
            } else if (
              hoursMax !== null &&
              hoursMax !== undefined &&
              hoursMax < 1
            ) {
              return true
            } else {
              return false
            }
          }).length
        }
      } else if (period === '1-3h') {
        return {
          _id: period,
          maxHours: 3,
          minHours: 1,
          count: content.filter(content => {
            const maxHours = content.duration && content.duration.hours
            const hoursMax =
              content.duration && !maxHours ? content.duration.hoursMax : null
            const hoursMin =
              content.duration && !maxHours ? content.duration.hoursMin : null
            if (maxHours !== null && maxHours !== undefined) {
              if (content.duration.minutes) {
                return maxHours + 0.5 <= 3 && maxHours + 0.5 >= 1
              } else {
                return maxHours <= 3 && maxHours >= 1
              }
            } else if (
              hoursMax !== null &&
              hoursMax !== undefined &&
              hoursMin !== null &&
              hoursMin !== undefined
            ) {
              return hoursMax <= 3 && hoursMin >= 1
            } else {
              return false
            }
          }).length
        }
      } else if (period === '3-6h') {
        return {
          _id: period,
          maxHours: 6,
          minHours: 3,
          count: content.filter(content => {
            const maxHours = content.duration && content.duration.hours
            const hoursMax =
              content.duration && !maxHours ? content.duration.hoursMax : null
            const hoursMin =
              content.duration && !maxHours ? content.duration.hoursMin : null
            if (maxHours !== null && maxHours !== undefined) {
              if (content.duration.minutes) {
                return maxHours + 0.5 <= 6 && maxHours + 0.5 >= 3
              } else {
                return maxHours <= 6 && maxHours >= 3
              }
            } else if (
              hoursMax !== null &&
              hoursMax !== undefined &&
              hoursMin !== null &&
              hoursMin !== undefined
            ) {
              return hoursMax <= 6 && hoursMin >= 3
            } else {
              return false
            }
          }).length
        }
      } else if (period === '6-9h') {
        return {
          _id: period,
          maxHours: 9,
          minHours: 6,
          count: content.filter(content => {
            const maxHours = content.duration && content.duration.hours
            const hoursMax =
              content.duration && !maxHours ? content.duration.hoursMax : null
            const hoursMin =
              content.duration && !maxHours ? content.duration.hoursMin : null
            if (maxHours !== null && maxHours !== undefined) {
              if (content.duration.minutes) {
                return maxHours + 0.5 <= 9 && maxHours + 0.5 >= 6
              } else {
                return maxHours <= 9 && maxHours >= 6
              }
            } else if (
              hoursMax !== null &&
              hoursMax !== undefined &&
              hoursMin !== null &&
              hoursMin !== undefined
            ) {
              return hoursMax <= 9 && hoursMin >= 6
            } else {
              return false
            }
          }).length
        }
      } else if (period === '>9h') {
        return {
          _id: period,
          maxHours: 2147483647,
          minHours: 9,
          count: content.filter(content => {
            const maxHours = content.duration && content.duration.hours
            const hoursMax =
              content.duration && !maxHours ? content.duration.hoursMax : null
            const hoursMin =
              content.duration && !maxHours ? content.duration.hoursMin : null
            if (
              maxHours !== null &&
              maxHours !== undefined &&
              maxHours <= 2147483647 &&
              maxHours >= 9
            ) {
              return true
            } else if (
              hoursMax !== null &&
              hoursMax !== undefined &&
              hoursMax <= 2147483647 &&
              hoursMin !== null &&
              hoursMin !== undefined &&
              hoursMin >= 9
            ) {
              return true
            } else {
              return false
            }
          }).length
        }
      }
    })

    // let languagePref = []

    // if (organization && organization.corporate) {
    // REDUCE BY LANGUAGE
    const langCount = content.reduce(langReducer, {})

    const languagePref = await Object.entries(langCount).map(
      async ([name, value]) => {
        return {
          _id: name,
          name,
          count: value.filter(
            this.filterContent({
              filters,
              excludeFilter: 'preferredLanguage',
              user: user,
              organizationId: organizationId
            })
          ).length
        }
      }
    )
    // }

    // skillPrefs.sort((a, b) => b.count - a.count)

    const priceObj = { Free: [], Paid: [] }
    // REDUCE BY PRICE
    const priceCount = content.reduce(priceReducer, priceObj)

    const pricePref = await Object.entries(priceCount).map(
      async ([name, value]) => {
        return {
          _id: name.toUpperCase(),
          name,
          count: value.filter(
            this.filterContent({
              filters,
              excludeFilter: 'price',
              user: user,
              organizationId: organizationId
            })
          ).length
        }
      }
    )

    // FIND PRICE RANGE
    // const priceRangePref = content.reduce(priceRangeReducer, {})

    // REDUCE BY SOURCE
    const sourceCount = content.reduce(sourceReducer, {})

    const sourcePrefWithNull = await Promise.all(
      Object.entries(sourceCount).map(async ([_id, value]) => {
        const source = await ContentSources.findById(_id)
        if (!source) {
          sentryCaptureException(`Source with ID:${_id} not found`)
          return null
        }
        return {
          _id,
          name: source.name,
          count: value.filter(
            this.filterContent({
              filters,
              excludeFilter: 'preferredSources',
              user: user,
              organizationId: organizationId
            })
          ).length
        }
      })
    )
    let userContentSource = {
      _id: user,
      name: 'My Uploads',
      count: content.filter(value => {
        return value.uploadedBy == user
      }).length
    }
    let organizationContentSource = {
      _id: organizationId,
      name: 'Company Uploads',
      count: content.filter(value => {
        return String(value.organizationSpecific) === String(organizationId)
      }).length
    }

    const sourcePrefs = [
      userContentSource,
      organizationContentSource,
      ...sourcePrefWithNull.filter(source => source !== null)
    ].filter(({ count }) => count > 0)
    sourcePrefs.sort((a, b) => b.count - a.count)

    // REDUCE BY DURATION
    // const durationCount = content.reduce(durationReducer, {
    //   SHORT: [],
    //   MEDIUM: [],
    //   LONG: []
    // })

    // const durationTexts = {
    //   SHORT: '1-5 hours',
    //   MEDIUM: '5-10 hours',
    //   LONG: '10+ hours'
    // }

    // const durationPref = Object.entries(durationCount).map(([key, value]) => {
    //   return {
    //     _id: key,
    //     name: durationTexts[key],
    //     count: value.filter(
    //       this.filterContent({ filters, excludeFilter: 'preferredDuration' })
    //     ).length
    //   }
    // })

    const typeObj = contentTypes.reduce(countReducer, {})

    // REDUCE BY TYPE
    const typeCount = content.reduce(typeReducer, typeObj)

    let typePrefs = await Promise.all(
      await Object.entries(typeCount).map(async ([key, value]) => {
        return {
          _id: key,
          name: capitalize(key),
          count: value.filter(
            this.filterContent({
              filters,
              excludeFilter: 'preferredTypes',
              user: user,
              organizationId: organizationId
            })
          ).length
        }
      })
    )
    typePrefs = typePrefs.filter(({ count }) => count > 0)

    typePrefs.sort((a, b) => b.count - a.count)

    const levelObj = difficulties.reduce(countReducer, {})
    // REDUCE BY DIFFICULTY
    const levelCount = content.reduce(levelReducer, levelObj)

    const levelPref = await Object.entries(levelCount)
      .slice(1, 6)
      .map(async ([key, value]) => {
        return {
          _id: key,
          name: capitalize(key),
          count: value.filter(
            this.filterContent({
              filters,
              excludeFilter: 'preferredDifficulty',
              user: user,
              organizationId: organizationId
            })
          ).length
        }
      })

    // REDUCE BY DIFFICULTY
    const certCount = content.reduce(certReducer, {})

    const certPref = await Object.entries(certCount).map(
      async ([name, value]) => {
        return {
          _id: name,
          name,
          count: value.filter(
            this.filterContent({
              filters,
              excludeFilter: 'preferredCertified',
              user: user,
              organizationId: organizationId
            })
          ).length
        }
      }
    )

    // REDUCE BY AVAILABLE SUBSCRIPTION
    const availableSubscriptions = await Subscription.find({
      organizationId,
      active: true
    })
      .select({ name: 1, source: 1 })
      .lean()

    const subCount = availableSubscriptions.reduce(
      subscriptionReducer(content),
      {}
    )

    const subscriptionPref = await availableSubscriptions.map(
      async ({ name, source }) => {
        const key = String(source)
        return {
          _id: source,
          name,
          count: subCount[key].filter(
            this.filterContent({
              filters,
              excludeFilter: 'preferredSubscription',
              user: user,
              organizationId: organizationId
            })
          ).length
        }
      }
    )

    return {
      _id: interactionsProfile._id,
      skillPrefs,
      extraSkillPrefs,
      languagePref,
      pricePref,
      // priceRangePref,
      sourcePrefs,
      durationPref,
      typePrefs,
      levelPref,
      certPref,
      subscriptionPref
    }
  }
})(UserContentInteractions)
