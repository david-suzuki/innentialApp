import React from 'react'
import extraItemStyle from './style'
import CheckIcon from '../../../static/check.svg'

const ExtraItem = ({ text }) => {
  return (
    <>
      <div className='extra-item__item'>
        <span className='extra-item__icon'>
          <img src={CheckIcon} alt='icon' />
        </span>
        <p>{text}</p>
      </div>
      <style jsx>{extraItemStyle}</style>
    </>
  )
}

export default ExtraItem
