import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu } from 'element-react'
import mainNavStyle from '$/styles/mainNavStyle'
import variables from '$/styles/variables'
import { generateInitialsAvatar } from '$/utils'
import '$/styles/theme/menu.css'
import '$/styles/theme/submenu.css'
import history from '$/history'

export default class MainNav extends Component {
  constructor(props) {
    super(props)

    const {
      user: {
        firstName,
        lastName,
        imageLink,
        roles,
        isReviewer,
        leader,
        premium
      },
      team
    } = props

    const adminRoutes = [
      {
        name: 'Home',
        path: '/',
        icon: 'icon-h-dashboard'
      },
      {
        name: 'Learning',
        path: '/learning',
        icon: 'icon-bookmark'
      },
      {
        name: 'Paths',
        path: '/learning-paths',
        icon: 'icon3-road',
        label: 'NEW'
      },
      {
        name: 'Organization',
        path: '/teams',
        icon: 'icon-multiple-11'
      },
      premium && {
        name: 'Reviews',
        path: '/reviews',
        icon: 'icon-collection'
      },
      {
        name: 'Goals',
        path: '/goals',
        icon: 'icon3-radio-checked'
      }
      // {
      //   name: 'Skills',
      //   path: '/skill-gap',
      //   icon: 'icon-ranking'
      // },
      // premium && {
      //   name: 'Statistics',
      //   path: '/statistics',
      //   icon: 'icon-ranking'
      // }
    ].filter(item => !!item)

    const baseRoutes = [
      {
        name: 'Home',
        path: '/',
        icon: 'icon-h-dashboard'
      },
      {
        name: 'Learning',
        path: '/learning',
        icon: 'icon-bookmark'
      },
      {
        name: 'Paths',
        path: '/learning-paths',
        icon: 'icon3-road',
        label: 'NEW'
      }
    ]

    const reviewRoute = {
      name: 'Reviews',
      path: '/reviews',
      icon: 'icon-collection'
    }

    const teamRoute = {
      name: 'My Teams',
      path: '/teams',
      icon: 'icon-multiple-11'
    }

    const goalRoute = {
      name: 'Goals',
      path: '/goals',
      icon: 'icon3-radio-checked'
    }

    const isAdmin = roles.indexOf('ADMIN') !== -1
    const hasTeam = team !== undefined

    if (!isAdmin && hasTeam) baseRoutes.push(teamRoute)
    if (((!isAdmin && isReviewer) || leader) && premium)
      baseRoutes.push(reviewRoute)
    baseRoutes.push(goalRoute)

    this.state = {
      userName: `${firstName} ${lastName}`,
      role: 'n/a',
      team,
      imageLink,
      sidebarActive: false,
      appRoutes: isAdmin ? adminRoutes : baseRoutes
    }
  }

  toggleDropdown = () => {
    this.setState({ activeDropdown: !this.state.activeDropdown })
  }

  toggleHamburgerDropdown = () => {
    this.setState({
      activeHamburgerDropdown: !this.state.activeHamburgerDropdown
    })
  }

  toggleSidebar = () => {
    const header = document.getElementById('main-header')
    const container = document.getElementById('main-overlay')
    if (header) {
      if (this.state.sidebarActive) {
        container.className = 'container-main'
        header.className = ''
        this.setState({ activeHamburgerDropdown: false })
      } else {
        container.className = 'container-main container-main--with-sidebar'
        header.className = 'header--with-sidebar'
      }
    }
    this.setState({ sidebarActive: !this.state.sidebarActive })
  }

  firstName = () => {
    const letter = this.state.userName.slice(0, 1)
    return (
      <>
        {this.state.imageLink ? (
          <img
            className='main-nav__user-panel__image'
            src={this.state.imageLink}
            alt='im'
          />
        ) : (
          <div className='main-nav__user-panel__letter'>{letter}</div>
        )}
        <div className='main-nav__user-panel__name'>{this.state.userName}</div>
      </>
    )
  }

  handleClickOutside = e => {
    if (
      this.wrapperRef &&
      !this.wrapperRef.contains(e.target) &&
      this.state.activeDropdown
    ) {
      this.setState({ activeDropdown: false })
    }
  }

