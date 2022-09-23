import React from 'react'
import stepsStyle from '../../styles/stepsStyle'

export default ({ steps, activeStep }) => {
  return (
    <div>
      <div className='steps__container'>
        <ul className='steps__progressbar'>
          {steps.map((step, i) => (
            <li
              key={`step:${i}`}
              className={
                steps.length === 3
                  ? activeStep - 1 === i
                    ? 'active'
                    : activeStep - 1 > i
                    ? 'complete'
                    : ''
                  : activeStep === 3
                  ? i > 0
                    ? 'active'
                    : 'complete'
                  : i > 0
                  ? ''
                  : 'active'
              }
            >
              <span />
              {step}
            </li>
          ))}
        </ul>
      </div>
      <style jsx>{stepsStyle}</style>
    </div>
  )
}
