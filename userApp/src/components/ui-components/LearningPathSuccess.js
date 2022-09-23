import React, { useState, useEffect, useRef, useContext } from 'react'
import { MessageBox } from 'element-react'
import { useLocation, Redirect, Link, useHistory } from 'react-router-dom'
import learningPathSuccessStyle from '../../styles/learningPathSuccessStyle'
import SmileyFaceIndicator from './SmileyFaceIndicator'
import DiscussionForm from './DiscussionForm'
import LearningPathQuestionsList from './LearningPathQuestionsList'
import ChevronViolet from '$/static/chevron-right-violet.svg'
import { UserContext } from '../../utils'

const LearningPathSuccess = () => {
  const { _id: userId } = useContext(UserContext)
  const [rating, setRating] = useState(0)
  const { state } = useLocation()
  const history = useHistory()
  const componentWillUnmount = useRef(false)

  useEffect(() => {
    window.hj &&
      window.hj('identify', userId, {
        'Finished path': true
      })
  }, [])

  // from https://stackoverflow.com/a/65940606
  // This is componentWillUnmount
  useEffect(() => {
    return () => {
      componentWillUnmount.current = true
    }
  }, [])

  useEffect(() => {
    return () => {
      // This line only evaluates to true after the componentWillUnmount happens
      if (componentWillUnmount.current && rating > 0) {
        // Track LP rating
        window.analytics &&
          window.analytics.track('rated_LP', {
            pathId: state?.path?._id,
            value: rating
          })
      }
    }
  }, [rating])

  if (!state?.path) {
    return <Redirect to='/' />
  }

  const { _id: pathId, name: pathName } = state.path

  const handleCancel = async e => {
    e.preventDefault()
    try {
      await MessageBox.confirm(
        'This will take you to the current path page. Continue?',
        'Warning',
        {
          confirmButtonText: 'Continue',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      )
      history.replace(`/learning-path/${pathId}`)
    } catch (err) {}
  }

  const handleSubmit = questionId => {
    history.replace(
      `/learning-path/${pathId}${questionId ? `?q=${questionId}` : ''}`
    )
  }

  return (
    <div className='discussion'>
      <div className='discussion__title'>
        Congratulations on completing your path!
      </div>
      <div className='discussion__title-small'>How was your experience?</div>
      <div style={{ maxWidth: '50%' }}>
        <SmileyFaceIndicator
          currentRating={rating}
          setCurrentRating={setRating}
        />
      </div>

      <div className='discussion__content'>
        <div className='discussion__content-form'>
          <DiscussionForm
            pathId={pathId}
            title='Ask a question'
            underline={true}
            buttonName='Skip Question'
            infoPosition='top'
            handleCancel={handleCancel}
            handleSubmit={handleSubmit}
            submitButtonName='Ask'
          />
        </div>
        <div className='discussion__content-questions'>
          <div className='discussion__content-questions__title'>
            Open Questions for {pathName}
          </div>
          <LearningPathQuestionsList pathId={pathId} />
        </div>
      </div>
      <button
        className='discussion__button'
        onMouseEnter={e => {
          e.target.classList.add('discussion__button--hover')
        }}
        onMouseLeave={e => {
          e.target.classList.remove('discussion__button--hover')
        }}
        onClick={handleCancel}
      >
        View More
        <img src={ChevronViolet} alt='chevron right' />
      </button>
      <style jsx>{learningPathSuccessStyle}</style>
    </div>
  )
}

export default LearningPathSuccess
