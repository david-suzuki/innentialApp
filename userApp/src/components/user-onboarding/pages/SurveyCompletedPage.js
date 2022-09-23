import React, { useRef, useState, useEffect } from 'react'

import { Button, Form, Notification } from 'element-react'
import {
  FormGroup,
  ListSkillSelector,
  Page,
  SkillsFrameworkOnboarding,
  StarBarOnboarding
} from '../../ui-components'
import { Link, useHistory } from 'react-router-dom'
import { NextButton } from './components'
import { useScrollPosition } from '@n8tb1t/use-scroll-position'
import elementStyle from '../../../styles/elementStyle'
import Tooltip from 'react-simple-tooltip'
import { useLazyQuery } from 'react-apollo'
import { ReactComponent as RefreshIcon } from '../../../static/refresh.svg'
import { ReactComponent as PlusIcon } from '../../../static/plus-circle.svg'
import { ReactComponent as CrossIcon } from '../../../static/cross-circle.svg'

import { fetchRecommendedSkills } from '../../../api'

import { useGA4React } from 'ga-4-react'
import { captureFilteredError, LoadingSpinner } from '../../general'

const SkillTag = ({ name, _id, isSelected, onClick, onRemove }) => {
  return (
    <div
      className={`suggested-skill-tag ${isSelected ? 'selected' : ''}`}
      onClick={isSelected ? onRemove : onClick}
    >
      <span>{name}</span>
      {isSelected ? <CrossIcon /> : <PlusIcon />}
    </div>
  )
}

