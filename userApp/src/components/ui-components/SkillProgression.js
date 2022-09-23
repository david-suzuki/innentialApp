import React from 'react'

export default ({ skillProgression }) => {
  return (
    <div className='goal-summary__skills-progression-wrapper'>
      <div className='goal-summary__skills-progression-header'>
        Skills development
      </div>
      <div className='goal-summary__progression-box'>
        {skillProgression.map(({ _id, skillName, oldValue, newValue }) => {
          let roundedNewValue = newValue
          let roundedOldValue = oldValue
          roundedNewValue = +roundedNewValue.toFixed(2)
          roundedOldValue = +roundedOldValue.toFixed(2)
          return (
            <div
              className='goal-summary__progression-item'
              key={`skill-progression:${_id}`}
            >
              <span>{skillName}</span>
              {oldValue === 0 ? (
                <span className='values newValue'>{roundedNewValue}</span>
              ) : (
                <span className='values'>
                  {`${roundedOldValue} > `}
                  <span className='newValue'>{roundedNewValue}</span>
                </span>
              )}
              {oldValue < newValue && (
                <i className='icon icon-green icon-diag-top-right' />
              )}
              {oldValue > newValue && (
                <i className='icon icon-red icon-diag-bottom-right' />
              )}
            </div>
          )
        })}
      </div>
      {/* GRAPH FUNCTION NOT YET AVAILABLE :))))) */}
      {/* <div className="goal-summary__graph-button-box">
            <Button className="summary-item__button el-button el-button--default">
              Show graph
            </Button>
          </div> */}
    </div>
  )
}
