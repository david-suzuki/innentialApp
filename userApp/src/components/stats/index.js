// import React, { useEffect } from 'react'
// import OverwiewSection from './components/OverviewSection'
// import TeamsSection from './components/TeamsSection'
// import GrowthSection from './components/GrowthSection'
// import { statsStyle } from '../../styles/statsStyle'

// DEPRECATED: MOST FUNCTIONALITY MOVED TO ADMIN DASHBOARD

// const Stats = () => {
//   // useEffect(() => {
//   //   const mainWrapper = document.getElementById('main-wrapper')
//   //   if (mainWrapper.classList.contains('wrapper--right')) {
//   //     mainWrapper.classList.remove('wrapper--right')
//   //   }
//   // }, [])
//   return (
//     <div className='stats-view'>
//       <OverwiewSection />
//       <GrowthSection />
//       <TeamsSection />
//       <style jsx>{statsStyle}</style>
//     </div>
//   )
// }

export { default as StatsDetails } from './components/StatsDetails'
export { default as StatsSkillGapDetails } from './components/StatsSkillGapDetails'
// export default Stats
