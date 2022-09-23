import { useMutation, useQuery } from '@apollo/react-hooks'
import React, { useEffect, useState } from 'react'
import {
  fetchLearningPathById,
  fetchRelevantLearningPaths,
  transformLearningPathToGoals,
  fetchLearningPathsForDashboard,
  fetchTeamsLearningPathsForDashboard,
  fetchAssignedLearningPathsForUser
} from '../../../../api'
import learningPathItemsStyle from '../../../../styles/learningPathItemsStyle'
// import { LearningPathItem } from './'
import {
  CarouselSecondary,
  OnboardingStatement,
  Statement,
  remapLearningPathForUI
} from '../../../ui-components'
import loadingCurl from '../../../../static/loading-curl.svg'
import { LearningPathItemOnboarding } from '.'
import { Dialog, Button, MessageBox } from 'element-react'
import { captureFilteredError, LoadingSpinner } from '../../../general'
import { LearningPathDetails } from '../../../_learningPath'
import learningPathPageNewStyle from '../../../../styles/learningPathPageNewStyle'
import { useHistory } from 'react-router'
import { useGA4React } from 'ga-4-react'
import Container from '../../../../globalState'
import { CategoryFiltersOnboarding } from '../../../learning-paths'

const AssignedPaths = ({ setPathId }) => {
  const { data, loading, error } = useQuery(fetchAssignedLearningPathsForUser)

  if (loading) return <LoadingCurl />

  if (error) {
    captureFilteredError(error)
    return null
  }

  const { value: paths = [] } = data?.fetchAssignedLearningPathsForUser || {}

  return (
    <LearningPathItems
      title='Assigned Paths'
      paths={paths}
      setPathId={setPathId}
    />
  )
}

const LoadingCurl = () => (
  <div
    className='loading-curl'
    style={{
      backgroundImage: `url(${loadingCurl})`,
      margin: '0 auto'
    }}
  />
)

const LoadingCurlContainer = () => (
  <div
    style={{
      maxWidth: 370,
      height: 1350,
      margin: '50px auto'
      // padding: '15% 25%'
    }}
  >
    <LoadingCurl />
  </div>
)

const LearningPathItems = ({ title, paths, setPathId, noCarousel }) => {
  const ga = useGA4React()
  if (paths.length === 0) return null

  if (noCarousel) {
    return (
      <>
        <div className='learning-path-items__list'>
          {title && (
            <h1 className='learning-path-items__list-heading'>{title}</h1>
          )}
          <div className='learning-path-items__list--no-carousel'>
            {paths.map((path, i) => (
              <LearningPathItemOnboarding
                key={path._id}
                {...remapLearningPathForUI({ path })}
                handleClick={() => {
                  window.analytics &&
                    window.analytics.track('viewed_LP', {
                      pathId: path._id
                    })
                  ga &&
                    ga.gtag('event', 'viewed_LP', {
                      path: path._id
                    })
                  setPathId(path._id)
                }}
              />
            ))}
          </div>
        </div>
        <div className='learning-path-items__list-mobile'>
          {title && <h1 className='align-left'>{title}</h1>}
          <br />
          {paths.map((path, i) => (
            <LearningPathItemOnboarding
              key={path._id}
              {...remapLearningPathForUI({ path })}
              handleClick={() => {
                window.analytics &&
                  window.analytics.track('viewed_LP', {
                    pathId: path._id
                  })
                ga &&
                  ga.gtag('event', 'viewed_LP', {
                    path: path._id
                  })
                setPathId(path._id)
              }}
            />
          ))}
        </div>
      </>
    )
  }

  return (
    <>
      <div className='learning-path-items__list'>
        {title && (
          <h1 className='learning-path-items__list-heading'>{title}</h1>
        )}
        <CarouselSecondary
          rightArrow={({ nextSlide }) => (
            <i
              className='el-icon-arrow-right carousel-secondary__control'
              onClick={nextSlide}
            />
          )}
          leftArrow={({ previousSlide }) => (
            <i
              className='el-icon-arrow-left carousel-secondary__control'
              onClick={previousSlide}
            />
          )}
          renderBottomControls={null}
        >
          {paths.map((path, i) => (
            <LearningPathItemOnboarding
              key={path._id}
              {...remapLearningPathForUI({ path })}
              handleClick={() => {
                window.analytics &&
                  window.analytics.track('viewed_LP', {
                    pathId: path._id
                  })
                ga &&
                  ga.gtag('event', 'viewed_LP', {
                    path: path._id
                  })
                setPathId(path._id)
              }}
            />
          ))}
        </CarouselSecondary>
      </div>
      <div className='learning-path-items__list-mobile'>
        {title && <h1 className='align-left'>{title}</h1>}
        <br />
        {paths.map((path, i) => (
          <LearningPathItemOnboarding
            key={path._id}
            {...remapLearningPathForUI({ path })}
            handleClick={() => {
              window.analytics &&
                window.analytics.track('viewed_LP', {
                  pathId: path._id
                })
              ga &&
                ga.gtag('event', 'viewed_LP', {
                  path: path._id
                })
              setPathId(path._id)
            }}
          />
        ))}
      </div>
    </>
  )
}

