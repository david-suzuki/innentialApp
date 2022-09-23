import React, { useEffect } from 'react'
// import { Tabs, TabsList, Tab, TabContent } from './Tabs'
import {
  DevelopmentPlanContentList,
  DevelopmentPlanMentorList,
  Statement
} from './'
import history from '../../history'
// import EmptyGoal from './EmptyGoal'
import NextSteps from './NextSteps'

export default ({
  content = [],
  mentors = [],
  setContentStatusMutation,
  canRecommend,
  selectedGoal,
  children,
  prev = {},
  setLibraryHighlight,
  setHighlightCompleted,
  developmentPlanSet
}) => {
  useEffect(() => {
    const appContainer = document.getElementById('app-container')
    const mainWrapper = document.getElementById('main-wrapper')

    if (content.length === 0 && !selectedGoal) {
      appContainer && appContainer.classList.remove('dashboard-wrapper')

      mainWrapper && mainWrapper.classList.remove('dashboard-wrapper')
    } else {
      appContainer &&
        !appContainer.classList.contains('dashboard-wrapper') &&
        appContainer.classList.add('dashboard-wrapper')

      mainWrapper &&
        !mainWrapper.classList.contains('dashboard-wrapper') &&
        mainWrapper.classList.add('dashboard-wrapper')
    }
  }, [content, document])

  if (content.length > 0) {
    return (
      <div className='development-plan__container'>
        <DevelopmentPlanContentList
          content={content}
          inManagement
          // neededSkills={neededSkills}
          setContentStatusMutation={setContentStatusMutation}
          canRecommend={canRecommend}
          children={children}
          setLibraryHighlight={setLibraryHighlight}
          setHighlightCompleted={setHighlightCompleted}
          pathId={selectedGoal?.fromPath?._id}
          selectedGoalId={selectedGoal?._id}
        />
        {mentors.length > 0 && (
          <DevelopmentPlanMentorList mentors={mentors} inManagement />
        )}
      </div>
    )
  } else if (selectedGoal) {
    return (
      <div className='development-plan__container'>
        <Statement content='All content has been skipped!' />
      </div>
    )
  }

  return <NextSteps developmentPlanSet={developmentPlanSet} />
}
