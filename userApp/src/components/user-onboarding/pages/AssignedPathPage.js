import React, { useState } from 'react'
import { Page } from '../../ui-components'
import { Link, Redirect } from 'react-router-dom'
import pagerStyle from '../../../styles/pagerStyle'
import { LearningPathListWithDetails, NextButton } from './components'
import { useQuery } from 'react-apollo'
import { fetchAssignedLearningPathsForUser } from '../../../api'
import { captureFilteredError, LoadingSpinner } from '../../general'
import Container from '../../../globalState'
import { Button } from 'element-react'

const AssignedPathsPage = ({ routeState }) => {
  const [pathId, setPathId] = useState(null)

  const {
    onboardingFunctions: { onSkillsSubmit }
  } = Container.useContainer()

  const { data, loading, error } = useQuery(fetchAssignedLearningPathsForUser)

  if (loading)
    return (
      <Page>
        <div className='page-content-align' style={{ margin: 'auto' }}>
          <LoadingSpinner />
        </div>
      </Page>
    )

  if (error) {
    captureFilteredError(error)
    return (
      <Redirect to={{ pathname: '/onboarding/how-to', state: routeState }} />
    )
  }

  const { key: assignedBy, value: paths = [] } =
    data?.fetchAssignedLearningPathsForUser || {}

  if (paths.length === 0) {
    return (
      <Redirect to={{ pathname: '/onboarding/how-to', state: routeState }} />
    )
  }

  return (
    <Page>
      <div className='page-content-align'>
        <h2 className='head__header'>
          {assignedBy} has assigned you{' '}
          {paths.length > 1 ? 'learning paths!' : 'a learning path!'}
        </h2>
        <p className='head__paragraph'>
          Assigned paths will be available on your Innential homepage.
        </p>
        <LearningPathListWithDetails
          title=''
          paths={paths}
          pathId={pathId}
          setPathId={setPathId}
          routeState={routeState}
          showRecommendedPaths
          noAssign
          noCarousel
        />
      </div>
      <div className='bottom-nav-contained nav-preferences'>
        <Link
          to={{
            pathname: '/onboarding/how-to',
            state: routeState
          }}
          className='bottom-nav__previous'
        >
          <span>Find your own learning paths</span>{' '}
          <i className='icon icon-small-right' />
        </Link>
        <Link
          to={{
            pathname: '/onboarding/almost-done',
            state: routeState
          }}
          onClick={() => {
            const skills = paths[0]?.skills
            onSkillsSubmit(
              skills.map(({ _id, name }) => ({ _id, name })).slice(0, 3),
              'neededWorkSkills'
            )
          }}
        >
          <Button type='primary'>
            <NextButton label='Get Started' />
          </Button>
        </Link>
      </div>
      <style jsx>{pagerStyle}</style>
    </Page>
  )
}

export default AssignedPathsPage
