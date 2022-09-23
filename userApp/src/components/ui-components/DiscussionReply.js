import React, { useState, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
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
import discussionReplyStyle from '../../styles/discussionReplyStyle'
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
          if (
            c.replies.some(r => r.replies.some(rr => rr._id === comment._id))
          ) {
            return {
              ...c,
              replies: c.replies.map(r => {
                if (r.replies.some(rr => rr._id === comment._id)) {
                  return {
                    ...r,
                    replies: r.replies.filter(rr => rr._id !== comment._id)
                  }
                }
                return r
              })
            }
          }
          return c
        })
      }
    })
  } catch (err) {}
}

const update = (proxy, { data: { deleteComment: comment } }) => {
  // DOESN'T WORK IN CASE OF 2ND LEVEL NESTING
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

const DiscussionReply = ({ questionAuthor, reply }) => {
  const currentUser = useContext(UserContext)

  // const [likesClicked, setLikesClicked] = useState(false)
  const [showReply, setShowReply] = useState(false)
  const [showEditReplyInput, setShowEditReplyInput] = useState(false)
  const [replyContent, setReplyContent] = useState(reply.content)

  const [like] = useMutation(likeComment)
  const [remove] = useMutation(deleteComment)

  const isLiked = reply.likes.some(id => id === currentUser._id)

  const location = useLocation()
  const pathname = `${location.pathname.split('/')[1]}`

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
          commentId: reply._id
        }
      })
    } catch (err) {
      console.error(err)
    }
  }

  const handleShowEditReplyInputClick = () => {
    setShowEditReplyInput(!showEditReplyInput)
  }

  const handleClickReply = () => {
    setShowReply(!showReply)
  }

  const handleEditReplyInputChange = value => {
    setReplyContent(value)
  }

  const handleClickDeleteReply = async () => {
    try {
      await MessageBox.confirm(
        'This cannot be undone',
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
            commentId: reply._id
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

  const handleSaveReplyChanges = () => {
    Notification({
      message: 'Your changes have been saved!',
      type: 'success'
    })
    setShowEditReplyInput(false)
  }

  let likesSection, replySection

  if (reply.likes.length === 0) {
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

  if (reply.likes.length > 0) {
    likesSection = (
      <FooterSection
        Icon={!isLiked ? LikeIcon : LikeIconClicked}
        handleClick={handleClickLikes}
        alt='heart'
        textClassName={
          !isLiked ? 'footer__section__text' : 'footer__section__text--clicked'
        }
        text={`${reply.likes.length} Like${reply.likes.length > 1 ? 's' : ''}`}
      />
    )
  }

  //  if (reply.likes > 1) {
  //    likesSection = (
  //      <div className='footer__section' onClick={handleClickLikes}>
  //        <img
  //          src={!likesClicked ? LikeIcon : LikeIconClicked}
  //          alt='heart'
  //          className='footer__section__icon'
  //        />
  //        <div
  //          className={
  //            !likesClicked
  //              ? 'footer__section__text'
  //              : 'footer__section__text--clicked'
  //          }
  //        >
  //          {reply.likes} Likes
  //        </div>
  //      </div>
  //    )
  //  }

  // if (reply.replies.length > 0) {
  //   replySection = (
  //     <FooterSection
  //       Icon={RepliesIcon}
  //       alt='talk'
  //       handleClick={handleClickReply}
  //       text={
  //         !showReply
  //           ? `${reply.replies.length} Repl${
  //               reply?.replies?.length > 1 ? 'ies' : 'y'
  //             }`
  //           : `Hide Repl${reply?.replies?.length > 1 ? 'ies' : 'y'}`
  //       }
  //     />
  //   )
  // }

  let replyFooter

  if (currentUser._id !== reply.user._id) {
    replyFooter = likesSection
  }

  if (currentUser._id === reply.user._id) {
    replyFooter = (
      <>
        {likesSection}
        <FooterSection
          Icon={EditIcon}
          alt='edit'
          text='Edit'
          handleClick={handleShowEditReplyInputClick}
        />
        <FooterSection
          Icon={DeleteIcon}
          handleClick={handleClickDeleteReply}
          alt='delete'
          text='Delete'
        />
      </>
    )
  }

  return (
    <div className='reply'>
      <div className='reply-arrow'>
        <img src={ArrowUp} alt='reply arrow up' />
      </div>
      <div className='reply-main' data-content={ArrowUp}>
        <div className='reply-main__header'>
          <img
            src={reply.user?.imageLink || generateInitialsAvatar(reply.user)}
            className='header__picture'
            alt='reply author'
          />
          <div className='header__author'>
            {reply.user
              ? `${reply.user.firstName} ${reply.user.lastName}`
              : 'User deleted'}
          </div>
          <div className='header__date'>{getDays(reply.createdAt)}</div>
        </div>
        {showEditReplyInput ? (
          <ReplyForm
            commentId={reply._id}
            content={reply.content}
            handleReply={handleSaveReplyChanges}
            handleCancel={handleShowEditReplyInputClick}
          />
        ) : (
          <>
            <div
              className='reply-main__content'
              dangerouslySetInnerHTML={{ __html: reply.content }}
            />
            <div className='reply-main__footer'>{replyFooter}</div>
          </>
        )}
      </div>
      <style jsx>{discussionReplyStyle}</style>
    </div>
  )
}

export default DiscussionReply
