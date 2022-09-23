import React, { Component, useContext } from 'react'
import { Mutation } from 'react-apollo'
import { Input, Button, Form, Notification } from 'element-react'
// import { Link, useLocation } from 'react-router-dom'
import discussionFormStyle from '../../styles/discussionFormStyle'
import InfoIcon from '$/static/info-icon.svg'
import {
  createComment,
  editComment,
  fetchAllCommentsForPath,
  fetchAllCommentsForUser,
  fetchAllComments
} from '$/api'
import { captureFilteredError } from '../general'
import { UserContext } from '../../utils'
import ReactQuill from 'react-quill'

const updateCache = ({ proxy, query, queryName, variables, newComment }) => {
  try {
    const { [queryName]: allComments } = proxy.readQuery({
      query: query,
      variables
    })

    proxy.writeQuery({
      query: query,
      variables,
      data: {
        [queryName]: [newComment, ...allComments]
      }
    })
  } catch (e) {}
}

class DiscussionForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      message: '#556685',
      form: {
        labelPosition: 'top',
        summary: props.abstract || '',
        description: props.content || ''
      },
      rules: {
        summary: [
          {
            required: true,
            message: 'The field is required',
            trigger: 'submit'
          },
          {
            validator: (rule, value, callback) => {
              setTimeout(() => {
                if (value === '') {
                  callback(new Error('The field is required'))
                } else {
                  callback()
                  // if (value.length > 32) {
                  //   callback(this.setState({ message: 'red' }))
                  // } else {
                  //   callback(this.setState({ message: '#556685' }))
                  // }
                }
              }, 1000)
            },
            trigger: 'change'
          }
        ],
        description: [
          {
            required: true,
            message: 'This field is required',
            trigger: 'submit'
          },
          {
            validator: (rule, value, callback) => {
              setTimeout(() => {
                if (value === '') {
                  callback(new Error('The field is required'))
                } else {
                  callback()
                  // if (value.length < 32) {
                  //   callback(
                  //     new Error(
                  //       'The description must contain a minimum of 32 characters'
                  //     )
                  //   )
                  // } else {
                  //   callback()
                  // }
                }
              }, 1000)
            },
            trigger: 'change'
          }
        ]
      }
    }
  }

  discussionForm = React.createRef()

  handleChange = (key, value) => {
    this.setState({ [key]: value })
  }

  handleChangeInput = (key, value) => {
    this.setState(({ form }) => ({
      form: {
        ...form,
        [key]: value
      }
    }))
  }

  handleSubmit(mutate) {
    // e.preventDefault()

    this.discussionForm.current.validate(async valid => {
      if (valid) {
        const { pathId, commentId, handleSubmit, currentUser } = this.props
        const {
          form: { summary, description }
        } = this.state
        try {
          const {
            data: { createComment: comment }
          } = await mutate({
            variables: {
              inputData: {
                ...(commentId ? { commentId } : { pathId }),
                abstract: summary,
                content: description
              }
            },
            // NOTE: UPDATE FUNCTION ONLY FOR ADDING
            update: (proxy, { data: { createComment: newComment } }) => {
              if (!commentId) {
                updateCache({
                  proxy,
                  query: fetchAllCommentsForPath,
                  queryName: 'fetchAllCommentsForPath',
                  newComment,
                  variables: { pathId }
                })
                updateCache({
                  proxy,
                  query: fetchAllCommentsForUser,
                  queryName: 'fetchAllCommentsForUser',
                  newComment
                })
                updateCache({
                  proxy,
                  query: fetchAllComments,
                  queryName: 'fetchAllComments',
                  newComment
                })
              }
            }
          })
          Notification({
            title: commentId
              ? 'Your changes have been saved'
              : 'Question added successfully',
            message: commentId
              ? 'They will be displayed on the path page. You can always edit your question on the "Your Questions" tab.'
              : 'Your question will be displayed on the path page for all users from your organization.',
            type: 'success',
            offset: 100
          })
          if (!commentId) {
            window.hj &&
              window.hj('identify', currentUser._id, {
                'Posted question': true
              })
          }
          handleSubmit(comment?._id)
        } catch (err) {
          captureFilteredError(err)
          Notification({
            message: 'Oops! Something went wrong.',
            type: 'warning',
            offset: 100
          })
        }
      } else {
        return false
      }
    })
  }

  render() {
    const {
      title,
      underline,
      infoPosition,
      handleCancel,
      buttonName,
      commentId,
      submitButtonName
    } = this.props

    const { form, rules } = this.state
    const { summary, description } = form

    return (
      <div className='discussionForm'>
        <div
          className={
            underline ? 'form__title form__title--underline' : 'form__title'
          }
        >
          {title}
        </div>
        {infoPosition === 'top' && (
          <div className='form__info'>
            <img src={InfoIcon} alt='info' />
            <span>
              Your question will be displayed on the path page for all users
              from your organization.
            </span>
          </div>
        )}
        <Form
          ref={this.discussionForm}
          model={form}
          rules={rules}
          labelWidth='100'
          labelPosition={this.state.form.labelPosition}
        >
          <Form.Item prop='summary'>
            <Input
              type='text'
              value={summary}
              onChange={value => this.handleChangeInput('summary', value)}
              autoComplete='off'
              placeholder='Enter question summary'
              style={{ marginBottom: '10px' }}
            />
            {/* <div
              className='form__message'
              style={{ color: this.state.message }}
            >
              The summary must contain a maximum of 32 characters
            </div> */}
          </Form.Item>
          <Form.Item prop='description'>
            <div id='toolbar' style={{ display: 'none' }} />
            <ReactQuill
              value={description}
              onChange={value => this.handleChangeInput('description', value)}
              modules={{ toolbar: '#toolbar' }}
              formats={[]}
              theme='snow'
              placeholder='Provide more details'
              style={{ background: '#fff', marginBottom: 30 }}
            />
            {/* <Input
              type='textarea'
              value={description}
              onChange={value => this.handleChangeInput('description', value)}
              autosize={{ minRows: 4, maxRows: 6 }}
              autoComplete='off'
              placeholder='Provide more details'
            /> */}
          </Form.Item>
          {infoPosition === 'bottom' && (
            <div className='form__info form__info--lower'>
              <img src={InfoIcon} alt='info' />
              <span>
                Your question will be displayed on the path page for all users
                from your organization.
              </span>
            </div>
          )}
          <Form.Item>
            <Mutation mutation={commentId ? editComment : createComment}>
              {(mutate, { loading }) => (
                <Button
                  type='primary'
                  style={{
                    padding: '.75em 2.375em'
                  }}
                  loading={loading}
                  onClick={() => this.handleSubmit(mutate)}
                >
                  {submitButtonName}
                </Button>
              )}
            </Mutation>
            <Button
              type='default'
              style={{
                padding: '.75em 2.375em'
              }}
              onClick={handleCancel}
            >
              {buttonName}
            </Button>
          </Form.Item>
        </Form>
        <style>{`
          .ql-container.ql-snow {
            font-family: 'Poppins';
            border-radius: 4px;
            border-color: #8494b2;
            color: #000;
        }

          .ql-editor {
            height: 112px;
            overflow-y: auto;
            min-height: unset !important;
        }
        `}</style>
        <style jsx>{discussionFormStyle}</style>
      </div>
    )
  }
}

export default props => {
  const currentUser = useContext(UserContext)
  return <DiscussionForm {...props} currentUser={currentUser} />
}
