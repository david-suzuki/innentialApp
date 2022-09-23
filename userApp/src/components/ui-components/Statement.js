import React from 'react'
import { Button } from 'element-react'
import statementStyle from '../../styles/statementStyle'

export default ({ label, content, date, button, onButtonClicked }) => {
  return (
    <div className='statement'>
      {label && <div className='statement__label'>{label}</div>}
      <p className='statement__content'>{content}</p>
      {date && <div className='statement__date'>{date}</div>}
      {button && (
        <Button
          type='primary'
          className='el-button--list'
          onClick={onButtonClicked}
        >
          {button}
        </Button>
      )}
      <style jsx>{statementStyle}</style>
    </div>
  )
}
