import React from 'react'
import ReactDOM from 'react-dom'

const BodyPortal = ({ children, nameClass }) =>
  ReactDOM.createPortal(<div className={nameClass || ''}>{children}</div>, document.body)

export default BodyPortal
