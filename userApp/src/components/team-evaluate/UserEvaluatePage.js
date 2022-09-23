import React, { Component } from 'react'
import { ApolloConsumer, Mutation, useQuery, useMutation } from 'react-apollo'
import {
  fetchUsersEvaluateInfo,
  setUsersEvaluation,
  fetchUserRoleGap
} from '../../api'
import {
  UserHeading,
  StarBar,
  FormGroup,
  FormDescription,
  ListSkillSelector,
  TextEditor
} from '../ui-components'
import { Button, Notification } from 'element-react'
import '../../styles/theme/notification.css'
import skillItemStyle from '../../styles/skillItemStyle'
import { captureFilteredError, LoadingSpinner } from '../general'
import Container from '../../globalState'

import { removeDuplicates } from '../../utils'
import { Redirect } from 'react-router-dom'

const HandleGlobalState = ({ children }) => {
  const { setFrameworkState } = Container.useContainer()
  return children(setFrameworkState)
}

class UserEvaluatePage extends Component {
  state = {
    feedback: '',
    skills: this.props.evaluateInfo.map(skill => ({
      ...skill,
      level: 0
    })),
    rawSkills: this.props.evaluateInfo,
    recommendedSkills: []
  }

  handleChange = (key, value) => {
    this.setState({ [key]: value })
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
    return this.state.recommendedSkills.every(skill => skill.level > 0)
  }

  setFocusedFramework = (id, level, name) => {
    this.props.setFrameworkState({
      visible: true,
      frameworkId: id,
      level,
      skillName: name
    })
  }

  setRecommendedSkills = recommendedSkills => {
    this.setState({
      recommendedSkills: recommendedSkills.map(sk => ({ ...sk, level: 0 }))
    })
  }

  setRecommendedSkillsLevel = (skillName, level) => {
    const { recommendedSkills, skills } = this.state

    this.setState({
      skills: skills.map(skill => {
        if (skill.name === skillName)
          return {
            ...skill,
            level
          }
        return skill
      }),
      recommendedSkills: recommendedSkills.map(skill => {
        if (skill.name === skillName)
          return {
            ...skill,
            level
          }
        return skill
      })
    })
  }

  removeRecommended = skillName => {
    const { recommendedSkills } = this.state

    this.setState({
      recommendedSkills: recommendedSkills.reduce((acc = [], curr) => {
        if (curr.name === skillName) return acc
        else return [...acc, curr]
      }, [])
    })
  }

  componentWillUnmount = () => {
    this.props.setFrameworkState({ visible: false })
    // const mainWrapper = document.getElementById('main-wrapper')
    // mainWrapper.className = 'container-main__wrapper'
  }

  onSubmit = async (e, setEvaluate, userName) => {
    e.preventDefault()
    if (!this.checkSkillsValid()) {
      Notification({
        message: 'Please provide feedback to all skills you selected',
        type: 'warning',
        duration: 2500,
        offset: 90
      })
    } else {
      const { rawSkills, recommendedSkills, feedback } = this.state
      const selectedSkills = removeDuplicates(
        [...this.state.skills, ...recommendedSkills].reduce(
          (acc = [], curr) => {
            if (curr.level === 0) return acc
            return [...acc, curr]
          },
          []
        ),
        'skillId'
      )

      const skills = selectedSkills.map(skill => {
        const prevSkill = rawSkills.find(el => el._id === skill._id)
        return {
          skillId: skill.skillId,
          // membersLevel: prevSkill.level,
          evaluatedLevel: skill.level === 6 ? prevSkill.level : skill.level
        }
      })

      const inputData = {
        userId: this.props.user.userId,
        skills,
        recommendedSkills: recommendedSkills.map(({ skillId, level }) => ({
          skillId,
          evaluatedLevel: level
        })),
        feedback
      }

      try {
        const response = await setEvaluate({
          variables: {
            inputData
          }
        })

        if (response?.data?.setUsersEvaluation !== null) {
          Notification({
            message: `Feedback sent to ${userName}`,
            type: 'success',
            duration: 2500,
            offset: 90
          })
          this.props.changePage(1)
        } else {
          Notification({
            message: `Oops! Something went wrong.`,
            type: 'warning',
            duration: 2500,
            offset: 90
          })
        }
      } catch (e) {
        captureFilteredError(e)
      }
    }
  }

