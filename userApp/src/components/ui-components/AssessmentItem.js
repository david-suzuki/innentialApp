import React from 'react'
import assessmentItemStyle from '../../styles/assessmentItemStyle'
import userPlaceholder from '../../static/nobody.jpg'

const AssessmentItem = ({ name, department, status, img, isActive }) => {
  return (
    <div className='list-item assessment-item'>
      <div className='assessment-item__data'>
        <img src={img || userPlaceholder} alt='User' />
        <div className='user-item__details'>
          <div className='assessment-item__title'>{name}</div>
          <div className='assessment-item__details__profession'>
            {department}
          </div>
        </div>
      </div>
      <div>
        <div
          className={`assessment-item__status ${
            isActive ? 'assessment-item__status--is-active' : null
          }`}
        >
          {status}
        </div>
      </div>
      <style jsx>{assessmentItemStyle}</style>
    </div>
  )
}

export default AssessmentItem
