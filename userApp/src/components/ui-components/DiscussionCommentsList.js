import React from 'react'
import DiscussionComment from './DiscussionComment'
import discussionCommentsListStyle from '../../styles/discussionCommentsListStyle'

const DiscussionCommentsList = ({ questionAuthor, comments }) => {
  // const sortedComments = comments.sort(
  //   (a, b) => parseFloat(b.likes) - parseFloat(a.likes)
  // )
  // const bestAnswer = sortedComments[0]
  // const ohterComments = sortedComments.slice(1, sortedComments.length)

  return (
    <div className='comments__list'>
      <ul>
        {/* <li>
          <Comment
            comment={bestAnswer}
            badgeClassName={'header__badge'}
            isComment={true}
          />
        </li> */}
        {comments.map(comment => (
          <li key={comment._id}>
            <DiscussionComment
              questionAuthor={questionAuthor}
              comment={comment}
              badgeClassName={'header__badge--empty'}
            />
          </li>
        ))}
      </ul>
      <style jsx>{discussionCommentsListStyle}</style>
    </div>
  )
}

export default DiscussionCommentsList
