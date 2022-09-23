import React, { Component, useEffect } from 'react'
import {
  Input,
  Form,
  // Button,
  Checkbox,
  Notification,
  MessageBox
} from 'element-react'
import { FormGroup, Page } from '../ui-components'
import {
  OBInput,
  OBTitle,
  OBSubtitle,
  Header,
  Button,
  FormContainer
} from './ui-components'
import { publicSignupMutation, publicCancelInvitation } from '../../api'
import { Mutation } from 'react-apollo'
import { hashString } from '../../utils'
import { Redirect } from 'react-router-dom'
import '../../styles/theme/message.css'
import { captureFilteredError, LoadingSpinner } from '../general'
import '../../styles/theme/notification.css'
import history from '../../history'

// import Photo from '../ui-components/Photo'

const OBForm = ({
  form,
  rules,
  passwordVisibility,
  passwordCheckVisibility,
  handleChange
}) => {
  // useEffect(() => {
  //   console.log(form)
  // }, [form])
  const inputFields = [
    { name: 'First Name', key: 'firstName' },
    { name: 'Last Name', key: 'lastName' },
    { name: 'Organisation Role', key: 'role' },
    { name: 'Location', key: 'location' }
  ]

  return (
    <FormContainer extraStyles={{ width: '66%' }}>
      <Header>
        <OBTitle>A bit about you</OBTitle>
        <OBSubtitle>Share some personal information about you</OBSubtitle>
      </Header>
      {inputFields.map(({ name, key }) => (
        <OBInput key={name}>
          <label>{name}</label>
          <Input
            type='text'
            value={form[key]}
            onChange={val => handleChange(key, val)}
          />
        </OBInput>
      ))}
    </FormContainer>
  )
}

class SignupPage extends Component {
  state = {
    redirect: false,
    accountRemoved: false,
    passwordVisibility: false,
    passwordCheckVisibility: false,
    form: {
      // password: '',
      // passwordCheck: '',
      firstName: this.props.firstName || '',
      lastName: this.props.lastName || '',
      tosAccept: !!this.props.skipDataPrivacy
    },
    rules: {
      password: [
        // TODO: Add more rules?
        { required: true, message: 'Required', trigger: 'change' },
        {
          validator: (rule, value, callback) => {
            const errors = []
            if (value.length < 6) {
              errors.push(new Error('Password must be at least 6 characters'))
            }
            callback(errors)
          }
        }
      ],
      passwordCheck: [
        { required: true, message: 'Required', trigger: 'change' },
        {
          validator: (rule, value, callback) => {
            if (value !== this.state.form.password) {
              callback(new Error("Passwords don't match"))
            } else {
              callback()
            }
          }
        }
      ],
      firstName: { required: true, message: 'Required', trigger: 'change' },
      lastName: { required: true, message: 'Required', trigger: 'change' }
      // tosAccept: {
      //   required: true,
      //   message: 'You must accept the data privacy policy to continue',
      //   trigger: 'change'
      // }
    }
  }

  form = React.createRef()

  handleChange = (key, value) => {
    this.setState(({ form }) => ({
      form: { ...form, [key]: value }
    }))
  }

  handlePasswordVisibility = key => {
    const prev = this.state[key]
    this.setState({ [key]: !prev })
  }

  handleSubmit = async (e, mutation, form) => {
    e.preventDefault()
    this.form.current.validate(valid => {
      if (valid) {
        if (this.state.form.tosAccept === true) {
          const data = {
            _id: this.props.userId,
            firstName: form.firstName,
            lastName: form.lastName,
            password: hashString(form.password).digest
          }
          mutation({ variables: { UserSignupOBInput: data } })
            .then(res => {
              if (res.data) {
                if (this.props.goToOrganizationPage) {
                  history.replace(
                    '/onboarding/organization',
                    this.props.routeState
                  )
                } else {
                  history.replace(
                    '/onboarding/my-skills',
                    this.props.routeState
                  )
                }
              }
            })
            .catch(e => {
              captureFilteredError(e)
            })
        } else {
          Notification({
            message: 'You must accept the terms of service',
            type: 'warning',
            duration: 2500,
            offset: 90
          })
          return false
        }
      } else {
        return false
      }
    })
  }

