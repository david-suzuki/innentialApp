import React, { useEffect } from 'react'
import {
  fetchUserDevelopmentPlan,
  setContentStatus,
  fetchUserGoals,
  fetchUserCompletedContentPlan
} from '../../api'
import { useMutation, useQuery } from 'react-apollo'
import { LoadingSpinner, captureFilteredError } from '../general'
import developmentPlanStyle from '../../styles/developmentPlanStyle'
import { Statement, DevelopmentPlanOverviewTabs } from '../ui-components'
import { Button, Notification, MessageBox, Input } from 'element-react'
import { GoalFilter } from './'
import { Link, useHistory, useLocation } from 'react-router-dom'

const handleCopyLink = url => {
  window.navigator.clipboard
    .writeText(url)
    .then(() =>
      Notification({
        type: 'info',
        message: 'Link copied to clipboard',
        duration: 2500,
        offset: 90,
        iconClass: 'el-icon-info'
      })
    )
    .catch(async () => {
      try {
        await MessageBox.alert(
          <div>
            Copy it from below:
            <Input
              value={url}
              readOnly
              onFocus={e => {
                e.target.select()
              }}
              style={{ marginTop: '15px' }}
            />
          </div>,
          'Could not write link to clipboard',
          {
            type: 'warning'
          }
        )
      } catch (e) {}
    })
}

const DevelopmentPlan = ({
  developmentPlan,
  goals,
  setContentStatusMutation,
  currentUser,
  setLibraryHighlight,
  setHighlightCompleted
}) => {
  const canRecommend =
    currentUser.roles.indexOf('ADMIN') !== -1 || currentUser.leader

  const selectedGoalId = developmentPlan?.selectedGoalId || null

  let selectedGoal = null
  let goal = null
  if (selectedGoalId !== null) {
    goal = goals.find(({ _id: goalId }) => goalId === selectedGoalId)
    if (goal) {
      if (goal.fromPath) {
        selectedGoal = {
          name: goal.fromPath.name,
          isPath: true,
          _id: selectedGoalId
        }
      } else
        selectedGoal = {
          name: goal.goalName,
          isPath: false,
          _id: selectedGoalId
        }
    }
  }

  // if (paramPathId) {
  //   const paramPathGoals = goals
  //     .filter(goal => goal.fromPath?._id === paramPathId)
  //     .filter(goal => goal.status === 'ACTIVE')
  //     .sort((a, b) => a.learningPathIndex - b.learningPathIndex)

  //   if (paramPathGoals.length > 0) {
  //     goal = paramPathGoals[0]
  //     selectedGoal = {
  //       name: paramPathGoals[0].fromPath.name,
  //       isPath: true,
  //       _id: paramPathGoals[0]._id
  //     }
  //   }
  // }

  const previouslyCompletedGoal = goals
    .filter(({ status }) => status === 'PAST')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]

  const itemsToApprove =
    goal?.developmentPlan?.content.some(content => content.approved === null) ||
    false
    
  return (
    <div>
      <div className='development-plan__container'>
        <GoalFilter filter={selectedGoal} goals={goals}>
          <DevelopmentPlanOverviewTabs
            content={
              goal?.developmentPlan?.content.map(({ content, ...rest }) => ({
                ...rest,
                ...content
              })) || []
            }
            mentors={goal?.developmentPlan?.mentors || []}
            setContentStatusMutation={setContentStatusMutation}
            canRecommend={canRecommend}
            selectedGoal={goal}
            prev={previouslyCompletedGoal}
            setLibraryHighlight={setLibraryHighlight}
            setHighlightCompleted={setHighlightCompleted}
            developmentPlanSet={!!developmentPlan}
          >
            {itemsToApprove && (
              <Button
                type='primary'
                style={{ marginRight: '10px' }}
                onClick={() => {
                  handleCopyLink(currentUser.approvalLink)
                }}
              >
                Copy approval link
              </Button>
            )}
            {/* {goal && !goal.fromPath && (
              <Link to={`/plan/${selectedGoalId}?edit=1`}>
                <Button className="goal__edit-button" type='warning'>Edit</Button>
              </Link>
            )} */}
          </DevelopmentPlanOverviewTabs>
        </GoalFilter>
      </div>
      <style jsx>{developmentPlanStyle}</style>
    </div>
  )
}

export default ({
  currentUser,
  setLibraryHighlight,
  setHighlightCompleted
}) => {
  const { data, loading, error } = useQuery(fetchUserGoals, {
    fetchPolicy: 'cache-and-network'
  })
  const { data: dPData, loading: dPLoading, error: dPError } = useQuery(
    fetchUserDevelopmentPlan,
    {
      fetchPolicy: 'cache-and-network'
    }
  )
  const [mutation] = useMutation(setContentStatus, {
    refetchQueries: [
      { query: fetchUserCompletedContentPlan, variables: { limit: 8 } }
    ]
  })

  if (loading || dPLoading) return <LoadingSpinner />

  if (error || dPError) {
    captureFilteredError(new Error(error || dPError))
    return <Statement content='Oops! Something went wrong.' />
  }

  if (data && dPData) {
    const developmentPlan = dPData.fetchUserDevelopmentPlan
    const goals = data.fetchUserGoals

    return (
      <DevelopmentPlan
        developmentPlan={developmentPlan}
        goals={goals}
        setContentStatusMutation={mutation}
        currentUser={currentUser}
        setLibraryHighlight={setLibraryHighlight}
        setHighlightCompleted={setHighlightCompleted}
      />
    )
  }
  return null
}
