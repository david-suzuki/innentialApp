import React, { useState } from 'react'
import { Button } from 'element-react'
import {
  generateInitialsAvatar,
  generateSpecialAvatar
} from '../../../../utils'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const StatusColumn = ({ label, users, showBody }) => {
  return (
    <div className='filter-item'>
      <div className={label.toLowerCase().replace(/ /, '-')}>
        {label}
        <span className='number'>{users.length}</span>
        <div className='item-body'>
          {showBody &&
            users.map(user => (
              <Link
                style={{ display: 'block' }}
                key={`status:${user.userId}`}
                to={`/profiles/${user.userId}`}
              >
                {user.firstName} {user.lastName}
              </Link>
            ))}
        </div>
      </div>
    </div>
  )
}

StatusColumn.propTypes = {
  label: PropTypes.string.isRequired
}

const TableRow = ({ data, shrunk }) => {
  const { pathName, assignedTo } = data

  const [showBody, setShowBody] = useState(false)

  const inProgressUsers = assignedTo.filter(
    user => user.status === 'IN PROGRESS'
  )
  const notStartedUsers = assignedTo.filter(
    user => user.status === 'NOT STARTED'
  )
  const completedUsers = assignedTo.filter(user => user.status === 'COMPLETED')

  const userStatusNodes = () => {
    return (
      <div className='goal-status'>
        <StatusColumn
          label='Not Started'
          users={notStartedUsers}
          showBody={showBody}
        />
        <StatusColumn
          label='In Progress'
          users={inProgressUsers}
          showBody={showBody}
        />
        <StatusColumn
          label='Completed'
          users={completedUsers}
          showBody={showBody}
        />
      </div>
    )
  }

  return (
    <>
      <div className='progress-table-row'>
        <div className='row'>
          <div className='path-title'>{pathName}</div>
          {!shrunk && userStatusNodes()}
          <div className='team-members'>
            {assignedTo.slice(0, 3).map(user => (
              <img
                key={user.userId}
                src={
                  user.imageLink ||
                  generateInitialsAvatar({
                    _id: user.userId,
                    firstName: user.firstName,
                    lastName: user.lastName
                  })
                }
                alt='avatar'
                width='31'
                height='31'
              />
            ))}
            {assignedTo.length > 3 && (
              <img
                src={generateSpecialAvatar({
                  initials: `+${assignedTo.length - 3}`,
                  initialBg: '#BDBBDD',
                  initialWeight: 900,
                  initialSize: 18,
                  size: 40
                })}
                alt='more-users'
                width='31'
                height='31'
              />
            )}
          </div>
          <div className='row__button'>
            <Button
              className='path-detail-button'
              onClick={() => setShowBody(!showBody)}
            >
              {showBody ? 'Hide' : 'Show'} Details
            </Button>
          </div>
        </div>
        {shrunk && showBody && userStatusNodes()}
      </div>
    </>
  )
}

export default TableRow
