import React from 'react'
import { TeamItem, Statement } from './'

const TeamItems = ({ items, teamDropdownOptions }) => {
  if (items.length === 0) {
    return null
  } else
    return items.map((team, index) => {
      return (
        <TeamItem
          department={team.department}
          engagement={team.engagement}
          engagementArrow={team.engagementArrow}
          stage={team.stage}
          count={team.count}
          chart={team.chart}
          key={`${team._id}${index}`}
          teamNumber={index + 1}
          teamId={team.id}
          children={team.children}
          dropdownOptions={teamDropdownOptions}
        />
      )
    })
}

TeamItems.defaultProps = {
  items: [
    {
      teamId: '1',
      department: 'Marketing',
      engagement: '6.4',
      engagementArrow: '',
      stage: '2',
      count: '4',
      chart: true
    },
    {
      teamId: '2',
      department: 'Sales',
      engagement: '6.0',
      engagementArrow: 'icon-diag-bottom-right',
      stage: '1',
      count: '10',
      chart: false
    },
    {
      teamId: '3',
      department: 'Customer Service',
      engagement: '5.9',
      engagementArrow: 'icon-diag-top-right',
      stage: '3',
      count: '8',
      chart: true
    }
  ]
}

export default TeamItems
