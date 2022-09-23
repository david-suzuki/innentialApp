import React, { useState } from 'react'
import { Tab, TabContent, Tabs, TabsList, Contact } from './'
import { ReactComponent as IconSliders } from '../../static/sliders.svg'
import { ReactComponent as IconPath } from '../../static/path.svg'
import { ReactComponent as IconHelpCircle } from '../../static/help-circle.svg'
import { LearningPathDashboard } from '../learning-paths'
import NewSettingSelectionList from './NewSettingSelectionList'
import NewSettingContentList from './NewSettingContentList'
import onboardingContentListStyle from '../../styles/onboardingContentListStyles'
import { useMutation } from 'react-apollo'
import {
  fetchUserGoals,
  fetchUserDevelopmentPlan,
  createLearningGoal
} from '../../api'
import Container from '../../globalState'
import { Button, Notification } from 'element-react'
import { LoadingSpinner } from '../general'
import { FiltersSmall } from '../learning-content/components/filters'

const BigTab = ({ children, Icon, recommended, shine, isActiveTab }) => {
  return (
    <>
      {shine && !isActiveTab && <div className='onboarding__big-tab__shine' />}
      <div
        className={`onboarding__big-tab ${
          recommended ? 'onboarding__big-tab--recommended' : ''
        }`}
      >
        <Icon />
        {children}
      </div>
    </>
  )
}
// const tabChoices = ['Existing paths', 'Create it yourself', 'Not sure']

const LearningPathNewSetting = ({ neededSkills }) => {
  const {
    developmentPlan,
    nextStepTab,
    setNextStepTab,
    filters,
    filtersDispatch,
    resetNextStepState
  } = Container.useContainer()

  const [mutation, { loading }] = useMutation(createLearningGoal, {
    update: (cache, { data: { createLearningGoal: newGoal } }) => {
      try {
        const { fetchUserGoals: goals } = cache.readQuery({
          query: fetchUserGoals
        })
        cache.writeQuery({
          query: fetchUserGoals,
          data: {
            fetchUserGoals: [newGoal, ...goals]
          }
        })
      } catch (e) {}
      try {
        const { fetchUserDevelopmentPlan: dp } = cache.readQuery({
          query: fetchUserDevelopmentPlan
        })
        cache.writeQuery({
          query: fetchUserDevelopmentPlan,
          data: {
            fetchUserDevelopmentPlan: {
              ...dp,
              selectedGoalId: newGoal._id
            }
          }
        })
      } catch (e) {}
    }
  })

  const generateNameForSkills = (skills = []) =>
    skills.length > 0
      ? `Learn about ${skills
          .slice(0, 3)
          .map(({ name }, i, { length }) => {
            if (i === 0) return name
            if (i < length - 1) return `, ${name}`
            if (i === length - 1 && skills.length < 4) return ` and ${name}`
            return `, ${name} and others`
          })
          .join('')}`
      : ''

  const setDevelopmentPlan = () => {
    mutation({
      variables: {
        goal: {
          goalName: generateNameForSkills(neededSkills),
          goalType: 'PERSONAL',
          relatedSkills: neededSkills.map(skill => skill.skillId || skill._id),
          measures: [],
          developmentPlan: {
            content: developmentPlan.map(
              ({
                _id: contentId,
                type: contentType,
                price: { value: price },
                availableSubscription
              }) => ({
                contentId,
                contentType,
                price,
                subscriptionAvailable: availableSubscription
              })
            ),
            mentors: []
          }
        }
      }
    })
      .then(({ data: { createLearningGoal: result } }) => {
        if (result !== null) {
          resetNextStepState()
          Notification({
            type: 'success',
            message: `You can now begin working on your new learning path!`,
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
  }

  return (
    <div style={{ marginTop: '40px' }}>
      <Tabs
        noBorders
        box
        flex
        onChange={i => setNextStepTab(i)}
        initialActiveTabIndex={nextStepTab}
        maxWidth='800px'
      >
        <TabsList>
          <Tab>
            <BigTab Icon={IconPath} shine isActiveTab={nextStepTab === 0}>
              Get a recommendation
            </BigTab>
          </Tab>
          <Tab>
            <BigTab Icon={IconSliders}>Create own Learning Path</BigTab>
          </Tab>
          {/* <Tab>
            <BigTab Icon={IconHelpCircle} recommended>
              Not sure what to choose?
            </BigTab>
          </Tab> */}
        </TabsList>
        <TabContent>
          <LearningPathDashboard
            dashboard
            neededSkills={neededSkills.map(({ _id, skillId, name }) => ({
              _id: skillId || _id,
              name,
              skillLevel: 0
            }))}
          />
        </TabContent>
        <TabContent>
          <FiltersSmall
            filters={filters}
            filtersDispatch={filtersDispatch}
            neededSkills={neededSkills.map(({ _id, skillId, name }) => ({
              _id: skillId || _id,
              name
            }))}
          />

          <div className='onboarding__learning-items-container'>
            <NewSettingSelectionList
              neededSkills={neededSkills.map(({ _id, skillId, name }) => ({
                _id: skillId || _id,
                name
              }))}
            />

            <NewSettingContentList
              neededSkills={neededSkills.map(({ _id, skillId, name }) => ({
                _id: skillId || _id,
                name
              }))}
            />
          </div>
        </TabContent>
        {/* <TabContent>
          <Contact />
        </TabContent> */}
      </Tabs>
      {nextStepTab === 1 && (
        <div className='page-footer page-footer--fixed'>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <Button
              type='primary'
              size='large'
              disabled={developmentPlan.length === 0}
              onClick={setDevelopmentPlan}
            >
              <strong style={{ fontFamily: 'Poppins', fontSize: '16px' }}>
                Save learning path
              </strong>
            </Button>
          )}
        </div>
      )}
      <style jsx>{onboardingContentListStyle}</style>
    </div>
  )
}

export default LearningPathNewSetting
