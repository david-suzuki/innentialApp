import React from 'react'
import formGroupStyle from '../../styles/formGroupStyle'

const Tooltip = ({ children, title, enabled }) => {
  return (
    <>
      <span>{children} </span>
      {enabled && (
        <span title={title} style={{ textDecorationLine: 'underline' }}>
          <i className='icon el-icon-question' />
        </span>
      )}
    </>
  )
}

export default Tooltip
