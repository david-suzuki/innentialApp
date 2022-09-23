import React, { Component } from 'react'
// import { Tabs, TabsList, Tab, TabContent } from '../ui-components/Tabs'
import { Notification, Button, Icon, MessageBox } from 'element-react'
import { LoadingSpinner, captureFilteredError } from '../general'
import manageGoalsStyle from '../../styles/manageGoalsStyle'
import goalReviewStyle from '../../styles/goalReviewStyle'
import {
  fetchUserGoals,
  updateGoal,
  setGoalStatus,
  deleteGoal
} from '../../api'
import { GoalItem, Statement, SuccessRatePicker, List } from '../ui-components'
import { Query, Mutation, useMutation } from 'react-apollo'
import { removeTypename } from '../user-profile/utilities'
import history from '../../history'
import { Link, Redirect, Switch, Route } from 'react-router-dom'
import { getGoalOptions } from './utils/_getOptions'
// import { DevelopmentPlan } from '../development-plans'
import { GoalDraftLeaderView } from './goal-drafting-components'
import {
  GoalPlanReview,
  GoalDraftPage,
  UserGoalDraftList,
  EditSingleGoal
} from './'

// const toggleTabListAndHeader = () => {
//   const [tabList] = document.getElementsByClassName('tabs-list')
//   const [header] = document.getElementsByClassName(
//     'page-header page-header--button'
//   )
//   if (header && header.style.display !== 'none') {
//     header.style.display = 'none'
//   } else header.style.display = 'flex'
//   if (tabList) {
//     tabList.hidden = !tabList.hidden
//   }
// }

// const tabNames = ['draft', 'active', 'completed', 'approval']

const handleDeletion = (mutate, goalId) => {
  MessageBox.confirm(
    <div>
      This will also delete this goal's related development plan.
      <br />
      This cannot be undone.
    </div>,
    `Are you sure you want to delete the goal?
    `,
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  )
    .then(() => {
      mutate({
        variables: {
          goalId
        }
      })
        .then(({ data: { deleteGoal: response } }) => {
          if (response !== null) {
            Notification({
              type: 'success',
              message: 'Goal successfully deleted!',
              duration: 2500,
              offset: 90
            })
          } else {
            Notification({
              type: 'warning',
              message: 'Oops, something went wrong!',
              duration: 2500,
              offset: 90
            })
          }
        })
        .catch(e => {
          captureFilteredError(e)
          Notification({
            type: 'warning',
            message: 'Oops, something went wrong!',
            duration: 2500,
            offset: 90
          })
        })
    })
    .catch(() => {})
}

const handleMutating = (mutate, variables, pushHistory) => {
  const { status } = variables
  const executeMutation = () => {
    mutate({
      variables
    })
      .then(({ data: { setGoalStatus: response } }) => {
        if (response !== null) {
          if (pushHistory && status === 'ACTIVE') {
            Notification({
              type: 'success',
              message: 'Goal activated!',
              duration: 2500,
              offset: 90
            })
            pushHistory()
          } else if (status === 'READY FOR REVIEW') {
            Notification({
              type: 'success',
              message:
                "Goal marked as ready. You'll be notified when a superior activates it",
              duration: 2500,
              offset: 90
            })
          } else {
            Notification({
              type: 'success',
              message: 'Goal updated!',
              duration: 2500,
              offset: 90
            })
          }
        } else {
          Notification({
            type: 'warning',
            message: 'Oops, something went wrong!',
            duration: 2500,
            offset: 90
          })
        }
      })
      .catch(e => {
        captureFilteredError(e)
        Notification({
          type: 'warning',
          message: 'Oops, something went wrong!',
          duration: 2500,
          offset: 90
        })
      })
  }

  if (status === 'ACTIVE') {
    MessageBox.confirm(
      `Activated goals cannot be edited`,
      `Are you sure you want to activate the goal?`,
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )
      .then(() => {
        executeMutation()
      })
      .catch(() => {})
  } else if (status === 'PAST') {
    MessageBox.confirm(
      `This action cannot be undone`,
      `Are you sure you want complete the goal?`,
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )
      .then(() => executeMutation())
      .catch(() => {})
  } else {
    executeMutation()
  }
}

