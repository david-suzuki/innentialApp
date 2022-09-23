import React, { useEffect } from 'react'
import { useMutation } from 'react-apollo'
import { Button, Message } from 'element-react'
import { duplicateLearningPath } from '../../../api/_mutations'
import { Redirect } from 'react-router-dom'

export default function Duplicate({ pathId }) {
  const [duplicateLearningPathAdmin, { loading, data, error }] = useMutation(
    duplicateLearningPath
  )

  useEffect(() => {
    if (data && !error) {
      const { duplicateLearningPathAdmin } = data
      Message({
        type: 'success',
        message: `Successfully created ${duplicateLearningPathAdmin.name}`
      })
    }
    if (error) {
      const { message } = error
      Message({
        type: 'error',
        message
      })
    }
  }, [data, error])

  if (data && !error) {
    return (
      <Redirect
        to={`/path-templates/edit/${data.duplicateLearningPathAdmin._id}`}
      />
    )
  }

  return (
    <Button
      onClick={() => {
        duplicateLearningPathAdmin({
          variables: {
            id: pathId
          }
        })
      }}
    >
      {loading && 'Duplicating...'}
      {!loading && 'Duplicate'}
    </Button>
  )
}
