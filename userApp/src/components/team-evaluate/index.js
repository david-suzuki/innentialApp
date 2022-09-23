import React, { Component } from 'react'
import { withRouter, Redirect } from 'react-router-dom'
import { Query } from 'react-apollo'
import { fetchTeam, fetchEvaluationInfo } from '../../api'
import { FootPager } from '../ui-components'
import oldBottomNavStyle from '../../styles/oldBottomNavStyle'
import UserEvaluatePage from './UserEvaluatePage'
import SelectRequiredTeamSkills from './SelectRequiredTeamSkills'
import TeamSkillsRequirementPage from './TeamSkillsRequirementPage'
import { RouteManager } from '../../utils'
import '../../styles/theme/notification.css'
import {
  captureFilteredError,
  SentryDispatch,
  LoadingSpinner
} from '../general'
import Container from '../../globalState'

const HandleGlobalState = ({ children }) => {
  const { setFrameworkState } = Container.useContainer()
  return children(setFrameworkState)
}

class Evaluate extends Component {
  constructor(props) {
    super(props)
    let unevaledUsers = []
    const { evaluateData } = props
    if (
      evaluateData &&
      evaluateData.usersToEvaluate &&
      evaluateData.usersToEvaluate.length > 0
    ) {
      unevaledUsers = evaluateData.usersToEvaluate.reduce((acc = [], curr) => {
        if (curr.completed) {
          if (
            props.evaluateData.evaluatedUsers &&
            props.evaluateData.evaluatedUsers.indexOf(curr.userId) === -1 &&
            curr.userId !== props.currentUser._id
          )
            return [...acc, curr]
          return acc
        } else return acc
      }, [])
    }

    if (!unevaledUsers || props.onlyRequired) unevaledUsers = []

    this.state = {
      users: unevaledUsers,
      pageCount: unevaledUsers.length,
      currentPage: 0
      // focusedSkillFrameworkId: '',
      // focusedSkillFrameworkLevel: 0
    }

    RouteManager.beginEvaluate(props.evaluateData, props.client)
  }

  changePage = i => {
    const currentPage = this.state.currentPage + i
    this.setState({ currentPage })
  }

  setRequiredSkills = skills => {
    this.setState({ requiredSkills: skills }, () => this.changePage(1))
  }

  componentWillUnmount = () => {
    this.props.setFrameworkState({ visible: false })
  }

  // setFocusedFramework = (id, level) => {
  //   this.setState({
  //     focusedSkillFrameworkId: id,
  //     focusedSkillFrameworkLevel: level
  //   })
  // }

  lastCurrentPage = 0
  componentDidUpdate() {
    const { currentPage, pageCount } = this.state
    const shouldBeActive =
      currentPage === pageCount + 1 || currentPage < pageCount
    if (!shouldBeActive && this.lastCurrentPage !== currentPage) {
      this.lastCurrentPage = currentPage
      this.props.setFrameworkState({ visible: false })
    }
  }

