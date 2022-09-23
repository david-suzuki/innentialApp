import css from 'styled-jsx/css'
import variables from './variables'

export const newNavStyle = css.global`
  /* .main-nav {
    display:none;
    position: relative;
    min-width: 350px;
    max-width: 420px;
    height: 60px;
    margin: 0 auto;
    text-align: center;
    padding: 0 20px;
    background-color: white;
  }

  .main-nav-menu__user {
    display: none;
  } */

  /* @media ${variables.lg} {
    .main-nav {
      background-color: white;
    }
    .main-nav {
      position: fixed;
      display: none;
      flex-direction: column;
      min-width: 230px;
      height: 100vh;
      padding: 0;
    }
    .main-nav .el-menu-item a {
      line-height: 25px;
    }
    .main-nav .main-nav-menu__user {
      width: 100%;
      display: block;
      position: absolute;
      bottom: 0;
      border-top: 1px solid #D9E1EE;
      padding: 25px 10px 0;
      background-color: white;
    }
    .main-nav-menu__user__user-header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }
    .main-nav-menu__user__user-header img {
      width: 38px;
      margin-right: 10px;
      border-radius: 50%;
    }
    .main-nav-menu__links li {
      padding: 10px 0;
    }
  }

  @media ${variables.lg} {
    .main-nav.with-sidebar {
      min-width: 90px;
    }
    .main-nav.with-sidebar .logo {
      display: none;
    }
    .main-nav.with-sidebar .hamburger.second {
      display: block;
    }
    .main-nav.with-sidebar .hamburger.second .icon {
      font-size: 16px;
      left: 36px;
    }
    .main-nav.with-sidebar .main-nav-menu__user-with-sidebar {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 20px 0;
      cursor: pointer;
      border-top: 1px solid #D9E1EE;
    }
    .main-nav.with-sidebar .main-nav-menu__user-with-sidebar img {
      width: 38px;
      height: 38px;
      display: block;
      margin: 0 auto;
      border-radius: 50%;
    }
  }

  .main-nav-menu__user-with-sidebar img {
    display: none;
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

  .logo {
    transition: transform 500ms ease-in-out, opacity 400ms ease-in-out;
  }
  @media ${variables.lg} {
    .main-nav .logo {
      // width: 81px;
      // margin-top: 0;
      // transform: translateX(-130px);
      margin-bottom: 30px;
    }
  } */

  // ----------------------
  // USER PANEL

  /* .main-nav__items,
  .main-nav__user-panel {
    display: none;
  }
  @media ${variables.lg} {
    .main-nav .main-nav__items {
      display: block;
      margin-top: 40px;
    }
    .main-nav__user-panel {
      display: flex;
      position: relative;
      cursor: pointer;
    }
    .el-menu {
      display: flex;
      flex-direction: column;
    }
    .main-nav .el-menu-item:not(:first-child) {
      margin-left: 0;
    }
  }

  .main-nav__item a.active {
    border-right: 2px solid ${variables.brandPrimary};
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
    left: 88px;
    bottom: 70px;
    color: ${variables.darkRed};
    background-color: ${variables.lightRed};
    font-size: 10px;
    line-height: 16px;
    font-weight: 800;
  } */

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
    /* .main-nav .hamburger {
      display: none;
    } */
    /* .mobile-hamburger {
      display: none;
    } */
     .hide {
     transform:translateX(0px) !important;
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
    background-color: white;
    box-sizing: border-box;
    height: 100%;
    width: 100px;
    max-width: 80vw;
    transform: translate(-300px);
    top: 0;
    bottom: 0;
    transition: width 400ms ease-in-out, transform 400ms ease-in-out;
    box-shadow: 0 0 20px 1px rgba(0, 0, 0, 0.05);
  }

  @media ${variables.lg} {
    transform:translate(100px)
  }


a.hamburger-menu__route {
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
   color: ${variables.darkBlueTwo};
    height:70px;
    padding: 7px
}

.notification--red-dot {
    width: 8px;
    height: 8px;
    background-color: ${variables.fadedRed};
    border-radius: 8px;
    position: absolute;
    right: 7px;
    top: 7px;
}



  .hamburger-menu__route-name {
    /* height: 66px;           */
    font-size: 10px;
    color: ${variables.darkBlueTwo};
    display: flex;
    justify-content:center;   
    transition: all 400ms ease-in-out;
    cursor: pointer;
    width: 100%;
    white-space: nowrap;
    z-index:1;
  }

  .logo {
    opacity: 0;
    transform: translateX(0px);
  }

  .mobile-container {
    cursor: pointer; 
    
    

  }

  /* .mobile-hamburger {
    stroke: #fff
  } */

  .logo-mobile-whole-container {
    position: absolute;
    transform: translateX(20px);
    transition: transform 0.3s ease-in-out;
    margin-top: 18px;
  }

  .logo-mobile {
    position: absolute;
    left: 70px;
    top: 27px;
    width: 98px;
    z-index: 0;
    opacity: 1;
    transition: transform 0.3s ease-in-out, opacity 0.2s ease;
     }

     @media screen and (min-width: 990px){
       .logo-mobile {
        transform: translate(-45px, 55px);
       }
     
     }

     /* @media screen and (min-width: 1024px) {
       .logo-mobile-whole-container {
         transform: translate(0, 18px);
       }
       .logo-mobile {
        transform: translate(5px, 0px);
       }
     
     } */
  
     @media ${variables.lg}{
       .logo-mobile{
        transform: translateX(-100px);
        opacity: 0;
       }
     }

  .hamburger-container {
    display: flex;
    justify-content: center;
    left: 32px;
    align-items: center;
    border-radius: 50%;
    z-index: 1;
  }

  .hamburger-container > svg {
    stroke: ${variables.brandPrimary};
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

  /* .hamburger-lmenu__logo {
    align-items: baseline !important;
    padding: 27px 0 22px 38px;
    margin-bottom: 10px;
  } */

  /* .hamburger-lmenu__logo img{
    position: relative;
    opacity: 1;
    left: 45px;
    width: 97.34px;
    height: 18.68px;
    margin-top: 28px;
    margin-bottom: 18px;
    transition: transform 500ms ease-in-out, opacity 400ms ease-in;
  } */

  .hamburger-menu__items {
    position: relative;
    height: 100%;
    background-color: ${variables.white};
    color: ${variables.darkBlueTwo};
  }

  .hamburger-menu__line {
    display: flex; 
    flex-direction: column;
  }

  .hamburger-menu__line--hover {
    padding: 7px;
  }

  .hamburger-menu__line--hover:hover {
    opacity: 0.7;
    background-color: ${variables.brandBackground};
  }

  .line--mobile {
    flex-direction:row !important;
    padding: 20px 20px 20px 46px!important;
    width: 100%;
  }

  .line--mobile div.hamburger-menu__route-name  {
    font-size: 16px;
    justify-content: flex-start;
    padding-left: 24px;
  }

  .hamburger-menu__items .hamburger-menu__user {
    width: 100%;
    position: absolute;
    bottom: 0;
    /* border-bottom: 1px solid rgba(255, 255, 255, 0.15); */
    font-size: 14px;
    margin-bottom: 15px !important;
    align-items: center;
    /* border-top: 1px solid #D9E1EE; */
    padding-top: 15px;
    background-color: ${variables.white};
    z-index: 2;
  }

  .menu_user--mobile {
    /* width: 138px !important;
    margin-left: 50px; */
  }

.menu_user--mobile li.user-menu-option {
  flex-direction:row !important;
    width: 77%;
   padding: 12px;

}

.menu_user--mobile i {
  padding-right: 24px;
}

.menu_user--mobile a.hamburger-menu__route {
  width: 77%;
  margin: 0 auto 0 12px;
}

.menu_user--mobile ul > li {
  /* margin: 0 auto 0 12px;
    width: 57% !important; */
}

  .hamburger-menu__items .hamburger-menu__user img {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border: 2px solid ${variables.darkBlueTwo};
    /* margin-right: 12px; */
    z-index:1;
  }

  .hamburger-menu__user__name {
    display: none;
    font-size: 14px;
    line-height: 22px;
    color: ${variables.white};
    white-space: nowrap;
    
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

a.hamburger-menu__route-name-dropdown {
    color: ${variables.darkBlueTwo};
    width:100%;
    height: 100%;
    z-index:1;
  }
  a.hamburger-menu__route > li {
    position: relative;
    /* padding: 22px 0 22px 38px; */
    cursor: default;
    padding: 10px;
    /* width: 105%;
    transform:translateX(-5%); */
  }
  a.hamburger-menu__route > li:focus {
    background-color: ${variables.brandBackground};
    outline: none;
  }
  div.hamburger-menu__route > li {
    cursor: default;
  }
   li.user-menu-option {
   padding: 12px;
  
  }
a.hamburger-menu__route--active {
  display: flex;
  padding: 7px;
  height: 70px;
  align-items: center;
  
}
a.hamburger-menu__route--active li {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 70px;
    justify-content: center;
    padding: 10px;
    border-radius: 4px;
    background-color: ${variables.brandBackground}
}
 
  a.hamburger-menu__route--active li div.hamburger-menu__route-name {
    color: ${variables.brandPrimary}

  }

  .hamburger-menu__items li {
    cursor: pointer;
    /* padding: 22px 0 22px 38px; */
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: ${variables.white};
  }

  .hamburger-menu__items li:focus {
    background-color: ${variables.brandBackground};
  }
  .hamburger-menu__items li:focus svg {
    background-color: ${variables.brandBackground} !important;
  }

  .hamburger-menu__items li.user-menu-option {
    justify-content: normal;
    flex-direction: column;
    align-items: center;
    text-align: center;
    cursor:pointer;
  }

  .hamburger-menu__items li div.color-border{
    display:flex;
    height  : 22px;
    width   : min-content;
    border-right:2px solid ${variables.brandPrimary};
    transition: all 0.8s ease-in-out;
    
    
  }



  .hamburger-menu__items li,
  .hamburger-menu__items li .icon {
    /* opacity: 0.8; */
    font-weight: 400;
    font-size: 12px;
    line-height: 22px;
  }

  .hamburger-menu__items li .icon {
    font-size: 15px;
    /* margin-right: 10px; */
  }

  .hamburger-menu__items li,
  .hamburger-menu__items li .icon {
    opacity: 1;
    background: transparent;
  }

  // .hamburger-menu__items li:focus {
  //   border-left: 1px solid white;
  //   padding-left: 29px;
  // }

  .icon-hamburger {
    top: 48.17px;
    transition: all 400ms ease-in-out;
  }

  .route-name__hide{
    opacity:0;
    transform: translateX(-310px)
  }

  .fade{
    opacity:0
  }

  .menu-mobile {
    width: 276px;
    transform:translateX(0)
  }

  .menu-mobile img.logo-top__sidebar {
    width: 95px;
  }

  @media ${variables.lg} {
    .menu-mobile{
       width: 100px;
    }
   
  }

  .hide a.sub-menu-link {
    transform: translateX(-170px) 
  } 

  .hide div.active-border {
    height: 0px;
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

  /* .hamburger-menu.is-active .hamburger-menu__bar {
    left: 0;
  } */
  .mobile-sidebar{
    left: -276px;
  }

  .sidebar-show{
    transform: translateX(0px);
  }

  .background-inactive {
    position: absolute;
    width: 0%;
    transition: all 0.3s ease-in-out;
    background-color: ${variables.brandBackground};
    height: 66px;
    z-index: 1;

  }

  /* .bg--active {
   
    
    width: 100%;
   
  } */

  .hamburger-menu.is-active .hamburger-menu__overlay {
    display:block;
    background: #3B4B66;
    opacity: .8;
  }

 
  @media ${variables.lg} {
    .mobile-sidebar{
    left: 0;
  }
    /* .main-nav .hamburger-menu.is-active .hamburger-menu__bar {
      left: -310px;
    } */

    .hamburger-menu__bar {
      transform: translateX(0px);
    }
    .hamburger-menu.is-active .hamburger-menu__overlay {
      display: none
    }
  }

  .el-menu-item {
    padding: 0;
  }

  .el-menu-item > a {
    // height: 60px;
    // padding: 0 0 80px 0;
    display: block;
  }

  .hamburger-menu__user-header {
    display: flex;
    align-items: center;
    justify-content:center;
    flex-basis: 100%;
    margin-bottom: 12px;
  }

  .hamburger-menu__user-nav {
    display: flex;
    /* flex: 1; */
    justify-content: space-between;
    align-items: center;
    transition: all 400ms ease-in-out;
  }

  .hamburger-menu__user-links > ul > li.user-menu-option {
    justify-content:center
  }
  .hamburger-menu__user-nav svg {
    position: absolute;
    transform: rotate(-90deg) translateY(12px);
    transition: 0.2s transform ease-in-out;
  }

  .hamburger-menu__user-nav svg.open {
    transform: rotate(90deg) translateY(-12px);
  }

  //SUBMENU
  div.sub-menu {
    position: relative;
    font-size: 12px;
    color: ${variables.desaturatedBlue};
    white-space: nowrap;
    will-change: transform, visibility;
    /* opacity: 0; */
    /* padding: 0 0 0 47px; */
    /* height: 0; */
    /* transition: all 0.5s ease-in-out; */
    /* transform: translateX(-310px); */
  }

  /* div.sub-menu ul li {
    padding: 0;
    height:0;
    transition: all 0.3s ease-in-out;
  } */
   .sub-menu-link {
    width: 100%;
    font-size: 12px;
    color: ${variables.desaturatedBlue};
    white-space: nowrap;
    transition: all 0.35s ease-in-out;
    text-align:left;
    will-change:transform;
  }

  /* .link-hide {
    z-index: -10
  } */

  .sub-menu > ul li{
     background-color: transparent;
     height: 44px;
     cursor: default;
     position: relative;
  }

  .sub-menu-link--active {
    color: ${variables.brandPrimary} !important;
    font-size: 12px;
   }
   .sub-menu-link--active + div.active-border {
    display:flex;
    position: absolute;
    right: 0;
    top: 40%;
    height  : 12px;
    /* width   : 50%; */
    border-right:2px solid ${variables.brandPrimary};
    opacity: 1;
    
   }

   div.active-border {
     opacity: 0;
     transition: opacity 0.3s ease-in-out;
     will-change:height;
   }

   .logo-top__container {
     display: flex;
     width: 100%;
     height: 110px;
     justify-content: center;
     align-items: center;
   }

   .logo-top__sidebar {
    
     width: 66px;
   }

`
export default newNavStyle
