import React, { useState, useEffect, Suspense } from 'react'
import { DashboardItem, DashboardSelect } from './'
import { AdminRequestsOverview } from '../requests'
import iluHand from '../../static/ilu-hand.svg'
import '../../styles/theme/row.css'
import '../../styles/theme/col.css'

import { Layout } from 'element-react'
import { LoadingSpinner } from '../general'
import { statsStyle } from '../../styles/statsStyle'
import { useQuery } from 'react-apollo'
import { fetchTeamLeadApprovals } from '../../api'

const ResourcesLoader = React.lazy(() =>
  import('./MostSelectedResourcesForTeams')
)
const ActivityLoader = React.lazy(() => import('./Activity'))

const LeaderDashboard = ({ leaderId, organizationData }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [timeSpanActivity, setTimeSpanActivity] = useState('LAST_WEEK')
  const [info, setInfo] = useState(0)

  const handleResize = () => {
    setWindowWidth(window.innerWidth)
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const selectStateActivity = val => {
    setTimeSpanActivity(val)
  }

  const minWidth = '270px'

  return (
    <>
      <Layout.Row gutter='24' type='flex'>
        {organizationData.teamLeadApprovals && (
          <Layout.Col
            style={{
              minWidth,
              flex: '1 2 50%',
              ...(windowWidth > 571 && { maxWidth: '50%' })
            }}
          >
            <DashboardItem title='Budget requests' request info={info}>
              <AdminRequestsOverview short dashboard setInfo={setInfo} />
              {/* <Suspense fallback={<LoadingSpinner />}>
              <RequestsLoader short dashboard />
              {/* <RequestsLoader short dashboard /> */}
              {/* </Suspense> */}
            </DashboardItem>
          </Layout.Col>
        )}

        {
          <Layout.Col
            style={{
              minWidth,
              flex: '1 1 50%',
              ...(windowWidth > 571 && { maxWidth: '50%' })
            }}
          >
            <DashboardItem
              title='Most popular resources'
              description='Types of learning most frequently chosen by team members'
            >
              <Suspense fallback={<LoadingSpinner />}>
                <ResourcesLoader leaderId={leaderId} />
              </Suspense>
            </DashboardItem>
          </Layout.Col>
        }

        {
          <Layout.Col
            style={{
              minWidth,
              width: '100%',
              flex: '1.5 0 66%'
            }}
          >
            <DashboardItem
              title='Activity'
              description='Overview of learning among the team members'
            >
              <Suspense fallback={<LoadingSpinner />}>
                <div
                  className='dashboard-select__activity-container'
                  // style={{ display: loadingActivity ? 'none' : 'block' }}
                >
                  <DashboardSelect selectState={selectStateActivity} />
                </div>

                <ActivityLoader
                  // setActivityError={setActivityError}
                  // setLoadingActivity={setLoadingActivity}
                  timeSpan={timeSpanActivity}
                  isAdmin={false}
                  leaderId={leaderId}
                />
              </Suspense>
            </DashboardItem>
            {/* )} */}
          </Layout.Col>
        }
      </Layout.Row>

      <style jsx>{statsStyle}</style>
    </>
  )
}

export default props => {
  const { data, loading, error } = useQuery(fetchTeamLeadApprovals)
  if (loading) {
    return <LoadingSpinner />
  } else {
    return (
      <LeaderDashboard
        {...props}
        organizationData={data.fetchCurrentUserOrganization}
      />
    )
  }
}
