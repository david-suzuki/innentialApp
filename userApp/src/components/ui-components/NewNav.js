import React, { Component } from 'react'
import { NavLink, withRouter } from 'react-router-dom'
import newNavStyle from '$/styles/newNavStyle'
import { useQuery } from 'react-apollo'
import SubMenu from '../_subMenu'
import variables from '$/styles/variables'
import { generateInitialsAvatar } from '$/utils'
import Hamburger from '$/static/NewNav_assets/user-route-icons/HamburgerMenu'
import '$/styles/theme/menu.css'
import '$/styles/theme/submenu.css'
import history from '$/history'
import { fetchCurrentUserOrganizationTeams } from '../../api'
import { Loading } from 'element-react'

import { ReactComponent as IconReviews } from '$/static/NewNav_assets/admin-route-icons/reviews.svg'
import { ReactComponent as IconStats } from '$/static/NewNav_assets/admin-route-icons/stats.svg'
import { ReactComponent as IconDashboard } from '$/static/NewNav_assets/user-route-icons/dashboard.svg'

import { ReactComponent as IconGoals } from '$/static/NewNav_assets/user-route-icons/goals.svg'
import { ReactComponent as IconLearning } from '$/static/NewNav_assets/user-route-icons/learning.svg'
import { ReactComponent as IconPaths } from '$/static/NewNav_assets/user-route-icons/paths.svg'
import { ReactComponent as IconOrganization } from '$/static/NewNav_assets/user-route-icons/teams+organization.svg'
import { ReactComponent as IconArrow } from '$/static/arrow-small.svg'

class NewNav extends Component {
  constructor(props) {
    super(props)

    const {
      user: { firstName, lastName, imageLink, roles, isReviewer, leader },
      team
    } = props

    const isAdmin = roles.indexOf('ADMIN') !== -1
    const hasTeam = team !== undefined

    // console.log(hasTeam)

    const reviewRoute = {
      name: 'Reviews',
      path: '/reviews',
      Icon: IconReviews
    }

    const teamRoute = {
      name: 'My Teams',
      path: '/teams',
      Icon: IconOrganization
    }

    const sharedContentTab = {
      name: 'Shared',
      url: 'shared'
    }

    const adminRoutes = [
      {
        name: 'Dashboard',
        path: '/',
        Icon: IconDashboard
      },
      {
        name: 'Learning',
        path: '/learning',
        Icon: IconLearning,
        tabs: [
          {
            name: 'Feed',
            url: '/'
          },
          ...(hasTeam && [sharedContentTab]),
          {
            name: 'My Learning',
            url: 'myLearning'
          },
          {
            name: 'Upload',
            url: 'upload'
          }
        ]
      },
      {
        name: 'Paths',
        path: '/learning-paths',
        Icon: IconPaths,
        label: 'NEW'
      },
      {
        name: 'Organization',
        path: '/teams',
        Icon: IconOrganization
      },
      {
        name: 'Reviews',
        path: '/reviews',
        Icon: IconReviews
      },
      {
        name: 'Goals',
        path: '/goals',
        Icon: IconGoals
      }
      // {
      //   name: 'Skills',
      //   path: '/skill-gap',
      //   icon: 'icon-ranking'
      // },
      // {
      //   name: 'Statistics',
      //   path: '/statistics',
      //   Icon: IconStats
      // }
    ]

    const baseRoutes = [
      {
        name: 'Dashboard',
        path: '/',
        Icon: IconDashboard
      },
      {
        name: 'Learning',
        path: '/learning',
        Icon: IconLearning,
        tabs: [
          {
            name: 'Feed',
            url: '/'
          },
          { ...(hasTeam && [sharedContentTab]) },
          {
            name: 'My Learning',
            url: 'myLearning'
          },
          {
            name: 'Upload',
            url: 'upload'
          }
        ]
      },
      {
        name: 'Paths',
        path: '/learning-paths',
        Icon: IconPaths,
        label: 'NEW'
      },
      ...(hasTeam && [teamRoute]),
      ...((isReviewer || leader) && [reviewRoute]),
      {
        name: 'Goals',
        path: '/goals',
        Icon: IconGoals
      }
    ]

    // console.log(baseRoutes)
    // if (!isAdmin && hasTeam) baseRoutes.push(teamRoute)
    // if ((!isAdmin && isReviewer) || leader) baseRoutes.push(reviewRoute)
    // baseRoutes.push(goalRoute)

    this.state = {
      userName: `${firstName} ${lastName}`,
      role: 'n/a',
      team,
      imageLink,
      mobileSidebarClicked: false,
      sidebarActive: !this.props.hamburger,
      windowWidth: 0,
      appRoutes: isAdmin ? adminRoutes : baseRoutes
    }
  }

  toggleHamburgerDropdown = () => {
    this.setState({
      activeHamburgerDropdown: !this.state.activeHamburgerDropdown
    })
  }

