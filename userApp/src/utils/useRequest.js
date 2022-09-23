import { useMutation } from 'react-apollo'
import { requestLearningContent } from '../api'

const useRequest = () => {
  const [mutate, data] = useMutation(requestLearningContent)

  const request = async (contentId, goalId) => {
    try {
      await mutate({
        variables: {
          contentId,
          goalId
        }
      })
    } catch (err) {
      console.error(`Failed to request content: ${err.message}`)
    }
  }

  return [request, data]
}

export default useRequest
