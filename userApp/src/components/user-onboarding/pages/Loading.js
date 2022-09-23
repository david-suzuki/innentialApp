import React, { useState, useEffect } from 'react'
import { useMutation } from 'react-apollo'
import { Redirect } from 'react-router-dom'
import loadingCurl from '../../../static/loading-curl.svg'
import illustration from '../../../static/illustration.svg'
import { onboardingMutation } from '../../../api'
import { captureFilteredError } from '../../general'
import { useGA4React } from 'ga-4-react'

export const Loading = ({ routeState, container }) => {
  const ga = useGA4React()

  const { withPath } = routeState

  useEffect(() => {
    const { developmentPlan } = onboardingState
    if (ga) {
      ga.gtag('event', 'finished_onboarding', {
        how: developmentPlan.length === 0 ? 'PREMADE' : 'OWN LP'
      })
    }
  }, [ga])

  useEffect(() => {
    const { developmentPlan } = onboardingState
    window.analytics &&
      window.analytics.track('finished_onboarding', {
        how: developmentPlan.length === 0 ? 'PREMADE' : 'OWN LP'
      })
  }, [window.analytics])

  const [redirect, setRedirect] = useState(false)

  const [mutate] = useMutation(onboardingMutation)

  const { onboardingState } = container.useContainer()

  useEffect(() => {
    let timeout
    ;(async () => {
      const {
        neededWorkSkills,
        selectedWorkSkills,
        developmentPlan
      } = onboardingState

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
        developmentPlan: developmentPlan.map(
          ({
            _id: contentId,
            type: contentType,
            price: { value: price },
            availableWithSubscription
          }) => ({
            contentId,
            contentType,
            price,
            subscriptionAvailable: availableWithSubscription
          })
        )
      }

      try {
        await mutate({
          variables: {
            inputData
          }
        })
        timeout = setTimeout(
          () =>
            setRedirect({
              pathname: '/',
              search: withPath ? `?path=${withPath}` : '',
              state: { justOnboarded: true }
            }),
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
          We're creating <br /> your account.
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

export default Loading
