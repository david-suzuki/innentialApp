import React, { useState, Component } from 'react'
import { Button } from 'element-react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-apollo'
import {
  fetchAllCommentsForUser,
  fetchAllResolvedCommentsForUser,
  fetchAllComments
} from '$/api'
import { captureFilteredError, LoadingSpinner } from '../general'
import { Statement } from '.'
import DiscussionQuestionsList from './DiscussionQuestionsList'
import learningPathDiscusionsStyle from '../../styles/learningPathDiscusionsStyle'
import InfoIcon from '$/static/info-icon.svg'
// import TalkWhite from '$/static/talk-white.svg'
import TalkDark from '$/static/talk-dark.svg'
import CheckWhite from '$/static/check-white.svg'
import CheckDark from '$/static/check-dark.svg'
// import ArrowWhite from '$/static/arrow-white.svg'
import ArrowDark from '$/static/arrow-dark.svg'
import MapIcon from '$/static/map.svg'
import { ReactComponent as TalkWhite } from '$/static/talk-white.svg'
import { ReactComponent as ArrowWhite } from '$/static/arrow-white.svg'

// const dummyData = {
//   paths: {
//     currentPath: { id: 1, name: 'Async Communication' },
//     allPaths: [
//       { id: 1, name: 'Async Communication' },
//       { id: 2, name: 'Understand and use data in your daily work' }
//     ]
//   },
//   allQuestions: [
//     {
//       id: 'c1',
//       author: 'John Doe',
//       title: 'Async Style for Non-Remote?',
//       resolved: true,
//       content:
//         'Teams can benefit from async communication just as much as remote teams. It really depends on the nature of the work and the willingness to challenge the status quo when it comes to work.',
//       date: '2021-11-3',
//       likes: 21,
//       comments: [
//         {
//           id: 'a1',
//           author: 'Maria Doe',
//           content:
//             'They can benefit from async communication just as much as remote teams. It really depends on the nature of the work and the willingness to challenge the status quo when it comes to work.',
//           date: '2021-11-3',
//           likes: 30,
//           bestAnswer: false
//         },
//         {
//           id: 'a2',
//           author: 'Johnathan Debrie',
//           content:
//             'It really depends on the nature of the work and the willingness to challenge the status quo when it comes to work.',
//           date: '2021-11-3',
//           likes: 30,
//           bestAnswer: false
//         }
//       ]
//     },
//     {
//       id: 'c2',
//       author: 'Maria Doe',
//       title: 'Async future?',
//       resolved: false,
//       content:
//         'Co-located teams can benefit from async communication just as much as remote teams. It really depends on the nature of the work and the willingness to challenge the status quo when it comes to work.',
//       date: '2021-11-1',
//       likes: 30,
//       comments: [
//         {
//           id: 'a3',
//           author: 'Mary Mae',
//           content:
//             'They can benefit from async communication just as much as remote teams. It really depends on the nature of the work and the willingness to challenge the status quo when it comes to work.',
//           date: '2021-11-3',
//           likes: 30,
//           bestAnswer: true
//         },
//         {
//           id: 'a4',
//           author: 'Johnathan Debrie',
//           content:
//             'It really depends on the nature of the work and the willingness to challenge the status quo when it comes to work.',
//           date: '2021-11-3',
//           likes: 30,
//           bestAnswer: false
//         }
//       ]
//     }
//   ],
//   userQuestions: [
//     {
//       id: 'c1',
//       author: 'Maria Doe',
//       title: 'Async Style for Non-Remote?',
//       resolved: true,
//       content:
//         'Teams can benefit from async communication just as much as remote teams. It really depends on the nature of the work and the willingness to challenge the status quo when it comes to work.',
//       date: '2021-11-3',
//       likes: 21,
//       comments: [
//         {
//           id: 'a1',
//           author: 'Mary Mae',
//           content:
//             'They can benefit from async communication just as much as remote teams. It really depends on the nature of the work and the willingness to challenge the status quo when it comes to work.',
//           date: '2021-11-3',
//           likes: 30
//         },
//         {
//           id: 'a2',
//           author: 'Johnathan Debrie',
//           content:
//             'It really depends on the nature of the work and the willingness to challenge the status quo when it comes to work.',
//           date: '2021-11-3',
//           likes: 30
//         }
//       ]
//     },
//     {
//       id: 'c2',
//       author: 'Maria Doe',
//       title: 'Async future?',
//       resolved: false,
//       content:
//         'Co-located teams can benefit from async communication just as much as remote teams. It really depends on the nature of the work and the willingness to challenge the status quo when it comes to work.',
//       date: '2021-11-1',
//       likes: 30,
//       comments: [
//         {
//           id: 'a3',
//           author: 'Mary Mae',
//           content:
//             'They can benefit from async communication just as much as remote teams. It really depends on the nature of the work and the willingness to challenge the status quo when it comes to work.',
//           date: '2021-11-3',
//           likes: 30
//         },
//         {
//           id: 'a4',
//           author: 'Johnathan Debrie',
//           content:
//             'It really depends on the nature of the work and the willingness to challenge the status quo when it comes to work.',
//           date: '2021-11-3',
//           likes: 30
//         }
//       ]
//     }
//   ]
// }

