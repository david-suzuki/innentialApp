import React, { useState, useEffect } from 'react'
import EmptyItem from './LearningItem'
import { DevelopmentPlanContent } from '../../../ui-components'
import { remapLearningContentForUI } from '../../../ui-components/utils'
import { useTracker } from '../../../../utils'
import { useHistory } from 'react-router-dom'
import arrowIcon from '../../../../static/arrow-small.svg'
// import { TotalDuration } from '.'

const OnboardingSelectionList = ({ container, routeState }) => {
  const trackEvent = useTracker()
  const [isMobile, setIsMobile] = useState(false)

  const {
    onboardingFunctions: { developmentPlanHandler },
    onboardingState: { developmentPlan, neededWorkSkills }
    // filters: { maxDuration }
  } = container.useContainer()

  const history = useHistory()

  useEffect(() => {
    setIsMobile(history.location.pathname === '/onboarding/my-selection')
  }, [history])

  const mobileStyle = {
    padding: '1rem 2rem',
    width: '100%',
    margin: 'auto'
  }

  return (
    <div
      className='onboarding__learning-items-selected'
      style={isMobile ? mobileStyle : { padding: 'unset' }}
    >
      <div style={{ display: 'flex' }}>
        <div
          style={{
            width: '24px',
            cursor: 'pointer',
            display: isMobile ? 'block' : 'none'
          }}
          onClick={() =>
            history.push('/onboarding/development-plan', routeState)
          }
        >
          <img src={arrowIcon} className='onboarding__learning-back-arrow' />
        </div>

        <h3
          style={{
            fontWeight: '900',
            padding: isMobile ? '0 0 2%' : '5% 0 77px'
          }}
        >
          {isMobile ? 'My Selection' : 'Your own learning path'}
        </h3>
      </div>
      {/* <TotalDuration
        maxDuration={maxDuration}
        developmentPlan={developmentPlan}
      />
      <br /> */}
      {developmentPlan.length === 0 ? (
        <EmptyItem isMobile={isMobile} />
      ) : (
        developmentPlan.map(content => {
          const learningContent = remapLearningContentForUI({
            content,
            neededWorkSkills
            // options: [
            //   {
            //     icon: 'icon-remove',
            //     text: 'Remove',
            //     color: '#556685',
            //     onClick: _id => {
            //       trackEvent('remove-from-plan', _id)
            //       developmentPlanHandler(content)
            //     }
            //   }
            // ]
          })
          return (
            <DevelopmentPlanContent
              key={learningContent._id}
              {...learningContent}
              onLinkClick={contentId => trackEvent('click', contentId)}
              onSelect={() => {
                trackEvent('remove-from-plan', content._id)
                developmentPlanHandler(content)
              }}
              selected
              isMobile={isMobile}
              inOnboarding
            />
          )
        })
      )}
    </div>
  )
}

export default OnboardingSelectionList
