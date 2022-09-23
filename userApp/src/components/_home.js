import React, { Component } from 'react'
import {
  AdminDashboard,
  LeaderDashboard
  // Tab,
  // TabsList,
  // TabContent,
  // Tabs
} from './ui-components'
import { withRouter } from 'react-router-dom'
// import {
// UserSearch /*, DraftGoalDashboardView */
// } from './dashboard-components'
// import Container from '../globalState'
import { DevelopmentPlan } from './development-plans'
import { Button, Loading } from 'element-react'
import { checkReadyForReviewGoalsForUser } from '../api'
import { Query, useQuery } from 'react-apollo'
import { captureFilteredError } from './general'
import HomeEventsMobile from './events/HomeEventsMobile'
import { dashboardStyles } from '../styles/dashboardStyles'

// const HandleGlobalState = ({ children }) => {
//   const { setPreferencesState } = Container.useContainer()
//   return children(setPreferencesState)
// }

class Home extends Component {
  state = {
    goToDevPlan: false,
    isAdmin: this.props.user.roles.indexOf('ADMIN') !== -1,
    // evaluationInfo: this.props.evaluationInfo,
    openAssests: [],
    TSRData: []
    // isViewingPeople: this.props.initialTab === 0,
    // fetchPolicy: 'cache-and-network'
  }

  // tabsRef = null

  componentDidMount = () => {
    if (this.props.goToDevPlan) {
      this.toggleTabListAndHeader()
      this.setState({ goToDevPlan: true })
    }

    if (this.props.triggerDevPlanTour) {
      if (process.env.REACT_APP_STAGING === 'true') {
        window.Intercom && window.Intercom('startTour', 94547)
      } else {
        window.Intercom && window.Intercom('startTour', 94800)
      }
    }
  }

  // if (this.props.initialTab !== 0) {
  //   this.props.setPreferencesState({
  //     visible: true,
  //     skills: true,
  //     filters: true, {isAdmin && <AdminRequestsOverview short />}
  //     types: true
  //   })
  // }

  // componentWillUnmount = () => {
  //   this.props.setPreferencesState({ visible: false })
  // }

  // goToEvaluate = (e, data) => {
  //   e.preventDefault()
  //   this.props.history.push('/evaluate', data)
  // }

  // onClickTab = tabIndex => {
  //   switch (tabIndex) {
  //     case 0:
  //       this.props.setPreferencesState({
  //         visible: false
  //       })
  //       break
  //     // case 1:
  //     //   this.props.setPreferencesState({
  //     //     visible: true,
  //     //     skills: true,
  //     //     filters: true,
  //     //     types: true
  //     //   })
  //     //   break
  //     case 1:
  //       this.props.setPreferencesState({
  //         visible: true,
  //         skills: true,
  //         filters: false
  //       })
  //       break
  //     default:
  //       this.props.setPreferencesState({
  //         visible: false
  //       })
  //       break
  //   }
  // }

  toggleTabListAndHeader = () => {
    const [tabList] = document.getElementsByClassName('tabs-list')
    const [header] = document.getElementsByClassName(
      'page-header page-header--button'
    )
    if (header && header.style.display !== 'none') {
      header.style.display = 'none'
    } else header.style.display = 'flex'
    if (tabList) {
      tabList.hidden = !tabList.hidden
    }
    this.setState({ goToDevPlan: false })
  }

  render() {
    const { isAdmin, goToDevPlan } = this.state
    const {
      adminDashboard,
      leaderDashboard,
      displayDrafts,
      user,
      queryDecider,
      teamsIds
    } = this.props

    let displayCarousel, displayTeamInvite /*, displayEvaluation */, displayList
    let displayCounter = 0
    if (displayDrafts) displayCounter++
    if (isAdmin && teamsIds.length === 0) {
      displayCounter++
      displayTeamInvite = true
    }
    // if (evaluationInfo.length > 0) {
    //   evaluationInfo.forEach(() => displayCounter++)
    //   displayEvaluation = true
    // }
    if (displayCounter > 1) {
      displayCarousel = true
    } else if (displayCounter === 1) {
      displayList = true
    }

    const adminProps = {
      user,
      displayCarousel,
      displayTeamInvite,
      displayDrafts,
      displayList,
      history: this.props.history,
      teamsIds
    }

    return (
      <div className='component-block' style={{ position: 'relative' }}>
        {adminDashboard && (
          <AdminDashboard {...adminProps} queryDecider={queryDecider} />
        )}

        {leaderDashboard && (
          <LeaderDashboard leaderId={user._id} queryDecider={queryDecider} />
        )}

        <HomeEventsMobile />
        {/* NAVIGATION */}

        {/* <Tabs
          onChange={this.onClickTab}
          // initialActiveTabIndex={initialTab || 0}
        >
          <TabsList>
            <Tab>Development Plan</Tab>
            <Tab>People</Tab>
          </TabsList>
          <TabContent> */}
        {!adminDashboard && !leaderDashboard && (
          <DevelopmentPlan
            toggleTabListAndHeader={this.toggleTabListAndHeader}
            canRecommend={isAdmin || user.leader}
            instantEdit={goToDevPlan}
            currentUser={user}
            triggerDevPlanTour={this.props.triggerDevPlanTour}
            setLibraryHighlight={this.props.setLibraryHighlight}
            setHighlightCompleted={this.props.setHighlightCompleted}
          />
        )}

        {/* </TabContent>
          <TabContent>
            <div className="tab-content">
              <UserSearch
                organizationData={this.props.organizationData}
                currentUser={this.props.user}
              />
            </div>
          </TabContent>
        </Tabs> */}
        <style jsx>{dashboardStyles}</style>
      </div>
    )
  }
}

