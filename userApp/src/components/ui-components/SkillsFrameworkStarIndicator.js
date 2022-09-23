import React, { useState, useContext } from 'react'
import { UserContext } from '../../utils'
import SkillsFrameworkStarIcon from './SkillsFrameworkStarIcon'
import skillsFrameworkStarsIndicatorStyle from '../../styles/skillsFrameworkStarsIndicatorStyle'
import FlagIcon from '../user-onboarding/pages/components/FlagIcon'

const SkillsFrameworkStarsIndicator = ({
  name,
  subtitle,
  level,
  updateSkillLevels,
  dropdownOptions = [],
  handleHover,
  handleMouseOut,
  stroke,
  isOnboarding,
  checkValidation,
  highlighted,
  skill,
  removeSkill,
  setSkillLevel
}) => {
  const [starActiveIndex, setStarActiveIndex] = useState(-1)
  const [activeDropdown, toggleDropdown] = useState(false)

  const user = useContext(UserContext)

  const n = user && user.corporate ? 4 : 5

  // const n = 5

  const skillTitleNode = (
    <>
      <div className='skills-stars__name'>
        {name}
        {isOnboarding && (
          <i
            style={{ paddingLeft: '12px' }}
            className='el-icon-delete icon-delete-red'
            onClick={e =>
              removeSkill(e, skill.skillId || skill._id, 'neededWorkSkills')
            }
          />
        )}
      </div>
      {subtitle && <div className='skills-stars__subtitle'>{subtitle}</div>}
    </>
  )

  const starSkillsIndicatorNode = (
    <>
      <div
        className={
          highlighted
            ? 'skills-stars__indicator stars-highlighted'
            : 'skills-stars__indicator'
        }
      >
        {[...Array(n).keys()].map((item, index) => {
          return (
            <div
              className='skills-stars__star-wrapper'
              key={item}
              onMouseEnter={e => {
                if (isOnboarding) {
                  checkValidation()
                }
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
                  index + 1 === level || starActiveIndex === index + 1 ? 34 : 24
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
        {dropdownOptions.length > 0 && (
          <div className='skills-stars__menu'>
            <div
              className='skills-stars__menu-dots'
              onClick={() => toggleDropdown(!activeDropdown)}
            >
              <i className='icon icon-menu-dots' />
            </div>
            <div
              className={
                activeDropdown
                  ? 'skills-stars__dropdown is-active'
                  : 'skills-stars__dropdown'
              }
            >
              <ul>
                {dropdownOptions.map((el, idx) => (
                  <li key={idx}>
                    <a onClick={e => el.boundFunction(el.id, e)}>{el.value}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  )
  return (
    <div
      className={
        isOnboarding
          ? 'skills-stars__wrapper onboarding__stars'
          : 'skills-stars__wrapper'
      }
    >
      {isOnboarding ? (
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {skillTitleNode}
          </div>
          {/* <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '6px 0 0 20px'
            }}
          >
            
          </div> */}
        </div>
      ) : (
        <>{skillTitleNode}</>
      )}

      <div className='skills-stars '>
        {isOnboarding ? (
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
            <div>{starSkillsIndicatorNode}</div>
          </div>
        ) : (
          starSkillsIndicatorNode
        )}

        <style jsx>{skillsFrameworkStarsIndicatorStyle}</style>
      </div>
    </div>
  )
}

export default SkillsFrameworkStarsIndicator
