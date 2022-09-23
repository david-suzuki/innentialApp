import React from 'react'
import { Input, Button, Notification, Form } from 'element-react'
import '../styles/theme/notification.css'
import { Mutation } from 'react-apollo'
import { publicResetPassword, publicResetPasswordSetPassword } from '../api'
import { withRouter } from 'react-router-dom'
import { hashString, removeTokens, emailCharacterValidator } from '../utils'
import { FormDescription, FormGroup } from './ui-components'
import resetPasswordStyle from '../styles/resetPasswordStyle'
import { LoadingSpinner, captureFilteredError } from './general'

// TODO: VALIDATION!!

const PasswordResetHandler = ({ match, history }) => {
  const { resetId } = match.params

  const toLogin = () => history.push('/login')
  return <PasswordSet resetId={resetId} toLogin={toLogin} />
}

class PasswordGet extends React.Component {
  state = {
    emailValue: ''
  }

  myRef = React.createRef()

  onEmailChanged = val => {
    this.setState({ emailValue: val })
  }

  goBack = () => {
    this.props.history.goBack()
  }

  render() {
    const { emailValue } = this.state
    return (
      <div className='container-main reset-password'>
        <div className='reset-password__heading'>
          <i
            className='icon icon-small-right'
            size='large'
            onClick={e => {
              e.preventDefault()
              this.goBack()
            }}
          />
          <FormDescription label='Enter your email' />
        </div>
        <Form
          model={this.state}
          ref={this.myRef}
          onSubmit={e => e.preventDefault()}
        >
          <FormGroup>
            <Form.Item
              prop='emailValue'
              label='Email'
              rules={[
                {
                  type: 'email',
                  message: 'This is not a valid email address',
                  trigger: 'blur',
                  required: true
                },
                {
                  validator: emailCharacterValidator
                }
              ]}
            >
              <Input
                value={emailValue}
                onChange={val => this.onEmailChanged(val)}
              />
            </Form.Item>
          </FormGroup>
          <Mutation mutation={publicResetPassword}>
            {(publicResetPassword, { loading, client }) => {
              if (loading) return <LoadingSpinner />
              return (
                <Button
                  className='el-button--green'
                  onClick={e => {
                    e.preventDefault()
                    this.myRef.current.validate(valid => {
                      if (valid) {
                        publicResetPassword({
                          variables: { email: emailValue.toLowerCase() }
                        })
                          .then(res => {
                            if (
                              res.data &&
                              res.data.publicResetPassword === 'success'
                            ) {
                              Notification({
                                type: 'success',
                                message:
                                  'A password reset link has been sent to your email.',
                                duration: 2500,
                                offset: 90
                              })
                              this.props.history.push('/login')
                            } else {
                              Notification({
                                type: 'warning',
                                message: `We couldn't send a password reset link. Perhaps this account is inactive.`,
                                duration: 2500,
                                offset: 90
                              })
                            }
                          })
                          .catch(err => {
                            captureFilteredError(err)
                          })
                        sessionStorage.clear()
                        client.clearStore().then(() => {
                          client.resetStore()
                        })
                        removeTokens()
                      }
                    })
                  }}
                >
                  Submit
                </Button>
              )
            }}
          </Mutation>
        </Form>
        <style jsx global>
          {resetPasswordStyle}
        </style>
      </div>
    )
  }
}

class PasswordSet extends React.Component {
  state = {
    password: '',
    passwordCheck: ''
  }

  myRef = React.createRef()

  formRules = {
    password: [
      // TODO: Add more rules?
      { required: true, message: 'Required', trigger: 'change' },
      {
        validator: (rule, value, callback) => {
          const errors = []
          if (value.length < 8) {
            errors.push(new Error('Password must be at least 8 characters'))
          }
          callback(errors)
        }
      }
    ],
    passwordCheck: [
      { required: true, message: 'Required', trigger: 'change' },
      {
        validator: (rule, value, callback) => {
          if (value !== this.state.password) {
            callback(new Error("Passwords don't match"))
          } else {
            callback()
          }
        }
      }
    ]
  }

  handleChange = (val, key) => {
    this.setState({ [key]: val })
  }

  render() {
    const { password } = this.state
    return (
      <div className='container-main reset-password'>
        <Form
          model={this.state}
          rules={this.formRules}
          ref={this.myRef}
          onSubmit={e => e.preventDefault()}
        >
          <h3>Set your new password</h3>
          <FormGroup>
            <Form.Item prop='password' label='Password'>
              <Input
                onChange={val => this.handleChange(val, 'password')}
                type='password'
              />
            </Form.Item>
            <Form.Item prop='passwordCheck' label='Repeat password'>
              <Input
                onChange={val => this.handleChange(val, 'passwordCheck')}
                type='password'
              />
            </Form.Item>
          </FormGroup>
          <Mutation mutation={publicResetPasswordSetPassword}>
            {(publicResetPasswordSetPassword, { loading, client }) => {
              if (loading) return <LoadingSpinner />
              return (
                <Button
                  nativeType='submit'
                  type='primary'
                  className='el-button--green'
                  onClick={e => {
                    e.preventDefault()
                    this.myRef.current.validate(valid => {
                      if (valid) {
                        publicResetPasswordSetPassword({
                          variables: {
                            password: hashString(password).digest,
                            resetId: this.props.resetId
                          }
                        })
                          .then(res => {
                            if (
                              res.data &&
                              res.data.publicResetPasswordSetPassword ===
                                'success'
                            ) {
                              Notification({
                                type: 'success',
                                message: `Your password has been successfully changed`,
                                duration: 2500,
                                offset: 90
                              })
                              this.props.toLogin()
                            } else {
                              Notification({
                                type: 'warning',
                                message: 'Something went wrong',
                                duration: 2500,
                                offset: 90
                              })
                              this.props.toLogin()
                            }
                          })
                          .catch(err => {
                            console.log(err)
                          })
                        sessionStorage.clear()
                        client.clearStore().then(() => {
                          client.resetStore()
                        })
                        removeTokens()
                      }
                    })
                  }}
                >
                  Submit
                </Button>
              )
            }}
          </Mutation>
        </Form>
        <style jsx global>
          {resetPasswordStyle}
        </style>
      </div>
    )
  }
}

export const PasswordSetPassword = withRouter(PasswordResetHandler)
export const PasswordGetLink = withRouter(PasswordGet)
