import React from 'react'
import userItemStyle from '../../styles/userItemStyle'
import { generateInitialsAvatar } from '$/utils'
import Location from '../../components/ui-components/Location'
import variables from '../../styles/variables'

const UserItemRequest = ({
  _id,
  imageLink,
  firstName,
  lastName,
  roleAtWork,
  location,
  requests = [],
  total,
  firstRequestedAt
}) => {
  const daysSinceFirstRequest = Math.floor(
    (new Date() - new Date(firstRequestedAt)) / 8.64e7
  )
  const weeksSinceFirstRequest = Math.floor(daysSinceFirstRequest / 7)

  const timeString =
    daysSinceFirstRequest === 0
      ? 'Today'
      : weeksSinceFirstRequest === 0
      ? `${daysSinceFirstRequest} day${
          daysSinceFirstRequest > 1 ? 's' : ''
        } ago`
      : `${weeksSinceFirstRequest} week${
          weeksSinceFirstRequest > 1 ? 's' : ''
        } ago`

  return (
    <div className='list-item user-item user-item-request__wrapper'>
      <div className='user-item-review__person-wrapper'>
        <div className='user-item__data img'>
          <img
            src={
              imageLink ||
              generateInitialsAvatar({
                firstName,
                lastName,
                _id
              })
            }
            alt=''
          />
        </div>

        <div className='user-item__details'>
          <div className='user-request-item__name'>
            {firstName} {lastName}
          </div>
          <div className='user-item-request__number'>
            {requests.length} resource{requests.length > 1 ? 's' : ''}
          </div>
          {/* {!dashboard && (
            <div className='user-item__details__profession user-item-review__profession'>
              {roleAtWork}
            </div>
          )}
          {location && !dashboard && (
            <div className='user-item__details__location'>
              <Location location={location} size='small' />
            </div>
          )} */}
        </div>
      </div>
      <div className='user-item-request__right'>
        <div className='user-item-request__time'>{timeString}</div>
        <div
          className='user-item-review__status-wrapper'
          style={{ width: 'unset' }}
        >
          <div
            style={{
              color: total === 0 ? variables.info80 : variables.brandSecondary,
              fontWeight: 700,
              fontSize: '12px'
            }}
          >
            {total === 0 ? 'Subscription request' : `€${total.toFixed(2)}`}
          </div>
          {/* <div className='user-item__review-completed'>
            <div
              className='user-item__review-completed-img'
              style={{ backgroundColor: variables.white }}
            >
              <img src={require('../../static/arrow-right.svg')} alt='go' />
            </div>
          </div> */}
        </div>
      </div>
      <style jsx>{userItemStyle}</style>
    </div>
  )
}

export default UserItemRequest
