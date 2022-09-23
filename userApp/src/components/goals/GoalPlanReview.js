import React, { useEffect } from 'react'
import { withRouter, Redirect } from 'react-router-dom'
import { GoalItem, DevelopmentPlanGoalOverview } from '../ui-components'
import { Query } from 'react-apollo'
import { fetchContentPlanForGoal } from '../../api'
import { captureFilteredError, LoadingSpinner } from '../general'
import { DevelopmentPlanSetting } from '../development-plans'
import goalPlanReviewStyle from '../../styles/goalPlanReviewStyle'
import history from '../../history'

export default withRouter(
  ({
    match: { params },
    location: { state, search },
    currentUser,
    displayFilters,
    setLibraryHighlight
  }) => {
    // useEffect(() => {
    //   const mainWrapper = document.getElementById('main-wrapper')
    //   mainWrapper.className = 'container-main__wrapper wrapper--right'

    //   return () => (mainWrapper.className = 'container-main__wrapper')
    // }, [])

    // useEffect(() => {
    //   const mainWrapper = document.getElementById('main-wrapper')
    //   if (!mainWrapper.classList.contains('wrapper--right')) {
    //     mainWrapper.classList.add('wrapper--right')
    //   }
    // })
    // useEffect(() => {
    //   const mainWrapper = document.getElementById('main-overlay')
    //   if (displayFilters) {
    //     mainWrapper.className = 'container-main learning-feed'
    //   } else {
    //     mainWrapper.className = 'container-main'
    //   }

    //   return () => (mainWrapper.className = 'container-main')
    // }, [displayFilters])

    const searchParams = new URLSearchParams(search)

    const onlyEdit = searchParams.get('edit')

    const { _id, leader, roles } = currentUser
    const { goalId } = params
    const permission = roles.indexOf('ADMIN') !== -1 || leader

    if (!goalId) return <Redirect to={{ pathname: '/' }} />

    const isDashboardDraft = state && state.dashboardDraft
    const addContent = state && state.addContent
    addContent && delete state.addContent

    return (
      <Query
        query={fetchContentPlanForGoal}
        variables={{ goalId }}
        fetchPolicy='cache-and-network'
      >
        {({ data, loading, error }) => {
          if (error) {
            captureFilteredError(error)
            return <Redirect to={{ pathname: '/error-page/404' }} />
          }
          if (loading) return <LoadingSpinner />

          if (data && !data.fetchContentPlanForGoal) {
            return <Redirect to={{ pathname: '/error-page/404' }} />
          }

          if (data && data.fetchContentPlanForGoal !== null) {
            const {
              fetchContentPlanForGoal: {
                user,
                goal,
                developmentPlan: { content, mentors }
              }
            } = data
            const { relatedSkills } = goal

            const settingProps = {
              addContent,
              isDashboardDraft,
              user,
              // onBackButtonClick: history.goBack,
              selectedContent: content.map(({ content, ...rest }) => ({
                ...rest, // ENSURE IT STAYS LIKE THIS TO PREVENT ID MISMATCH
                ...content
              })),
              selectedMentors: mentors,
              neededSkills: relatedSkills.map(({ _id, name }) => ({
                _id,
                name
              })),
              goalId: goal._id,
              currentUser,
              status: goal.status
            }

            if (user === _id || (permission && goal.status === 'ACTIVE')) {
              if ((addContent || onlyEdit) && user === _id) {
                return (
                  <div className='goal__wrapper'>
                    <DevelopmentPlanSetting
                      {...settingProps}
                      onBackButtonClick={history.goBack}
                    >
                      <GoalItem {...goal} measures={[]} hideMeasureCount />
                    </DevelopmentPlanSetting>
                    <style jsx>{goalPlanReviewStyle}</style>
                  </div>
                )
              } else {
                return (
                  <DevelopmentPlanGoalOverview
                    onBackButtonClick={history.goBack}
                    content={content
                      // .filter(({ status }) => status !== 'INACTIVE')
                      .map(({ content, ...rest }) => ({
                        ...rest, // ENSURE IT STAYS LIKE THIS TO PREVENT ID MISMATCH
                        ...content
                      }))}
                    mentors={mentors}
                    permission={permission}
                    own={user === _id}
                    settingProps={settingProps}
                    goal={goal}
                    setLibraryHighlight={setLibraryHighlight}
                  >
                    <GoalItem {...goal} measures={[]} hideMeasureCount />
                  </DevelopmentPlanGoalOverview>
                )
              }
            }
          }
          return <Redirect to={{ pathname: '/error-page/404' }} />
        }}
      </Query>
    )
  }
)
