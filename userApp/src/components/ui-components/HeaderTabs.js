import React, { useEffect } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import { Button, Loading } from 'element-react'
import { ReviewRoutes, BaseRoutes, AdminRoutes } from './NewNav/routes'
import history from '../../history'

const tours = (isAdmin, history) => ({
  '/': isAdmin ? 74391 : 85413,
  '/quick-search': 83708,
  '/organization': () => {
    history.push('/organization/teams')
    window.Intercom('startTour', 85982)
  },
  '/goals': () => {
    history.push('/goals/draft')
    window.Intercom('startTour', 94802)
  }
})

const SwitchDashboardButtons = ({ onChange, value, index, text }) => {
  return (
    <div className='dashboard__switch-button-container'>
      <Button.Group>
        <Button
          type='primary'
          size='small'
          onClick={() => onChange(0)}
          plain={value}
        >
          <div style={{ display: 'flex' }}>
            <span className='dashboard__button'>
              <span className='dashboard-button__extra-content--left'>
                Active
              </span>{' '}
              Paths
            </span>
          </div>
        </Button>
        <Button
          type='primary'
          size='small'
          onClick={() => {
            onChange(index)
            history.push('/')
          }}
          plain={!value}
        >
          <div style={{ display: 'flex' }}>
            <span className='dashboard__button'>
              {text}{' '}
              <span className='dashboard-button__extra-content'>Dashboard</span>
            </span>
          </div>
        </Button>
      </Button.Group>
    </div>
  )
}

// const tabRoutes = [
//   { name: 'Feed', pathname: 'feed' },
//   { name: 'Shared', pathname: 'shared' },
//   { name: 'My Learning', pathname: 'my-learning' },
//   { name: 'Upload', pathname: 'upload' }
// ]

const HeaderTabs = ({
  currentUser,
  pathname,
  displayFilters,
  onChange,
  value,
  showLearnerDashboard,
  highlightCompleted,
  setHighlightCompleted
}) => {
  // useEffect(() => {
  //   if (pathname === '/quick-search') {
  //     const tabsHeader = document.getElementById('tabsHeader')
  //     tabsHeader.className = 'tabs-header__content content--right'
  //   }
  // }, [pathname])

  useEffect(() => {
    if (showLearnerDashboard) {
      onChange(0)
    }
  })

  console.log('currentUser--', currentUser)

  const {
    roles,
    premium,
    isReviewer,
    leader,
    fulfillment,
    hasTeams,
    hasEvent
  } = currentUser

  const isAdmin = roles.indexOf('ADMIN') !== -1

  const isLeader = leader && !isAdmin

  const mainRoute = `/${pathname.split('/')[1] || ''}`

  const history = useHistory()

  const hasTeam = hasTeams

  console.log('has_event:', hasEvent)
  // const hasEvents = hasEvent
  // console.log('has_events:', hasEvents)

  const routes = isAdmin
    ? AdminRoutes({ hasTeam, premium, fulfillment, hasEvent })
    : BaseRoutes({
        hasTeam,
        reviewRoute: ReviewRoutes(leader),
        isReviewer,
        leader,
        premium,
        fulfillment,
        hasEvent
      })

  const currentRoute = routes.find(({ path }) => path === mainRoute)

  if (!currentRoute) return null

  const tabs = (currentRoute && currentRoute.tabs) || []

  const getClassname = pathname =>
    mainRoute === '/learning-paths' || mainRoute === '/events'
      ? 'tabs-header__content content--wider'
      : pathname === '/'
      ? 'tabs-header__content header-dashboard'
      : 'tabs-header__content'

  const title = currentRoute.name

  const tourLookup = tours(isAdmin, history)

  return (
    <div className='tabs-header__container'>
      {currentUser.corporate && (
        <img
          className='postfinance-logo'
          src='https://innential-production.s3.eu-central-1.amazonaws.com/logos/postfinance.png'
        />
      )}
      <div
        id='tabsHeader'
        className={
          displayFilters || pathname.includes('/goals')
            ? 'tabs-header__content content--right'
            : getClassname(pathname)
        }
      >
        <div
          className='page-header--button header-tabs'
          style={mainRoute === '/library' ? { padding: '20px 0' } : {}}
        >
          <span className='tabs-header__title'> {title}</span>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {isAdmin && pathname === '/' && (
              <SwitchDashboardButtons
                onChange={onChange}
                value={value}
                index={1}
                text='Admin'
              />
            )}

            {isLeader && pathname === '/' && (
              <SwitchDashboardButtons
                onChange={onChange}
                value={value}
                index={2}
                text='Leader'
              />
            )}

            {tourLookup[mainRoute] && (
              <Button
                className='el-button--help'
                onClick={() => {
                  // FALLBACK BECAUSE OF NON-FUNCTIONAL TOURS
                  window.Intercom('show')
                  // if (typeof tourLookup[mainRoute] === 'function') {
                  //   tourLookup[mainRoute]()
                  // } else {
                  //   window.Intercom('startTour', tourLookup[mainRoute])
                  // }
                }}
              >
                ?
              </Button>
            )}
          </div>
        </div>

        {/* <h1>{headerTitle}</h1> */}
        <div className='tabs-header__links-row'>
          {tabs.length > 0 &&
            tabs.map(({ name, url, extraProp }) => (
              <NavLink
                key={url}
                to={`${mainRoute}${url}`}
                className='tabs-title'
                activeClassName='tabs-title--active'
                onClick={() =>
                  url === '/completed' && setHighlightCompleted(false)
                }
              >
                {name}
                {extraProp && currentUser[extraProp] ? (
                  <span className='tabs-title__extra-prop'>
                    {currentUser[extraProp]}
                  </span>
                ) : null}
                {extraProp && !currentUser[extraProp] ? (
                  <span className='tabs-title__extra-prop__invitations'></span>
                ) : null}
                {url === '/completed' && highlightCompleted ? (
                  <div className='tabs-title__highlight' />
                ) : null}
                <div />
              </NavLink>
            ))}
        </div>
      </div>
    </div>
  )
}

export default HeaderTabs
