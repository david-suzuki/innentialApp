import React from 'react'
import { ReactComponent as Check } from '../../static/check.svg'
import { ReactComponent as Arrow } from '../../static/arrow-right.svg'
import pagerStyle from '../../styles/pagerStyle'

const Pager = props => {
  const {
    screenList,
    currentScreen,
    pathname,
    showSkillPage,
    userDetailsProvided,
    firstAdmin
  } = props

  const subroutes = {
    'Personal details': [
      !userDetailsProvided && { name: 'Security', path: 'security' },
      firstAdmin && { name: 'Organization details', path: 'organization' },
      !userDetailsProvided && { name: 'About you', path: 'about-you' },
      showSkillPage && { name: 'Skill levels', path: 'my-skill-levels' }
    ].filter(item => !!item),
    Diagnosis: [
      {
        name: 'Skills',
        path: 'skill-preferences, skill-levels, survey-completed'
      },
      { name: 'Preferences', path: 'learning-preferences' }
    ],
    'Development Plan': []
  }

  const getSubRoutes = (screen, display, pathname) => {
    const formatPathname = pathname.split('/onboarding/')[1]
    const routes = subroutes[screen] || []

    return (
      display &&
      routes.map(sub => (
        <li
          className={
            sub.path.split(', ').indexOf(formatPathname) !== -1
              ? 'pager-sub-route route--active'
              : 'pager-sub-route route--inactive'
          }
          key={sub.name}
        >
          {sub.name}
          {sub.path.split(', ').indexOf(formatPathname) !== -1 && <Arrow />}
        </li>
      ))
    )
  }

  const screenPager = screenList.map((s, index) => (
    <li
      key={index}
      className={`pager-item ${
        index === currentScreen
          ? 'pager-item--active'
          : index < currentScreen && currentScreen !== 40
          ? 'pager-item--done'
          : ''
      }`}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span
          className={`pager-item__description ${
            index >= currentScreen ? 'active-item' : ''
          }`}
        >
          {s}
          {index < currentScreen && currentScreen !== 40 && <Check />}
          {index === currentScreen &&
            (pathname === '/onboarding/how-to' ||
              pathname === '/onboarding/survey-decision' ||
              pathname === '/onboarding/survey' ||
              pathname === '/onboarding/development-plan') && <Arrow />}
        </span>
        <ul>{getSubRoutes(s, index === currentScreen, pathname)}</ul>
      </div>
    </li>
  ))
  return (
    <div>
      <div>
        <ol className='pager'>{screenPager}</ol>
      </div>
      <style jsx>{pagerStyle}</style>
    </div>
  )
}

export default Pager