  handleCancel = async (e, mutation) => {
    e.preventDefault()
    MessageBox.confirm(
      `This will delete your account and all your data. Continue?`,
      'Account removal',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )
      .then(async () => {
        mutation({
          variables: {
            userId: this.props.userId
          }
        })
          .then(({ data: { publicCancelInvitation: response } }) => {
            if (response === 'Success') {
              this.setState({
                accountRemoved: true
              })
              setTimeout(() => {
                this.setState({
                  redirect: true
                })
              }, 5000)
            } else {
              Notification({
                type: 'warning',
                message: 'Something went wrong',
                duration: 2500,
                offset: 90
              })
            }
          })
          .catch(err => {
            captureFilteredError(err)
            Notification({
              type: 'warning',
              message: 'Something went wrong',
              duration: 2500,
              offset: 90
            })
          })
      })
      .catch(() => {
        Notification({
          type: 'warning',
          message: 'Operation cancelled',
          duration: 2500,
          offset: 90
        })
      })
  }

  render() {
    if (this.state.accountRemoved) {
      if (this.state.redirect) {
        return (
          <Redirect
            to={{
              pathname: '/login'
            }}
          />
        )
      } else
        return (
          <Page>
            <div>
              <h4>
                Your account and data has been removed. You will be redirected
                shortly.
              </h4>
            </div>
          </Page>
        )
    }
    const {
      form,
      rules,
      passwordVisibility,
      passwordCheckVisibility
    } = this.state
    return (
      <>
        <Page>
          <OBForm
            form={form}
            rules={rules}
            passwordVisibility={passwordVisibility}
            passwordCheckVisibility={passwordCheckVisibility}
            handleChange={this.handleChange}
          />

          {/* <Form
          ref={this.form}
          model={form}
          rules={rules}
          onSubmit={e => e.preventDefault()}
        >
          <FormGroup mainLabel='Setup your password'>
            <Form.Item label='Password' prop='password'>
              <Input
                type={passwordVisibility ? 'text' : 'password'}
                value={form.password}
                onChange={val => this.handleChange('password', val)}
              />
            </Form.Item>
            <Form.Item label='Repeat Password' prop='passwordCheck'>
              <Input
                type={passwordCheckVisibility ? 'text' : 'password'}
                value={form.passwordCheck}
                onChange={val => this.handleChange('passwordCheck', val)}
              />
            </Form.Item>
          </FormGroup>
          <FormGroup mainLabel='Provide your details'>
            <Form.Item label='First Name' prop='firstName'>
              <Input
                type='text'
                placeholder=''
                value={form.firstName}
                onChange={val => this.handleChange('firstName', val)}
                trim
              />
            </Form.Item>
            <Form.Item label='Last Name' prop='lastName'>
              <Input
                type='text'
                placeholder=''
                value={form.lastName}
                onChange={val => this.handleChange('lastName', val)}
                trim
              />
            </Form.Item>
          </FormGroup> */}
          {/* <Photo /> */}
          {/* {!this.props.skipDataPrivacy && (
            <Form.Item prop='tosAccept'>
              <div
                className='component-block align-left'
                style={{ marginTop: 40, marginBottom: 40 }}
              >
                <Checkbox
                  value={form.tosAccept}
                  checked={form.tosAccept}
                  onChange={val => this.handleChange('tosAccept', val)}
                >
                  By clicking this checkbox you agree to our{' '}
                  <a
                    href='https://innential.com/data-privacy/'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    Data Privacy Policy
                  </a>
                </Checkbox>
              </div>
            </Form.Item>
          )} */}
          {/* <div className='bottom-nav'>
            {!this.props.cantDeleteInformation && (
              <Mutation mutation={publicCancelInvitation}>
                {publicCancelInvitation => {
                  return (
                    <div className='bottom-nav__previous'>
                      <a
                        onClick={e =>
                          this.handleCancel(e, publicCancelInvitation)
                        }s
                      >
                        <i className='icon icon-e-remove' />
                        <span>I don't want an account</span>
                      </a>
                    </div>
                  )
                }}
              </Mutation>
            )} */}
          <Mutation mutation={publicSignupMutation}>
            {(publicSignupMutation, { loading, error }) => {
              if (loading) return <LoadingSpinner />
              if (error) return <Redirect to={{ pathname: '/' }} />
              return (
                <div style={{ display: 'flex', padding: '0 0 50px 60%' }}>
                  <Button
                    cta='Next'
                    nativeType='submit'
                    type='primary'
                    onClick={e =>
                      this.handleSubmit(e, publicSignupMutation, form)
                    }
                  >
                    <i className='icon icon-tail-right' />
                  </Button>
                </div>
              )
            }}
          </Mutation>
          {/* </div> */}
          {/* </Form> */}
          <style jsx>{`
            .submit-container {
              margin-top: 2em;
              width: 100%;
              display: flex;
              justify-content: center;
            }
          `}</style>
        </Page>
      </>
    )
  }
}

export default SignupPage
