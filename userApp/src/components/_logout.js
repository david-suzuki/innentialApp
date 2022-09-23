import React from 'react'
import { ApolloConsumer } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import { removeTokens } from '../utils'

export default withRouter(({ history }) => {
  const rerouteToLogin = () => {
    history.push('/login')
  }

  return (
    <ApolloConsumer>
      {client => <LogoutHandler client={client} toLogin={rerouteToLogin} />}
    </ApolloConsumer>
  )
})

class LogoutHandler extends React.Component {
  componentDidMount() {
    this.logout()
  }

  logout = async () => {
    removeTokens()
    sessionStorage.clear()
    this.props.client.clearStore().then(() => {
      this.props.client.resetStore()
      this.props.toLogin()
    })
  }

  render() {
    return <p>Bye</p>
  }
}
