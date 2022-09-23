import React, { useState } from 'react'
import reviewItemStyle from '../../styles/reviewItemStyle'
import { /* Button, */ Notification } from 'element-react'
import actionDropdownStyle from '../../styles/actionDropdownStyle'
import List from '../ui-components/List'
import { captureFilteredError } from '../general'
import {
  fetchLeadersReviewSchedules,
  fetchOrganizationReviews,
  fetchOrganizationReviewSchedules,
  fetchUserReviews
} from '../../api'

export default ({
  _id: reviewId,
  name,
  progressChecks,
  reviewers,
  scope,
  reviewFrequency,
  startsAt,
  closedAt,
  firstReviewStart,
  nextReviewStart,
  listType,
  dropdownOptions,
  children
}) => {
  const [activeDropdown, setActiveDropdown] = useState(false)
  return (
    <div className='review-item__wrapper'>
      <div className='review-item'>
        <div className='review-item__heading'>
          <div className='review-item__heading__info'>
            <div className='review-item__title'>{name}</div>
            {listType === 'SCHEDULE' && (
              <div className='review-item__dropdown'>
                <div
                  className='team-item__children'
                  onClick={() => setActiveDropdown(!activeDropdown)}
                >
                  <i className='icon icon-menu-dots' />
                </div>
                <div
                  className={
                    activeDropdown
                      ? 'action-dropdown review-item__dropdown-content is-active'
                      : 'action-dropdown review-item__dropdown-content'
                  }
                >
                  <ul>
                    {dropdownOptions.map((el, idx) => (
                      <li key={idx}>
                        <a
                          onClick={e => {
                            e.preventDefault()
                            if (el.value === 'Edit') {
                              el.boundFunction('/create/reviews', {
                                edittingItem: { _id: reviewId }
                              })
                            }
                            if (el.value === 'Delete') {
                              el.boundFunction({
                                variables: { templateId: reviewId },
                                refetchQueries: [
                                  { query: fetchUserReviews, variables: {} },
                                  {
                                    query: fetchOrganizationReviewSchedules,
                                    variables: {}
                                  },
                                  {
                                    query: fetchOrganizationReviews,
                                    variables: {}
                                  },
                                  {
                                    query: fetchLeadersReviewSchedules,
                                    variables: {}
                                  }
                                ]
                              })
                                .then(
                                  ({
                                    data: { deleteReviewTemplate: result }
                                  }) => {
                                    if (result === 'Success') {
                                      Notification({
                                        type: 'success',
                                        message:
                                          'Review has been successfully deleted!',
                                        duration: 2500,
                                        offset: 90
                                      })
                                    } else {
                                      Notification({
                                        type: 'warning',
                                        message: 'Oops, something went wrong!',
                                        duration: 2500,
                                        offset: 90
                                      })
                                    }
                                  }
                                )
                                .catch(err => {
                                  captureFilteredError(err)
                                  Notification({
                                    type: 'warning',
                                    message: 'Oops, something went wrong!',
                                    duration: 2500,
                                    offset: 90
                                  })
                                })
                            }
                          }}
                        >
                          {el.value}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
          <div className='review-item__stats__container'>
            {scope && (
              <div className='review-item__stats'>
                <span className='review-item__stats--grey'>Who: </span>
                {scope}
              </div>
            )}
            {progressChecks &&
              (listType === 'UPCOMING' || listType === 'SCHEDULE') && (
                <div className='review-item__stats'>
                  <span className='review-item__stats--grey'>
                    Progress checks:{' '}
                  </span>
                  {progressChecks}
                </div>
              )}
            {listType === 'OPEN' && (
              <div className='review-item__stats'>
                <span className='review-item__stats--grey'>Opened at: </span>
                {new Date(startsAt).toDateString()}
              </div>
            )}
            {reviewers && (
              <div className='review-item__stats'>
                <span className='review-item__stats--grey'>By: </span>
                {reviewers}
              </div>
            )}
            {listType === 'SCHEDULE' && (
              <div className='review-item__stats'>
                <span className='review-item__stats--grey'>Review: </span>
                {reviewFrequency}
              </div>
            )}
          </div>
        </div>

        <div className='review-item__content'>
          {(listType === 'UPCOMING' || listType === 'CLOSED') && (
            <div className='review-item__date__container'>
              <div className='review-item__date'>
                {listType === 'CLOSED' ? 'Started' : 'Starts'}:{' '}
                <span className='review-item__date--grey'>
                  {new Date(startsAt).toDateString()}
                </span>
              </div>
              {listType === 'CLOSED' && (
                <div className='review-item__date'>
                  Finished:{' '}
                  <span className='review-item__date--grey'>
                    {new Date(closedAt).toDateString()}
                  </span>
                </div>
              )}
            </div>
          )}
          {listType === 'SCHEDULE' && (
            <div className='review-item__date__container'>
              <div className='review-item__date'>
                From:{' '}
                <span className='review-item__date--grey'>
                  {new Date(firstReviewStart).toDateString()}
                </span>
              </div>
              <div className='review-item__date'>
                Next review at:{' '}
                <span className='review-item__date--grey'>
                  {nextReviewStart
                    ? new Date(nextReviewStart).toDateString()
                    : '-'}
                </span>
              </div>
            </div>
          )}
        </div>
        {children && (
          <div
            className={
              listType !== 'OPEN' && 'review-item__button-container-margin'
            }
          >
            {children}
          </div>
        )}
        {/* {listType !== 'SCHEDULE' && listType !== 'UPCOMING' && (
          <div className={`${listType === 'CLOSED' && 'review-item__button-container-margin'}`}>
            <Link to={listType === 'OPEN' ? `/reviews/${reviewId}` : `/review-results/${reviewId}`}>
              <Button className="review-item__button">
                {listType === 'OPEN' ? 'Start review' : 'View results'}
              </Button>
            </Link>
            {listType === 'OPEN' && (
              <Button className="review-item__button" onClick={() => {
                mutate({
                  variables: {
                    reviewId
                  }
                })
                  .then(({ data }) => {
                    console.log(data)
                  })
                  .catch(e => {
                    console.error(e)
                  })
              }}>
                Close review
              </Button>
            )}
          </div>
        )}
        {listType === 'UPCOMING' && (
          <div className='review-item__button-container-margin'>
            <Button className="review-item__button" onClick={() => {
              mutate({
                variables: {
                  reviewId
                }
              })
                .then(({ data }) => {
                  console.log(data)
                })
                .catch(e => {
                  console.error(e)
                })
            }}>
              Open review
            </Button>
          </div>
        )} */}

        <style jsx>{reviewItemStyle}</style>
        <style jsx>{actionDropdownStyle}</style>
      </div>
    </div>
  )
}
