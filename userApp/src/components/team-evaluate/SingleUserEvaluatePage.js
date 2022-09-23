import React from 'react'
import UserEvaluatePage from './UserEvaluatePage'
import { Redirect, withRouter } from 'react-router-dom'
import { Notification } from 'element-react'
// import { Query } from 'react-apollo'
// import { fetchUsersTeam } from '../../api'
// import { captureFilteredError, LoadingSpinner } from '../general'

// class MultipleUsersEvaluatePage extends Component {
//   state = {}

//   render() {
//     return (
//       <div>Hello guys</div>
//     )
//   }
// }

const teamQuery = ({ location, history, currentUser }) => {
  const evaluateData = location && location.state
  if (!evaluateData) return <Redirect to='/error-page/404' />
  const { userId, fullName, redirect } = evaluateData
  if (!userId) return <Redirect to='/error-page/404' />
  if (userId === currentUser._id) {
    Notification({
      message: 'Cannot give feedback to yourself',
      type: 'info',
      iconClass: 'el-icon-info',
      duration: 2500,
      offset: 90
    })
    return <Redirect to='/feedback-page/received' />
  }
  return (
    <UserEvaluatePage
      // teamInfo={team}
      user={{ userId, fullName }}
      index={0}
      singleUser
      changePage={() =>
        redirect ? history.replace(redirect) : history.goBack()
      }
    />
  )
}

// <Query query={fetchUsersTeam} variables={{ userId }}>
//   {({ data, loading, error }) => {
//     if (error) {
//       captureFilteredError(error)
//       return null
//     }
//     if (loading) return <LoadingSpinner />
//     if (data) {
//       const team = data.fetchUsersTeam
//       if (team)
//         return (
//         )
//       else return null
//     }
//     return null
//   }}
// </Query>

export default withRouter(teamQuery)
