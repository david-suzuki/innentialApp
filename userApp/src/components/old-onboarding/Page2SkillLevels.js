import React from 'react'
import { Button } from 'element-react'
import { FormGroup, Page, StarBar } from '../ui-components'
import history from '../../history'

export const Page2SkillLevels = ({ routeState, container }) => {
  const {
    onboardingSkills: {
      form: { selectedWorkSkills: skillsArray }
    },
    onboardingFunctions: { setFocusedFramework, setSkillLevel }
  } = container.useContainer()

  const isValid = skillsArray.every(el => el.level > 0)
  return (
    <Page>
      <div style={{ minHeight: '50vh' }}>
        <h3>Set your skill level</h3> <br />
        {skillsArray.map(skill => (
          <FormGroup key={skill._id}>
            <StarBar
              name={skill.name}
              subtitle={skill.category}
              level={skill.level}
              updateSkillLevels={setSkillLevel}
              handleHover={(level, name) => {
                if (skill.frameworkId) {
                  setFocusedFramework(skill.frameworkId, level, name)
                } else {
                  setFocusedFramework('no_framework', 0, name)
                }
              }}
            />
          </FormGroup>
        ))}
      </div>
      <div className='bottom-nav'>
        <div className='bottom-nav__previous'>
          <a onClick={() => history.push('/onboarding/my-skills', routeState)}>
            <i className='icon icon-tail-left' />
            <span>Previous step</span>
          </a>
        </div>
        <Button
          type='primary'
          className={isValid ? '' : 'is-disabled'}
          onClick={() => {
            if (isValid) {
              history.push('/onboarding/my-interests', routeState)
            }
          }}
        >
          <i className='icon icon-tail-right' />
        </Button>
      </div>
    </Page>
  )
}
