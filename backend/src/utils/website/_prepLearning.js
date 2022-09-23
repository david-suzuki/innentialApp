import { ContentSources } from '~/models'
import { getDownloadLink } from '../'

const placeholderImg = {
  ARTICLE:
    'https://innential-production.s3.eu-central-1.amazonaws.com/website/article-placeholder.png',
  BOOK:
    'https://innential-production.s3.eu-central-1.amazonaws.com/website/book-placeholder.png',
  'E-LEARNING':
    'https://innential-production.s3.eu-central-1.amazonaws.com/website/course-placeholder.png',
  TOOL:
    'https://innential-production.s3.eu-central-1.amazonaws.com/website/tool-placeholder.png',
  EVENT:
    'https://innential-production.s3.eu-central-1.amazonaws.com/website/event-placeholder.png',
  default:
    'https://innential-production.s3.eu-central-1.amazonaws.com/website/course-placeholder.png'
}

const learningPromise = (learning, includeId, i) =>
  Promise.all(
    learning.map(
      async ({ _id: contentId, source: sourceId, type, duration, ...item }) => {
        const thumbnailSrc = await getDownloadLink({
          _id: contentId,
          key: 'learning-content/thumbnails'
        })
        const iconSrc = await getDownloadLink({
          _id: sourceId,
          key: 'sources/icons'
        })
        let durationText = ''
        if (duration) {
          const { basis, hoursMin, hoursMax, hours, minutes, weeks } = duration
          if ((hoursMax && hoursMin) || hours || minutes) {
            durationText =
              hours || minutes
                ? `${hours ? `${hours} h` : ''}${
                    minutes ? ` ${minutes} min` : ''
                  }`
                : basis === 'PER WEEK'
                ? `${hoursMin} - ${hoursMax} h / week${
                    weeks ? ` for ${weeks} weeks` : ''
                  }`
                : `Approx. ${hoursMin} - ${hoursMax} h to complete`
          }
        }
        return {
          ...(i === 0 && {
            ...item,
            type,
            duration: durationText,
            thumbnailSrc:
              thumbnailSrc === null
                ? placeholderImg[type] || placeholderImg['default']
                : String(thumbnailSrc).split('?')[0]
          }),
          ...(includeId && { _id: contentId }),
          source: {
            info: await ContentSources.findById(sourceId)
              .select({ name: 1, _id: 0 })
              .lean(),
            iconSrc: iconSrc === null ? '' : String(iconSrc).split('?')[0]
          }
        }
      }
    )
  )

export default learningPromise