const LearningPathList = ({
  setPathId,
  categories
  // neededWorkSkills
}) => {
  const [fetchPolicy, setFetchPolicy] = useState('cache-and-network')
  const [limit, setLimit] = useState(2)
  const [isLoading, setLoading] = useState(false)
  const [noMorePaths, setNoMorePaths] = useState(false)

  const { data, loading, error, fetchMore } = useQuery(
    fetchLearningPathsForDashboard,
    {
      variables: {
        limit: 2,
        categories
      },
      fetchPolicy
    }
  )

  const wrapper = document.getElementById('page-wrapper')

  const showTeamPaths =
    categories.length === 0 || categories.indexOf('Team Paths') !== -1

  useEffect(() => {
    setFetchPolicy('cache-first')
  })

  useEffect(() => {
    const handleScroll = async event => {
      try {
        if (categories.length > 0 || isLoading || noMorePaths) return
        const { scrollTop, clientHeight, scrollHeight } = wrapper
        const maxHeight = scrollHeight - 100
        if (scrollTop + clientHeight > maxHeight) {
          setLoading(true)
          await fetchMore({
            variables: {
              limit: limit + 1
            },
            updateQuery: (prev, { fetchMoreResult, ...rest }) => {
              if (
                fetchMoreResult.fetchLearningPathsForDashboard.length ===
                prev.fetchLearningPathsForDashboard.length
              ) {
                setNoMorePaths(true)
                return prev
              } else return fetchMoreResult
            }
          })
          if (!noMorePaths) {
            setLimit(limit + 1)
          }
        }
        setLoading(false)
      } catch (err) {
        setLoading(false)
        captureFilteredError(err)
      }
    }
    wrapper.addEventListener('scroll', handleScroll)

    return () => wrapper.removeEventListener('scroll', handleScroll)
  }, [wrapper, categories, isLoading, noMorePaths])

  if (loading) return <LoadingCurl />

  if (error) {
    captureFilteredError(error)
    return <Statement content='Oops! Something went wrong' />
  }

  if (data) {
    const pathlists = data?.fetchLearningPathsForDashboard || []

    return (
      <div>
        {showTeamPaths && <TeamsPathList setPathId={setPathId} />}

        {pathlists.map(({ _id, key, value }) => {
          return (
            <LearningPathItems
              key={_id}
              title={key}
              paths={value}
              setPathId={setPathId}
            />
          )
        })}
        {isLoading && <LoadingCurl />}
      </div>
    )
  }
  return null
}