// const activeGoalDropdownOptions = (goalId, statusMutation) => [
//   <a onClick={() => handleMutating(statusMutation, { goalId, status: 'PAST' })}>
//     Set as completed
//   </a>
// ]
// const draftGoalDropdownOptions = (goalId, statusMutation, deleteMutation) => [
//   <a
//     onClick={() =>
//       handleMutating(statusMutation, { goalId, status: 'READY FOR REVIEW' })
//     }
//   >
//     Ready for review
//   </a>,
//   <a
//     onClick={() => handleMutating(statusMutation, { goalId, status: 'ACTIVE' })}
//   >
//     Set as active
//   </a>,
//   <Link to={`/goals/edit/${goalId}`}>Edit</Link>,
//   <a onClick={() => handleDeletion(deleteMutation, goalId)}>Delete</a>
// ]
// const readyGoalDropdownOptions = (goalId, statusMutation, deleteMutation) => [
//   <a
//     onClick={() => handleMutating(statusMutation, { goalId, status: 'DRAFT' })}
//   >
//     Not ready for review
//   </a>,
//   <a
//     onClick={() => handleMutating(statusMutation, { goalId, status: 'ACTIVE' })}
//   >
//     Set as active
//   </a>,
//   <Link to={`/goals/edit/${goalId}`}>Edit</Link>,
//   <a onClick={() => handleDeletion(deleteMutation, goalId)}>Delete</a>
// ]

const MapGoalGroups = ({
  goalArray = [],
  status,
  setActiveMeasure,
  setGoalStatus,
  deleteGoal
}) => {
  const MapGoals = ({ goals, inPath = false, groupName }) =>
    goals.map(goal => (
      <GoalItem
        key={goal._id}
        {...goal}
        onMeasureClick={(measureId, successRate) =>
          setActiveMeasure(measureId, successRate, goal._id, groupName)
        }
        inReview={status === 'ACTIVE'}
        inResults={status === 'PAST'}
        showDevPlanButton={status !== 'PAST'}
        onDevPlanButtonClick={() =>
          history.push(
            `/plan/${goal._id}${
              goal.developmentPlan &&
              goal.developmentPlan.content.length +
                goal.developmentPlan.mentors.length ===
                0
                ? '?edit=true'
                : ''
            }`
          )
        }
        options={
          !goal.reviewId
            ? getGoalOptions({
                status,
                handleDeletion: goalId => handleDeletion(deleteGoal, goalId),
                handleMutating: variables =>
                  handleMutating(setGoalStatus, variables),
                history
              })
            : []
        }
        hideMeasureCount
        inPath={inPath}
      />
    ))
  return goalArray.map(([group, goals = []]) => {
    if (group === 'Other') {
      return (
        <MapGoals key={`${group}:${status}`} goals={goals} groupName={group} />
      )
    } else
      return (
        <List
          listTitle={`Learning path: ${group}`}
          key={`${group}:${status}`}
          overflow
        >
          <MapGoals goals={goals} inPath groupName={group} />
        </List>
      )
  })
}

