import React from 'react'
import {
  List,
  TeamHeading,
  UserItem,
  Tab,
  TabsList,
  TabContent,
  Tabs,
  UserItems,
  ProfileFeedbackChart
} from '../../ui-components'
import { LoadingSpinner } from '../../general'
// import { generateInitialsAvatar } from '$/utils'
import teamDetailsStyle from '../../../styles/teamDetailsStyle'
import listStyle from '../../../styles/listStyle'
import { SkillGapTab, TeamFeedbackChart } from './'
import { RouteManager } from '../../../utils'
import { remapEmployeesForUI } from '../_teamUtils'
import { ProfileFeedbackList } from '../../team-evaluate'
import { Link, useHistory } from 'react-router-dom'
import { Button, Pagination } from 'element-react'

const TeamDetailsMember = ({
  team,
  user,
  membersPage,
  teamMembers,
  totalMembers,
  membersLoading,
  handleMembersPageChange
}) => {
  const { leader, _id, teamName } = team
  const { premium, corporate, _id: currentUserId } = user
  const members = teamMembers

  const history = useHistory()

  const userDropdownOptions =
    premium && corporate
      ? [
          {
            value: 'Give feedback',
            boundFunction: (id, name) =>
              history.push('/evaluate-employee', {
                userId: id,
                fullName: name,
                redirect: `/profiles/${id}`
              })
          }
        ]
      : []

  const tabsNames = ['Members', 'Skills', corporate && 'Feedback'].filter(
    item => !!item
  )

  const mappedEmployees =
    membersPage == 1
      ? remapEmployeesForUI(
          [leader, ...members].map(employee => ({
            ...employee,
            teamInfo: employee._id === leader._id ? 'Leader' : 'Member',
            userDropdownOptions:
              employee._id !== currentUserId ? userDropdownOptions : []
          }))
        )
      : remapEmployeesForUI(
          members.map(employee => ({
            ...employee,
            teamInfo: employee._id === leader._id ? 'Leader' : 'Member',
            userDropdownOptions:
              employee._id !== currentUserId ? userDropdownOptions : []
          }))
        )
  // const mappedLeader = remapEmployeesForUI([{
  //   ...leader,
  //   userDropdownOptions: leader._id !== currentUserId
  //     ? userDropdownOptions
  //     : [],
  //   children: leader._id !== currentUserId
  // }])[0]

  return (
    <div className='team-details'>
      {corporate && (
        <Link
          // className='profiles__skills-title__link'
          to={{
            pathname: '/evaluate-employee',
            state: {
              userId: _id,
              fullName: teamName,
              redirect: `/team/${_id}`
            }
          }}
        >
          <Button type='primary' style={{ position: 'absolute', right: 0 }}>
            <div
              style={{
                fontWeight: 'bold',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <i
                style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginRight: '6px'
                }}
                className='icon icon-exchange'
              />
              Give feedback
            </div>
          </Button>
        </Link>
      )}
      <TeamHeading
        teamName={teamName}
        // stage={stageResultInfo.stage}
        // engagement={
        //   stageResultInfo.engagement === 0
        //     ? 'N/A'
        //     : stageResultInfo.engagement
        // }
      />
      <Tabs
        initialActiveTabIndex={
          RouteManager.teamDetailsTabName === ''
            ? tabsNames.indexOf('Members')
            : tabsNames.indexOf(RouteManager.teamDetailsTabName)
        }
        onChange={tabIndex =>
          (RouteManager.teamDetailsTabName = tabsNames[tabIndex])
        }
      >
        <TabsList>
          {tabsNames.map(tab => (
            <Tab>{tab}</Tab>
          ))}
        </TabsList>
        <TabContent>
          {membersLoading ? (
            <LoadingSpinner />
          ) : (
            <div
              className='tab-content'
              style={{ maxWidth: '640px', margin: '0 auto' }}
            >
              <List>
                <UserItems items={mappedEmployees} />
                {totalMembers > 20 && (
                  <>
                    <br />
                    <br />
                    <Pagination
                      total={totalMembers + 1}
                      currentPage={membersPage}
                      pageSize={20}
                      layout='prev, pager, next'
                      pageSizes={[20]}
                      onCurrentChange={page => {
                        handleMembersPageChange(page)
                      }}
                    />
                  </>
                )}
              </List>
            </div>
          )}
        </TabContent>
        <TabContent>
          <div className='tab-content tab-content--no-bg-shadow tab-content--2-columns'>
            <SkillGapTab
              teamId={_id}
              team={team}
              memberId={user._id}
              withHeader
            />
          </div>
        </TabContent>
        {corporate && (
          <TabContent>
            <TeamFeedbackChart teamId={_id} />
            <ProfileFeedbackList userId={_id} />
          </TabContent>
        )}
      </Tabs>
      <style jsx>{listStyle}</style>
      <style jsx>{teamDetailsStyle}</style>
    </div>
  )
}

export default TeamDetailsMember
