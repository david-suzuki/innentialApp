import React from 'react'
import { Redirect } from 'react-router-dom'
import { ManageReviews } from '../components/review-components'

const Reviews = ({ currentUser }) => {
  const { roles, isReviewer, leader } = currentUser
  const isAdmin = roles.indexOf('ADMIN') !== -1
  // ROUTE SECURITY
  if (!isAdmin && !isReviewer && !leader)
    return <Redirect to='/error-page/404' />

  return (
    <ManageReviews
      /* admin={isAdmin} isLeader={isAdmin ? false : leader} */ currentUser={
        currentUser
      }
    />
  )
}

export default Reviews
