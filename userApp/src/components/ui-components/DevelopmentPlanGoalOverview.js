import React, { useState } from 'react'
import developmentPlanStyle from '../../styles/developmentPlanStyle'
import { DevelopmentPlanOverviewTabs, Statement } from './'
import { DevelopmentPlanSetting } from '../development-plans'
import { Button } from 'element-react'
import { useMutation } from 'react-apollo'
import {
  // changeGoalPreferences,
  // fetchUserDevelopmentPlan,
  setContentStatus
} from '../../api'
// import history from '../../history'
// import { captureFilteredError } from '../general'

export default ({
  children,
  onBackButtonClick,
  content,
  mentors,
  permission,
  own,
  settingProps,
  goal,
  setLibraryHighlight
}) => {
  const [onSetting, setOnSetting] = useState(false)
  // const [mutation, { loading }] = useMutation(changeGoalPreferences, {
  //   variables: {
  //     selectedGoalId: goal._id
  //   },
  //   update: (proxy, { data: { changeGoalPreferences: _id } }) => {
  //     const { fetchUserDevelopmentPlan: DP } = proxy.readQuery({
  //       query: fetchUserDevelopmentPlan
  //     })
  //     proxy.writeQuery({
  //       query: fetchUserDevelopmentPlan,
  //       data: {
  //         fetchUserDevelopmentPlan: {
  //           ...DP,
  //           selectedGoalId: _id
  //         }
  //       }
  //     })
  //   }
  // })
  const [contentStatusMutation] = useMutation(setContentStatus)

  if (onSetting) {
    return (
      <DevelopmentPlanSetting
        {...settingProps}
        onBackButtonClick={() => setOnSetting(false)}
      >
        {children}
      </DevelopmentPlanSetting>
    )
  } else {
    return (
      <div>
        <div className='development-plan__heading'>
          <i
            className='development-plan__back-button icon icon-small-right icon-rotate-180'
            onClick={onBackButtonClick}
          />
          <div className='development-plan__heading-info'>
            <h1>Development Plan</h1>
          </div>
        </div>
        {children}
        {content.length + mentors.length > 0 ? (
          <>
            <DevelopmentPlanOverviewTabs
              content={content}
              mentors={mentors}
              canRecommend={permission}
              selectedGoal={goal}
              setContentStatusMutation={
                own && goal.status === 'ACTIVE'
                  ? contentStatusMutation
                  : undefined
              }
              setLibraryHighlight={setLibraryHighlight}
            >
              {own && (
                <Button type='warning' onClick={() => setOnSetting(true)}>
                  Edit
                </Button>
              )}
            </DevelopmentPlanOverviewTabs>
            {/* {own && goal.status === 'ACTIVE' && (
              <div className="page-footer page-footer--fixed">
                <Button
                  size="large"
                  type="success"
                  loading={loading}
                  onClick={() => {
                    mutation()
                      .then(() => {
                        history.push('/')
                      })
                      .catch(err => {
                        captureFilteredError(err)
                        history.push('/error-page/500')
                      })
                  }}
                >
                  Start learning
                </Button>
              </div>
            )} */}
          </>
        ) : own ? (
          <Statement
            button='Add learning to goal'
            onButtonClicked={() => setOnSetting(true)}
            content='No content in development plan for goal'
          />
        ) : (
          <Statement content='No content in development plan for goal' />
        )}
        <style jsx>{developmentPlanStyle}</style>
      </div>
    )
  }
}
