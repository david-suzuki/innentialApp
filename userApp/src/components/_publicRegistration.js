import React from 'react'
import {
  Input,
  Button,
  Notification,
  Form,
  Select,
  Checkbox,
  Dialog,
  MessageBox
} from 'element-react'
import { Link, Redirect, withRouter } from 'react-router-dom'
import '../styles/theme/notification.css'
import '../styles/theme/dialog.css'
import { Mutation } from 'react-apollo'
import { publicRegisterUser } from '../api'
import { removeTokens, hashString, emailCharacterValidator } from '../utils'
import onboardingStyle from '../styles/onboardingStyle'
import { FormGroup, IndustrySelector, FormDescription } from './ui-components'
import { organizationSizeOptions, JWT } from '../environment'
import Alert from 'react-s-alert'
import history from '../history'
import * as Sentry from '@sentry/browser'
import { LoadingSpinner } from '../components/general'
import loginStyle from '../styles/loginStyle'
import variables from '../styles/variables'

class PublicRegistrationForm extends React.Component {
  state = {
    emailValue: '',
    firstName: '',
    lastName: '',
    // password: '',
    // passwordCheck: '',
    // organizationName: '',
    // organizationSize: '',
    // industry: 'N/A',
    tosAccept: false,
    subscribe: false,
    locations: [],
    locationsValue: '',
    emailInUse: false
  }

  myRef = React.createRef()

  onValueChange = (val, key) => {
    if (key === 'emailValue') {
      this.setState({ [key]: val, emailInUse: false })
    } else this.setState({ [key]: val })
  }

  onLocationAdd = e => {
    e.preventDefault()
    const { locationsValue, locations } = this.state
    if (locationsValue !== '') {
      this.setState({
        locations: [...locations, locationsValue],
        locationsValue: ''
      })
    }
  }

  onLocationRemove = (e, index) => {
    e.preventDefault()
    const { locations } = this.state
    this.setState({
      locations: locations.filter((l, i) => i !== index)
    })
  }

  onSubmit = (e, mutate, client) => {
    e.preventDefault()
    if (this.state.tosAccept === true)
      this.myRef.current.validate(valid => {
        const {
          emailValue,
          subscribe,
          // organizationName,
          // organizationSize,
          // industry,
          firstName,
          lastName
          // password
        } = this.state
        const { registeredFrom, withPath } = this.props

        if (valid) {
          mutate({
            variables: {
              userData: {
                firstName,
                lastName,
                // password: hashString(password).digest,
                email: emailValue.toLowerCase()
              },
              // organizationData: {
              //   organizationName,
              //   organizationSize,
              //   industry
              //   // locations
              // },
              metaData: {
                registeredFrom:
                  registeredFrom === null ? 'in-app' : registeredFrom,
                withPath: withPath && withPath.length === 24 ? withPath : null,
                subscribe
              }
            }
          })
            .then(res => {
              if (res.data && res.data.publicRegisterUser) {
                const invitation = res.data.publicRegisterUser
                history.push(`/acceptinvitation/${invitation}`)
                Alert.success('Registration successful', {
                  position: 'bottom',
                  effect: 'stackslide',
                  timeout: 1500
                })
              } else {
                Notification({
                  type: 'warning',
                  message: 'Oops something went wrong!',
                  duration: 2500,
                  offset: 90
                })
              }
            })
            .catch(e => {
              if (e.message === 'email_in_use') {
                this.setState({ emailInUse: true }, () =>
                  this.myRef.current.validateField('emailValue')
                )
              }
              // if(e.message = 'email_in_use') {
              //   this.setState({ organizationNameInUse: true }, () => this.myRef.current.validateField('emailValue'))
              // }
              // if (process.env.NODE_ENV !== 'development')
              //   Sentry.captureException(e)
            })
          // sessionStorage.clear()
          // client.clearStore().then(() => {
          //   client.resetStore()
          // })
          // removeTokens()
        }
      })
    else
      Alert.warning('You must accept the terms of service', {
        position: 'bottom',
        timeout: 2500,
        effect: 'stackslide'
      })
  }

