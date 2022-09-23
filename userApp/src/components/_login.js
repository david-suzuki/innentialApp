import React from 'react'
import { compose, withHandlers, withState } from 'recompose'
import { graphql } from 'react-apollo'
import Alert from 'react-s-alert'
import { loginMutation } from '../api'
import { hashString, emailCharacterValidator } from '../utils'
import FormGroup from './ui-components/FormGroup'
import { Input, Form, Button } from 'element-react'
import { Link } from 'react-router-dom'
import loginStyle from '../styles/loginStyle'
import variables from '../styles/variables'
import '../styles/theme/tag.css'
import '../styles/theme/button.css'
import '../styles/theme/input.css'
import '../styles/theme/checkbox.css'

const withLoginMutation = graphql(loginMutation)

const recomposeStates = compose(
  withState('email', 'setEmail', ''),
  withState('password', 'setPassword', ''),
  withState('failCount', 'setFailCount', 0)
)

const recomposeHandlers = withHandlers({
  submitLogin: ({
    mutate,
    email,
    password,
    history,
    failCount,
    setFailCount
  }) => e => {
    const searchParams = new URLSearchParams(history.location.search)
    const redirect = searchParams.get('to') || '/'
    const search = searchParams.get('query') || ''

    email = email.toLowerCase()
    e.preventDefault()
    mutate({
      variables: {
        UserCredentials: {
          email,
          password: hashString(password).digest
        }
      }
    })
      .then(() => {
        history.push(`${redirect}${search}`)
        Alert.success('Login successful', {
          position: 'bottom',
          effect: 'stackslide',
          timeout: 1500
        })
      })
      .catch(e => {
        Alert.error('The credentials combination is wrong', {
          position: 'bottom'
        })
        setFailCount(failCount + 1)
      })
  }
})

const Login = ({
  email,
  setEmail,
  password,
  setPassword,
  submitLogin,
  history,
  failCount,
  setFailCount
}) => {
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

  const underLine = failCount >= 3 ? { textDecoration: 'underline' } : {}
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
              {/* <Link to='/register'>
                Don&#39;t have an account yet? Sign up.
              </Link> */}
            </div>
          </div>
          <div className='login__desktop-wrapper'>
            <div className='login__image-wrapper'>
              <div className='login__image-wrapper__title'>
                Supercharge your skills
              </div>
              <img src={require('../static/login-desktop-image.png')} alt='I' />
              <div className='login__image-wrapper__caption'>&nbsp;</div>
            </div>
            <div className='login__form'>
              <FormGroup mainLabel='Sign In'>
                <Form onSubmit={submitLogin} model={{ email, password }}>
                  <Form.Item
                    label='Email address'
                    prop='email'
                    rules={[
                      {
                        type: 'email',
                        message: 'This is not a valid email address',
                        trigger: 'blur'
                      },
                      {
                        validator: emailCharacterValidator
                      }
                    ]}
                  >
                    <Input
                      name='email'
                      type='text'
                      placeholder='example@example.com'
                      value={email}
                      onChange={e => {
                        setEmail(e)
                      }}
                    />
                  </Form.Item>
                  <Form.Item label='Password'>
                    <Input
                      name='password'
                      type='password'
                      value={password}
                      onChange={e => setPassword(e)}
                      // icon={<i className="icon icon-eye-ban-18" />}
                    />
                  </Form.Item>
                  <div className='login__button-wrapper'>
                    <Button
                      nativeType='submit'
                      type='signin'
                      className={`signin__button el-button--green ${
                        email === '' || password === '' ? 'disabled' : ''
                      }`}
                    >
                      Sign In
                    </Button>
                    <Link to='/forgot-password' style={underLine}>
                      Forgot your password?
                    </Link>
                  </div>
                </Form>
              </FormGroup>
            </div>
          </div>
          <div className='login__contact'>
            <Link to='/register'>Don&#39;t have an account yet? Sign up.</Link>
          </div>
        </div>
      </div>
      <div className='login-background' />
      <style jsx>{loginStyle}</style>
      {stylesIE}
    </div>
  )
}

export default compose(
  withLoginMutation,
  recomposeStates,
  recomposeHandlers
)(Login)
