import React, { Component } from 'react'
import { fetchInterestUserList, fetchAllInterests } from '../../api'
import { Query, ApolloConsumer } from 'react-apollo'
import { LoadingSpinner, SentryDispatch } from '../general'
import { Statement, FormDescription, UserItems, List } from './'
import skillDetailsStyle from '../../styles/skillDetailsStyle'
import history from '../../history'
import { withRouter } from 'react-router-dom'
import { remapEmployeesForUI } from '../teams/_teamUtils'

class InterestsDetails extends Component {
  state = {
    interestName: '',
    error: undefined
  }

  componentDidMount() {
    this.props.client
      .query({
        query: fetchAllInterests
      })
      .then(({ data: { fetchAllInterests: allInterests } }) => {
        const { interestId } = this.props.match.params
        const interestData = allInterests.find(
          skill => skill._id === interestId
        )
        if (!interestData) {
          this.setState({
            error: new Error(`Could not find skill with ID:${interestId}`)
          })
        } else {
          this.setState({ interestName: interestData.name })
        }
      })
  }

  render() {
    const { interestId } = this.props.match.params
    if (this.state.error) return <SentryDispatch error={this.state.error} />
    const { interestName } = this.state
    return (
      <Query
        query={fetchInterestUserList}
        variables={{
          interestId
        }}
      >
        {({ loading, error, data }) => {
          if (loading) return <LoadingSpinner />
          if (error) return <SentryDispatch error={error} />
          if (data) {
            const { fetchInterestUserList: items } = data
            if (items && items.length > 0) {
              return (
                <div className='skill-details'>
                  <div className='skill-details__heading'>
                    <i
                      className='icon icon-small-right'
                      type='signin'
                      size='large'
                      onClick={e => {
                        e.preventDefault()
                        history.goBack()
                      }}
                    />
                  </div>
                  <FormDescription
                    label={interestName}
                    description={`${
                      items.length > 1
                        ? `${items.length} people in your organization are interested `
                        : '1 person in your organization is interested '
                    }in ${interestName}`}
                  />
                  <List>
                    <UserItems
                      items={remapEmployeesForUI(
                        items
                      ).map(({ children, ...user }) => ({ ...user }))}
                      // userDropdownOptions={[]}
                    />
                  </List>
                  <style jsx>{skillDetailsStyle}</style>
                </div>
              )
            }
            return <Statement content='No user info to display' />
          }
        }}
      </Query>
    )
  }
}

export default withRouter(props => (
  <ApolloConsumer>
    {client => <InterestsDetails {...props} client={client} />}
  </ApolloConsumer>
))
