import React, { Component } from 'react'
import { Form, Input, Button, Notification } from 'element-react'
import { FormGroup, RoleSelector } from '../ui-components'
import { Mutation, Query } from 'react-apollo'
import { profilePositionChangeMutation, fetchUsersProfile } from '../../api'
import '../../styles/theme/notification.css'
import { captureFilteredError, LoadingSpinner } from '../general'

export default class UserPosition extends Component {
  state = {
    form: {
      roleId: this.props.roleId,
      roleAtWork: this.props.roleAtWork,
      relatedLineOfWork: {
        name: '',
        _id: ''
      }
    },
    rules: {
      // relatedLineOfWork: [
      //   { trigger: 'change', type: 'object' },
      //   {
      //     validator: (rule, value, callback) => {
      //       const errors = []
      //       if (!value.name) {
      //         errors.push(new Error('Line of work is required!'))
      //       }
      //       callback(errors)
      //     }
      //   }
      // ],
      roleAtWork: [{ required: true, message: 'Required', trigger: 'change' }]
    },
    changeHappened: false
  }

  form = React.createRef()

  handleRoleChange = value => {
    const { form } = this.state
    this.setState({
      form: {
        ...form,
        roleAtWork: value,
        roleId: null
      },
      changeHappened: this.props.roleAtWork !== value
    })
  }

  handleRoleSelect = ({ _id, title }) => {
    const { form } = this.state
    this.setState({
      form: {
        ...form,
        roleAtWork: title,
        roleId: _id
      },
      changeHappened: this.props.roleAtWork !== title
    })
  }

  handleRoleSuggest = (title, mutation) => {
    mutation({
      variables: {
        title
      }
    })
      .then(({ data: { addRoleSuggestion: result } }) => {
        if (result !== null) {
          this.setState(({ form }) => ({
            form: {
              ...form,
              roleId: result._id
            }
          }))
          Notification({
            type: 'success',
            message: 'Your suggestion has been added',
            duration: 2500,
            offset: 90
          })
        }
      })
      .catch(err => {
        captureFilteredError(err)
        Notification({
          type: 'warning',
          message: 'Oops! Something went wrong',
          duration: 2500,
          offset: 90
        })
      })
  }

  // handleRoleChange = (e, value) => {
  //   if (value === undefined) {
  //     captureFilteredError(`Undefined value in autosuggest component`)
  //   } else {
  //     const { newValue } = value
  //     this.setState(({ form }) => {
  //       return {
  //         form: {
  //           ...form,
  //           roleAtWork: newValue,
  //         },
  //         changeHappened: this.props.roleAtWork !== newValue
  //       }
  //     })
  //   }
  // }

  render() {
    const { currentUser } = this.props
    const { form, rules, changeHappened } = this.state
    const { roleAtWork, relatedLineOfWork, roleId } = form
    return (
      <Form
        ref={this.form}
        model={form}
        rules={rules}
        onSubmit={e => e.preventDefault()}
      >
        {/* <FormGroup mainLabel="What is your line of work">
          <Form.Item prop="relatedLineOfWork">
            <LinesOfWorkSelector
              relatedLineOfWork={relatedLineOfWork}
              onChangeLineOfWork={this.onChangeLineOfWork}
            />
          </Form.Item>
        </FormGroup> */}
        <FormGroup mainLabel='What is your role'>
          <Form.Item prop='roleAtWork'>
            <RoleSelector
              value={roleAtWork || ''}
              handleRoleChange={value => this.handleRoleChange(value)}
              handleRoleSelect={role => this.handleRoleSelect(role)}
              handleRoleSuggest={(title, mutation) =>
                this.handleRoleSuggest(title, mutation)
              }
              currentUserId={currentUser._id}
            />
            {/* <Input
              value={roleAtWork}
              placeholder="Type your role here"
              onChange={val => this.handleRoleChange(val)}
            /> */}
          </Form.Item>
        </FormGroup>
        <div className='bottom-nav'>
          {changeHappened && roleAtWork.length > 0 && (
            <Mutation
              mutation={profilePositionChangeMutation}
              refetchQueries={['currentUserSkillsProfile']}
              onCompleted={() => this.setState({ changeHappened: false })}
            >
              {(profilePositionChangeMutation, { loading, error }) => {
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
                      this.form.current.validate(valid => {
                        if (valid) {
                          // removeTypename
                          // const { __typename, ...rest } = relatedLineOfWork
                          profilePositionChangeMutation({
                            variables: {
                              UserProfilePositionChangeInput: {
                                roleId,
                                roleAtWork,
                                relatedLineOfWork
                              }
                            },
                            update: async (
                              cache,
                              {
                                data: { profilePositionChangeMutation: result }
                              }
                            ) => {
                              try {
                                const { user: userId, roleAtWork } = result
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
                                      roleAtWork
                                    }
                                  }
                                })
                              } catch (err) {}
                            }
                          })
                            .then(res => {
                              if (
                                res.data &&
                                res.data.profilePositionChangeMutation !== null
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
      </Form>
    )
  }
}