export default React.memo(
  withRouter(
    props => {
      const { location } = props

      const triggerDevPlanTour =
        location.state && location.state.activateGoalTour
      // let goToContent = false
      let goToDevPlan = false
      // let showGeneratedGoals = false
      if (location && location.state) {
        // showGeneratedGoals = location.state.showGeneratedGoals
        goToDevPlan = location.state.goToDevPlan
        // goToContent = location.state.activeName === 'Learning'
        delete location.state
      }

      // const initialTab = goToContent ? 1 : 0
      return (
        // <HandleGlobalState>
        //   {setPreferencesState => (
        <Query
          query={checkReadyForReviewGoalsForUser}
          fetchPolicy='cache-and-network'
        >
          {({ data, loading, error }) => {
            if (loading);

            if (error) {
              captureFilteredError(error)
            }

            const displayDrafts =
              (data && data.checkReadyForReviewGoalsForUser) || false

            return (
              <Home
                {...props}
                // initialTab={initialTab}
                // setPreferencesState={setPreferencesState}
                goToDevPlan={goToDevPlan}
                triggerDevPlanTour={triggerDevPlanTour}
                displayDrafts={displayDrafts}
                // showGeneratedGoals={showGeneratedGoals}
              />
            )
          }}
        </Query>
      )
    }
    // </HandleGlobalState>
  )
)
// })

// EVERYTHING RELATED TO EVALUATIONS IS REMOVED FROM HOME FOR NOW

// <Query query={fetchEvaluationInfo}>
//   {({ data, loading, error }) => {
//     if (loading) return <LoadingSpinner />
//     if (error) {
//       captureFilteredError(error)
//       return <Home {...props} evaluationInfo={[]} initialTab={initialTab} />
//     }
//     if (data) {
//       const evaluations =
//         data.fetchEvaluationInfo &&
//         data.fetchEvaluationInfo.teamInformations

//       if (evaluations && evaluations.length > 0) {
//         const validEvaluations =
//           evaluations &&
//           evaluations.reduce((acc = [], curr) => {
//             if (checkEvaluateStatus(curr)) return [...acc, curr]
//             else return acc
//           }, [])

//         return (
//           <Home
//             {...props}
//             evaluationInfo={validEvaluations}
//             initialTab={initialTab}
//           />
//         )
//       }
//     }
//     return <Home {...props} evaluationInfo={[]} initialTab={initialTab} />
//   }}
// </Query>

// const checkEvaluateStatus = data => {
//   let users = data.usersToEvaluate.reduce((acc = [], curr) => {
//     if (curr.completed) {
//       if (
//         data.evaluatedUsers &&
//         data.evaluatedUsers.indexOf(curr.userId) === -1
//       )
//         return [...acc, curr]
//     } else return acc
//   }, [])
//   if (!users) users = []
//   if (data.shouldSetRequired === false && users.length === 0) return false
//   if (!data.allCompleted) return false
//   return true
// }

// const EvaluateAction = ({ goToEvaluate, data }) => {
//   let users = data.usersToEvaluate.reduce((acc = [], curr) => {
//     if (curr.completed) {
//       if (
//         data.evaluatedUsers &&
//         data.evaluatedUsers.indexOf(curr.userId) === -1
//       )
//         return [...acc, curr]
//     } else return acc
//   }, [])
//   if (!users) users = []

//   if (data.shouldSetRequired === false && users.length === 0) return null

//   let msg = ''

//   if (data.allCompleted) {
//     msg = 'Evaluate skills of your team'
//   } else {
//     return null
//   }
//   const finalData = { ...data, usersToEvaluate: users }

