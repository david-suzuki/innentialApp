import React from 'react'
import nobody from '../../static/nobody.jpg'
import { userDashboardItemStyle } from '../../styles/userDashboardItemStyle'

const LearningProgressItem = ({
  entity: { resources, name, status, picture },
  showPicture
}) => {
  const getClassName = status =>
    status === 'Not started'
      ? 'warning'
      : status === 'In progress'
      ? 'green'
      : 'red'

  return (
    <div className='user-dashboard-item__container'>
      <div className='user-dashboard-item__content'>
        <div>
          {showPicture && <img src={picture || nobody} alt='User picture' />}
          <span style={{ paddingLeft: '12px' }}>
            {showPicture ? name : `${name} Team`}
          </span>
        </div>
        <div>
          <div>{resources && `${resources} resources`}</div>
          <div
            className={`user-dashboard-item__tag tag-${getClassName(status)}`}
          >
            {status || 'No learning selected'}
          </div>
        </div>
      </div>

      <style jsx> {userDashboardItemStyle}</style>
    </div>
  )
}

export default LearningProgressItem
