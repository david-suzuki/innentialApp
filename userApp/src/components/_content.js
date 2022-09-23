import React from 'react'
import { Link, Redirect, Route, Switch, withRouter } from 'react-router-dom'
import { useQuery } from 'react-apollo'
import {
  currentUserSkillsProfile,
  fetchCurrentUserOrganizationTeams
} from '../api'
import { LoadingSpinner, captureFilteredError, SentryDispatch } from './general'
import {
  LikedContent,
  TeamContent,
  SharedByMeList,
  // DislikedContent,
  OwnContent
  // UploadManager,
  // LearningContentList
} from './learning-content'
// import { LearningPathList } from './learning-paths'
import {
  Statement,
  Tab,
  TabsList,
  TabContent,
  Tabs,
  List
  // MobilePreferences
} from './ui-components'
// import Container from '../globalState'
// import contentViewStyle from '../styles/contentViewStyle'
// import { DevelopmentPlan } from './development-plans'
import { Button } from 'element-react'
import { UserFulfillmentRequestsList } from './requests'
import { CompletedContentList } from './development-plans'

// const PageHeader = () => <div className='page-header'>Learning</div>

// const LearningFeed = ({ canRecommend }) => {
//   useEffect(() => {
//     const mainWrapper = document.getElementById('main-wrapper')

//     return () => (mainWrapper.className = 'container-main__wrapper')
//   }, [])

//   return (
//     <>
//       <LearningContentList canRecommend={canRecommend} />
//     </>
//   )
// }

const SharedContent = ({
  currentUser,
  neededWorkSkills,
  // onTabClick,
  teamNames,
  canRecommend
}) => (
  <List noPadding overflow noBoxShadow purpleBackground>
    <Tabs className='subtabs'>
      <TabsList>
        <Tab>In Team</Tab>
        <Tab>By Me</Tab>
      </TabsList>
      <TabContent>
        <TeamContent
          currentUser={currentUser}
          neededWorkSkills={neededWorkSkills}
          usersTeams={teamNames}
          canRecommend={canRecommend}
        />
      </TabContent>
      <TabContent>
        <SharedByMeList
          neededWorkSkills={neededWorkSkills}
          usersTeams={teamNames}
          canRecommend={canRecommend}
        />
      </TabContent>
    </Tabs>
    {/* <style jsx>{contentViewStyle}</style> */}
  </List>
)

// const MyContent = ({
//   currentUser,
//   neededWorkSkills,
//   // onTabClick,
//   teamNames,
//   teams = [],
//   activeSubTabIndex,
//   canRecommend
// }) => (
//   <List noPadding overflow noBoxShadow purpleBackground>
//     <Tabs className='subtabs' initialActiveTabIndex={activeSubTabIndex}>
//       <TabsList>
//         <Tab>Saved for later</Tab>
//         {/* <Tab>Disliked</Tab> */}
//         <Tab>Uploaded</Tab>
//         {teams.length > 0 && <Tab>Shared</Tab>}
//       </TabsList>
//       <TabContent>
//         <LikedContent
//           neededWorkSkills={neededWorkSkills}
//           usersTeams={teamNames}
//           canRecommend={canRecommend}
//         />
//       </TabContent>
//       {/* <TabContent>
//         <DislikedContent
//           neededWorkSkills={neededWorkSkills}
//           canRecommend={canRecommend}
//         />
//       </TabContent> */}
//       <TabContent>
//         <OwnContent
//           neededWorkSkills={neededWorkSkills}
//           usersTeams={teamNames}
//           currentUser={currentUser}
//           teams={teams}
//           canRecommend={canRecommend}
//         />
//       </TabContent>
//       {teams.length > 0 && (
//         <TabContent>
//           <SharedContent
//             currentUser={currentUser}
//             neededWorkSkills={neededWorkSkills}
//             teamNames={teamNames}
//             canRecommend={canRecommend}
//           />
//         </TabContent>
//       )}
//     </Tabs>
//     {/* <style jsx>{contentViewStyle}</style> */}
//   </List>
// )

const ContentRoute = ({
  // goToTab,
  // onTabClick,
  // activeTabIndex,
  canRecommend,
  currentUser,
  neededWorkSkills,
  teams,
  teamNames
}) => {
  // const displaySharedTab = teams.length > 0
  // const activeSubTabIndex = goToTab && goToTab === 'Disliked' ? 1 : 0

  return (
    <Switch>
      {/* <Route path='/learning/quick-search'>
        <LearningFeed canRecommend={canRecommend} />
      </Route> */}
      {/* {displaySharedTab && (
        <Route path='/learning/shared'>
          <SharedContent
            currentUser={currentUser}
            neededWorkSkills={neededWorkSkills}
            teamNames={teamNames}
            canRecommend={canRecommend}
          />
        </Route>
      )} */}
      <Route path='/library/saved'>
        <LikedContent
          neededWorkSkills={neededWorkSkills}
          usersTeams={teamNames}
          canRecommend={canRecommend}
        />
      </Route>
      <Route path='/library/uploaded'>
        <OwnContent
          neededWorkSkills={neededWorkSkills}
          usersTeams={teamNames}
          currentUser={currentUser}
          teams={teams}
          canRecommend={canRecommend}
        />
      </Route>
      <Route path='/library/shared'>
        <SharedContent
          currentUser={currentUser}
          neededWorkSkills={neededWorkSkills}
          teamNames={teamNames}
          canRecommend={canRecommend}
        />
      </Route>
      {currentUser.fulfillment && (
        <Route path='/library/delivery'>
          <UserFulfillmentRequestsList />
        </Route>
      )}
      <Route path='/library/completed'>
        <CompletedContentList />
      </Route>
      <Route>
        <Redirect to='/library/saved' />
      </Route>
    </Switch>
  )
}