  render() {
    if (!this.props.evaluateData) {
      return <SentryDispatch error={new Error(`Evaluate data not provided`)} />
    } else {
      const {
        currentPage,
        pageCount,
        users
        // focusedSkillFrameworkId,
        // focusedSkillFrameworkLevel
      } = this.state
      const pagesArray = []

      const pageDelta = 2
      for (let i = 0; i < pageCount + pageDelta; ++i) pagesArray.push(i)

      if (this.props.redirect.split('/')[1] !== 'teams') {
        RouteManager.teamDetailsTabName = 'Members'
      }

      return (
        <>
          {currentPage >= pageCount + pageDelta ? (
            <Redirect
              to={{
                pathname: this.props.redirect,
                state: { justEvaluated: true }
              }}
            />
          ) : null}
          {/* <HandleGlobalState activePage={currentPage} pageCount={pageCount} /> */}
          {currentPage < pageCount &&
            users.map((user, idx) => {
              if (idx === currentPage)
                return (
                  <UserEvaluatePage
                    key={user.userId}
                    teamInfo={this.props.teamDetails}
                    user={user}
                    evalId={this.props.evaluateData._id}
                    changePage={this.changePage}
                    index={idx}
                  />
                )
              return null
            })}
          {currentPage === pageCount && (
            <SelectRequiredTeamSkills
              teamInfo={this.props.teamDetails}
              changePage={this.changePage}
              setRelevantSkills={this.setRequiredSkills}
              currentPage={currentPage}
            />
          )}
          {/* {currentPage === pageCount + 1 && (
            <div className="skill-framework">
              <SkillsFramework
                frameworkId={focusedSkillFrameworkId}
                selectedLevel={focusedSkillFrameworkLevel}
              />
            </div>
          )} */}
          {currentPage === pageCount + 1 && (
            <TeamSkillsRequirementPage
              evalId={this.props.evaluateData._id}
              teamInfo={this.props.teamDetails}
              changePage={this.changePage}
              selectedSkills={this.state.requiredSkills}
              // setFocusedFramework={this.setFocusedFramework}
            />
          )}
          <br />
          <div style={{ display: 'inline-block' }}>
            <FootPager screenList={pagesArray} currentScreen={currentPage} />
          </div>
          <style jsx>{oldBottomNavStyle}</style>
        </>
      )
    }
  }
}

const teamQuery = ({ location, history, currentUser }) => {
  const evaluateData = location && location.state
  if (!evaluateData) {
    return <SentryDispatch error={new Error(`Evaluation info not provided`)} />
  } else if (evaluateData.forceEval) {
    return (
      <Query query={fetchEvaluationInfo} fetchPolicy='no-cache'>
        {({ data, loading, error, client }) => {
          if (loading) return <LoadingSpinner />
          if (error) {
            captureFilteredError(error)
            return null
          }

          const allEvals = data && data.fetchEvaluationInfo
          if (allEvals) {
            const teamsEval = allEvals.teamInformations.find(
              ev => ev.teamId === evaluateData.teamId
            )
            return (
              <Query
                query={fetchTeam}
                variables={{ teamId: evaluateData.teamId }}
              >
                {({ data, loading, error, client }) => {
                  if (error) {
                    captureFilteredError(error)
                    return null
                  }
                  if (loading) return <LoadingSpinner />

                  if (data) {
                    const team = data && data.fetchTeam
                    return (
                      <HandleGlobalState>
                        {setFrameworkState => (
                          <Evaluate
                            teamDetails={team}
                            evaluateData={teamsEval}
                            redirect={evaluateData.redirect}
                            currentUser={currentUser}
                            client={client}
                            onlyRequired
                            setFrameworkState={setFrameworkState}
                          />
                        )}
                      </HandleGlobalState>
                    )
                  }
                  return null
                }}
              </Query>
            )
          }
          return null
        }}
      </Query>
    )
  } else
    return (
      <Query query={fetchTeam} variables={{ teamId: evaluateData.teamId }}>
        {({ data, loading, error, client }) => {
          if (error) {
            captureFilteredError(error)
            return null
          }
          if (loading) return <LoadingSpinner />

          if (data) {
            const team = data && data.fetchTeam
            return (
              <HandleGlobalState>
                {setFrameworkState => (
                  <Evaluate
                    teamDetails={team}
                    evaluateData={evaluateData}
                    client={client}
                    redirect={`/team/${team._id}`}
                    currentUser={currentUser}
                    setFrameworkState={setFrameworkState}
                  />
                )}
              </HandleGlobalState>
            )
          }
          return null
        }}
      </Query>
    )
}

export { default as FeedbackRequestPopup } from './FeedbackRequestPopup'
export { default as UserFeedbackList } from './UserFeedbackList'
export { default as ProfileFeedbackList } from './ProfileFeedbackList'
export { default as UserFeedbackRequest } from './UserFeedbackRequest'
export { default as UserFeedbackReceipts } from './UserFeedbackReceipts'
export { default as UserPendingRequest } from './UserPendingRequest'
export default withRouter(teamQuery)