const GoalRoute = ({
  sliderValue,
  setSliderValue,
  dialogVisible,
  setDialogVisible,
  setMeasureSuccessLevel,
  activeGoals,
  setActiveMeasure,
  pastGoals,
  draftGoals,
  readyGoals,
  // setGoalStatus,
  currentUser
  // deleteGoal,
  // fromDraft,
  // activeIndex,
  // onTabChange
}) => {
  const [deleteMutation] = useMutation(deleteGoal, {
    refetchQueries: [
      'fetchUserGoals',
      'fetchUsersGoals',
      'fetchDraftGoalsForUser',
      'fetchDraftGoalsOfUserTeams'
    ]
  })

  const [statusMutation] = useMutation(setGoalStatus, {
    refetchQueries: [
      'fetchUserDevelopmentPlan',
      'fetchDraftGoalsForUser',
      'fetchDraftGoalsOfUserTeams'
    ]
  })

  const seeTeamGoals =
    currentUser &&
    (currentUser.roles.indexOf('ADMIN') !== -1 || currentUser.leader)

  const getLength = (goalArray = []) => {
    return goalArray.reduce((acc, [key, value]) => value.length + acc, 0)
  }

  return (
    <Switch
    // className="goals-tabs"
    // initialActiveTabIndex={activeIndex}
    // onChange={tabIndex => onTabChange(tabNames[tabIndex])}
    >
      {/* <TabsList>
        <Tab>Draft</Tab>
        <Tab>Active</Tab>
        <Tab>Completed</Tab>
        {seeTeamGoals && <Tab>Approval</Tab>}
      </TabsList> */}
      {/* <Tab>Organization</Tab> */}
      <Route exact path='/goals/draft'>
        {/* <div className="page-header page-header--button">
          Goal drafts
          <Button
            className="el-button--help"
            onClick={() => {
              if (process.env.REACT_APP_STAGING) {
                window.Intercom('startTour', 94218)
              } else {
                window.Intercom('startTour', 94802)
              }
            }}
          >
            ?
          </Button>
        </div> */}
        <div className='manage-goals__info-wrapper'>
          <div className='manage-goals__info-active'>
            Drafts: <span>{getLength(draftGoals) + getLength(readyGoals)}</span>
          </div>
          <div className='absolute-with-interc-draft'>
            <Link to='/draft/new'>
              <Button className='manage-goals__info-button el-button--green'>
                Add draft goals
                <Icon className='manage-goals__info-button-icon' name='plus' />
              </Button>
            </Link>
          </div>
        </div>
        {getLength(readyGoals) > 0 && (
          <>
            <div className='manage-goals__info-draft'>
              Ready for review: <span>{getLength(readyGoals)}</span>
            </div>
            <MapGoalGroups
              goalArray={readyGoals}
              status='READY FOR REVIEW'
              setGoalStatus={statusMutation}
              deleteGoal={deleteMutation}
            />
          </>
        )}
        {getLength(draftGoals) > 0 && (
          <>
            <div className='manage-goals__info-draft'>
              Not ready for review: <span>{getLength(draftGoals)}</span>
            </div>
            <MapGoalGroups
              goalArray={draftGoals}
              status='DRAFT'
              setGoalStatus={statusMutation}
              deleteGoal={deleteMutation}
            />
          </>
        )}
        {getLength(readyGoals) + getLength(draftGoals) === 0 && (
          <Statement content='Nothing to display. Use the button to add your own goal drafts.' />
        )}
      </Route>
      <Route path='/goals/active'>
        <div className='page-header'>{/* Active goals */}</div>
        <Mutation mutation={updateGoal}>
          {mutate => (
            <SuccessRatePicker
              sliderValue={sliderValue}
              setSliderValue={setSliderValue}
              dialogVisible={dialogVisible}
              setDialogVisible={setDialogVisible}
              setMeasureSuccessLevel={value =>
                setMeasureSuccessLevel(value, mutate)
              }
            />
          )}
        </Mutation>
        <div className='manage-goals__info-wrapper'>
          <div className='manage-goals__info-active'>
            Active goals: <span>{getLength(activeGoals)}</span>
          </div>
        </div>
        <MapGoalGroups
          goalArray={activeGoals}
          status='ACTIVE'
          setActiveMeasure={setActiveMeasure}
          setGoalStatus={statusMutation}
          deleteGoal={deleteMutation}
        />
        {getLength(activeGoals) === 0 && (
          <Statement content='No goals to display.' />
        )}
      </Route>
      <Route path='/goals/completed'>
        <div className='page-header'>{/* Completed goals */}</div>
        <div className='manage-goals__info-wrapper'>
          <div className='manage-goals__info-active'>
            Completed goals: <span>{getLength(pastGoals)}</span>
          </div>
        </div>
        <MapGoalGroups
          goalArray={pastGoals}
          status='PAST'
          deleteGoal={deleteMutation}
        />
        {getLength(pastGoals) === 0 && (
          <Statement content='No goals to display.' />
        )}
      </Route>
      {seeTeamGoals && (
        <Route path='/goals/approval' exact>
          <div className='page-header'>{/* Approval */}</div>
          <GoalDraftLeaderView currentUser={currentUser} />
        </Route>
      )}
      {seeTeamGoals && (
        <Route
          path='/goals/approval/:userId'
          // children={() =>
        >
          <UserGoalDraftList currentUser={currentUser} />
        </Route>
      )}
      <Route path='/goals/edit/:goalId'>
        <EditSingleGoal />
      </Route>
      {/* <Route
        exact
        path="/goals/approve"
        component={() => <GoalDraftLeaderRoute organizationData={organizationData} currentUser={currentUser} />}
      /> */}
      <Route>
        <Redirect to='/goals/draft' />
      </Route>
    </Switch>
  )
}

