import React, { useState, useRef, Component } from 'react'
import { Redirect, useLocation, useHistory } from 'react-router-dom'
import { useQuery, Mutation } from 'react-apollo'
import {
  publicFetchExternalFeedbackInfo,
  publicSetUsersEvaluation
} from '../api'
import { captureFilteredError, SentryDispatch } from './general'
import {
  Page,
  // FormGroup,
  // UserHeading,
  PublicStarBar,
  FormDescription,
  // ListSkillSelector,
  TextEditor
} from './ui-components'
import { Input, Button, Form, MessageBox, Notification } from 'element-react'
import bottomNavStyle from '../styles/bottomNavStyle'
import onboardingStyle from '../styles/onboardingStyle'
import variables from '../styles/variables'
import '../styles/theme/notification.css'
import skillItemStyle from '../styles/skillItemStyle'
import { removeDuplicates } from '../utils'
import { JWT } from '../environment'
import { SkillsFrameworkTextNodes } from './ui-components/SkillsFramework'

// WIP COMPONENT FOR EXTERNAL FEEDBACK

const PageWrapper = ({ children, framework, corporate }) => {
  return (
    <div className='onboarding__wrapper'>
      <div className='onboarding__sidebar'>
        <img
          className='onboarding-logo'
          alt='Innential Logo'
          src={require('../static/innential-logo.svg')}
        />
        {framework?.levelTexts && (
          <SkillsFrameworkTextNodes {...framework} corporate={corporate} />
        )}
        <div className='onboarding__sidebar-background' />
      </div>
      <Page>{children}</Page>
      <style>{onboardingStyle}</style>
    </div>
  )
}

class EvaluationLanding extends Component {
  state = {
    feedback: '',
    skills: this.props.evaluateInfo.map(skill => ({
      ...skill,
      level: 0
    })),
    rawSkills: this.props.evaluateInfo,
    recommendedSkills: [],
    personalData: {
      firstName: '',
      lastName: '',
      email: ''
    },
    framework: null
  }

  form = React.createRef()

  handleChange = (key, value) => {
    this.setState({ [key]: value })
  }

