import React, { Component } from 'react'
import userItemStyle from '../../styles/userItemStyle'
import learningItemStyle from '../../styles/learningItemStyle'
import history from '../../history'
import Location from '../../components/ui-components/Location'
import { generateInitialsAvatar } from '$/utils'
import { Link } from 'react-router-dom'
export default class UserItemWithSkill extends Component {
  state = {
    activeDropdown: false,
    skill: 'empty'
  }

  dropdownOptions = this.props.dropdownOptions ? this.props.dropdownOptions : []

  toggleDropdown = () => {
    this.setState({ activeDropdown: !this.state.activeDropdown })
  }

  render() {
    // const goalInfo = this.props.goalId
    //   ? {
    //     goalId: this.props.goalId,
    //     goalName: this.props.goalName,
    //     goalEnds: this.props.goalEnds,
    //     goalCompleted: this.props.goalCompleted
    //   }
    //   : null

    const userId = this.props.id || this.props.uuid
    return (
      <div className='list-item user-item user-item--skill'>
        <div className='user-item-with-skill__data'>
          <div>
            {/* {goalInfo && (
              <div
                className={`user-item__goal-name ${goalInfo.goalCompleted &&
                  'user-item__goal-name--completed'}`}
              >
                <>
                  <img src={require('../../static/goal.svg')} alt="" />{' '}
                  {goalInfo.goalCompleted ? (
                    <p>{goalInfo.goalName} (Completed)</p>
                  ) : (
                      <Link to={`/plan/${goalInfo.goalId}`}>
                        {goalInfo.goalName}
                        {goalInfo.goalEnds &&
                          `  (Due ${new Date(goalInfo.goalEnds).toDateString()})`}
                      </Link>
                    )}
                </>
              </div>
            )} */}
            <div
              className='user-item__data user-item__data--skill user-item__data-is-active'
              onClick={() => {
                history.push(`/profiles/${userId}`)
              }}
            >
              <img
                src={
                  this.props.img ||
                  generateInitialsAvatar({
                    firstName: this.props.name?.split(' ')[0] || '',
                    lastName: this.props.name?.split(' ')[1] || '',
                    _id: userId
                  })
                }
                alt='User'
              />
              <div className='user-item__details'>
                {this.props.roles &&
                  this.props.roles.indexOf('ADMIN') !== -1 && (
                    <p className='user-item__is-admin'>Administrator</p>
                  )}
                <div className='list-item__label list-item__label--skill'>
                  {this.props.label}
                </div>
                <div
                  className='list-item__title list-item__title--skill'
                  onClick={e => userId && history.push(`/profiles/${userId}`)}
                >
                  {this.props.name}

                  <span
                    className={`user-item__status ${
                      this.props.isActive
                        ? 'user-item__status--green'
                        : this.props.isDisabled
                        ? 'user-item__status--red'
                        : ''
                    }`}
                  >
                    {this.props.status}
                  </span>
                </div>
                <div className='user-item__details__profession'>
                  {this.props.profession}
                </div>
                {this.props.location && (
                  <div className='user-item__details__location'>
                    <Location location={this.props.location} size='small' />
                  </div>
                )}
              </div>
            </div>
          </div>

          {this.dropdownOptions.length > 0 ? (
            <div>
              <div
                className='user-item__children'
                onClick={this.toggleDropdown}
              >
                {this.props.children}
              </div>
              <div
                className={
                  this.state.activeDropdown
                    ? 'user__dropdown is-active'
                    : 'user__dropdown'
                }
              >
                <ul>
                  {this.dropdownOptions.map((el, idx) => {
                    if (
                      el.value === 'Give feedback' ||
                      el.value === 'Set as leader'
                    ) {
                      if (this.props.isActive || this.props.isDisabled) {
                        return (
                          <li key={idx}>
                            <a
                              onClick={e =>
                                el.boundFunction(
                                  this.props.uuid,
                                  this.props.name || this.props.email
                                )
                              }
                            >
                              {el.value}
                            </a>
                          </li>
                        )
                      } else return null
                    }
                    return (
                      <li key={idx}>
                        <a
                          onClick={e =>
                            el.boundFunction(
                              this.props.uuid,
                              this.props.name || this.props.email
                            )
                          }
                        >
                          {el.value}
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          ) : this.props.children ? (
            this.props.children
          ) : null}
        </div>

        <div>
          {/* SKILLS INFORMATION */}
          {this.props.neededSkills ? (
            <div className='user-item__skills-wrapper'>
              {this.props.neededSkills.map(skill => (
                <div
                  key={`${this.props.id}-${skill._id}`}
                  className='learning-item__skill-tag learning-item__skill-tag--skill learning-item__skill-tag--main'
                >
                  <div className='learning-item__skill-tag-trim'>{`${skill.name}`}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className='user-item__skills-wrapper'>
              {this.props.skills.map(skill => (
                <div
                  key={`${this.props.id}-${skill.skillId}`}
                  className={`${
                    skill.relevancyRating > 0
                      ? 'learning-item__skill-tag learning-item__skill-tag--skill learning-item__skill-tag--main'
                      : 'learning-item__skill-tag learning-item__skill-tag--skill'
                  }`}
                >
                  <div className='learning-item__skill-tag-trim'>{`${skill.name}`}</div>
                  {skill.level !== 0 && (
                    <div className='learning-item__skill-tag-level'>{`${
                      skill.level < 5 ? skill.level + '/5' : 5
                    }`}</div>
                  )}
                </div>
              ))}
            </div>
          )}
          {/* Skills END */}

          {/* <div className="user-item__children" onClick={this.toggleDropdown}>
            {this.props.children}
          </div> */}
        </div>

        <style jsx>{userItemStyle}</style>
        <style jsx>{learningItemStyle}</style>
      </div>
    )
  }
}
