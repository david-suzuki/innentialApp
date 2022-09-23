import React, { useState } from 'react'
import userItemStyle from '../../styles/userItemStyle'
import { generateInitialsAvatar } from '$/utils'
import Location from '../../components/ui-components/Location'
import { DatePicker, TimeSelect, MessageBox } from 'element-react'
import css from 'styled-jsx/css'
import { CalendarBox } from '../review-components/event-components'

const createEventsForReviews = (
  email,
  date,
  reviewName,
  userId,
  reviewId,
  mutation
) => {
  MessageBox.alert(
    <CalendarBox
      reviewName={reviewName}
      firstReviewStart={date}
      calendarEmails={[email]}
      userId={userId}
      reviewId={reviewId}
      scheduleEvent={mutation}
    />,
    'Pick a calendar'
  )
    .then(() => {})
    .catch(() => {})
}

const dateTimeCss = css.global`
  .user-item__date-picker,
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 130px;
  }

  .el-date-editor--timeselect {
    padding-right: 10px;
  }
`

const UserItemReview = ({
  _id,
  imageLink,
  userName,
  roleAtWork,
  location,
  numberOfGoals,
  goalsSet,
  onClick,
  notInReview,
  reviewId,
  // templateId,
  reviewName,
  email,
  reviewStartDate,
  isInEventScheduling,
  hasEventScheduled,
  scheduleMutation,
  dontDisplayCalendarIcon
}) => {
  const [date, setDate] = useState(
    hasEventScheduled ? new Date(hasEventScheduled) : new Date(reviewStartDate)
  )
  // const { setCalendarState } = globalState.useContainer()

  return (
    <div
      className={`list-item user-item user-item-review__wrapper ${(isInEventScheduling ||
        (notInReview && !goalsSet)) &&
        `user-item-review__wrapper--no-hover`}`}
      onClick={onClick}
    >
      <div className='user-item-review__person-wrapper'>
        <div className='user-item__data img'>
          <img
            src={
              imageLink ||
              generateInitialsAvatar({
                firstName: userName?.split(' ')[0] || '',
                lastName: userName?.split(' ')[1] || '',
                _id
              })
            }
            alt=''
          />
        </div>

        <div className='user-item__details'>
          <div className='user-review-item--black'>{userName}</div>
          <div className='user-item__details__profession user-item-review__profession'>
            {roleAtWork}
          </div>
          {location && (
            <div className='user-item__details__location'>
              <Location location={location} size='small' />
            </div>
          )}
        </div>
      </div>
      {isInEventScheduling && !dontDisplayCalendarIcon && (
        <div style={{ margin: '10px 0px 10px 10px' }}>
          {hasEventScheduled ? (
            <div className='user-item__review-completed'>
              <div className='user-item__review-completed-info'>
                <p className='user-item__review-completed-text'>
                  Scheduled for{' '}
                  {new Date(hasEventScheduled).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}
                </p>
              </div>
              <div className='user-item__review-completed-img'>
                <img src={require('../../static/check-green.svg')} alt='' />
              </div>
            </div>
          ) : (
            <>
              <DatePicker
                className='user-item__date-picker'
                value={date}
                onChange={value => {
                  if (value !== null) {
                    const newDate = new Date(
                      value.getFullYear(),
                      value.getMonth(),
                      value.getDate(),
                      date.getHours(),
                      date.getMinutes(),
                      0,
                      0
                    )
                    setDate(newDate)
                  }
                }}
                format='yyyy-MM-dd HH:mm'
                disabledDate={date => date < Date.now() - 8.28e7 /* 23 hours */}
              />
              <TimeSelect
                style={{ marginRight: '10px' }}
                className='user-item__date-picker'
                step='00:15'
                placeholder='Starting time'
                onChange={value => {
                  const newDate = new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate(),
                    value.getHours(),
                    value.getMinutes(),
                    0,
                    0
                  )
                  setDate(newDate)
                }}
              />
            </>
          )}
          <p
            className='align-right link-button'
            style={{ margin: '5px 10px 0px 0px', fontWeight: 500 }}
            onClick={() => {
              createEventsForReviews(
                email,
                date,
                reviewName,
                _id,
                reviewId,
                scheduleMutation
              )
            }}
          >
            <i
              className={`icon ${
                hasEventScheduled ? 'icon-time-clock' : 'icon-small-add'
              }`}
              style={{ marginRight: '3px' }}
            />
            {hasEventScheduled ? 'Reschedule' : 'Add to calendar'}
          </p>
        </div>
      )}
      {!isInEventScheduling && (
        <div className='user-item-review__status-wrapper'>
          <div className='user-item-review__number'>
            <img src={require('../../static/goal.svg')} alt='goal arrow' />{' '}
            {numberOfGoals}
          </div>
          <div className='user-item__review-completed'>
            {!goalsSet && hasEventScheduled && (
              <div className='user-item__review-completed-info'>
                <p className='user-item__review-completed-text'>
                  Scheduled for{' '}
                  {new Date(hasEventScheduled).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}
                </p>
              </div>
            )}
            {goalsSet && (
              <>
                <div className='user-item__review-completed-info'>
                  <p className='user-item__review-completed-text'>Completed:</p>
                  <p className='user-item__review-completed-date'>
                    {new Date(goalsSet).toDateString()}
                  </p>
                </div>
                <div className='user-item__review-completed-img'>
                  <img src={require('../../static/check-green.svg')} alt='' />
                </div>
              </>
            )}
          </div>
        </div>
      )}
      <style jsx>{userItemStyle}</style>
      <style jsx>{dateTimeCss}</style>
    </div>
  )
}

export default UserItemReview
