import React from 'react'
// import goalReviewStyle from '../styles/goalReviewStyle'
import { withRouter, Redirect } from 'react-router-dom'
import { Query } from 'react-apollo'
import { fetchPeerFeedbackInfo } from '../api'
import { LoadingSpinner, captureFilteredError } from './general'
// import history from '../history'
// import { GoalSkillFeedback } from './goals'
import { Notification } from 'element-react'

export default withRouter(({ match: { params } }) => {
  const { feedbackShareKey } = params

  return (
    <Query
      query={fetchPeerFeedbackInfo}
      variables={{ feedbackShareKey }}
      fetchPolicy='cache-and-network'
    >
      {({ data, loading, error }) => {
        if (loading) return <LoadingSpinner />
        if (error) {
          captureFilteredError(error)
          return <Redirect to='/error-page/404' />
        }

        if (data) {
          if (data.fetchPeerFeedbackInfo !== null) {
            const {
              _id: userId,
              userName: fullName
            } = data.fetchPeerFeedbackInfo

            return (
              <Redirect
                to={{
                  pathname: '/evaluate-employee',
                  state: {
                    userId,
                    fullName,
                    redirect: `/feedback-page/pending`
                  }
                }}
              />
            )
            // if (goals.length > 0 && reviewId) {
            //   return (
            //     <div>
            //       <div className="goal-review__heading">
            //         <i
            //           className="goal-review__back__button icon icon-small-right icon-rotate-180"
            //           onClick={e => {
            //             e.preventDefault()
            //             history.goBack()
            //           }}
            //         />
            //         <div className="goal-review__heading-info">
            //           <h1>Peer goal review</h1>
            //           <div className="goal-review__date">{fullName}</div>
            //         </div>
            //       </div>
            //       <GoalSkillFeedback
            //         userId={userId}
            //         goals={goals}
            //         reviewId={reviewId}
            //         onGoalSubmit={() => history.goBack()}
            //       />
            //       <style jsx>{goalReviewStyle}</style>
            //     </div>
            //   )
            // }
          } else {
            Notification({
              type: 'info',
              message: "You can't give skill feedback to yourself",
              duration: 2500,
              offset: 90,
              iconClass: 'el-icon-info'
            })
            return <Redirect to='/' />
          }
        }
        return <Redirect to='/error-page/500' />
      }}
    </Query>
  )
})
