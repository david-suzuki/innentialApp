import React, { useState } from 'react'
import goalItemStyle from '../../styles/goalItemStyle'
// import actionDropdownStyle from '../../styles/actionDropdownStyle'
// import { NavLink } from 'react-router-dom'
import { Button, Input } from 'element-react'
// import { Link } from 'react-router-dom'
// import { Query } from 'react-apollo'
// import { checkContentPlanForGoal } from '../../api'
// import { LoadingSpinner, captureFilteredError } from '../general'
import callToActionStyle from '../../styles/callToActionStyle'
import Pattern from '$/static/pattern.svg'
import { ReactComponent as SettingsIcon } from '$/static/settings.svg'

export default ({
  _id: goalId,
  goalName,
  goalIndex,
  relatedSkills = [],
  measures = [],
  onMeasureClick,
  inReview,
  inResults,
  skills = [],
  feedback,
  // dropdownOptions = [],
  // developmentPlan,
  // displayDevelopmentPlan = () => {},
  // hasPlannedContent,
  showDevPlanButton,
  onDevPlanButtonClick, // = () => {},
  hideMeasureCount = false,
  createdAt,
  endsAt,
  options = [],
  developmentPlan,
  status,
  showDeleteButton,
  handleDeletion,
  isPrivate,
  inApproval,
  children,
  inPath,
  learningPathIndex,
  handleChangingGoalName = () => {}
}) => {
  const hasPlannedContent =
    developmentPlan && developmentPlan.content && developmentPlan.mentors
      ? developmentPlan.content.length + developmentPlan.mentors.length > 0
      : false
  // const [activeActionDropdown, setActiveActionDropdown] = useState(false)
  const [isVisible, setVisibility] = useState(false)
  const measuresCompleted =
    measures && measures.length && measures.filter(measure => measure.completed)
  return (
    <div className={`list-item ${!inPath && 'goal-item--path'}`}>
      {/* {learningPathIndex && (
        <div className='goal-item__goal-number'>{learningPathIndex}</div>
      )} */}
      <div className='goal-item__title'>
        <div className='goal-item__goal-number'>
          <span>goal</span>
          <span>{goalIndex + 1}</span>

          <img src={Pattern} alt='pattern' />
        </div>
        {createdAt && endsAt && (
          <p className='goal-item__date'>
            {new Date(createdAt).toDateString()} -{' '}
            {new Date(endsAt).toDateString()}
          </p>
        )}
        <div className='goal-item__name-wrapper--path'>
          <Input
            value={goalName}
            onChange={value => {
              handleChangingGoalName(goalIndex, value)
            }}
          />
          {!hideMeasureCount && measures && measures.length > 0 && (
            <div className='goal-item__completion'>
              <p
                className={`goal-item__completion--numbers ${measuresCompleted.length ===
                  measures.length &&
                  'goal-item__completion--numbers--completed'}`}
              >
                <span>{measuresCompleted.length}</span>
                <span>/{measures.length}</span>
              </p>
              <p className='goal-item__completion-text'>
                success measures <br />
                completed
              </p>
            </div>
          )}
          {/* {dropdownOptions.length > 0 && (
            <div
              className="action-dropdown-wrapper"
              style={{ marginLeft: '90px' }}
            >
              <div
                className="action-dropdown-trigger"
                onClick={() => setActiveActionDropdown(!activeActionDropdown)}
              >
                <i className="icon icon-menu-dots" />
              </div>
              <div
                className={
                  activeActionDropdown
                    ? 'action-dropdown is-active'
                    : 'action-dropdown'
                }
              >
                <ul>
                  {dropdownOptions.map((option, i) => (
                    <li key={`${goalId}:option:${i}`}>{option}</li>
                  ))}
                </ul>
              </div>
            </div>
          )} */}
        </div>
      </div>
      <div className='goal-item__content-wrapper'>
        <div className='goal-item__content'>
          {/* {inResults && skills && skills.length > 0 && (
            <div className='goal-item__skills-wrapper--path'>
              <SettingsIcon className='settings__icon' />
              <p>Skills</p>
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
          )} */}
          {/* {(!skills || skills.length === 0) &&
            relatedSkills &&
            relatedSkills.length > 0 && (
              <div className='goal-item__skills-wrapper--path'>
                <SettingsIcon className='settings__icon' />
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
          {inResults && measures && measures.length > 0 && (
            <div className='goal-item__buttons-wrapper'>
              <a
                className='goal-item__measures-button el-button--secondary-link'
                onClick={() => setVisibility(!isVisible)}
              >
                {isVisible ? 'Hide ' : 'Show '}details
              </a>
            </div>
          )} */}
          {(!inResults || isVisible) && (
            <>
              {measures && measures.length > 0 && (
                <div className='goal-item__measures-wrapper'>
                  <div className='goal-item__success-measures-label'>
                    Success measures
                  </div>
                  {measures.map(measure => {
                    const {
                      _id: measureId,
                      measureName,
                      successRate = null,
                      completed
                    } = measure
                    return (
                      <div
                        className={`goal-item__success-wrapper ${inReview &&
                          'goal-item__success-wrapper--with-hover'}`}
                        key={measureId}
                        onClick={() => {
                          if (inReview) onMeasureClick(measureId, successRate)
                        }}
                      >
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
                          {successRate !== null && (
                            <span className='goal-item__success-rate'>
                              {successRate}%
                            </span>
                          )}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
              {!inReview && feedback && (
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
            </>
          )}
        </div>
        <div className='goal-item__controls'>
          {options.map((group, i) => (
            <div
              key={`optiongroup:${i}:${goalId}`}
              className='call-to-action__option-group'
            >
              {group.map((option, i) => (
                <div
                  key={`option:${i}:${goalId}`}
                  name={`cta:${option.text.toLowerCase()}`}
                  className='call-to-action__option call-to-action__option--active'
                  style={{
                    color: option.color,
                    fontWeight: option.weight || 500
                  }}
                  onClick={() => option.onClick(goalId)}
                >
                  <i className={`icon ${option.icon}`} />
                  <p className='goal-item__controls-text'>{option.text}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className='goal-item__buttons-wrapper'>
        {showDevPlanButton && (
          <Button
            className={`el-button goal-item__development-button${
              hasPlannedContent ? '' : '--active'
            }`}
            style={{ float: 'left' }}
            onClick={onDevPlanButtonClick}
          >
            {`${
              (status === 'DRAFT' || status === 'READY FOR REVIEW') &&
              !inApproval
                ? 'Prepare development plan'
                : hasPlannedContent
                ? 'See development plan'
                : 'Set development plan'
            }`}
          </Button>
        )}
        {showDeleteButton && (
          <Button
            className='goal-item__development-button el-button el-button--default'
            style={{ float: 'right' }}
            onClick={() => handleDeletion(goalId)}
          >
            Delete this goal
          </Button>
        )}
      </div>
      <div style={{ paddingTop: '15px' }}>{children}</div>
      <style jsx>{callToActionStyle}</style>
      {/* <style jsx>{actionDropdownStyle}</style> */}
      <style jsx>{goalItemStyle}</style>
    </div>
  )
}

// export default props => {
//   if (props._id && !props._id.includes('nextGoal'))
//     return (
//       <Query
//         query={checkContentPlanForGoal}
//         variables={{ goalId: props._id }}
//         fetchPolicy="network-only"
//       >
//         {({ data, loading, error }) => {
//           if (loading) return <LoadingSpinner />
//           if (error) {
//             captureFilteredError(error)
//             return null
//           }

//           const hasPlannedContent = data.checkContentPlanForGoal
//           return <GoalItem {...props} hasPlannedContent={hasPlannedContent} />
//         }}
//       </Query>
//     )
//   else return <GoalItem {...props} />
// }
