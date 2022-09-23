import React, { useEffect } from 'react'
import { Mutation, useMutation } from 'react-apollo'
import {
  changeGoalPreferences,
  fetchUserDevelopmentPlan,
  fetchUserGoals
} from '../../../api'
import { captureFilteredError } from '../../general'
import { Notification, Select, Button } from 'element-react'
import {
  GoalItemDashboard,
  DevelopmentPlanOverviewTabs
} from '../../ui-components'
import Droppin from '../../../static/droppin.svg'
import Map from '../../../static/map.svg'
import { Link, useHistory, useLocation } from 'react-router-dom'

const ChangeYourPath = () => (
  <svg
    width='16'
    height='17'
    viewBox='0 0 16 17'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M7.99984 2.50002C4.68613 2.50002 1.99984 5.18631 1.99984 8.50002C1.99984 11.8137 4.68613 14.5 7.99984 14.5C11.3135 14.5 13.9998 11.8137 13.9998 8.50002C13.9998 5.18631 11.3135 2.50002 7.99984 2.50002ZM0.666504 8.50002C0.666504 4.44993 3.94975 1.16669 7.99984 1.16669C12.0499 1.16669 15.3332 4.44993 15.3332 8.50002C15.3332 12.5501 12.0499 15.8334 7.99984 15.8334C3.94975 15.8334 0.666504 12.5501 0.666504 8.50002Z'
      fill='#5A55AB'
    />
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M11.2983 5.20193C11.4768 5.38049 11.5392 5.6446 11.4593 5.88416L10.046 10.1242C9.97962 10.3232 9.82341 10.4794 9.62434 10.5458L5.38434 11.9591C5.14478 12.039 4.88067 11.9766 4.70212 11.7981C4.52356 11.6195 4.46121 11.3554 4.54107 11.1159L5.9544 6.87585C6.02076 6.67678 6.17697 6.52057 6.37604 6.45422L10.616 5.04088C10.8556 4.96103 11.1197 5.02338 11.2983 5.20193ZM7.1139 7.61372L6.22761 10.2726L8.88647 9.38629L9.77276 6.72743L7.1139 7.61372Z'
      fill='#5A55AB'
    />
  </svg>
)

const ReadOverview = () => (
  <svg
    width='16'
    height='17'
    viewBox='0 0 16 17'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M5.00257 1.25453C5.19611 1.14393 5.43211 1.13738 5.63148 1.23707L10.6457 3.74417L15.0026 1.25453C15.2089 1.13662 15.4624 1.13747 15.668 1.25675C15.8735 1.37603 16 1.59571 16 1.83335V12.5C16 12.7393 15.8718 12.9602 15.6641 13.0788L10.9974 15.7455C10.8039 15.8561 10.5679 15.8627 10.3685 15.763L5.35431 13.2559L0.997426 15.7455C0.791091 15.8634 0.537592 15.8626 0.332049 15.7433C0.126506 15.624 0 15.4043 0 15.1667V4.50002C0 4.26078 0.128191 4.03989 0.335907 3.92119L5.00257 1.25453ZM5.35431 2.5892L1.33333 4.8869V14.0179L5.00257 11.9212C5.19611 11.8106 5.43211 11.8041 5.63148 11.9037L10.6457 14.4108L14.6667 12.1131V2.98214L10.9974 5.07885C10.8039 5.18944 10.5679 5.19599 10.3685 5.09631L5.35431 2.5892Z'
      fill='#5A55AB'
    />
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M5.33366 1.16669C5.70185 1.16669 6.00033 1.46516 6.00033 1.83335V12.5C6.00033 12.8682 5.70185 13.1667 5.33366 13.1667C4.96547 13.1667 4.66699 12.8682 4.66699 12.5V1.83335C4.66699 1.46516 4.96547 1.16669 5.33366 1.16669Z'
      fill='#5A55AB'
    />
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M10.6667 3.83331C11.0349 3.83331 11.3333 4.13179 11.3333 4.49998V15.1666C11.3333 15.5348 11.0349 15.8333 10.6667 15.8333C10.2985 15.8333 10 15.5348 10 15.1666V4.49998C10 4.13179 10.2985 3.83331 10.6667 3.83331Z'
      fill='#5A55AB'
    />
  </svg>
)

