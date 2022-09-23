import React from 'react'
import { Button } from 'element-react'
import { useQuery } from 'react-apollo'
import { fetchAllCommentsForPath } from '$/api'
import { captureFilteredError, LoadingSpinner } from '../general'
import { Statement } from '.'
import DiscussionQuestionsList from './DiscussionQuestionsList'

const LearningPathQuestionsList = ({ pathId }) => {
  const { data, loading, error } = useQuery(fetchAllCommentsForPath, {
    variables: {
      pathId
    }
  })

  if (loading) return <LoadingSpinner />

  if (error) {
    captureFilteredError(error)
    return <Statement content='Oops! Something went wrong' />
  }

  const questions = data?.fetchAllCommentsForPath || []

  return (
    <>
      {questions.length === 0 && (
        <Statement content='No questions yet - be the first?' />
      )}
      <DiscussionQuestionsList questions={questions} />
    </>
  )
}

export default LearningPathQuestionsList
