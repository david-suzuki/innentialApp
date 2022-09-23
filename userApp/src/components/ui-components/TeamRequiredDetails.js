import React, { Component } from 'react'
import {
  fetchNeededSkillTeamList,
  fetchOrganizationSpecificSkills
} from '../../api'
import { Query, ApolloConsumer } from 'react-apollo'
import { LoadingSpinner, SentryDispatch } from '../general'
import { Statement, FormDescription, TeamItems, List } from './'
import skillDetailsStyle from '../../styles/skillDetailsStyle'
import history from '../../history'
import { withRouter } from 'react-router-dom'
import { remapTeamsForUI } from '../teams/_teamUtils'

class TeamRequiredDetails extends Component {
  state = {
    skillName: '',
    error: undefined
  }

  componentDidMount() {
    this.props.client
      .query({
        query: fetchOrganizationSpecificSkills
      })
      .then(({ data: { fetchOrganizationSpecificSkills: allSkills } }) => {
        const { skillId } = this.props.match.params
        const skillData = allSkills.find(skill => skill._id === skillId)
        if (!skillData) {
          this.setState({
            error: new Error(`Could not find skill with ID:${skillId}`)
          })
        } else {
          this.setState({ skillName: skillData.name })
        }
      })
  }

  render() {
    const { skillId } = this.props.match.params
    if (this.state.error) return <SentryDispatch error={this.state.error} />
    const { skillName } = this.state
    return (
      <Query
        query={fetchNeededSkillTeamList}
        variables={{
          skillId
        }}
      >
        {({ loading, error, data }) => {
          if (loading) return <LoadingSpinner />
          if (error) return <SentryDispatch error={error} />
          if (data) {
            const { fetchNeededSkillTeamList: items } = data
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
                    label={skillName}
                    description={`${
                      items.length > 1
                        ? `${items.length} teams in your organization require `
                        : '1 team in your organization requires '
                    }${skillName}`}
                  />
                  <List>
                    <TeamItems
                      items={remapTeamsForUI(items)}
                      userDropdownOptions={[]}
                    />
                  </List>
                  <style jsx>{skillDetailsStyle}</style>
                </div>
              )
            }
            return <Statement content='No team info to display' />
          }
        }}
      </Query>
    )
  }
}

export default withRouter(props => (
  <ApolloConsumer>
    {client => <TeamRequiredDetails {...props} client={client} />}
  </ApolloConsumer>
))
