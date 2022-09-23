import React, { Component } from 'react'
import { Button, Notification, MessageBox, Pagination } from 'element-react'
import { LoadingSpinner } from '../../general'
import {
  List,
  TeamHeading,
  UserItem,
  Tab,
  TabsList,
  TabContent,
  Tabs,
  UserItems
} from '../../ui-components'
// import { generateInitialsAvatar } from '$/utils'
import listStyle from '../../../styles/listStyle'
import teamDetailsStyle from '../../../styles/teamDetailsStyle'
import {
  removeTeamMember,
  setNewLeader,
  fetchStatsTeamsData,
  fetchUsersProfile,
  fetchTeamMembers,
  fetchTeamDetails
  // fetchOpenAssessmentsForUser as DashboardQuery
} from '../../../api'
import { Link } from 'react-router-dom'
import { SkillGapTab, TeamFeedbackChart } from './'
import '../../../styles/theme/notification.css'
import '../../../styles/theme/message.css'
import { captureFilteredError } from '../../general'
import history from '../../../history'
// import { RouteManager } from '../../../utils'
import { remapEmployeesForUI } from '../_teamUtils'
import {
  ProfileFeedbackList,
  UserFeedbackRequest,
  FeedbackRequestPopup
} from '../../team-evaluate'
import TeamStatistics from './team-statistics/'
class TeamDetailsLeader extends Component {
  constructor(props) {
    super(props)

    const { justEvaluated } = props

    this.state = {
      buttonValue: justEvaluated
        ? this.buttonValues.Skills
        : this.buttonValues.Members,
      visible: false,
      // isAddingMember: false,
      typeformsSubmitted: 0
    }
  }

  buttonValues = {
    Members: 'Add new team member',
    Skills: 'Set required skills',
    Requests: 'Request feedback',
    Feedback: 'Request feedback'
  }

  setNewLeader = async uuid => {
    MessageBox.confirm(
      `Are you sure that you want to change the team leader?
      Changing the team leader will remove your team leader privileges.`,
      'Warning',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )
      .then(async () => {
        await this.props.client
          .mutate({
            mutation: setNewLeader,
            variables: {
              uid: uuid,
              teamId: this.props.team._id
            },
            update: cache => {
              Object.keys(cache.data.data).forEach(
                key =>
                  (key.match(/^TeamMembers/) && cache.data.delete(key)) ||
                  (key.match(/^Member/) && cache.data.delete(key))
              )
            },
            refetchQueries: [
              {
                query: fetchTeamDetails,
                variables: {
                  teamId: this.props.teamId
                }
              },
              {
                query: fetchTeamMembers,
                variables: {
                  teamId: this.props.teamId,
                  membersLimit: 20,
                  membersSkip: (this.props.membersPage - 1) * 20
                }
              },

              'fetchLatestTeamEvaluation',
              'fetchEvaluationInfo'
            ]
          })
          .then(res => {
            if (res.data && res.data.setNewLeader === 'ok') {
              Notification({
                type: 'success',
                message: 'Leader successfully changed',
                duration: 2500,
                offset: 90
              })
            } else {
              Notification({
                type: 'warning',
                message: res.data.removeTeamMember,
                duration: 2500,
                offset: 90
              })
            }
          })
          .catch(e => captureFilteredError(e))
      })
      .catch(() => {
        Notification({
          type: 'warning',
          message: 'Operation cancelled',
          duration: 2500,
          offset: 90
        })
      })
  }

