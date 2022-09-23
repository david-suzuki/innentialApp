import React, { useState } from 'react'
import { Select } from 'element-react'

const options = [
  { label: 'This month', value: 'THIS_MONTH' },
  { label: 'Last month', value: 'LAST_MONTH' },
  { label: 'This year', value: 'THIS_YEAR' },
  { label: 'All time', value: 'ALL_TIME' }
]

const DashboardSelect = ({ learningProgress, selectState }) => {
  const [value, setValue] = useState('THIS_MONTH')

  const handleOnChange = value => {
    setValue(value)
    selectState(value)
  }

  return (
    <div className='dashboard-select__container'>
      <div
        style={{
          position: 'absolute',
          top: learningProgress ? '10px' : '0px',
          right: '0px',
          display: 'flex',
          alignItems: 'baseline'
        }}
      >
        <span>Show: </span>

        <div className='dashboard__select'>
          <Select value={value} onChange={val => handleOnChange(val)}>
            {options.map(option => (
              <Select.Option {...option} key={option.value} />
            ))}
          </Select>
        </div>
      </div>
    </div>
  )
}

export default DashboardSelect
