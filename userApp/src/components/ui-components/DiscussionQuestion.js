import React, { useState, useContext, useRef, useEffect } from 'react'
import { Notification, MessageBox } from 'element-react'
import { Link, useLocation } from 'react-router-dom'
import ApolloCacheUpdater from 'apollo-cache-updater'
import {
  likeComment,
  deleteComment,
  fetchAllCommentsForPath,
  fetchAllCommentsForUser,
  fetchAllComments,
  fetchAllResolvedCommentsForUser
} from '$/api'
import { useMutation } from 'react-apollo'
import DiscussionCommentsList from './DiscussionCommentsList'
import DiscussionForm from './DiscussionForm'
import discussionQuestionStyle from '../../styles/discussionQuestionStyle'
// import ArrowUp from "$/static/corner-left-up.svg";
// import UserPicture1 from "$/static/kris.png";
import LikeIcon from '$/static/heart.svg'
import LikeIconClicked from '$/static/likes-icon-clicked.svg'
import ReplyIcon from '$/static/reply.svg'
import RepliesIcon from '$/static/talk-grey.svg'
import CompasIcon from '$/static/compas.svg'
// import InfoIcon from "$/static/info-icon.svg";
import { UserContext, generateInitialsAvatar } from '$/utils'
import { captureFilteredError } from '../general'
import ReplyForm from './ReplyForm'
import EditIcon from '$/static/edit-icon.svg'
import DeleteIcon from '$/static/delete-icon.svg'
import ShowDetails from '$/static/show-details.svg'
import ChevronRight from '$/static/chevron-right-violet.svg'
import ShowMore from '$/static/show-more.svg'

const update = (proxy, { data: { deleteComment: comment } }) => {
  ApolloCacheUpdater({
    proxy, // apollo proxy
    queriesToUpdate: [
      fetchAllCommentsForUser,
      fetchAllComments,
      fetchAllResolvedCommentsForUser
    ],
    operation: 'REMOVE',
    searchVariables: {},
    mutationResult: comment,
    ID: '_id'
  })

  try {
    const {
      path: { _id: pathId }
    } = comment

    const { fetchAllCommentsForPath: allComments } = proxy.readQuery({
      query: fetchAllCommentsForPath,
      variables: {
        pathId
      }
    })

    proxy.writeQuery({
      query: fetchAllCommentsForPath,
      variables: {
        pathId
      },
      data: {
        fetchAllCommentsForPath: allComments.filter(c => c._id !== comment._id)
      }
    })
  } catch (err) {}
}

const FooterSection = ({
  handleClick = () => {},
  Icon,
  alt,
  textClassName = 'footer__section__text',
  text
}) => {
  return (
    <div className='footer__section' onClick={handleClick}>
      <img src={Icon} alt={alt} className='footer__section__icon' />
      <div className={textClassName}>{text}</div>
    </div>
  )
}

