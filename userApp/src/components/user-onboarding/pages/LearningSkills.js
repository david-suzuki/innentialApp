import React, { useRef, useState, useEffect } from 'react'

import { Button, Form, Notification } from 'element-react'
import { FormGroup, ListSkillSelector, Page } from '../../ui-components'
import { Link, useHistory } from 'react-router-dom'
import { NextButton } from './components'
import elementStyle from '../../../styles/elementStyle'
import Tooltip from 'react-simple-tooltip'
import { ReactComponent as PlusIcon } from '../../../static/plus-circle.svg'
import { ReactComponent as CrossIcon } from '../../../static/cross-circle.svg'
import { useGA4React } from 'ga-4-react'
import { fetchTopUsedSkills } from '../../../api'
import { useQuery } from 'react-apollo'
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
  const { data, loading, error } = useQuery(fetchTopUsedSkills)

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

  const suggestedSkills = data?.fetchTopUsedSkills || []

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

const LearningSkills = ({
  container,
  routeState /*, userDetailsProvided */
}) => {
  const ga = useGA4React()
  // const [highlightStars, setHighlightStars] = useState(false)

  const selector = useRef()
  const form = useRef()

  const {
    onboardingFunctions: { onSkillsSubmit, removeSkill },
    onboardingState: { neededWorkSkills }
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

  // useEffect(() => {
  //   if (highlightStars) {
  //     setTimeout(() => setHighlightStars(false), 1200)
  //   }
  // }, [highlightStars])

  // const handleSelectSkill = skill => {
  //   const { skills, onSkillsSubmit } = selectorProps
  //   onSkillsSubmit([...skills, skill])
  // }

  // const handleRemoveSkill = (e, skill) => {
  //   const { neededSkillsSelector, onSkillRemove } = selectorProps
  //   const skillKey = neededSkillsSelector
  //     ? 'neededWorkSkills'
  //     : 'selectedWorkSkills'
  //   onSkillRemove(e, skill._id, skillKey)
  // }

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
            What would you like to learn?
          </h2>
          <span className='subtitle'>
            Select up to 3 skills{' '}
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
          <div className='onboarding__skills-suggestions'>
            <span className='category-title'>Suggested Skills</span>
            <RecommendedSkills
              selectorProps={selectorProps}
              selector={selector}
            />
          </div>

          <div className='onboarding__skills-suggestions'>
            <span className='category-title'>Search for skills</span>
            <ListSkillSelector {...selectorProps} />
          </div>

          <div
            className='onboarding__md-position'
            style={{ minHeight: '50vh', position: 'relative' }}
          >
            {/* <Form
              ref={form}
              model={{
                neededWorkSkills
              }}
              rules={formRules}
              onSubmit={e => e.preventDefault()}
            >
              <FormGroup
                mainLabel={
                  <span className='category-title'>Search for skills</span>
                }
                onBoarding
              >
                <div className='onboarding__form-item form-item-skills'>
                  <Form.Item prop='neededWorkSkills'>
                    <ListSkillSelector {...selectorProps} />
                  </Form.Item>
                </div>
              </FormGroup>
            </Form> */}
          </div>
        </div>
      </div>
      <div className='bottom-nav-contained'>
        {!routeState.backToDevPlan ? (
          <Link
            to={{
              pathname: '/onboarding/survey-decision',
              state: routeState
            }}
            className='bottom-nav__previous'
          >
            <span>Previous step</span>
          </Link>
        ) : (
          <div />
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

            // form.current.validate(valid => {
            //   if (valid) {
            //     history.push('/onboarding/skill-levels', routeState)
            //   } else {
            //     ga && ga.gtag('event', 'failed_validation')
            //     window.analytics && window.analytics.track('failed_validation')
            //     window.scrollTo({
            //       top: 0,
            //       behavior: 'smooth'
            //     })
            //   }
            // })
          }}
        >
          <NextButton />
        </Button>
      </div>
      <style jsx>{elementStyle}</style>
    </Page>
  )
}

export default LearningSkills
