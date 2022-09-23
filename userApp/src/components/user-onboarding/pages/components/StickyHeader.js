import React, { useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Button } from 'element-react'

const StickyHeader = ({
  developmentPlan,
  developmentPlanHandler,
  routeState
}) => {
  useEffect(() => {
    const header = document.getElementById('stickyHeader')
    const background = document.getElementById('stickyBg')
    const sticky = header.offsetTop
    const scrollCallBack = window.addEventListener('scroll', () => {
      if (window.pageYOffset > sticky) {
        header.classList.add('sticky')
        background.classList.add('shadow')
      } else {
        header.classList.remove('sticky')
        background.classList.remove('shadow')
      }
    })
    return () => {
      window.removeEventListener('scroll', scrollCallBack)
    }
  }, [])

  return (
    <div className='sticky-header__container' id='stickyHeader'>
      <div className='sticky-header__background' id='stickyBg' />
      <div className='sticky-header__content'>
        <h3 style={{ fontWeight: '900' }}>Recommendations</h3>
        <Link
          to={{
            pathname: '/onboarding/my-selection',
            state: routeState,
            developmentPlan,
            developmentPlanHandler
          }}
        >
          <h4 className='sticky-header__link'>
            {developmentPlan.length > 0 ? (
              <Button className='onboarding__span-change sticky-header__button'>{`${developmentPlan.length} selected`}</Button>
            ) : (
              'Nothing selected'
            )}
          </h4>
        </Link>
      </div>
    </div>
  )
}

export default withRouter(StickyHeader)
