import React from 'react'
import userPlaceholder from '../../static/nobody.jpg'
import developmentPlanMentorStyle from '../../styles/developmentPlanMentorStyle'

const DevelopmentPlanMentor = ({
  img,
  // isActive,
  label,
  location,
  name,
  profession,
  // status,
  selected,
  onSelect,
  inManagement,
  borderBottom,
  goalName,
  skills = []
}) => {
  const mainClassName = borderBottom
    ? 'development-plan-mentor border-bottom'
    : `development-plan-mentor ${!inManagement &&
        `development-plan-mentor--selectable ${!selected && 'not-selected'}`}`
  return (
    <div className={mainClassName} onClick={onSelect}>
      <div className='development-plan-mentor__wrapper'>
        <div className='development-plan-mentor__info-wrapper'>
          <div className='development-plan-mentor__image'>
            <img src={img || userPlaceholder} alt='' />
          </div>
          <div className='development-plan-mentor__details'>
            {/* {goalName && <div className="dev-item__goal-name">{goalName}</div>} */}
            {label && (
              <div className='development-plan-mentor__team'>{label}</div>
            )}
            <div className='development-plan-mentor__name'>{name}</div>
            {profession && (
              <div className='development-plan-mentor__job'>{profession}</div>
            )}
          </div>
        </div>
        <div className='development-plan-mentor__skills-wrapper'>
          {skills.length > 0 &&
            skills.slice(0, 3).map(skill => (
              <div
                key={`${name}:${skill.skillId}`}
                className={`${
                  skill.relevancyRating > 0
                    ? 'development-plan-mentor__skill-tag development-plan-mentor__skill-tag--skill development-plan-mentor__skill-tag--main'
                    : 'development-plan-mentor__skill-tag development-plan-mentor__skill-tag--skill'
                }`}
              >
                <div className='development-plan-mentor__skill-tag-trim'>{`${skill.name}`}</div>
                <div className='development-plan-mentor__skill-tag-level'>{`${
                  skill.level < 5 ? skill.level + '/5' : 5
                }`}</div>
              </div>
            ))}
        </div>
      </div>
      <div className='development-plan-mentor__icons'>
        <i className={`icon ${selected ? 'el-icon-minus' : 'el-icon-plus'}`} />
      </div>
      <style jsx>{developmentPlanMentorStyle}</style>
    </div>
  )
}

export default DevelopmentPlanMentor
