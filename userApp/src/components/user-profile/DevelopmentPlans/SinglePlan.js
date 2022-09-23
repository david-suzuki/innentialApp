import React, { useState } from 'react'
import { Button } from 'element-react'
import GoalItem from './GoalItem'
import { Link } from 'react-router-dom'

const ConditionalLink = ({ userId, children }) => {
  if (userId) {
    return <Link to={`/profiles/${userId}`}>{children}</Link>
  }
  return children
}

const statusOrder = [
  'AWAITING APPROVAL',
  'AWAITING FULFILLMENT',
  'IN PROGRESS',
  'NOT STARTED',
  'COMPLETED'
].reverse()

const SinglePlan = ({ data }) => {
  // const [filter, setFilter] = useState(null);
  const [showBody, setShowBody] = useState(false)

  const sortedContent =
    data?.content?.sort((a, b) => {
      const order1 = statusOrder.indexOf(a.status)
      const order2 = statusOrder.indexOf(b.status)
      return order2 - order1
    }) || []

  return (
    <div className='profile__development-single-plan'>
      <div className='profile__development-single-plan-header'>
        <h3>{data?.path?.name || 'Path removed'}</h3>
        <div className='profile__development-single-plan-header-sub'>
          <div className='profile__development-single-plan-header-filter'>
            <div
              className='filter-item'
              // onClick={() => setFilter('NOT STARTED')}
            >
              <span className='not-started'>Not Started</span>
              <span className='number'>
                {data?.path?.stats ? data.path.stats.notStartedCount : 'N/A'}
              </span>
            </div>
            <div
              className='filter-item'
              // onClick={() => setFilter('IN PROGRESS')}
            >
              <span className='in-progress'>In Progress</span>
              <span className='number'>
                {data?.path?.stats ? data.path.stats.inProgressCount : 'N/A'}
              </span>
            </div>
            <div
              className='filter-item'
              // onClick={() => setFilter('COMPLETED')}
            >
              <span className='completed'>Completed</span>
              <span className='number'>
                {data?.path?.stats ? data.path.stats.completedCount : 'N/A'}
              </span>
            </div>
          </div>
          <p>
            <span>Assigned by:</span>
            <ConditionalLink userId={data?.path?.assignedBy?.userId}>
              {data?.path?.assignedBy?.name}
            </ConditionalLink>
          </p>
        </div>
      </div>
      <div className='profile__development-single-plan-body'>
        {showBody &&
          sortedContent
            // .filter(el => !filter || el.status === filter)
            .map((el, index) => (
              <GoalItem key={`goal-item-${index}`} {...el} />
            ))}
      </div>
      <div className='profile__development-single-plan-footer'>
        <Button
          className='single-plan-footer__control'
          onClick={() => setShowBody(!showBody)}
        >
          {showBody ? 'Hide' : 'View'} Full Path Progress
        </Button>
      </div>
    </div>
  )
}

export default SinglePlan
