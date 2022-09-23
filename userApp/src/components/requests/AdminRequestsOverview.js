import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useQuery } from 'react-apollo'
import {
  fetchRequestsForOrganization,
  fetchRequestsForTeamLeader
} from '../../api'
import { LoadingSpinner, captureFilteredError } from '../general'
import {
  ListSort,
  List,
  Statement,
  UserItemRequest,
  DashboardButton
} from '../ui-components'

const sortMethods = [
  {
    label: 'Requested at (newest)',
    callback: (a, b) => {
      return new Date(b.firstRequestedAt) - new Date(a.firstRequestedAt)
    }
  },
  {
    label: 'Requested at (oldest)',
    callback: (a, b) => {
      return new Date(a.firstRequestedAt) - new Date(b.firstRequestedAt)
    }
  },
  {
    label: 'Name',
    callback: (a, b) => {
      return b.firstName.localeCompare(a.firstName)
    }
  },
  {
    label: 'Role',
    callback: (a, b) => {
      return b.roleAtWork.localeCompare(a.roleAtWork)
    }
  },
  {
    label: '# of requests',
    callback: (a, b) => {
      return b.requests.length - a.requests.length
    }
  },
  {
    label: 'Total cost',
    callback: (a, b) => {
      return b.total - a.total
    }
  }
]

const AdminRequestsOverview = ({ short, setInfo, dashboard, isAdmin }) => {
  const [sortMethod, setSortMethod] = useState(sortMethods[0])

  const query = isAdmin
    ? fetchRequestsForOrganization
    : fetchRequestsForTeamLeader

  const queryName = isAdmin
    ? 'fetchRequestsForOrganization'
    : 'fetchRequestsForTeamLeader'

  const { data, loading, error } = useQuery(query)

  const history = useHistory()

  if (loading) {
    // setIsLoading(true)
    return <LoadingSpinner />
  }

  if (error) {
    captureFilteredError(error)
    return <Statement content='Oops! Something went wrong.' />
  }

  // if (data) {
  //   setIsLoading(false)
  // }

  const requests = (data && data[queryName]) || []

  const pendingRequests = requests.filter(({ approved }) => approved === null)

  const users = pendingRequests.reduce((acc, curr) => {
    const arr = acc

    const findUser = user => user._id === curr.user._id

    if (!arr.some(findUser)) {
      arr.push({
        ...curr.user,
        requests: [curr],
        total: curr.content.availableWithSubscription
          ? 0
          : curr.content.price.value,
        firstRequestedAt: curr.createdAt
      })
    } else {
      const ix = arr.findIndex(findUser)
      const { requests, total, firstRequestedAt } = arr.find(findUser)
      arr.splice(ix, 1, {
        ...curr.user,
        requests: [...requests, curr],
        total:
          total +
          (curr.content.availableWithSubscription
            ? 0
            : curr.content.price.value),
        firstRequestedAt:
          new Date(firstRequestedAt) < new Date(curr.createdAt)
            ? curr.createdAt
            : firstRequestedAt
      })
    }
    if (dashboard && setInfo) {
      setInfo([...arr].length)
    }
    return [...arr]
  }, [])

  // if (users.length === 0 && short) return null

  users.sort(sortMethod.callback)

  const requestsNode = (
    <>
      {users
        .slice(0, short ? 4 : undefined)
        // .filter(({ _id: teamId }) => {
        //   if (filterMethod.value === 'ALL') return true
        //   return filterMethod.value === teamId
        // })
        .map(user => {
          return (
            <Link
              key={`requests:${user._id}`}
              to={`/user-requests/${user._id}`}
            >
              <UserItemRequest {...user} />
            </Link>
          )
        })}
      {users.length === 0 && <Statement content='No pending requests' />}
    </>
  )

  return (
    <>
      {short && !dashboard ? (
        <>
          <h3 className='align-left'>Requests ({users.length})</h3>
          <br />
        </>
      ) : !dashboard ? (
        <div className='page-heading'>
          <i
            className='page-heading__back__button icon icon-small-right icon-rotate-180'
            onClick={() => history.goBack()}
          />
          <div className='page-heading-info'>
            <h1>Requests</h1>
          </div>
        </div>
      ) : null}
      {!short && (
        <ListSort
          sortMethod={sortMethod.label}
          sortMethodList={sortMethods}
          changeSortMethod={setSortMethod}
          // filter={filterMethod.label}
          // filterList={teamList}
          // changeFilter={setFilterMethod}
        />
      )}
      {!dashboard ? (
        <List>{requestsNode}</List>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            height: '100%'
          }}
        >
          {requestsNode}
        </div>
      )}

      {users.length > 4 && short && (
        <Link to='/requests'>
          <DashboardButton label={`See all ${users.length} requests`} />
        </Link>
      )}
      {/* <style jsx>{reviewFormStyle}</style> */}
    </>
  )
}

export default AdminRequestsOverview

// export default withRouter(({ history, currentUser }) => (
//   <>
//     <div className="reviewForm__title">
//       <i
//         onClick={() => history.goBack()}
//         className="review-form__back__button icon icon-small-right icon-rotate-180"
//       />
//       Goal approval
//     </div>
//     <GoalDraftLeaderView currentUser={currentUser} />
//   </>
// ))
