import React from 'react'
import { ReviewItem } from './'
import { Link } from 'react-router-dom'
import { Button, Notification, MessageBox } from 'element-react'
import { captureFilteredError } from '../general'

const handleClosing = (item, mutate) => {
  const handleMutation = variables => {
    mutate({
      variables
    })
      .then(({ data: { closeReview: result } }) => {
        if (result !== null) {
          Notification({
            type: 'success',
            message: 'Review has been closed!',
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
      })
      .catch(e => {
        captureFilteredError(e)
      })
  }

  const { unreviewedGoals } = item
  if (unreviewedGoals.length > 0) {
    MessageBox.confirm(
      'There are still goals waiting to be reviewed',
      'What would you like to do?',
      {
        type: 'warning',
        confirmButtonText: 'Mark them as reviewed',
        cancelButtonText: 'Keep them active',
        showClose: false
      }
    )
      .then(() =>
        handleMutation({
          reviewId: item._id
        })
      )
      .catch(() =>
        handleMutation({
          reviewId: item._id,
          goalIds: unreviewedGoals
        })
      )
  } else {
    handleMutation({
      reviewId: item._id
    })
  }
}

export default ({
  items,
  listType,
  dropdownOptions,
  mutate,
  /* admin, */ currentUser
}) => {
  const admin = currentUser.roles.indexOf('ADMIN') !== -1

  if (listType === 'SCHEDULE') {
    return items.map(item => (
      <ReviewItem
        key={item._id}
        {...item}
        listType={listType}
        dropdownOptions={
          dropdownOptions
            ? [
                { value: 'Edit', boundFunction: dropdownOptions.routeFunction },
                {
                  value: 'Delete',
                  boundFunction: dropdownOptions.deleteFunction
                }
              ]
            : []
        }
      />
    ))
  }
  return items.map(item => (
    <ReviewItem key={item._id} {...item} listType={listType}>
      {listType === 'OPEN' && (
        <>
          <Link to={`/start-review/${item._id}`}>
            <Button className='review-item__button'>Go to review page</Button>
          </Link>
          {(admin || item.createdBy === currentUser._id) && (
            <Button
              className='review-item__button'
              onClick={() => handleClosing(item, mutate)}
            >
              Close review
            </Button>
          )}
        </>
      )}
      {listType === 'UPCOMING' && (
        <>
          <Link to={`/create/reviews/events/${item._id}`}>
            <Button className='review-item__button'>Schedule events</Button>
          </Link>
          {(admin || item.createdBy === currentUser._id) && (
            <Button
              className='review-item__button'
              onClick={() => {
                mutate({
                  variables: {
                    reviewId: item._id
                  }
                })
                  .then(({ data: { startReview: result } }) => {
                    if (result !== null) {
                      Notification({
                        type: 'success',
                        message: 'Review has been opened!',
                        duration: 2500,
                        offset: 90
                      })
                    } else {
                      Notification({
                        type: 'warning',
                        message:
                          'Something went wrong. There might be a review already open',
                        duration: 2500,
                        offset: 90
                      })
                    }
                  })
                  .catch(e => {
                    captureFilteredError(e)
                  })
              }}
            >
              Open review
            </Button>
          )}
        </>
      )}
      {listType === 'CLOSED' && item.hasResult && (
        <Link to={`/review-results/${item._id}`}>
          <Button className='review-item__button'>View results</Button>
        </Link>
      )}
    </ReviewItem>
  ))
}
