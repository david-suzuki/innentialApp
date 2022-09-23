import React, { useState } from 'react'
import {
  Statement,
  List,
  UserItems,
  FeedbackRequestItem
} from '../ui-components'
import { useQuery, useMutation } from 'react-apollo'
import { Button, Notification } from 'element-react'
import {
  fetchUserPendingFeedbackRequests,
  requestUserFeedback
} from '../../api'
import { captureFilteredError, LoadingSpinner } from '../general'
// import { remapEmployeesForUI } from '../teams/_teamUtils'
import { Link } from 'react-router-dom'

const EvaluateButton = ({ feedbackShareKey }) => {
  return (
    <Link to={`/feedback/${feedbackShareKey}`}>
      <Button type='primary' size='small'>
        <i
          style={{ fontWeight: 800, fontSize: '17px' }}
          className='icon icon-tail-right-2'
        />
      </Button>
    </Link>
  )
}

const UserPendingRequestList = () => {
  // const [request] = useMutation(requestUserFeedback, {
  //   update: (proxy, { data: { requestUserFeedback: employees } }) => {
  //     try {
  //       proxy.writeQuery({
  //         query: fetchUserPeerFeedbackRequests,
  //         data: {
  //           fetchUserPeerFeedbackRequests: employees
  //         }
  //       })
  //     } catch (e) {
  //       console.log(e)
  //     }
  //   }
  // })
  const { data, loading, error } = useQuery(fetchUserPendingFeedbackRequests, {
    fetchPolicy: 'cache-and-network'
  })

  if (loading) return <LoadingSpinner />

  if (error) {
    captureFilteredError(error)
    return <Statement content='Oops! Something went wrong' />
  }

  // const handleRequesting = userId => {
  //   request({
  //     variables: {
  //       userId
  //     }
  //   })
  //     .then(({ data: { requestUserFeedback: res } }) => {
  //       Notification({
  //         type: 'success',
  //         message: 'Request sent!',
  //         duration: 2500,
  //         offset: 90
  //       })
  //     })
  //     .catch(err => {
  //       captureFilteredError(err)
  //       Notification({
  //         type: 'warning',
  //         message: 'Oops! Something went wrong',
  //         duration: 2500,
  //         offset: 90
  //       })
  //     })
  // }

  const requests = data && data.fetchUserPendingFeedbackRequests

  // const mappedRequests = remapEmployeesForUI(
  //   requests.map(({ requestedBy: user, requestedAt, feedbackShareKey }) => ({
  //     ...user,
  //     children: (
  //       <div className='align-right'>
  //         <div style={{ color: '#979797' }}>
  //           Requested on {new Date(requestedAt).toDateString()}
  //         </div>
  //         <EvaluateButton feedbackShareKey={feedbackShareKey} />
  //       </div>
  //     )
  //   }))
  // )

  return (
    <div className='generate-feedback__content'>
      {requests.length > 0 && (
        <List>
          {requests.map(
            ({ _id, requestedBy: user, feedbackShareKey, ...rest }) => (
              <FeedbackRequestItem
                key={_id}
                user={user}
                children={
                  <EvaluateButton feedbackShareKey={feedbackShareKey} />
                }
                {...rest}
              />
            )
          )}
          {/* <UserItems items={mappedRequests} /> */}
        </List>
      )}
      {requests.length === 0 && <Statement content='No pending requests' />}
    </div>
  )
}

export default UserPendingRequestList
