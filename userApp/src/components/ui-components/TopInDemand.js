import React from 'react'
import history from '../../history'
import { useQuery } from '@apollo/react-hooks'
import { statsStyle } from '../../styles/statsStyle'
import { DashboardButton, Statement } from '.'
import { fetchTopInDemandSkills } from '../../api'
import { captureFilteredError, LoadingSpinner } from '../general'
import { Link } from 'react-router-dom'

const TopInDemand = ({ organizationId, setIsLoading }) => {
  const { data, loading, error } = useQuery(fetchTopInDemandSkills, {
    variables: { organizationId },
    fetchPolicy: 'cache-and-network'
  })

  if (loading) {
    // setIsLoading(true)
    return <LoadingSpinner />
  }

  if (error) {
    captureFilteredError(error)
    return <Statement content='Oops! Something went wrong' />
  }

  if (data) {
    if (data?.fetchTopInDemandSkills?.mostNeededSkills.length === 0) {
      return (
        <div className='skills-list__placeholder'>
          Not enough data to display Top in-demand skills
        </div>
      )
    }

    // setIsLoading(false)
    const maxMostNeededSkillsCount =
      data?.fetchTopInDemandSkills?.mostNeededSkills.reduce((acc, curr) => {
        return Math.max(curr.employeesCount, acc)
      }, 1) || 4
    return (
      <div
        className='stats-item-panel stats-growth-item'
        style={{ boxShadow: 'none', padding: '12px 0' }}
      >
        <div>
          {data?.fetchTopInDemandSkills?.mostNeededSkills
            .slice(0, 6)
            .map(item => (
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
                    width: `${(item.employeesCount / maxMostNeededSkillsCount) *
                      100}%`
                  }}
                />
              </div>
            ))}
        </div>
        {data?.fetchTopInDemandSkills?.mostNeededSkills.length > 6 && (
          <Link to='/statistics/details/neededWorkSkills'>
            <DashboardButton label='See all' />
          </Link>
        )}
      </div>
    )
  }
}

export default React.memo(TopInDemand)