  render() {
    const {
      emailValue,
      firstName,
      lastName,
      // password,
      // passwordCheck,
      // organizationName,
      // organizationSize,
      // industry,
      tosAccept,
      subscribe
      // locations,
      // locationsValue
    } = this.state
    const { registeredFrom } = this.props
    const values = [
      emailValue,
      firstName,
      lastName
      // organizationName,
      // organizationSize
    ]
    return (
      <>
        {/* <div className="onboarding__logo-wrapper">
          <NavLink to="/login">
            <img
              className="onboarding-logo"
              alt="Innential Logo"
              src={require('../static/innential-logo.svg')}
            />
          </NavLink>
        </div>
        <div className="container-main"> */}
        <Form model={this.state} ref={this.myRef}>
          <FormGroup>
            <Form.Item
              prop='emailValue'
              label='Email'
              rules={[
                {
                  type: 'email',
                  required: true,
                  message: 'Please enter a valid email',
                  trigger: 'submit'
                },
                {
                  validator: (rule, value, callback) => {
                    if (this.state.emailInUse) {
                      callback(
                        new Error(
                          `This email address is already taken. If you can't remember your password, click "Forgot your password?"`
                        )
                      )
                    } else callback()
                  }
                },
                {
                  validator: emailCharacterValidator
                }
              ]}
            >
              <Input
                value={emailValue}
                onChange={val => this.onValueChange(val, 'emailValue')}
                autoFocus
              />
            </Form.Item>
            <span className='double-input'>
              <Form.Item prop='firstName' label='First Name'>
                <Input
                  value={firstName}
                  onChange={val => this.onValueChange(val, 'firstName')}
                />
              </Form.Item>
              <Form.Item prop='lastName' label='Last Name'>
                <Input
                  value={lastName}
                  onChange={val => this.onValueChange(val, 'lastName')}
                />
              </Form.Item>
            </span>
            {/* <span className='double-input'>
              <Form.Item prop="password" label="Password">
                <Input
                  type="password"
                  value={password}
                  onChange={val => this.onValueChange(val, 'password')}
                />
              </Form.Item>
              <Form.Item prop="passwordCheck" label="Repeat Password">
                <Input
                  type="password"
                  value={passwordCheck}
                  onChange={val => this.onValueChange(val, 'passwordCheck')}
                />
              </Form.Item>
            </span> */}
            {/* <Form.Item prop='organizationName' label='Organization Name'>
              <Input
                placeholder='  '
                value={organizationName}
                onChange={val => this.onValueChange(val, 'organizationName')}
              />
            </Form.Item>
            <Form.Item prop='organizationSize' label='Organization Size'>
              <Select
                placeholder=' '
                value={organizationSize}
                onChange={val => this.onValueChange(val, 'organizationSize')}
              >
                {organizationSizeOptions.map(item => {
                  return (
                    <Select.Option
                      key={item.value}
                      value={item.value}
                      label={item.label}
                    />
                  )
                })}
              </Select>
            </Form.Item> */}
          </FormGroup>
          {/* <Form.Item prop="locations" label="Add locations (Not mandatory)">
                <Input
                  placeholder="i.e. Remote, Milan, Puerto Rico"
                  value={locationsValue}
                  onChange={val =>
                    this.setState({
                      locationsValue: val
                    })
                  }
                />
                <div className="align-left">
                  <span onClick={this.onLocationAdd} className="add-location">
                    + Add location
                  </span>
                </div>
                <div className="cascader-selections">
                  {locations.map((location, index) => (
                    <div key={index}>
                      <Button
                        type="primary"
                        className="el-button--cascader"
                        onClick={e => this.onLocationRemove(e, index)}
                      >
                        {location} <i className="icon icon-e-remove" />
                      </Button>
                    </div>
                  ))}
                </div>
              </Form.Item> */}
          {/* </FormGroup> */}
          {/* <div className="component-block">
              <FormDescription
                label="Industry in which your organisation operates (Not mandatory)"
                description="We will use this information to provide
                      you benchmarking data of similar
                      organisations to yours"
                register
              > */}
          {/* <Form.Item prop="industry" label="Industry">
            <IndustrySelector
              publicFetch
              selectedIndustry={industry}
              onChangeIndustry={val => this.onValueChange(val.name, 'industry')}
            />
          </Form.Item> */}
          {/* <p className="info-block">
            We will use this information to provide you benchmarking data of
            similar organisations to yours
          </p> */}
          {/* </FormDescription>
            </div> */}
          <Form.Item prop='tosAccept'>
            <div
              className='component-block align-left'
              style={{ paddingTop: 10 }}
            >
              <Checkbox
                checked={tosAccept}
                onChange={val => this.onValueChange(val, 'tosAccept')}
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
            {registeredFrom === 'vllp' && (
              <div
                className='component-block align-left'
                style={{ paddingTop: 10 }}
              >
                <Checkbox
                  checked={subscribe}
                  onChange={val => this.onValueChange(val, 'subscribe')}
                >
                  Subscribe to People Development Library digest emails
                  (optional)
                </Checkbox>
              </div>
            )}
          </Form.Item>
          <div className='login__button-wrapper'>
            <Mutation mutation={publicRegisterUser}>
              {(publicRegisterUser, { loading, client }) => (
                <Button
                  loading={loading}
                  className='el-button--green'
                  onClick={e => this.onSubmit(e, publicRegisterUser, client)}
                  disabled={values.some(value => value.length === 0)}
                >
                  Sign Up
                </Button>
              )}
            </Mutation>
            {/* <Link to='/forgot-password'>Forgot your password?</Link> */}
          </div>
          {/* </div> */}
        </Form>
        {/* </div> */}
        {/* <style jsx>{onboardingStyle}</style> */}
      </>
    )
  }
}

