import history from '../history'

export default class RouteManager {
  static isEvaluating = false
  static evaluateData = {}
  static apolloClient = null
  static currentLocation = null
  static teamSkillView = false
  static orgSkillView = false
  static teamDetailsTabName = ''
  static orgDetailsTabName = 'Teams'

  static beginEvaluate = (data, client) => {
    RouteManager.isEvaluating = true
    RouteManager.evaluateData = data
    RouteManager.apolloClient = client
  }

  static finishEvaluate = () => {
    RouteManager.isEvaluating = false
    RouteManager.evaluateData = {}
    RouteManager.apolloClient = null
  }

  static getTeamSkillView = () => {
    if (RouteManager.teamSkillView) {
      RouteManager.teamSkillView = false
      return true
    }
    return false
  }

  static getOrgSkillView = () => {
    if (RouteManager.orgSkillView) {
      RouteManager.orgSkillView = false
      return true
    }
    return false
  }

  getCurrentLocation = () => {
    return RouteManager.currentLocation
  }

  evaluateListener = (location, action) => {
    if (location.pathname === '/evaluate') {
      RouteManager.isEvaluating = true
    } else {
      // if (RouteManager.isEvaluating) {
      //   if (!location.state || !location.state.justEvaluated) {
      //     RouteManager.apolloClient
      //       .mutate({
      //         mutation: deleteEvaluation,
      //         variables: {
      //           evalId: RouteManager.evaluateData._id
      //         },
      //         refetchQueries: ['fetchEvaluationInfo']
      //       })
      //       .catch(e => captureFilteredError(e))
      //     RouteManager.finishEvaluate()
      //   } else {
      //     RouteManager.finishEvaluate()
      //   }
      // }
    }
  }

  evaluateListen = () => history.listen(this.evaluateListener)

  preferencesListener = (location, action) => {
    window.scrollTo(0, 0)
    RouteManager.currentLocation = location.pathname
  }

  preferencesListen = () => history.listen(this.preferencesListener)
}
