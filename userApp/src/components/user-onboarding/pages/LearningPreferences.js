import React from 'react'
import { Button, Layout } from 'element-react'
import { FormGroup, Page } from '../../ui-components'
import { Link } from 'react-router-dom'
import history from '../../../history'
import Slider from 'react-slider'
import { NextButton } from './components'
import { useGA4React } from 'ga-4-react'

const LearningPreferences = ({ container, routeState }) => {
  const ga = useGA4React()

  const {
    filters: { durationRanges },
    filtersDispatch
  } = container.useContainer()

  const textStyle = {
    fontSize: '14px',
    color: '#556685'
  }

  return (
    <Page>
      <div className='page-content-align'>
        <h2 className='head__header'>
          How many hours per week do you want to learn?
        </h2>
        <div style={{ minHeight: '50vh' }}>
          <div
            style={{ display: 'flex', flexDirection: 'column' }}
            className='slider-container'
          >
            <Layout.Row span='24'>
              <form>
                <h4>
                  We will use that to prepare the best recommendations for you
                </h4>
              </form>
              {/* <FormGroup mainLabel='We will use that to prepare the best recommendations for you' > */}
              <Slider
                show-tooltip
                className='slider--duration slider-onboarding'
                value={
                  durationRanges[0]?.maxHours ? durationRanges[0]?.maxHours : 0
                }
                min={1}
                max={10}
                step={1}
                snapDragDisabled={false}
                onAfterChange={value => {
                  ga &&
                    ga.gtag('event', 'changed_learning_time', {
                      value: `${value}h`
                    })
                  window.analytics &&
                    window.analytics.track('changed_learning_time', {
                      value: `${value}h`
                    })
                  filtersDispatch({
                    type: 'SET_FILTER',
                    key: 'durationRanges',
                    value: [
                      {
                        minHours: 0,
                        maxHours: value
                      }
                    ]
                  })
                  filtersDispatch({
                    type: 'SET_FILTER',
                    key: 'durationEnabled',
                    value: true
                  })
                }}
                // renderTrack={(props, state) => <div {...props} index={state.index} />}
                renderThumb={(props, state) => (
                  <div {...props}>
                    <div className='thumb-tooltip'>{`${state.valueNow}h`}</div>
                  </div>
                )}
              />
              {/* </FormGroup> */}
            </Layout.Row>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={textStyle}>Less than 1h</div>
              <div style={textStyle}>10h+</div>
            </div>
          </div>
        </div>
      </div>
      <div className='bottom-nav-contained nav-preferences'>
        {routeState.backToDevPlan ? (
          <Link
            to={{
              pathname: '/onboarding/development-plan',
              state: {
                ...routeState,
                backToDevPlan: false
              }
            }}
            className='bottom-nav__previous'
          >
            {/* <i className="icon icon-tail-left" /> */}
            <span>Back to your Learning Path</span>
          </Link>
        ) : (
          <>
            <Link
              to={{
                pathname: '/onboarding/skill-levels',
                state: routeState
              }}
              className='bottom-nav__previous'
            >
              {/* <i className="icon icon-tail-left" /> */}
              <span>Previous step</span>
            </Link>

            <Button
              type='primary'
              onClick={() =>
                history.push('/onboarding/development-plan', routeState)
              }
            >
              <NextButton />
            </Button>
          </>
        )}
      </div>
    </Page>
  )
}

export default LearningPreferences