const GoalFilter = ({ filter, goals, children }) => {
  const [mutate] = useMutation(changeGoalPreferences, {
    update: (proxy, { data: { changeGoalPreferences: _id } }) => {
      try {
        const { fetchUserDevelopmentPlan: DP } = proxy.readQuery({
          query: fetchUserDevelopmentPlan
        })
        proxy.writeQuery({
          query: fetchUserDevelopmentPlan,
          data: {
            fetchUserDevelopmentPlan: {
              ...DP,
              selectedGoalId: _id
            }
          }
        })
      } catch (err) {}
      try {
        const { fetchUserGoals: cachedGoals } = proxy.readQuery({
          query: fetchUserGoals
        })
        proxy.writeQuery({
          query: fetchUserGoals,
          data: {
            fetchUserGoals: cachedGoals.map(goal => ({
              ...goal,
              isSelectedGoal: goal._id === _id
            }))
          }
        })
      } catch (err) {}
    }
  })
  const { pathname, search } = useLocation()
  const params = new URLSearchParams(search)
  const paramPathId = params.get('path')

  const history = useHistory()

  const filterGroups = []

  goals.forEach(goal => {
    const findGroup = group =>
      group.every(g => g.fromPath && g.fromPath._id === goal.fromPath._id)

    if (goal.fromPath) {
      const existingGroup = filterGroups.find(findGroup)
      if (existingGroup) {
        const ix = filterGroups.findIndex(findGroup)
        filterGroups.splice(ix, 1, [...existingGroup, goal])
        return
      }
    }
    filterGroups.push([goal])
  })

  if (filterGroups.length === 0) {
    filterGroups.push(goals)
  }

  const filterOptions = filterGroups
    .filter(group => group.some(({ status }) => status === 'ACTIVE'))
    .map((group, ix) => {
      const isPath = group.some(({ fromPath }) => !!fromPath)

      const activeGoals = group.filter(({ status }) => status === 'ACTIVE')
      const firstGoal = isPath
        ? activeGoals.reduce((acc, { learningPathIndex, ...rest }) => {
            if (acc.learningPathIndex > learningPathIndex) {
              return {
                learningPathIndex,
                ...rest
              }
            }
            return acc
          }, activeGoals[0])
        : activeGoals[0]

      const name = !isPath ? firstGoal.goalName : firstGoal.fromPath.name

      const isPrivate = firstGoal.isPrivate
      return {
        _id: firstGoal._id,
        goals: group,
        name,
        isPath,
        isPrivate,
        pathId: isPath ? firstGoal.fromPath._id : null
      }
    })

  const onSubmit = _id => {
    // window.location.search = 'learner=true'
    // window.history.replaceState({}, document.title, window.location.origin + window.location.pathname)

    mutate({
      variables: {
        selectedGoalId: _id
      }
    })
      .then(() => {
        const option = filterOptions.find(option => option._id === _id)
        // changeFilter(option)
        Notification({
          type: 'success',
          message: `You're now working on ${option?.name}`,
          duration: 3000,
          offset: 90
        })
      })
      .catch(e => {
        captureFilteredError(e)
        Notification({
          type: 'success',
          message: `Something went wrong`,
          duration: 3000,
          offset: 90
        })
      })
  }

  useEffect(() => {
    let timeout
    if (paramPathId) {
      const paramPathGoals = goals
        .filter(goal => goal.fromPath?._id === paramPathId)
        .filter(goal => goal.status === 'ACTIVE')
        .sort((a, b) => a.learningPathIndex - b.learningPathIndex)

      if (paramPathGoals.length > 0) {
        ;(async () => {
          try {
            await mutate({
              variables: {
                selectedGoalId: paramPathGoals[0]._id
              }
            })
          } catch (err) {
            captureFilteredError(err)
          }
        })()
      }

      timeout = setTimeout(() => history.replace(pathname), 300)
    }

    return () => clearTimeout(timeout)
  }, [paramPathId, mutate])

  if (filterOptions.length === 0) {
    const completedGoal = filter && goals.find(goal => filter._id === goal._id)

    if (completedGoal) return <GoalItemDashboard {...completedGoal} completed />

    return children
  }

  const selectOptions = filterOptions.map(
    ({ _id, isPath, name, isPrivate }, ix) => (
      <Select.Option key={ix} value={_id} label={name}>
        {name}
        {isPrivate && <span style={{ color: '#5a55ab' }}> (Private)</span>}
      </Select.Option>
    )
  )

  const currentFilter = filterOptions.find(option =>
    option.goals.some(goal => goal._id === filter?._id)
  )

  const currentGroup = currentFilter?.goals || []

  currentGroup.sort((a, b) => b.learningPathIndex - a.learningPathIndex)

  const currentGoal = currentGroup.find(goal => filter._id === goal._id)

  const completedGoal =
    !currentGoal && filter && goals.find(goal => filter._id === goal._id)

  const showNextGoal = () => {
    const nextGoal = currentGroup.find(
      goal => goal.learningPathIndex === currentGoal.learningPathIndex + 1
    )
    if (!nextGoal) return null
    return (
      <Button
        className='goal-navs-control'
        onClick={() => {
          mutate({
            variables: {
              selectedGoalId: nextGoal._id
            }
          })
        }}
      >
        <span className='goal-navs-control__span'>{`Goal ${nextGoal.learningPathIndex}: ${nextGoal.goalName}`}</span>
        <i className='icon icon-small-right' />
      </Button>
    )
  }

  const showPreviousGoal = () => {
    const prevGoal = currentGroup.find(
      goal => goal.learningPathIndex === currentGoal.learningPathIndex - 1
    )
    if (!prevGoal) return null
    return (
      <Button
        className='goal-navs-control'
        onClick={() => {
          mutate({
            variables: {
              selectedGoalId: prevGoal._id
            }
          })
        }}
      >
        <i className='icon icon-small-right icon-rotate-180' />
        <span className='goal-navs-control__span'>{`Goal ${prevGoal.learningPathIndex}: ${prevGoal.goalName}`}</span>
      </Button>
    )
  }
  return (
    <div>
      <div className='development-plan__milestones-heading'>
        <div className='heading-title'>
          <img src={Droppin} alt='Pin Icon' style={{ marginRight: '10px' }} />
          {filter === null
            ? 'Select a goal/path to work on'
            : `You are working on`}
          :{' '}
        </div>
        <Select
          value={currentFilter?._id}
          onChange={value => onSubmit(value)}
          placeholder='Choose something to work on'
        >
          {selectOptions}
        </Select>
        {currentFilter?.pathId ? (
          <Link to={`/learning-path/${currentFilter.pathId}`}>
            <Button className='heading-path-overview'>
              {/* <i style={{ marginRight: '10px' }} className="el-icon-circle-check" /> */}
              <ReadOverview /> Read Path Overview
            </Button>
          </Link>
        ) : (
          currentFilter && (
            <Link to={`/plan/${filter._id}?edit=1`}>
              <Button className='heading-path-overview'>
                {/* <i style={{ marginRight: '10px' }} className="el-icon-circle-check" /> */}
                <ChangeYourPath /> Change your path
              </Button>
            </Link>
          )
        )}
      </div>
      {currentGroup && currentGroup.length > 1 && (
        <div className='development-plan__controls-wrapper__header'>
          {currentGroup.reverse().map((el, index) => {
            return (
              <div
                key={`goal-nav:${el._id}`}
                className='development-plan__goal-control'
              >
                <Button
                  className={`goal-navs ${
                    el._id === currentGoal._id ? 'active' : ''
                  } ${el.status === 'PAST' ? 'completed-goal' : ''}`}
                  onClick={() => {
                    mutate({
                      variables: {
                        selectedGoalId: el._id
                      }
                    })
                  }}
                >
                  {`${index + 1} goal`}
                </Button>
                {index < currentGroup.length - 1 && (
                  <div
                    className={`line ${
                      el._id === currentGoal._id ? 'active' : ''
                    } ${el.status === 'PAST' ? 'completed-goal' : ''}`}
                  />
                )}
              </div>
            )
          })}
        </div>
      )}
      {currentGoal && (
        <GoalItemDashboard
          {...currentGoal}
          completed={currentGoal.status === 'PAST'}
        />
      )}
      {completedGoal && <GoalItemDashboard {...completedGoal} completed />}
      {children}
      {filter && filter.isPath && (
        <div className='development-plan__controls-wrapper__footer'>
          <div className='development-plan__goal-control'>
            {showPreviousGoal()}
          </div>
          <div className='development-plan__goal-control'>{showNextGoal()}</div>
        </div>
      )}
    </div>
  )
}

const Wrapper = ({ children, goals, filter }) => {
  if (goals.length > 0) {
    return (
      <GoalFilter goals={goals} filter={filter}>
        {children}
      </GoalFilter>
    )
  }
  return children
}

export default Wrapper
