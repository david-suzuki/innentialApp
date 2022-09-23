import { useMutation } from 'react-apollo'
import { trackContentEvent } from '../api'

const useTracker = () => {
  const [mutate] = useMutation(trackContentEvent)

  const trackEvent = async (eventType, contentId, impression) => {
    try {
      const {
        data: { trackContentEvent: response }
      } = await mutate({
        variables: {
          inputData: {
            eventType,
            impression,
            contentId
          }
        }
      })
      if (response !== 'OK')
        throw new Error(
          response === 'NOT FOUND'
            ? 'User interactions profile does not exist'
            : 'Internal server error'
        )
    } catch (err) {
      console.error(`Failed to track event: ${err.message}`)
    }
  }

  return trackEvent
}

export default useTracker
