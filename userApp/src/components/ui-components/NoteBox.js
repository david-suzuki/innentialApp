import React from 'react'
import IconInfo from '../../static/info-icon.png'

const NoteBox = ({ note }) => {
  return (
    <div className='learning-item-new__info-box'>
      <img src={IconInfo} alt='Info Icon' className='info-box--icon' />
      <div
        className='info-box--content'
        dangerouslySetInnerHTML={{
          __html: note
        }}
      />
    </div>
  )
}

export default NoteBox
