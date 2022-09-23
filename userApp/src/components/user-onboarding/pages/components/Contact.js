import React, { useState } from 'react'
import { Button, MessageBox } from 'element-react'
import { Link, useHistory } from 'react-router-dom'
import { ChooseYourReasonBox } from '.'
import ContactOne from '../../../../static/contact-one.png'
import ContactTwo from '../../../../static/contact-two.png'
// import ContactThree from '../../../../static/contactThree.png'
// import ReactGA from 'react-ga'
// import WaitForNextSteps from './WaitForNextSteps'

// const SkipPopup = () => {
//   return (
//     <Link to={{ pathname: '/onboarding/almost-done', state: routeState }}>
//       <Button type='primary' onClick={() => clearDevelopmentPlan()}>
//         Skip
//       </Button>
//     </Link>
//   )
// }

const Contact = ({
  routeState,
  clearDevelopmentPlan = () => {},
  handleOnboardingChange = () => {}
  // user
}) => {
  const [reasons, setReasons] = useState([])
  const [other, setOther] = useState('')
  // const [waiting, setWaiting] = useState(false)
  const history = useHistory()

  // const { user } = routeState

  // useEffect(() => {
  //   // UPDATE INTERCOM WITH INFO
  //   window.Intercom('update', { 'Needs XLP': true })
  //   // ANALYTICS TRACKING
  //   // ReactGA.event({
  //   //   category: 'Onboarding',
  //   //   action: 'Requested contact',
  //   //   label: 'Intercom'
  //   // })
  //   window.analytics && window.analytics.track('requested_help_onboarding')

  //   return () => window.Intercom('update', { 'Needs XLP': false })
  //   // setWaiting(true)
  // })

  // CONTACT PAGE STYLING
  return (
    <div className='contact-wrapper'>
      <div className='contact-items'>
        <div className='contact-item'>
          <div className='contact-header'>
            <img src={ContactOne} alt='contact one' width='64' height='64' />
            <h5 className='item-header'>
              We would like to help you stay on track!
            </h5>
          </div>
          <p className='item-text'>
            Take this quick survey to find out what skills you should focus on
            and get better content recommendations.
          </p>
          <div className='contact-button'>
            <Link
              to={{
                pathname: '/onboarding/survey',
                state: { ...routeState, backToDevPlan: true }
              }}
            >
              <Button
                type='primary'
                onClick={() => handleOnboardingChange(true, 'survey')}
              >
                <strong>Take a survey</strong>
              </Button>
            </Link>
          </div>
        </div>
        {/* <img className='contact-item--image' src={''} alt='contact three' /> */}

        <div className='contact-item'>
          <div className='contact-header'>
            <img src={ContactTwo} alt='contact two' width='64' height='64' />
            <h5 className='item-header'>
              Want to browse our full content library?
            </h5>
          </div>
          <p className='item-text'>
            Skip this step to access courses, articles, books, and other types
            of resources available on our platform.{' '}
          </p>
          <div className='contact-button'>
            <Button
              type='primary'
              onClick={async () => {
                try {
                  await MessageBox.confirm(
                    <ChooseYourReasonBox
                      setReasonsHOC={setReasons}
                      setOtherHOC={setOther}
                    />,
                    '',
                    {
                      confirmButtonText: 'Skip',
                      showClose: true
                    }
                  )
                  window.analytics &&
                    window.analytics.track('skipped_onboarding', {
                      reasons,
                      other
                    })
                  clearDevelopmentPlan() // REMOVE ALL ITEMS SO THAT FIRST GOAL IS NOT CREATED
                  history.push('/onboarding/almost-done', routeState)
                } catch (e) {}
              }}
            >
              <strong>Skip this step</strong>
            </Button>
          </div>
        </div>
      </div>
      {/* <h3 className='contact-subheader'>
      Choose the best way to start
    </h3> */}
      {/* <WaitForNextSteps routeState={routeState} /> */}
      {/* <div className='contact-buttons'> */}
      {/* <div 
        className='contact-button'
        onClick={() => {
          // ANALYTICS TRACKING
          ReactGA.event({
            category: 'Onboarding',
            action: 'Requested contact',
            label: 'Calendly'
          })
          // DIRECT TO CONFIRMATION PAGE
          history.push('/onboarding/wait-for-confirmation', routeState)
        }}  
      >
        <span className='contact-button--icon'>
          <img src={Phone} alt='phone icon' />
        </span>
        <span className='contact-button--text'>
          Schedule a diagnosis call
        </span>
        <span className='contact-button--arrow'>
          <img src={Arrow} alt='arrow' />
        </span>
      </div> */}
      {/* <div
          className='contact-button'
          onClick={() => {
            // START UP INTERCOM
            if (process.env.NODE_ENV !== 'development') {
              const app_id = process.env.REACT_APP_STAGING ? 'prw4a6p4' : 'f8xjeosr' // eslint-disable-line
              window.Intercom('boot', {
                app_id,
                user_id: user._id,
                email: user.email,
                'Demo Account': user.isDemoUser,
                'User Role': user.roles.includes('ADMIN') ? 'Admin' : 'User'
              })
              window.Intercom('show')
            }
            // ANALYTICS TRACKING
            ReactGA.event({
              category: 'Onboarding',
              action: 'Requested contact',
              label: 'Intercom'
            })
            setWaiting(true)
            // DIRECT TO CONFIRMATION PAGE
            // history.push('/onboarding/wait-for-confirmation', routeState)
          }}
        >
          <span className='contact-button--icon'>
            <img src={Message} alt='message icon' />
          </span>
          {waiting ? (
            <WaitForNextSteps routeState={routeState} />
          ) : (
            <>
              <span className='contact-button--text'>
                Talk to us via online chat
              </span>
              <span className='contact-button--arrow'>
                <img src={Arrow} alt='arrow' />
              </span>
            </>
          )}
        </div>
      </div> */}
    </div>
  )
}

export default Contact
