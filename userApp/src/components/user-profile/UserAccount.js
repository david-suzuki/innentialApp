import React, { Component, useState } from 'react'
import { Form, Input, Button, Notification } from 'element-react'
import { FormGroup, Photo, UserSetLocation, Statement } from '../ui-components'
import { Mutation, useQuery } from 'react-apollo'
import {
  profilePasswordChangeMutation,
  profileNameChangeMutation,
  fetchUsersProfile,
  fetchUserContentInteractions
} from '../../api'
import { hashString } from '../../utils'
import '../../styles/theme/notification.css'
import { captureFilteredError, LoadingSpinner } from '../general'
import { nameFormRules, passwordFormRules } from './constants/_formRules'

const PasswordInput = ({
  value,
  onFocus: handleFocus,
  icon,
  onIconClick: handleIconClick,
  type
}) => {
  return (
    <div className='el-input'>
      <i
        className={`icon ${icon}`}
        style={{ cursor: 'pointer', right: '5px' }}
        onClick={handleIconClick}
      />
      <input
        className='el-input__inner'
        type={type}
        readOnly
        onFocus={handleFocus}
        value={value}
      />
    </div>
  )
}

const selectAndCopyToClipboard = async (e, value) => {
  e.target.select()
  if (value) {
    try {
      await window.navigator.clipboard.writeText(value)
      Notification({
        type: 'info',
        message: 'Copied to clipboard',
        duration: 2500,
        offset: 90,
        iconClass: 'el-icon-info'
      })
    } catch (err) {
      // COULD NOT COPY TO CLIPBOARD
    }
  }
}

const DeliveryCredentials = () => {
  const { data, loading, error } = useQuery(fetchUserContentInteractions)

  const [visible, setVisible] = useState(false)

  if (loading) return <LoadingSpinner />

  if (error) {
    captureFilteredError(error)
    return null
  }

  const credentials = data?.fetchUserContentInteractions?.learningCredentials

  if (credentials) {
    const { email, password } = credentials
    return (
      <FormGroup mainLabel='Your learning credentials'>
        <Input
          value={email}
          readOnly
          onFocus={e => selectAndCopyToClipboard(e, email)}
        />
        <PasswordInput
          value={password}
          type={visible ? 'text' : 'password'}
          icon={visible ? 'icon icon-b-preview' : 'icon icon-eye-17'}
          onFocus={e => selectAndCopyToClipboard(e, password)}
          onIconClick={() => setVisible(!visible)}
        />
      </FormGroup>
    )
  }
  return null
}

export default class UserAccount extends Component {
  constructor(props) {
    super(props)

    this.defaults = {
      firstName: this.props.currentUser.firstName,
      lastName: this.props.currentUser.lastName,
      oldPassword: ''
    }

    this.state = {
      nameForm: {
        firstName: this.props.currentUser.firstName,
        lastName: this.props.currentUser.lastName
      },
      // nameFormRules: {
      //   firstName: [{ required: true, message: 'Required', trigger: 'change' }],
      //   lastName: [{ required: true, message: 'Required', trigger: 'change' }]
      // },

      passwordForm: {
        oldPassword: '',
        password: '',
        passwordCheck: ''
      }
      // passwordFormRules: {
      //   oldPassword: [
      //     { required: true, message: 'Required', trigger: 'change' }
      //   ],
      //   password: [
      //     // TODO: Add more rules?
      //     { required: true, message: 'Required', trigger: 'change' },
      //     {
      //       validator: (rule, value, callback) => {
      //         const errors = []
      //         if (value.length < 6) {
      //           errors.push(new Error('Password must be at least 6 characters'))
      //         }
      //         callback(errors)
      //       }
      //     }
      //   ],
      //   passwordCheck: [
      //     { required: true, message: 'Required', trigger: 'change' },
      //     {
      //       validator: (rule, value, callback) => {
      //         if (value !== this.state.passwordForm.password) {
      //           callback(new Error("Passwords don't match"))
      //         } else {
      //           callback()
      //         }
      //       }
      //     }
      //   ]
      // }
    }
  }

  nameForm = React.createRef()
  passwordForm = React.createRef()

  handleChange = (formKey, key, value) => {
    const formToChange = this.state[formKey]
    this.setState({
      [formKey]: {
        ...formToChange,
        [key]: value
      }
    })
  }