//   return (
//     <ActionItem
//       label={data.teamName}
//       button="Evaluate"
//       onButtonClicked={e => goToEvaluate(e, finalData)}
//       purpleBackground
//     >
//       {msg}
//     </ActionItem>
//   )
// }

// TEAM STAGE RESULT RELATED STUFF BELOW

// IMPORTS

// fetchOpenAssessmentsForUser as DashboardQuery,
// fetchAllStageResults as TSRQuery,
// fetchCompletedAssesmentsForUser,
// fetchUserContentInteractions,
// addDownloadedPdfs,
// import * as typeformEmbed from '@typeform/embed'

// RENDER

// if (openAssests.length > 0) {
//   displayList = true
//   displayAssessment = true
// }
// if (TSRData.length > 0) {
//   TSRData.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
//   displayList = true
//   displayPdf = true
// }

/* {displayAssessment &&
              openAssests.map(assest => {
                const userTeam = userTeams.find(
                  team => team.active && team._id === assest.teamId
                )
                if (userTeam) {
                  return (
                    <TypeFormAction
                      key={assest.teamId}
                      onSubmit={() =>
                        this.onTypeformSubmit(
                          assest._id,
                          assest.email,
                          assest.teamId
                        )
                      }
                      assessment={assest}
                      teamName={userTeam.teamName}
                    />
                  )
                } else return null
              })}
            {displayPdf && (
              <DownloadPdfAction
                reportLink={TSRData[0].reportLink}
                assessmentId={TSRData[0]._id}
                onPdfDownload={this.onPdfDownload}
              />
            )} */

// COMPONENTS

// const TypeFormAction = ({ onSubmit, assessment, teamName }) => {
//   const { email, _id, teamId } = assessment
//   return (
//     <ActionItem
//       label={`${teamName}`}
//       button="Begin"
//       onButtonClicked={() => {
//         typeformEmbed.makePopup(
//           `https://innential.typeform.com/to/pw0ctR?email=${email}&team=${teamId}&assessment=${_id}`,
//           {
//             autoOpen: true,
//             autoClose: 100,
//             hideScrollbars: true,
//             onSubmit: onSubmit
//           }
//         )
//       }}
//     >
//       Start the Team Potential Assessment
//     </ActionItem>
//   )
// }

// const DownloadPdfAction = ({ reportLink, assessmentId, onPdfDownload }) => {
//   return (
//     <ActionItem
//       button="Download"
//       onButtonClicked={e => onPdfDownload(e, reportLink, assessmentId)}
//       label="Important"
//     >
//       First report after Team Stage assessment is available
//     </ActionItem>
//   )
// }

// METHODS

// onTypeformSubmit = (assessmentId, email, teamId) => {
//   const { cache } = this.props.client

//   const { fetchOpenAssessmentsForUser } = cache.readQuery({
//     query: DashboardQuery
//   })
//   const newOpenAssessments = fetchOpenAssessmentsForUser.filter(
//     open => open._id !== assessmentId
//   )
//   cache.writeQuery({
//     query: DashboardQuery,
//     data: {
//       fetchOpenAssessmentsForUser: newOpenAssessments
//     }
//   })
//   // Update the state
//   this.setState({
//     openAssests: newOpenAssessments
//   })
//   try {
//     // Use the client to update the team page
//     const { fetchAllStageResults } = cache.readQuery({
//       query: TSRQuery,
//       variables: {
//         teamId
//       }
//     })
//     const ix = fetchAllStageResults.findIndex(
//       assessment => assessment._id === assessmentId
//     )
//     fetchAllStageResults[ix].participants.emails.push(email)
//     cache.writeQuery({
//       query: TSRQuery,
//       data: {
//         fetchAllStageResults
//       }
//     })
//   } catch (e) {
//     console.log(e)
//     // If the team page was not accessed, the client won't find the query
//   }
// }

// onPdfDownload = (e, reportLink, assessmentId) => {
//   e.preventDefault()
//   window.open(reportLink)
//   this.props.client.mutate({
//     mutation: addDownloadedPdfs,
//     variables: {
//       downloadedPdf: assessmentId
//     },
//     refetchQueries: ['fetchUserContentInteractions']
//   })
//   this.setState({
//     TSRData: this.state.TSRData.filter(tsr => tsr._id !== assessmentId)
//   })
// }

// popAssessment = (email, teamId, assessment, onSubmit) => {
//   this.setState({ pointToAssessment: undefined })
//   typeformEmbed.makePopup(
//     `https://innential.typeform.com/to/pw0ctR?email=${email}&team=${teamId}&assessment=${assessment}`,
//     {
//       autoOpen: true,
//       autoClose: 350,
//       hideScrollbars: true,
//       onSubmit
//     }
//   )
// }