class ManageGoals extends Component {
  state = {
    dialogVisible: false,
    activeGoal: null,
    activeMeasureId: '',
    sliderValue: 0,
    debouncing: false // GETTING RID OF ELEMENT-REACT INTERNAL STATE SHENANIGANS (OVERWRITING MY OWN VALUES)
  }

  // NOTE: INSTEAD OF THIS, MAKE THIS THE DEFAULT GOAL PAGE TOUR,
  // AND MOVE THE CURRENT GOAL PAGE TOUR (GOAL DRAFTING) TO DRAFTING PAGE (/goals/draft)

  // componentDidMount() {
  //   if ( this.props.fromDraft ) {
  //     if (process.env.REACT_APP_STAGING)
  //       window.Intercom && window.Intercom('startTour', 94203)
  //     else {
  //       // TODO: ADD PROD TOUR FOR => setting goal active or ready-for-review

  //     }
  //   }
  // }

  setMeasureSuccessLevel = (value, mutate) => {
    const { activeGoal, activeMeasureId } = this.state
    const { activeGoals } = this.props

    if (activeGoal) {
      const { groupName, goalId } = activeGoal

      const group = activeGoals.find(g => g[0] === groupName)

      const goal = group && group[1].find(({ _id }) => _id === goalId)

      if (goal) {
        const { _id, goalName, goalType, relatedSkills, measures } = goal
        const inputData = {
          _id,
          goalName,
          goalType,
          measures: removeTypename(
            measures.map(measure => {
              if (measure._id === activeMeasureId) {
                return {
                  ...measure,
                  completed: true,
                  successRate: value
                }
              } else return measure
            })
          ),
          relatedSkills: relatedSkills.map(skill => skill._id)
        }

        mutate({
          variables: {
            inputData
          }
        })
          .then(({ data: { updateGoal } }) => {
            if (updateGoal !== null) {
              Notification({
                type: 'success',
                message: 'Goal updated!',
                duration: 2500,
                offset: 90
              })
            } else {
              Notification({
                type: 'warning',
                message: 'Oops, something went wrong!',
                duration: 2500,
                offset: 90
              })
            }
          })
          .catch(() => {
            Notification({
              type: 'warning',
              message: 'Oops, something went wrong!',
              duration: 2500,
              offset: 90
            })
          })

        this.setState(
          {
            activeMeasureId: '',
            sliderValue: 0,
            debouncing: true
          },
          () =>
            setTimeout(
              () =>
                this.setState({
                  debouncing: false
                }),
              100
            )
        )
      }
    }
  }

  setDialogVisible = value => {
    this.setState({ dialogVisible: value })
  }

  setActiveMeasure = (measureId, successRate, goalId, groupName) => {
    this.setState(
      {
        activeGoal: {
          goalId,
          groupName
        },
        activeMeasureId: measureId,
        dialogVisible: true,
        sliderValue: successRate !== null ? successRate : 0,
        debouncing: true
      },
      () =>
        setTimeout(
          () =>
            this.setState({
              debouncing: false
            }),
          100
        )
    )
  }

  setSliderValue = value => {
    if (!this.state.debouncing) {
      this.setState({ sliderValue: value })
    }
  }

  // onTabChange = tab => {
  //   history.push(`/goals?tab=${tab}`)
  // }

