import React, { useState, useEffect } from 'react'
import { useQuery } from 'react-apollo'
import { Redirect } from 'react-router-dom'
import { fetchNextStepsForUser } from '../../../../api'
import { captureFilteredError, LoadingSpinner } from '../../../general'

const WaitForNextSteps = ({ routeState }) => {
  const [redirect, setRedirect] = useState(false)

  const { data, error } = useQuery(fetchNextStepsForUser, {
    pollInterval: 3000
  })

  useEffect(() => {
    if (error) {
      captureFilteredError(error)
      setRedirect('/error-page/500')
    }
  }, [error])

  useEffect(() => {
    if (data && data.fetchNextStepsForUser !== null) {
      setRedirect({
        pathname: '/onboarding/wait-for-confirmation',
        state: routeState
      })
    }
  }, [data])

  // if(onboardingState.developmentPlan.length === 0)
  //   return <Redirect to={{ pathname: '/onboarding/development-plan', state: routeState }} />

  if (redirect) return <Redirect to={redirect} />

  return null
}

export default WaitForNextSteps
