import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { Input, Button, Notification, MessageBox } from 'element-react'
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
import DiscussionReply from './DiscussionReply'
import discussionCommentStyle from '../../styles/discussionCommentStyle'
import ArrowUp from '$/static/corner-left-up.svg'
import UserPicture1 from '$/static/kris.png'
import LikeIcon from '$/static/heart.svg'
import LikeIconClicked from '$/static/likes-icon-clicked.svg'
import ReplyIcon from '$/static/reply.svg'
import RepliesIcon from '$/static/talk-grey.svg'
import CompasIcon from '$/static/compas.svg'
import InfoIcon from '$/static/info-icon.svg'
import AcceptIcon from '$/static/check-grey.svg'
import EditIcon from '$/static/edit-icon.svg'
import DeleteIcon from '$/static/delete-icon.svg'
import { UserContext, generateInitialsAvatar } from '$/utils'
import ReplyForm from './ReplyForm'
import { captureFilteredError } from '../general'

const updateQuery = ({ proxy, query, queryName, comment, variables }) => {
  try {
    const { [queryName]: allComments } = proxy.readQuery({
      query,
      variables
    })

    proxy.writeQuery({
      query,
      variables,
      data: {
        [queryName]: allComments.map(c => {
          if (c.replies.some(r => r._id === comment._id)) {
            return {
              ...c,
              replies: c.replies.filter(r => r._id !== comment._id)
            }
          }
          return c
        })
      }
    })
  } catch (err) {}
}