  render() {
    const { dialogVisible, sliderValue } = this.state
    const {
      activeGoals,
      pastGoals,
      draftGoals,
      readyGoals,
      currentUser
    } = this.props

    return (
      <>
        {/* <div className="manage-goals"> */}
        <GoalRoute
          sliderValue={sliderValue}
          setSliderValue={this.setSliderValue}
          dialogVisible={dialogVisible}
          setDialogVisible={this.setDialogVisible}
          setMeasureSuccessLevel={this.setMeasureSuccessLevel}
          activeGoals={activeGoals}
          setActiveMeasure={this.setActiveMeasure}
          pastGoals={pastGoals}
          draftGoals={draftGoals}
          readyGoals={readyGoals}
          setGoalStatus={setGoalStatus}
          currentUser={currentUser}
          deleteGoal={deleteGoal}
          // fromDraft={this.props.fromDraft}
          // activeIndex={activeIndex}
          // onTabChange={this.onTabChange}
        />
        {/* </div> */}
        <style jsx>{manageGoalsStyle}</style>
        <style jsx>{goalReviewStyle}</style>
      </>
    )
  }
}

const groupByPathReducer = (acc, curr) => {
  if (!curr.fromPath) {
    return {
      ...acc,
      Other: [...acc.Other, curr]
    }
  } else {
    const key = curr.fromPath.name
    const existing = acc[key]
    if (existing) {
      return {
        ...acc,
        [key]: [...existing, curr]
      }
    } else {
      return {
        ...acc,
        [key]: [curr]
      }
    }
  }
}

export default ({ currentUser /*, fromDraft, activeIndex */ }) => (
  <Query query={fetchUserGoals}>
    {({ data, loading, error }) => {
      if (loading) return <LoadingSpinner />
      if (error) {
        captureFilteredError(error)
        return <Statement content='Oops! Something went wrong' />
      }

      if (data) {
        const goals = data.fetchUserGoals || []
        const goalGroups = goals.reduce(
          (acc, curr) => ({
            ...acc,
            [curr.status]: [...acc[curr.status], curr]
          }),
          {
            'READY FOR REVIEW': [],
            DRAFT: [],
            ACTIVE: [],
            PAST: []
          }
        )
        const {
          'READY FOR REVIEW': readyGoals,
          DRAFT: draftGoals,
          ACTIVE: activeGoals,
          PAST: pastGoals
        } = Object.entries(goalGroups).reduce((acc, [key, value]) => {
          return {
            ...acc,
            [key]: Object.entries(
              value.reduce(groupByPathReducer, { Other: [] })
            )
              .reverse()
              .map(([key, value]) => {
                if (key !== 'Other')
                  value.sort(
                    (a, b) => a.learningPathIndex - b.learningPathIndex
                  )
                return [key, value]
              })
          }
        }, {})

        return (
          <ManageGoals
            // fromDraft={fromDraft}
            readyGoals={readyGoals}
            draftGoals={draftGoals}
            activeGoals={activeGoals}
            pastGoals={pastGoals}
            currentUser={currentUser}
            // activeIndex={activeIndex}
          />
        )
      }
      return <Statement content='Oops! Something went wrong' />
    }}
  </Query>
)

// ORGANIZATIONAL AND TEAM GOALS PLACEHOLDER BELOW

/*
</TabContent>
  <TabContent>
    {admin && (
      <div className="goals-placeholder__wrapper">
        <div className="goals-placeholder__title">Team Goals</div>
        <br />
        <Statement
          label="Coming soon!"
          content="Innential will help your teams to align their goals with the goals of the whole organization."
        />
        <br />
        For more information, please contact{' '}
        <a
          onClick={e => {
            e.preventDefault()
            window.Intercom(
              'showNewMessage',
              'Hi, I would like to learn more about Team Goals'
            )
          }}
        >
          Kris
        </a>
        .
      </div>
    )}
  </TabContent>
  <TabContent>
    {admin && (
      <div className="goals-placeholder__wrapper">
        <div className="goals-placeholder__title">
          Organizational Goals
        </div>
        <br />
        <Statement
          label="Coming soon!"
          content="Innential will help you set up a long-term plan for your company's growth."
        />
        <br />
        For more information, please contact{' '}
        <a
          onClick={e => {
            e.preventDefault()
            window.Intercom(
              'showNewMessage',
              'Hi, I would like to learn more about Organizational Goals'
            )
          }}
        >
          Kris
        </a>
        .
      </div>
    )}
    {<img
    src="https://innential-production.s3.eu-central-1.amazonaws.com/placeholders/goalscanvasplaceholder.png"
    alt="Set goals for your organization and create your personal development plan!"
    width={600}
  />
  </TabContent>
</Tabs>
*/
