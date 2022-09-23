import React from 'react'
import { Query } from 'react-apollo'
import { fetchStatsGrowthData } from '../../../api/'
import history from '../../../history'

const GrowthSection = () => (
  <Query query={fetchStatsGrowthData}>
    {({ data, loading, error }) => {
      if (loading) return <div>Loading...</div>
      if (error) return <div>{`Error! ${error.message}`}</div>
      if (data) {
        const maxSkillsPeopleHaveCount = Math.max(
          ...data.fetchStatsGrowthData.skillsPeopleHave.map(
            item => item.employeesCount
          )
        )
        const maxMostNeededSkillsCount = Math.max(
          ...data.fetchStatsGrowthData.mostNeededSkills.map(
            item => item.employeesCount
          )
        )
        const maxInterestsCount = Math.max(
          ...data.fetchStatsGrowthData.interests.map(
            item => item.employeesCount
          )
        )
        const selectedCount = data.fetchStatsGrowthData.skillsPeopleHave.length
        const neededCount = data.fetchStatsGrowthData.mostNeededSkills.length
        const interestsCount = data.fetchStatsGrowthData.interests.length
        return (
          <>
            <h1 className='stats-view-section-header'>Personal growth</h1>
            <div className='stats-view-wrapper'>
              <div className='stats-item-panel stats-growth-item'>
                <h2 className='stats-item-panel-title'>
                  Skills in organisation
                </h2>
                <div className='stats-item-panel-description'>
                  What skills do people have?
                </div>
                {data.fetchStatsGrowthData.skillsPeopleHave.map(item => (
                  <div key={item._id} className='stats-item-panel-bar-item'>
                    <div className='stats-item-panel-bar-title'>
                      {item.name}{' '}
                      <div className='stats-item-panel-bar-badge'>
                        <div
                          className='stats-item-panel-badge-content__clickable'
                          onClick={() =>
                            history.push(`/skill/${item._id.split(':')[0]}`, {
                              skillName: item.name
                            })
                          }
                        >
                          <i className='icon2-teams' />{' '}
                          <span>{item.employeesCount}</span>
                        </div>
                      </div>
                    </div>
                    <div
                      className='stats-item-panel-bar stats-bar-growth'
                      style={{
                        width: `${(item.employeesCount /
                          maxSkillsPeopleHaveCount) *
                          100}%`
                      }}
                    />
                  </div>
                ))}
                {selectedCount === 4 && (
                  <a
                    className='stats-see-more'
                    onClick={() => {
                      history.push(`/statistics/details/selectedWorkSkills`)
                    }}
                  >
                    See all
                  </a>
                )}
              </div>
              <div className='stats-item-panel stats-growth-item'>
                <h2 className='stats-item-panel-title'>Most wanted skills</h2>
                <div className='stats-item-panel-description'>
                  What skills do people want to learn?
                </div>
                {data.fetchStatsGrowthData.mostNeededSkills.map(item => (
                  <div key={item._id} className='stats-item-panel-bar-item'>
                    <div className='stats-item-panel-bar-title'>
                      {item.name}{' '}
                      <div className='stats-item-panel-bar-badge'>
                        <div
                          className='stats-item-panel-badge-content__clickable'
                          onClick={() =>
                            history.push(`/needed/${item._id.split(':')[0]}`)
                          }
                        >
                          <i className='icon2-teams' />{' '}
                          <span>{item.employeesCount}</span>
                        </div>
                      </div>
                    </div>
                    <div
                      className='stats-item-panel-bar stats-bar-growth'
                      style={{
                        width: `${(item.employeesCount /
                          maxMostNeededSkillsCount) *
                          100}%`
                      }}
                    />
                  </div>
                ))}
                {neededCount === 4 && (
                  <a
                    className='stats-see-more'
                    onClick={() => {
                      history.push(`/statistics/details/neededWorkSkills`)
                    }}
                  >
                    See all
                  </a>
                )}
              </div>
              <div className='stats-item-panel stats-growth-item'>
                <h2 className='stats-item-panel-title'>Interests</h2>
                <div className='stats-item-panel-description'>
                  What interests do people have?
                </div>
                {data.fetchStatsGrowthData.interests.map(item => (
                  <div key={item._id} className='stats-item-panel-bar-item'>
                    <div className='stats-item-panel-bar-title'>
                      {item.name}{' '}
                      <div className='stats-item-panel-bar-badge'>
                        <div
                          className='stats-item-panel-badge-content__clickable'
                          onClick={() =>
                            history.push(`/interest/${item._id.split(':')[0]}`)
                          }
                        >
                          <i className='icon2-teams' />{' '}
                          <span>{item.employeesCount}</span>
                        </div>
                      </div>
                    </div>
                    <div
                      className='stats-item-panel-bar stats-bar-growth'
                      style={{
                        width: `${(item.employeesCount / maxInterestsCount) *
                          100}%`
                      }}
                    />
                  </div>
                ))}
                {interestsCount === 4 && (
                  <a
                    className='stats-see-more'
                    onClick={() => {
                      history.push(`/statistics/details/selectedInterests`)
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

export default GrowthSection
