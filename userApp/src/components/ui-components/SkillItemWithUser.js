import React from 'react'
import skillItemStyle from '../../styles/skillItemStyle'
import history from '../../history'
import { SkillBar } from './'

export default ({
  userId,
  name,
  skillAvailable,
  evaluatedLevel,
  userImage,
  displayEvaluated
}) => {
  const value = evaluatedLevel > 0 ? evaluatedLevel : skillAvailable
  const roundedEvaluatedLevel = +evaluatedLevel.toFixed(1)

  return (
    <div className='list-item skill-item'>
      <div className='skill__name-wrapper'>
        <div className='skill-item__header'>
          <div
            className='skill__user-name-wrapper'
            onClick={e => {
              e.preventDefault()
              history.push(`/profiles/${userId}`)
            }}
          >
            {userImage && (
              <img className='skill__user-image' src={userImage} alt='user' />
            )}
            <span className='skill__user-name'>{name}</span>
          </div>
          <div className='skill-item__header-count'>
            {displayEvaluated && (
              <div>
                <div
                  className={`${
                    evaluatedLevel === 0 ? 'skill-item__header-count__item' : ''
                  }`}
                >
                  Self:{' '}
                  <span>{skillAvailable > 0 ? skillAvailable : 'N/A'}</span>
                </div>{' '}
                {evaluatedLevel > 0 && (
                  <div className='skill-item__header-count__item'>
                    Feedback: <span>{roundedEvaluatedLevel}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {value !== 0 ? (
          <div className='level-bar__wrapper skill-item__skillbar-wrapper'>
            <SkillBar value={value} />
          </div>
        ) : (
          <span className='grey-small align-left'>Waiting for evaluation</span>
        )}
        {/* <div className='level-bar__wrapper skill-item__skillbar-wrapper'>
          {evaluatedLevel > 0 ? (
            <SkillBar value={evaluatedLevel} />
          ) : (
            <SkillBar value={skillAvailable} />
          )}
        </div> */}
      </div>
      <style jsx>{skillItemStyle}</style>
    </div>
  )
}
