import React, { useEffect, useState } from 'react'

import { useQuery } from 'react-apollo'
import { fetchContentForOnboardingPlan } from '../../../../api'
// import { LoadingSpinner } from '../../../general'
import { Statement, DevelopmentPlanContent } from '../../../ui-components'
import { remapLearningContentForUI } from '../../../ui-components/utils'
import { useTracker } from '../../../../utils'
import { Button } from 'element-react'
import Refresh from './Refresh'
import StickyHeader from './StickyHeader'
import loadingCurl from '../../../../static/loading-curl.svg'
import EmptyItem from './LearningItem'

const RefreshButtonChildren = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around'
    }}
  >
    {' '}
    Show me something else
    <Refresh />
  </div>
)

const OnboardingContentList = ({
  filters,
  neededSkills,
  contentSeen,
  appendContentSeen,
  setContentSeen,
  developmentPlanHandler,
  developmentPlan,
  routeState
}) => {
  const [currentImpression, setCurrentImpression] = useState([])

  const trackEvent = useTracker()

  const { data, loading, error } = useQuery(fetchContentForOnboardingPlan, {
    variables: {
      filters,
      neededSkills,
      contentSeen
    }
  })

  useEffect(() => {
    if (!loading && data) {
      // An impression is a collection of recommendations visible to the user
      // represented by an array of IDs
      const impression = data.fetchContentForOnboardingPlan.map(
        item => item._id
      )
      setCurrentImpression(impression)
    }
  }, [data, setCurrentImpression])

  useEffect(() => {
    if (!loading && data) {
      // If all content is in the development plan, fetch more items
      const remainingItems = data.fetchContentForOnboardingPlan.filter(
        item => !developmentPlan.some(({ _id }) => _id === item._id)
      )
      if (remainingItems.length === 0) {
        appendContentSeen(currentImpression)
      }
    }
  }, [data, appendContentSeen, developmentPlan, currentImpression])

  useEffect(() => {
    if (!loading && data) {
      // If shuffled through the whole list, reset from the beginning
      const remainingItems = data.fetchContentForOnboardingPlan
      if (remainingItems.length === 0) {
        setContentSeen([])
      }
    }
  }, [data, setContentSeen])

  if (loading) {
    return (
      <div className='onboarding__learning-items-available'>
        <div style={{ padding: '5% 0' }}>
          <h3 style={{ fontWeight: '900', marginBottom: '6%' }}>
            Recommendations
          </h3>
          <div className='onboarding__content-alignment'>
            <Button
              className='el-button onboarding__span-change onboarding__button'
              disabled
            >
              <RefreshButtonChildren />
            </Button>
          </div>
        </div>
        <div
          style={{
            maxWidth: 370,
            height: 1350,
            margin: '50px auto'
            // padding: '15% 25%'
          }}
        >
          <div
            className='loading-curl'
            style={{
              backgroundImage: `url(${loadingCurl})`
            }}
          />
        </div>
        <div className='onboarding__content-alignment'>
          <Button
            className='el-button onboarding__span-change onboarding__button'
            disabled
          >
            <RefreshButtonChildren />
          </Button>
        </div>
      </div>
    )
  }

  if (error) {
    return <Statement content='Oops! Something went wrong.' />
  }

  const items = (data && data.fetchContentForOnboardingPlan) || []

  return (
    <div className='onboarding__learning-items-available'>
      <div style={{ padding: '5% 0' }}>
        <StickyHeader
          developmentPlan={developmentPlan}
          developmentPlanHandler={developmentPlanHandler}
          routeState={routeState}
        />
      </div>
      {items.length > 0 && (
        <>
          <div className='onboarding__content-alignment button-alignment'>
            <Button
              className='onboarding__span-change onboarding__button'
              onClick={() => appendContentSeen(currentImpression)}
            >
              <RefreshButtonChildren />
            </Button>
          </div>
          <br />
        </>
      )}

      {items
        .filter(item => !developmentPlan.some(({ _id }) => _id === item._id))
        .map(content => {
          const learningContent = remapLearningContentForUI({
            content,
            // options: [
            //   {
            //     icon: 'icon-small-add',
            //     text: 'Add',
            //     color: '#556685',
            //     onClick: _id => {
            //       trackEvent('add-to-plan', _id, currentImpression)
            //       developmentPlanHandler(content)
            //     }
            //   }
            // ],
            neededWorkSkills: neededSkills
          })
          return (
            <DevelopmentPlanContent
              key={learningContent._id}
              {...learningContent}
              onLinkClick={contentId =>
                trackEvent('click', contentId, currentImpression)
              }
              onSelect={() => {
                trackEvent('add-to-plan', content._id, currentImpression)
                developmentPlanHandler(content)
              }}
              inOnboarding
            />
          )
        })}
      {items.length === 0 && <EmptyItem contentList />}
      {items.length > 0 && (
        <div className='onboarding__content-alignment'>
          <Button
            className='el-button onboarding__span-change onboarding__button'
            onClick={() => {
              document.getElementById('stickyHeader').scrollIntoView({
                block: 'center',
                inline: 'nearest',
                behavior: 'smooth'
              })
              setTimeout(() => appendContentSeen(currentImpression), 500)
            }}
          >
            <RefreshButtonChildren />
          </Button>
        </div>
      )}
    </div>

    // <div style={{ width: 400, height: 1350 }}>
    //   <Statement content='Content placeholder' />
    // </div>
  )
}

export default OnboardingContentList
