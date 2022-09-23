import css from 'styled-jsx/css'
import variables from './variables'

const globalStyle = css.global`
  *,
  *::after,
  *::before {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    background-color: ${variables.white}
  }

  .app-container {
    position: relative;
    overflow-x: visible;
    text-align: center;
    background-color: ${variables.whiteSeven};
  }
  .app-container.dashboard-wrapper {
    display: block;
  }

   @media ${variables.lg} {
    .app-container.dashboard-wrapper {
      display: flex;
  }
  }

  header {
    width: 100%;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.05);
  }
  .link-button {
    font-size: 12px;
    color: ${variables.linkColor};
    cursor: pointer;
  }
  .link-button:hover {
    opacity: 0.7;
  }
  a {
    color: ${variables.linkColor};
    text-decoration: none;
  }
  a:hover {
    opacity: 0.7;
    cursor: pointer;
  }
  h4 {
    font-size: 13px;
    font-weight: 500;
  }
  .align-left {
    text-align: left !important;
  }
  .align-right {
    text-align: right !important;
  }
  .align-center {
    text-align: center !important;
  }
  
   .component-block--paths {
      padding: 20px 0;
   }

  @media ${variables.md} {
    .component-block--paths {
      width: 100%;
    }
  }

  @media ${variables.xl} {
    .component-block--paths {
      width: 100%;
    }
  }

  .component-title {
    font-size: 18px;
    text-align: left;
    font-weight: 500;
    margin-bottom: 20px;
  }
  .content {
    margin: auto;
    flex: 0 1 80%;
  }
  .container-main__wrapper {
    display: flex;
    width: 100%;
    min-height: 100vh;
    max-width: 1350px;
    justify-content: center;
    // background-color: ${variables.white};
    // background-color: ${variables.whiteSeven};
    /* transition: transform 400ms ease-in-out; */
    padding-left: 0;
    padding-top: 65px;
    margin: 0 auto;
    will-change: transform;
  }

  .container-main__wrapper.dashboard-wrapper {
    background: #FAFAFD;
  }

  .tabs-header__container + .container-main__wrapper {
    padding-top: 0;
  }

  @media ${variables.lg} {
    .container-main__wrapper {
      padding-top: 0;
    }
  } 

  .sidebar-main {
    display: none;
    width: 280px;
    left:350px;
    /* left: 7%; */
    /*right: 0;
    top: 140px;*/
    position: absolute;
    padding: 46px 0 0 18px;
    /* border: 1 px solid red; */
    margin: 0 130px 0 90px;
    transform: translate(-162%);
    will-change: display, transform;
  }
  
  /* div.overlay-with-filters  {
    margin: 0 auto; 
  } */

    @media ${variables.mxl} {
    .sidebar-main {
      width: 280px;
      transform: translate(-172%);
    }
  }
  /* @media screen and (min-width: 1100px) { */
    @media ${variables.lg}{
    .sidebar-main-visible {
      display: block;
      }
    }

    @media screen and (min-width: 1440px) {
      .sidebar-main-visible {
        width:300px;
        transform: translateX(-150%);
      }
    }



    .overlay-with-filters--nofilters{
      margin: 0 26% 0 auto !important;
      transform: none;
    }

      /* div.overlay-with-filters {
      transform: translateX(132px); */
      /* margin: 0 calc((100vw - 276px)/3.5);
    }

    /* .wrapper-with-filters {
      margin-left: 100px;
    } */
  }
  .container-main {
    width: 100%;
    text-align: center;
    padding: 30px 20px 50px;
    display: inline-block;
    /* margin: 0 auto; */
    transition: transform 0.5s ease-in-out;
    will-change:transform;
    /* filter 500ms; */
   
  }

 

  @media ${variables.md} {
    .container-main {
      max-width: 640px;
      padding: 20px 20px 50px;
    }

    .page-header {
      padding-left: unset !important;
    }
  }  

  @media (max-width: 1200px) {
    .learning-path__background {
      display: none;
    }
    .learning-path__info-panel {
      max-width: 100% !important;
    }
  }

  @media screen and (min-width: 1500px) {
    .container-main.learning-path {
      max-width: 1200px;
    }
  }

  @media ${variables.lg} {
    .container-main {
      display: block;
      padding: 23px 0 50px;
      /* transform: translateX(17%); */
      /* margin: 0 auto 0 30%; */
    }
    // .learning-path {
    //   max-width: 1200px;
    // }, 
    .user-profile {
      max-width: 1024px;
    }

    .learning-feed {
    transform: translateX(0px)!important;
  }

    .center {
      transform: translateX(90px);
    }

    .profile {
      transform: translateX(177px) !important;
    }
    .right-filters {
      transform: translate(5%);
    }

    /* .container-main__wrapper {
      display: inline-block;
    } */
  }

  @media ${variables.lg}{
    .dashboard__wrapper{
      max-width: 668px;
    }
  }

  @media screen and (min-width: 1315px){
    .dashboard__wrapper{
      max-width: 1080px;
    }
  }

  @media screen and (max-width: 1350px) {
    .user-profile {
      max-width: 992px;
    }
  }

  @media screen and (max-width: 1500px) and (min-width: 1200px) {
    .learning-path {
      max-width: 1092px;
      margin-left: 100px;
    }
  }

  @media screen and (max-width: 1200px) {
    .learning-path {
      max-width: 992px;
    }
  }

  .logo--bad-link {
    height: 90px;
    width: 360px;
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 50%;
  }

  .logo--onboarding {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .page-header {
    font-size: 22px;
    font-weight: 800;
    text-align: left;
    /* padding-top: 20px;
    padding-bottom: 20px; */
    /* padding-left: 50px; */
  }

  .page-header--button {
    display: flex;
    justify-content: space-between;
    position: relative;
  }



  .absolute-button-paths {
    display: none;
    position: absolute;
    right: 20px;
    top: -50px;
  }
  @media screen and (min-width:434px) {
     .absolute-button-paths {
    transform: translate(0px, -50px);
  }
    .absolute-feedback {
    transform: translate(0px, -12px);
    }
  }
  @media screen and (min-width:300px) {
     .absolute-feedback {
    transform: translate(0px, -10px);
    }
  }
 

  @media ${variables.md} {
    .absolute-button-paths {
         transform: translate(0px, -70px);
    }
  }

   @media ${variables.lg} {
    .absolute-button-paths {
        display: flex;
    }
  } 

  .absolute-library {
     position: absolute;
     right: 0;
     top: -130px;
  }

  @media screen and (min-width:390px){
    .absolute-library {
          transform: translate(10px, 0px);
    }
  }

    @media ${variables.md} {
    .absolute-library {
         transform: translate(0px, 11px);
    }
       .absolute-feedback {
    transform: translate(0px, -10px);
    }
  }

  @media ${variables.lg} {
    .absolute-library {
        transform: translate(0px, 17px);
    }
  }

  .absolute-feedback {
    display:none;
    position: absolute;
    right: 20px;
    top: -110px;
  }

  @media ${variables.lg} {
    .absolute-feedback {
      display: flex;
      transform: translate(0px, -10px);
    }
  }

  .absolute-manage-reviews{
    display: none;
    position: absolute;
    right: 0px;
    top: -113px;
  }

  @media screen and (min-width:434px) {
    .absolute-manage-reviews{
      top:-129px
    }
  }

  @media ${variables.md} {
    .absolute-manage-reviews{
      top: -118px;
    }
  }

  @media ${variables.lg} {
    .absolute-manage-reviews{
      display: flex;
      top: -120px;
    }
  }

  .absolute-with-interc {
    position: absolute;
    right: 82px;
    top: -90px;
  }
  .absolute-with-interc-draft {
    position: absolute;
    top: -113px;
    right: 0px;
  }

  @media screen and (min-width:434px) {
     .absolute-with-interc-draft {
      transform: translate(-55px, -14px);
     }
  }

  @media ${variables.md} {
    .absolute-with-interc {
      right: 76px;
    }
     .absolute-with-interc-draft {
       transform: translate(-55px, -5px);
     }
  }

  @media ${variables.lg} {
    .absolute-with-interc {
      right: 60px;
      top: -104px;
    }
     .absolute-with-interc-draft {
       display: flex;
      transform: translate(-55px, 0px);
     }
  }
 

  .absolute-with-interc button.el-button--help{
    position: absolute;
    right:-62px;
  }

  @media screen and (min-width:500px){
    // .absolute-button{
    //     transform: translate(-50px, -55px);
    // }

    
    // .absolute-library {
    //       transform: translate(0px,6px);
    //     }
  }
  @media ${variables.md}{
   
    // .absolute-feedback {
    //   transform: translate(-60px, -56px);
    // }
    // .absolute-library {
    //    transform: translate(-80px,5px);
    // }
//      .absolute-button-paths {
//       transform: translateY(-67px);
// }

    // .absolute-manage-reviews {
    //   transform: translateY(42px);
    // }
  }
  @media ${variables.lg}{
   
    //  .absolute-feedback {
    //   transform: translate(-60px, -52px);
    // }
    //   .absolute-library {
    //    transform: translate(-95px,15px);
    // }
  }

  .page-heading {
    display: flex;
    justify-content: center;
    align-items: baseline;
    margin-bottom: 40px;
    margin-top: 20px;
  }

  .page-heading-info {
    flex: 1;
  }

  .page-heading-info h1 {
    font-size: 22px;
    font-weight: 800;
  }

  // ---------
  // REACT AUTOSUGGEST

  // ---------
  // STATES

  .container-main--with-sidebar {
    transform: translateX(20%);
    filter: blur(5px);
  }
  
  @media ${variables.lg} {
    /* .container-main--with-sidebar {
      transform: translateX(20%);
      filter: blur(0px);
    }
     .wrapper--with-sidebar {
      transform: translateX(5%)
 }
     .wrapper--with-sidebar-and-filters {
     transform: translateX(13%)
    } */

    .wrapper--right {
      transform: translate(9%);
    }
  }

  @media screen and (min-width: 1440px) {
  div.wrapper--with-sidebar-and-filters {
    transform: translateX(8%)
  }
  
} 


/* 
  .header--with-sidebar .logo {
    transform: translateX(0%);
    filter: blur(0px);
  }
  @media ${variables.lg} {
    .header--with-sidebar .logo {
      transform: translateX(0);
      filter: blur(0px);
    }
  } */

  .header--with-sidebar .hamburger .icon {
    display: none;
  }

  /* .header--with-sidebar {
    box-shadow: none;
  } */

  .container-main--onboarding {
    margin-left: 50%;
    transform: translateX(-50%);
  }

  .skill-framework {
    display: none;
    text-align: left;
    position: fixed;
    left:0;
    top: 24px;
    /* transform:translateX(-118%); */
    width: 280px;
    z-index: 10;
    padding-right: 10px;
    transform: translateX(34px);
    transition: transform 0.3s ease-in-out;
  }
  @media screen and (min-width: 1350px) {
    div.skill-framework {
      width: 300px;
      /* transform: translateX(-128%); */
      /* left: 15%; */
    }
  }
  @media screen and (min-width: 1680px) {
    div.skill-framework {
      width: 300px;
      /* transform: translateX(-155%); */
      /* left: 15%; */
    }
  }
  @media ${variables.lg} {
    .skill-framework {
      display: block;
      transform:translateX(11vw);
    }
  }

  @media ${variables.xl}{
     .skill-framework {
      display: block;
      transform:translateX(20vw);
    }
  }

  .select-autosuggest-in-modal .react-autosuggest__suggestions-container--open {
    position: fixed;
    max-height: 250px;
    max-width: 625px;
    width: 100%;
    overflow: auto;
    top: auto !important;
  }

  .select-autosuggest-in-modal .el-select-dropdown {
    position: fixed !important;
    top: auto !important;
    left: auto !important;
  }

  .select-autosuggest-in-modal .el-select-dropdown__item {
    color: #5A55AB;
    margin: 4px;
    font-size: 14px;
  }

  .select-autosuggest-in-modal .el-select-dropdown__item:hover {
    color: #5A55AB;
    background: #EFEEF7;
    border-radius: 6px;
  }

  .select-autosuggest-in-modal .el-select-dropdown__item.hover {
    color: #5A55AB;
    background: #EFEEF7;
    border-radius: 6px;
  }

  .select-autosuggest-in-modal .el-input__inner {
    border: 1px solid #8494B2;
    color: #3B4B66;
    font-weight: bold;
    font-size: 16px;
    line-height: 26px;
  }

  .select-autosuggest-in-modal .el-input__inner:hover {
    border: 1px solid #8494B2;
  }

  .select-autosuggest-in-modal .el-input__inner::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: #3B4B66;
    font-size: 16px; /* Firefox */
  }
  
  .select-autosuggest-in-modal .el-input__inner:-ms-input-placeholder { /* Internet Explorer 10-11 */
    color: #3B4B66;
    font-size: 16px;
  }
  
  .select-autosuggest-in-modal .el-input__inner::-ms-input-placeholder { /* Microsoft Edge */
    color: #3B4B66;
    font-size: 16px;
  }

  .react-autosuggest__input {
    border: 1px solid #8494B2 !important;
    font-weight: normal;
    font-size: 16px !important;
    // line-height: 26px;
    color: #3B4B66 !important;
  }

  .react-autosuggest__suggestions-container.react-autosuggest__suggestions-container--open {
    position: absolute;
    margin: 5px 0px;
    border: none;
    max-width: 100%;
    background: #FDFDFD;
    border-radius: 4px;
    filter: drop-shadow(0px 1px 4px rgba(0, 8, 32, 0.1)) drop-shadow(0px 16px 32px rgba(0, 8, 32, 0.1));
    padding: 5px;
  }

  .react-autosuggest__suggestions-container--open ul li {
    color: #5A55AB;
    border-radius: 6px;
  }

  .react-autosuggest__suggestions-container--open ul li:hover {
    background: #EFEEF7;
  }

  .subtabs .tabs-list-item {
    font-size: 13px;
  }

  // QUILL TEXT AREA

  .ql-editor {
    min-height: 100px;
  }

  // FIXED PAGE FOOTER

  .page-footer {
    background-color: ${variables.whiteSeven};
    padding: 20px;
    text-align: center;
    z-index: 1;
    /* box-shadow: 0 -6px 4px -4px rgba(0, 0, 0, 0.03); */
  }

  .page-footer--fixed {
    position: sticky;
    width: calc(100% + 102px);
    margin-left: -50px;
    top: auto;
    bottom: 0;
    right: 0;
  }

  @media ${variables.lg} {
    .page-footer--fixed {
      position: sticky;
      /* margin: 0 -50vw; */
    }
  }

  // PAGE HEADER WITH GO BACK BUTTON

  .page-heading__header {
    display: flex;
    justify-content: center;
    align-items: baseline;
    margin-top: 20px;
  }

  .page-heading__header h1 {
    font-size: 22px;
    font-weight: 800;
  }

  .page-heading__header a {
    margin-bottom: 12px;
  }

  .page-heading__header-info {
    flex: 1;
    margin-right: 28px;
  }

  
  .page-heading__back__button {
    font-size: 17px;
    float: left;
    width: 28px;
    height: 28px;
    padding: 5px;
    border-radius: 50%;
    background-color: ${variables.paleLilac};
    color: ${variables.brandPrimary};
    border: 1px solid ${variables.paleLilac};
    cursor: pointer;
    opacity: 1;
  }

  .page-heading__back__button:hover {
    opacity: 0.7;
  }

  .home__call-to-action {
    margin-top: 120px;
  }

  .home__call-to-action p {
    font-size: 36px;
    color: ${variables.warmGrey};
  }


  .border-round {
    border: 1px solid;
    border-radius: 50%;
  }

  .double-input {
    display: flex;
    justify-content: space-between;
  }

  .double-input > .el-form-item {
    width: 48%;
  }

  /* NEW TABS HEADER */

  .tabs-header__container {
    display: flex;
    flex-direction: column;
    /* align-items: flex-start; */
    justify-content:center;
    min-height: 175px;
    background-color: ${variables.whiteSeven};
    padding: 65px 20px 0 20px;
    font-weight: 500;
}

@media ${variables.md} {
  .tabs-header__container {
    align-items:center;
     padding: 65px 0 0;
  }
}
@media ${variables.lg} {
  .tabs-header__container {
    height: 148px;
    // padding: 24px 24px 0px 181px;
  }
}

.tabs-header__content {
  display: flex;
  flex-direction: column;
  justify-content:flex-end;
  height: 100%;
  width: 100%;
  transform: translateX(0);
  text-align: start;
  /* transition: transform 0.5s ease-in-out; */
  will-change: transform;
}

@media ${variables.md} {
  .content--wider {
    max-width: 992px !important;
  }
}
// @media ${variables.xl} {
//   .content--wider {
//     max-width:1024px !important;
//   }
// }

@media ${variables.lg}{
  .content--wider {
    max-width: 992px !important;
  }
  .header--with-filters {
    transform: translateX(14%) !important;
  }
}
@media screen and (min-width: 1500px) {
  .content--wider {
    max-width: 1200px !important;
  }
}

div.header-tabs {
  min-height: 76px;
  padding:20px 0 50px;
  font-size: 22px;
  font-weight: 800;
  text-align: left;
}

@media screen and (min-width:434px) {
  div.header-tabs {
    padding: 20px 0;
  }
}

.tabs-header__title {
  text-transform:capitalize;
}

/* .tabs-header__content > h1 {
  text-transform:capitalize;
  font-weight:900;
  font-size:24px;
  padding: 7px 0 0;
} */

@media ${variables.md} {
  .tabs-header__content {
    max-width: 640px;
    // transform: translateX(3%);
    padding: 0 20px 0 20px;
  }
}
@media ${variables.lg} {
  .tabs-header__content {
    // transform: translateX(-12%);
    padding: 0;
  }
  .content--right {
     transform: translateX(19%)!important;
  }
}

@media ${variables.lg} {
  .header-dashboard{
    max-width:970px!important;
  }
}
@media screen and (min-width: 1315px) {
  .header-dashboard{
    max-width:1080px!important;
  }
}


.tabs-header__links {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  width: 400px;
  position: absolute;
  top: -120px;
}

.tabs-header__links-row {
  display: flex;
  max-width: 640px;
  height: 40px;
  justify-content: flex-start;
}
.tabs-header__links-row a {
  font-size: 14px;
  font-weight: 700;
  padding-right: 20px;
}

@media ${variables.md}{
  .tabs-header__links-row a {
    padding-right: 42px;
  }

  .tabs-title--active > div {
    width: calc(100% - 40px) !important;
  }
}

.tabs-title{
  color: ${variables.darkBlueTwo};
  position:relative;
}

.tabs-title--active {
  color: ${variables.veryDarkBlue};
}

.tabs-title--active > div {
  position: absolute;
  left:0;
  bottom:0;
  height: 2px;
  width: calc(100% - 20px);
  background-color: ${variables.brandPrimary};
}

.tabs-title__extra-prop {
  background-color: ${variables.fadedRed};
  color: ${variables.white};
  border-radius: 20px;
  padding: 0 10px;
  margin-left: 6px;
}

.tabs-title__extra-prop__invitations {
  color: ${variables.brandPrimary};
  font-size: 10px;
  line-height: 16px;
  border-radius: 50%;
  background-color: ${variables.snowfallWhite};
  margin-left: 6px;
  padding: 2px 8px;
  font-weight: normal;
  text-align: center;
}

.tabs-title__highlight {
  background-color: ${variables.fadedRed};
  border-radius: 10px;
  display: inline-block;
  margin: auto 0px auto 6px;
  width: 10px;
  height: 10px;
}

.postfinance-logo {
  position: absolute;
  width: 174px;
  right: 95px;
  top: 37px;
  display: none;
}

@media ${variables.lg}{
  .postfinance-logo {
    display: block;
  }
}

.header__mobile-header {
     height: 65px;
     width: 100%;
     box-shadow:rgba(0, 0, 0, 0.05) 0px 2px 10px 0px;
     background-color: ${variables.white};
     position: fixed;
     z-index: 10;
   }

   @media ${variables.lg} {
      .header__mobile-header {
        display:none;
   }
   }

.header__mobile-header > a > img {
  width: 95px;
  margin-top: 20px;
}

div.add-user span.el-checkbox__label {
  position:inherit;
}

.grey-small {
  font-size: 12px;
  color: ${variables.warmGrey};
}

.css-bbq5bh > div {
  min-width: 150px;
}

.big-tab {
  display: flex;
  flex-direction: column;
  font-size: 12px;
  text-align: center;
  padding-top: 16px;
  border: 1px solid ${variables.whiteFive};
  border-radius: 4px;
  background-color: ${variables.white};
  cursor: pointer;
}

.big-tab--active {
  border-color: ${variables.brandPrimary};
  background-color: #efeef7;
  box-shadow: 0px 1px 4px rgba(0, 8, 32, 0.1), 0px 16px 32px rgba(0, 8, 32, 0.1);
}

@media ${variables.sm} {
  .learning-feedback-messagebox .el-message-box {
    min-width: 666px;
  }
}
.learning-feedback-messagebox .el-message-box {
  width: unset !important;
}

.learning-feedback-messagebox .el-message-box__btns {
  text-align: center;
  padding-bottom: 60px;
}

.learning-feedback-messagebox_button {
  padding: 12px 38px;
  border-radius: 100px;
}

.learning-feedback-messagebox_button span {
  font-family: Poppins;
  font-weight: 700 !important;
  font-size: 16px;
}

.learning-feedback-messagebox .big-tab {
  width: 240px;
  padding-bottom: 16px;
}

.learning-feedback-messagebox .el-message-box__message {
  padding: 45px 25px 0;
  color: ${variables.black};
}

@media ${variables.lg} {
  .learning-feedback-messagebox .el-message-box__message {
    padding: 45px 45px 0;
  }
}

.preferences-change{
  font-size: 12px;
  font-weight: 500;
  color: #5a55ab;
  cursor: pointer;
  opacity: 1;
}

.preferences-change:hover {
opacity: 0.7;
}

.skill-tag {
  white-space: nowrap;
  font-size: 12px;
  font-weight: 700;
  color: ${variables.brandPrimary};
  padding: 4px 16px 3px;
  background: ${variables.paleLilacTwo};
  display: inline-block;
  border-radius: 4px;
  margin: 0 14px 8px 0;
  opacity: 1;
}

.thumb-tooltip {
  position: absolute;
  transform: translateY(-26px);
  font-size: 16px;
  font-weight: 700;
  color: ${variables.brandPrimary};
}


.contact-wrapper {
  text-align: left;
}

.contact-subheader {
  color: ${variables.veryDarkBlue};
  font-size: 14px;
  line-height: 22px;
  margin-bottom: 48px;
}

.contact-items {
  display: flex;
  align-items: baseline;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
}

@media ${variables.md} {
  .contact-items {
    flex-direction: row;
    align-items: center;
  }
}

.contact-item { 
  max-width: 500px;
  flex-basis: 50%;
  margin-top: 62px;
}

@media ${variables.md} {
  .contact-item {
    width: 50%;
    padding-right: 110px;
  }
}

.contact-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.contact-item--image {
  display: none;
}

@media ${variables.sm} {
  .contact-item--image {
    display: block;
    max-height: 101px;
    width: auto;
  }
}

.item-header {
  color: ${variables.veryDarkBlue};
  font-size: 18px;
  line-height: 26px;
  text-align: left !important;
  margin-left: 16px;
}

.el-tag {
  margin-right: 8px;
}

.el-tag--progress {
  color: #29A399;
  background: #E7F9F7;
}

.el-tag--completed {
  color: #5A55AB;
  background: #D9E1EE;
}
.item-text {
  color: ${variables.darkBlue};
  text-align: left;
  font-size: 16px;
  line-height: 24px;
  margin-bottom: 16px;
}

@media ${variables.md} {
  .item-text {
    min-height: 80px;
  }
}

.contact-button {
  text-align: left;
}

.contact-button .el-button strong {
  font-family: Poppins;
  font-weight: 600;
  padding: 3px;
}

.development-plan__container {
  position: relative;
}

@media ${variables.md} {
  .development-plan__container {
    // max-width: 640px;
    margin: 0 auto;
  }
}

  .onboarding__big-tab {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: center;
    font-size: 14px;
    font-weight: 700;
    border-radius: 100px;
  }

  .onboarding__big-tab svg {
    margin-right: 12px;
  }

  .onboarding__big-tab__shine {
    width: 264px;
    height: 62px;
    position: absolute;
    border: 4px solid #5296CA;
    border-radius: 100px;
    box-sizing: border-box;
    top: -5px;
    left: -5px;
    animation-name: shine90;
    animation-duration: 1400ms;
    animation-timing-function: ease-out;
    animation-iteration-count: infinite;
    animation-direction: normal;
  }

  @keyframes shine90 {
    0% {
      opacity: 0;
      transform: scale(1);
    }
    25% {
      opacity: 0.5;
      transform: scale(1);
    }
    50% {
      opacity: 0;
      transform: scale(1.05);
    }
    100% {
      opacity: 0;
      transform: scale(1);
    }
  }

  /* SKILL SELECTOR BUTTON */
  .list-skill-selector__button-input {
    width: 100%;
    margin-top: 0;
    border: 1px solid ${variables.whiteTwo};
    border-width: 1px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    padding: 13px 16px;
    font-size: 12px;
    background-color: ${variables.white};
    cursor: pointer;
    color: ${variables.warmGrey};
  }

  .goal-dashboard-container {
    text-align: left;
  }
  h1.goal-dashboard-header {
    font-family: 'Poppins', sans-serif;
    font-style: normal;
    font-weight: 900;
    font-size: 24px;
    line-height: 38px;
    color: #000000;
    width: 80%;
  }
  .goal-dashboard-container.completed-goal h1.goal-dashboard-header {
    margin: auto;
    text-align: center;
  }

  .flex-div {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .events__home {
    flex: 1;
    background-color: ${variables.snowfallWhite};
    display: none;
  }

  @media ${variables.lg} {
    .events__home {
      display: block;
    }
    .app-wrapper__with-events {
      flex: 3;
      padding: 0 26px 0 140px;
    }
  }
`
export default globalStyle
