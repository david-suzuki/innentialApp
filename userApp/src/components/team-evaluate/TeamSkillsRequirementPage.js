import React, { Component } from 'react'
import { ApolloConsumer, Mutation } from 'react-apollo'
import {
  /* fetchRequiredTeamSkills, */ setTeamsRequiredSkills
} from '../../api'
import { FormGroup, FormDescription, StarBar } from '../ui-components'
import { Button, Notification } from 'element-react'
import '../../styles/theme/notification.css'
import { captureFilteredError } from '../general'
import Container from '../../globalState'

const HandleGlobalState = ({ children }) => {
  const { setFrameworkState } = Container.useContainer()
  return children(setFrameworkState)
}

class TeamSkillsRequirementPage extends Component {
  state = {
    skills: []
    // frameworkId: '',
    // selectedLevel: 0,
    // selectedName: ''
  }

  client = {}

  componentDidMount() {
    const { selectedSkills } = this.props
    // if (selectedSkills.length > 0) {
    this.setState({ skills: selectedSkills })
    // } else {
    //   this.client
    //     .query({
    //       query: fetchRequiredTeamSkills,
    //       variables: {
    //         teamId: this.props.teamInfo._id
    //       }
    //     })
    //     .then(res => {
    //       const skills = res.data.fetchRequiredTeamSkills.map(skill => ({
    //         ...skill,
    //         level: 0
    //       }))

    //       this.setState({ skills })
    //     })
    //     .catch(e => captureFilteredError(e))
    // }
  }

  setSkillLevel = (name, value) => {
    const newSkills = this.state.skills.reduce((acc, curr) => {
      if (curr.name === name) {
        return [...acc, { ...curr, level: value }]
      } else {
        return [...acc, { ...curr }]
      }
    }, [])

    this.setState({ skills: newSkills })
  }

  checkSkillsValid = () => {
    return this.state.skills.every(skill => skill.level > 0)
  }

  setFocusedFramework = (id, level, name) => {
    this.props.setFrameworkState({
      visible: true,
      frameworkId: id,
      level,
      skillName: name
    })
  }

  render() {
    const {
      skills /*, frameworkId, selectedLevel, selectedName */
    } = this.state
    return (
      <div className='component-block'>
        {/* <HandleGlobalState
          frameworkId={frameworkId}
          selectedLevel={selectedLevel}
          selectedName={selectedName}
        /> */}
        <FormDescription
          label='Skill Level Required in the team'
          description='What skill level is required to deliver to your team’s current objectives?'
        />
        <br />
        <ApolloConsumer>
          {client => {
            this.client = client
            return (
              <div>
                {skills.length > 0 &&
                  skills.map((skill, idx) => (
                    <FormGroup key={skill._id}>
                      <StarBar
                        name={skill.name}
                        subtitle={skill.category}
                        level={skill.level}
                        updateSkillLevels={this.setSkillLevel}
                        handleHover={(level, name) => {
                          if (skill.frameworkId) {
                            this.setFocusedFramework(
                              skill.frameworkId,
                              level,
                              name
                            )
                          } else {
                            this.setFocusedFramework('no_framework', 0, name)
                          }
                        }}
                      />
                    </FormGroup>
                  ))}
                <br />
                <div className='bottom-nav'>
                  <div className='bottom-nav__previous'>
                    <a onClick={() => this.props.changePage(-1)}>
                      <i className='icon icon-tail-left' />
                      <span>Previous step</span>
                    </a>
                  </div>
                  <Mutation
                    mutation={setTeamsRequiredSkills}
                    refetchQueries={[
                      'fetchEvaluationInfo',
                      'fetchLatestTeamEvaluation',
                      'fetchOrganizationEvaluationToo',
                      'fetchRequiredTeamSkills',
                      'fetchStatsGrowthData',
                      'fetchStatsTeamsData',
                      'fetchStatsOverviewData'
                    ]}
                  >
                    {setTeamsRequiredSkills => (
                      <Button
                        type='primary'
                        onClick={e => {
                          e.preventDefault()
                          if (!this.checkSkillsValid()) {
                            Notification({
                              message: 'Please give feedback for all skills',
                              type: 'warning',
                              duration: 2500,
                              offset: 90
                            })
                          } else {
                            const selectedSkills = this.state.skills

                            const skills = selectedSkills.map(skill => ({
                              skillId: skill.skillId,
                              level: skill.level
                            }))

                            setTeamsRequiredSkills({
                              variables: {
                                inputData: {
                                  teamId: this.props.teamInfo._id,
                                  skills
                                }
                              }
                            })
                              .then(res => {
                                this.props.changePage(1)
                              })
                              .catch(e => captureFilteredError(e))
                          }
                        }}
                      >
                        <i className='icon icon-tail-right' />
                      </Button>
                    )}
                  </Mutation>
                </div>
              </div>
            )
          }}
        </ApolloConsumer>
      </div>
    )
  }
}

export default props => (
  <HandleGlobalState>
    {setFrameworkState => (
      <TeamSkillsRequirementPage
        {...props}
        setFrameworkState={setFrameworkState}
      />
    )}
  </HandleGlobalState>
)