const TeamsPathList = ({ setPathId }) => {
  const { data, loading, error } = useQuery(
    fetchTeamsLearningPathsForDashboard,
    {
      fetchPolicy: 'cache-and-network'
    }
  )

  if (loading) return <LoadingCurl />

  if (error) {
    captureFilteredError(error)
    return <Statement content='Oops! Something went wrong' />
  }

  if (data) {
    let { key: title, value: paths = [] } =
      data?.fetchTeamsLearningPathsForDashboard || {}

    paths.sort((path1, path2) => !!path1.team - !!path2.team)

    // strip the '#' sign because it's appended in 'findTeamsPathsForDashboard'
    // while fetching the paths from DB: backend/src/datasources/_learning-path.js
    paths = paths.map(path => ({ ...path, _id: path._id.replace(/[#]/g, '') }))

    return (
      <LearningPathItems title={title} paths={paths} setPathId={setPathId} />
    )
  }
  return null
}

const DetailsDialog = ({
  pathId,
  setVisible,
  clearDevelopmentPlan,
  routeState,
  noAssign
}) => {
  const {
    onboardingFunctions: { onSkillsSubmit }
  } = Container.useContainer()

  const { user } = routeState

  const history = useHistory()

  const { data, loading, error } = useQuery(fetchLearningPathById, {
    variables: {
      id: pathId
    }
  })

  const [assign] = useMutation(transformLearningPathToGoals)

  const pathHasPaidContent = data?.fetchLearningPathById?.paid || false
  const disablePaidContent = user?.noPaid || false
  const approvals = user?.approvals || false

  const warn = disablePaidContent && pathHasPaidContent

  const assignPath = async () => {
    if (warn) {
      try {
        await MessageBox.confirm(
          <p>
            This path contains paid content. Your organisation has paid content
            turned off and you won't be able to request its purchase.{' '}
            {approvals ? (
              <strong>
                You can still ask for budget approval or simply skip it.
              </strong>
            ) : (
              <strong>You can still access it or simply skip it.</strong>
            )}{' '}
            Would you like to begin anyway?
          </p>,
          `Warning`,
          {
            type: 'warning'
          }
        )
      } catch (err) {
        return
      }
    }

    try {
      await assign({
        variables: {
          id: pathId
        }
      })
      window.analytics &&
        window.analytics.track('started_LP', {
          pathId
        })
      history.push('/onboarding/almost-done', routeState)
    } catch (err) {
      if (err?.graphQLErrors[0]?.message === 'already_assigned')
        history.push('/onboarding/almost-done', routeState)
      else captureFilteredError(err)
    }
  }

  const handleClickCTA = async () => {
    clearDevelopmentPlan()
    if (pathId) {
      if (noAssign) {
        const { skills = [] } = data?.fetchLearningPathById || {}
        onSkillsSubmit(
          skills.map(({ _id, name }) => ({ _id, name })).slice(0, 3),
          'neededWorkSkills'
        )
        history.push('/onboarding/almost-done', {
          ...routeState,
          withPath: pathId
        })
      } else {
        await assignPath()
      }
    } else {
      captureFilteredError('Attempted to assign path without ID')
    }
  }

  if (error) {
    captureFilteredError(error)
  }

  return (
    <Dialog
      visible
      onCancel={() => setVisible(false)}
      lockScroll
      size='full'
      customClass='el-dialog__learning-path-details'
    >
      <Dialog.Body>
        {loading && <LoadingCurlContainer />}
        {error && <Statement content='Could not fetch learning path' />}
        {data?.fetchLearningPathById && (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <LearningPathDetails {...data.fetchLearningPathById} />
          </div>
        )}
      </Dialog.Body>
      <Dialog.Footer>
        <Button
          disabled={loading || error}
          size='large'
          className='learning-path__footer-button learning-path__footer-button--claim'
          onClick={handleClickCTA}
        >
          {noAssign ? 'Get Started' : 'Claim & Finish setup'}
        </Button>
      </Dialog.Footer>
    </Dialog>
  )
}
// const arr = Array(5).fill({})

export const LearningPathListWithDetails = ({
  title,
  paths,
  clearDevelopmentPlan = () => {},
  routeState,
  setPathId,
  pathId,
  noAssign,
  noCarousel,
  showRecommendedPaths
}) => {
  return (
    <>
      {pathId && (
        <DetailsDialog
          setVisible={() => setPathId(null)}
          pathId={pathId}
          clearDevelopmentPlan={clearDevelopmentPlan}
          routeState={routeState}
          noAssign={noAssign}
        />
      )}
      {showRecommendedPaths && (
        <LearningPathItems
          title={title}
          paths={paths}
          setPathId={setPathId}
          noCarousel={noCarousel}
        />
      )}
      <style>{learningPathPageNewStyle}</style>
      <style>{learningPathItemsStyle}</style>
    </>
  )
}

const LearningPathSelection = ({
  neededSkills,
  clearDevelopmentPlan,
  routeState
}) => {
  const ga = useGA4React()
  const [pathId, setPathId] = useState(null)
  const [categories, setCategories] = useState([])

  const { data, loading, error } = useQuery(fetchRelevantLearningPaths, {
    variables: {
      neededSkills
    }
  })

  useEffect(() => {
    if (data) {
      const paths = (data && data.fetchRelevantLearningPaths) || []
      if (paths.length === 0) {
        window.analytics && window.analytics.track('no_LP_found')
        ga && ga.gtag('event', 'no_lp_found')
      }
    }
  }, [data])

  if (loading) {
    return <LoadingCurlContainer />
  }

  if (error) {
    captureFilteredError(error)
    return <Statement content='Oops! Something went wrong.' />
  }

  const paths = (data && data.fetchRelevantLearningPaths) || []

  const showRecommendedPaths =
    categories.length === 0 || categories.indexOf('Recommended Paths') !== -1

  return (
    <>
      <CategoryFiltersOnboarding
        categories={categories}
        setCategories={setCategories}
        hasRecommendedPaths={paths.length > 0}
      />
      {categories.length === 0 && <AssignedPaths setPathId={setPathId} />}
      <LearningPathListWithDetails
        title='Recommended Paths'
        paths={paths}
        clearDevelopmentPlan={clearDevelopmentPlan}
        routeState={routeState}
        pathId={pathId}
        setPathId={setPathId}
        showRecommendedPaths={showRecommendedPaths}
      />
      <LearningPathList setPathId={setPathId} categories={categories} />
      <style>{learningPathPageNewStyle}</style>
      <style>{learningPathItemsStyle}</style>
    </>
  )
}

export default LearningPathSelection
