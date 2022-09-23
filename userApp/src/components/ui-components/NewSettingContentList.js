import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-apollo'
import { fetchContentForNextStepPlan } from '../../api'
import { Statement, DevelopmentPlanContent, EmptyItem } from './'
import { remapLearningContentForUI } from './utils'
import { useTracker } from '../../utils'
import { Button } from 'element-react'
import loadingCurl from '../../static/loading-curl.svg'
import Container from '../../globalState'
import { LoadingSpinner } from '../general'
// import StickyHeader from './StickyHeader'

const Refresh = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='14'
      height='14'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      style={{ marginLeft: '5px' }}
    >
      <polyline points='1 4 1 10 7 10' />
      <polyline points='23 20 23 14 17 14' />
      <path d='M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15' />
    </svg>
  )
}

const NewSettingContentList = ({ neededSkills }) => {
  const {
    filters,
    contentSeen,
    developmentPlan,
    setDevelopmentPlan,
    setContentSeen
  } = Container.useContainer()

  const appendContentSeen = impression => {
    setContentSeen([...contentSeen, ...impression])
  }

  const isSelected = ({ _id }) => {
    return developmentPlan.some(({ _id: contentId }) => contentId === _id)
  }

  const developmentPlanHandler = content => {
    setDevelopmentPlan(
      !isSelected(content)
        ? [content, ...developmentPlan]
        : [...developmentPlan.filter(({ _id }) => _id !== content._id)]
    )
  }

  const [currentImpression, setCurrentImpression] = useState([])

  const trackEvent = useTracker()

  const { data, loading, error } = useQuery(fetchContentForNextStepPlan, {
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
      const impression = data.fetchContentForNextStepPlan.map(item => item._id)
      setCurrentImpression(impression)
    }
  }, [data, setCurrentImpression])

  useEffect(() => {
    if (!loading && data) {
      // If all content is in the development plan, fetch more items
      const remainingItems = data.fetchContentForNextStepPlan.filter(
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
      const remainingItems = data.fetchContentForNextStepPlan
      if (remainingItems.length === 0) {
        setContentSeen([])
      }
    }
  }, [data, setContentSeen])

  if (loading) {
    return (
      <div
        className='onboarding__learning-items-available'
        style={{ textAlign: 'left' }}
      >
        <div style={{ padding: '5% 0' }}>
          <h3 style={{ fontWeight: '900', marginBottom: '6%' }}>
            Recommendations
          </h3>
          <div className='onboarding__content-alignment'>
            <Button type='primary' disabled>
              Show me something else
              <Refresh />
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
          <LoadingSpinner />
        </div>
        <div className='onboarding__content-alignment'>
          <Button type='primary' disabled>
            Show me something else
            <Refresh />
          </Button>
        </div>
      </div>
    )
  }

  if (error) {
    return <Statement content='Oops! Something went wrong.' />
  }

  const items = (data && data.fetchContentForNextStepPlan) || []

  return (
    <div
      className='onboarding__learning-items-available'
      style={{ textAlign: 'left' }}
    >
      <div style={{ padding: '5% 0' }}>
        <div
          id='stickyHeader'
          style={{ justifyContent: 'space-between', display: 'flex' }}
        >
          <h3 style={{ fontWeight: '900' }}>Recommendations</h3>
          {/* <h4 className='sticky-header__link'>
            {developmentPlan.length > 0 ? (
              <Button type="text">{`${developmentPlan.length} selected`}</Button>
            ) : (
              'Nothing selected'
            )}
          </h4> */}
        </div>
      </div>
      {items.length > 0 && (
        <>
          <div className='onboarding__content-alignment button-alignment'>
            <Button
              type='primary'
              onClick={() => appendContentSeen(currentImpression)}
            >
              Show me something else
              <Refresh />
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
            />
          )
        })}
      {items.length === 0 && <EmptyItem contentList />}
      {items.length > 0 && (
        <div className='onboarding__content-alignment'>
          <Button
            type='primary'
            onClick={() => {
              document.getElementById('stickyHeader').scrollIntoView({
                block: 'center',
                inline: 'nearest',
                behavior: 'smooth'
              })
              setTimeout(() => appendContentSeen(currentImpression), 500)
            }}
          >
            Show me something else
            <Refresh />
          </Button>
        </div>
      )}
    </div>

    // <div style={{ width: 400, height: 1350 }}>
    //   <Statement content='Content placeholder' />
    // </div>
  )
}

export default NewSettingContentList
