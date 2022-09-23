import React, { useState } from 'react'
import { Statement, List, FeedbackRequestItem } from '../ui-components'
import { useQuery, useMutation } from 'react-apollo'
import { Button, Notification } from 'element-react'
import { fetchUserPeerFeedbackRequests, requestUserFeedback } from '../../api'
import { captureFilteredError, LoadingSpinner } from '../general'
// import { remapEmployeesForUI } from '../teams/_teamUtils'

const RequestButton = ({ handleClick }) => {
  const [disabled, setDisabled] = useState(false)
  return (
    <Button
      type='text'
      disabled={disabled}
      onClick={() => {
        handleClick()
        setDisabled(true)
      }}
    >
      {disabled ? (
        <span>
          <i className='icon icon-check-small' /> Sent
        </span>
      ) : (
        'Resend'
      )}
    </Button>
  )
}

export default ({ teamId }) => {
  const [request] = useMutation(requestUserFeedback, {
    update: (proxy, { data: { requestUserFeedback: employees } }) => {
      try {
        proxy.writeQuery({
          query: fetchUserPeerFeedbackRequests,
          ...(teamId && {
            variables: {
              userId: teamId
            }
          }),
          data: {
            fetchUserPeerFeedbackRequests: employees
          }
        })
      } catch (e) {
        console.log(e)
      }
    }
  })
  const { data, loading, error } = useQuery(fetchUserPeerFeedbackRequests, {
    variables: {
      userId: teamId
    }
  })

  if (loading) return <LoadingSpinner />

  if (error) {
    captureFilteredError(error)
    return <Statement content='Oops! Something went wrong' />
  }

  const handleRequesting = userId => {
    request({
      variables: {
        userId,
        teamId
      }
    })
      .then(() => {
        Notification({
          type: 'success',
          message: 'Request sent!',
          duration: 2500,
          offset: 90
        })
      })
      .catch(err => {
        captureFilteredError(err)
        Notification({
          type: 'warning',
          message: 'Oops! Something went wrong',
          duration: 2500,
          offset: 90
        })
      })
  }

  const requests = data && data.fetchUserPeerFeedbackRequests

  // const mappedRequests = remapEmployeesForUI(
  //   requests.map(({ requestedFrom: user, requestedAt }) => ({
  //     ...user,
  //     children: (
  //       <div className='align-right'>
  //         <div style={{ paddingRight: '21px', color: '#979797', fontSize: '13px' }}>
  //           Requested on {new Date(requestedAt).toDateString()}
  //         </div>
  //         <RequestButton handleClick={() => handleRequesting(user._id)} />
  //       </div>
  //     )
  //   }))
  // )

  return (
    <div className='generate-feedback__content'>
      {requests.length > 0 && (
        <div className='tab-content'>
          <List>
            {/* <UserItems items={mappedRequests} /> */}
            {requests.map(({ _id, requestedFrom: user, ...rest }) => (
              <FeedbackRequestItem
                key={_id}
                user={user}
                children={
                  <RequestButton
                    handleClick={() => handleRequesting(user._id)}
                  />
                }
                {...rest}
              />
            ))}
          </List>
        </div>
      )}
      {requests.length === 0 && (
        <Statement content='No active feedback requests' />
      )}
    </div>
  )
}
