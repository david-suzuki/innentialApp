import React from 'react'
import userHeadingStyle from '../../styles/userHeadingStyle'
import { generateInitialsAvatar } from '$/utils'
import { Link } from 'react-router-dom'

const UserHeading = ({
  // department,
  // stage,
  // chart,
  // engagement,
  _id: userId,
  name,
  hideOnDesktop,
  imageLink,
  date,
  children
}) => {
  let hideOnDesktopClass = ''
  if (hideOnDesktop) {
    hideOnDesktopClass = 'user-heading--hide-on-desktop'
  }

  const imgSrc =
    imageLink ||
    generateInitialsAvatar({
      firstName: name?.split(' ')[0] || '',
      lastName: name?.split(' ')[1] || '',
      _id: userId
    })
  return (
    <div className={`user-heading ${hideOnDesktopClass}`}>
      <div className='user-heading__name-wrapper'>
        {children}
        <img src={imgSrc} alt='user' />
        {userId ? (
          <Link to={`/profiles/${userId}`}>
            <div className='user-heading__name'>{name}</div>
          </Link>
        ) : (
          <div className='user-heading__name'>{name}</div>
        )}
      </div>

      {date && <div>{date}</div>}
      {/* {stage && engagement ? (
        <div>
          <div className="user-heading__department">
            Team: <span>{department}</span>{' '}
          </div>
          <div className="user-heading__data-wrapper">
            <div>
              Stage <span>{stage}</span>
            </div>
            <div>
              Engagement <span>{engagement}</span>
            </div>
          </div>
        </div>
      ) : null} */}
      <style jsx>{userHeadingStyle}</style>
    </div>
  )
}

export default UserHeading
