import React, { Component, useEffect } from 'react'
import { publicAcceptInvitation } from '../../../api'
import { ApolloConsumer } from 'react-apollo'
import { captureFilteredError } from '../../general'
import history from '../../../history'
import {
  isNotInnentialEmail,
  removeTokens,
  initializeSegment,
  initializeHotjarTracker
} from '../../../utils'
// import { useGA4React } from 'ga-4-react'

const initializeAnalytics = user => {
  if (
    isNotInnentialEmail(user.email) &&
    process.env.NODE_ENV === 'production' &&
    !process.env.REACT_APP_STAGING
  ) {
    initializeSegment()

    window.analytics &&
      window.analytics.identify(user._id, {
        organizationName: user.organizationName
      })

    initializeHotjarTracker({
      leader: user.leader,
      admin: user.roles.indexOf('ADMIN') !== -1,
      organizationName: user.organizationName,
      id: user._id
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
        mutation: publicAcceptInvitation,
        variables: {
          pendingInvitation: this.props.pendingInvitation
        }
      })

      if (res?.data?.publicAcceptInvitation) {
        const userProfile = res?.data?.publicAcceptInvitation

        initializeAnalytics(userProfile?.user)

        window.analytics && window.analytics.track('start_onboarding')

        this.setState({ userProfile })
      }
    } catch (e) {
      captureFilteredError(e)
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
