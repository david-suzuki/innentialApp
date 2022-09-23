import React, { Component, useEffect, createContext } from 'react'
import {
  Route,
  Redirect,
  Switch,
  withRouter,
  useLocation,
  Link
} from 'react-router-dom'
import { Query, ApolloConsumer, useQuery } from 'react-apollo'
import { i18n } from 'element-react'
import elementStyle from './styles/elementStyle'
import globalStyle from './styles/globalStyle'
import variables from './styles/variables'
import {
  currentUser,
  fetchCurrentUserTeams,
  currentUserProfile,
  fetchIfUserOrganizationExist,
  fetchCurrentUserOrganizationTeamsIds
} from './api'
import {
  RouteManager,
  GetNewContent,
  GetPaidContent,
  ShareFromEmail,
  LikeContentFromEmail,
  DislikeContentFromEmail,
  UserContext,
  initializeHotjarTracker,
  isNotInnentialEmail,
  initializeSegment,
  getInitials,
  generateInitialsAvatar
} from './utils'
import {
  Home,
  Profile,
  Profiles,
  // Teams,
  TeamDetailsPage,
  CreateTeam,
  AddNewUser,
  AddNewMember,
  Content,
  Evaluate,
  // SkillGap,
  SingleUserEvaluatePage,
  Logout,
  // Stats,
  StatsDetails,
  StatsSkillGapDetails,
  Reviews,
  ReviewFormRoute,
  Goals,
  StartReview,
  GoalReview,
  ReviewResults,
  GenerateFeedbackLink,
  FeedbackPage,
  GoalPlanReview,
  GoalDraftPage,
  // GoalDraftLeaderRoute,
  // UserGoalDraftList,
  // EditSingleGoal,
  // CompletedContentList,
  RenameTeam,
  DevelopmentPlanEmail,
  CreateReviewEvents,
  SingleRoleCreate,
  RoleGroupCreate,
  PathTemplateCreate,
  EventTemplateCreate,
  LearningPathPage,
  LearningPathList,
  EditProfile,
  Filters,
  FiltersMobile,
  MyTeams,
  ManageTeams,
  LearningContentList,
  UploadManager,
  ActiveGoalSetting,
  GoalFeedbackPage,
  UserRequestsPage,
  AdminRequestsPage,
  AdminRequestsOverview,
  ContentEditRoute
} from './components'
import {
  Authenticate,
  captureFilteredError,
  SentryDispatch,
  LoadingSpinner
} from './components/general'
import * as Sentry from '@sentry/browser'
import {
  // MainNav,
  // NewNav,
  // DesktopPreferences,
  BodyPortal,
  SkillDetails,
  ShareContent,
  NeededSkillDetails,
  InterestsDetails,
  TeamRequiredDetails,
  SkillsFramework,
  RecommendContent,
  AssignPath,
  GoalPopup,
  LearningPathSuccess
} from './components/ui-components'
import HomeEventsDesktop from './components/events/HomeEventsDesktop'
import { NewNav } from './components/ui-components/NewNav/'
import HeaderTabs from './components/ui-components/HeaderTabs'
import TransactionsHistory from './components/budget/TransactionsHistory'
import Events from './components/events/Events'
import SingleEvent from './components/events/SingleEvent'
import PastEvent from './components/events/PastEvent'
import EventTemplate from './components/events/EventTemplate'
import history from './history'

import locale from 'element-react/src/locale/lang/en'
import Container from './globalState'

// import ReactPiwik from 'react-piwik'
import ReactGA from 'react-ga'
import { useGA4React } from 'ga-4-react'
// import { ManageOrganizationPathTemplates } from './components/organization-settings'

i18n.use(locale)

const staging = process.env.REACT_APP_STAGING

const HandleGlobalState = ({ setDisplayFilters, setFrameWorkState }) => {
  const {
    displayFilters,
    frameworkState: { visible }
  } = Container.useContainer()

  useEffect(() => {
    setDisplayFilters(displayFilters)
  }, [displayFilters])
  useEffect(() => {
    setFrameWorkState({ visible })
    // console.log(visible)
  }, [visible])
  return null
}

