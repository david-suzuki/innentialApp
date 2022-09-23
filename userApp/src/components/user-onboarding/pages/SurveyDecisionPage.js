import React, { useRef, useState, useEffect } from 'react'

import { Button } from 'element-react'
import { Page } from '../../ui-components'
import { Link } from 'react-router-dom'
import { NextButton } from './components'
import elementStyle from '../../../styles/elementStyle'
import history from '../../../history'
import { ReactComponent as FlagIcon } from '../../../static/flag_white.svg'
import { ReactComponent as SmileIcon } from '../../../static/smile.svg'

const LearningSkills = ({ container, routeState }) => {
  const {
    onboardingFunctions: { handleOnboardingChange }
  } = container.useContainer()

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
            Do you know what <u>skills</u> you want to work on?
          </h2>
          <p className='head_subtitle'>
            Select skills yourself or let a quick survey help you choose what to
            learn next.
          </p>

          <Button
            type='primary'
            className='skill-choice'
            onClick={() => {
              handleOnboardingChange(false, 'survey')
              history.push('/onboarding/skill-preferences', routeState)
            }}
          >
            <SmileIcon />
            <div className='bottom-nav__button-next'>Yes, I do</div>
          </Button>

          <Button
            type='primary'
            className='skill-choice'
            onClick={() => {
              handleOnboardingChange(true, 'survey')
              window.analytics && window.analytics.track('survey')
              history.push('/onboarding/survey', routeState)
            }}
          >
            <FlagIcon />
            <div className='bottom-nav__button-next'>No, need help!</div>
          </Button>

          <div
            className='onboarding__md-position'
            style={{ minHeight: '50vh' }}
          />
        </div>
      </div>
      <div className='bottom-nav-contained'>
        <Link
          to={{
            pathname: '/onboarding/how-to',
            state: routeState
          }}
          className='bottom-nav__previous'
        >
          {/* <i className="icon icon-tail-left" /> */}
          <span>Previous step</span>
        </Link>
      </div>
      <style jsx>{elementStyle}</style>
    </Page>
  )
}

export default LearningSkills
