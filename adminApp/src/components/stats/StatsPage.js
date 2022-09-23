import React, { Component } from 'react'
import { Tabs } from 'element-react'
import { SkillContentTable, AllSkillStats } from './'
export default class StatsPage extends Component {
  render() {
    return (
      <Tabs type='card' activeName='1'>
        <Tabs.Pane label='Needed Skills' name='1'>
          <AllSkillStats />
        </Tabs.Pane>
        <Tabs.Pane label='Needed Skills Content' name='2'>
          <SkillContentTable />
        </Tabs.Pane>
      </Tabs>
    )
  }
}
