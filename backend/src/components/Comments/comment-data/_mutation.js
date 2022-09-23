import { isUser } from '~/directives'
import { Comment } from '~/models'
import { agenda, analytics } from '~/config'
import { sentryCaptureException } from '../../../utils'

export const mutationTypes = `
  type Mutation {
    createComment(inputData: CommentInput!): Comment @${isUser} 
    editComment(inputData: CommentEditInput!): Comment @${isUser}
    likeComment(commentId: ID!): Comment @${isUser}
    deleteComment(commentId: ID!): Comment @${isUser}
  }
`

export const mutationResolvers = {
  Mutation: {
    createComment: async (
      _,
      { inputData },
      { user: { _id: user, organizationId } }
    ) => {
      const comment = await Comment.create({
        ...inputData,
        user,
        organizationId
      })

      if (inputData.replyTo) {
        // SEND REPLY NOTIFICATION TO USER
        const main = await Comment.findOneAndUpdate(
          { _id: inputData.replyTo },
          {
            $addToSet: {
              replies: comment._id
            }
          },
          { new: true }
        )

        if (!main) throw new Error(`Comment deleted: ${inputData.replyTo}`)

        const questionAuthor = main.user

        await analytics.trackSafe({
          userId: String(user),
          event: 'question_reply',
          properties: {
            questionId: String(inputData.replyTo),
            replyId: String(comment._id)
          }
        })

        agenda.now('singleUserReplyNotification', {
          user: String(questionAuthor),
          reply: String(comment._id)
        })

        return main
      } else {
        await analytics.trackSafe({
          userId: String(user),
          event: 'question_asked',
          properties: {
            questionId: String(comment._id)
          }
        })

        agenda.now('singleUserQuestionAskedNotification', {
          user: String(user),
          comment: String(comment._id)
        })
        return comment
      }
    },
    editComment: async (_, { inputData }) =>
      Comment.findOneAndUpdate(
        { _id: inputData.commentId },
        {
          $set: {
            ...inputData,
            updatedAt: new Date()
          }
        },
        { new: true }
      ),
    likeComment: async (_, { commentId }, { user: { _id: userId } }) => {
      // IF LIKED, UNLIKE
      const unlikedComment = await Comment.findOneAndUpdate(
        { _id: commentId, likes: userId },
        {
          $pull: {
            likes: userId
          }
        },
        { new: true }
      )
      if (unlikedComment) {
        return unlikedComment
      } else {
        // ELSE LIKE
        const result = await Comment.findOneAndUpdate(
          { _id: commentId },
          {
            $addToSet: {
              likes: userId
            }
          },
          { new: true }
        )

        await analytics.trackSafe({
          userId: String(userId),
          event: 'comment_liked',
          properties: {
            commentId: String(commentId)
          }
        })

        agenda
          .create('singleUserCommentLikedNotification', {
            user: String(userId),
            comment: String(commentId)
          })
          .unique(
            { 'data.comment': String(commentId), 'data.user': String(userId) },
            { insertOnly: true }
          )
          .schedule('in 1 minute')
          .save()

        return result
      }
    },
    deleteComment: async (_, { commentId }) => {
      const comment = await Comment.findByIdAndRemove(commentId)

      if (comment.replyTo) {
        await Comment.findOneAndUpdate(
          { _id: comment.replyTo },
          {
            $pull: {
              replies: comment._id
            }
          }
        )
      }

      if (comment.replies.length > 0) {
        await Comment.deleteMany({ _id: { $in: comment.replies } })
      }

      return comment
    }
  }
}
