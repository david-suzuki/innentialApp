import React, { Component, useEffect } from 'react'
import {
  publicRegisterUserAcceptInvitation,
  publicGetAuthToken
} from '../../../api'
import { ApolloConsumer } from 'react-apollo'
import { Redirect } from 'react-router-dom'
import {
  isNotInnentialEmail,
  removeTokens,
  initializeSegment,
  initializeHotjarTracker
} from '../../../utils'
import history from '../../../history'
// import { useGA4React } from 'ga-4-react'

const initializeAnalytics = user => {
  if (
    isNotInnentialEmail(user.email) &&
    process.env.NODE_ENV === 'production' &&
    !process.env.REACT_APP_STAGING
  ) {
    initializeSegment()

    initializeHotjarTracker({
      leader: user.leader,
      admin: user.roles.indexOf('ADMIN') !== -1,
      organizationName: user.organizationName,
      id: user._id
    })

    window.analytics &&
      window.analytics.identify(user._id, {
        organizationName: user.organizationName
      })
  }
}

export default ({ match }) => {
  const pendingInvitation =
    match && match.params && match.params.pendingInvitation

  // const ga = useGA4React()

  // useEffect(() => {
  //   ga && ga.gtag('event', 'start_onboarding')
  // }, [ga])

  // useEffect(() => {
  //   window.analytics && window.analytics.track('start_onboarding')
  // }, [window.analytics])

  return (
    <ApolloConsumer>
      {client => (
        <PageHandler client={client} pendingInvitation={pendingInvitation} />
      )}
    </ApolloConsumer>
  )
}

class PageHandler extends Component {
  state = {
    isPlaying: true
  }

  componentDidMount() {
    removeTokens()
    sessionStorage.clear()
    this.props.client.clearStore().then(() => {
      this.props.client.resetStore()
    })
    this.acceptInvitation()
    setTimeout(() => this.setState({ isPlaying: false }), 2000)
  }

  acceptInvitation = async () => {
    try {
      const res = await this.props.client.mutate({
        mutation: publicRegisterUserAcceptInvitation,
        variables: {
          pendingInvitation: this.props.pendingInvitation
        }
      })

      if (res?.data?.publicRegisterUserAcceptInvitation) {
        const userProfile = res?.data?.publicRegisterUserAcceptInvitation

        const getTokens = await this.props.client.query({
          query: publicGetAuthToken,
          variables: {
            userId: userProfile?.user?._id
          }
        })

        initializeAnalytics(userProfile?.user)

        window.analytics && window.analytics.track('start_onboarding')

        if (getTokens?.data?.publicGetAuthToken)
          this.setState({
            userProfile
          })
      }
    } catch (e) {
      history.push('/')
    }
  }

  render() {
    const { userProfile, isPlaying } = this.state
    if (!isPlaying && userProfile)
      history.replace('/onboarding/security', userProfile)
    return (
      <div style={{ margin: 'auto', height: 90, width: 360 }}>
        <img
          style={{ height: 90, width: 360 }}
          className='logo logo--onboarding'
          alt='Innential Logo'
          src={require('../../../static/innential-logo.svg')}
        />
        {/* {!isPlaying && userProfile && (
          <Redirect
            to={{ pathname: '/onboarding/security',  state: { ...userProfile }, `` } }
          />
        )} */}
      </div>
    )
  }
}
