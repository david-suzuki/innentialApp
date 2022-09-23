import React, { useState } from 'react'
import SkillsFrameworkStarIcon from './SkillsFrameworkStarIcon'
import skillsFrameworkStarsIndicatorStyle from '../../styles/skillsFrameworkStarsIndicatorStyle'
import FlagIcon from '../user-onboarding/pages/components/FlagIcon'

const StarBarOnboarding = ({
  name,
  subtitle,
  level,
  updateSkillLevels,
  handleHover,
  handleMouseOut,
  stroke,
  // isOnboarding,
  checkValidation,
  highlighted,
  skill,
  removeSkill,
  setSkillLevel
}) => {
  const [starActiveIndex, setStarActiveIndex] = useState(-1)

  return (
    <div className='skills-stars__wrapper onboarding__stars'>
      <div style={{ display: 'flex' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className='skills-stars__name'>
            {name}
            <i
              style={{ paddingLeft: '12px' }}
              className='el-icon-delete icon-delete-red'
              onClick={e => removeSkill(e, skill)}
            />
          </div>
          {subtitle && <div className='skills-stars__subtitle'>{subtitle}</div>}
        </div>
      </div>

      <div className='skills-stars '>
        <div
          style={{
            display: 'flex',
            alignItems: 'center'
            // justifyContent: 'space-around'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              className={`onboarding__flag-icon ${
                skill.level === 0 ? 'onboarding__flag-icon--selected' : ''
              }`}
              onClick={() => setSkillLevel(skill.name, 0, 'neededWorkSkills')}
            >
              <FlagIcon selected={skill.level === 0} />
              <small>I'm just starting</small>
            </div>
          </div>
          <div
            className={
              highlighted
                ? 'skills-stars__indicator stars-highlighted'
                : 'skills-stars__indicator'
            }
          >
            {[...Array(5).keys()].map((item, index) => {
              return (
                <div
                  className='skills-stars__star-wrapper'
                  key={item}
                  onMouseEnter={e => {
                    e.preventDefault()
                    checkValidation()
                    setStarActiveIndex(index + 1)
                    if (handleHover) {
                      handleHover(index + 1, name)
                    }
                  }}
                  onMouseLeave={e => {
                    e.preventDefault()
                    setStarActiveIndex(-1)
                    if (handleMouseOut) {
                      handleMouseOut()
                    }
                  }}
                  onClick={() => updateSkillLevels(name, index + 1)}
                >
                  <SkillsFrameworkStarIcon
                    width={
                      index + 1 === level || starActiveIndex === index + 1
                        ? 34
                        : 24
                    }
                    fill={
                      Number.isNaN(level) || index + 1 > level
                        ? '#f0f0f0'
                        : '#F7DD8C'
                    }
                    className={`skills-stars__star ${
                      index + 1 > level ? 'skills-stars__star--disabled' : ''
                    } ${index + 1 === level ? 'skills-stars__star--big' : ''}`}
                    stroke={stroke}
                  />
                </div>
              )
            })}
          </div>
        </div>

        <style jsx>{skillsFrameworkStarsIndicatorStyle}</style>
      </div>
    </div>
  )
}

export default StarBarOnboarding
