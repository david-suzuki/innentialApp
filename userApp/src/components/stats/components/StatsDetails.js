import React from 'react'
import { withRouter, Redirect } from 'react-router-dom'
import { fetchGrowthDetails, fetchRequiredSkillsDetails } from '../../../api'
import { Query } from 'react-apollo'
import { captureFilteredError, LoadingSpinner } from '../../general'
import { statsStyle } from '../../../styles/statsStyle'
import history from '../../../history'
import { FormDescription, List } from '../../ui-components'

const titles = {
  selectedWorkSkills: 'Skills in organization',
  neededWorkSkills: 'Top in-demand skills',
  selectedInterests: 'Interests',
  teamRequired: 'Team most required skills',
  default: 'Skills in organization'
}

const descriptions = {
  selectedWorkSkills: 'What skills do people have?',
  neededWorkSkills: 'What skills do people want to learn?',
  selectedInterests: 'What interests do people have?',
  teamRequired: 'What skills are most prioritised in teams?',
  default: 'What skills do people have?'
}

const routes = {
  selectedWorkSkills: 'skill',
  neededWorkSkills: 'needed',
  selectedInterests: 'interest',
  teamRequired: 'required-skills'
}

export default withRouter(
  ({
    match: {
      params: { key }
    },
    location: { search }
  }) => {
    const params = new URLSearchParams(search)

    const teamId = params.get('team')

    let queryName, variables, queryDoc, barClassName, showIcon
    if (key === 'teamRequired') {
      queryName = 'fetchRequiredSkillsDetails'
      queryDoc = fetchRequiredSkillsDetails
      barClassName = 'stats-bar-teams'
      showIcon = false
    } else {
      queryName = 'fetchGrowthDetails'
      variables = { key, teamId }
      queryDoc = fetchGrowthDetails
      barClassName = 'stats-bar-growth'
      showIcon = true
    }

    return (
      <Query query={queryDoc} variables={variables}>
        {({ loading, data, error }) => {
          if (loading) return <LoadingSpinner />
          if (error) {
            captureFilteredError(error)
            return <Redirect to='/' />
          }
          if (data) {
            const items = data[queryName]
            const max = Math.max(...items.map(item => item.employeesCount))
            if (items && items.length > 0) {
              return (
                <div>
                  <div className='page-heading'>
                    <i
                      className='page-heading__back__button icon icon-small-right icon-rotate-180'
                      onClick={e => {
                        e.preventDefault()
                        history.goBack()
                      }}
                    />
                    <div className='page-heading-info'>
                      <h1>{titles[key] || titles.default}</h1>
                    </div>
                  </div>
                  <List>
                    <p className='grey-small'>
                      {descriptions[key] || descriptions.default}
                    </p>
                    <br />
                    {/* <FormDescription
                        label={titles[key] || titles.default}
                        description={descriptions[key] || descriptions.default}
                      /> */}
                    {items.map(item => (
                      <div key={item._id} className='stats-item-panel-bar-item'>
                        <div className='stats-item-panel-bar-title'>
                          {item.name}{' '}
                          <div className='stats-item-panel-bar-badge'>
                            {routes[key] ? (
                              <div
                                className='stats-item-panel-badge-content__clickable'
                                onClick={() => {
                                  let realId
                                  if (item._id.indexOf('+') !== -1) {
                                    realId = item._id.split('+')[0]
                                  } else realId = item._id.split(':')[0]
                                  history.push(
                                    `/${routes[key]}/${realId}${
                                      teamId ? `?team=${teamId}` : ''
                                    }`,
                                    {
                                      skillName: item.name
                                    }
                                  )
                                }}
                              >
                                <i className='icon2-teams' />{' '}
                                <span>{item.employeesCount}</span>
                              </div>
                            ) : (
                              <div className='stats-item-panel-badge-content'>
                                {showIcon && <i className='icon2-teams' />}{' '}
                                <span>{item.employeesCount}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div
                          className={`stats-item-panel-bar ${barClassName}`}
                          style={{
                            width: `${(item.employeesCount / max) * 100}%`
                          }}
                        />
                      </div>
                    ))}
                  </List>
                  <style jsx>{statsStyle}</style>
                </div>
              )
            } else return <Redirect to='/' />
          }
          return <Redirect to='/' />
        }}
      </Query>
    )
  }
)
