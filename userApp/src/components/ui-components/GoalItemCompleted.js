import React from 'react'
import goalItemStyle from '../../styles/goalItemStyle'
// import { Button } from 'element-react'
// import { Link } from 'react-router-dom'

const GoalItem = ({ goalName, measures, skills, feedback }) => {
  const measuresCompleted = measures.filter(measure => measure.completed)
  return (
    <div className='list-item'>
      <div className='goal-item__name-wrapper'>
        <div className='goal-item__name'>
          <img src={require('../../static/goal.svg')} alt='' />{' '}
          <span>{goalName}</span>
        </div>
        <div className='goal-item__completion'>
          <p
            className={`goal-item__completion--numbers ${measuresCompleted.length ===
              measures.length && 'goal-item__completion--numbers--completed'}`}
          >
            <span>{measuresCompleted.length}</span>
            <span>/{measures.length}</span>
          </p>
          <p className='goal-item__completion-text'>
            success measures <br />
            completed
          </p>
        </div>
      </div>
      {skills && skills.length > 0 && (
        <div className='goal-item__skills-wrapper'>
          <p>Related Skills</p>
          <div className='goal-item__skill-results'>
            {skills.map(skill => {
              return (
                <span
                  key={goalName + skill._id}
                  className={`goal-item__skill-result-tag ${
                    skill.related ? 'goal-item__skill-result-tag--main' : ''
                  }`}
                >
                  <span className='goal-item__skill-result-tag-trim'>{`${skill.skillName}`}</span>
                  {skill.level !== null && (
                    <span className='goal-item__skill-result-tag-level'>{`${
                      skill.level < 5 ? skill.level + '/5' : 5
                    }`}</span>
                  )}
                </span>
              )
            })}
          </div>
        </div>
      )}
      <div className='goal-item__measures-wrapper'>
        <div className='goal-item__success-measures-label'>
          Success measures
        </div>
        {measures.map(measure => {
          const {
            _id: measureId,
            measureName,
            successRate,
            completed
          } = measure
          return (
            <div className='goal-item__success-wrapper' key={measureId}>
              <div
                className={`goal-item__success-icon ${completed &&
                  'completed'}`}
              >
                <img
                  src={require(`../../static/${
                    completed ? 'check-green.svg' : 'check.svg'
                  }`)}
                  alt=''
                />
              </div>
              <span
                // key={measureId}
                className='goal-item__success-item'
              >
                {'  '}
                {measureName}
                {'  '}
                <span className='goal-item__success-rate'>
                  {successRate && `(${successRate}%)`}
                </span>
              </span>
            </div>
          )
        })}
      </div>
      {feedback && (
        <>
          <div className='goal-item__feedback-label'>Feedback: </div>
          <div
            className='goal-item__feedback-wrapper'
            dangerouslySetInnerHTML={{
              __html: feedback
            }}
          />
        </>
      )}
      <style jsx>{goalItemStyle}</style>
    </div>
  )
}

export default GoalItem
