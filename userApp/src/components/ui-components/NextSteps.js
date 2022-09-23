import React, { useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { fetchNextStepsForUser } from '../../api'
import illustration from '../../static/Bottom.svg'
import KrisFace from '../../static/kris.png'
import { emptyGoalsStyle } from '../../styles/emptyGoalsStyle'
import { captureFilteredError, LoadingSpinner } from '../general'
import { EmptyGoal } from './'

const NextSteps = ({ developmentPlanSet }) => {
  const { data, loading, error, startPolling, stopPolling } = useQuery(
    fetchNextStepsForUser
  )

  if (loading) return <LoadingSpinner />

  if (error) {
    captureFilteredError(error)
    return (
      <>
        <div className='emptygoal__container'>
          <img src={illustration} alt='no active goal' />
          <h3>Oops! Something went wrong</h3>
          <span>Our team will fix this as soon as possible</span>
        </div>
        <style jsx>{emptyGoalsStyle}</style>
      </>
    )
  }

  if (data && data.fetchNextStepsForUser !== null) {
    const { awaitingXLP } = data.fetchNextStepsForUser
    if (!developmentPlanSet || awaitingXLP)
      return (
        <>
          <div className='journey-next-steps__container'>
            <h3>The next steps in your learning journey</h3>
            <div className='journey-next-steps__content'>
              <img src={KrisFace} alt='Our Innential expert' />
              <div className='journey-next-steps__content__inner'>
                <h4>
                  Our experts are preparing an Expert Learning Path for you
                </h4>
                <p>It should be ready in 3-5 working days</p>
              </div>
            </div>
            <div />
          </div>
          <style jsx>{emptyGoalsStyle}</style>
        </>
      )
  }

  return <EmptyGoal startPolling={startPolling} stopPolling={stopPolling} />
}

export default NextSteps