const Register = ({ registeredFrom, withPath }) => {
  const isIE = /* @cc_on!@ */ false || !!document.documentMode
  const stylesIE = isIE ? (
    <style jsx>{`
      .login-page {
        overflow-x: hidden;
      }
      .container-main--login {
        display: block;
      }
      @media ${variables.md} {
        .container-main--login {
          width: 100%;
          max-width: 1040px !important;
        }
      }
    `}</style>
  ) : null

  return (
    <div className='login-page'>
      <div className='container-main container-main--login'>
        <div className='login__wrapper'>
          <div className='login__header-wrapper'>
            <div className='login__header'>
              <img
                src={require('../static/innential-logo.svg')}
                className='login__logo'
                alt='I'
              />
              <Link to='/login'>Already have an account? Login!</Link>
              {/* <a href="/login">Don&#39;t have an account yet? Sign up.</a> */}
            </div>
          </div>
          <div className='login__desktop-wrapper'>
            {/* {!withPath && (
              <div className='login__image-wrapper'>
                <div className='login__image-wrapper__title'>
                  Supercharge your skills
                </div>
                <img
                  src={require('../static/login-desktop-image.png')}
                  alt='I'
                />
                <div className='login__image-wrapper__caption'>&nbsp;</div>
              </div>
            )} */}
            <div className='login__form'>
              <FormGroup
                mainLabel={`Sign Up${
                  withPath ? ' for your Learning Path' : ''
                }`}
              >
                <PublicRegistrationForm
                  registeredFrom={registeredFrom}
                  withPath={withPath}
                />
              </FormGroup>
            </div>
          </div>
          <div className='login__already'>
            <Link to='/login'>Already have an account? Login!</Link>
          </div>
        </div>
      </div>
      <div className='login-background' />
      <style jsx>{loginStyle}</style>
      {stylesIE}
    </div>
  )
}

const userCheck = withRouter(({ location: { search } }) => {
  const searchParams = new URLSearchParams(search)

  const registeredFrom = searchParams.get('ref')
  const withPath = searchParams.get('path')

  const token = localStorage.getItem(JWT.LOCAL_STORAGE.TOKEN.NAME)
  const refreshToken = localStorage.getItem(
    JWT.LOCAL_STORAGE.REFRESH_TOKEN.NAME
  )

  if (token === null && refreshToken === null)
    return <Register registeredFrom={registeredFrom} withPath={withPath} />
  else
    return (
      <Redirect
        to={{
          pathname:
            withPath && withPath.length === 24
              ? `/learning-path/${withPath}`
              : '/'
        }}
      />
    )
})

export default userCheck