  removeTeamMember = async uuid => {
    MessageBox.confirm(`Are you sure you want to remove member?`, 'Warning', {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning'
    })
      .then(async () => {
        await this.props.client
          .mutate({
            mutation: removeTeamMember,
            variables: {
              teamId: this.props.team._id,
              uid: uuid
            },
            refetchQueries: [
              {
                query: fetchTeamDetails,
                variables: {
                  teamId: this.props.teamId
                }
              },
              {
                query: fetchTeamMembers,
                variables: {
                  teamId: this.props.teamId,
                  membersLimit: 20,
                  membersSkip: (this.props.membersPage - 1) * 20
                }
              },
              'fetchLatestTeamEvaluation',
              'fetchEvaluationInfo',
              'fetchStatsOverviewData',
              'fetchStatsTeamsData',
              'fetchStatsGrowthData'
            ],
            update: cache => {
              try {
                const { fetchStatsTeamsData: teamsData } = cache.readQuery({
                  query: fetchStatsTeamsData
                })
                const { teamsSkillGap } = teamsData
                const team = teamsSkillGap.find(
                  skillgap => skillgap._id === this.props.team._id
                )
                cache.writeQuery({
                  query: fetchStatsTeamsData,
                  data: {
                    fetchStatsTeamsData: {
                      ...teamsData,
                      teamsSkillGap: [
                        ...teamsData.teamsSkillGap.map(skillgap => {
                          if (skillgap._id === team._id) {
                            return {
                              ...skillgap,
                              teamMemberCount: team.teamMemberCount - 1
                            }
                          } else return skillgap
                        })
                      ]
                    }
                  }
                })
              } catch (e) {}

              try {
                // UPDATE USER PROFILE
                const { fetchUsersProfile: profile } = cache.readQuery({
                  query: fetchUsersProfile,
                  variables: {
                    userId: uuid
                  }
                })
                const { teamInfo } = profile
                const newTeamInfo = teamInfo.filter(
                  name => name !== this.props.team.teamName
                )

                cache.writeQuery({
                  query: fetchUsersProfile,
                  variables: {
                    userId: uuid
                  },
                  data: {
                    fetchUsersProfile: {
                      ...profile,
                      teamInfo: newTeamInfo
                    }
                  }
                })
              } catch (e) {}
            }
          })
          .then(res => {
            if (res.data && res.data.removeTeamMember === 'success') {
              Notification({
                type: 'success',
                message: 'Member successfully removed',
                duration: 2500,
                offset: 90
              })
            } else {
              Notification({
                type: 'warning',
                message: res.data.removeTeamMember,
                duration: 2500,
                offset: 90
              })
            }
          })
          .catch(e => captureFilteredError(e))
      })
      .catch(() => {
        Notification({
          type: 'warning',
          message: 'Operation cancelled',
          duration: 2500,
          offset: 90
        })
      })
  }

  evaluateUser = (userId, fullName) => {
    history.push('/evaluate-employee', {
      userId,
      fullName,
      redirect: `/team/${this.props.team._id}`
    })
  }

