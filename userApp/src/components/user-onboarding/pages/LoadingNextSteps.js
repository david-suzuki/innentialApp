import React, { useState, useEffect } from 'react'
import { useMutation } from 'react-apollo'
import { Redirect } from 'react-router-dom'
import { onboardingMutation } from '../../../api'
import loadingCurl from '../../../static/loading-curl.svg'
import illustration from '../../../static/illustration.svg'
import { captureFilteredError } from '../../general'
import { useGA4React } from 'ga-4-react'

export const LoadingNextSteps = ({ container }) => {
  const ga = useGA4React()

  useEffect(() => {
    if (ga) {
      ga.gtag('event', 'finished_onboarding', {
        how: 'XLP'
      })
    }
  }, [ga])

  useEffect(() => {
    window.analytics &&
      window.analytics.track('finished_onboarding', {
        how: 'XLP'
      })
  }, [window.analytics])

  const [redirect, setRedirect] = useState(null)

  const [mutate] = useMutation(onboardingMutation)

  const { onboardingState } = container.useContainer()

  useEffect(() => {
    let timeout
    ;(async () => {
      const { neededWorkSkills, selectedWorkSkills } = onboardingState

      const inputData = {
        neededWorkSkills: neededWorkSkills.map(({ _id, name, level }) => ({
          _id,
          name,
          skillLevel: level
        })),
        selectedWorkSkills: selectedWorkSkills.map(({ _id, name, level }) => ({
          _id,
          name,
          skillLevel: level
        })),
        developmentPlan: []
      }

      try {
        await mutate({
          variables: {
            inputData
          }
        })
        timeout = setTimeout(
          () => setRedirect({ pathname: '/', state: { justOnboarded: true } }),
          1500
        )
      } catch (err) {
        captureFilteredError(err)
        setRedirect('/error-page/500')
      }
    })()

    return () => clearTimeout(timeout)
  }, [onboardingState])

  // if(onboardingState.developmentPlan.length === 0)
  //   return <Redirect to={{ pathname: '/onboarding/development-plan', state: routeState }} />

  if (redirect) return <Redirect to={redirect} />

  return (
    <div className='onboarding__loading-container'>
      <div className='column'>
        <h1>
          We're creating <br /> your account
        </h1>
        <h3>This may take a moment. Please wait!</h3>
        <div
          className='loading-curl curl-loading-page'
          style={{
            backgroundImage: `url(${loadingCurl})`
          }}
        />
      </div>
      <img src={illustration} alt='creating your account' />
    </div>
  )
}

export default LoadingNextSteps
