import React, { useState } from 'react'
import SkillsFrameworkStarIcon from './SkillsFrameworkStarIcon'
import skillsFrameworkStarsIndicatorStyle from '../../styles/skillsFrameworkStarsIndicatorStyle'

const PublicStarBar = ({
  name,
  subtitle,
  level,
  updateSkillLevels,
  handleHover,
  handleMouseOut,
  n = 5
}) => {
  const [starActiveIndex, setStarActiveIndex] = useState(-1)
  // const [activeDropdown, toggleDropdown] = useState(false)
  return (
    <div className='skills-stars__wrapper'>
      <div className='skills-stars__name'>{name}</div>
      {subtitle && <div className='skills-stars__subtitle'>{subtitle}</div>}
      <div className='skills-stars'>
        <div className='skills-stars__indicator'>
          {[...Array(n).keys()].map((item, index) => {
            return (
              <div
                className='skills-stars__star-wrapper'
                key={item}
                onMouseEnter={e => {
                  e.preventDefault()
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
                />
              </div>
            )
          })}
        </div>
        <style jsx>{skillsFrameworkStarsIndicatorStyle}</style>
      </div>
    </div>
  )
}

export default PublicStarBar
