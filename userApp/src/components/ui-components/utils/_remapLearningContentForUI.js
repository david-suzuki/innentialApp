import React from 'react'
import variables from '../../../styles/variables'
import { ReactComponent as IconVideo } from '../../../static/video.svg'
import { ReactComponent as IconArticleBook } from '../../../static/article.svg'
import { ReactComponent as IconRequest } from '../../../static/lock.svg'
import { ReactComponent as IconLoaderRequest } from '../../../static/loader-learning.svg'
import { ReactComponent as IconCourse } from '../../../static/course.svg'
import { ReactComponent as IconDelivery } from '../../../static/send.svg'
import { ReactComponent as IconLoaderDelivery } from '../../../static/loader.svg'
import { ReactComponent as IconPodcast } from '../../../static/speaker.svg'
import { ReactComponent as IconWarning } from '../../../static/warning.svg'

const IconByType = ({ type }) => {
  switch (type) {
    case 'ARTICLE':
      return <IconArticleBook />

    case 'VIDEO':
      return <IconVideo />

    case 'BOOK':
      return <IconArticleBook />

    case 'E-LEARNING':
      return <IconCourse />

    case 'PODCAST':
      return <IconPodcast />

    default:
      return <IconArticleBook />
  }
}

const articleIcon = 'icon icon-paper-2'
const courseIcon = 'icon icon-collection'
const bookIcon = 'icon icon-book-bookmark'
const toolIcon = 'icon icon-settings-tool-66'
const eventIcon = 'icon icon-network'
const playIcon = 'icon3-play2'

// const freshTag = {
//   name: 'FRESH',
//   color: variables.fadedRed
// }

// const paidTag = {
//   name: 'PAID',
//   color: variables.avocado
// }

// const freeTag = {
//   name: 'FREE',
//   color: variables.avocado
// }

