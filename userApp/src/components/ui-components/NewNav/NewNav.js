import React, { Component } from 'react'
import { Link, NavLink, withRouter } from 'react-router-dom'
import newNavStyle from '$/styles/newNavStyle'
import variables from '$/styles/variables'
import { generateInitialsAvatar } from '$/utils'
import Hamburger from '$/static/NewNav_assets/user-route-icons/HamburgerMenu'
import '$/styles/theme/menu.css'
import '$/styles/theme/submenu.css'
import history from '$/history'
import { ReviewRoutes, BaseRoutes, AdminRoutes } from './routes'
import { ReactComponent as IconArrow } from '$/static/arrow-small.svg'
import { ReactComponent as ShowMore } from '$/static/NewNav_assets/user-route-icons/more-horizontal.svg'
import { useQuery } from 'react-apollo'
import { fetchCurrentUserTeamsIds } from '../../../api'
import { captureFilteredError } from '../../general'

class NewNav extends Component {
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
        premium,
        corporate,
        fulfillment,
        hasEvent
      },
      team
    } = props

    const isAdmin = roles.indexOf('ADMIN') !== -1
    const hasTeam = team !== undefined

    // console.log(hasTeam)

    const reviewRoute = ReviewRoutes(leader)

    const baseRoutes = BaseRoutes({
      hasTeam,
      reviewRoute,
      isReviewer,
      leader,
      premium,
      corporate,
      fulfillment,
      hasEvent
    })

    const adminRoutes = AdminRoutes({
      hasTeam,
      premium,
      corporate,
      fulfillment,
      hasEvent
    })

    // if (!isAdmin && hasTeam) baseRoutes.push(teamRoute)
    // if ((!isAdmin && isReviewer) || leader) baseRoutes.push(reviewRoute)
    // baseRoutes.push(goalRoute)

    this.state = {
      userName: `${firstName} ${lastName}`,
      role: 'n/a',
      team,
      imageLink,
      mobileSidebarClicked: false,
      mobileRoutes: false,
      activeHamburgerDropdown: false,
      extendedRoutes: false,
      sidebarActive: false,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      expandSubMenu: '',
      appRoutes: isAdmin ? adminRoutes : baseRoutes
    }
  }

  timeout = null

  handleToggleHamburgerDropdown = () => {
    // console.log('click')
    this.setState({
      activeHamburgerDropdown: !this.state.activeHamburgerDropdown
    })
  }

  updateDimensions = () => {
    this.setState({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    })
  }

  showNavBar = (name, e) => {
    this.setState(
      prevState => ({
        mobileSidebarClicked: !prevState.mobileSidebarClicked,
        mobileRoutes: prevState.mobileRoutes || !prevState.mobileSidebarClicked,
        sidebarActive: !prevState.sidebarActive,
        activeHamburgerDropdown: prevState.activeHamburgerDropdown
          ? false
          : prevState.activeHamburgerDropdown
      }),
      () => {
        if (!this.state.mobileSidebarClicked && this.state.mobileRoutes) {
          this.timeout = setTimeout(
            () => this.setState({ mobileRoutes: false }),
            320
          )
        }
      }
    )
  }

  windowResize = () =>
    this.setState({
      mobileSidebarClicked: false,
      mobileRoutes: false,
      windowWidth: 0,
      sidebarActive: false,
      activeHamburgerDropdown: false
    })

  activateSidebar = () => this.setState({ sidebarActive: true })

  getClassName = (sidebarActive, sidebarClicked) =>
    // 'hamburger-menu__bar'
    sidebarClicked
      ? 'hamburger-menu__bar sidebar-show'
      : sidebarActive
      ? 'hamburger-menu__bar'
      : 'hamburger-menu__bar hide'

  // toggleSidebar = e => {
  //   e.persist()
  //   const { hamburger } = this.props
  //   const { pathname } = this.props.location
  //   const { sidebarActive } = this.state

  //   if (!hamburger && pathname !== '/profile') return null
  //   if (sidebarActive && e.type === 'mouseenter') return null

  //   const header = document.getElementById('main-header')
  //   // const container = document.getElementById('main-overlay')
  //   const mainWrapper = document.getElementById('main-wrapper')
  //   if (header) {
  //     if (sidebarActive) {
  //       // container.className = this.props.hamburger
  //       //   ? 'container-main overlay-with-filters'
  //       //   : 'container-main center'
  //       mainWrapper.className =
  //         // hamburger ? "container-main__wrapper wrapper-with-filters":
  //         'container-main__wrapper'
  //       header.className = ''
  //       this.setState({ activeHamburgerDropdown: false })
  //     } else if (e.type !== 'mouseleave') {
  //       // PUSH CONTENT EFFECT
  //       mainWrapper.className = hamburger
  //         ? 'container-main__wrapper wrapper--with-sidebar-and-filters'
  //         : 'container-main__wrapper wrapper--with-sidebar'
  //       header.className = 'header--with-sidebar'
  //     }
  //   }

  //   return this.setState({ sidebarActive: e.type !== 'mouseleave' })
  // }

  handleClickOutside = e => {
    if (
      this.wrapperRef &&
      !this.wrapperRef.contains(e.target) &&
      this.state.activeDropdown
    ) {
      this.setState({ activeDropdown: false })
    }
  }

  handleLinkClick = path => {
    this.setState({
      activeHamburgerDropdown: false
    })

    if (path === '/library') {
      this.props.setLibraryHighlight(false)
    }

    return this.state.mobileSidebarClicked ? this.showNavBar() : null
  }

  // checkAgain = () => {
  //   setTimeout(() => {
  //     this.setState({ sidebarActive: !this.props.hamburger })
  //   }, 500)
  // }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside)
    window.addEventListener('resize', this.updateDimensions)

    // this.setState({ sidebarActive: !this.props.hamburger })
  }

  componentDidUpdate() {
    if (this.state.mobileSidebarClicked) {
      document.body.style.overflowY = 'hidden'
      // window.addEventListener('resize', this.updateDimensions)
      if (this.state.windowWidth >= 1200) {
        return this.windowResize()
      }

      return !this.state.sidebarActive ? this.activateSidebar() : null
    } else {
      // window.removeEventListener('resize', this.updateDimensions)
      return (document.body.style.overflowY = 'unset')
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside)
    window.removeEventListener('resize', this.updateDimensions)
    clearTimeout(this.timeout)
  }

  // componentWillReceiveProps(nextProps) {
  //   const { pathname } = this.props.location
  //   const { hamburger } = this.props

  //   if (
  //     `${nextProps.user.firstName} ${nextProps.user.lastName}` !==
  //     this.state.userName
  //   ) {
  //     this.setState({
  //       userName: `${nextProps.user.firstName} ${nextProps.user.lastName}`
  //     })
  //   }
  //   if (nextProps.hamburger !== hamburger && pathname !== '/learning/feed') {
  //     if (window.innerWidth <= 1200) return null
  //     else {
  //       this.setState({ memoryHamburger: nextProps.hamburger })
  //       !nextProps.hamburger
  //         ? setTimeout(() => {
  //             !this.state.memoryHamburger &&
  //               this.setState({ sidebarActive: !nextProps.hamburger })
  //           }, 1500)
  //         : this.setState({ sidebarActive: false }, this.checkAgain())
  //     }
  //   }

  // if (nextProps.location.pathname !== pathname) {
  //   console.log("nextpath: ", nextProps.pathname, " pathname: ", pathname);
  //   this.setState({
  //     expandSubMenu: "",
  //     // sidebarActive: nextProps.location.pathname !== "/profile",
  //   });
  // }
  // }

  onLogout = () => {
    history.push('/logout')
  }

  toggleRoutePaginate = () => {
    this.setState({ extendedRoutes: !this.state.extendedRoutes })
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
    const userMenuStyle = {
      fontSize: this.state.mobileSidebarClicked ? '12px' : '10px',
      whiteSpace: this.state.mobileSidebarClicked ? 'nowrap' : 'normal'
    }

    const userIconStyle = {
      fontSize: this.state.mobileSidebarClicked ? '20px' : '15px'
    }

    const hiddenRoutes =
      this.state.windowHeight - 800 >= 0 || this.state.appRoutes.length < 6
        ? 0
        : Math.max(
            8 -
              Math.ceil((800 - this.state.windowHeight + 1) / 60) -
              this.state.appRoutes.length,
            4 - this.state.appRoutes.length
          )

    const limitRoutes = hiddenRoutes >= -1 ? undefined : hiddenRoutes
    // const isMobile = () => {
    //   let check = false
    //   ;(a => {
    //     if (
    //       /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
    //         a
    //       ) ||
    //       /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
    //         a.substr(0, 4)
    //       )
    //     )
    //       check = true
    //   })(navigator.userAgent || navigator.vendor || window.opera)
    //   return check
    // }
    const isMobile = () => {
      return (
        'ontouchstart' in document.documentElement &&
        window.matchMedia('(pointer:coarse)').matches
      )
    }

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
          <div className='logo-mobile-whole-container'>
            <div
              className='mobile-container hamburger-container'
              onClick={e => this.showNavBar(e)}
            >
              <Hamburger classProp='mobile-hamburger' />
            </div>
          </div>

          <div
            className={
              this.state.sidebarActive && this.state.mobileSidebarClicked
                ? 'hamburger-menu__bar menu-mobile'
                : 'hamburger-menu__bar'
            }

            // onMouseEnter={
            //   this.state.mobileSidebarClicked ||
            //   !this.props.hamburger ||
            //   this.props.location.pathname === '/profile'
            //     ? null
            //     : e => this.toggleSidebar(e)
            // }
            // onMouseLeave={
            //   this.state.mobileSidebarClicked || !this.props.hamburger
            //     ? null
            //     : e => this.toggleSidebar(e)
            // }
          >
            <div
              className='hamburger-menu__items'
              style={{ height: `${isMobile() ? '96%' : ''}` }}
            >
              <ul>
                <li className='hamburger-lmenu__logo'>
                  <div className='logo-top__container'>
                    <Link to='/?learner=true'>
                      <img
                        className='logo-top__sidebar'
                        alt='Innential Logo'
                        src={require('$/static/innential-logo.svg')}
                      />
                      {/* <Hamburger
                      ClassName='icon-hamburger'
                      // classProp={
                      //   this.state.sidebarActive
                      //     ? 'icon-hamburger fade'
                      //     : 'icon-hamburger'
                      // }
                     /> */}
                    </Link>
                  </div>
                  {/* <img
                    className={
                      this.state.sidebarActive
                        ? 'logo'
                        : 'logo route-name__hide'
                    }
                    alt='Innential Logo'
                    src={require('$/static/innential-logo.svg')}
                  /> */}
                </li>
                {limitRoutes && this.state.extendedRoutes && (
                  <li
                    className='hamburger-menu__line hamburger-menu__line--hover'
                    onClick={this.toggleRoutePaginate}
                  >
                    <div>
                      <ShowMore
                        style={{
                          stroke: variables.darkBlueTwo,
                          height: '20px',
                          cursor: 'pointer'
                        }}
                      />
                    </div>
                  </li>
                )}
                {this.state.appRoutes
                  .slice(
                    ...(this.state.extendedRoutes
                      ? [limitRoutes, undefined]
                      : [0, limitRoutes])
                  )
                  .map(({ path, name, Icon, tabs }, idx) => {
                    const { mobileRoutes } = this.state
                    const active =
                      this.props.location.pathname.split('/')[1] ===
                      path.split('/')[1]
                    const displayDot =
                      (path === '/library' && this.props.libraryHighlight) ||
                      (path === '/feedback-page' &&
                        this.props.user?.pendingFeedbackRequests > 0)

                    return (
                      <NavLink
                        key={idx}
                        className={
                          active
                            ? 'hamburger-menu__route--active'
                            : 'hamburger-menu__route'
                        }
                        exact
                        to={path}
                        onClick={e => this.handleLinkClick(path)}
                      >
                        {!active && displayDot && (
                          <div className='notification--red-dot' />
                        )}
                        <li
                          id={name}
                          key={idx}
                          index={`${idx + 1}`}
                          className={
                            mobileRoutes
                              ? 'hamburger-menu__line line--mobile'
                              : 'hamburger-menu__line'
                          }
                        >
                          <Icon
                            style={{
                              stroke: active
                                ? variables.brandPrimary
                                : variables.darkBlueTwo,
                              height: '20px',
                              cursor: 'pointer'
                            }}
                          />

                          <div
                            className='hamburger-menu__route-name'

                            // style={{
                            //   zIndex: active && tabs ? '1' : 0
                            // }}
                          >
                            {name}
                          </div>
                        </li>
                      </NavLink>
                    )
                  })}
                {limitRoutes && !this.state.extendedRoutes && (
                  <li
                    className='hamburger-menu__line hamburger-menu__line--hover'
                    onClick={this.toggleRoutePaginate}
                  >
                    <div>
                      <ShowMore
                        style={{
                          stroke: variables.darkBlueTwo,
                          height: '20px',
                          cursor: 'pointer'
                        }}
                      />
                    </div>
                  </li>
                )}
              </ul>

              <div
                className={
                  this.state.mobileSidebarClicked
                    ? 'hamburger-menu__user menu_user--mobile'
                    : 'hamburger-menu__user'
                }
                onClick={this.handleToggleHamburgerDropdown}
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
                    className='hamburger-menu__user-nav'
                    // : 'hamburger-menu__user-nav route-name__hide'
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
                    <div
                      className={
                        this.state.activeHamburgerDropdown
                          ? 'el-icon-arrow-up'
                          : 'el-icon-arrow-down'
                      }
                      style={{ cursor: 'pointer', display: 'none' }}
                    />
                  </div>
                </div>

                {this.state.activeHamburgerDropdown && (
                  <div className='hamburger-menu__user-links'>
                    <ul>
                      <a className='hamburger-menu__route' href='#'>
                        <li
                          className='user-menu-option'
                          onClick={e => {
                            e.preventDefault()
                            this.onLogout()
                          }}
                          style={userMenuStyle}
                        >
                          <i
                            className='icon icon-logout-2'
                            style={userIconStyle}
                          />
                          Log out
                        </li>
                      </a>
                      <NavLink
                        className='hamburger-menu__route'
                        // activeClassName="hamburger-menu__route--active"
                        exact
                        to='/profile'
                        // style={{ color: 'white' }}
                      >
                        <li
                          className='user-menu-option'
                          onClick={e => this.handleLinkClick(e)}
                          style={userMenuStyle}
                        >
                          <i
                            className='icon icon-settings-tool-66'
                            style={userIconStyle}
                          />
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
                          onClick={e => this.handleLinkClick(e)}
                          style={userMenuStyle}
                        >
                          <i
                            className='icon icon-multiple'
                            style={userIconStyle}
                          />
                          My Profile
                        </li>
                      </NavLink>
                      {/* {premium && (
                        <NavLink
                          className='hamburger-menu__route'
                          // activeClassName="hamburger-menu__route--active"
                          exact
                          to='/feedback-page'
                        >
                          <li
                            className='user-menu-option'
                            onClick={e => this.handleLinkClick(e)}
                            style={userMenuStyle}
                            // onClick={e => this.toggleSidebar(e)}
                          >
                            <i
                              className='icon icon-exchange'
                              style={userIconStyle}
                            />
                            Feedback
                          </li>
                        </NavLink>
                      )} */}
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
  const { data, loading, error } = useQuery(fetchCurrentUserTeamsIds)

  if (!loading) {
    if (error) {
      captureFilteredError(error)
    }

    let team = data?.fetchCurrentUserTeams[0]
    return (
      <NewNav
        {...props}
        team={team}
        // frameworkState={visible}
      />
    )
  }
  return null
})
