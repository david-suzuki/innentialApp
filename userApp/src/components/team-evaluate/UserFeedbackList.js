import React from 'react'
import { Statement, UserFeedbackItem } from '../ui-components'
import { useQuery } from 'react-apollo'
import { fetchUserPeerFeedback } from '../../api'
import { captureFilteredError, LoadingSpinner } from '../general'

export default () => {
  const { data, loading, error } = useQuery(fetchUserPeerFeedback)

  if (loading) return <LoadingSpinner />

  if (error) {
    captureFilteredError(error)
    return <Statement content='Oops! Something went wrong' />
  }

  const feedback = data && data.fetchUserPeerFeedback

  return (
    <div className='generate-feedback__content'>
      {feedback.map(({ _id: key, ...rest }) => (
        <UserFeedbackItem key={key} {...rest} />
      ))}
      {feedback.length === 0 && <Statement content='No feedback to display' />}
    </div>
  )
}
