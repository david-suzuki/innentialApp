import React from 'react'
import { fetchRelevantLearningPaths } from '../../api'
import { useQuery } from '@apollo/react-hooks'
import { captureFilteredError, LoadingSpinner } from '../general'
import {
  CarouselSecondary,
  LearningPathItemNew,
  remapLearningPathForUI,
  OnboardingStatement
} from '../ui-components'
import learningPathItemsStyle from '../../styles/learningPathItemsStyle'
import learningPathPageNewStyle from '../../styles/learningPathPageNewStyle'

const LearningPathsDashboard = ({ neededSkills = [] }) => {
  const { data, loading, error } = useQuery(fetchRelevantLearningPaths, {
    variables: {
      neededSkills
    }
  })

  if (loading) return <LoadingSpinner />

  if (error) {
    captureFilteredError(error)
    return null
  }

  const paths = (data && data.fetchRelevantLearningPaths) || []

  if (paths.length === 0)
    return (
      <>
        <br />
        <OnboardingStatement
          title='Sorry, we couldn’t find a Learning Path that matches your selected skills.'
          content='Check out the Paths below or select another option.'
        />
      </>
    )

  return (
    <>
      <div className='learning-path-items__list'>
        <h3 className='learning-path-items__list-heading'>Recommended Paths</h3>
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
            <LearningPathItemNew
              key={path._id}
              {...remapLearningPathForUI({ path })}
            />
          ))}
        </CarouselSecondary>
      </div>
      {/* MOBILE LIST */}
      <div className='learning-path-items__list-mobile'>
        <br />
        <br />
        <h2 className='align-left'>Learning paths you may love</h2>
        <br />
        {paths.map((path, i) => (
          <LearningPathItemNew
            key={path._id}
            {...remapLearningPathForUI({ path })}
          />
        ))}
      </div>
      <style>{learningPathPageNewStyle}</style>
      <style>{learningPathItemsStyle}</style>
    </>
  )
}

export default LearningPathsDashboard
