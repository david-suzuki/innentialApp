import React, { Component } from 'react'
import {
  publicRegisterUserAcceptInvitation,
  publicGetAuthToken
} from '../../api'
import { ApolloConsumer } from 'react-apollo'
import { Redirect } from 'react-router-dom'
import { removeTokens } from '../../utils'
import history from '../../history'

export const PublicAcceptInvitation = ({ match }) => {
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
        mutation: publicRegisterUserAcceptInvitation,
        variables: {
          pendingInvitation: this.props.pendingInvitation
        }
      })

      if (res && res.data && res.data.publicRegisterUserAcceptInvitation) {
        const getTokens = await this.props.client.query({
          query: publicGetAuthToken,
          variables: {
            userId: res.data.publicRegisterUserAcceptInvitation.user._id
          }
        })

        if (getTokens && getTokens.data && getTokens.data.publicGetAuthToken)
          this.setState({
            userProfile: res.data.publicRegisterUserAcceptInvitation
          })
      }
    } catch (e) {
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
