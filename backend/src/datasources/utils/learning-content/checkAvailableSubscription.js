import { Subscription } from '../../../models'

const checkAvailableSubscription = async (
  { source, udemyCourseId },
  { organizationId }
) => {
  const availableSubscription = await Subscription.findOne({
    source,
    organizationId,
    active: true
  }).select({ name: 1 })

  if (!availableSubscription) return false

  if (availableSubscription) {
    return availableSubscription.name === 'Udemy for Business'
      ? !!udemyCourseId
      : true
  }
}

export const checkAvailableSubscriptionForSource = (
  { name, source: sourceId },
  { source, udemyCourseId }
) => {
  return (
    String(source) === String(sourceId) &&
    (name !== 'Udemy for Business' || udemyCourseId)
  )
}

export default checkAvailableSubscription
