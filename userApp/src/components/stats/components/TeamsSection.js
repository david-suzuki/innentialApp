import React from 'react'
import { Query } from 'react-apollo'
import SkillGapsChart from '../../ui-components/SkillGapChart'
import { fetchStatsTeamsData } from '../../../api'
import history from '../../../history'

const TeamsSection = () => (
  <Query query={fetchStatsTeamsData}>
    {({ data, loading, error }) => {
      if (loading) return <div>Loading...</div>
      if (error) return <div>{`Error! ${error.message}`}</div>
      if (data) {
        const maxCount = Math.max(
          ...data.fetchStatsTeamsData.mostRequiredSkills.map(
            item => item.employeesCount
          )
        )
        return (
          <>
            <h1 className='stats-view-section-header'>Teams</h1>
            <div className='stats-view-wrapper'>
              <div className='stats-item-panel stats-teams-item'>
                <h2 className='stats-item-panel-title'>Skill gap</h2>
                <div className='stats-item-panel-description'>
                  What is the difference between skills available and needed in
                  teams now?
                </div>
                {data.fetchStatsTeamsData.teamsSkillGap.map((item, i) => (
                  <div
                    className='stats-item-panel-team-container'
                    key={`skillGap${i}`}
                  >
                    <div className='stats-item-panel-team-name'>
                      <a onClick={() => history.push(`/team/${item._id}`)}>
                        {item.teamName}
                      </a>
                      <span className='stats-item-panel-team-count'>
                        <i className='icon icon2-teams' />
                        {'  '}
                        {item.teamMemberCount}
                      </span>
                    </div>
                    <div className='stats-item-panel-team-chart'>
                      <SkillGapsChart
                        skills={{
                          needed: item.neededSkills,
                          available: item.availableSkills
                        }}
                        labels={item.neededSkillsNames}
                        maxLabelLength={15}
                      />
                    </div>
                  </div>
                ))}
                {data.fetchStatsTeamsData.teamsSkillGap.length === 2 && (
                  <a
                    className='stats-see-more'
                    onClick={() => {
                      history.push(`/statistics/skill-gap`)
                    }}
                  >
                    See all
                  </a>
                )}
              </div>
              <div className='stats-item-panel stats-teams-item'>
                <h2 className='stats-item-panel-title'>
                  Most required skills now
                </h2>
                <div className='stats-item-panel-description'>
                  What skills are missing and should be prioritised to acquire?
                </div>
                {data.fetchStatsTeamsData.mostRequiredSkills.map(item => (
                  <div key={item.name} className='stats-item-panel-bar-item'>
                    <div className='stats-item-panel-bar-title'>
                      {item.name}{' '}
                      <div className='stats-item-panel-bar-badge'>
                        <div
                          className='stats-item-panel-badge-content__clickable'
                          onClick={() =>
                            history.push(
                              `/required-skills/${item._id.split('+')[0]}`
                            )
                          }
                        >
                          <span>{item.employeesCount}</span>
                        </div>
                      </div>
                    </div>
                    <div
                      className='stats-item-panel-bar stats-bar-teams'
                      style={{
                        width: `${(item.employeesCount / maxCount) * 100}%`
                      }}
                    />
                  </div>
                ))}
                {data.fetchStatsTeamsData.mostRequiredSkills.length === 0 && (
                  <p>There are no required skills set in any teams yet.</p>
                )}
                {data.fetchStatsTeamsData.mostRequiredSkills.length === 8 && (
                  <a
                    className='stats-see-more'
                    onClick={() => {
                      history.push(`/statistics/details/teamRequired`)
                    }}
                  >
                    See all
                  </a>
                )}
              </div>
            </div>
          </>
        )
      }
      return null
    }}
  </Query>
)

export default TeamsSection