  render() {
    const {
      nameForm,
      // nameFormRules,
      nameForm: { firstName, lastName },
      passwordForm,
      // passwordFormRules,
      passwordForm: { oldPassword, password, passwordCheck }
    } = this.state
    return (
      <div>
        <Form
          ref={this.nameForm}
          model={nameForm}
          rules={nameFormRules}
          onSubmit={e => e.preventDefault()}
        >
          <FormGroup mainLabel='Personal Details'>
            <div style={{ paddingBottom: '16px' }}>
              <Form.Item label='Email'>
                <Input
                  type='text'
                  defaultValue={this.props.currentUser.email}
                  disabled
                />
              </Form.Item>
            </div>

            <Form.Item label='First Name' prop='firstName'>
              <Input
                type='text'
                placeholder=''
                value={firstName}
                onChange={val =>
                  this.handleChange('nameForm', 'firstName', val)
                }
                trim
              />
            </Form.Item>
            <Form.Item label='Last Name' prop='lastName'>
              <Input
                type='text'
                placeholder=''
                value={lastName}
                onChange={val => this.handleChange('nameForm', 'lastName', val)}
                trim
              />
            </Form.Item>
            <UserSetLocation selected={this.props.currentUser.location} />
          </FormGroup>
        </Form>
        <div style={{ padding: '15px 0' }}>
          {(this.defaults.firstName !== firstName ||
            this.defaults.lastName !== lastName) && (
            <Mutation
              mutation={profileNameChangeMutation}
              refetchQueries={[
                'currentUser',
                'fetchTeam',
                'fetchCurrentUserTeams'
              ]}
            >
              {(profileNameChangeMutation, { loading, error }) => {
                if (loading) return <LoadingSpinner />
                if (error) {
                  captureFilteredError(error)
                  return null
                }
                return (
                  <Button
                    nativeType='submit'
                    type='primary'
                    onClick={e => {
                      e.preventDefault()
                      this.nameForm.current.validate(valid => {
                        if (valid) {
                          profileNameChangeMutation({
                            variables: {
                              firstName,
                              lastName
                            },
                            update: async cache => {
                              const userId = this.props.currentUser._id
                              try {
                                const {
                                  fetchUsersProfile: cachedProfile
                                } = await cache.readQuery({
                                  query: fetchUsersProfile,
                                  variables: { userId }
                                })
                                await cache.writeQuery({
                                  query: fetchUsersProfile,
                                  variables: { userId },
                                  data: {
                                    fetchUsersProfile: {
                                      ...cachedProfile,
                                      firstName,
                                      lastName
                                    }
                                  }
                                })
                              } catch (err) {}
                            }
                          })
                            .then(res => {
                              if (
                                res.data &&
                                res.data.profileNameChangeMutation !== null
                              )
                                Notification({
                                  type: 'success',
                                  message: 'Your changes have been submitted',
                                  duration: 2500,
                                  offset: 90
                                })
                              else
                                Notification({
                                  type: 'warning',
                                  message: 'Oops something went wrong',
                                  duration: 2500,
                                  offset: 90
                                })
                            })
                            .catch(e => {
                              Notification({
                                type: 'error',
                                message: 'Oops something went wrong',
                                duration: 2500,
                                offset: 90,
                                iconClass: 'el-icon-error'
                              })
                            })
                        }
                      })
                    }}
                  >
                    Submit Changes
                  </Button>
                )
              }}
            </Mutation>
          )}
        </div>
        <Photo />
        <Form
          onSubmit={e => e.preventDefault()}
          ref={this.passwordForm}
          model={passwordForm}
          rules={passwordFormRules(this.state)}
        >
          <FormGroup mainLabel='Change your password'>
            <Form.Item label='Old Password' prop='oldPassword'>
              <Input
                type='password'
                value={oldPassword}
                onChange={val =>
                  this.handleChange('passwordForm', 'oldPassword', val)
                }
              />
            </Form.Item>
            <Form.Item label='New Password' prop='password'>
              <Input
                type='password'
                value={password}
                onChange={val =>
                  this.handleChange('passwordForm', 'password', val)
                }
              />
            </Form.Item>
            <Form.Item label='Repeat New Password' prop='passwordCheck'>
              <Input
                type='password'
                value={passwordCheck}
                onChange={val =>
                  this.handleChange('passwordForm', 'passwordCheck', val)
                }
              />
            </Form.Item>
          </FormGroup>
        </Form>
        <div style={{ padding: '15px 0' }}>
          {this.defaults.oldPassword !== oldPassword && (
            <Mutation
              mutation={profilePasswordChangeMutation}
              onCompleted={() =>
                this.setState({
                  passwordForm: {
                    oldPassword: '',
                    password: '',
                    passwordCheck: ''
                  }
                })
              }
            >
              {(profilePasswordChangeMutation, { loading, error }) => {
                if (loading) return <LoadingSpinner />
                if (error) {
                  captureFilteredError(error)
                  return null
                }
                return (
                  <Button
                    nativeType='submit'
                    type='primary'
                    onClick={e => {
                      e.preventDefault()
                      this.passwordForm.current.validate(valid => {
                        if (valid) {
                          profilePasswordChangeMutation({
                            variables: {
                              UserProfilePasswordChangeInput: {
                                oldPassword: hashString(oldPassword).digest,
                                newPassword: hashString(password).digest
                              }
                            }
                          })
                            .then(res => {
                              if (
                                res.data &&
                                res.data.profilePasswordChangeMutation &&
                                res.data.profilePasswordChangeMutation.token &&
                                res.data.profilePasswordChangeMutation
                                  .refreshToken
                              )
                                Notification({
                                  type: 'success',
                                  message: 'Your changes have been submitted',
                                  duration: 2500,
                                  offset: 90
                                })
                              else
                                Notification({
                                  type: 'warning',
                                  message: 'Oops something went wrong',
                                  duration: 2500,
                                  offset: 90
                                })
                            })
                            .catch(e => {
                              Notification({
                                type: 'error',
                                message: 'Oops something went wrong',
                                duration: 2500,
                                offset: 90,
                                iconClass: 'el-icon-error'
                              })
                            })
                        }
                      })
                    }}
                  >
                    Submit Changes
                  </Button>
                )
              }}
            </Mutation>
          )}
        </div>
        <DeliveryCredentials />
      </div>
    )
  }
}
