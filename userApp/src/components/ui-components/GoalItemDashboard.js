import React from 'react'
import { useHistory } from 'react-router-dom'
// import goalItemStyle from '../../styles/goalItemStyle'
import goalItemDashboardStyle from '../../styles/goalItemDashboardStyle'
import variables from '../../styles/variables'

export default ({
  _id: goalId,
  goalName,
  developmentPlan = { content: [], mentors: [] },
  relatedSkills = [],
  learningPathIndex,
  isPrivate,
  completed
}) => {
  const { content } = developmentPlan
  const contentCompleted = content.filter(
    ({ status }) => status === 'COMPLETED'
  )
  const history = useHistory()
  if (completed && history.location.pathname !== '/') {
    return (
      <div
        className={`list-item goal-item ${
          completed ? 'goal-item--completed' : ''
        }`}
      >
        {!completed && learningPathIndex && (
          <div className='goal-item__goal-number'>{learningPathIndex}</div>
        )}
        {completed && (
          <div
            className='goal-item__goal-number'
            style={{ backgroundColor: variables.avocado }}
          >
            <img
              src={require('../../static/check.svg')}
              alt='check'
              width='20px'
            />
          </div>
        )}
        <div className='goal-item__name-wrapper'>
          <div className='goal-item__name'>
            <img src={require('../../static/goal.svg')} alt='' />{' '}
            <span>
              {goalName}
              {isPrivate ? ' (Private Goal)' : ''}
            </span>
          </div>
          <div className='goal-item__completion'>
            <p
              className={`goal-item__completion--numbers ${contentCompleted.length ===
                content.length && 'goal-item__completion--numbers--completed'}`}
            >
              <span>{contentCompleted.length}</span>
              <span>/{content.length}</span>
            </p>
            <p className='goal-item__completion-text'>
              learning items <br />
              completed
            </p>
          </div>
        </div>
        {relatedSkills.length > 0 && (
          <div className='goal-item__skills-wrapper'>
            <p>Related skills</p>
            <div className='goal-item__skills'>
              {relatedSkills.map(skill => (
                <span
                  key={goalName + skill._id}
                  className='goal-item__skill-tag'
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}
        <style jsx>{goalItemDashboardStyle}</style>
      </div>
    )
  } else {
    return (
      <div className='goal-dashboard-container'>
        <h1 className='goal-dashboard-header'>{goalName}</h1>
        <style jsx>{goalItemDashboardStyle}</style>
      </div>
    )
  }
}
