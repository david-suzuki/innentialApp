import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { fetchSkillGapDetails } from '../../../api'
import { Query } from 'react-apollo'
import { captureFilteredError, LoadingSpinner } from '../../general'
import { statsStyle } from '../../../styles/statsStyle'
import history from '../../../history'
import {
  DashboardButton,
  FormDescription,
  Statement,
  List
} from '../../ui-components'
import SkillGapsChart from '../../ui-components/SkillGapChart'

const SkillGapNodes = ({ items, short }) => {
  if (items.length === 0)
    return <Statement content='No skill gap data to display' />

  return (
    <>
      {/* <p className="grey-small" style={{ padding: '0 22px' }}>
        What is the difference between skills available and needed in teams now?
      </p>
      <br /> */}
      {items.map((item, i) => (
        <div className='stats-item-panel-team-container' key={`skillGap${i}`}>
          <div className='stats-item-panel-team-name'>
            <Link to={`/team/${item._id}`}>{item.teamName}</Link>
            {/* <a onClick={() => history.push(`/team/${item._id}`)}>
                        </a> */}
            <span className='stats-item-panel-team-count'>
              <i className='icon icon2-teams' />
              {'  '}
              {item.teamMemberCount}
            </span>
          </div>
          <div
            className='stats-item-panel-team-chart'
            style={{ maxWidth: short ? '280px' : '500px' }}
          >
            <SkillGapsChart
              skills={{
                needed: item.neededSkills,
                available: item.availableSkills
              }}
              labels={item.neededSkillsNames}
              maxLabelLength={short ? 8 : 20}
            />
          </div>
        </div>
      ))}
    </>
  )
}

const StatsSkillGapDetails = ({ short }) => (
  <>
    <Query query={fetchSkillGapDetails}>
      {({ loading, data, error }) => {
        if (loading) return <LoadingSpinner />
        if (error) {
          captureFilteredError(error)
          return <Statement content='Oops! Something went wrong' />
        }
        if (data) {
          const items = data.fetchSkillGapDetails
          if (!short) {
            return (
              <>
                <div className='page-heading'>
                  <i
                    className='page-heading__back__button icon icon-small-right icon-rotate-180'
                    type='signin'
                    size='large'
                    onClick={e => {
                      e.preventDefault()
                      history.goBack()
                    }}
                  />
                  <div className='page-heading-info'>
                    <h1>Team Skill Gap</h1>
                  </div>
                </div>
                <List>
                  <SkillGapNodes items={items} />
                </List>
              </>
            )
          } else {
            return (
              <>
                <SkillGapNodes items={items.slice(0, 2)} short />
                {items.length > 2 && (
                  <Link to='/statistics/skill-gap'>
                    <DashboardButton label='See all' />
                  </Link>
                )}
              </>
            )
          }
        }
        return null
      }}
    </Query>
    <style jsx>{statsStyle}</style>
  </>
)

export default StatsSkillGapDetails
