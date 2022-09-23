import React, { useState } from 'react'
import {
  Contact,
  FiltersOnboarding,
  LearningPathSelection,
  NextButton,
  OnboardingContentList,
  OnboardingSelectionList,
  Preferences
} from './components'
import {
  LearningPathItems,
  Page,
  Tab,
  TabContent,
  Tabs,
  TabsList
} from '../../ui-components'
import { Link, Redirect, useHistory } from 'react-router-dom'
import { Button, Notification } from 'element-react'
import { ReactComponent as IconSliders } from '../../../static/sliders.svg'
import { ReactComponent as IconPath } from '../../../static/path.svg'
import { ReactComponent as IconHelpCircle } from '../../../static/help-circle.svg'

import onboardingContentListStyle from '../../../styles/onboardingContentListStyles'
import { useGA4React } from 'ga-4-react'
import { useQuery } from 'react-apollo'
import { skillsExistInPaths } from '../../../api'
import variables from '../../../styles/variables'
import { LoadingSpinner, captureFilteredError } from '../../general'

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

const FiltersWrapper = ({ filters, filtersDispatch, neededSkills, user }) => {
  return (
    <div style={{ marginTop: '5%' }}>
      <h3 className='content-title'>Content preferences</h3>
      <div className='filters__container'>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            position: 'relative'
          }}
        >
          <h3 className='content-title-inner'>Content preferences</h3>
          <FiltersOnboarding
            filters={filters}
            filtersDispatch={filtersDispatch}
            neededSkills={neededSkills.map(({ _id, name }) => ({
              _id,
              name
            }))}
            user={user}
          />
        </div>
      </div>
    </div>
  )
}

// Tabs and TabContents

const RecommendationTab = ({ tabIndex, title, shine }) => {
  return (
    <BigTab
      Icon={IconPath}
      shine={shine && tabIndex !== 0}
      isActiveTab={tabIndex === 0}
    >
      {title}
    </BigTab>
  )
}

const CreateOwnLearningPathTab = ({ shine, tabIndex }) => {
  return (
    <BigTab Icon={IconSliders} shine={shine && tabIndex !== 0}>
      Create own Learning Path
    </BigTab>
  )
}

const NotSureTab = () => {
  return (
    <BigTab Icon={IconHelpCircle} recommended>
      Not sure what to choose?
    </BigTab>
  )
}

const RecommendationTabContent = ({
  neededSkills,
  clearDevelopmentPlan,
  routeState
}) => {
  return (
    <TabContent>
      <LearningPathSelection
        neededSkills={neededSkills.map(({ _id, name, level }) => ({
          _id,
          name,
          skillLevel: level
        }))}
        clearDevelopmentPlan={clearDevelopmentPlan}
        routeState={routeState}
      />
    </TabContent>
  )
}

const CreateOwnLearningPathTabContent = ({
  filters,
  filtersDispatch,
  neededSkills,
  container,
  routeState,
  contentSeen,
  developmentPlan,
  handlers,
  user
}) => {
  return (
    <TabContent>
      <FiltersWrapper
        filters={filters}
        filtersDispatch={filtersDispatch}
        neededSkills={neededSkills}
        user={user}
      />

      <div className='onboarding__learning-items-container'>
        <OnboardingSelectionList container={container} />

        <OnboardingContentList
          routeState={routeState}
          filters={filters}
          neededSkills={neededSkills.map(({ _id, name, level }) => ({
            _id,
            name,
            skillLevel: level
          }))}
          contentSeen={contentSeen}
          developmentPlan={developmentPlan}
          {...handlers}
        />
      </div>
    </TabContent>
  )
}

const NotSureTabContent = ({
  routeState,
  clearDevelopmentPlan,
  handleOnboardingChange
}) => {
  return (
    <TabContent>
      <Contact
        routeState={routeState}
        clearDevelopmentPlan={clearDevelopmentPlan}
        handleOnboardingChange={handleOnboardingChange}
      />
    </TabContent>
  )
}

// End of Tabs and TabConents

