import React from 'react'
import { UserHeading, Tab, TabsList, TabContent, Tabs } from './ui-components'
import {
  UserSkills,
  UserPosition,
  UserPersonalGrowth,
  UserAccount
} from './user-profile'
import { Query } from 'react-apollo'
import { currentUserSkillsProfile } from '../api'
import { Redirect, withRouter } from 'react-router-dom'
import { SentryDispatch, LoadingSpinner } from './general'
import Container from '../globalState'
import profileSettingsStyle from '../styles/profileSettingsStyle'

export default withRouter(props => {
  const searchString = props.location.search
  const goToPersonalGrowth = searchString.indexOf('growth') !== -1

  return (
    <Query query={currentUserSkillsProfile}>
      {({ data, loading, error }) => {
        if (loading) return <LoadingSpinner />
        if (error) return <SentryDispatch error={error} />

        if (data) {
          return (
            <>
              <div className='page-heading'>
                <i
                  className='page-heading__back__button icon icon-small-right icon-rotate-180'
                  onClick={() => props.history.goBack()}
                />
                <div className='page-heading-info'>
                  <h1>Profile settings</h1>
                </div>
              </div>
              <Profile
                data={data}
                currentUser={props.data.currentUser}
                goToPersonalGrowth={goToPersonalGrowth}
              />
            </>
          )
        }
      }}
    </Query>
  )
})

const Profile = props => {
  const onboardingInfo = props.data.currentUserSkillsProfile //eslint-disable-line
  const { currentUser /*, goToPersonalGrowth */ } = props
  // if (!onboardingInfo) {
  //   return (
  //     <Redirect
  //       to={{
  //         pathname: '/onboarding',
  //         state: {
  //           user: currentUser,
  //           onboardingInfo: 'SOME STRING FOR SAFETY',
  //           onlySkills: true
  //         }
  //       }}
  //     />
  //   )
  // }
  const container = Container.useContainer()
  const { setFrameworkState } = container
  // const tabNames = ['Skills', 'Position', 'Growth', 'Account']
  // const activeTabIndex = goToPersonalGrowth ? 2 : 0

  return (
    <>
      {/* {activeTabIndex === 0 && (
        <div className="skill-framework">
          <SkillsFramework
            frameworkId={focusedSkillFrameworkId}
            selectedLevel={focusedSkillFrameworkLevel}
          />
        </div>
      )} */}
      <UserHeading
        _id={currentUser._id}
        name={`${currentUser.firstName} ${currentUser.lastName}`}
        hideOnDesktop
      />
      <Tabs
      // initialActiveTabIndex={activeTabIndex}
      // onChange={tabIndex => container.setProfileActiveTab(tabNames[tabIndex])}
      >
        <TabsList>
          <Tab>Skills</Tab>
          <Tab>Current Position</Tab>
          {/* <Tab>Personal Growth</Tab> */}
          <Tab>Account</Tab>
        </TabsList>
        <TabContent>
          <UserSkills
            skills={onboardingInfo.selectedWorkSkills}
            setFrameworkState={setFrameworkState}
          />
        </TabContent>
        <TabContent>
          <UserPosition
            currentUser={currentUser}
            relatedLineOfWork={onboardingInfo.relatedLineOfWork}
            roleAtWork={onboardingInfo.roleAtWork}
            roleId={onboardingInfo.roleId}
          />
        </TabContent>
        {/* <TabContent>
          <UserPersonalGrowth
            neededWorkSkills={onboardingInfo.neededWorkSkills}
            selectedInterests={onboardingInfo.selectedInterests}
          />
        </TabContent> */}
        <TabContent>
          <UserAccount
            currentUser={currentUser}
            userNameChanged={props.userNameChanged}
          />
        </TabContent>
      </Tabs>
      <style jsx>{profileSettingsStyle}</style>
    </>
  )
}
