import React, { useState } from 'react'
import { Button } from 'element-react'
import { useQuery } from 'react-apollo'
import { fetchAllCommentsForPath } from '$/api'
import { captureFilteredError, LoadingSpinner } from '../general'
import { Statement } from '.'
import DiscussionQuestionsList from './DiscussionQuestionsList'
import DiscussionForm from './DiscussionForm'
import learningPathQuestionsStyle from '../../styles/learningPathQuestionsStyle'
import HelpIcon from '../../static/help-circle-dark.svg'
import PlusIcon from '../../static/plus-circle-white.svg'

const LearningPathQuestions = ({ pathId }) => {
  const [openForm, setOpenForm] = useState(false)

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

  const clickHandler = () => {
    setOpenForm(!openForm)
  }

  // const pathName = <div className='learning-path'>{props.pathName}</div>

  return (
    <>
      <div className='learning-path__questions'>
        <div className='learning-path__questions-header'>
          <div className='learning-path__questions-title'>
            <img src={HelpIcon} alt='questions' />
            All Questions
          </div>
          <Button type='primary' onClick={clickHandler}>
            <img src={PlusIcon} alt='add question' />
            Add Question
          </Button>
        </div>
        {openForm && (
          <div
            style={{
              background: 'white',
              padding: '1em',
              textAlign: 'left',
              marginBottom: 16
            }}
          >
            <h3>New Question</h3>
            <DiscussionForm
              infoPosition='bottom'
              buttonName='Cancel'
              handleCancel={clickHandler}
              handleSubmit={clickHandler}
              pathId={pathId}
              submitButtonName='Ask'
            />
          </div>
        )}
        {questions.length === 0 && !openForm && (
          <Statement content='No questions yet - be the first?' />
        )}
        <DiscussionQuestionsList showEmpty={false} questions={questions} />
      </div>
      <style jsx>{learningPathQuestionsStyle}</style>
    </>
  )
}

export default LearningPathQuestions
