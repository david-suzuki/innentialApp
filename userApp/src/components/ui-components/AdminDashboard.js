import React, { useState, useEffect, Suspense } from 'react'
import {
  DashboardItem,
  ActionItem,
  Carousel,
  LearningProgress,
  TopInDemand,
  DashboardButton,
  Statement,
  DashboardSelect,
  TeamMostRequired
} from './'
import { AdminRequestsOverview } from '../requests'
import iluHand from '../../static/ilu-hand.svg'
import '../../styles/theme/row.css'
import '../../styles/theme/col.css'
import { useQuery } from 'react-apollo'
import { fetchCurrentUserOrganizationApprovals } from '../../api'

import { Layout } from 'element-react'
import { LoadingSpinner } from '../general'
import OverviewSection from '../stats/components/OverviewSection'
import { statsStyle } from '../../styles/statsStyle'
import StatsSkillGapDetails from '../stats/components/StatsSkillGapDetails'

const TeamInviteAction = ({ onClick, numberOfTeams }) => {
  if (numberOfTeams > 0) return null
  return (
    <ActionItem button='Begin' onButtonClicked={onClick} purpleBackground>
      Invite employees and teams to start!
    </ActionItem>
  )
}

const DraftAction = ({ onClick }) => {
  return (
    <ActionItem button='Review' onButtonClicked={onClick} purpleBackground>
      Your teammates have goals ready
    </ActionItem>
  )
}

const Ilustration = () => (
  <img className='dashboard__ilustration' src={iluHand} alt='Welcome' />
)

const ResourcesLoader = React.lazy(() => import('./MostSelectedResources'))
const ActivityLoader = React.lazy(() => import('./Activity'))
// const RequestsLoader = React.lazy(() =>
//   import('../requests/AdminRequestsOverview')
// )

const AdminDashboard = ({
  displayCarousel,
  displayTeamInvite,
  displayDrafts,
  displayList,

  organizationData,
  organizationId,
  user,
  history,
  teamsIds
}) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [topInDemandIsLoading, setTopInDemandIsLoading] = useState(false)
  // const [activityError, setActivityError] = useState(false)
  // const [loadingActivity, setLoadingActivity] = useState(false)
  const [timeSpanActivity, setTimeSpanActivity] = useState('LAST_WEEK')
  const [info, setInfo] = useState(0)

  const goToTeamCreate = () => {
    history.push('/create/teams')
  }

  const goToDrafts = () => {
    history.push('/goals/approval')
  }

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
      <Layout.Row>
        <Layout.Col span='24' style={{ width: '100%' }}>
          {displayCarousel && (
            <Carousel>
              {displayTeamInvite && (
                <TeamInviteAction
                  onClick={goToTeamCreate}
                  numberOfTeams={teamsIds.length}
                />
              )}
              {displayDrafts && (
                <>
                  <DraftAction onClick={goToDrafts} />
                  <Ilustration />
                </>
              )}
            </Carousel>
          )}
          {displayList && (
            <div style={{ marginBottom: '20px' }}>
              {displayTeamInvite && (
                <TeamInviteAction
                  onClick={goToTeamCreate}
                  numberOfTeams={teamsIds.length}
                />
              )}
              {displayDrafts && (
                <>
                  <DraftAction onClick={goToDrafts} />
                  <Ilustration />
                </>
              )}
            </div>
          )}
        </Layout.Col>
      </Layout.Row>

      <OverviewSection corporate={user.corporate} />

      <Layout.Row gutter='24' type='flex'>
        {organizationData.approvals && (
          <Layout.Col
            style={{
              minWidth,
              flex: '1 2 50%',
              ...(windowWidth > 571 && { maxWidth: '50%' })
            }}
          >
            <DashboardItem title='Budget requests' request info={info}>
              <AdminRequestsOverview
                short
                dashboard
                setInfo={setInfo}
                isAdmin
              />
              {/* <Suspense fallback={<LoadingSpinner />}>
              <RequestsLoader short dashboard />
              {/* <RequestsLoader short dashboard /> */}
              {/* </Suspense> */}
            </DashboardItem>
          </Layout.Col>
        )}

        <Layout.Col
          style={{
            minWidth,
            flex: '1 1 50%',
            ...(windowWidth > 571 && { maxWidth: '50%' })
          }}
        >
          <DashboardItem
            title='Most popular resources'
            description='Types of learning most frequently chosen by employees'
          >
            <Suspense fallback={<LoadingSpinner />}>
              <ResourcesLoader organizationId={organizationId} />
            </Suspense>
          </DashboardItem>
        </Layout.Col>

        {/* <Layout.Col
          style={{
            minWidth,
            flex: '1 2 50%',
            ...(windowWidth > 571 && { maxWidth: '66%' })
          }}
        >
          <DashboardItem title='Learning progress'>
            <div className='dashboard__learning-progress-container'>
              <LearningProgress />
              <DashboardButton />
            </div>
          </DashboardItem>
        </Layout.Col> */}

        <Layout.Col
          style={{
            minWidth,
            width: '100%',
            flex: '2 0 25%',
            ...(windowWidth > 571 && { maxWidth: '50%' })
          }}
        >
          <DashboardItem
            title='Top in-demand skills'
            description='Skills that employees want to learn'
          >
            <TopInDemand
              organizationId={organizationId}
              setIsLoading={setTopInDemandIsLoading}
            />
            {/* {!topInDemandIsLoading && (
              <DashboardButton
                cb={() => {
                  history.push(`/statistics/details/neededWorkSkills`)
                }}
              />
            )} */}
          </DashboardItem>
        </Layout.Col>
        <Layout.Col
          style={{
            minWidth,
            width: '100%',
            flex: '1.5 0 66%'
          }}
        >
          {/* {activityError ? (
            <div style={{ marginTop: '34px' }}>
              <Statement content="Right now, there's not enough data to display the Activity graph..." />
            </div>
          ) : ( */}
          <DashboardItem
            title='Activity'
            description='Overview of learning in the company'
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
              />
            </Suspense>
          </DashboardItem>
          {/* )} */}
        </Layout.Col>
        {/* {user.premium && ( */}
        <Layout.Col
          style={{
            minWidth,
            width: '100%',
            flex: '1 0 50%'
          }}
        >
          <DashboardItem
            title='Team Skill Gap'
            description='The difference between required and available skills in teams'
          >
            <StatsSkillGapDetails short />
          </DashboardItem>
        </Layout.Col>
        {/* )} */}

        {/* {user.premium && ( */}
        <Layout.Col
          style={{
            minWidth,
            width: '100%',
            flex: '1 0 50%'
          }}
        >
          <DashboardItem
            title='Team most required skills'
            description='Most prioritised skills in teams'
          >
            <TeamMostRequired />
          </DashboardItem>
        </Layout.Col>
        {/* )} */}
      </Layout.Row>

      <style jsx>{statsStyle}</style>
    </>
  )
}

export default props => {
  const {
    data: currentUserOrganizationApprovals,
    loading: currentUserOrganizationApprovalsLoading,
    error: currentUserOrganizationApprovalsError
  } = useQuery(fetchCurrentUserOrganizationApprovals)
  if (currentUserOrganizationApprovalsLoading) {
    return <LoadingSpinner />
  } else {
    return (
      <AdminDashboard
        {...props}
        organizationId={
          currentUserOrganizationApprovals.fetchCurrentUserOrganization._id
        }
        organizationData={
          currentUserOrganizationApprovals.fetchCurrentUserOrganization
        }
      />
    )
  }
}
