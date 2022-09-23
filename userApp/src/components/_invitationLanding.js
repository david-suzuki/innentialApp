import React, { useState, useRef } from 'react'
import { Redirect, useLocation, useHistory } from 'react-router-dom'
import { useQuery, useMutation } from 'react-apollo'
import {
  publicFetchOrganizationIDForToken,
  publicOnboardFromLink
} from '../api'
import { captureFilteredError } from './general'
import { Page, FormGroup } from './ui-components'
import { Input, Button, Form, MessageBox } from 'element-react'
import bottomNavStyle from '../styles/bottomNavStyle'
import onboardingStyle from '../styles/onboardingStyle'
import variables from '../styles/variables'

const emailRegisteredMessage =
  'Email is already registered to the platform. Check your inbox for an invitation. If you did not register your address, contact us at contact@innential.com.'

const Landing = ({ _id: organizationId, organizationName }) => {
  const [emailInput, setEmailInput] = useState('')
  const [emailInUse, setEmailInUse] = useState(false)

  const form = useRef()

  const history = useHistory()

  const [mutate, { loading }] = useMutation(publicOnboardFromLink)

  const model = { email: emailInput }

  return (
    <div className='onboarding__wrapper'>
      <div className='onboarding__sidebar'>
        <img
          className='onboarding-logo'
          alt='Innential Logo'
          src={require('../static/innential-logo.svg')}
        />
        <div className='onboarding__sidebar-background' />
      </div>
      <Page>
        <div style={{ minHeight: '50vh' }}>
          <h2>
            You've been invited to join{' '}
            <span style={{ color: '#5a55ab' }}>{organizationName}</span>
          </h2>
          <Form
            model={model}
            ref={form}
            rules={{
              email: [
                {
                  type: 'email',
                  message: 'Please input a valid email',
                  trigger: 'blur'
                },
                {
                  required: true,
                  message: 'Required',
                  trigger: 'submit'
                },
                {
                  validator: (_, value, callback) => {
                    if (emailInUse) {
                      callback(new Error(emailRegisteredMessage))
                    } else {
                      callback()
                    }
                  }
                }
              ]
            }}
          >
            <FormGroup>
              <Form.Item prop='email' label='Email'>
                <Input
                  value={emailInput}
                  onChange={value => {
                    setEmailInUse(false)
                    setEmailInput(value)
                  }}
                  placeholder='Provide your work email to get started!'
                />
              </Form.Item>
            </FormGroup>
          </Form>
          <div className='bottom-nav-contained'>
            <div />
            <Button
              type='primary'
              loading={loading}
              onClick={() => {
                form.current.validate(async valid => {
                  if (valid) {
                    try {
                      // const { data: { publicOnboardFromLink: completeProfile } } = await mutate({
                      const email = emailInput.toLowerCase()
                      await mutate({
                        variables: {
                          email,
                          organizationId
                        }
                      })

                      MessageBox.alert(
                        <div>
                          We've sent an invitation message to your email inbox
                          <br />
                          <strong>
                            Follow the link inside to get started!
                          </strong>
                        </div>,
                        'You are almost done!',
                        {
                          type: 'success',
                          showConfirmButton: false,
                          showClose: false,
                          customClass: 'registration-box'
                        }
                      )
                        .then()
                        .catch()

                      // history.replace('/onboarding/security', completeProfile)
                    } catch (err) {
                      if (
                        err.graphQLErrors &&
                        err.graphQLErrors[0] &&
                        err.graphQLErrors[0].message === 'ALREADY_REGISTERED'
                      ) {
                        setEmailInUse(true)
                        form.current.validateField('email')
                      } else {
                        history.push('/error-page/500')
                      }
                    }
                  }
                })
              }}
            >
              <strong style={{ fontFamily: 'Poppins', fontSize: 14 }}>
                Confirm email
              </strong>
            </Button>
          </div>
        </div>
      </Page>
      <style>{`
        .registration-box
          > .el-message-box
          > .el-message-box__content
          > .el-message-box__status {
            font-size: 45px !important;
            margin-left: 15px;
            color: ${variables.avocado};
        }
      `}</style>
      <style>{bottomNavStyle}</style>
      <style>{onboardingStyle}</style>
    </div>
  )
}

const TokenQuery = ({ token }) => {
  const { data, loading, error } = useQuery(publicFetchOrganizationIDForToken, {
    variables: {
      token
    }
  })

  if (loading) return null

  if (error) {
    captureFilteredError(error)
    return <Redirect to='/error-page/500' />
  }

  if (data) {
    const organization = data.publicFetchOrganizationIDForToken

    if (organization === null) return <Redirect to='/' />

    return <Landing {...organization} />
  }
}

const InvitationLanding = () => {
  const { search } = useLocation()

  const params = new URLSearchParams(search)

  const token = params.get('token')

  if (!token) return <Redirect to='/' />

  return <TokenQuery token={token} />
}

export default InvitationLanding
