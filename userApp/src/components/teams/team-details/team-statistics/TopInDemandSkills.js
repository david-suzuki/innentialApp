import React from 'react'
import { Button } from 'element-react'
import history from '../../../../history'
import { statsStyle } from '../../../../styles/statsStyle'
import { useQuery } from '@apollo/react-hooks'
import { fetchTopInDemandSkillsForTeam } from '../../../../api'
import { captureFilteredError, LoadingSpinner } from '../../../general'
import { Link } from 'react-router-dom'
import { Statement } from '../../../ui-components'

const TopInDemandSkills = ({ teamId }) => {
  const maxSkills = 3

  const { data, loading, error } = useQuery(fetchTopInDemandSkillsForTeam, {
    variables: { teamId },
    fetchPolicy: 'cache-and-network'
  })

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    captureFilteredError(error)
    return <Statement content='Oops! Something went wrong' />
  }

  if (data) {
    if (data?.fetchTopInDemandSkillsForTeam?.mostNeededSkills.length === 0) {
      return (
        <div className='skills-list__placeholder'>
          Not enough data to display Top in-demand skills
          <style jsx>{statsStyle}</style>
        </div>
      )
    }

    // setIsLoading(false)
    const maxMostNeededSkillsCount =
      data?.fetchTopInDemandSkillsForTeam?.mostNeededSkills.reduce(
        (acc, curr) => {
          return Math.max(curr.employeesCount, acc)
        },
        1
      ) || 4
    return (
      <div
        className='stats-item-panel stats-growth-item'
        style={{ boxShadow: 'none', padding: '12px 10px' }}
      >
        <div>
          {data?.fetchTopInDemandSkillsForTeam?.mostNeededSkills
            .slice(0, maxSkills)
            .map(item => (
              <div key={item._id} className='stats-item-panel-bar-item'>
                <div className='stats-item-panel-bar-title'>
                  {item.name}{' '}
                  <div className='stats-item-panel-bar-badge'>
                    <div
                      className='stats-item-panel-badge-content__clickable'
                      onClick={() =>
                        history.push(
                          `/needed/${item._id.split(':')[0]}?team=${teamId}`
                        )
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
                    width: `${(item.employeesCount / maxMostNeededSkillsCount) *
                      100}%`
                  }}
                />
              </div>
            ))}
        </div>
        {data?.fetchTopInDemandSkillsForTeam?.mostNeededSkills.length >
          maxSkills && (
          <Link to={`/statistics/details/neededWorkSkills?team=${teamId}`}>
            <div className='dashboard__button-container'>
              <Button type='secondary' size='small' plain onClick={() => null}>
                <span className='dashboard__button'>See all</span>
              </Button>
            </div>
          </Link>
        )}
        <style jsx>{statsStyle}</style>
      </div>
    )
  }
}

const TopInDemandSkillsWrapper = ({ teamId }) => {
  return (
    <div className='team-stats-item__wrapper'>
      <div className='team-stats-item__header'>Top in-demand skills</div>
      <div className='team-stats-item__action' />
      <div className='team-stats-item'>
        <TopInDemandSkills teamId={teamId} />
      </div>
    </div>
  )
}

export default React.memo(TopInDemandSkillsWrapper)
