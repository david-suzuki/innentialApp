import React, { useState } from 'react'
import { useQuery } from 'react-apollo'
import { Redirect, useHistory, useParams, useLocation } from 'react-router-dom'
import { fetchRequestsForUser } from '../../api'
import { captureFilteredError, LoadingSpinner } from '../general'
import {
  ListSort,
  remapLearningContentForUI,
  Statement
} from '../ui-components'
import { AdminRequestItem } from './components'

const sortOptions = [
  {
    label: 'Requested at (newest)',
    callback: (a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt)
    }
  },
  {
    label: 'Requested at (oldest)',
    callback: (a, b) => {
      return new Date(a.createdAt) - new Date(b.createdAt)
    }
  }
  // {
  //   label: 'Status',
  //   callback: (a, b) => {
  //     if(a.approved === null && b.approved !== null) {
  //       return -1
  //     }
  //     return a.approved - b.approved
  //   }
  // },
  // {
  //   label: 'Goal',
  //   callback: (a, b) => {
  //     return (b.goal?.goalName || "").localeCompare(a.goal?.goalName || "")
  //   }
  // }
]

// const filterOptions = [
//   {
//     label: 'All',
//     callback: () => true
//   },
//   {
//     label: 'Pending',
//     callback: ({ approved }) => approved === null
//   },
//   {
//     label: 'Reviewed',
//     callback: ({ approved }) => approved !== null
//   },
// ]

const AdminRequestsPage = () => {
  const [sortMethod, setSortMethod] = useState(sortOptions[0])
  // const [filter, setFilter] = useState(filterOptions[0])

  const { userId } = useParams()

  const { search } = useLocation()

  const highlightId = new URLSearchParams(search).get('highlight')

  const { data, loading, error } = useQuery(fetchRequestsForUser, {
    fetchPolicy: 'cache-and-network',
    variables: {
      user: userId
    }
  })
  const history = useHistory()

  if (loading) return <LoadingSpinner />

  if (error) {
    captureFilteredError(error)
    return <Redirect to='/error-page/500' />
  }

  const requests = data?.fetchRequestsForUser || []

  if (requests.length === 0) return <Redirect to='/' />

  const pendingRequests = requests.filter(({ approved }) => approved === null)

  const highlightRequest = pendingRequests.find(
    ({ _id: requestId }) => highlightId === requestId
  )

  const { user } = requests[0]

  pendingRequests.sort(sortMethod.callback)

  return (
    <div>
      <div className='page-heading'>
        <i
          className='page-heading__back__button icon icon-small-right icon-rotate-180'
          onClick={() => history.goBack()}
        />
        <div className='page-heading-info'>
          <h1>{user.firstName}'s pending requests</h1>
        </div>
      </div>
      {pendingRequests.length === 0 ? (
        <Statement content='There are no more pending learning requests' />
      ) : (
        <>
          {highlightRequest && (
            <>
              <h4 className='align-left'>Highlighted request</h4>
              <AdminRequestItem
                key={highlightRequest._id}
                {...highlightRequest}
                content={remapLearningContentForUI({
                  content: highlightRequest.content
                })}
              />
              <br />
            </>
          )}
          {highlightRequest && (
            <>
              <h4 className='align-left'>All requests</h4>
              <br />
            </>
          )}
          <ListSort
            sortMethod={sortMethod.label}
            sortMethodList={sortOptions}
            // filter={filter.label}
            // filterList={filterOptions}
            // filterLabel="Filter by"
            changeSortMethod={setSortMethod}
            // changeFilter={setFilter}
          />
          {pendingRequests
            // .filter(filter.callback)
            .map(request => {
              const content = remapLearningContentForUI({
                content: request.content
              })
              return (
                <AdminRequestItem
                  key={request._id}
                  {...request}
                  content={content}
                />
              )
            })}
        </>
      )}
    </div>
  )
}

export default AdminRequestsPage
