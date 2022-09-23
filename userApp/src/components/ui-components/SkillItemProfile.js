import React from 'react'
import skillItemStyle from '../../styles/skillItemStyle'
import skillItemBasicStyle from '../../styles/skillItemBasicStyle'
import { SkillBar } from './'

const SkillItemProfile = ({
  name,
  level,
  evaluatedLevel,
  displayEvaluated,
  tooltip
}) => {
  const value = evaluatedLevel > 0 ? evaluatedLevel : level
  const roundedEvaluatedLevel = +evaluatedLevel.toFixed(2)

  return (
    <div className='list-item skill-item'>
      <div className='skill__name-wrapper'>
        <div className='skill-item__header'>
          <div className='skill-name-wrapper'>{name}</div>
          {displayEvaluated && (
            <div className='skill-item__header-count'>
              {level !== 0 && (
                <span
                  className={`${
                    evaluatedLevel === 0 ? 'skill-item__header-count__item' : ''
                  }`}
                >
                  Self: <span>{level}</span>
                </span>
              )}
              {evaluatedLevel !== 0 && (
                <span className='skill-item__header-count__item'>
                  Feedback: <span>{roundedEvaluatedLevel}</span>
                </span>
              )}
            </div>
          )}
        </div>
        {value !== 0 ? (
          <div className='level-bar__wrapper skill-item__skillbar-wrapper'>
            <SkillBar value={value} tooltip={tooltip} />
          </div>
        ) : (
          <span className='grey-small'>Waiting for evaluation</span>
        )}
      </div>
      <style jsx>{skillItemStyle}</style>
      <style jsx>{skillItemBasicStyle}</style>
    </div>
  )
}

export default SkillItemProfile
