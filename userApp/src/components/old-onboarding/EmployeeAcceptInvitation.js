import React, { Component } from 'react'
import { publicAcceptInvitation } from '../../api'
import { ApolloConsumer } from 'react-apollo'
import { removeTokens } from '../../utils'
import { captureFilteredError } from '../general'
import history from '../../history'

export const EmployeeAcceptInvitation = ({ match }) => {
  const pendingInvitation =
    match && match.params && match.params.pendingInvitation

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

      if (res && res.data && res.data.publicAcceptInvitation) {
        this.setState({ userProfile: res.data.publicAcceptInvitation })
      }
    } catch (e) {
      captureFilteredError(e)
      history.push('/')
    }
  }

  render() {
    const { userProfile, isPlaying } = this.state
    if (!isPlaying && userProfile)
      history.replace('/onboarding/signup', userProfile)
    return (
      <div style={{ margin: 'auto', height: 90, width: 360 }}>
        <img
          style={{ height: 90, width: 360 }}
          className='logo logo--onboarding'
          alt='Innential Logo'
          src={require('../../static/innential-logo.svg')}
        />
        {/* {!isPlaying && userProfile && (
          <Redirect
            to={{ pathname: '/onboarding/signup',  state: { ...userProfile }, `` } }
          />
        )} */}
      </div>
    )
  }
}
