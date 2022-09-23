import React, { Component, useState, useEffect } from 'react'
import {
  Input,
  Form,
  Button,
  Notification,
  Select,
  Checkbox,
  Switch
} from 'element-react'
import '../styles/theme/notification.css'
import { FormDescription, FormGroup } from './ui-components'
import { Mutation, useQuery, useMutation } from 'react-apollo'
import {
  addNewUser,
  generateInviteLink,
  toggleInviteLinkActive,
  fetchCurrentUserTeams,
  fetchCurrentUserOrganizationInviteLink,
  fetchCurrentUserEmployees,
  fetchSmallerCurrentUserOrganization
} from '../api'
import { withRouter } from 'react-router-dom'
import '../styles/theme/input.css'
import '../styles/theme/select.css'
import '../styles/theme/icon.css'
import '../styles/theme/switch.css'
import addUserStyle from '../styles/addUserStyle'
import { captureFilteredError, LoadingSpinner, SentryDispatch } from './general'
import { emailCharacterValidator } from '../utils'

const InviteLink = ({ organizationData }) => {
  const { link: inviteLink, active } = organizationData.inviteLink || {
    link: '',
    active: false
  }

  const [mutate, { loading }] = useMutation(generateInviteLink)

  const [toggle, { loading: loading2 }] = useMutation(toggleInviteLinkActive)

  useEffect(() => {
    if (!inviteLink)
      mutate()
        .then(() => {})
        .catch(err => {
          captureFilteredError(err)
        })
  }, [])

  return (
    <div className='component-block'>
      <h4>or</h4>
      <br />
      <h2 style={{ fontSize: 22 }}>Send invite link</h2>
      <h4>
        Anyone with this link will be able to register to your organization
      </h4>
      <FormGroup>
        <Input
          value={inviteLink}
          icon={loading ? 'loading' : ''}
          readOnly
          onFocus={e => {
            e.target.select()
            window.navigator.clipboard
              .writeText(inviteLink)
              .then(() => {
                Notification({
                  type: 'info',
                  message: active
                    ? 'Link copied to clipboard'
                    : 'Link is currently inactive. You need to activate it in order for employees to onboard',
                  duration: 2500,
                  offset: 90,
                  iconClass: 'el-icon-info'
                })
              })
              .catch(() => {})
          }}
        />
      </FormGroup>
      <Switch
        value={active}
        onChange={value =>
          toggle({
            variables: {
              active: value
            }
          })
            .then(() => {})
            .catch(err => {
              captureFilteredError(err)
            })
        }
        width={46}
        onText='Link is active. Users can onboard'
        offText='Link is inactive. Onboarding is currently unavailable'
      />
      {loading2 && <LoadingSpinner />}
    </div>
  )
}

class AddNewUser extends Component {
  state = {
    form: {
      // name: '',
      email: '',
      role: 'Employee',
      invite: true
    },
    rules: {
      // name: [{ required: true, trigger: 'change', message: 'Required' }],
      email: [
        {
          type: 'email',
          required: true,
          trigger: 'submit',
          message: 'Please enter a valid email'
        }
      ],
      role: [{ required: true, trigger: 'change', message: 'Required' }]
    }
  }

  myRef = React.createRef()

  selectOptions = [
    {
      value: 'Employee',
      label: 'Standard'
    },
    {
      value: 'Admin',
      label: 'Admin'
    }
  ]

  goBack = () => {
    this.props.history.goBack()
  }

  onChange = (key, value) => {
    this.setState({
      form: Object.assign({}, this.state.form, {
        [key]: value
      })
    })
  }

  render() {
    const form = this.myRef.current

    return (
      <div className='add-user'>
        <div className='page-heading__header'>
          <i
            className='page-heading__back__button icon icon-small-right icon-rotate-180'
            onClick={this.goBack}
          />
          <div className='page-heading__header-info'>
            <h1>Add new employee</h1>
          </div>
        </div>
        <Form
          ref={this.myRef}
          model={this.state.form}
          rules={this.state.rules}
          onSubmit={e => e.preventDefault()}
        >
          <FormGroup>
            <Form.Item
              label='Email'
              prop='email'
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
                value={this.state.form.email}
                onChange={value => this.onChange('email', value)}
              />
            </Form.Item>
            {/* <Form.Item label="First Name" prop="name">
              <Input
                value={this.state.form.name}
                onChange={value => this.onChange('name', value)}
              />
            </Form.Item> */}
            <Form.Item label='Employee permissions' prop='role'>
              <Select
                value={this.state.form.role}
                onChange={value => this.onChange('role', value)}
              >
                {this.selectOptions.map(el => {
                  return (
                    <Select.Option
                      key={el.value}
                      label={el.label}
                      value={el.value}
                    />
                  )
                })}
              </Select>
            </Form.Item>
          </FormGroup>
          {/* <div className='component-block align-left'>
            <Checkbox
              checked={this.state.form.invite}
              onChange={value => this.onChange('invite', value)}
            >
              Automatically invite employee to platform
            </Checkbox>
          </div> */}
          <Mutation
            mutation={addNewUser}
            update={(cache, data) => {
              Object.keys(cache.data.data).forEach(key => {
                return (
                  (key.match(/^Employees/) && cache.data.delete(key)) ||
                  (key.match(/^UserEmployees/) && cache.data.delete(key))
                )
              })
            }}
            refetchQueries={[
              {
                query: fetchCurrentUserEmployees,
                variables: {
                  employeesLimit: 20,
                  employeesSkip: 0,
                  nameFilter: '',
                  selectedSkillsFilter: []
                }
              }
            ]}
          >
            {(addNewUser, { loading }) => {
              return (
                <Button
                  nativeType='submit'
                  type='signin'
                  size='large'
                  loading={loading}
                  className='el-button--green el-button--space-top'
                  onClick={e => {
                    e.preventDefault()

                    if (form) {
                      form.validate(async valid => {
                        if (valid) {
                          await addNewUser({
                            variables: {
                              // firstName: this.state.form.name,
                              email: this.state.form.email.toLowerCase(),
                              role: this.state.form.role,
                              invite: this.state.form.invite
                            }
                          })
                            .then(res => {
                              if (res.data && res.data.addNewUser) {
                                Notification({
                                  type: 'success',
                                  message: 'Employee added',
                                  duration: 2500,
                                  offset: 90
                                })
                                this.props.history.goBack()
                              } else {
                                Notification({
                                  type: 'warning',
                                  message:
                                    res.data.addNewUser ||
                                    'Something went wrong',
                                  duration: 2500,
                                  offset: 90
                                })
                              }
                            })
                            .catch(e => {
                              Notification({
                                type: 'error',
                                message: 'Something went wrong',
                                duration: 2500,
                                offset: 90,
                                iconClass: 'el-icon-error'
                              })
                            })
                        }
                      })
                    } else {
                      Notification({
                        type: 'error',
                        message: `You cannot submit an empty form`,
                        duration: 2500,
                        offset: 90,
                        iconClass: 'el-icon-error'
                      })
                    }
                  }}
                >
                  Add
                </Button>
              )
            }}
          </Mutation>
        </Form>
        <InviteLink organizationData={this.props.organizationData} />
        <style jsx global>
          {addUserStyle}
        </style>
      </div>
    )
  }
}

export default withRouter(props => {
  const { data, loading, error } = useQuery(
    fetchCurrentUserOrganizationInviteLink
  )

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <SentryDispatch error={error} />
  }

  const organizationData = data?.fetchCurrentUserOrganization
  return <AddNewUser {...props} organizationData={organizationData} />
})
