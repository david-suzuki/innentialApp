import React, { useState, useContext } from 'react'
import { Input, Button } from 'element-react'
import { useMutation } from 'react-apollo'
import {
  createReply,
  editReply,
  fetchAllCommentsForPath,
  fetchAllCommentsForUser,
  fetchAllComments
} from '$/api'
import InfoIcon from '$/static/info-icon.svg'
import { UserContext } from '$/utils'
import { captureFilteredError } from '../general'
import ReactQuill from 'react-quill'

const updateCache = ({ proxy, query, queryName, variables, mainComment }) => {
  try {
    const { [queryName]: allComments } = proxy.readQuery({
      query: query,
      variables
    })

    const level1Comment = allComments.some(
      comment => comment._id === mainComment._id
    )

    if (level1Comment) {
      proxy.writeQuery({
        query: query,
        variables,
        data: {
          [queryName]: allComments.map(comment => {
            if (comment._id === mainComment._id) {
              return mainComment
            }
            return comment
          })
        }
      })
    } else {
      const level2Comment = allComments.some(comment =>
        comment.replies.some(reply => reply._id === mainComment._id)
      )

      if (level2Comment) {
        proxy.writeQuery({
          query: query,
          variables,
          data: {
            [queryName]: allComments.map(comment => {
              const reply = comment.replies.find(
                reply => reply._id === mainComment._id
              )
              if (reply) {
                return {
                  ...comment,
                  replies: comment.replies.map(r => {
                    if (r._id === mainComment._id) {
                      return mainComment
                    }
                    return r
                  })
                }
              }
              return comment
            })
          }
        })
      }
    }
  } catch (e) {}
}

const ReplyForm = ({
  pathId,
  commentId,
  replyTo,
  handleReply,
  handleCancel,
  content: initialContent
}) => {
  const { _id: userId } = useContext(UserContext)
  const [content, setContent] = useState(initialContent || '')
  const [mutate, { loading }] = useMutation(
    commentId ? editReply : createReply,
    {
      update: (proxy, { data: { createComment: mainComment } }) => {
        if (!commentId) {
          updateCache({
            proxy,
            query: fetchAllCommentsForPath,
            queryName: 'fetchAllCommentsForPath',
            variables: { pathId },
            mainComment
          })
          updateCache({
            proxy,
            query: fetchAllCommentsForUser,
            queryName: 'fetchAllCommentsForUser',
            mainComment
          })
          updateCache({
            proxy,
            query: fetchAllComments,
            queryName: 'fetchAllComments',
            mainComment
          })
        }
      }
    }
  )

  return (
    <div className='reply__form'>
      <div id='toolbar' style={{ display: 'none' }} />
      <ReactQuill
        value={content}
        onChange={setContent}
        modules={{ toolbar: '#toolbar' }}
        formats={[]}
        theme='snow'
        placeholder='Type your reply here...'
        style={{ background: '#fff', marginBottom: 30 }}
      />
      {/* <Input
        type='textarea'
        autosize={{ minRows: 2, maxRows: 4 }}
        value={content}
        onChange={setContent}
        placeholder='Type your reply here...'
      /> */}
      <div>
        {!commentId && (
          <div className='reply__form__info'>
            <img src={InfoIcon} alt='info' />
            <span>
              Your reply will be displayed on the path page for all users from
              your organization.
            </span>
          </div>
        )}
        <div className='reply__form__buttons'>
          <Button
            type='primary'
            loading={loading}
            onClick={async () => {
              try {
                const inputData = commentId
                  ? {
                      commentId,
                      content
                    }
                  : {
                      pathId,
                      replyTo,
                      content
                    }
                await mutate({
                  variables: {
                    inputData
                  }
                })
                if (!commentId) {
                  window.hj &&
                    window.hj('identify', userId, {
                      'Posted reply': true
                    })
                }
                handleReply()
              } catch (err) {
                captureFilteredError(err)
              }
            }}
          >
            {commentId ? 'Save' : 'Post Reply'}
          </Button>
          <Button type='secondary' onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </div>
      <style>{`
        .ql-container.ql-snow {
          font-family: 'Poppins';
          border-radius: 4px;
          border-color: #8494b2;
          color: #000;
      }

        .ql-editor {
          height: 70px;
          overflow-y: auto;
          min-height: unset !important;
      }
      `}</style>
    </div>
  )
}

export default ReplyForm
