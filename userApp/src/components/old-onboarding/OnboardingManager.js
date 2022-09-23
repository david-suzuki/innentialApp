import React from 'react'
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
import { SkillsFrameworkOnboarding, Pager } from '../ui-components'

import SignupPage from './SignupPage'
import OrganizationCreateForm from './OrganizationCreate'

import Page1WorkInfo from './Page1WorkInfo'
import { Page2SkillLevels } from './Page2SkillLevels'
import Page3PersonalInterests from './Page3PersonalInterests'

import FinalPage from './FinalPage'

const SkillsFrameWorkHandler = ({ pathname, container }) => {
  const {
    onboardingSkills: {
      focusedSkillFrameworkId,
      focusedSkillFrameworkLevel,
      focusedSkillName
    }
  } = container.useContainer()
  if (pathname === '/onboarding/my-skill-levels')
    return (
      <div className='onboarding__skills-framework'>
        <SkillsFrameworkOnboarding
          frameworkId={focusedSkillFrameworkId}
          selectedLevel={focusedSkillFrameworkLevel}
          skillName={focusedSkillName}
        />
      </div>
    )
  return null
}

const getCurrentPage = (pathname, includeOrgPage, onlySkills) => {
  switch (pathname.split('/onboarding/')[1]) {
    case 'signup':
      return 0
    case 'organization':
      return 1
    case 'my-skills':
      return onlySkills ? 0 : includeOrgPage ? 2 : 1
    case 'my-skill-levels':
      return onlySkills ? 1 : includeOrgPage ? 3 : 2
    case 'my-interests':
      return onlySkills ? 2 : includeOrgPage ? 4 : 3
    default:
      return 40
  }
}

export const OnboardingManager = ({
  location: { state, pathname },
  ...rest
}) => {
  // route security => missing router state stops users from accessing the page
  if (!state) return <Redirect to='/' />

  const { user, onboardingInfo, onlySkills } = state

  const [one, two, three] = onboardingInfo.split(' ') // eslint-disable-line

  const {
    roles,
    _id: userId,
    firstName,
    lastName,
    organizationName,
    roleAtWork,
    roleId,
    selectedWorkSkills
  } = user

  const isAdmin = roles.includes('ADMIN')

  const skipOrg = two === 'SHORT_ONBOARDING' || two === 'NOT_FIRST_ADMIN'

  const skipDataPrivacy = three === 'ACCEPTED_DATA_PRIVACY'

  const includeOrgPage = isAdmin && !skipOrg

  const pages = onlySkills
    ? [0, 1, 2]
    : includeOrgPage
    ? [0, 1, 2, 3, 4]
    : [0, 1, 2, 3]

  const currentPage = getCurrentPage(pathname, includeOrgPage, onlySkills)

  const initialWorkInfoState = {
    roleAtWork,
    roleId,
    selectedWorkSkills
  }

  return (
    <div className='onboarding__wrapper'>
      <div className='onboarding__logo-wrapper'>
        <img
          className='onboarding-logo'
          alt='Innential Logo'
          src={require('../../static/innential-logo.svg')}
        />
      </div>
      <Container.Provider
        initialState={{
          initialWorkInfoState
        }}
      >
        <SkillsFrameWorkHandler pathname={pathname} container={Container} />
        <div className='container-main container-main--onboarding'>
          <Switch>
            <Route
              exact
              path='/'
              component={() => <Redirect to='/onboarding/signup' />}
            />

            <Route
              exact
              path='/onboarding/signup'
              component={() => (
                <SignupPage
                  userId={userId}
                  firstName={firstName}
                  lastName={lastName}
                  isAdmin={isAdmin}
                  skipDataPrivacy={skipDataPrivacy}
                  goToOrganizationPage={includeOrgPage}
                  cantDeleteInformation={includeOrgPage}
                  routeState={state}
                />
              )}
            />

            <Route
              exact
              path='/onboarding/organization'
              component={() => (
                <OrganizationCreateForm
                  userId={userId}
                  organizationName={organizationName}
                  routeState={state}
                />
              )}
            />

            <Authenticate>
              <Route
                exact
                path='/onboarding/my-skills'
                component={() => (
                  <Page1WorkInfo routeState={state} container={Container} />
                )}
              />
              <Route
                exact
                path='/onboarding/my-skill-levels'
                component={() => (
                  <Page2SkillLevels routeState={state} container={Container} />
                )}
              />
              <Route
                exact
                path='/onboarding/my-interests'
                component={() => (
                  <Page3PersonalInterests
                    routeState={state}
                    uuid={state.user._id}
                    container={Container}
                    // cantGoBack={onlyNeededSkills}
                  />
                )}
              />
              <Route
                path='/onboarding/congratulations'
                component={() => (
                  <FinalPage routeState={state} container={Container} />
                )}
              />
            </Authenticate>
          </Switch>

          {currentPage !== 40 && (
            <div className='pager-container'>
              <Pager screenList={pages} currentScreen={currentPage} />
            </div>
          )}
        </div>
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