  updateDimensions = () => {
    this.setState({ windowWidth: window.innerWidth })
  }

  showNavBar = (name, e) => {
    this.setState({
      mobileSidebarClicked: !this.state.mobileSidebarClicked,
      sidebarActive:
        name === 'Learning' && !this.state.sidebarActive
          ? !this.state.sidebarActive
          : this.state.sidebarActive
    })
  }

  getClassName = (sidebarActive, sidebarClicked) =>
    sidebarClicked
      ? 'hamburger-menu__bar sidebar-show'
      : sidebarActive
      ? 'hamburger-menu__bar'
      : 'hamburger-menu__bar hide'

  toggleSidebar = e => {
    if (!this.props.hamburger) return null

    if (this.state.sidebarActive && e.type === 'mouseenter') return null
    const header = document.getElementById('main-header')
    const container = document.getElementById('main-overlay')
    const mainWrapper = document.getElementById('main-wrapper')
    if (header) {
      if (this.state.sidebarActive) {
        // container.className = this.props.hamburger
        //   ? 'container-main overlay-with-filters'
        //   : 'container-main center'
        mainWrapper.className = this.props.hamburger
          ? 'container-main__wrapper wrapper-with-filters'
          : 'container-main__wrapper'
        header.className = ''
        this.setState({ activeHamburgerDropdown: false })
      } else if (e.type !== 'mouseleave') {
        // PUSH CONTENT EFFECT
        mainWrapper.className = this.props.hamburger
          ? 'container-main__wrapper wrapper--with-sidebar-and-filters wrapper-with-filters'
          : 'container-main__wrapper wrapper--with-sidebar'
        header.className = 'header--with-sidebar'
      }
    }
    this.setState({
      sidebarActive: e.type === 'mouseleave' ? false : !this.state.sidebarActive
    })
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

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside)