const levels = ['', 'BEGINNER', 'NOVICE', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']

// const recommendedTag = {
//   name: 'RECOMMENDED',
//   color: variables.seafoamBlue
// }

// HERE ADD ALL SOURCES FROM OUR AWIN CAMPAIGNS
const awinWhitelist = ['www.edx.org']

const checkAwinException = url => {
  return awinWhitelist.includes(new URL(url).hostname)
}

const inProgressCta = {
  ARTICLE: 'Continue reading',
  VIDEO: 'Continue watching',
  BOOK: 'Continue reading',
  'E-LEARNING': 'Back to course',
  PODCAST: 'Continue listening',
  default: 'Continue'
}

const notStartedCta = {
  ARTICLE: 'Read article',
  VIDEO: 'Watch video',
  BOOK: 'Start reading',
  'E-LEARNING': 'Go to course',
  PODCAST: 'Start listening',
  default: 'Begin'
}

const ctaLookup = ({
  approved,
  isRequested,
  deliveryRequested,
  type,
  status
}) => {
  if (approved === null) {
    if (isRequested) {
      return { ctaIcon: <IconLoaderRequest />, cta: 'Waiting for Approval' }
    } else return { ctaIcon: <IconRequest />, cta: 'Request Approval' }
  }

  if (approved === false) {
    return { ctaIcon: <IconRequest />, cta: 'Save for later' }
  }

  switch (status) {
    case 'AWAITING FULFILLMENT':
      if (deliveryRequested) {
        return { ctaIcon: <IconLoaderDelivery />, cta: 'Waiting for Delivery' }
      } else return { ctaIcon: <IconDelivery />, cta: 'Request Delivery' }
    case 'COMPLETED':
      return { ctaIcon: <IconByType type={type} />, cta: 'Completed' }
    case 'NOT STARTED':
      return {
        ctaIcon: <IconByType type={type} />,
        cta: notStartedCta[type] || notStartedCta.default
      }
    case 'IN PROGRESS':
      return {
        ctaIcon: <IconByType type={type} />,
        cta: inProgressCta[type] || inProgressCta.default
      }
  }
}

export default ({
  content,
  neededWorkSkills = [],
  options = [],
  shareInfo,
  goalInfo
  // cta,
  // updateStatus,
  // status
}) => {
  const {
    _id,
    url,
    title,
    type,
    author,
    relatedPrimarySkills = [],
    relatedSecondarySkills = [],
    price,
    // recommended,
    source: { name: sourceName, iconSource, certText, subscription },
    duration,
    newContent,
    recommendedBy,
    relevanceRating,
    certified,
    approved,
    request,
    fulfillmentRequest,
    imageLink,
    status,
    uploadedBy,
    availableWithSubscription,
    note
  } = content

  const isRequested = !!request?._id
  const deliveryRequested = !!fulfillmentRequest?._id

  let durationText = ''
  if (duration) {
    const { basis, hoursMin, hoursMax, hours, minutes, weeks } = duration
    if ((hoursMax && hoursMin) || hours || minutes) {
      durationText =
        hours || minutes
          ? `${hours ? `${hours} h` : ''}${minutes ? ` ${minutes} min` : ''}`
          : basis === 'PER WEEK'
          ? `${hoursMin} - ${hoursMax} h / week${
              weeks ? ` for ${weeks} weeks` : ''
            }`
          : `Approx. ${hoursMin} - ${hoursMax} h to complete`
    }
  }

  const primarySkills = relatedPrimarySkills.map(skill => ({
    _id: skill._id.split(':')[1],
    name: skill.name,
    primary: true,
    level: skill.skillLevel
  }))
  const secondarySkills = relatedSecondarySkills.map(skill => ({
    _id: skill._id.split(':')[1],
    name: skill.name,
    primary: false
  }))

  const skills = [...primarySkills, ...secondarySkills]
  const primarySkillLevel =
    skills &&
    skills
      .filter(skill => skill.primary)
      .map(skill => skill.level)
      .reduce((a, b) => {
        if (a > b) {
          return a
        } else return b
      }, 0)

  let icon, courseLevel, contentLabel
  switch (type) {
    case 'BOOK':
      icon = bookIcon
      contentLabel = 'Book'
      break
    case 'ARTICLE':
      icon = articleIcon
      contentLabel = 'Article'
      break
    case 'E-LEARNING':
      icon = courseIcon
      contentLabel = 'E-Learning'
      courseLevel = levels[primarySkillLevel]
      break
    case 'TOOL':
      icon = toolIcon
      contentLabel = 'Tool'
      break
    case 'VIDEO':
      icon = playIcon
      contentLabel = 'Video'
      break
    case 'PODCAST':
      icon = playIcon
      contentLabel = 'Podcast'
      break
    case 'EVENT':
      icon = eventIcon
      contentLabel = 'Event'
      break
    default:
      icon = courseIcon
      contentLabel =
        (typeof type === 'string' &&
          type.charAt(0) + type.slice(1).toLocaleLowerCase()) ||
        ''
      break
  }

  // const labels = []

  const priceTag = {
    text: 'FREE',
    color: variables.seafoamBlue
  }

  if (availableWithSubscription) {
    priceTag.text = 'Subscription available'
    priceTag.color = variables.info80
    priceTag.hover = `This item will be available after admin approval`
    priceTag.icon = <IconWarning />
  } else if (price.value === 1) {
    priceTag.text = 'PAID'
    priceTag.color = variables.success80
  } else if (price.value > 0) {
    priceTag.text = `€${Number(price.value).toFixed(2)}${
      subscription ? ' / month' : ''
    }`
    priceTag.color = variables.success80
  }
  // if (recommended) labels.push(recommendedTag)
  // if (newContent) labels.push(freshTag)

  const mainTags = skills
    .filter(tag =>
      neededWorkSkills.length > 0
        ? neededWorkSkills.some(skill => {
            const { _id, skillId } = skill
            const id = skillId || _id
            return tag._id.indexOf(id) !== -1
          })
        : true
    )
    .map(({ _id, name }) => ({
      _id,
      name,
      main: true
    }))

  const secondaryTags = skills
    .filter(skill => !mainTags.some(tag => tag._id.indexOf(skill._id) !== -1))
    .map(({ _id, name }) => ({
      _id,
      name,
      main: false
    }))

  const skillTags = [...mainTags, ...secondaryTags]

  const isAwinException = checkAwinException(url)

  return {
    _id,
    url,
    title,
    author,
    icon,
    type: contentLabel,
    sourceInfo: { name: sourceName, icon: iconSource, certText },
    shareInfo,
    recommendedBy,
    options,
    // labels,
    priceTag,
    price: price.value,
    skillTags,
    courseLevel,
    goalInfo,
    relevanceRating,
    certified,
    duration,
    durationText,
    isAwinException,
    approved,
    request: request || {},
    fulfillmentRequest: fulfillmentRequest || {},
    uploadedBy,
    imageLink,
    ...ctaLookup({ approved, type, status, isRequested, deliveryRequested }),
    // updateStatus,
    status,
    subscriptionAvailable: availableWithSubscription,
    note
  }
}
