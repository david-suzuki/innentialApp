import React, { Component } from 'react'
import {
  fetchNeededSkillUserList,
  fetchOrganizationSpecificSkills
} from '../../api'
import { Query, ApolloConsumer } from 'react-apollo'
import { LoadingSpinner, SentryDispatch } from '../general'
import {
  Statement,
  FormDescription,
  // UserItems,
  List,
  UserItemWithSkill
} from './'
import skillDetailsStyle from '../../styles/skillDetailsStyle'
import history from '../../history'
import { withRouter } from 'react-router-dom'
import { remapEmployeesForUI } from '../teams/_teamUtils'

class NeededSkillDetails extends Component {
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
    const teamId = new URLSearchParams(this.props.location.search).get('team')

    if (this.state.error) return <SentryDispatch error={this.state.error} />
    const { skillName } = this.state
    return (
      <Query
        query={fetchNeededSkillUserList}
        variables={{
          skillId,
          teamId
        }}
      >
        {({ loading, error, data }) => {
          if (loading) return <LoadingSpinner />
          if (error) return <SentryDispatch error={error} />
          if (data) {
            const { fetchNeededSkillUserList: items } = data
            if (items && items.length > 0) {
              const subtitle = `${
                items.length > 1
                  ? `${items.length} people in ${
                      teamId ? 'the team' : 'your organization'
                    } want `
                  : `1 person in ${
                      teamId ? 'the team' : 'your organization'
                    } wants `
              }to learn ${skillName}`
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
                  <FormDescription label={skillName} description={subtitle} />
                  <List>
                    {remapEmployeesForUI(items).map(employee => (
                      <UserItemWithSkill
                        key={employee.id}
                        {...employee}
                        skills={[]}
                        children={null}
                      />
                    ))}
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
    {client => <NeededSkillDetails {...props} client={client} />}
  </ApolloConsumer>
))