  render() {
    const { leader, _id, teamName, publicLink } = this.props.team

    const { teamMembers } = this.props
    const { user: currentUser } = this.props

    const { premium, corporate } = currentUser

    const tabsNames = [
      'Members',
      'Skills',
      'Team Statistics',
      corporate && 'Feedback',
      corporate && 'Requests'
    ].filter(item => !!item)

    const { buttonValue, visible } = this.state

    const memberDropdownOptions = [
      {
        value: 'Remove from team',
        boundFunction: this.removeTeamMember
      },
      premium && {
        value: 'Give feedback',
        boundFunction: this.evaluateUser
      },
      {
        value: 'Set as leader',
        boundFunction: this.setNewLeader
      }
    ].filter(item => !!item)

    const selfDropdownOptions = [
      {
        value: 'Leave team',
        boundFunction: this.removeTeamMember
      },
      {
        value: 'Set yourself as leader',
        boundFunction: this.setNewLeader
      }
    ]

    const leaderDropdownOptions =
      premium && leader._id !== currentUser._id
        ? [
            {
              value: 'Give feedback',
              boundFunction: this.evaluateUser
            }
          ]
        : []

    const mappedEmployees = this.props.membersLoading
      ? []
      : remapEmployeesForUI(
          teamMembers
            .filter(value => {
              return value._id !== leader._id
            })
            .map(member => ({
              ...member,
              userDropdownOptions:
                member._id === currentUser._id
                  ? selfDropdownOptions
                  : memberDropdownOptions
            }))
        ).map(user => ({
          ...user,
          label: 'Member'
        }))
    const mappedLeader = remapEmployeesForUI([
      { ...this.props.teamLeader, userDropdownOptions: leaderDropdownOptions }
    ])[0]

    return (
      <div className='team-details'>
        {this.props.user.premium ? (
          <FeedbackRequestPopup
            visible={visible}
            setVisible={value => this.setState({ visible: value })}
            teamId={_id}
            publicLink={publicLink}
            currentUser={currentUser}
          />
        ) : null}

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
          userIsTeamsLeader={this.props.userIsTeamsLeader}
          teamId={this.props.team._id}
        />
        <Tabs
          initialActiveTabIndex={
            this.props.justEvaluated
              ? tabsNames.indexOf('Skills')
              : tabsNames.indexOf('Members')
          }
          onChange={tabIndex => {
            // RouteManager.teamDetailsTabName = tabsNames[tabIndex]
            this.setState({
              buttonValue: this.buttonValues[tabsNames[tabIndex]]
            })
          }}
        >
          <TabsList>
            {tabsNames.map((tab, idx) => (
              <Tab key={idx}>{tab}</Tab>
            ))}
          </TabsList>

          <TabContent>
            {this.props.membersLoading ? (
              <LoadingSpinner />
            ) : (
              <div
                className='tab-content'
                style={{ maxWidth: '640px', margin: '0 auto' }}
              >
                <List overflow>
                  {this.props.teamLeader ? (
                    <UserItem
                      {...mappedLeader}
                      dropdownOptions={leaderDropdownOptions}
                      uuid={mappedLeader.id}
                      label='Leader'
                      children={
                        mappedLeader.id ===
                        this.props.user
                          ._id ? null : leaderDropdownOptions.length > 0 ? (
                          <i className='icon icon-menu-dots' />
                        ) : null
                      }
                      // {...(mappedLeader.id === this.props.user._id && {
                      //   children: null
                      // })}
                    />
                  ) : null}

                  <UserItems
                    items={mappedEmployees}
                    // userDropdownOptions={memberDropdownOptions}
                  />
                  {this.props.totalMembers > 20 && (
                    <>
                      <br />
                      <br />
                      <Pagination
                        total={this.props.totalMembers + 1}
                        currentPage={this.props.membersPage}
                        pageSize={20}
                        layout='prev, pager, next'
                        pageSizes={[20]}
                        onCurrentChange={page => {
                          this.props.handleMembersPageChange(page)
                        }}
                      />
                    </>
                  )}
                </List>
              </div>
            )}
          </TabContent>
          {/* {premium && ( */}
          <TabContent>
            <div className='tab-content--2-columns'>
              <SkillGapTab
                teamId={_id}
                team={this.props.team}
                isLeader
                memberId={this.props.user._id}
                withHeader
              />
            </div>
          </TabContent>
          <TabContent>
            <TeamStatistics teamId={_id} />
          </TabContent>
          {/* )} */}
          {corporate && (
            <TabContent>
              <TeamFeedbackChart teamId={_id} />
              <ProfileFeedbackList userId={_id} />
            </TabContent>
          )}
          {corporate && (
            <TabContent>
              <UserFeedbackRequest teamId={_id} />
            </TabContent>
          )}
        </Tabs>
        {buttonValue && (
          <Button
            className='el-button--green el-button--team-member'
            onClick={e => {
              switch (buttonValue) {
                case this.buttonValues.Members:
                  history.push('/create/teams/members', {
                    team: this.props.team,
                    user: this.props.user
                  })
                  break
                case this.buttonValues.Skills:
                  history.push('/evaluate', {
                    teamId: _id,
                    forceEval: true,
                    redirect: `/team/${_id}`
                  })
                  break
                default:
                  this.setState({ visible: true })
                  break
              }
            }}
          >
            {buttonValue}
          </Button>
        )}
        {/* {this.state.isAddingMember && (
          <Redirect
            to={{
              pathname: '/create/teams/members',
              state: {
                team: this.props.team,
                user: this.props.user
              }
            }}
          />
        )} */}
        <style jsx>{listStyle}</style>
        <style jsx>{teamDetailsStyle}</style>
      </div>
    )
  }
}
export default props => (
  <TeamDetailsLeader
    {...props}
    teamLeader={props.membersPage === 1 ? props.team.leader : false}
    membersPage={props.membersPage}
    handleMembersPageChange={props.handleMembersPageChange}
    members={props.team.members}
  />
)
