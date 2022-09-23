import React from 'react'
import {
  Card,
  Tabs,
  Table,
  Button,
  Icon,
  Tag,
  // Loading,
  Message,
  MessageBox
  // Checkbox
} from 'element-react'
import { Query, Mutation, useMutation } from 'react-apollo'
import {
  fetchOrganization as OrganizationQuery,
  // fetchAllStageResults as TSRQuery,
  // fetchMembersCompleted as FormQuery,
  deleteUserFromTeam,
  setTeamRecommendedLearningPaths
  // createTeamStageAssessment,
  // fetchFormsAndMakeResult,
  // toggleMembersGetReport
} from '../../api'
import { Link, withRouter, Redirect } from 'react-router-dom'
import { TeamAddMemberForm, TeamChangeLeaderForm } from './components'
import { LearningPathSelect } from './components/team'

const handleRemovingMember = (userId, teamId, deleteUserFromTeam) => {
  MessageBox.confirm(
    'Do you want to delete this member from the team?',
    'Warning',
    {
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  )
    .then(async () => {
      console.log({
        variables: {
          userId,
          teamId
        }
      })
      try {
        await deleteUserFromTeam({
          variables: {
            userId,
            teamId
          }
        })
        Message({
          type: 'success',
          message: 'Member successfully deleted from the team'
        })
      } catch (e) {
        Message({
          type: 'error',
          message: `${e.graphQLErrors[0].message}`
        })
      }
    })
    .catch(() => {
      Message({
        type: 'info',
        message: 'Delete cancelled'
      })
    })
}

const OrganizationTeamView = ({ match }) => {
  const { organizationId, slug, teamId } = match && match.params

  const [mutate] = useMutation(setTeamRecommendedLearningPaths)

  return (
    <Query query={OrganizationQuery} variables={{ organizationId }}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...'
        if (error) return `Error! ${error.message}`

        const allTeams =
          data && data.fetchOrganization && data.fetchOrganization.teams
        const teamData = allTeams.find(team => team._id === teamId)
        if (teamData) {
          const memberData = [
            { ...teamData.leader, role: 'leader' },
            ...teamData.members
          ]

          const handleMutation = async pathId => {
            const { recommendedPaths: prevPaths } = teamData

            const recommendedPaths = [
              ...prevPaths
                .filter(({ _id }) => _id !== pathId)
                .map(({ _id }) => _id),
              pathId
            ]

            try {
              await mutate({
                variables: {
                  teamId,
                  recommendedPaths
                }
              })
              Message({
                type: 'success',
                message: 'Updated recommendations'
              })
            } catch (err) {
              Message({
                type: 'error',
                message: err.graphQLErrors[0].message
              })
            }
          }

          const handleRemoving = async pathId => {
            const { recommendedPaths: prevPaths } = teamData

            const recommendedPaths = [
              ...prevPaths
                .filter(({ _id }) => _id !== pathId)
                .map(({ _id }) => _id)
            ]

            try {
              await mutate({
                variables: {
                  teamId,
                  recommendedPaths
                }
              })
              Message({
                type: 'success',
                message: 'Updated recommendations'
              })
            } catch (err) {
              Message({
                type: 'error',
                message: err.graphQLErrors[0].message
              })
            }
          }

          return (
            <Card
              className='box-card'
              header={
                <div>
                  <span style={{ lineHeight: '36px' }}>
                    <b>{teamData.teamName}</b>
                  </span>
                  <span
                    style={{
                      lineHeight: '36px',
                      float: 'right',
                      marginRight: 10
                    }}
                  >
                    <Link
                      to={`/organizations/${slug}/${organizationId}`}
                      style={{ marginTop: '25%' }}
                    >
                      <Button type='primary'>
                        <Icon name='arrow-left' />
                      </Button>
                    </Link>
                  </span>
                  {/* <span style={{ lineHeight: '36px', float: 'right' }}>
                    <Mutation
                      mutation={createTeamStageAssessment}
                      refetchQueries={[
                        'fetchAllStageResults',
                        'fetchMembersCompleted'
                      ]}
                    >
                      {(createTeamStageAssessment, { loading, error }) => {
                        if (loading) return <Loading fullscreen />
                        if (error) {
                          Message({
                            type: 'error',
                            message: `There's already an ongoing assessment for this team!`
                          })
                        }
                        return (
                          <Button
                            type="primary"
                            style={{ marginRight: 10 }}
                            onClick={async () => {
                              await createTeamStageAssessment({
                                variables: {
                                  teamId: teamData._id
                                }
                              })
                            }}
                          >
                            Open new Stage Assessment
                          </Button>
                        )
                      }}
                    </Mutation>
                  </span> */}
                  <span
                    style={{
                      lineHeight: '36px',
                      float: 'right ',
                      marginRight: 10
                    }}
                  >
                    <TeamAddMemberForm teamId={teamId} />
                  </span>
                  {/* <span
                    style={{
                      lineHeight: '36px',
                      float: 'right ',
                      marginRight: 10
                    }}
                  >
                    <Mutation
                      mutation={toggleMembersGetReport}
                      refetchQueries={['fetchOrganization']}
                    >
                      {(toggleMembersGetReport, { loading }) => {
                        if (loading) return <Loading />
                        return (
                          <Checkbox
                            checked={teamData.membersGetStageReport}
                            onChange={async () => {
                              await toggleMembersGetReport({
                                variables: {
                                  teamId: teamData._id
                                }
                              })
                            }}
                          >
                            Members get stage report
                          </Checkbox>
                        )
                      }}
                    </Mutation>
                  </span> */}
                </div>
              }
            >
              <Tabs type='card' activeName='1'>
                <Tabs.Pane label='Members' name='1'>
                  <Table
                    labelWidth='120'
                    columns={[
                      {
                        label: 'Member',
                        render: ({ firstName, lastName, email }) => {
                          if (firstName) {
                            if (lastName) {
                              return (
                                <p>
                                  {firstName + ' ' + lastName + ` (${email})`}
                                </p>
                              )
                            } else return <p>{firstName + ` (${email})`}</p>
                          } else return <p>{email}</p>
                        }
                      },
                      {
                        label: 'Role',
                        render: ({ role }) => {
                          return (
                            <React.Fragment>
                              <Tag
                                type={role === 'leader' ? 'danger' : 'primary'}
                              >
                                {role === 'leader' ? 'leader' : 'member'}
                              </Tag>
                            </React.Fragment>
                          )
                        }
                      },
                      {
                        label: 'Operations',
                        render: ({ role, _id }) => {
                          if (role === 'leader') {
                            return (
                              <div className='clearfix'>
                                <TeamChangeLeaderForm
                                  members={teamData.members}
                                  teamId={teamId}
                                />
                              </div>
                            )
                          } else
                            return (
                              <div className='clearfix'>
                                <Mutation
                                  mutation={deleteUserFromTeam}
                                  refetchQueries={[
                                    'fetchOrganization',
                                    'fetchMembersCompleted'
                                  ]}
                                >
                                  {deleteUserFromTeam => (
                                    <Button
                                      type='danger'
                                      size='small'
                                      onClick={async () =>
                                        handleRemovingMember(
                                          _id,
                                          teamId,
                                          deleteUserFromTeam
                                        )
                                      }
                                    >
                                      Delete
                                    </Button>
                                  )}
                                </Mutation>
                              </div>
                            )
                        }
                      }
                    ]}
                    data={memberData}
                    stripe
                  />
                </Tabs.Pane>
                <Tabs.Pane label='Learning Path Recommendations' name='2'>
                  <LearningPathSelect
                    selectedPaths={teamData.recommendedPaths}
                    onSelectPath={handleMutation}
                    organizationId={organizationId}
                  />
                  <div style={{ margin: '15px 0' }}>
                    <em>
                      These learning paths will be displayed in a separate
                      section of LP recommendations to the team members
                    </em>
                  </div>
                  <Table
                    labelWidth='120'
                    columns={[
                      {
                        label: 'Learning Path',
                        prop: 'name'
                      },
                      {
                        label: 'Operations',
                        width: 300,
                        render: ({ _id }) => {
                          return (
                            <div className='clearfix'>
                              <Button
                                type='danger'
                                size='small'
                                onClick={async () => handleRemoving(_id)}
                              >
                                Remove from recommendations
                              </Button>
                            </div>
                          )
                        }
                      }
                    ]}
                    data={teamData.recommendedPaths}
                    stripe
                  />
                </Tabs.Pane>
                {/* <Tabs.Pane label="Stage Results" name="2">
                  <Query
                    query={FormQuery}
                    variables={{ teamId }}
                    fetchPolicy="cache-and-network"
                  >
                    {({ loading, error, data }) => {
                      if (loading)
                        return <Loading style={{ float: 'left', padding: 20 }} />
                      if (error)
                        return (
                          <div style={{ padding: 20 }}>
                            <b>Error: failed to fetch data</b>
                          </div>
                        )
  
                      const haveCompleted =
                        data && data.fetchMembersCompleted.emails
                          ? data.fetchMembersCompleted.emails
                          : []
                      const participants =
                        data && data.fetchMembersCompleted.participants
                          ? data.fetchMembersCompleted.participants
                          : []
  
                      if (!data.fetchMembersCompleted.open) {
                        return (
                          <div style={{ padding: 20 }}>
                            <b>No open assessments</b>
                          </div>
                        )
                      }
                      if (
                        haveCompleted &&
                        participants &&
                        haveCompleted.length !== participants.length
                      ) {
                        const completedMembers = participants.filter(
                          participant =>
                            haveCompleted.find(email => email === participant)
                        )
                        const notCompletedMembers = participants.filter(
                          participant =>
                            !haveCompleted.find(email => email === participant)
                        )
                        const msg =
                          completedMembers.length > 0
                            ? `Members who submitted the form: ${completedMembers.join(
                                ', '
                              )}`
                            : ''
                        const msg2 =
                          notCompletedMembers.length > 0
                            ? `Members who didn't submit the form: ${notCompletedMembers.join(
                                ', '
                              )}`
                            : ''
  
                        return (
                          <div style={{ padding: 20 }}>
                            <b>
                              All members did not complete the form.{' '}
                              {`(${haveCompleted.length} / ${
                                participants.length
                              })`}
                            </b>
                            <br /> <p>{msg}</p>
                            <br /> <p>{msg2}</p>
                          </div>
                        )
                      }
                      return (
                        <p style={{ padding: 20 }}>
                          <b>
                            All members have submitted the form. <br />
                            Members who have submitted their forms:{' '}
                          </b>
                          {haveCompleted.join(', ')}
                        </p>
                      )
                    }}
                  </Query>
                  <Query query={TSRQuery} variables={{ teamId }}>
                    {({ loading, error, data }) => {
                      if (loading) return 'Loading...'
                      if (error) return `Error! ${error.message}`
  
                      const TSRData = data && data.fetchAllStageResults
                      TSRData.sort(
                        (a, b) => new Date(b.startDate) - new Date(a.startDate)
                      )
  
                      return (
                        <Table
                          labelWidth="120"
                          columns={[
                            {
                              type: 'index'
                            },
                            {
                              label: 'Start Date',
                              render: ({ startDate }) => (
                                <p>{new Date(startDate).toDateString()}</p>
                              )
                            },
                            {
                              label: 'End Date',
                              render: ({ endDate }) => {
                                if (endDate) {
                                  return <p>{new Date(endDate).toDateString()}</p>
                                } else {
                                  return <p>To be closed</p>
                                }
                              }
                            },
                            {
                              label: 'Results',
                              subColumns: [
                                {
                                  label: 'Engagement',
                                  prop: 'engagement'
                                },
                                {
                                  label: 'Stage',
                                  prop: 'stage'
                                },
                                {
                                  type: 'expand',
                                  label: 'Details',
                                  expandPannel: function(TSRData) {
                                    if (TSRData && TSRData.endDate) {
                                      const { comments } = TSRData
                                      const {
                                        acceptanceAndNorms,
                                        comsAndFeedback,
                                        cooperation,
                                        followUps,
                                        goalsManagement,
                                        independence,
                                        leadership,
                                        planningAndDecisionMaking,
                                        rolesClarity,
                                        structure
                                      } = TSRData.keyPerformance
                                      return (
                                        <div>
                                          <p>
                                            Goals management:{' '}
                                            {goalsManagement.toFixed(1)}{' '}
                                          </p>
                                          <p>
                                            Follow ups: {followUps.toFixed(1)}
                                          </p>
                                          <p>
                                            Independence:{' '}
                                            {independence.toFixed(1)}
                                          </p>
                                          <p>
                                            Leadership: {leadership.toFixed(1)}
                                          </p>
                                          <p>
                                            Planning and decision making:{' '}
                                            {planningAndDecisionMaking.toFixed(1)}
                                          </p>
                                          <p>
                                            Communication and feedback:{' '}
                                            {comsAndFeedback.toFixed(1)}
                                          </p>
                                          <p>
                                            Acceptance and norms:{' '}
                                            {acceptanceAndNorms.toFixed(1)}
                                          </p>
                                          <p>
                                            Cooperation: {cooperation.toFixed(1)}
                                          </p>
                                          <p>Structure: {structure.toFixed(1)}</p>
                                          <p>
                                            Role clarity:{' '}
                                            {rolesClarity.toFixed(1)}
                                          </p>
                                          <b>Members participated: </b>
                                          {TSRData.membersParticipated.map(
                                            (el, i) => (
                                              <div key={i}>
                                                <b>{el}</b>
                                                <p>
                                                  Comments:
                                                  <br />
                                                  {comments &&
                                                    [
                                                      comments[4 * i],
                                                      comments[4 * i + 1]
                                                    ].join(': ')}
                                                  <br />
                                                  {comments &&
                                                    [
                                                      comments[4 * i + 2],
                                                      comments[4 * i + 3]
                                                    ].join(': ')}
                                                </p>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      )
                                    }
                                  }
                                }
                              ]
                            },
                            {
                              label: 'Operations',
                              render: (row, col, ind) => {
                                if (TSRData[ind].engagement !== null) return <p />
  
                                return (
                                  <Mutation
                                    mutation={fetchFormsAndMakeResult}
                                    refetchQueries={[
                                      'fetchAllStageResults',
                                      'fetchMembersCompleted'
                                    ]}
                                  >
                                    {(fetchFormsAndMakeResult, { loading }) => {
                                      if (loading) return <Loading fullscreen />
  
                                      return (
                                        <Button
                                          type="primary"
                                          size="small"
                                          onClick={async () => {
                                            await fetchFormsAndMakeResult({
                                              variables: {
                                                teamId: teamData._id
                                              }
                                            })
                                          }}
                                        >
                                          Close
                                        </Button>
                                      )
                                    }}
                                  </Mutation>
                                )
                              }
                            }
                          ]}
                          data={[...TSRData]}
                          stripe
                          border
                        />
                      )
                    }}
                  </Query>
                </Tabs.Pane> */}
              </Tabs>
              <style>{`
                .el-tabs__content {
                  overflow: visible;
                }
                .el-card {
                  overflow: visible;
                }
                div {
                  overflow: visible;
                }
              `}</style>
            </Card>
          )
        } else return <Redirect to={`/error-page/404`} />
      }}
    </Query>
  )
}

export default withRouter(OrganizationTeamView)
