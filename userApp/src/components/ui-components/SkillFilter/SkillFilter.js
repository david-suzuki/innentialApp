import React, { useState } from 'react'
import { SkillsFrameworkStarIcon } from '../'
import skillFilterStyle from './style'

const SkillsFrameworkListStars = ({ level, customClassName }) => (
  <div className={customClassName || 'skills-framework__list-stars'}>
    {[...Array(level).keys()].map(item => (
      <SkillsFrameworkStarIcon key={item} />
    ))}
    {[...Array(5 - level).keys()].map(item => (
      <SkillsFrameworkStarIcon key={item} fill='#f0f0f0' />
    ))}
  </div>
)

const SkillFilter = ({ name, level, updateSkillLevels, children }) => {
  const [largeStars, toggleLargeStars] = useState(false)
  const [starActiveIndex, setStarActiveIndex] = useState(-1)

  return (
    <div
      className='skill-filter__wrapper'
      onMouseEnter={() => toggleLargeStars(true)}
      onMouseLeave={() => toggleLargeStars(false)}
    >
      {largeStars ? (
        <div className='skills-stars'>
          <div className='skills-stars__indicator'>
            {[...Array(5).keys()].map((item, index) => {
              return (
                <div
                  className='skills-stars__star-wrapper'
                  key={item}
                  onMouseEnter={e => {
                    e.preventDefault()
                    setStarActiveIndex(index + 1)
                  }}
                  onMouseLeave={e => {
                    e.preventDefault()
                    setStarActiveIndex(-1)
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
        </div>
      ) : (
        <div className='skill-filter__inline'>
          <div className='skill-filter__name'>{name}</div>
          <SkillsFrameworkListStars level={level} />
        </div>
      )}
      <div className='skill-filter__remove'>{children}</div>
      <style jsx>{skillFilterStyle}</style>
    </div>
  )
}

export default SkillFilter
