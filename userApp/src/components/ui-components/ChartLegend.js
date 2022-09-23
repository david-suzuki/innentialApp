import React from 'react'
import skillItemStyle from '../../styles/skillItemStyle'

export default ({
  availableLabel = 'Skills available',
  neededLabel = 'Skills needed',
  padding = true,
  hideNeeded
}) => {
  return (
    <div
      className={`skills-description ${
        !padding ? 'skills-description--no-padding' : ''
      }`}
    >
      <div className='skills-description__wrapper'>
        <div className='skills-description__dot' />
        <div className='skills-description__title'>{availableLabel}</div>
        {!hideNeeded && (
          <>
            <div className='skills-description__dot skills-description__dot--needed' />
            <div className='skills-description__title'>{neededLabel}</div>
          </>
        )}
      </div>
      <style>{skillItemStyle}</style>
    </div>
  )
}
