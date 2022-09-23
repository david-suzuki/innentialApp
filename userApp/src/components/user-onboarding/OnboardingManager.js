import React, { useEffect, useState } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
// styles
import '../../styles/theme/button.css'
import '../../styles/theme/input.css'
import '../../styles/theme/select.css'
import '../../styles/theme/icon.css'
import '../../styles/theme/cascader.css'
import '../../styles/theme/message.css'
import bottomNavStyle from '../../styles/bottomNavStyle'
import onboardingStyle from '../../styles/onboardingStyle'
// end styles
import { Authenticate } from '../general'
import Container from '../../globalState'
import { Pager } from '../ui-components'
import FootPager from '../ui-components/FootPager'

// import SignupPage from './SignupPage'
// import OrganizationCreateForm from './OrganizationCreate'

import {
  AboutYou,
  // Page2SkillPreferences,
  // Page3PersonalInterests,
  SkillLevels,
  SignupPage,
  OrganizationDetails,
  Loading,
  LearningPreferences,
  LearningSkills,
  DevelopmentPlanOnboarding,
  ContextPage,
  // ContactPage,
  SurveyPage,
  LoadingNextSteps,
  SurveyDecisionPage,
  SurveyCompletedPage,
  LearningSkillLevels,
  AssignedPathsPage
} from './pages'
import { OnboardingSelectionList, Preferences } from './pages/components'
import {
  initializeHotjarTracker,
  initializeSegment,
  isNotInnentialEmail
} from '../../utils'
import history from '../../history'
// import { Page2SkillLevels } from './Page2SkillLevels'
// import Page3PersonalInterests from './Page3PersonalInterests'

// import FinalPage from './FinalPage'

// const SkillsFrameWorkHandler = ({ pathname, container }) => {
//   const {
//     onboardingState: {
//       framework: {
//         frameworkId,
//         skillName,
//         level
//       }
//     }
//   } = container.useContainer()
//   if (pathname === '/onboarding/my-skill-levels')
//     return (
//       <div className="onboarding__skills-framework">
//         <SkillsFrameworkOnboarding
//           frameworkId={frameworkId}
//           selectedLevel={level}
//           skillName={skillName}
//         />
//       </div>
//     )
//   return null
// }

const pageLookup = {
  security: 'Personal details',
  organization: 'Personal details',
  'about-you': 'Personal details',
  'my-skill-levels': 'Personal details',
  'how-to': 'Diagnosis',
  'assigned-paths': 'Diagnosis',
  'survey-decision': 'Diagnosis',
  'survey-completed': 'Diagnosis',
  survey: 'Diagnosis',
  contact: 'Diagnosis',
  'skill-preferences': 'Diagnosis',
  'skill-levels': 'Diagnosis',
  'learning-preferences': 'Diagnosis',
  'development-plan': 'Learning Path'
}

const getCurrentPage = (pathname, pages) => {
  const page = pages.indexOf(pageLookup[pathname.split('/onboarding/')[1]])

  return page !== -1 ? page : 40
}

