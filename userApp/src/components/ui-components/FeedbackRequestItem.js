import React from 'react'
import userItemStyle from '../../styles/userItemStyle'
import { generateInitialsAvatar } from '$/utils'
// import Location from '../../components/ui-components/Location'
import variables from '../../styles/variables'
import { Link } from 'react-router-dom'

const LinkWrapper = ({ link, children }) =>
  link ? <Link to={link}>{children}</Link> : children

const FeedbackRequestItem = ({
  user,
  requestedTeam,
  requestedAt,
  children
}) => {
  const subtitle = requestedTeam ? 'Team' : 'Colleague'

  const link = requestedTeam
    ? `/team/${requestedTeam._id}`
    : user
    ? `/profiles/${user._id}`
    : ''

  const name = requestedTeam
    ? `${requestedTeam.teamName.slice(0, 30)}${
        requestedTeam.teamName.length > 30 ? '...' : ''
      }`
    : user
    ? `${user.firstName} ${user.lastName}`
    : 'User Deleted'

  const imageNode = requestedTeam ? (
    <div className='user-request-item__team'>
      <i className='icon icon-multiple' />
    </div>
  ) : (
    <div className='user-item__data img'>
      <img src={user?.imageLink || generateInitialsAvatar(user)} alt='avatar' />
    </div>
  )

  return (
    <div className='list-item user-item' style={{ alignItems: 'center' }}>
      <LinkWrapper link={link}>
        <div className='user-item-review__person-wrapper'>
          {imageNode}

          <div className='user-item__details'>
            <div className='user-request-item__subtitle'>{subtitle}</div>
            <div className='user-request-item__name'>{name}</div>
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
      </LinkWrapper>
      <div className='user-item-request__time'>
        Requested on {new Date(requestedAt).toDateString()}
      </div>
      {children}
      <style jsx>{userItemStyle}</style>
    </div>
  )
}

export default FeedbackRequestItem
