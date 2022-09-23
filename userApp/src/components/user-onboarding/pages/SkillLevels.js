import React, { useState, useEffect } from 'react'
import { Button } from 'element-react'
import {
  FormGroup,
  Page,
  StarBar,
  SkillsFrameworkOnboarding
} from '../../ui-components'
import { NextButton } from './components'
import history from '../../../history'
import { Link } from 'react-router-dom'
import { useScrollPosition } from '@n8tb1t/use-scroll-position'

const SkillLevels = ({
  routeState,
  onlySkills,
  container,
  userDetailsProvided
}) => {
  const {
    onboardingState: {
      framework: { frameworkId, skillName, level },
      selectedWorkSkills
    },
    onboardingFunctions: { setFocusedFramework, setSkillLevel }
  } = container.useContainer()

  const [onTop, setOnTop] = useState(true)

  useScrollPosition(({ prevPos, currPos }) => {
    if ((currPos.y > -53 && !onTop) || (currPos.y < -53 && onTop)) {
      setOnTop(!onTop)
    }
  })

  const isValid = selectedWorkSkills.every(skill =>
    Number.isInteger(skill.level)
  )

  return (
    <Page>
      <h2>Set your skill level</h2>
      <div
        id='skills-container'
        className={
          onTop
            ? 'onboarding__skills-framework-container skills-onTop'
            : 'onboarding__skills-framework-container'
        }
      >
        <div className='onboarding__skills-framework'>
          <SkillsFrameworkOnboarding
            frameworkId={frameworkId}
            selectedLevel={level}
            skillName={skillName}
          />
        </div>
      </div>

      <div
        className='onboarding__your-skill-levels'
        style={{ minHeight: '50vh' }}
      >
        {selectedWorkSkills.map(skill => (
          <FormGroup key={skill._id}>
            <StarBar
              name={skill.name}
              subtitle={skill.category}
              level={skill.level}
              updateSkillLevels={(name, level) =>
                setSkillLevel(name, level, 'selectedWorkSkills')
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
          </FormGroup>
        ))}
      </div>
      <div className='bottom-nav-contained'>
        {onlySkills || userDetailsProvided ? (
          <div />
        ) : (
          <Link
            to={{
              pathname: '/onboarding/about-you',
              state: routeState
            }}
            className='bottom-nav__previous'
          >
            {/* <i className="icon icon-tail-left" /> */}
            <span>Previous step</span>
          </Link>
        )}
        <Button
          type='primary'
          // className={isValid ? '' : 'is-disabled'}
          disabled={!isValid}
          onClick={() => {
            if (onlySkills) {
              // TODO: MUTATE
            } else {
              history.replace('/onboarding/how-to', routeState)
            }
          }}
        >
          <NextButton label={onlySkills ? 'Done' : 'Next'} />
        </Button>
      </div>
    </Page>
  )
}

export default SkillLevels