  render() {
    // const { stageResultInfo, teamName } = this.props.teamInfo
    const {
      skills /*, frameworkId, selectedLevel, selectedName */,
      recommendedSkills,
      feedback
    } = this.state

    // const globalStateProps = { frameworkId, selectedLevel, selectedName }
    const { singleUser } = this.props
    return (
      <div className='component-block'>
        <UserHeading
          _id={this.props.user.userId}
          name={this.props.user.fullName}
        />
        <FormDescription
          label={`Give feedback to ${this.props.user.fullName}`}
        />
        <div style={{ padding: '15px 0px' }}>
          <TextEditor
            value={feedback}
            handleChange={value => this.handleChange('feedback', value)}
          />
        </div>
        <FormDescription
          label={`Choose skills to feedback to ${this.props.user.fullName}`}
        />
        <div style={{ padding: '0 24px 0 24px' }}>
          <ListSkillSelector
            skills={recommendedSkills}
            onSkillsSubmit={selected => this.setRecommendedSkills(selected)}
            // hideLoading
            buttonValue='Find skills...'
            buttonClass='list-skill-selector__button-input'
            clearState
          />
        </div>
        <div
          style={{
            marginTop: 24,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around'
          }}
        >
          {recommendedSkills.map((skill, i) => (
            <div
              style={{ position: 'relative', padding: '15px 30px' }}
              key={skill._id + ':recommended'}
            >
              <StarBar
                name={skill.name}
                subtitle={skill.category}
                level={skill.level}
                updateSkillLevels={this.setRecommendedSkillsLevel}
                handleHover={(level, name) => {
                  if (skill.frameworkId) {
                    this.setFocusedFramework(skill.frameworkId, level, name)
                  } else {
                    this.setFocusedFramework('no_framework', 0, name)
                  }
                }}
              />
              <i
                style={{
                  top: 40,
                  right: 20,
                  cursor: 'pointer',
                  position: 'absolute'
                }}
                className='el-icon-delete'
                onClick={() => this.removeRecommended(skill.name)}
              />
            </div>
          ))}
        </div>
        {skills.length > 0 && (
          <>
            <FormDescription
              style={{ marginTop: 24 }}
              label={`Find existing skills of ${this.props.user.fullName} to feedback`}
              description='Give stars only to the skill that you know about'
              largeLabel
            />
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-around',
                margin: '10px 0px'
              }}
            >
              {skills.map((skill, idx) => (
                <div
                  key={skill._id}
                  style={{ position: 'relative', padding: '15px 30px' }}
                >
                  <StarBar
                    name={skill.name}
                    subtitle={skill.category}
                    level={skill.level}
                    updateSkillLevels={this.setRecommendedSkillsLevel}
                    handleHover={(level, name) => {
                      if (skill.frameworkId) {
                        this.setFocusedFramework(skill.frameworkId, level, name)
                      } else {
                        this.setFocusedFramework('no_framework', 0, name)
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </>
        )}
        <Mutation
          mutation={setUsersEvaluation}
          refetchQueries={[
            'fetchEvaluationInfo',
            'fetchLatestTeamEvaluation',
            'fetchOrganizationEvaluationToo',
            'fetchStatsTeamsData',
            'fetchStatsOverviewData',
            'fetchUsersProfile',
            'fetchUsersRecommendedSkills',
            'fetchUsersEvaluateInfo'
          ]}
        >
          {(setEvaluate, { loading }) => (
            <div className='page-footer page-footer--fixed'>
              {!singleUser ? (
                <div className='bottom-nav'>
                  {this.props.index !== 0 && (
                    <div className='bottom-nav__previous'>
                      <a onClick={() => this.props.changePage(-1)}>
                        <i className='icon icon-tail-left' />
                        <span>Previous step</span>
                      </a>
                    </div>
                  )}
                  <Button
                    type='primary'
                    onClick={e =>
                      this.onSubmit(e, setEvaluate, this.props.user.fullName)
                    }
                    loading={loading}
                  >
                    <i className='icon icon-tail-right' />
                  </Button>
                </div>
              ) : (
                <Button
                  type='primary'
                  size='large'
                  onClick={e =>
                    this.onSubmit(e, setEvaluate, this.props.user.fullName)
                  }
                  loading={loading}
                >
                  Submit Feedback
                </Button>
              )}
            </div>
          )}
        </Mutation>
        <style jsx>{skillItemStyle}</style>
      </div>
    )
  }
}

export default props => {
  const { userId } = props.user
  const { data, loading, error } = useQuery(fetchUsersEvaluateInfo, {
    variables: {
      userId
    },
    fetchPolicy: 'network-only'
  })

  if (loading) return <LoadingSpinner />

  if (error) {
    return <Redirect to='/error-page/500' />
  }

  return (
    <HandleGlobalState>
      {setFrameworkState => (
        <UserEvaluatePage
          {...props}
          setFrameworkState={setFrameworkState}
          evaluateInfo={(data && data.fetchUsersEvaluateInfo) || []}
        />
      )}
    </HandleGlobalState>
  )
}
