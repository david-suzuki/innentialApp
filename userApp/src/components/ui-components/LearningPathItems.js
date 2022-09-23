import React from 'react'
// import { LearningPathItem } from './'
import { LearningPathItemNew, CarouselSecondary } from '.'
import { Button } from 'element-react'
import { Link } from 'react-router-dom'
import { remapLearningPathForUI } from './utils'

const statusPriority = {
  COMPLETED: 0,
  'IN PROGRESS': 1,
  'NOT STARTED': 2
}

const LearningPathItems = ({ value = [], title, search, showEmpty }) => {
  if (value.length === 0 && !showEmpty) return null

  const quickSearchQuery = `/quick-search?query=${search}`

  const NotFound = () => {
    return (
      <div style={{ width: '70%' }}>
        <div className='learning-path-items__list-heading'>
          Sorry, we can't find a path for you.
        </div>
        <div
          className='learning-path-items__list-heading'
          style={{ marginTop: '40px' }}
        >
          <h3 style={{ display: 'inline-block', fontSize: '20px' }}>
            We recommend:
          </h3>{' '}
          Search for "{search}" using Quick Search.
        </div>
        <Link to={quickSearchQuery}>
          <Button type='primary' style={{ margin: '80px' }}>
            <i
              className='icon el-icon-search'
              style={{ fontSize: '18px', marginRight: '4px' }}
            />
            <span style={{ fontSize: '18px' }}>Click to search</span>
          </Button>
        </Link>
      </div>
    )
  }

  // SORT BY COMPLETED LAST
  value.sort((a, b) => {
    const aPrio = statusPriority[a?.userProgress?.status] || 0
    const bPrio = statusPriority[b?.userProgress?.status] || 0
    return bPrio - aPrio
  })

  return (
    <>
      <div className='learning-path-items__list'>
        {(!value.length || value.length === 0) && <NotFound />}
        {value.length > 0 && (
          <>
            <h3 className='learning-path-items__list-heading'>{title}</h3>
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
              {value.map((path, i) => (
                <LearningPathItemNew
                  key={path._id}
                  {...remapLearningPathForUI({ path })}
                  title={title}
                />
              ))}
            </CarouselSecondary>
          </>
        )}
      </div>
      {/* MOBILE LIST */}
      <div className='learning-path-items__list-mobile'>
        {(!value.length || value.length === 0) && <NotFound />}
        {value.length > 0 && (
          <>
            <h2 className='align-left'>{title}</h2>
            <br />
            {value.map((path, i) => (
              <LearningPathItemNew
                key={path._id}
                {...remapLearningPathForUI({ path })}
                title={title}
              />
            ))}
          </>
        )}
      </div>
    </>
  )
}

// const LearningPathItems = props => {
//   return props.items.map((path, i) => (
//     <LearningPathItem key={`${path._id}:${i}`} {...path} />
//   ))
// }

export default LearningPathItems