// const HandleGlobalState = ({ children }) => {
//   const { setPreferencesState } = Container.useContainer()
//   return children(setPreferencesState)
// }

// const tabs = {
//   feed: 0,
//   shared: 1,
//   myLearning: 2,
//   upload: 3
//   // paths: 4
// }

// const tabNames = Object.keys(tabs)

// class ContentQueryWrapper extends Component {
//   onTabClick = tabIndex => {
//     this.props.history.push(`/learning?tab=${tabNames[tabIndex]}`)
//   }

//   toggleTabListAndHeader = () => {
//     const [tabList] = document.getElementsByClassName('tabs-list')
//     const [header] = document.getElementsByClassName(
//       'page-header page-header--button'
//     )
//     if (tabList) {
//       tabList.hidden = !tabList.hidden
//     }
//     if (header && header.style.display !== 'none') {
//       header.style.display = 'none'
//     } else header.style.display = 'flex'
//   }

// componentDidMount = () => {
//   switch (this.props.activeIndex) {
//     case 3:
//       this.props.setPreferencesState({ visible: false })
//       break
//     case 4:
//       this.props.setPreferencesState({
//         visible: true,
//         skills: true,
//         types: false,
//         filters: false
//       })
//       break
//     default:
//       this.props.setPreferencesState({
//         visible: true,
//         skills: true,
//         types: true,
//         filters: true
//       })
//       break
//   }
// }

// componentWillUnmount = () => {
//   this.props.setPreferencesState({ visible: false })
// }

//   render() {
//     // const { activeTabIndex } = this.state
//     const { currentUser, state, activeIndex } = this.props
//     const canRecommend =
//       currentUser.leader || currentUser.roles.indexOf('ADMIN') !== -1

//     const goToTab = state && state.goToTab

//     return (
//       <Query query={currentUserSkillsProfile}>
//         {result => {
//           if (result.loading) return <LoadingSpinner />
//           if (result.error) {
//             captureFilteredError(result.error)
//             return null
//           }

//           const profile = result.data && result.data.currentUserSkillsProfile
//           if (profile) {
//             const { neededWorkSkills } = profile
//             return (
//               <>
//                 {/* <HandleGlobalState activeTabIndex={activeTabIndex} /> */}
//                 {/* <MobilePreferences /> */}
//                 <div className="content-view">
//                   <div className="page-header page-header--button">
//                     Learning
//                     <Button
//                       className="el-button--help"
//                       onClick={() => window.Intercom('startTour', 83708)}
//                     >
//                       ?
//                     </Button>
//                   </div>
//                   <ContentRoute
//                     activeTabIndex={activeIndex}
//                     goToTab={goToTab}
//                     onTabClick={this.onTabClick}
//                     currentUser={currentUser}
//                     neededWorkSkills={neededWorkSkills}
//                     toggleTabListAndHeader={this.toggleTabListAndHeader}
//                     canRecommend={canRecommend}
//                     {...this.props}
//                   />
//                 </div>
//                 <style jsx>{contentViewStyle}</style>
//               </>
//             )
//           } else {
//             captureFilteredError(
//               new Error(`Failed to load user profile @ContentRoute`)
//             )
//             return <Statement content="Oops! Something went wrong." />
//           }
//         }}
//       </Query>
//     )
//   }
// }

export default withRouter(
  ({
    currentUser,
    // organizationData,

    location: { state }

    // history
  }) => {
    const {
      data: currentUserTeamsData,
      loading: currentUserTeamsLoading,
      error: currentUserTeamsError
    } = useQuery(fetchCurrentUserOrganizationTeams)

    const { data, loading, error } = useQuery(currentUserSkillsProfile)

    if (loading || currentUserTeamsLoading) return <LoadingSpinner />
    if (error || currentUserTeamsError) {
      return <SentryDispatch error={error || currentUserTeamsError} />
    }

    if (data) {
      const teams =
        currentUserTeamsData?.fetchCurrentUserOrganization?.teams || []

      const teamNames = teams.map(team => {
        return team.teamName
      })

      const canRecommend =
        currentUser.leader || currentUser.roles.indexOf('ADMIN') !== -1

      const { neededWorkSkills } = data.currentUserSkillsProfile

      return (
        <div
          className='page-header--button'
          style={{ flexDirection: 'column' }}
        >
          <div className='absolute-library'>
            <Link to='/upload'>
              <Button className='el-button--green'>Upload</Button>
            </Link>
          </div>
          <ContentRoute
            currentUser={currentUser}
            neededWorkSkills={neededWorkSkills}
            canRecommend={canRecommend}
            teams={teams}
            teamNames={teamNames}
            goToTab={state && state.goToTab}
          />
        </div>
      )
    }
    return null
  }
)
