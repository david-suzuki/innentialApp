import React from 'react'
import ProgressTable from './ProgressTable'
import { DashboardItem } from '../../../ui-components'
import TeamStatsStyle from './styles'
import { Layout } from 'element-react'
import TopInDemandSkills from './TopInDemandSkills'
import Activity from './Activity'

const TeamStatistics = ({ teamId }) => {
  return (
    <div className='team-statistics-container'>
      <ProgressTable teamId={teamId} />
      <div className='team-statistics__row'>
        <TopInDemandSkills teamId={teamId} />
        <Activity teamId={teamId} />
      </div>
      <style jsx global>
        {TeamStatsStyle}
      </style>
    </div>
  )
}

export default TeamStatistics
