import React, { useEffect } from 'react'
import { ManageGoals } from './goals'
import { withRouter } from 'react-router-dom'

// const tabs = {
//   draft: 0,
//   active: 1,
//   completed: 2,
//   approval: 3
//   // team: 4
// }

const Goals = ({ currentUser }) => {
  // useEffect(() => {
  //   const mainWrapper = document.getElementById('main-wrapper')
  //   const tabsHeader = document.getElementById('tabsHeader')

  //   if (
  //     !mainWrapper.classList.contains('wrapper--right') ||
  //     !tabsHeader.classList.contains('content--right')
  //   ) {
  //     mainWrapper.className = 'container-main__wrapper wrapper--right'
  //     tabsHeader.className = 'tabs-header__content content--right'
  //   }

  //   const clearClasses = (main, tabs) => {
  //     main.className = 'container-main__wrapper'
  //     tabs.className = 'tabs-header__content'
  //   }

  //   return () => clearClasses(mainWrapper, tabsHeader)
  // })
  // const fromDraft = state && state.dashboardPlan

  // const seeTeamGoals =
  //   currentUser &&
  //   (currentUser.roles.indexOf('ADMIN') !== -1 || currentUser.leader)

  // const searchStrings = search && search.split('?')[1].split('&')
  // const tabSearch =
  //   searchStrings && searchStrings.find(str => str.indexOf('tab') === 0)
  // let activeIndex = (tabSearch && tabs[tabSearch.split('=')[1]]) || 0

  // if (activeIndex === 4 && !seeTeamGoals) activeIndex = 0

  return (
    <ManageGoals
      currentUser={currentUser}
      // fromDraft={fromDraft}
      // activeIndex={activeIndex}
    />
  )
}

export default Goals