const OnboardingManager = ({ location: { state, pathname }, ...rest }) => {
  /* TEMP DATA START */

  // const fakeState = {
  //   onboardingInfo: {
  //     firstAdmin: true,
  //     skillsToEvaluate: [],
  //     onboarded: false,
  //     userDetailsProvided: false,
  //     hasAssignedPath: true
  //   },
  //   user: {
  //     email: 'albert@waat.eu',
  //     firstName: 'FIRSTNAME',
  //     lastName: 'LASTNAME',
  //     organizationName: 'ORGANIZATION',
  //     roleAtWork: 'ROLE',
  //     roleId: null,
  //     roles: ['USER', 'ADMIN'],
  //     // selectedWorkSkills: [],
  //     status: 'active',
  //     __typename: 'User',
  //     _id: '5f8d742841ad4f384e2c92f9'
  //   },
  //   selectedWorkSkills: []
  //   // backToDevPlan: true
  // }

  // const state = fakeState

  /* TEMP DATA END */

  const { user, onboardingInfo } = state

  useEffect(() => {
    let unlisten = () => {}
    // START UP INTERCOM
    if (process.env.NODE_ENV !== 'development') {
      const app_id = process.env.REACT_APP_STAGING ? 'prw4a6p4' : 'f8xjeosr' // eslint-disable-line
      window.Intercom('boot', {
        app_id,
        user_id: user._id,
        email: user.email,
        'Demo Account': user.isDemoUser,
        'User Role': user.roles.includes('ADMIN') ? 'Admin' : 'User',
        'Inbound User': onboardingInfo.shortOnboarding
      })
    }
    if (
      isNotInnentialEmail(user.email) &&
      process.env.NODE_ENV === 'production' &&
      !process.env.REACT_APP_STAGING
    ) {
      if (!window.analytics) {
        initializeSegment()

        window.analytics &&
          window.analytics.identify(user._id, {
            organizationName: user.organizationName
          })
      }

      if (!window.hj) {
        initializeHotjarTracker({
          leader: user.leader,
          admin: user.roles.indexOf('ADMIN') !== -1,
          organizationName: user.organizationName,
          id: user._id
        })
      }
    }

    unlisten = history.listen(location => {
      // LISTEN FOR PAGE VIEWS (SEGMENT/ANALYTICS)
      window.analytics && window.analytics.page(location.pathname)
    })

    return unlisten
  }, [user])

  const {
    firstAdmin,
    skillsToEvaluate: initialSkills,
    onboarded,
    userDetailsProvided,
    shortOnboarding,
    technicianOnboarding,
    hasAssignedPath
  } = onboardingInfo // eslint-disable-line

  const skillsToEvaluate = Array.isArray(initialSkills) ? initialSkills : []

  const [showSkillPage, setShowSkillPage] = useState(
    skillsToEvaluate.length > 0
  )

  const {
    roles,
    _id: userId,
    firstName,
    lastName,
    organizationName,
    roleAtWork,
    roleId,
    corporate
    // selectedWorkSkills
  } = user

  const isAdmin = roles.indexOf('ADMIN') !== -1

  const onlySkills = onboarded && skillsToEvaluate.length > 0

  const pages =
    onlySkills || shortOnboarding
      ? []
      : [
          // ...(!userDetailsProvided ? userDetailsPages : []),
          // showSkillPage && 'Skill levels',
          !userDetailsProvided || showSkillPage ? 'Personal details' : null,
          !technicianOnboarding && 'Diagnosis',
          !technicianOnboarding && 'Learning Path'
          // 'Skills to learn',
          // 'Learning preferences',
          // 'Development plan'
        ].filter(item => !!item)

  const currentPage = getCurrentPage(pathname, pages)
  // console.log(currentPage)
  return (
    <div className='onboarding__wrapper'>
      <Container.Provider
        initialState={{
          firstName,
          lastName,
          roleId,
          roleAtWork,
          // technicianOnboarding,
          selectedWorkSkills: skillsToEvaluate.map(
            ({ __typename, ...skill }) => ({ ...skill, level: 0 })
          )
        }}
      >
        <div className='onboarding__sidebar'>
          <div>
            <img
              className='onboarding-logo'
              alt='Innential Logo'
              src={require('../../static/innential-logo.svg')}
            />
            {currentPage !== 40 && (
              <Pager
                screenList={pages}
                currentScreen={currentPage}
                showSkillPage={showSkillPage}
                userDetailsProvided={userDetailsProvided}
                firstAdmin={firstAdmin}
                pathname={pathname}
              />
            )}
          </div>
          {currentPage === pages.indexOf('Learning Path') && (
            <div>
              <Preferences container={Container} routeState={state} />
            </div>
          )}
          <div className='onboarding__sidebar-background' />
        </div>
        {/* <SkillsFrameWorkHandler pathname={pathname} container={Container} /> */}
        <div
          id='page-wrapper'
          className='onboarding__page-wrapper'
          style={{
            ...((pathname === '/onboarding/almost-done' ||
              pathname === '/onboarding/wait-for-confirmation') && {
              // backgroundColor: '#F6F8FC',
              background: '#F6F8FC'
            })
          }}
        >
          <Switch>
            <Route
              exact
              path='/'
              component={() => <Redirect to='/onboarding/security' />}
            />

            <Route
              exact
              path='/onboarding/security'
              component={() => (
                <SignupPage
                  userId={userId}
                  // firstName={firstName}
                  // lastName={lastName}
                  // isAdmin={isAdmin}
                  skipDataPrivacy={shortOnboarding}
                  goToOrganizationPage={firstAdmin}
                  // cantDeleteInformation={firstAdmin}
                  routeState={state}
                  corporate={corporate}
                />
              )}
            />

            <Authenticate>
              <Route
                exact
                path='/onboarding/organization'
                component={() => (
                  <OrganizationDetails
                    userId={userId}
                    organizationName={organizationName}
                    routeState={state}
                  />
                )}
              />

              <Route
                exact
                path='/onboarding/about-you'
                component={() => (
                  <AboutYou
                    routeState={state}
                    container={Container}
                    technicianOnboarding={technicianOnboarding}
                    organizationName={organizationName}
                    // setShowSkillPage={setShowSkillPage}
                    firstAdmin={firstAdmin}
                    hasAssignedPath={hasAssignedPath}
                    // skip={corporate}
                    // firstName={firstName}
                    // lastName={lastName}
                    // roleAtWork={roleAtWork}
                    // roleId={roleId}
                  />
                )}
              />

              {hasAssignedPath && (
                <Route
                  exact
                  path='/onboarding/assigned-paths'
                  component={() => <AssignedPathsPage routeState={state} />}
                />
              )}

              <Route
                exact
                path='/onboarding/how-to'
                component={() => (
                  <ContextPage
                    routeState={state}
                    userDetailsProvided={userDetailsProvided}
                    container={Container}
                  />
                )}
              />

              {/* <Route
                exact
                path='/onboarding/my-skill-levels'
                component={() => (
                  <SkillLevels
                    routeState={state}
                    container={Container}
                    onlySkills={onlySkills}
                    userDetailsProvided={userDetailsProvided}
                  />
                )}
              /> */}

              <Route
                exact
                path='/onboarding/skill-preferences'
                component={() => (
                  <LearningSkills
                    routeState={state}
                    container={Container}
                    userDetailsProvided={userDetailsProvided}
                  />
                )}
              />

              <Route
                exact
                path='/onboarding/skill-levels'
                component={() => (
                  <LearningSkillLevels
                    routeState={state}
                    container={Container}
                  />
                )}
              />

              {/* <Route
                exact
                path='/onboarding/contact'
                component={() => <ContactPage routeState={state} />}
              /> */}

              <Route
                exact
                path='/onboarding/survey-decision'
                component={() => (
                  <SurveyDecisionPage
                    container={Container}
                    routeState={state}
                  />
                )}
              />

              <Route
                exact
                path='/onboarding/survey'
                component={() => (
                  <SurveyPage userId={userId} routeState={state} />
                )}
              />

              <Route
                exact
                path='/onboarding/survey-completed'
                component={() => (
                  <SurveyCompletedPage
                    container={Container}
                    routeState={state}
                  />
                )}
              />

              <Route
                exact
                path='/onboarding/learning-preferences'
                component={() => (
                  <LearningPreferences
                    routeState={state}
                    container={Container}
                  />
                )}
              />

              <Route
                exact
                path='/onboarding/my-selection'
                component={() => (
                  <OnboardingSelectionList
                    routeState={state}
                    container={Container}
                  />
                )}
              />

              <Route
                exact
                path='/onboarding/development-plan'
                component={() => (
                  <DevelopmentPlanOnboarding
                    routeState={state}
                    container={Container}
                  />
                )}
              />

              <Route
                path='/onboarding/wait-for-confirmation'
                component={() => <LoadingNextSteps container={Container} />}
              />

              <Route
                path='/onboarding/almost-done'
                component={() => (
                  <Loading routeState={state} container={Container} />
                )}
              />
            </Authenticate>
          </Switch>
        </div>

        {currentPage !== 40 && (
          <div className='footer-pager-container'>
            <FootPager screenList={pages} currentScreen={currentPage} />
          </div>
        )}
      </Container.Provider>
      <style jsx>{bottomNavStyle}</style>
      <style jsx>{onboardingStyle}</style>
    </div>
  )

  // console.log({ rest })
  // if (user.roles.includes('ADMIN')) {
  //   if (two && two === 'NOT_FIRST_ADMIN') {
  //     return (
  //       <OnboardingFormAdmin
  //         prims={user}
  //         shouldSkipOrganization
  //         onlySkills={onlySkills}
  //         isProd={isProd}
  //       />
  //     )
  //   } else {
  //     return (
  //       <OnboardingFormAdmin
  //         prims={user}
  //         onlySkills={onlySkills}
  //         cantDeleteInformation
  //         isProd={isProd}
  //       />
  //     )
  //   }
  // } else {
  //   return <OnboardingForm prims={user} onlySkills={onlySkills} isProd={isProd} />
  // }
}

const ManagerWrapper = ({ location, ...rest }) => {
  if (!location.state) return <Redirect to='/' />
  return <OnboardingManager location={location} {...rest} />
}

export default ManagerWrapper
