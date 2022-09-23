import React from 'react'
import {
  ProfileFeedbackChart,
  Statement,
  UserFeedbackItem
} from '../ui-components'
import { useQuery } from 'react-apollo'
import { fetchPeerFeedback } from '../../api'
import { captureFilteredError, LoadingSpinner } from '../general'

const ProfileFeedbackList = ({ userId }) => {
  const { data, loading, error } = useQuery(fetchPeerFeedback, {
    variables: {
      userId
    },
    fetchPolicy: 'cache-and-network'
  })

  if (loading) return <LoadingSpinner />

  if (error) {
    captureFilteredError(error)
    return <Statement content='Oops! Something went wrong' />
  }

  const feedback = data && data.fetchPeerFeedback

  return (
    <div className='generate-feedback__content'>
      {feedback.map(({ _id: key, ...rest }) => (
        <UserFeedbackItem key={key} {...rest} />
      ))}
      {feedback.length === 0 && <Statement content='No feedback to display' />}
    </div>
  )
}

export default ProfileFeedbackList