    this.setState({ sidebarActive: !this.props.hamburger })
  }

  componentDidUpdate() {
    if (this.state.mobileSidebarClicked) {
      document.body.style.overflowY = 'hidden'
      window.addEventListener('resize', this.updateDimensions)
      if (this.state.windowWidth >= 1200)
        return this.setState({
          mobileSidebarClicked: false,
          windowWidth: 0,
          sidebarActive: !this.props.hamburger
        })
      return !this.state.sidebarActive
        ? this.setState({ sidebarActive: true })
        : null
    } else {
      window.removeEventListener('resize', this.updateDimensions)
      return (document.body.style.overflowY = 'unset')
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside)
    window.removeEventListener('resize', this.updateDimensions)
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
    if (nextProps.hamburger !== this.props.hamburger) {
      this.setState({
        sidebarActive: !nextProps.hamburger
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

    return (
      <div>
        <div
          className={
            this.props.hamburger ? 'main-nav with-sidebar' : 'main-nav'
          }
        />

        <div
          className={
            this.state.mobileSidebarClicked
              ? 'hamburger-menu is-active'
              : 'hamburger-menu'
          }
        >
          <div
            className='mobile-container hamburger-container'
            onClick={e => this.showNavBar(e)}
          >
            <Hamburger classProp='mobile-hamburger' isMobile />
          </div>
          <div
            className={
              this.getClassName(
                this.state.sidebarActive,
                this.state.mobileSidebarClicked
              )
              // this.state.sidebarActive
              //   ? 'hamburger-menu__bar'
              //   : 'hamburger-menu__bar hide'
            }
            onMouseEnter={
              this.state.mobileSidebarClicked
                ? // || !this.props.hamburger
                  null
                : e => this.toggleSidebar(e)
            }
            onMouseLeave={
              this.state.mobileSidebarClicked
                ? // || !this.props.hamburger
                  null
                : e => this.toggleSidebar(e)
            }
          >
            <div className='hamburger-menu__items'>
              <ul>
                <li className='hamburger-lmenu__logo'>
                  <div className='hamburger-container'>
                    <Hamburger
                      classProp={
                        this.state.sidebarActive
                          ? 'icon-hamburger fade'
                          : 'icon-hamburger'
                      }
                    />
                  </div>
                  <img
                    className={
                      this.state.sidebarActive
                        ? 'logo'
                        : 'logo route-name__hide'
                    }
                    alt='Innential Logo'
                    src={require('$/static/innential-logo.svg')}
                  />
                </li>
                {this.state.appRoutes.map(({ path, name, Icon, tabs }, idx) => {
                  const active = this.props.location.pathname === path
                  return (
                    <div key={idx}>
                      <div
                        className={
                          active && tabs && this.state.sidebarActive
                            ? 'background-active'
                            : ''
                        }
                      />
                      <NavLink
                        className='hamburger-menu__route'
                        activeClassName='hamburger-menu__route--active'
                        exact
                        to={path}
                      >
                        <li
                          id={name}
                          key={idx}
                          index={`${idx + 1}`}
                          onClick={
                            this.state.mobileSidebarClicked
                              ? e => this.showNavBar(name, e)
                              : null
                          }
                        >
                          <Icon
                            style={{
                              position: 'absolute',
                              top: '22px',
                              stroke: active
                                ? variables.brandPrimary
                                : variables.desaturedBlue,
                              zIndex: '1',
                              background:
                                active && tabs && this.state.sidebarActive
                                  ? '#F9F8FC'
                                  : '#fff'
                            }}
                          />
                          <div
                            style={{ display: 'flex', flexDirection: 'column' }}
                          >
                            <div style={{ display: 'flex' }}>
                              <div
                                className={
                                  this.state.sidebarActive
                                    ? 'hamburger-menu__route-name'
                                    : 'hamburger-menu__route-name route-name__hide'
                                }
                                style={{ zIndex: active && tabs ? '1' : 0 }}
                              >
                                {name}
                              </div>
                              {(!tabs && active) ||
                              (tabs && active && !this.state.sidebarActive) ? (
                                <div
                                  className='color-border'
                                  style={
                                    !this.sidebarActive
                                      ? { position: 'absolute', right: '0' }
                                      : null
                                  }
                                />
                              ) : null}
                            </div>
                          </div>
                        </li>
                      </NavLink>
                      {tabs && (
                        <SubMenu
                          tabs={tabs}
                          path={path}
                          active={active}
                          sidebarActive={this.state.sidebarActive}
                          showNavBar={this.showNavBar}
                          mobileSidebarClicked={this.state.mobileSidebarClicked}
                        />
                      )}
                    </div>
                  )
                })}
              </ul>

              <div
                className='hamburger-menu__user'
                onClick={this.toggleHamburgerDropdown}
              >
                <div className='hamburger-menu__user-header'>
                  <img
                    src={
                      this.props.user.imageLink
                        ? this.props.user.imageLink
                        : generateInitialsAvatar(this.props.user)
                    }
                    alt='user'
                  />
                  <div
                    className={
                      this.state.sidebarActive
                        ? 'hamburger-menu__user-nav'
                        : 'hamburger-menu__user-nav route-name__hide'
                    }
                  >
                    <div className='hamburger-menu__user__name'>
                      {this.state.userName} <br />
                      <span>{this.state.userRole}</span>
                    </div>
                    <IconArrow
                      style={{ cursor: 'pointer' }}
                      className={
                        this.state.activeHamburgerDropdown ? null : 'open'
                      }
                    />
                    {/* <div
                      className={
                        this.state.activeHamburgerDropdown
                          ? 'el-icon-arrow-up'
                          : 'el-icon-arrow-down'
                      }
                      style={{ cursor: 'pointer', display: 'none' }}
                    /> */}
                  </div>
                </div>

                {this.state.activeHamburgerDropdown && (
                  <div className='hamburger-menu__user-links'>
                    <ul>
                      <li
                        className='user-menu-option'
                        onClick={e => {
                          e.preventDefault()
                          this.onLogout()
                        }}
                      >
                        <i className='icon icon-logout-2' />
                        Log out
                      </li>
                      <NavLink
                        className='hamburger-menu__route'
                        // activeClassName="hamburger-menu__route--active"
                        exact
                        to='/profile'
                        // style={{ color: 'white' }}
                      >
                        <li
                          className='user-menu-option'
                          // onClick={e => this.handleClick(e)}
                        >
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
                        <li
                          className='user-menu-option'
                          // onClick={e => this.toggleSidebar(e)}
                        >
                          <i className='icon icon-multiple' />
                          My Profile
                        </li>
                      </NavLink>
                      <NavLink
                        className='hamburger-menu__route'
                        // activeClassName="hamburger-menu__route--active"
                        exact
                        to='/feedback-page'
                      >
                        <li
                          className='user-menu-option'
                          // onClick={e => this.toggleSidebar(e)}
                        >
                          <i className='icon icon-exchange' />
                          Feedback
                        </li>
                      </NavLink>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div
            className='hamburger-menu__overlay'
            onClick={() => this.showNavBar()}
          >
            {/* <div className="hamburger-menu__close">
              <i className="icon icon-e-remove" />
            </div> */}
          </div>
        </div>

        <style jsx global>
          {newNavStyle}
        </style>
        {stylesIE}
      </div>
    )
  }
}

export default withRouter(props => {
  const { data, loading, error } = useQuery(fetchCurrentUserOrganizationTeams)

  // const {
  //   frameworkState: { visible }
  // } = Container.useContainer()
  if (!loading) {
    let team = data.fetchCurrentUserOrganization.teams[0]
    return (
      <NewNav
        {...props}
        team={team}
        // frameworkState={visible}
      />
    )
  } else if (loading) {
    return <Loading />
  }
})
