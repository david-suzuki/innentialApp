import css from 'styled-jsx/css'
import variables from './variables'

export const mainNavStyle = css.global`
  .main-nav {
    position: relative;
    min-width: 350px;
    max-width: 420px;
    height: 60px;
    margin: 0 auto;
    text-align: center;
    padding: 0 20px;
  }
  @media ${variables.lg} {
    .main-nav {
      width: 100%;
      height: 80px;
      max-width: 1400px;
      display: grid;
      grid-template-columns: 2fr 4fr 2fr;
      grid-template-rows: auto;
      justify-items: center;
      align-items: center;
      padding-bottom: 0;
    }
  }

  .main-nav .el-menu-item {
    padding: 0 !important;
  }

  .main-nav .el-menu-item:not(:first-child) {
    margin-left: 24px;
  }

  .main-nav .el-menu-item > a {
    color: ${variables.blueGrey} !important;
  }

  .main-nav .logo {
    width: 95px;
    margin-top: 20px;
    justify-self: start;
    transition: transform 500ms, filter 500ms;
    cursor: pointer;
  }
  @media ${variables.lg} {
    .main-nav .logo {
      width: 81px;
      margin-top: 0;
      transform: translateX(-130px);
    }
  }

  // ----------------------
  // USER PANEL

  .main-nav__items,
  .main-nav__user-panel {
    display: none;
  }
  @media ${variables.lg} {
    .main-nav__items,
    .main-nav__user-panel {
      display: flex;
      position: relative;
      cursor: pointer;
    }
  }

  .main-nav__item {
    border: none;
  }

  .main-nav__item a.active {
    border-bottom: 2px solid ${variables.brandPrimary};
  }

  .main-nav__user-panel {
    position: relative;
  }

  .main-nav__user-panel__name-wrapper {
    display: flex;
    align-items: center;
    padding: 0 10px;
  }

  .main-nav__user-panel__name-wrapper .main-nav__user-panel__name {
    padding: 0 10px;
    color: ${variables.darkNavyBlue};
    font-size: 14px;
    line-height: 1.43;
  }

  .main-nav__user-panel__data-wrapper,
  .main-nav__user-panel__department {
    font-size: 12px;
    text-align: left;
    color: ${variables.warmGrey};
    font-weight: 400;
  }

  .main-nav__user-panel__data-wrapper {
    display: flex;
  }

  .main-nav__user-panel__department span {
    color: ${variables.black};
    font-weight: 700;
  }

  .main-nav__user-panel__data-wrapper span {
    color: ${variables.black};
    font-size: 15px;
    font-weight: 800;
  }

  .main-nav__user-panel__data-wrapper div {
    padding-right: 15px;
  }

  .main-nav__user-panel .el-icon-arrow-down {
    font-size: 12px;
    transition: all 400ms;
  }

  .main-nav__user-panel .el-icon-arrow-down--reverse {
    transform: rotate(-180deg);
  }

  .main-nav__user-panel__letter {
    width: 22px;
    height: 22px;
    font-family: Montserrat;
    font-size: 14px;
    font-weight: 600;
    font-style: normal;
    font-stretch: normal;
    color: ${variables.white};
    background-color: ${variables.brandSecondary};
    border-radius: 50%;
    padding: 2px;
    position: relative;
    text-transform: capitalize;
  }
  .main-nav__user-panel__letter:after {
    content: '';
    width: 28px;
    height: 28px;
    opacity: 0.2;
    left: -3.3px;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    z-index: -1;
    border-radius: 50%;
    position: absolute;
    background-color: ${variables.brandSecondary};
  }

  .main-nav__user-panel__image {
    width: 35px;
    height: 35px;
    color: ${variables.white};
    border-radius: 50%;
    padding: 2px;
    position: relative;
  }
  .main-nav__user-image:after {
    content: '';
    width: 28px;
    height: 28px;
    opacity: 0.2;
    left: -3.3px;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    z-index: -1;
    border-radius: 50%;
    position: absolute;
  }

  .main-nav__user-panel .main-nav__user-panel__dropdown {
    position: absolute;
    background-color: transparent;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    min-width: 150px;
    visibility: hidden;
    opacity: 0;
    transition: all 400ms;
  }

  .main-nav__user-panel .main-nav__user-panel__dropdown ul {
    padding: 60px 15px 40px 15px;
  }

  .main-nav__user-panel .main-nav__user-panel__dropdown ul li {
    list-style: none;
    padding: 10px 10px 0 10px;
  }

  .main-nav__user-panel .main-nav__user-panel__dropdown ul li a {
    color: ${variables.darkNavyBlue};
    font-size: 14px;
    line-height: 1.3;
    display: inline-block;
  }

  .main-nav__new-label {
    position: absolute;
    border-radius: 2px;
    z-index: 100;
    left: 35px;
    top: 15px;
    color: ${variables.darkRed};
    background-color: ${variables.lightRed};
    font-size: 10px;
    line-height: 16px;
    font-weight: 800;
  }

  // -----------------
  //HAMBURGER MENU

  .hamburger .icon {
    position: absolute;
    left: 15px;
    top: 20px;
    font-size: 20px;
    color: ${variables.brandPrimary};
    cursor: pointer;
  }
  @media ${variables.lg} {
    .hamburger {
      display: none;
    }
  }

  .hamburger-menu {
    position: fixed;
    width: 0;
    height: 100%;
    min-height: 100vh;
    top: 0;
    left: 0;
    z-index: 30;
  }

  .hamburger-menu__bar {
    position: relative;
    z-index: 11;
    background-color: ${variables.brandPrimary};
    box-sizing: border-box;
    height: 100%;
    width: 310px;
    max-width: 80vw;
    left: -310px;
    top: 0;
    bottom: 0;
    transition: left 400ms ease-in-out;
    box-shadow: 0 0 20px 1px rgba(0, 0, 0, 0.05);
  }

  .hamburger-menu__overlay {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    opacity: 0;
    transition: opacity 400ms ease-in-out;
  }

  .hamburger-menu__close {
    position: absolute;
    right: 18px;
    top: 25px;
    cursor: pointer;
    font-size: 14px;
    color: ${variables.brandPrimary};
  }

  .hamburger-menu__items {
    background-color: ${variables.brandPrimary};
    color: ${variables.white};
  }

  .hamburger-menu__items .hamburger-menu__user {
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    font-size: 14px;
    padding: 50px 0 20px 0;
    margin-bottom: 20px
    align-items: center;
  }

  .hamburger-menu__items .hamburger-menu__user img {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border: 2px solid ${variables.white};
    margin-right: 12px;
  }

  .hamburger-menu__items .hamburger-menu__user__name span {
    opacity: 0.5;
    font-size: 12px;
  }

  .hamburger-menu__items .hamburger-menu__user .el-icon-arrow-right {
    opacity: 0.8;
    font-size: 12px;
    margin-left: auto;
  }

  .hamburger-menu__route {
    color: ${variables.white};
  }

  .hamburger-menu__route--active li {
    border-left: 1px solid white;
    padding-left: 29px;
  }

  .hamburger-menu__items li {
    cursor: pointer;
    padding: 15px 0 10px 30px;
    display: flex;
    align-items: center;
  }

  .hamburger-menu__items li,
  .hamburger-menu__items li .icon {
    opacity: 0.7;
    font-weight: 300;
    font-size: 13px;
  }

  .hamburger-menu__items li .icon {
    font-size: 15px;
    margin-right: 12px;
  }

  .hamburger-menu__items li:hover,
  .hamburger-menu__items li:hover .icon {
    opacity: 1;
    background: transparent;
  }

  .hamburger-menu__items li:hover,
  .hamburger-menu__items li:focus {
    border-left: 1px solid white;
    padding-left: 29px;
  }

  // States
  // --------------------------------------------------
  .main-nav__user-panel__dropdown.is-active {
    visibility: visible;
    opacity: 1;
  }

  .hamburger-menu.is-active {
    width: 100%;
  }

  .hamburger-menu.is-active .hamburger-menu__bar {
    left: 0;
  }

  .hamburger-menu.is-active .hamburger-menu__overlay {
    opacity: 1;
  }
  @media ${variables.lg} {
    .hamburger-menu.is-active .hamburger-menu__bar {
      left: -310px;
    }
    .hamburger-menu.is-active .hamburger-menu__overlay {
      opacity: 0;
    }
  }

  .el-menu-item {
    padding: 0;
  }

  .el-menu-item > a {
    height: 60px;
    padding: 0 0 80px 0;
    display: block;
  }

  .hamburger-menu__user-header {
    display: flex;
    align-items: center;
    flex-basis: 100%;
    margin: 0 20px;
  }

  .hamburger-menu__user-nav {
    display: flex;
    flex: 1;
    justify-content: space-between;
  }
`
export default mainNavStyle