const order = ['COMPLETED', 'IN PROGRESS', 'NOT STARTED'].reverse()

const CommentsList = ({ questions }) => {
  questions.sort(
    (q1, q2) =>
      order.indexOf(q2?.path?.userProgress?.status) -
      order.indexOf(q1?.path?.userProgress?.status)
  )

  const byPath = Object.entries(
    questions.reduce((acc, curr) => {
      const key = `${curr.path._id}:${curr.path.name}`
      return {
        ...acc,
        [key]: [...(acc[key] || []), curr]
      }
    }, {})
  )

  return byPath.map(([key, questions], i) => (
    <div key={`path-questions:${key}:${i}`}>
      <Link to={`/learning-path/${key.split(':')[0]}`}>
        <div className='discussions__path-name'>
          <img src={MapIcon} alt='map' />
          {key.split(':')[1]}
        </div>
      </Link>
      <div className='discussions__questions'>
        <DiscussionQuestionsList questions={questions} />
      </div>
    </div>
  ))
}

const YourQuestions = () => {
  const { data, loading, error } = useQuery(fetchAllCommentsForUser)

  if (loading) return <LoadingSpinner />

  if (error) {
    captureFilteredError(error)
    return <Statement content='Oops! Something went wrong' />
  }

  const questions = data?.fetchAllCommentsForUser || []

  if (questions.length === 0)
    return (
      <Statement content='You don’t have any questions yet. You can ask a question on every learning path page.' />
    )

  return <CommentsList questions={questions} />
}

// const ResolvedQuestions = () => {
//   const { data, loading, error } = useQuery(fetchAllResolvedCommentsForUser)

//   if (loading) return <LoadingSpinner />

//   if (error) {
//     captureFilteredError(error)
//     return <Statement content='Oops! Something went wrong' />
//   }

//   const questions = data?.fetchAllResolvedCommentsForUser || []

//   if (questions.length === 0)
//     return <Statement content='No questions to show' />

//   return <CommentsList questions={questions} />
// }

const AllQuestions = () => {
  const { data, loading, error } = useQuery(fetchAllComments)

  if (loading) return <LoadingSpinner />

  if (error) {
    captureFilteredError(error)
    return <Statement content='Oops! Something went wrong' />
  }

  const questions = data?.fetchAllComments || []

  if (questions.length === 0)
    return (
      <Statement content='There are no questions to show yet. Be the first one! Ask a question on one of the learning path pages.' />
    )

  const teamQuestions = questions.filter(question => question.team)

  const organizationQuestions = questions.filter(question => !question.team)

  return (
    <>
      {teamQuestions.length > 0 && (
        <>
          <div className='discussions__content-header'>Team Questions</div>
          <CommentsList questions={teamQuestions} />
        </>
      )}
      <div className='discussions__content-header'>Organization Questions</div>
      <CommentsList questions={organizationQuestions} />
    </>
  )
}

