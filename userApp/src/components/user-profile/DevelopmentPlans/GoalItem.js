import React from 'react'
import Ribbon from '../../ui-components/ribbon'

const GoalItem = ({ name, type, price, source, status }) => {
  return (
    <div className='single-plan__goal-item'>
      <div className='single-plan__goal-item__title'>{name}</div>
      {source && (
        <div className='single-plan__goal-item__source'>
          {source.iconSource ? (
            <img src={source.iconSource} alt='source' />
          ) : (
            source.name
          )}
        </div>
      )}
      <div className='single-plan__goal-item__type'>
        <Ribbon
          text={type.toLowerCase()}
          customStyle={{
            padding: '4px 6px',
            fontWeight: 'bold',
            fontSize: '12px',
            lineHeight: '18px',
            color: '#556685',
            background: 'RGB(219, 225, 237)',
            marginRight: '16px',
            borderRadius: '4px',
            textTransform: 'capitalize'
          }}
        />
      </div>
      <div className='single-plan__goal-item__price'>{price || ''}</div>
      <div
        className={`single-plan__goal-item__status ${status
          .replaceAll(' ', '-')
          .toLowerCase()}`}
      >
        {status.toLowerCase()}
      </div>
    </div>
  )
}

export default GoalItem
