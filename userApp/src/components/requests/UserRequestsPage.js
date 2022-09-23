import React, { useState } from 'react'
import { useQuery } from 'react-apollo'
import { Redirect, useHistory, useLocation } from 'react-router-dom'
import { fetchUserRequests } from '../../api'
import { captureFilteredError, LoadingSpinner } from '../general'
import {
  LearningRequestItem,
  ListSort,
  remapLearningContentForUI,
  Statement
} from '../ui-components'

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
  },
  {
    label: 'Status',
    callback: (a, b) => {
      if (a.approved === null && b.approved !== null) {
        return -1
      }
      return a.approved - b.approved
    }
  },
  {
    label: 'Goal',
    callback: (a, b) => {
      return (b.goal?.goalName || '').localeCompare(a.goal?.goalName || '')
    }
  }
]

const filterOptions = [
  {
    label: 'All',
    callback: () => true
  },
  {
    label: 'Pending',
    callback: ({ approved }) => approved === null
  },
  {
    label: 'Reviewed',
    callback: ({ approved }) => approved !== null
  }
]

const UserRequestsPage = () => {
  const [sortMethod, setSortMethod] = useState(sortOptions[0])
  const [filter, setFilter] = useState(filterOptions[0])

  const { state } = useLocation()

  const highlightId = state?.highlight

  const { data, loading, error } = useQuery(fetchUserRequests, {
    fetchPolicy: 'cache-and-network'
  })
  const history = useHistory()

  if (loading) return <LoadingSpinner />

  if (error) {
    captureFilteredError(error)
    return <Redirect to='/error-page/500' />
  }

  const requests = data?.fetchUserRequests || []

  const highlightRequest = requests.find(
    ({ content: { _id: contentId } }) => highlightId === contentId
  )

  requests.sort(sortMethod.callback)

  return (
    <div>
      <div className='page-heading'>
        <i
          className='page-heading__back__button icon icon-small-right icon-rotate-180'
          onClick={() => history.goBack()}
        />
        <div className='page-heading-info'>
          <h1>My requests</h1>
        </div>
      </div>
      {requests.length === 0 ? (
        <Statement content='No requests to display' />
      ) : (
        <>
          {highlightRequest && (
            <>
              <h4 className='align-left'>Highlighted request</h4>
              <LearningRequestItem
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
            filter={filter.label}
            filterList={filterOptions}
            filterLabel='Show'
            changeSortMethod={setSortMethod}
            changeFilter={setFilter}
          />
          {requests.filter(filter.callback).map(request => {
            const content = remapLearningContentForUI({
              content: request.content
            })
            return (
              <LearningRequestItem
                key={request._id}
                {...request}
                content={content}
              />
            )
          })}
          {requests.filter(filter.callback).length === 0 && (
            <Statement content='No requests matching filter criteria' />
          )}
        </>
      )}
    </div>
  )
}

export default UserRequestsPage
