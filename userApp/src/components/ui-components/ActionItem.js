import React from 'react'
import { Button } from 'element-react'
import actionItemStyle from '../../styles/actionItemStyle'

const ActionItem = ({
  children,
  content,
  label,
  button,
  icon,
  team,
  onButtonClicked,
  purpleBackground
}) => {
  let labelClass = ''
  if (!label) {
    labelClass = 'action-item__content-wrapper--label'
  }
  let iconClass = ''
  if (icon) {
    iconClass = 'action-item__content--icon'
  }
  let teamClass = ''
  if (team) {
    teamClass = 'action-item__content--team'
  }
  let purpleClass = ''
  if (purpleBackground) {
    purpleClass = 'action-item--purple'
  }
  return (
    <div className={`list-item action-item ${purpleClass}`}>
      {label ? <span className='action-item__label'>{label}</span> : null}
      <div className={`action-item__content-wrapper ${labelClass}`}>
        <div className={`action-item__content ${teamClass} ${iconClass}`}>
          {children} {content}
        </div>
        {icon ? <i className='icon icon-menu-dots' /> : null}
      </div>
      <Button
        type='primary'
        className='el-button--list'
        onClick={onButtonClicked}
      >
        {button}
      </Button>
      <style jsx>{actionItemStyle}</style>
    </div>
  )
}

export default ActionItem