const AppQueryWrapper = withRouter(
  ({ user, showLearnerDashboard, location: { pathname, state } }) => {
    const { data, loading: loadingIfUserOrganizationExist, error } = useQuery(
      fetchIfUserOrganizationExist
    )

    let teamsIds = []
    const {
      data: currentUserTeamsIdsData,
      loading: currentUserTeamsIdsLoading,
      error: currentUserTeamsIdsError
    } = useQuery(fetchCurrentUserOrganizationTeamsIds)
    const ifUserOrganizationExist = data?.fetchIfUserOrganizationExist
    if (!currentUserTeamsIdsLoading) {
      teamsIds = currentUserTeamsIdsData.fetchCurrentUserOrganizationTeamsIds
    }

    if (currentUserTeamsIdsError) {
      return <SentryDispatch error={currentUserTeamsIdsError} />
    }

    const ga = useGA4React()

    useEffect(() => {
      if (user && user._id) {
        // SENTRY USER SCOPE
        Sentry.configureScope(scope => {
          scope.setUser({
            id: user._id
          })
        })
      }
    }, [user])

    useEffect(() => {
      let unlisten = () => {}

      if (
        user &&
        user.email &&
        isNotInnentialEmail(user.email) &&
        process.env.NODE_ENV === 'production' &&
        !staging
      ) {
        if (!window.analytics) {
          // ADD SEGMENT TRACKING (REPLACES UNIVERSAL ANALYTICS)
          initializeSegment()
          // 1ST PAGEVIEW
          window.analytics && window.analytics.page(history.location.pathname)
        }

        if (!window.hj) {
          // ADD HOTJAR TRACKING
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

    if (user && user._id && user.roles) {
      if (loadingIfUserOrganizationExist) {
        return <LoadingSpinner />
      } else {
        if (user.roles.indexOf('ADMIN') !== -1 || user.leader) {
          // if (error) return <SentryDispatch error={error} />
          if (ifUserOrganizationExist) {
            return (
              <App
                teamsIds={teamsIds}
                ifUserOrganizationExist={ifUserOrganizationExist}
                currentUser={{
                  ...user,
                  imageLink: user?.imageLink || generateInitialsAvatar(user)
                }}
                pathname={pathname}
                justOnboarded={state && state.justOnboarded}
                ga={ga}
                queryDecider={true}
                showLearnerDashboard={showLearnerDashboard}
              />
            )
          }
        } else {
          if (ifUserOrganizationExist) {
            return (
              <App
                teamsIds={teamsIds}
                ifUserOrganizationExist={ifUserOrganizationExist}
                currentUser={{
                  ...user,
                  imageLink: user?.imageLink || generateInitialsAvatar(user)
                }}
                pathname={pathname}
                justOnboarded={state && state.justOnboarded}
                ga={ga}
                queryDecider={false}
                showLearnerDashboard={showLearnerDashboard}
              />
            )
          }
        }
      }
    }

    return (
      <Redirect
        to={{
          pathname: '/login'
        }}
      />
    )
  }
)

const routeManager = new RouteManager()
routeManager.preferencesListen()

// const HandleGlobalState = () => {
//   let container = Container.useContainer()
//   const route = routeManager.getCurrentLocation()
//   if (route !== null && route !== '/goals') {
//     container.setEdittingPlan(false)
//   }
//   return null
// }

class App extends Component {
  state = {
    displayFilters: false,
    frameworkVisible: false,
    libraryHighlight: false,
    highlightCompleted: false,
    isAdminDashboard: false,
    isLeaderDashboard: false

    // displayFilters:
    //   this.props.pathname === '/learning/quick-search' ||
    //   this.props.pathname === '/profile'
  }

  componentDidMount() {
    const { ga, currentUser } = this.props
    if (process.env.NODE_ENV !== 'development') {
      const app_id = staging ? 'prw4a6p4' : 'f8xjeosr' // eslint-disable-line
      window.Intercom('boot', {
        app_id,
        user_id: this.props.currentUser._id,
        email: this.props.currentUser.email,
        'Demo Account': this.props.currentUser.isDemoUser,
        'User Role': this.props.currentUser.roles.includes('ADMIN')
          ? 'Admin'
          : 'User'
      })

      ga
        ? ga.gtag('set', 'user_properties', {
            organization_name: currentUser.organizationName
          })
        : captureFilteredError('Empty GTag interface')

      window.analytics
        ? window.analytics.identify(currentUser._id, {
            organizationName: currentUser.organizationName
          })
        : captureFilteredError('Empty Segment interface')
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.currentUser) {
  //     this.setState({
  //       currentUser: nextProps.currentUser
  //     })
  //   }
  //   if (nextProps.organizationData && nextProps.organizationData.teams) {
  //     this.setState({
  //       organizationData: nextProps.organizationData
  //     })
  //   }
  // }

  // componentWillReceiveProps(nextProps) {
  //   // console.log(nextProps)
  //   if (nextProps.pathname !== this.props.pathname) {
  //     this.setState({
  //       displayFilters: this.handleDisplayFilters(nextProps.pathname)
  //     })
  //   }
  // }

  // componentDidUpdate() {
  //   console.log(this.state.displayFilters)
  // }

  // handleDisplayFilters = pathname =>
  //   pathname === '/learning/quick-search' || pathname === '/profile'

  // getWrapperClassName = pathname =>
  //   pathname !== '/learning/quick-search'
  //     ? 'container-main__wrapper wrapper-with-filters'
  //     : 'container-main__wrapper wrapper-with-sidebar-and-filters'

  handleSetDashboard = index => {
    switch (index) {
      case 0:
        this.setState(prevState => ({
          ...prevState,
          isAdminDashboard: false,
          isLeaderDashboard: false
        }))
        break
      case 1:
        this.setState(prevState => ({
          ...prevState,
          isAdminDashboard: true,
          isLeaderDashboard: false
        }))
        break
      case 2:
        this.setState(prevState => ({
          ...prevState,
          isAdminDashboard: false,
          isLeaderDashboard: true
        }))
        break
    }
  }

  paths = [
    'profile',
    'evaluate',
    'evaluate-employee',
    'roles/form',
    'goal-feedback',
    // 'path-templates/form',
    'upload',
    'start-review',
    'goals',
    'learning-content/edit'
  ]

  getClassname = pathname =>
    this.paths.some(path => pathname === `/${path}`)
      ? 'container-main__wrapper wrapper--right '
      : (pathname === '/' && !this.state.isAdminDashboard) ||
        pathname.indexOf('/profiles') !== -1 ||
        pathname.indexOf('/team/') !== -1 ||
        pathname.indexOf('/finished-path') !== -1 ||
        pathname === 'path-templates/form' ||
        pathname.includes('events')
      ? 'container-main__wrapper dashboard-wrapper'
      : 'container-main__wrapper'

  setLibraryHighlight = state =>
    this.setState(prevState => ({ ...prevState, libraryHighlight: state }))

  setHighlightCompleted = state =>
    this.setState(prevState => ({ ...prevState, highlightCompleted: state }))

  render() {
    const { displayFilters, frameworkVisible, highlightCompleted } = this.state
    const isIE = /* @cc_on!@ */ false || !!document.documentMode
    const stylesIE = isIE ? (
      <style jsx>{`
        @media ${variables.lg} {
          .container-main {
            margin-left: 40%;
            transform: translateX(-50%);
          }
        }
      `}</style>
    ) : null
    const {
      currentUser,
      organizationData,
      pathname,
      ga,
      ifUserOrganizationExist,
      queryDecider,
      teamsIds
    } = this.props

    if (ifUserOrganizationExist && currentUser) {
      const isAdmin = currentUser.roles.indexOf('ADMIN') !== -1
      const isLeader =
        currentUser.leader && currentUser.roles.indexOf('ADMIN') === -1

      return (
        <div
          id='app-container'
          className={`app-container ${
            pathname === '/' ? 'dashboard-wrapper' : ''
          }`}
        >
          <HandleGlobalState
            setFrameWorkState={({ visible }) =>
              this.setState({ frameworkVisible: visible })
            }
            setDisplayFilters={value =>
              this.setState({ displayFilters: value })
            }
          />
          <UserContext.Provider value={currentUser}>
            <Authenticate>
              <div
                className={
                  pathname === '/' ? 'app-wrapper__with-events' : 'app-wrapper'
                }
              >
                <header
                  id='main-header'
                  style={{ backgroundColor: 'white' }}
                  // className={`${
                  //   this.state.activeSidebar ? 'header--with-sidebar' : ''
                  // }`}
                >
                  <div className='header__mobile-header'>
                    <Link to='/?learner=true'>
                      <img
                        alt='Innential Logo'
                        src={require('$/static/innential-logo.svg')}
                      />
                    </Link>
                  </div>

                  <NewNav
                    // sidebarExpanded={this.state.activeSidebar}
                    libraryHighlight={this.state.libraryHighlight}
                    setLibraryHighlight={this.setLibraryHighlight}
                    user={currentUser}
                    pathname={pathname}
                    // className="nav-desktop"
                    hamburger={displayFilters || frameworkVisible}
                    // toggleSidebar={() =>
                    //   this.setState({ activeSidebar: !this.state.activeSidebar })
                    // }
                  />
                </header>
                <ApolloConsumer>
                  {client => (
                    <>
                      {/* EXAMPLE COMPONENT FOR THE 2ND LEVEL NAVIGATION */}
                      {/* SHOULD TAKE CURRENTUSER + PATHNAME AS PROPS AND RENDER THE SUBROUTES ACCORDINGLY */}
                      <HeaderTabs
                        currentUser={currentUser}
                        pathname={pathname}
                        displayFilters={displayFilters}
                        onChange={this.handleSetDashboard}
                        value={
                          isLeader
                            ? this.state.isLeaderDashboard
                            : this.state.isAdminDashboard
                        }
                        showLearnerDashboard={this.props.showLearnerDashboard}
                        setHighlightCompleted={this.setHighlightCompleted}
                        highlightCompleted={highlightCompleted}
                      />
                      <div
                        id='main-wrapper'
                        className={
                          displayFilters
                            ? 'container-main__wrapper wrapper--right'
                            : this.getClassname(pathname)
                        }
                        // style={{
                        //   height: '100vh'
                        // }}
                      >
                        <div
                          className='sidebar-main sidebar-main-visible'
                          // style={{
                          //   position:
                          //     displayFilters && pathname !== '/profile'
                          //       ? 'relative'
                          //       : 'absolute'
                          // }}
                        >
                          <Filters />

                          <BodyPortal>
                            <div
                              id='skill-framework'
                              className='skill-framework'
                            >
                              <SkillsFramework currentUser={currentUser} />
                            </div>
                          </BodyPortal>
                        </div>
                        <div
                          id='main-overlay'
                          className={
                            pathname === '/' ||
                            pathname.indexOf('/profiles') !== -1 ||
                            pathname.indexOf('/team/') !== -1 ||
                            pathname.indexOf('/finished-path') !== -1
                              ? 'container-main dashboard__wrapper'
                              : pathname.includes('learning-path') ||
                                pathname.includes('path-templates/form') ||
                                pathname.includes('goal/') ||
                                pathname.includes('plan/') ||
                                pathname.includes('event')
                              ? 'container-main learning-path'
                              : 'container-main'
                          }
                          // {this.getClassname(pathname)}
                        >
                          <Query
                            query={currentUserProfile}
                            fetchPolicy='network-only'
                          >
                            {({ data }) => {
                              if (data) {
                                if (
                                  data.currentUserProfile &&
                                  data.currentUserProfile.onboardingInfo
                                ) {
                                  const {
                                    onboarded,
                                    firstAdmin,
                                    userDetailsProvided,
                                    hasAssignedPath
                                    // skillsToEvaluate
                                  } = data.currentUserProfile.onboardingInfo

                                  // if (currentUser.corporate) {
                                  //   if (!userDetailsProvided) {
                                  //     return (
                                  //       <Redirect
                                  //         to={{
                                  //           pathname: `onboarding/about-you`,
                                  //           state: {
                                  //             user:
                                  //               data.currentUserProfile.user,
                                  //             onboardingInfo:
                                  //               data.currentUserProfile
                                  //                 .onboardingInfo
                                  //           }
                                  //         }}
                                  //       />
                                  //     )
                                  //   } else return null
                                  // }

                                  if (!onboarded) {
                                    const path = firstAdmin
                                      ? 'organization'
                                      : !userDetailsProvided
                                      ? 'about-you'
                                      : hasAssignedPath
                                      ? 'assigned-paths'
                                      : 'how-to'

                                    ga && ga.gtag('event', 'start_onboarding')

                                    window.analytics &&
                                      window.analytics.track('start_onboarding')

                                    return (
                                      <Redirect
                                        to={{
                                          pathname: `onboarding/${path}`,
                                          state: {
                                            user: data.currentUserProfile.user,
                                            onboardingInfo:
                                              data.currentUserProfile
                                                .onboardingInfo
                                          }
                                        }}
                                      />
                                    )
                                  }
                                }
                              }
                              return null
                            }}
                          </Query>

                          <Switch>
                            <Route exact path='/'>
                              <Home
                                teamsIds={teamsIds}
                                adminDashboard={this.state.isAdminDashboard}
                                leaderDashboard={this.state.isLeaderDashboard}
                                queryDecider={queryDecider}
                                user={currentUser}
                                client={client}
                                setLibraryHighlight={this.setLibraryHighlight}
                                setHighlightCompleted={
                                  this.setHighlightCompleted
                                }
                              />
                            </Route>
                            <Route
                              exact
                              path='/transactions-history'
                              component={() => <TransactionsHistory />}
                            />
                            {/* <Route
                            exact
                            path='/new'
                            component={() => <GetNewContent />}
                          /> */}
                            {/* <Route
                            exact
                            path='/paid'
                            component={() => <GetPaidContent />}
                          /> */}
                            <Route
                              exact
                              path='/like-content/:learningContentId'
                              component={() => <LikeContentFromEmail />}
                            />
                            {/* <Route
                            exact
                            path='/dislike-content/:learningContentId'
                            component={() => <DislikeContentFromEmail />}
                          /> */}
                            {currentUser.roles.indexOf('ADMIN') !== -1 && [
                              <Route
                                path='/organization'
                                key='organization'
                                component={() => (
                                  <ManageTeams
                                    user={currentUser}
                                    queryDecider={queryDecider}
                                  />
                                )}
                              />,
                              <Route path='/teams' key='teams-redirect'>
                                <Redirect to='/organization/teams' />
                              </Route>
                            ]}
                            {currentUser.roles.indexOf('ADMIN') === -1 && (
                              <Route
                                path='/teams'
                                component={() => (
                                  <MyTeams
                                    currentUser={currentUser}
                                    queryDecider={queryDecider}
                                  />
                                )}
                              />
                            )}
                            <Route path='/team/:teamId'>
                              <TeamDetailsPage currentUser={currentUser} />
                            </Route>
                            <Route
                              exact
                              path='/create/teams'
                              component={() => (
                                <CreateTeam currentUser={currentUser} />
                              )}
                            />
                            <Route
                              exact
                              path='/rename-team'
                              component={() => (
                                <RenameTeam
                                  isAdmin={
                                    currentUser.roles.indexOf('ADMIN') !== -1
                                  }
                                />
                              )}
                            />
                            <Route
                              exact
                              path='/create/teams/members'
                              component={() => (
                                <AddNewMember currentUser={currentUser} />
                              )}
                            />
                            <Route
                              exact
                              path='/create/users'
                              component={() => (
                                <AddNewUser
                                  currentUser={currentUser}
                                  queryDecider={queryDecider}
                                />
                              )}
                            />
                            <Route path='/profile'>
                              <Profile data={{ currentUser }} />
                            </Route>
                            <Route path='/profiles/:userId'>
                              <Profiles currentUser={currentUser} />
                            </Route>
                            {/* <Route path='/goals' key='goals'>
                              <Goals
                                organizationData={organizationData}
                                currentUser={currentUser}
                              />
                            </Route> */}
                            {/* <Route path='/draft/new' key='newDraft'>
                              <GoalDraftPage currentUser={currentUser} />
                            </Route> */}
                            <Route path='/quick-search' key='quick-search'>
                              <LearningContentList
                                setLibraryHighlight={this.setLibraryHighlight}
                                canRecommend={
                                  currentUser.leader ||
                                  currentUser.roles.indexOf('ADMIN') !== -1
                                }
                              />
                            </Route>

                            <Route
                              path='/library'
                              key='library'
                              component={() => (
                                <Content
                                  currentUser={currentUser}
                                  setLibraryHighlight={this.setLibraryHighlight}
                                  queryDecider={queryDecider}
                                  libraryHighlight={this.state.libraryHighlight}
                                />
                              )}
                            />
                            <Route path='/goal-feedback'>
                              <GoalFeedbackPage currentUser={currentUser} />
                            </Route>
                            <Route path='/goal/new'>
                              <ActiveGoalSetting currentUser={currentUser} />
                            </Route>
                            <Route path='/plan/:goalId'>
                              <GoalPlanReview
                                currentUser={currentUser}
                                displayFilters={displayFilters}
                                setLibraryHighlight={this.setLibraryHighlight}
                              />
                            </Route>
                            {/* <Route path='/my-requests'>
                            <UserRequestsPage />
                          </Route> */}
                            <Route path='/user-requests/:userId'>
                              <AdminRequestsPage />
                            </Route>
                            <Route path='/requests'>
                              <AdminRequestsOverview
                                isAdmin={
                                  currentUser.roles.indexOf('ADMIN') !== -1
                                }
                              />
                            </Route>
                            {/* <Route
                          path="/completed-learning"
                          component={() => <CompletedContentList />}
                        /> */}
                            <Route
                              key='stats-details'
                              path='/statistics/details/:key'
                              component={() => <StatsDetails />}
                            />
                            <Route
                              key='stats-skill-gap'
                              path='/statistics/skill-gap'
                              component={() => <StatsSkillGapDetails />}
                            />
                            <Route
                              exact
                              key='needed-skill'
                              path='/needed/:skillId'
                              component={() => <NeededSkillDetails />}
                            />
                            {/* PREMIUM (PROTECTED) ROUTES */}
                            {currentUser.premium && [
                              <Route path='/reviews' key='reviews'>
                                <Reviews currentUser={currentUser} />
                              </Route>,
                              <Route
                                exact
                                key='reviews-create'
                                path='/create/reviews'
                                component={() => (
                                  <ReviewFormRoute
                                    queryDecider={queryDecider}
                                    currentUser={currentUser}
                                  />
                                )}
                              />,
                              <Route
                                exact
                                key='reviews-events'
                                path='/create/reviews/events/:templateId'
                                component={() => (
                                  <CreateReviewEvents
                                    currentUser={currentUser}
                                  />
                                )}
                              />,
                              <Route
                                exact
                                key='review-start'
                                path='/start-review/:reviewId'
                                component={() => (
                                  <StartReview currentUser={currentUser} />
                                )}
                              />,
                              <Route
                                path='/review/:reviewId/goals/:userId'
                                key='goal-review'
                              >
                                <GoalReview currentUser={currentUser} />
                              </Route>,
                              <Route
                                key='review-results'
                                path='/review-results/:reviewId'
                                component={() => <ReviewResults />}
                              />,
                              // <Route
                              //   exact
                              //   key='statistics'
                              //   path='/statistics'
                              //   component={() => (
                              //     <Stats
                              //       organizationData={organizationData}
                              //       currentUser={currentUser}
                              //     />
                              //   )}
                              // />,
                              <Route
                                key='evaluate-employee'
                                exact
                                path='/evaluate-employee'
                              >
                                <SingleUserEvaluatePage
                                  currentUser={currentUser}
                                />
                              </Route>,
                              <Route key='feedback-page' path='/feedback-page'>
                                <GenerateFeedbackLink
                                  currentUser={currentUser}
                                  queryDecider={queryDecider}
                                />
                              </Route>,
                              <Route
                                key='feedback'
                                path='/feedback/:feedbackShareKey'
                                component={() => <FeedbackPage />}
                              />
                            ]}
                            <Route key='evaluate' exact path='/evaluate'>
                              <Evaluate currentUser={currentUser} />
                            </Route>
                            <Route
                              path='/roles/form'
                              exact
                              children={
                                <SingleRoleCreate currentUser={currentUser} />
                              }
                            />
                            <Route
                              exact
                              path='/roles/group'
                              children={
                                <RoleGroupCreate currentUser={currentUser} />
                              }
                            />
                            {/* <Route
                        path="/skill-gap"
                        component={() => (
                          <SkillGap
                            organizationData={organizationData}
                            currentUser={currentUser}
                          />
                        )}
                      /> */}
                            <Route
                              exact
                              key='skill'
                              path='/skill/:skillId'
                              component={() => <SkillDetails />}
                            />
                            <Route
                              exact
                              key='interest'
                              path='/interest/:interestId'
                              component={() => <InterestsDetails />}
                            />
                            <Route
                              exact
                              key='required-skill'
                              path='/required-skills/:skillId'
                              component={() => <TeamRequiredDetails />}
                            />
                            <Route
                              path='/library'
                              component={() => (
                                <Content
                                  currentUser={currentUser}
                                  queryDecider={queryDecider}
                                  setLibraryHighlight={this.setLibraryHighlight}
                                  libraryHighlight={this.state.libraryHighlight}
                                />
                              )}
                            />
                            <Route path='/upload'>
                              <UploadManager currentUser={currentUser} />
                            </Route>
                            <Route path='/learning-content/edit'>
                              <ContentEditRoute />
                            </Route>
                            <Route
                              path='/learning-paths'
                              component={() => (
                                <LearningPathList
                                  currentUser={currentUser}
                                  queryDecider={queryDecider}
                                />
                              )}
                            />
                            <Route path='/finished-path'>
                              <LearningPathSuccess />
                            </Route>
                            <Route
                              exact
                              path='/share/:contentId'
                              component={() => <ShareFromEmail />}
                            />
                            <Route
                              path='/path-templates/form'
                              exact
                              children={
                                <PathTemplateCreate
                                  currentUser={currentUser}
                                  queryDecider={queryDecider}
                                />
                              }
                            />
                            <Route
                              path='/learning-path/:pathId'
                              exact
                              children={
                                <LearningPathPage
                                  currentUser={currentUser}
                                  queryDecider={queryDecider}
                                />
                              }
                            />
                            <Route
                              path='/edit/profile'
                              exact
                              children={
                                <EditProfile currentUser={currentUser} />
                              }
                            />
                            <Route
                              path='/events'
                              component={() => (
                                <Events
                                  currentUser={currentUser}
                                  queryDecider={queryDecider}
                                />
                              )}
                            />
                            <Route
                              path='/event-templates/form'
                              exact
                              children={
                                <EventTemplateCreate
                                  currentUser={currentUser}
                                  queryDecider={queryDecider}
                                />
                              }
                            />
                            {/*this one is going to stay*/}
                            <Route path='/event/:eventId' exact>
                              <SingleEvent currentUser={currentUser} />
                            </Route>
                            <Route path='/past-event/:eventId' exact>
                              <PastEvent currentUser={currentUser} />
                            </Route>
                            {/* DEFAULT ROUTE (404) */}
                            <Route
                              component={() => (
                                <Redirect
                                  to={{ pathname: '/error-page/404' }}
                                />
                              )}
                            />
                          </Switch>
                        </div>
                      </div>
                    </>
                  )}
                </ApolloConsumer>
              </div>
              <FiltersMobile />
              <ShareContent
                currentUser={currentUser}
                setLibraryHighlight={this.setLibraryHighlight}
              />
              <GoalPopup />
              {teamsIds.length > 0 && (
                <RecommendContent
                  currentUser={currentUser}
                  queryDecider={queryDecider}
                />
              )}
              <Route
                path='/learning-path/:pathId'
                exact
                children={
                  <AssignPath
                    currentUser={currentUser}
                    queryDecider={queryDecider}
                  />
                }
              />
              <Route
                path='/learning-paths'
                children={
                  <AssignPath
                    currentUser={currentUser}
                    queryDecider={queryDecider}
                  />
                }
              />

              <style jsx>{elementStyle}</style>
              <style jsx>{globalStyle}</style>
              {stylesIE}
            </Authenticate>
          </UserContext.Provider>
          {pathname === '/' && currentUser.hasEvent && (
            <div className='events__home'>
              <HomeEventsDesktop />
            </div>
          )}
        </div>
      )
    } else return <Logout history={history} />
  }
}

export default () => {
  const { search } = useLocation()
  const searchParams = new URLSearchParams(search)
  const learner = searchParams.get('learner')

  return (
    <Query query={currentUser}>
      {({ data, loading, error }) => {
        if (loading) return <p>...Loading</p>
        if (error) return <SentryDispatch error={error} />

        const user = data && data.currentUser

        if (user) {
          return (
            <AppQueryWrapper user={user} showLearnerDashboard={!!learner} />
          )
        }
        return null
      }}
    </Query>
  )
}