const RecommendedSkills = ({ selectorProps, selector }) => {
  const [getSkills, { data, loading, error }] = useLazyQuery(
    fetchRecommendedSkills,
    {
      fetchPolicy: 'network-only'
    }
  )

  const handleSelectSkill = skill => {
    const { skills, onSkillsSubmit } = selectorProps

    if (skills.length < 3) {
      onSkillsSubmit([...skills, skill])
    }

    const skillSelector = selector?.current
    if (skillSelector) {
      skillSelector.onSkillAdd({
        label: skill.name,
        value: skill._id
      })
    }
  }

  const handleRemoveSkill = (e, skill) => {
    const { neededSkillsSelector, onSkillRemove } = selectorProps
    const skillKey = neededSkillsSelector
      ? 'neededWorkSkills'
      : 'selectedWorkSkills'
    onSkillRemove(e, skill._id, skillKey)

    const skillSelector = selector?.current
    if (skillSelector) {
      skillSelector.onSkillRemove(skill, e)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => getSkills(), 5000)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  if (loading) return <LoadingSpinner />

  if (error) {
    captureFilteredError(error)
    Notification({
      type: 'error',
      message: `Oops, something went wrong!`,
      duration: 2500,
      iconClass: 'el-icon-error',
      offset: 90
    })
  }

  const suggestedSkills = data?.fetchRecommendedSkills || []

  const filteredSkills =
    selectorProps?.skills?.filter(
      skill =>
        !suggestedSkills.some(
          s => (s.skillId || s._id) === (skill.skillId || skill._id)
        )
    ) || []

  return (
    <>
      <div className='onboarding__skills-suggestions-content'>
        {suggestedSkills.map(el => (
          <SkillTag
            key={`suggested-skill-${el._id}`}
            isSelected={selectorProps.skills.find(
              skill => skill._id === el._id
            )}
            {...el}
            onClick={() => {
              window.analytics &&
                window.analytics.track('picked_suggested_skill', {
                  skillId: el._id,
                  name: el.name
                })
              handleSelectSkill(el)
            }}
            onRemove={e => handleRemoveSkill(e, el)}
          />
        ))}
        {filteredSkills.map(el => (
          <SkillTag
            key={`selected-skill-${el._id}`}
            isSelected
            {...el}
            onClick={() => handleSelectSkill(el)}
            onRemove={e => handleRemoveSkill(e, el)}
          />
        ))}
      </div>
      {!data && !error && <LoadingSpinner />}
    </>
  )
}

const SurveyCompletedPage = ({
  container,
  routeState /*, userDetailsProvided */
}) => {
  const ga = useGA4React()
  // const [formRules] = useState({
  //   neededWorkSkills: {
  //     validator: (rule, value, callback) => {
  //       if (value.length === 0) {
  //         callback(new Error('You must select at least one skill'))
  //       } else if (value.length > 3) {
  //         callback(new Error('Please select up to 3 skills'))
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

  const {
    onboardingFunctions: { onSkillsSubmit, removeSkill },
    onboardingState: {
      framework: { frameworkId, skillName, level },
      neededWorkSkills
    }
  } = container.useContainer()

  const history = useHistory()

  const selectorProps = {
    buttonValue: 'Click to choose',
    buttonClass: 'list-skill-selector__button-input onboarding-button-input',
    skills: neededWorkSkills,
    onSkillsSubmit: skills => {
      ga &&
        ga.gtag('event', 'chose_skills', {
          time: new Date().toTimeString(),
          skills: skills.map(skill => skill.name).join(', ')
        })
      onSkillsSubmit(skills, 'neededWorkSkills', true)
    },
    onSkillRemove: removeSkill,
    neededSkillsSelector: true,
    clearState: true,
    forwardRef: selector
  }

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
        style={{ display: 'flex', flexDirection: 'column', width: ' 100%' }}
      >
        <div className='content-center'>
          <h2
            className='head__header'
            style={{
              textAlign: 'left'
            }}
          >
            Thank you for taking the time!
          </h2>

          <span className='subtitle'>
            Take a look at skills based on your survey results. Select up to 3
            skills{' '}
            {selectorProps.neededSkillsSelector && (
              <Tooltip
                content='Our research shows that selecting up to 3 skills
                  makes learning more effective.'
                zIndex={11}
                fontSize='11px'
                padding={4}
                placement='right'
              >
                <i className='icon el-icon-question' />
              </Tooltip>
            )}
          </span>

          <div
            className='onboarding__md-position'
            style={{ minHeight: '50vh' }}
          >
            <div
              className='onboarding__skills-suggestions'
              style={{
                paddingTop: 0,
                paddingBottom: 40
              }}
            >
              <span className='category-title'>Suggested Skills</span>
              <RecommendedSkills
                selectorProps={selectorProps}
                selector={selector}
              />
            </div>
            <span className='category-title'>Search for skills</span>
            <div className='onboarding__form-item form-item-skills'>
              <ListSkillSelector {...selectorProps} />
            </div>
            <br />
            <div>
              <Link
                className='onboarding_refresh-survey'
                to={{
                  pathname: '/onboarding/survey',
                  state: routeState
                }}
              >
                <RefreshIcon />
                Take the survey one more time
              </Link>
            </div>

            {/* <Form
              ref={form}
              model={{
                neededWorkSkills
              }}
              rules={formRules}
              onSubmit={e => e.preventDefault()}
            >
              <FormGroup onBoarding>
                <div
                  className='onboarding__skills-suggestions'
                  style={{
                    paddingTop: 0,
                    paddingBottom: 40
                  }}
                >
                  <span className='category-title'>Suggested Skills</span>
                  <RecommendedSkills
                    selectorProps={selectorProps}
                    selector={selector}
                  />
                </div>

                <span className='category-title'>Search for skills</span>
                <div className='onboarding__form-item form-item-skills'>
                  <Form.Item prop='neededWorkSkills'>
                    <ListSkillSelector {...selectorProps} />
                  </Form.Item>
                </div>
                <br />
                <div>
                  <Link
                    className='onboarding_refresh-survey'
                    to={{
                      pathname: '/onboarding/survey',
                      state: routeState
                    }}
                    onClick={() =>
                      window.analytics && window.analytics.track('survey')
                    }
                  >
                    <RefreshIcon />
                    Take the survey one more time
                  </Link>
                </div>
              </FormGroup>
            </Form> */}
          </div>
        </div>
      </div>

      <div className='bottom-nav-contained bottom-skills'>
        {routeState.backToDevPlan ? (
          <div />
        ) : (
          <Link
            to={{
              pathname: '/onboarding/survey-decision',
              state: routeState
            }}
            className='bottom-nav__previous'
          >
            <span>Previous step</span>
          </Link>
        )}

        <Button
          type='primary'
          onClick={() => {
            const allSelectedSkills = selectorProps.skills

            if (allSelectedSkills.length === 0) {
              handleValidationError('You must select at least one skill')
            } else if (allSelectedSkills.length > 3) {
              handleValidationError(`You can't select more than 3 skills!`)
            } else {
              history.push('/onboarding/skill-levels', routeState)
            }

            // if (valid) {
            //   history.push('/onboarding/skill-levels', routeState)
            // } else {
            //   ga && ga.gtag('event', 'failed_validation')
            //   window.analytics && window.analytics.track('failed_validation')
            //   window.scrollTo({
            //     top: 0,
            //     behavior: 'smooth'
            //   })
            // }
          }}
        >
          <NextButton />
        </Button>
      </div>
      <style jsx>{elementStyle}</style>
    </Page>
  )
}

export default SurveyCompletedPage
