import React from 'react'
import skillBarStyle from '../../styles/skillBarStyle'
import variables from '../../styles/variables'

const SkillBar = ({
  maxValue = 5,
  value,
  color = variables.brandPrimary,
  tooltip,
  nOfUsers = 0
}) => (
  <div className={`skill-bar ${tooltip ? 'skill-bar__tooltip' : ''}`}>
    <div className='skill-bar__track' />
    <div
      className='skill-bar__indicator-line'
      style={{ width: `${(value / maxValue) * 100}%`, backgroundColor: color }}
    >
      <div
        className='skill-bar__indicator-pin'
        style={{ backgroundColor: color }}
      >
        <span>{value.toFixed(1)}</span>
        {tooltip && (
          <div className='skill-bar__tooltip-display'>
            {tooltip.map(({ name, level }, i) => (
              <div
                key={`skillBarTooltip${i}`}
                className='skill-bar__tooltip-display__item'
              >
                <div className='skill-bar__tooltip-display__username'>
                  {name}
                </div>
                <div className='skill-bar__tooltip-display__skillvalue'>
                  {level.toFixed(1)}
                </div>
              </div>
            ))}
            {nOfUsers > 10 && `...and ${nOfUsers - 10} more`}
          </div>
        )}
      </div>
    </div>
    <style jsx>{skillBarStyle}</style>
  </div>
)

export default SkillBar
