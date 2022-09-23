import React, { useState } from 'react'
import {
  TabsList,
  Tabs,
  TabContent,
  Tab,
  LearningProgressItem,
  DashboardSelect
} from './'

const LearningProgress = () => {
  const [timeSpan, setTimeSpan] = useState('LAST_WEEK')
  const usersMockData = [
    { name: 'Diane Russel', resources: null, status: null },
    { name: 'Cody Fischer', resources: '0/3', status: 'Not started' },
    { name: 'Ronald Richards', resources: '1/3', status: 'In progress' },
    { name: 'Floyd Miles', resources: '1/3', status: 'In progress' }
  ]

  const teamsMockData = [
    { name: 'IT', resources: null, status: null },
    { name: 'HR', resources: '10/20', status: 'In progress' },
    { name: 'Product', resources: '5/16', status: 'In progress' },
    { name: 'Marketing', resources: '7/26', status: 'In progress' }
  ]
  const selectState = val => {
    setTimeSpan(val)
  }
  return (
    <div>
      <DashboardSelect learningProgress selectState={selectState} />

      <Tabs>
        <TabsList>
          <Tab>By Person</Tab>
          <Tab>By Team</Tab>
        </TabsList>
        <TabContent>
          {usersMockData.map(user => (
            <LearningProgressItem entity={user} key={user.name} showPicture />
          ))}
        </TabContent>

        <TabContent>
          {teamsMockData.map(team => (
            <LearningProgressItem entity={team} key={team.name} />
          ))}
        </TabContent>
      </Tabs>
    </div>
  )
}

export default LearningProgress
