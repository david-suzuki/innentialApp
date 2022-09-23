import React from 'react'
import { Button } from 'element-react'
import { Page } from '../../ui-components'
import { Link } from 'react-router-dom'
import history from '../../../history'
import { NextButton } from './components'
import HowToOne from '../../../static/how-to-1.png'
import HowToTwo from '../../../static/how-to-2.png'
import HowToThree from '../../../static/how-to-3.png'
import HowToFour from '../../../static/how-to-4.png'
import pagerStyle from '../../../styles/pagerStyle'
import { useGA4React } from 'ga-4-react'

const ContextPage = ({ routeState, userDetailsProvided, container }) => {
  const ga = useGA4React()

  const {
    onboardingState: { selectedWorkSkills }
  } = container.useContainer()

  return (
    <Page>
      <div className='page-content-align'>
        <h2 className='head__header'>How to use Innential</h2>
        <p className='head__paragraph'>
          Follow these steps to get the best results
        </p>
        <div style={{ minHeight: '50vh' }}>
          {/* STYLING OF THE CONTEXT PAGE GOES HERE */}

          <ol className='how-to-wrapper pager'>
            <li
              className='pager-item'
              style={{ alignItems: `baseline`, margin: `0` }}
            >
              <div className='how-to-item'>
                <div className='item-image'>
                  <img src={HowToOne} alt='how to one' />
                </div>
                <div className='item-content pager-item__description'>
                  <h3 className='item-content--header'>
                    Select skills you want to improve in
                  </h3>
                  <div className='item-content--text'>
                    <p>
                      As well as how much experience you have with the skills.
                      Innential can help you choose skills that are useful to
                      people with similar development goals.
                    </p>
                  </div>
                </div>
              </div>
            </li>
            <li
              className='pager-item'
              style={{ alignItems: `baseline`, margin: `0` }}
            >
              <div className='how-to-item'>
                <div className='item-image'>
                  <img src={HowToTwo} alt='how to one' />
                </div>
                <div className='item-content pager-item__description'>
                  <h3 className='item-content--header'>
                    Select a learning path
                  </h3>
                  <div className='item-content--text'>
                    <p>
                      Based on your selected skills, experience, Innential will
                      recommend you learning paths that best fit your needs.
                    </p>
                  </div>
                </div>
              </div>
            </li>
            <li
              className='pager-item'
              style={{ alignItems: `baseline`, margin: `0` }}
            >
              <div className='how-to-item'>
                <div className='item-image'>
                  <img src={HowToThree} alt='how to one' />
                </div>
                <div className='item-content pager-item__description'>
                  <h3 className='item-content--header'>Start learning</h3>
                  <div className='item-content--text'>
                    <p>
                      Innential will track your learning progress and send you
                      fresh content to keep skills sharp.
                    </p>
                  </div>
                </div>
              </div>
            </li>
            <li
              className='pager-item'
              style={{ alignItems: `baseline`, margin: `0` }}
            >
              <div className='how-to-item'>
                <div className='item-image'>
                  <img src={HowToFour} alt='how to one' />
                </div>
                <div className='item-content pager-item__description'>
                  <h3 className='item-content--header'>Keep learning!</h3>
                  <div className='item-content--text item-content--text-last'>
                    <p>
                      The best learning happens when it’s fun. Keep it that way
                      and stay positive. Update your skills when you have new
                      goals.
                    </p>
                  </div>
                </div>
              </div>
            </li>
          </ol>
        </div>
      </div>
      <div className='bottom-nav-contained nav-preferences'>
        {userDetailsProvided ? (
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
          onClick={() =>
            history.push('/onboarding/survey-decision', routeState)
          }
        >
          <NextButton />
        </Button>
      </div>
      <style jsx>{pagerStyle}</style>
    </Page>
  )
}

export default ContextPage