const DiscussionQuestion = ({ question, badgeClassName, isFirstQuestion }) => {
  const currentUser = useContext(UserContext)

  question.replies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const [showDetails, setShowDetails] = useState(false)
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [showReplies, setShowReplies] = useState(false)
  // const [likesClicked, setLikesClicked] = useState(false)
  const [showEditCommentInput, setShowEditCommentInput] = useState(false)
  const [showMoreDropdown, setShowMoreDropdown] = useState(false)

  const [like] = useMutation(likeComment)
  const [remove] = useMutation(deleteComment)

  const isLiked = question.likes.some(id => id === currentUser._id)

  const location = useLocation()
  const pathname = location.pathname.split('/')[1]

  useEffect(() => {
    let timeout
    const params = new URLSearchParams(location.search)

    const qparam = params.get('q')
    const rparam = params.get('r')

    if (rparam && question.replies.some(r => r._id === rparam)) {
      setShowReplies(true)
      timeout = setTimeout(() => {
        document.getElementById(rparam).scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
        document.getElementById(rparam).classList.add('comment--highlight')
      }, 100)
    } else if (qparam && qparam === question._id) {
      document.getElementById(question._id).scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
      document.getElementById(question._id).classList.add('question--highlight')
    }

    return () => clearTimeout(timeout)
  }, [location])

  const getDays = date => {
    const then = Date.parse(date)
    const now = new Date()
    const days = Math.round((now - then) / (1000 * 60 * 60 * 24))
    if (days === 0) {
      return 'Today'
    } else if (days === 1) {
      return 'Yesterday'
    } else if (days > 1 && days < 365) {
      return `${days} days ago`
    } else {
      return date
    }
  }

  const handleCoverButtonClick = () => {
    setShowDetails(!showDetails)
  }

  const handleClickLikes = async () => {
    try {
      await like({
        variables: {
          commentId: question._id
        }
      })
    } catch (err) {
      captureFilteredError(err)
    }
  }

  const handleClickDeleteComment = async () => {
    try {
      await MessageBox.confirm(
        'All the replies will be deleted from path page.',
        'Are you sure you want to delete this question?',
        {
          confirmButtonText: 'Delete anyway',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      )
      try {
        await remove({
          variables: {
            commentId: question._id
          },
          update
        })
        Notification({
          message: 'Succesfully deleted!',
          type: 'success',
          offset: 90
        })
      } catch (err) {
        captureFilteredError(err)
        Notification({
          message: 'Oops! Something went wrong',
          type: 'warning',
          offset: 90
        })
      }
    } catch (err) {}
  }

  const handleShowReplyInputClick = () => {
    setShowReplies(true)
    setShowReplyInput(!showReplyInput)
  }

  const handleClickReplies = () => {
    setShowReplies(!showReplies)
  }

  const handlePostReply = () => {
    Notification({
      title: 'Your reply has been posted!',
      message:
        'It will be displayed on the path page. You can edit your reply on Your Board tab.',
      type: 'success',
      offset: 90
    })
    setShowReplyInput(false)
  }

  const handleClickMore = () => {
    setShowMoreDropdown(!showMoreDropdown)
  }

  const dropdown = useRef()

  useEffect(() => {
    const checkIfClickedOutside = e => {
      if (
        showMoreDropdown &&
        dropdown.current &&
        !dropdown.current.contains(e.target)
      ) {
        setShowMoreDropdown(false)
      }
    }
    document.addEventListener('mousedown', checkIfClickedOutside)

    return () => {
      // Cleanup the event listener
      document.removeEventListener('mousedown', checkIfClickedOutside)
    }
  }, [showMoreDropdown])

  let likesSection, repliesSection

  if (question.likes.length === 0) {
    likesSection = (
      <FooterSection
        Icon={!isLiked ? LikeIcon : LikeIconClicked}
        handleClick={handleClickLikes}
        alt='heart'
        textClassName={
          !isLiked ? 'footer__section__text' : 'footer__section__text--clicked'
        }
        text='Like'
      />
    )
  }

  if (question.likes.length > 0) {
    likesSection = (
      <FooterSection
        Icon={!isLiked ? LikeIcon : LikeIconClicked}
        handleClick={handleClickLikes}
        alt='heart'
        textClassName={
          !isLiked ? 'footer__section__text' : 'footer__section__text--clicked'
        }
        text={`${question.likes.length} Like${
          question.likes.length > 1 ? 's' : ''
        }`}
      />
    )
  }

  // if (question.likes > 1) {
  //   likesSection = (
  //     <div className='footer__section' onClick={handleClickLikes}>
  //       <img
  //         src={!isLiked ? LikeIcon : LikeIconClicked}
  //         alt='heart'
  //         className='footer__section__icon'
  //       />
  //       <div
  //         className={
  //           !isLiked
  //             ? 'footer__section__text'
  //             : 'footer__section__text--clicked'
  //         }
  //       >
  //         {question.likes} Likes
  //       </div>
  //     </div>
  //   )
  // }

  if (question?.replies?.length === 0) {
    repliesSection = (
      <FooterSection Icon={RepliesIcon} alt='talk' text='0 Replies' />
    )
  }

  // if (question?.replies?.length === 1) {
  //   repliesSection = (
  //     <div className='footer__section' onClick={handleClickReplies}>
  //       <img src={RepliesIcon} alt='talk' className='footer__section__icon' />
  //       <div className='footer__section__text'>
  //         {!showReplies ? '1 Reply' : 'Hide Reply'}
  //       </div>
  //     </div>
  //   )
  // }

  if (question?.replies?.length > 0) {
    repliesSection = (
      <FooterSection
        Icon={RepliesIcon}
        alt='talk'
        handleClick={
          !(question?.replies?.length === 1 && isFirstQuestion)
            ? handleClickReplies
            : null
        }
        text={
          !showReplies
            ? `${question.replies.length} Repl${
                question?.replies?.length > 1 ? 'ies' : 'y'
              }`
            : `Hide Repl${question?.replies?.length > 1 ? 'ies' : 'y'}`
        }
      />
      // <div className='footer__section' onClick={handleClickReplies}>
      //   <img src={RepliesIcon} alt='talk' className='footer__section__icon' />
      //   <div className='footer__section__text'>
      //     {!showReplies
      //       ? `${question.replies.length} Repl${
      //           question?.replies?.length > 1 ? 'ies' : 'y'
      //         }`
      //       : `Hide Repl${question?.replies?.length > 1 ? 'ies' : 'y'}`}
      //   </div>
      // </div>
    )
    // console.log(question.comments.length)
  }

  const nOfParagraphs = question?.content?.match(/<p>/g)?.length || 0

  const showHiddenPreview = nOfParagraphs >= 3 || question.content.length > 173

  return (
    <div className='question' id={question._id}>
      <div className='question-main'>
        <div className='question-main__header'>
          <div className={badgeClassName}>Best Answer</div>
          <img
            src={
              question.user?.imageLink || generateInitialsAvatar(question.user)
            }
            className='header__picture'
            alt='question author'
          />
          <div className='header__author'>
            {question.user
              ? `${question.user.firstName} ${question.user.lastName}`
              : 'User deleted'}
          </div>
          <div className='header__date'>{getDays(question.createdAt)}</div>
          {showDetails && (
            <div className='header__hide' onClick={handleCoverButtonClick}>
              <img src={ChevronRight} alt='chevron' /> Hide Details
            </div>
          )}
        </div>
        {showEditCommentInput ? (
          <DiscussionForm
            commentId={question._id}
            abstract={question.abstract}
            content={question.content}
            buttonName='Cancel'
            submitButtonName='Save'
            handleCancel={() => setShowEditCommentInput(false)}
            handleSubmit={() => setShowEditCommentInput(false)}
          />
        ) : (
          <>
            <div className='question__title'>
              <span>{question.abstract}</span>
            </div>
            <div className='question-main__content'>
              <div
                className={
                  !showDetails && showHiddenPreview
                    ? 'question-main__content-text--on-path'
                    : 'question-main__content-text'
                }
                dangerouslySetInnerHTML={{ __html: question.content }}
              />
              {/* <div
                className={
                  !isOnPaths
                    ? 'question-main__content-text'
                    : !showDetails && question.content.length > 173
                    ? 'question-main__content-text--on-path'
                    : 'question-main__content-text'
                }
              >
                {question.content}
              </div> */}
              {!showDetails && showHiddenPreview && (
                <div className='question-main__content__cover'>
                  <div
                    className='cover__button'
                    onClick={handleCoverButtonClick}
                  >
                    <img src={ShowDetails} alt='details' /> Show Details
                  </div>
                </div>
              )}
            </div>

            {!showReplyInput && (
              <div className='question-main__footer'>
                {likesSection}
                {repliesSection}
                {currentUser._id !== question.user?._id && (
                  <FooterSection
                    Icon={ReplyIcon}
                    alt='arrow right'
                    text='Reply'
                    handleClick={handleShowReplyInputClick}
                  />
                  // <div
                  //   className='footer__section'
                  //   onClick={handleShowReplyInputClick}
                  // >
                  //   <img
                  //     src={ReplyIcon}
                  //     alt='arrow right'
                  //     className='footer__section__icon'
                  //   />
                  //   <div className='footer__section__text'>Reply</div>
                  // </div>
                )}
                {pathname !== 'learning-path' && (
                  <Link
                    to={`/learning-path/${question.path._id}?q=${question._id}`}
                  >
                    <FooterSection
                      Icon={CompasIcon}
                      alt='compass'
                      text='See on Path'
                    />
                    {/* <div className='footer__section'>
                    <img
                      src={CompasIcon}
                      alt='arrow right'
                      className='footer__section__icon'
                    />
                    <div className='footer__section__text'>See on Path</div>
                  </div> */}
                  </Link>
                )}
                {/* {currentUser._id === question.user?._id && (
									<FooterSection
										Icon={EditIcon}
										alt="edit"
										text="Edit"
										handleClick={() => setShowEditCommentInput(true)}
									/>
								)}
								{currentUser._id === question.user?._id && (
									<FooterSection
										Icon={DeleteIcon}
										alt="delete"
										text="Delete"
										handleClick={handleClickDeleteComment}
									/>
								)} */}
                {currentUser._id === question.user?._id && (
                  <>
                    <div
                      className='footer__section'
                      style={{ position: 'relative' }}
                      onClick={handleClickMore}
                      ref={dropdown}
                    >
                      <div className='footer__section__text'>More</div>
                      <img
                        src={ShowMore}
                        alt='show more'
                        className='footer__section__icon--right'
                      />
                      {showMoreDropdown && (
                        <div className='footer__dropdown'>
                          <>
                            <FooterSection
                              Icon={EditIcon}
                              alt='edit'
                              text='Edit'
                              handleClick={() => setShowEditCommentInput(true)}
                            />
                            <FooterSection
                              Icon={DeleteIcon}
                              alt='delete'
                              text='Delete'
                              handleClick={handleClickDeleteComment}
                            />
                          </>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}
        {showReplyInput && (
          <ReplyForm
            pathId={question.path._id}
            replyTo={question._id}
            handleReply={handlePostReply}
            handleCancel={() => setShowReplyInput(false)}
          />
        )}
        {showReplies && question?.replies?.length > 0 && (
          <div style={{ listStyle: 'none', padding: '1em 0' }}>
            <DiscussionCommentsList
              questionAuthor={question.user._id}
              comments={question.replies}
              type='child'
            />
          </div>
        )}
        {!showReplies && question?.replies?.length > 0 && isFirstQuestion && (
          <div style={{ listStyle: 'none', padding: '1em 0' }}>
            <DiscussionCommentsList
              questionAuthor={question.user._id}
              comments={question.replies.slice(0, 1)}
              type='child'
            />
          </div>
        )}
      </div>
      <style jsx>{discussionQuestionStyle}</style>
    </div>
  )
}

export default DiscussionQuestion

DiscussionQuestion.defaultProps = {
  currentUser: { name: 'Maria Doe' }
}
