import React from 'react'
import IconInfo from '../../static/info-icon.png'
import statementStyle from '../../styles/statementStyle'

export default ({ title, content }) => {
  return (
    <div className='onboarding-statement'>
      <img
        src={IconInfo}
        height={24}
        alt='info-icon'
        style={{ marginRight: '17px' }}
      />
      <div>
        {title && <h4 className='onboarding-statement__title'>{title}</h4>}
        <p className='onboarding-statement__content'>{content}</p>
      </div>
      <style jsx>{statementStyle}</style>
    </div>
  )
}
