import React from 'react'
import { DevelopmentPlanContentList, DevelopmentPlanMentorList } from './'
import separatedContentListStyle from '../../styles/separatedContentListStyle'

export default ({ content = [], mentors = [] }) => {
  const { EVENT: events, 'E-LEARNING': courses, BOOK: books } = content.reduce(
    (acc, curr) => {
      if (acc[curr.type]) {
        return {
          ...acc,
          [curr.type]: [...acc[curr.type], curr]
        }
      } else {
        return {
          ...acc,
          [curr.type]: [curr]
        }
      }
    },
    {}
  )

  const other = content.reduce((acc, curr) => {
    if (
      !['E-LEARNING', 'BOOK', 'EVENT', 'WORKSHOP'].some(
        type => curr.type === type
      )
    ) {
      return [...acc, curr]
    }
    return acc
  }, [])

  return (
    <div className='separated-list'>
      {books && books.length > 0 && (
        <div>
          <p className='separated-list__title'>Books</p>
          <DevelopmentPlanContentList content={books} inSummary />
        </div>
      )}

      {courses && courses.length > 0 && (
        <div>
          <p className='separated-list__title'>Courses</p>
          <DevelopmentPlanContentList content={courses} inSummary />
        </div>
      )}

      {events && events.length > 0 && (
        <div>
          <p className='separated-list__title'>Events</p>
          <DevelopmentPlanContentList content={events} inSummary />
        </div>
      )}

      {other && other.length > 0 && (
        <div>
          <p className='separated-list__title'>Other</p>
          <DevelopmentPlanContentList content={other} inSummary />
        </div>
      )}

      {mentors && mentors.length > 0 && (
        <div>
          <p className='separated-list__title'>Mentors</p>
          <DevelopmentPlanMentorList mentors={mentors} inSummary />
        </div>
      )}
      <style jsx>{separatedContentListStyle}</style>
    </div>
  )
}
