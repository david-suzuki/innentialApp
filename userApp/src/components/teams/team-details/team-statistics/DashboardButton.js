import React from 'react'
import { Button } from 'element-react'

const DashboardButton = ({ label, cb = () => null }) => {
  return (
    <div className='dashboard__button-container'>
      <Button type='secondary' size='small' plain onClick={cb}>
        <span className='dashboard__button'>{label}</span>
      </Button>
    </div>
  )
}

export default DashboardButton
