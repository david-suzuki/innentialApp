import React, { useState, useEffect } from 'react'
import { DevelopmentPlanContent, EmptyItem } from './'
import { remapLearningContentForUI } from './utils'
import { useTracker } from '../../utils'
import { useHistory } from 'react-router-dom'
import arrowIcon from '../../static/arrow-small.svg'
import Container from '../../globalState'
// import { TotalDuration } from '.'

const NewSettingSelectionList = ({ neededSkills }) => {
  const trackEvent = useTracker()

  const {
    developmentPlan,
    setDevelopmentPlan
    // filters: { maxDuration }
  } = Container.useContainer()

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

  const history = useHistory()

  return (
    <div
      className='onboarding__learning-items-selected'
      style={{ padding: 'unset' }}
    >
      <div style={{ display: 'flex' }}>
        <div
          style={{
            width: '24px',
            cursor: 'pointer',
            display: 'none'
          }}
        >
          <img src={arrowIcon} className='onboarding__learning-back-arrow' />
        </div>

        <h3
          style={{
            fontWeight: '900',
            padding: '5% 0 77px'
          }}
        >
          Your own Learning Path
        </h3>
      </div>
      {developmentPlan.length === 0 ? (
        <EmptyItem />
      ) : (
        developmentPlan.map(content => {
          const learningContent = remapLearningContentForUI({
            content,
            neededWorkSkills: neededSkills
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
            />
          )
        })
      )}
    </div>
  )
}

export default NewSettingSelectionList