const update = (proxy, { data: { deleteComment: comment } }) => {
  updateQuery({
    proxy,
    query: fetchAllCommentsForUser,
    queryName: 'fetchAllCommentsForUser',
    comment
  })
  updateQuery({
    proxy,
    query: fetchAllResolvedCommentsForUser,
    queryName: 'fetchAllResolvedCommentsForUser',
    comment
  })
  updateQuery({
    proxy,
    query: fetchAllComments,
    queryName: 'fetchAllComments',
    comment
  })
  updateQuery({
    proxy,
    query: fetchAllCommentsForPath,
    queryName: 'fetchAllCommentsForPath',
    comment,
    variables: {
      pathId: comment.path._id
    }
  })
  // ApolloCacheUpdater({
  //   proxy, // apollo proxy
  //   queriesToUpdate: [
  //     fetchAllCommentsForUser,
  //     fetchAllComments,
  //     fetchAllResolvedCommentsForUser
  //   ],
  //   operation: 'REMOVE',
  //   searchVariables: {},
  //   mutationResult: comment,
  //   ID: '_id'
  // })
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

const DiscussionComment = ({ questionAuthor, comment, badgeClassName }) => {
  const currentUser = useContext(UserContext)

  comment.replies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  // const [likesClicked, setLikesClicked] = useState(false)
  const [showCommentInput, setShowCommentInput] = useState(false)
  const [showEditCommentInput, setShowEditCommentInput] = useState(false)

  const [showReply, setShowReply] = useState(false)
  const [commentContent, setCommentContent] = useState(comment.content)

  const [like] = useMutation(likeComment)
  const [remove] = useMutation(deleteComment)

  const isLiked = comment.likes.some(id => id === currentUser._id)

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

  const handleClickLikes = async () => {
    try {
      await like({
        variables: {
          commentId: comment._id
        }
      })
    } catch (err) {
      captureFilteredError(err)
    }
  }

  const handleShowCommentInputClick = () => {
    setShowReply(true)
    setShowCommentInput(!showCommentInput)
  }

  const handleShowEditCommentInputClick = () => {
    setShowEditCommentInput(!showEditCommentInput)
  }

  const handleClickReply = () => {
    setShowReply(!showReply)
  }

  // const handleEditCommentInputChange = value => {
  //   setCommentContent(value)
  // }

  const handlePostComment = () => {
    Notification({
      title: 'Your reply has been posted!',
      message: 'It will be displayed on the path page.',
      type: 'success'
    })
    setShowCommentInput(false)
  }

  const handleClickDeleteComment = async () => {
    try {
      await MessageBox.confirm(
        'All the replies will be deleted as well',
        'Are you sure you want to delete this reply?',
        {
          confirmButtonText: 'Delete anyway',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      )
      try {
        await remove({
          variables: {
            commentId: comment._id
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

  const handleSaveCommentChanges = () => {
    Notification({
      message: 'Your changes have been saved!',
      type: 'success'
    })
    setShowEditCommentInput(false)
  }

  let likesSection, replySection

  if (comment.likes.length === 0) {
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

  // if (comment.likes === 1) {
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
  //         {comment.likes} Like
  //       </div>
  //     </div>
  //   )
  // }

  if (comment.likes.length > 0) {
    likesSection = (
      <FooterSection
        Icon={!isLiked ? LikeIcon : LikeIconClicked}
        handleClick={handleClickLikes}
        alt='heart'
        textClassName={
          !isLiked ? 'footer__section__text' : 'footer__section__text--clicked'
        }
        text={`${comment.likes.length} Like${
          comment.likes.length > 1 ? 's' : ''
        }`}
      />
    )
  }

  if (comment.replies.length === 0) {
    replySection = (
      <FooterSection Icon={RepliesIcon} alt='talk' text='0 Replies' />
    )
  }

  if (comment.replies.length > 0) {
    replySection = (
      <FooterSection
        Icon={RepliesIcon}
        alt='talk'
        handleClick={handleClickReply}
        text={
          !showReply
            ? `${comment.replies.length} Repl${
                comment?.replies?.length > 1 ? 'ies' : 'y'
              }`
            : `Hide Repl${comment?.replies?.length > 1 ? 'ies' : 'y'}`
        }
      />
      // <div className='footer__section' onClick={handleClickReply}>
      //   <img src={RepliesIcon} alt='talk' className='footer__section__icon' />
      //   <div className='footer__section__text'>
      //     {!showReply
      //       ? `${comment.replies.length} repl${
      //           comment.replies.length > 1 ? 'ies' : 'y'
      //         }`
      //       : 'Hide Replies'}
      //   </div>
      // </div>
    )
  }

  let commentFooter

  if (
    currentUser._id !== questionAuthor &&
    currentUser._id !== comment.user?._id
  ) {
    commentFooter = showCommentInput ? (
      <ReplyForm
        pathId={comment.path._id}
        replyTo={comment._id}
        handleReply={handlePostComment}
        handleCancel={() => setShowCommentInput(false)}
      />
    ) : (
      <>
        {likesSection}
        {replySection}
        <FooterSection
          Icon={ReplyIcon}
          alt='reply'
          text='Reply'
          handleClick={handleShowCommentInputClick}
        />
      </>
    )
  }

  if (
    currentUser._id === comment.user?._id
    // (currentUser.name !== questionAuthor &&
    //   currentUser.name === comment.author) ||
    // (currentUser.name === questionAuthor && currentUser.name === comment.author)
  ) {
    commentFooter = (
      <>
        {likesSection}
        {replySection}
        <FooterSection
          Icon={EditIcon}
          alt='edit'
          text='Edit'
          handleClick={handleShowEditCommentInputClick}
        />
        <FooterSection
          Icon={DeleteIcon}
          handleClick={handleClickDeleteComment}
          alt='delete'
          text='Delete'
        />
      </>
    )
  }

  if (currentUser._id === questionAuthor) {
    commentFooter = showCommentInput ? (
      <ReplyForm
        pathId={comment.path._id}
        replyTo={comment._id}
        handleReply={handlePostComment}
        handleCancel={() => setShowCommentInput(false)}
      />
    ) : (
      <>
        {likesSection}
        {replySection}
        <FooterSection
          Icon={ReplyIcon}
          alt='reply'
          text='Reply'
          handleClick={handleShowCommentInputClick}
        />
        {/* <FooterSection Icon={AcceptIcon} alt='accept' text='Accept Answer' /> */}
      </>
    )
  }

  return (
    <>
      <div className='comment' id={comment._id}>
        <div className='comment-arrow'>
          <img src={ArrowUp} alt='comment arrow up' />
        </div>
        <div className='comment-main' data-content={ArrowUp}>
          <div className='comment-main__header'>
            <div className={badgeClassName}>Best Answer</div>
            <img
              src={
                comment.user?.imageLink || generateInitialsAvatar(comment.user)
              }
              className='header__picture'
              alt='comment author'
            />
            <div className='header__author'>
              {comment.user
                ? `${comment.user.firstName} ${comment.user.lastName}`
                : 'User deleted'}
            </div>
            <div className='header__date'>{getDays(comment.createdAt)}</div>
          </div>
          {showEditCommentInput ? (
            <ReplyForm
              commentId={comment._id}
              content={comment.content}
              handleReply={handleSaveCommentChanges}
              handleCancel={() => setShowEditCommentInput(false)}
            />
          ) : (
            <>
              <div
                className='comment-main__content'
                dangerouslySetInnerHTML={{ __html: comment.content }}
              />
              <div className='comment-main__footer'>{commentFooter}</div>
            </>
          )}
        </div>
        <style jsx>{discussionCommentStyle}</style>
      </div>
      {showReply &&
        comment.replies.length > 0 &&
        comment.replies.map(reply => (
          <DiscussionReply
            key={reply._id}
            reply={reply}
            questionAuthor={questionAuthor}
          />
        ))}
    </>
  )
}

export default DiscussionComment

DiscussionComment.defaultProps = {
  currentUser: { name: 'Maria Doe' }
}
