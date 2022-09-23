import React from 'react'
import { Query } from 'react-apollo'
import { fetchStatsOverviewData } from '../../../api/'
import { captureFilteredError, LoadingSpinner } from '../../general'
import { Layout } from 'element-react'
import { Statement } from '../../ui-components'

const OverviewSection = ({ corporate }) => {
  return (
    <>
      <Layout.Row>
        <Layout.Col span='24' style={{ width: '100%' }}>
          <h3 className='dashboard-item__title'>Overview</h3>
        </Layout.Col>
      </Layout.Row>
      <Query query={fetchStatsOverviewData} fetchPolicy='cache-and-network'>
        {({ data, loading, error }) => {
          if (loading) return <LoadingSpinner />
          if (error) {
            captureFilteredError(error)
            return <Statement content='Oops! Something went wrong.' />
          }
          if (data)
            return (
              <Layout.Row gutter='24' type='flex'>
                <Layout.Col
                  style={{
                    minWidth: '271px',
                    flex: '1.5 1 33%'
                  }}
                >
                  <div className='stats-overview-item'>
                    <div className='stats-overview-item-count-wrapper stats-overview-employees'>
                      <div className='stats-overview-item-circle'>
                        <i className='icon2-users' />
                      </div>
                      <div className='stats-overview-item-count'>
                        {data.fetchStatsOverviewData.employees}
                      </div>
                      {data.fetchStatsOverviewData.newEmployees > 0 && (
                        <div className='stats-overview-new-count'>
                          (
                          <span>
                            +{data.fetchStatsOverviewData.newEmployees}
                          </span>{' '}
                          this month)
                        </div>
                      )}
                    </div>
                    <div className='stats-overview-item-label align-left'>
                      Employees in the organization
                    </div>
                  </div>
                </Layout.Col>
                <Layout.Col
                  style={{
                    minWidth: '271px',
                    flex: '1.5 1 33%'
                  }}
                >
                  <div className='stats-overview-item'>
                    <div className='stats-overview-item-count-wrapper stats-overview-teams'>
                      <div className='stats-overview-item-circle'>
                        <i className='icon2-teams' />
                      </div>
                      <div className='stats-overview-item-count'>
                        {data.fetchStatsOverviewData.teams}
                      </div>
                      {data.fetchStatsOverviewData.newTeams > 0 && (
                        <div className='stats-overview-new-count'>
                          (<span>+{data.fetchStatsOverviewData.newTeams}</span>{' '}
                          this month)
                        </div>
                      )}
                    </div>
                    <div className='stats-overview-item-label align-left'>
                      Teams in the organization
                    </div>
                  </div>
                </Layout.Col>
                {corporate && (
                  <Layout.Col
                    style={{
                      minWidth: '271px',
                      flex: '1.5 1 33%'
                    }}
                  >
                    <div className='stats-overview-item'>
                      <div className='stats-overview-item-count-wrapper stats-overview-skills'>
                        <div className='stats-overview-item-circle'>
                          <i className='icon icon-exchange' />
                        </div>
                        <div className='stats-overview-item-count'>
                          {data.fetchStatsOverviewData.feedback}
                        </div>
                        {data.fetchStatsOverviewData.newFeedback > 0 && (
                          <div className='stats-overview-new-count'>
                            (
                            <span>
                              +{data.fetchStatsOverviewData.newFeedback}
                            </span>{' '}
                            this month)
                          </div>
                        )}
                      </div>
                      <div className='stats-overview-item-label align-left'>
                        Feedback given in the organization
                      </div>
                    </div>
                  </Layout.Col>
                )}
              </Layout.Row>
            )
          return null
        }}
      </Query>
    </>
  )
}

export default OverviewSection
