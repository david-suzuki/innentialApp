import React, { useRef, useState, useEffect } from 'react'

import { Button, Form, Notification } from 'element-react'
import {
  FormGroup,
  Page,
  SkillsFrameworkOnboarding,
  StarBarOnboarding
} from '../../ui-components'
import { Link, useHistory } from 'react-router-dom'
import { NextButton } from './components'
import elementStyle from '../../../styles/elementStyle'

import { useGA4React } from 'ga-4-react'

const LearningSkillLevels = ({
  container,
  routeState /*, userDetailsProvided */
}) => {
  const ga = useGA4React()
  const [highlightStars, setHighlightStars] = useState(false)

  // const [formRules] = useState({
  //   neededWorkSkills: {
  //     validator: (rule, value, callback) => {
  //       if (value.length === 0) {
  //         callback(new Error('You must select at least one skill'))
  //       } else if (!value.every(skill => !isNaN(skill.level))) {
  //         setHighlightStars(true)
  //         callback(new Error(`Please provide all skill levels`))
  //       } else {
  //         callback()
  //       }
  //     },
  //     type: 'array',
  //     trigger: 'change'
  //   }
  // })

  const selector = useRef()
  const form = useRef()

  useEffect(() => {
    if (highlightStars) {
      setTimeout(() => setHighlightStars(false), 1200)
    }
  }, [highlightStars])

  // const checkValidation = () => {
  //   if (!form.current.state.fields[0].state.valid) {
  //     return form.current.resetFields()
  //   }
  // }

  const {
    onboardingFunctions: { setFocusedFramework, removeSkill, setSkillLevel },
    onboardingState: {
      framework: { frameworkId, skillName, level },
      neededWorkSkills,
      survey
    }
  } = container.useContainer()

  useEffect(() => {
    if (neededWorkSkills.length === 0) {
      history.replace(
        survey
          ? '/onboarding/survey-completed'
          : '/onboarding/skill-preferences',
        routeState
      )
    }
  }, [neededWorkSkills])

  const history = useHistory()

  const handleValidationError = message => {
    ga && ga.gtag('event', 'failed_validation')
    window.analytics && window.analytics.track('failed_validation')
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })

    Notification({
      type: 'warning',
      message: message,
      duration: 2500,
      offset: 90
    })
  }

  return (
    <Page lessPadding>
      <div
        className='page-content-align'
        style={{ display: 'flex', flexDirection: 'column', width: '100%' }}
      >
        <div className='content-center'>
          <h2
            className='head__header'
            style={{
              textAlign: 'left'
            }}
          >
            How experienced are you?
          </h2>
          <div className='onboarding__skills-framework-container skills-preferences'>
            <div className='onboarding__skills-framework'>
              <SkillsFrameworkOnboarding
                frameworkId={frameworkId}
                selectedLevel={level}
                skillName={skillName}
              />
            </div>
          </div>
          <div
            className='onboarding__md-position'
            style={{ minHeight: '70vh' }}
          >
            {neededWorkSkills.map((skill, i) => (
              <>
                <div className='onboarding__skill-container' key={skill._id}>
                  <div>
                    <StarBarOnboarding
                      setSkillLevel={setSkillLevel}
                      // isOnboarding
                      highlighted={highlightStars}
                      checkValidation={() => {}}
                      skill={skill}
                      removeSkill={(e, skill) => {
                        removeSkill(
                          e,
                          skill.skillId || skill._id,
                          'neededWorkSkills'
                        )
                        const skillSelector = selector?.current
                        if (skillSelector) {
                          skillSelector.onSkillRemove(skill, e)
                        }
                      }}
                      name={skill.name}
                      subtitle={skill.category}
                      level={skill.level}
                      updateSkillLevels={(name, level) =>
                        setSkillLevel(name, level, 'neededWorkSkills')
                      }
                      handleHover={(level, name) => {
                        if (skill.frameworkId) {
                          setFocusedFramework(skill.frameworkId, level, name)
                        } else {
                          setFocusedFramework('no_framework', 0, name)
                        }
                      }}
                      handleMouseOut={() => setFocusedFramework(null, 0, '')}
                    />
                  </div>
                </div>
              </>
            ))}
            {/* <Form
              ref={form}
              model={{
                neededWorkSkills
              }}
              rules={formRules}
              onSubmit={e => e.preventDefault()}
            >
              <FormGroup onBoarding>
                <div className='onboarding__skills-list-container'>
                  <Form.Item prop='neededWorkSkills'>
                    {neededWorkSkills.map((skill, i) => (
                      <>
                        <div
                          className='onboarding__skill-container'
                          key={skill._id}
                        >
                          <div>
                            <StarBarOnboarding
                              setSkillLevel={setSkillLevel}
                              // isOnboarding
                              highlighted={highlightStars}
                              checkValidation={checkValidation}
                              skill={skill}
                              removeSkill={(e, skill) => {
                                removeSkill(
                                  e,
                                  skill.skillId || skill._id,
                                  'neededWorkSkills'
                                )
                                const skillSelector = selector?.current
                                if (skillSelector) {
                                  skillSelector.onSkillRemove(skill, e)
                                }
                              }}
                              name={skill.name}
                              subtitle={skill.category}
                              level={skill.level}
                              updateSkillLevels={(name, level) =>
                                setSkillLevel(name, level, 'neededWorkSkills')
                              }
                              handleHover={(level, name) => {
                                if (skill.frameworkId) {
                                  setFocusedFramework(
                                    skill.frameworkId,
                                    level,
                                    name
                                  )
                                } else {
                                  setFocusedFramework('no_framework', 0, name)
                                }
                              }}
                              handleMouseOut={() =>
                                setFocusedFramework(null, 0, '')
                              }
                            />
                          </div>
                        </div>
                      </>
                    ))}
                  </Form.Item>
                </div>
              </FormGroup>
            </Form> */}
          </div>
        </div>
      </div>

      <div className='bottom-nav-contained bottom-skills'>
        <Link
          to={{
            pathname: survey
              ? '/onboarding/survey-completed'
              : '/onboarding/skill-preferences',
            state: routeState
          }}
          className='bottom-nav__previous'
        >
          <span>Previous step</span>
        </Link>

        <Button
          type='primary'
          onClick={() => {
            if (neededWorkSkills.length === 0) {
              handleValidationError('You must select at least one skill')
            } else if (!neededWorkSkills.every(skill => !isNaN(skill.level))) {
              setHighlightStars(true)
              handleValidationError(`Please provide all skill levels!`)
            } else {
              history.push(
                routeState.backToDevPlan
                  ? '/onboarding/development-plan'
                  : '/onboarding/learning-preferences',
                {
                  ...routeState,
                  backToDevPlan: false
                }
              )
            }
          }}
        >
          <NextButton />
        </Button>
      </div>
      <style jsx>{elementStyle}</style>
    </Page>
  )
}

export default LearningSkillLevels