const DevelopmentPlanOnboarding = ({ routeState, container }) => {
  const ga = useGA4React()
  const initialTabIndex = -1 // START WITH NO TAB PICKED

  const { user } = routeState

  const [tabIndex, setTabIndex] = useState(initialTabIndex)
  // const [loading, setIsLoading] = useState(false)
  // useEffect(() => {
  //   setTimeout(() => setIsLoading(false), 1000)
  // }, [])

  const {
    filters,
    onboardingState: {
      developmentPlan,
      neededWorkSkills: neededSkills,
      contentSeen
    },
    onboardingFunctions: {
      appendContentSeen,
      developmentPlanHandler,
      clearDevelopmentPlan,
      setContentSeen,
      handleOnboardingChange
    },
    filtersDispatch
    // filters: { maxDuration }
  } = container.useContainer()

  // const history = useHistory()

  const handlers = { appendContentSeen, developmentPlanHandler, setContentSeen }

  const neededSkillIds = neededSkills.map(skill => skill.skillId)

  const { data, loading, error } = useQuery(skillsExistInPaths, {
    variables: {
      skillIds: neededSkillIds
    },
    fetchPolicy: 'cache-and-network'
  })

  if (loading) return <LoadingSpinner />

  if (error) {
    captureFilteredError(error)
    Notification({
      type: 'error',
      message: `Oops, something went wrong!`,
      duration: 2500,
      iconClass: 'el-icon-error',
      offset: 90
    })
  }

  if (
    neededSkills.length === 0 ||
    neededSkills.some(skill => isNaN(skill.level))
  )
    return (
      <Redirect
        to={{
          pathname: '/onboarding/skill-preferences',
          state: routeState
        }}
      />
    )

  const skillsExist = data?.skillsExistInPaths

  const tabChoices = skillsExist
    ? ['Existing paths', 'Create it yourself', 'Not sure']
    : ['Create it yourself', 'Existing paths', 'Not sure']

  return (
    <Page development>
      <div style={{ minHeight: '70vh', width: '100%' }}>
        <div className='page-content-align'>
          <h2 className='development__title'>
            It's the last step! Select a Learning Path below to start!
          </h2>
          <h4 className='development__subtitle'>
            A Learning Path is a collection of educational resources (ie.:
            online courses and videos) that we’ve hand-picked to guide towards
            mastering a new skill.
          </h4>
          {/* <div>
          <Preferences
            maxDuration={maxDuration}
            skills={neededSkills}
            routeState={routeState}
          />
        </div> */}
        </div>

        <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: 900 }}>
          Choose one of the 3 options
        </h3>
        <Tabs
          noBorders
          box
          flex
          onChange={i => {
            ga &&
              ga.gtag('event', 'picked_tab', {
                tab: tabChoices[i]
              })

            window.analytics &&
              window.analytics.track('picked_tab', {
                tab: tabChoices[i]
              })
            setTabIndex(i)
          }}
          initialActiveTabIndex={initialTabIndex}
        >
          {skillsExist ? (
            <TabsList>
              <Tab>
                <RecommendationTab
                  tabIndex={tabIndex}
                  title='Get a recommendation'
                  shine
                />
              </Tab>
              <Tab>
                <CreateOwnLearningPathTab />
              </Tab>
              <Tab>
                <NotSureTab />
              </Tab>
            </TabsList>
          ) : (
            <TabsList>
              <Tab>
                <CreateOwnLearningPathTab shine tabIndex={tabIndex} />
              </Tab>
              <Tab>
                <RecommendationTab tabIndex={tabIndex} title='Paths Library' />
              </Tab>
              <Tab>
                <NotSureTab />
              </Tab>
            </TabsList>
          )}

          {skillsExist
            ? [
                <RecommendationTabContent
                  key='recommended'
                  neededSkills={neededSkills}
                  clearDevelopmentPlan={clearDevelopmentPlan}
                  routeState={routeState}
                />,
                <CreateOwnLearningPathTabContent
                  key='create-own'
                  filters={filters}
                  filtersDispatch={filtersDispatch}
                  neededSkills={neededSkills}
                  container={container}
                  routeState={routeState}
                  contentSeen={contentSeen}
                  developmentPlan={developmentPlan}
                  handlers={handlers}
                  user={user}
                />,
                <NotSureTabContent
                  key='not-sure'
                  routeState={routeState}
                  clearDevelopmentPlan={clearDevelopmentPlan}
                  handleOnboardingChange={handleOnboardingChange}
                />
              ]
            : [
                <CreateOwnLearningPathTabContent
                  key='create-own'
                  filters={filters}
                  filtersDispatch={filtersDispatch}
                  neededSkills={neededSkills}
                  container={container}
                  routeState={routeState}
                  contentSeen={contentSeen}
                  developmentPlan={developmentPlan}
                  handlers={handlers}
                  user={user}
                />,
                <RecommendationTabContent
                  key='recommended'
                  neededSkills={neededSkills}
                  clearDevelopmentPlan={clearDevelopmentPlan}
                  routeState={routeState}
                />,
                <NotSureTabContent
                  key='not-sure'
                  routeState={routeState}
                  clearDevelopmentPlan={clearDevelopmentPlan}
                  handleOnboardingChange={handleOnboardingChange}
                />
              ]}
          {/* {skillsExist && createOwnLearningPathTabContent}

          {!skillsExist && createOwnLearningPathTabContent}
          {!skillsExist && recommendationTabContent}
          <NotSureTabContent routeState={routeState} /> */}
        </Tabs>
      </div>
      <div className='bottom-nav-contained dev-nav'>
        <Link
          to={{
            pathname: '/onboarding/learning-preferences',
            state: routeState
          }}
          className='bottom-nav__previous'
        >
          {/* <i className="icon icon-tail-left" /> */}
          <span>Previous step</span>
        </Link>

        <span>
          {/* <Button
            className='bottom-nav__previous'
            type='text'
            onClick={() => {
              clearDevelopmentPlan()
              history.push('/onboarding/almost-done', routeState)
            }}
          >
            <span>Skip</span>
          </Button> */}
          {tabChoices[tabIndex] === 'Create it yourself' &&
            (developmentPlan.length === 0 ? (
              <Button type='primary' disabled>
                <NextButton label='Finish setup' />
              </Button>
            ) : (
              <Link
                to={{
                  pathname: '/onboarding/almost-done',
                  state: routeState
                }}
              >
                <Button type='primary'>
                  <NextButton label='Finish setup' />
                </Button>
              </Link>
            ))}
        </span>
      </div>
      <style jsx>{onboardingContentListStyle}</style>
    </Page>
  )
}

export default DevelopmentPlanOnboarding