const LearningPathDiscussions = () => {
  const [buttonActive, setButtonActive] = useState('first')
  const [firstButtonHovered, setFirstButtonHovered] = useState(false)
  const [thirdButtonHovered, setThirdButtonHovered] = useState(false)

  // const resolvedQuestions = props.userQuestions.filter(
  //   question => question.resolved === true
  // )

  // const currentUserName = `${props.currentUser.firstName} ${props.currentUser.lastName}`
  const handleButtonClick = name => {
    setButtonActive(name)
  }

  return (
    <>
      <div className='discussions__header'>
        <button
          name='first'
          className={
            buttonActive === 'first'
              ? 'header__button header__button--primary'
              : 'header__button'
          }
          onClick={() => handleButtonClick('first')}
          // onMouseEnter={e => {
          //   e.target.classList.add('header__button--hover')
          //   setFirstButtonHovered(true)
          // }}
          // onMouseLeave={e => {
          //   e.target.classList.remove('header__button--hover')
          //   setFirstButtonHovered(false)
          // }}
        >
          <TalkWhite />
          {/* <img
            name='first'
            className='header__button__image'
            src={
              buttonActive === 'first' ||
              (buttonActive !== 'first' && firstButtonHovered)
                ? TalkWhite
                : TalkDark
            }
            alt='talk'
          /> */}
          Your Questions
        </button>
        {/* <button
          name='second'
          className={
            buttonActive === 'second'
              ? 'header__button header__button--primary'
              : 'header__button'
          }
          onClick={handleButtonClick}
          onMouseEnter={e => {
            e.target.classList.add('header__button--hover')
          }}
          onMouseLeave={e => {
            e.target.classList.remove('header__button--hover')
          }}
        >
          <img
            src={buttonActive === 'second' ? CheckWhite : CheckDark}
            alt='check'
          />
          Resolved
        </button> */}
        <button
          name='third'
          className={
            buttonActive === 'third'
              ? 'header__button header__button--primary'
              : 'header__button'
          }
          onClick={() => handleButtonClick('third')}
          // onMouseEnter={e => {
          //   e.target.classList.add('header__button--hover')
          //   setThirdButtonHovered(true)
          // }}
          // onMouseLeave={e => {
          //   e.target.classList.remove('header__button--hover')
          //   setThirdButtonHovered(false)
          // }}
        >
          <ArrowWhite />
          {/* <img
            name='third'
            src={
              buttonActive === 'third' ||
              (buttonActive !== 'third' && thirdButtonHovered)
                ? ArrowWhite
                : ArrowDark
            }
            className='header__button__image'
            alt='arrow'
          /> */}
          All Questions
        </button>
      </div>
      <div className='discussions__content'>
        {buttonActive === 'first' && <YourQuestions />}
        {/* {buttonActive === 'second' && <ResolvedQuestions />} */}
        {buttonActive === 'third' && <AllQuestions />}
        {/* {buttonActive === 'second' && (
          <ul>
            {resolvedQuestions.map(path => (
              <li key={path.id}>
                <div className='discussions__path-name'>
                  <img src={MapIcon} alt='map' />
                  {props.currentPath}
                </div>
                <div className='discussions__questions'>
                  <DiscussionQuestionsList questions={resolvedQuestions} />
                </div>
              </li>
            ))}
          </ul>
        )}
        {buttonActive === 'third' && (
          <ul>
            <li>
              <>
                <div className='discussions__content-header'>
                  Team Questions
                </div>
                <ul>
                  {props.allPaths.map(path => (
                    <li key={path.id}>
                      <div className='discussions__path-name'>
                        <img src={MapIcon} alt='map' />
                        {path.name}
                      </div>
                      <div className='discussions__questions'>
                        <DiscussionQuestionsList
                          questions={props.allQuestions}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            </li>
            <li>
              <>
                <div className='discussions__content-header'>
                  Organization Questions
                </div>
                <ul>
                  {props.allPaths.map(path => (
                    <li key={path.id}>
                      <div className='discussions__path-name'>
                        <img src={MapIcon} alt='map' />
                        {path.name}
                      </div>
                      <div className='discussions__questions'>
                        <DiscussionQuestionsList
                          questions={props.allQuestions}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            </li>
          </ul>
        )} */}
      </div>
      <style jsx>{learningPathDiscusionsStyle}</style>
    </>
  )
}

export default LearningPathDiscussions

// LearningPathDiscussions.defaultProps = {
//   currentPath: dummyData.paths.currentPath.name,
//   allPaths: dummyData.paths.allPaths,
//   allQuestions: dummyData.allQuestions,
//   userQuestions: dummyData.userQuestions
// }