  setWrapperRef = node => {
    this.wrapperRef = node
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  componentWillReceiveProps(nextProps) {
    if (
      `${nextProps.user.firstName} ${nextProps.user.lastName}` !==
      this.state.userName
    ) {
      this.setState({
        userName: `${nextProps.user.firstName} ${nextProps.user.lastName}`
      })
    }
  }

  onLogout = () => {
    history.push('/logout')
  }

  render() {
    const isIE = /* @cc_on!@ */ false || !!document.documentMode
    const stylesIE = isIE ? (
      <style jsx>{`
        .main-nav {
          position: relative;
          min-width: 350px;
          max-width: 420px;
          margin: 0 auto;
          text-align: center;
          padding: 20px;
        }
        @media ${variables.lg} {
          .main-nav {
            width: 100%;
            max-width: 1400px;
            display: flex;
            justify-content: space-between;
            padding-bottom: 0;
          }
        }
        .main-nav .logo {
          height: 19px;
        }
        .main-nav .el-menu-item > a {
          padding-bottom: 70px;
        }

        .main-nav .el-menu,
        .main-nav .el-menu-item > a:hover {
          background-color: transparent;
        }
      `}</style>
    ) : null

    const {
      user: { premium }
    } = this.props

    return (
      <div>
        <div className='main-nav'>
          <div className='hamburger' onClick={this.toggleSidebar}>
            <i className='icon icon-menu-34' />
          </div>

          <NavLink to='/'>
            <img
              className='logo'
              alt='Innential Logo'
              src={require('$/static/innential-logo.svg')}
            />
          </NavLink>

          <div className='main-nav__items'>
            <Menu mode='horizontal'>
              {this.state.appRoutes.map((route, idx) => (
                <Menu.Item
                  className='main-nav__item'
                  key={idx}
                  index={`${idx + 1}`}
                >
                  <NavLink exact to={route.path}>
                    {route.name}
                    {route.label && (
                      <div className='main-nav__new-label'>{route.label}</div>
                    )}
                  </NavLink>
                </Menu.Item>
              ))}
            </Menu>
          </div>

          <div
            ref={this.setWrapperRef}
            className='main-nav__user-panel'
            onClick={this.toggleDropdown}
          >
            <div className='main-nav__user-panel__name-wrapper'>
              {this.firstName()}
            </div>
            {
              // THIS FEATURE REMOVED FOR NOW
              /* {team && (
              <div>
                <div className="main-nav__user-panel__department">
                  Team: <span>{team.teamName}</span>{' '}
                </div>
                <div className="main-nav__user-panel__data-wrapper">
                  <div>
                    Stage <span>{team.stageResultInfo.stage}</span>
                  </div>
                  <div>
                    Engagement{' '}
                    <span>
                      {Math.round(team.stageResultInfo.engagement * 10)}%
                    </span>
                  </div>
                </div>
              </div>
            )} */
            }
            <div>
              <i
                className={
                  this.state.activeDropdown
                    ? 'el-icon-arrow-down  el-icon-arrow-down--reverse'
                    : 'el-icon-arrow-down'
                }
              />
            </div>
            <div
              className={
                this.state.activeDropdown
                  ? 'main-nav__user-panel__dropdown is-active'
                  : 'main-nav__user-panel__dropdown'
              }
            >
              <ul>
                <li>
                  <NavLink exact to='/profile'>
                    Profile settings
                  </NavLink>
                </li>
                <li>
                  <NavLink exact to={`/profiles/${this.props.user._id}`}>
                    My Profile
                  </NavLink>
                </li>
                {premium && (
                  <li>
                    <NavLink exact to='/feedback-page'>
                      Feedback
                    </NavLink>
                  </li>
                )}
                <li
                  onClick={e => {
                    e.preventDefault()
                    this.onLogout()
                  }}
                >
                  <a>Log out</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div
          className={
            this.state.sidebarActive
              ? 'hamburger-menu is-active'
              : 'hamburger-menu'
          }
        >
          <div className='hamburger-menu__bar'>
            <div className='hamburger-menu__items'>
              <div className='hamburger-menu__user'>
                <div className='hamburger-menu__user-header'>
                  <img
                    src={
                      this.props.user.imageLink
                        ? this.props.user.imageLink
                        : generateInitialsAvatar(this.props.user)
                    }
                    alt='user'
                  />
                  <div className='hamburger-menu__user-nav'>
                    <div className='hamburger-menu__user__name'>
                      {this.state.userName} <br />
                      <span>{this.state.userRole}</span>
                    </div>
                    <div
                      className={
                        this.state.activeHamburgerDropdown
                          ? 'el-icon-arrow-up'
                          : 'el-icon-arrow-down'
                      }
                      style={{ cursor: 'pointer' }}
                      onClick={this.toggleHamburgerDropdown}
                    />
                  </div>
                </div>

                {this.state.activeHamburgerDropdown && (
                  <div className='hamburger-menu__user-links'>
                    <ul>
                      <NavLink
                        className='hamburger-menu__route'
                        // activeClassName="hamburger-menu__route--active"
                        exact
                        to='/profile'
                        // style={{ color: 'white' }}
                      >
                        <li onClick={e => this.toggleSidebar()}>
                          <i className='icon icon-settings-tool-66' />
                          Profile settings
                        </li>
                      </NavLink>
                      <NavLink
                        className='hamburger-menu__route'
                        // activeClassName="hamburger-menu__route--active"
                        to={`/profiles/${this.props.user._id}`}
                        // style={{ color: 'white' }}
                      >
                        <li onClick={e => this.toggleSidebar()}>
                          <i className='icon icon-multiple' />
                          My Profile
                        </li>
                      </NavLink>
                      {premium && (
                        <NavLink
                          className='hamburger-menu__route'
                          // activeClassName="hamburger-menu__route--active"
                          exact
                          to='/feedback-page'
                        >
                          <li onClick={e => this.toggleSidebar()}>
                            <i className='icon icon-exchange' />
                            Feedback
                          </li>
                        </NavLink>
                      )}
                      <li
                        onClick={e => {
                          e.preventDefault()
                          this.onLogout()
                        }}
                      >
                        <i className='icon icon-logout-2' />
                        Log out
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              <ul>
                {this.state.appRoutes.map((route, idx) => (
                  <NavLink
                    key={idx}
                    className='hamburger-menu__route'
                    activeClassName='hamburger-menu__route--active'
                    exact
                    to={route.path}
                    // style={{ color: 'white' }}
                  >
                    <li
                      key={idx}
                      index={`${idx + 1}`}
                      onClick={e => this.toggleSidebar()}
                    >
                      <i className={`icon ${route.icon}`} />
                      {route.name}
                    </li>
                  </NavLink>
                ))}
                {/* <NavLink
                  className="hamburger-menu__route"
                  activeClassName="hamburger-menu__route--active"
                  exact
                  to="/profile"
                  // style={{ color: 'white' }}
                >
                  <li onClick={e => this.toggleSidebar()}>
                    <i className="icon icon-settings-tool-66" />
                    Profile settings
                  </li>
                </NavLink>
                <NavLink
                  className="hamburger-menu__route"
                  activeClassName="hamburger-menu__route--active"
                  to={`/profiles/${this.props.user._id}`}
                  // style={{ color: 'white' }}
                >
                  <li onClick={e => this.toggleSidebar()}>
                    <i className="icon icon-multiple" />
                    My Profile
                  </li>
                </NavLink>
                <NavLink
                  className="hamburger-menu__route"
                  activeClassName="hamburger-menu__route--active"
                  exact
                  to="/feedback-page"
                >
                  <li onClick={e => this.toggleSidebar()}>
                    <i className="icon icon-exchange" />
                    Request Feedback
                  </li>
                </NavLink>
                <li
                  onClick={e => {
                    e.preventDefault()
                    this.onLogout()
                  }}
                >
                  <i className="icon icon-logout-2" />
                  Log out
                </li> */}
              </ul>
            </div>
          </div>
          <div className='hamburger-menu__overlay' onClick={this.toggleSidebar}>
            <div className='hamburger-menu__close'>
              <i className='icon icon-e-remove' />
            </div>
          </div>
        </div>

        <style jsx global>
          {mainNavStyle}
        </style>
        {stylesIE}
      </div>
    )
  }
}
