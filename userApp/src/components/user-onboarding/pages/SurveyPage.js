import React from 'react'
import { Button } from 'element-react'
import { Page } from '../../ui-components'
import { Link } from 'react-router-dom'
import history from '../../../history'
import { Widget } from '@typeform/embed-react'
import { ReactTypeformEmbed } from 'react-typeform-embed'

const SurveyComponent = ({ userId, routeState }) => {
  const staging = process.env.REACT_APP_STAGING
  const development = process.env.NODE_ENV !== 'production'

  const surveyId = development ? 'aeN4k3nE' : staging ? 'pRSwQ1HP' : 'cKfHae7E'

  // return <ReactTypeformEmbed
  //   url={`https://form.typeform.com/to/${surveyId}?userid=${userId }`}
  //   style={{width: '800px', height: '500px'}}
  //   onSubmit={() => {
  //     history.push('/onboarding/survey-completed', routeState)
  //   }}
  //   />

  return (
    <Widget
      id={surveyId}
      hidden={{ userid: userId }}
      className='survey-widget'
      height={600}
      onSubmit={() => {
        history.push('/onboarding/survey-completed', routeState)
      }}
    />
  )
}

const SurveyPage = ({ routeState, userId }) => {
  return (
    <Page>
      <SurveyComponent userId={userId} routeState={routeState} />

      {routeState.backToDevPlan ? (
        <Link
          to={{
            pathname: '/onboarding/development-plan',
            state: { ...routeState, backToDevPlan: false }
          }}
          className='bottom-nav__previous survey-navs'
        >
          {/* <i className="icon icon-tail-left" /> */}
          <span>Go back</span>
        </Link>
      ) : (
        <Link
          to={{
            pathname: '/onboarding/survey-decision',
            state: routeState
          }}
          className='bottom-nav__previous survey-navs'
        >
          {/* <i className="icon icon-tail-left" /> */}
          <span>Previous step</span>
        </Link>
      )}
    </Page>
  )
}

export default SurveyPage
