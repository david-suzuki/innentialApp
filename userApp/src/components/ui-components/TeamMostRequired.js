import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Query } from 'react-apollo'
import { captureFilteredError, LoadingSpinner } from '../general'
import { statsStyle } from '../../styles/statsStyle'
import history from '../../history'
import { DashboardButton, Statement } from './'
import { fetchRequiredSkillsDetails } from '../../api'

const SkillGapNodes = ({ items, maxCount }) => {
  if (items.length === 0)
    return (
      <Statement content='There are no required skills set in any teams yet.' />
    )

  return (
    <>
      {items.map((item, i) => (
        <div
          key={`team-required:${item._id}`}
          className='stats-item-panel-bar-item'
        >
          <div className='stats-item-panel-bar-title'>
            {item.name}{' '}
            <div className='stats-item-panel-bar-badge'>
              <div
                className='stats-item-panel-badge-content__clickable'
                onClick={() =>
                  history.push(`/required-skills/${item._id.split('+')[0]}`)
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
    </>
  )
}

const TeamMostRequired = () => (
  <Query query={fetchRequiredSkillsDetails}>
    {({ loading, data, error }) => {
      if (loading) return <LoadingSpinner />
      if (error) {
        captureFilteredError(error)
        return <Statement content='Oops! Something went wrong' />
      }
      if (data) {
        const items = data.fetchRequiredSkillsDetails

        const maxCount = Math.max(...items.map(item => item.employeesCount))

        return (
          <>
            <SkillGapNodes items={items.slice(0, 7)} maxCount={maxCount} />
            {items.length > 6 && (
              <Link to='/statistics/details/teamRequired'>
                <DashboardButton label='See all' />
              </Link>
            )}
            <style jsx>{statsStyle}</style>
          </>
        )
      }
      return null
    }}
  </Query>
)

export default TeamMostRequired