  handleChangePersonalData = (key, value) => {
    this.setState(({ personalData }) => ({
      personalData: {
        ...personalData,
        [key]: value
      }
    }))
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

  setFocusedFramework = (levelTexts, level, skillName) => {
    this.setState({
      framework: {
        skillName,
        level,
        levelTexts
      }
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

  // componentWillUnmount = () => {
  //   // this.props.setFrameworkState({ visible: false })
  //   // const mainWrapper = document.getElementById('main-wrapper')
  //   // mainWrapper.className = 'container-main__wrapper'
  // }

  onSubmit = async (e, setEvaluate, userName) => {
    e.preventDefault()
    this.form.current.validate(async valid => {
      if (valid) {
        const {
          rawSkills,
          recommendedSkills,
          feedback,
          personalData
        } = this.state

        personalData.email = personalData.email.toLowerCase()

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

        const feedbackData = {
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
              feedbackData,
              personalData
            }
          })

          if (!response?.data?.publicSetUsersEvaluation) {
            Notification({
              message: `Feedback sent to ${userName}`,
              type: 'success',
              duration: 2500,
              offset: 90
            })
            // document.cookie = 'submitted=true;max-age=86400' // 1 DAY
            this.props.submit()
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
      } else {
        document.getElementById('formdetails').scrollIntoView({
          behavior: 'smooth'
        })
        // window.scrollTo({
        //   top: 0,
        //   behavior: 'smooth'
        // })
      }
    })
    // if (!this.checkSkillsValid()) {
    //   Notification({
    //     message: 'Please provide feedback to all skills you selected',
    //     type: 'warning',
    //     duration: 2500,
    //     offset: 90
    //   })
    // } else {
    // }
  }

  render() {
    // const { stageResultInfo, teamName } = this.props.teamInfo
    const {
      skills /*, frameworkId, selectedLevel, selectedName */,
      // recommendedSkills,
      feedback,
      personalData,
      framework
    } = this.state

    const { firstName, lastName, email } = personalData

    // const globalStateProps = { frameworkId, selectedLevel, selectedName }
    const { corporate } = this.props
    return (
      <PageWrapper framework={framework} corporate={corporate}>
        <h1>
          Give feedback to{' '}
          <span style={{ color: '#5a55ab' }}>{this.props.user.fullName}</span>
        </h1>
        <div className='public-feedback__wrapper'>
          <Form
            model={personalData}
            ref={this.form}
            rules={{
              firstName: [
                {
                  required: true,
                  message: 'Required',
                  trigger: 'submit'
                }
              ],
              lastName: [
                {
                  required: true,
                  message: 'Required',
                  trigger: 'submit'
                }
              ],
              email: [
                {
                  required: true,
                  message: 'Required',
                  trigger: 'submit'
                },
                {
                  type: 'email',
                  message: 'Please enter a valid email address',
                  trigger: 'submit'
                }
              ]
            }}
          >
            <FormDescription
              style={{ marginTop: 24 }}
              label='Who are you?'
              description='Please verify your identity'
              largeLabel
            />
            <div
              style={{ display: 'flex', justifyContent: 'space-between' }}
              id='formdetails'
            >
              <Form.Item prop='firstName' style={{ width: '48%' }}>
                <Input
                  value={firstName}
                  placeholder='First Name'
                  onChange={value =>
                    this.handleChangePersonalData('firstName', value)
                  }
                />
              </Form.Item>
              <Form.Item prop='lastName' style={{ width: '48%' }}>
                <Input
                  value={lastName}
                  placeholder='Last Name'
                  onChange={value =>
                    this.handleChangePersonalData('lastName', value)
                  }
                />
              </Form.Item>
            </div>
            <Form.Item prop='email'>
              <Input
                value={email}
                placeholder='Email'
                onChange={value =>
                  this.handleChangePersonalData('email', value)
                }
              />
            </Form.Item>
          </Form>
          <FormDescription
            style={{ marginTop: 24 }}
            label="What's your feedback?"
            description='Write your feedback here'
            largeLabel
          />
          <div style={{ padding: '24px 0px' }}>
            <TextEditor
              value={feedback}
              handleChange={value => this.handleChange('feedback', value)}
            />
          </div>
          {/* 
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
        */}
          {skills.length > 0 && (
            <>
              <FormDescription
                style={{ marginTop: 24 }}
                label={`How have ${this.props.user.fullName}'s skills changed`}
                description="Only give stars to skills that you're familiar with. Hover over a star to see detailed explanation"
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
                    <PublicStarBar
                      name={skill.name}
                      subtitle={skill.category}
                      level={skill.level}
                      updateSkillLevels={this.setRecommendedSkillsLevel}
                      n={corporate ? 4 : 5}
                      handleHover={(level, skillName) => {
                        if (skill.framework) {
                          this.setFocusedFramework(
                            skill.framework,
                            level,
                            skillName
                          )
                        } else {
                          this.setFocusedFramework(null, 0, skillName)
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div className='bottom-nav-contained'>
          <div />
          <Mutation mutation={publicSetUsersEvaluation}>
            {(setEvaluate, { loading }) => (
              <Button
                type='primary'
                onClick={e =>
                  this.onSubmit(e, setEvaluate, this.props.user.fullName)
                }
                loading={loading}
                style={{ marginRight: '16px' }}
              >
                <strong style={{ fontFamily: 'Poppins', fontSize: 14 }}>
                  Submit Feedback
                </strong>
              </Button>
            )}
          </Mutation>
          <style jsx>{skillItemStyle}</style>
          <style jsx>{bottomNavStyle}</style>
        </div>
      </PageWrapper>
    )
  }
}

const TokenQuery = ({ token }) => {
  const [submitted, setSubmitted] = useState(false)

  const { data, loading, error } = useQuery(publicFetchExternalFeedbackInfo, {
    variables: {
      token
    }
  })

  if (loading) return null

  if (error) {
    return <SentryDispatch error={error} />
  }

  if (data) {
    const feedbackInfo = data.publicFetchExternalFeedbackInfo

    if (feedbackInfo === null) return <Redirect to='/' />

    const authToken = localStorage.getItem(JWT.LOCAL_STORAGE.TOKEN.NAME)
    const refreshToken = localStorage.getItem(
      JWT.LOCAL_STORAGE.REFRESH_TOKEN.NAME
    )

    const {
      _id: userId,
      userName: fullName,
      skills = [],
      corporate
    } = feedbackInfo

    if (authToken || refreshToken) {
      return (
        <Redirect
          to={{
            pathname: '/evaluate-employee',
            state: {
              userId,
              fullName,
              redirect: `/`
            }
          }}
        />
      )
    }

    // const cookiesArray = document.cookie.split(';')

    // const cookieExists = cookiesArray.some(cookie => cookie.trim().indexOf('submitted=') != -1)

    if (submitted) {
      return (
        <PageWrapper>
          <h1>Thank you for submitting your feedback!</h1>
        </PageWrapper>
      )
    }

    return (
      <EvaluationLanding
        user={{ userId, fullName }}
        evaluateInfo={skills}
        corporate={corporate}
        submit={() => setSubmitted(true)}
      />
    )
  }
}

const FeedbackLanding = () => {
  const { search } = useLocation()

  const params = new URLSearchParams(search)

  const token = params.get('token')

  if (!token) return <Redirect to='/' />

  return <TokenQuery token={token} />
}

export default FeedbackLanding
