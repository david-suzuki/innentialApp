import React from 'react'
import { useSpring, animated } from 'react-spring'
import { NavLink } from 'react-router-dom'

const SubMenu = ({ path, tabs, sidebarActive, expanded, handleLinkClick }) => {
  const expandedMenu = useSpring({
    // visibility: sidebarActive && expanded ? "visible" : "hidden",
    height: sidebarActive && expanded ? tabs.length * 44 : 0,
    opacity: sidebarActive && expanded ? 1 : 0
    // transform:
    //   sidebarActive && expanded ? `translateX(${0}%)` : `translateX(${-30}%)`
  })

  const liStyle = useSpring({
    display: 'flex',
    width: '100%',
    paddingLeft: '85px',
    // position: 'relative',
    transform:
      sidebarActive && expanded ? `translateY(${0}%)` : `translateY(${-120}%)`,
    zIndex: sidebarActive && expanded ? '0' : '-1'
  })

  return (
    <animated.div style={expandedMenu} className='sub-menu'>
      <ul
        style={{
          zIndex: '0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'start'
        }}
      >
        {tabs.map(({ name, url }) => {
          const pathLink = `${path}${url}`

          return (
            <animated.li
              key={name}
              style={liStyle}
              onClick={e => handleLinkClick(name, e, true)}
            >
              <NavLink
                to={pathLink}
                className='sub-menu-link'
                activeClassName='sub-menu-link--active'
              >
                {name}
              </NavLink>
              <div className='active-border' />
            </animated.li>
          )
        })}
      </ul>
    </animated.div>
  )
}

export default SubMenu
