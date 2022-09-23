import React from 'react'
import SinglePlan from './SinglePlan'
import profileDevelopmentPlanStyle from './styles'

const DevelopmentPlans = ({ data }) => {
  const pathsInProgress = data.filter(
    plan => plan.path.status === 'IN PROGRESS'
  )
  const pathsNotStarted = data.filter(
    plan => plan.path.status === 'NOT STARTED'
  )
  const pathsCompleted = data.filter(plan => plan.path.status === 'COMPLETED')

  return (
    <div className='profile__development-plans-container'>
      <div className='profile__development-plans-category'>
        {pathsInProgress.length > 0 && (
          <div>
            <h2 className='profile__development-plans-category-title'>
              In Progress
            </h2>
            {pathsInProgress.map(plan => (
              <SinglePlan data={plan} />
            ))}
          </div>
        )}
      </div>
      <div className='profile__development-plans-category'>
        {pathsNotStarted.length > 0 && (
          <div>
            <h2 className='profile__development-plans-category-title'>
              Not Started
            </h2>
            {pathsNotStarted.map(plan => (
              <SinglePlan data={plan} />
            ))}
          </div>
        )}
      </div>
      <div className='profile__development-plans-category'>
        {pathsCompleted.length > 0 && (
          <div>
            <h2 className='profile__development-plans-category-title'>
              Completed
            </h2>
            {pathsCompleted.map(plan => (
              <SinglePlan data={plan} />
            ))}
          </div>
        )}
      </div>
      <style jsx>{profileDevelopmentPlanStyle}</style>
    </div>
  )
}

export default DevelopmentPlans
