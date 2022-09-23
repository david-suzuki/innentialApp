import css from 'styled-jsx/css'
import variables from './variables'

const onboardingStyle = css.global`
  .onboarding__wrapper {
    // max-width: 1350px;
    width: 100%;
    margin: 0;
    position: relative;
    display: flex;
    height: 100vh;
    overflow: hidden;
  }

  .onboarding__page-wrapper {
    height: 100vh;
    overflow-y: auto;
    width: 100%;
    /* Polyfill */
    background:
      /* White */
      linear-gradient(rgba(255,255,255,0), white 70%) 0 100%,
      linear-gradient(rgba(255,255,255,0), white 70%) 0 100%,
      /* Shadow */
      radial-gradient(50% 100%,farthest-side, rgba(0,0,0,.2), rgba(0,0,0,0)) 0 100%;
    /* Regular */
    background:
      /* White */
      linear-gradient(rgba(255,255,255,0), white 70%) 0 100%,
      linear-gradient(rgba(255,255,255,0), white 70%) 0 100%,
      /* Shadow */
      radial-gradient(farthest-side at 50% 100%, rgba(90, 85, 171, .4), rgba(0,0,0,0)) 0 100%;
    background-repeat: no-repeat;
    background-size: 100% 400px, 100% 280px, 100% 260px;
    
    /* Opera doesn't support this in the shorthand */
    background-attachment: local, scroll, scroll;
  }

  .public-feedback__wrapper {
    height: 100vh;
    overflow-y: auto;
    padding: 0 5%;
    width: 100%;
    /* Polyfill */
    background:
      /* White */
      linear-gradient(rgba(255,255,255,0), white 70%) 0 100%,
      /* Shadow */
      radial-gradient(50% 100%,farthest-side, rgba(0,0,0,.2), rgba(0,0,0,0)) 0 100%;
    /* Regular */
    background:
      /* White */
      linear-gradient(rgba(255,255,255,0), white 70%) 0 100%,
      /* Shadow */
      radial-gradient(farthest-side at 50% 100%, rgba(90, 85, 171, .1), rgba(0,0,0,0)) 0 100%;
    background-repeat: no-repeat;
    background-size: 100% 100px, 100% 35px;
    
    /* Opera doesn't support this in the shorthand */
    background-attachment: local, scroll;
  }

  .onboarding__form-item {
    padding: 10px 0;
  }

  .onboarding__form-item .el-checkbox__label {
    position:relative;
  }

  @media ${variables.md} {
    .onboarding__form-item {
      width: 400px;
    }
    
  }
  .onboarding__input > div > input {
    border: 1px solid #8494b2;
    box-sizing: border-box;
    border-radius: 4px;
    padding: 3px 0 3px 11px;
    height: 40px;
    line-height: 40px;
    color: #8494b2 !important;
    font-family: 'Poppins';

  }





  .container-main--onboarding .skills-stars {
    margin-bottom: 0;
    margin-bottom: 0;
  }

  .onboarding__your-skill-levels path {
    stroke: none;
  }

  .container-main--onboarding .component-block {
    padding: 0;
  }

  @media ${variables.md}{
    .onboarding__md-position {
      padding-top: 40px;
    }
    .onboarding__skills-suggestions {
      padding-top: 40px;
    }
  }

  .category-title {
    font-family: 'Poppins', sans-serif;
    font-weight: bold;
    font-size: 14px;
    line-height: 22px;    
    color: #3B4B66;
  }


// skills leveling guidelines start

  .onboarding__skills-framework-container .skills-framework {
    margin-top: 10px;
  }

  .survey-widget {
    width: 100%;
  }

  .page-container .subtitle {
    font-family: 'Poppins', sans-serif;
    font-weight: normal;
    font-size: 16px;
    line-height: 26px;
    color: #8494B2;
  }

  .onboarding__skills-suggestions-content {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    margin-top: 16px;
  }

  .onboarding__skills-suggestions-content .suggested-skill-tag {
    border: 1px solid #5A55AB;
    border-radius: 50px;
    padding: 10px 30px;
    display: flex;
    align-items: center;
    font-family: 'Poppins', sans-serif;
    font-weight: bold;
    font-size: 14px;
    line-height: 22px;
    text-align: center;
    letter-spacing: 0.008em;
    color: #5A55AB;
    margin-right: 8px;
    cursor: pointer;
    margin-bottom: 10px;
  }

  .onboarding__skills-suggestions-content .suggested-skill-tag svg {
    margin-left: 10px;
  }

  .onboarding__skills-suggestions-content .suggested-skill-tag.selected {
    border-color: #29A399;
    background-color: #29A399;
    color: white;
  }

  .onboarding__skills-suggestions-content .suggested-skill-tag.selected svg path {
    fill: white;
  }

  .onboarding__skills-framework-container {
    position: sticky;
    top: 15px;
    height: auto;
    max-width: 350px;
    z-index: 1;
  }

  @media screen and (max-width: 889px) {
    .onboarding__skills-framework-container .skills-framework {
      margin-top: 150px;
    }
  }

  .onboarding__skills-framework {
    display: none;
  }

  @media screen and (min-width: 768px)  {
   
    .onboarding__skills-framework {
      max-width: 350px;
      position: absolute;
      right: -105%;
      display: flex;
      flex-direction: row;
      // background-color: ${variables.greyishBlue};
      border-radius: 4px;
    }
  }
  
  .onboarding__skills-framework .skills-framework__list svg {
    background-color: unset;
  }


// skills leveling guidelines end

  .onboarding__sidebar {
    display: none;
    position:relative;
    flex-direction: column;
    background-color: #f6f8fc;
    width: 40%;
    max-width: 450px;
    padding: 3% 3%;
    flex-grow: 1;
    justify-content: space-between;
  }

  .onboarding__sidebar--full {
    width: 100vw;
  }

  .onboarding__sidebar-background {
    position:absolute;
    background-color: grey;
    height:100%;
    top:0;
    left:0;
  }

  @media ${variables.lg} {
    .onboarding__sidebar {
          display: flex
        }
  }

  // .onboarding__logo-wrapper {
  //   width: 100%;
  //   text-align: center;
  //   box-shadow: inset 0 -1px 0 0 ${variables.whiteFive};
  // }
  // @media ${variables.md} {
  //   .onboarding__logo-wrapper {
  //     box-shadow: none;
  //   }
       
  // }
    .onboarding-logo {
    width: 115.7px;
    height: 24px;
  
  }
 

  .onboarding__skills-list-container {
    display: flex;
    flex-direction: column;
    align-items: start;
    min-height: 350px;
  }
   
  @media screen and (max-width: 892px) {
    .onboarding__skills-list-container {
      min-height: 600px;
    }
  }


  @media ${variables.lg} {
  
    .onboarding__skill-container {
      padding-right: 0;
    }
   
  }

  .onboarding__skill-container {
    display: flex; 
    padding: 15px 0;
    padding-right: 0;
   
  }

  .form-item-skills {
    /* width: 100%; */
    justify-content: center;
    display: flex;
  }

.form-item-skills .el-form-item__error {
  position: absolute;
}
 

  @media ${variables.md} {
    .form-item-skills{
       justify-content:flex-start;
    }
   
  }

  .onboarding-button-input {
    width: 200px !important;
  }

@media ${variables.md}{
  .onboarding-button-input {
    width: 300px!important;   
  }

}

/* @media ${variables.lg}{
   .onboarding-button-input {
    width: 310px !important;
  }
} */
 
/* @media screen and (min-width: 1440px) {
  .onboarding-button-input {
    width: 380px !important;
  }
} */



  .add-location {
    max-width: 200px;
    margin-top: 10px;
    font-size: 11px;
    color: ${variables.brandPrimary};
    padding: 15px 0 40px;
    cursor: pointer;
  }
  .pager-container {
    position: absolute;
    bottom: 0;
    width: 100%;
    /* margin-top: 20px; */
  }
  .el-cascader {
    width: 100%;
    max-width: 650px;
  }
  .contact-us-container {
    height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .submit-container {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .submit__public-wrapper {
    margin-top: 50px;
  }
  .submit__public-wrapper a {
    margin: 20px 0;
    font-size: 12px;
    display: block;
  }
  @media ${variables.md} {
    .submit__public-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-around;
    }
    .submit__public-wrapper a {
      margin: 0;
    }
  }
  .submit__public-wrapper button {
    margin: 10px 0 20px 0;
    width: 100%;
  }
  @media ${variables.md} {
    .submit__public-wrapper button {
      margin: 10px 32px 20px 0;
      width: 140px;
    }
  }
  @media ${variables.lg} {
    .submit__public-wrapper button {
      width: 200px;
    }
  }

  /* STARS INDICATOR */

  .onboarding__stars .skills-stars__name {
    font-size: 16px;
    font-weight: 700;
    text-align:start;
    white-space: nowrap;

  }

  .onboarding__stars .skills-stars__subtitle {
    text-align:start;
    font-size: 12px;
  }

  .onboarding__stars .skills-stars__indicator {
    max-width: 200px;
    
  }

  .stars-highlighted .skills-stars__star-wrapper{
     animation: animationFrames linear 1s;
    animation-iteration-count: 1;
    transform-origin: 50% 50%;
    -ms-animation: animationFrames linear 1s;
    -ms-animation-iteration-count: 1;
    -ms-transform-origin: 50% 50%;
  }

  .stars-highlighted path {
    transition: fill 0.5 ease-in-out;
    fill: #F7DD8C;
  }

  .onboarding__stars .skills-stars {
    margin: 10px 0;
  }

  .onboarding__flag-icon {
    display: flex;
    flex-direction:column;
    align-items: center;
    text-align: center;
    justify-content: start;
    border-right: 1px solid ${variables.whiteFive};
    padding-right: 10px;
    height: 50%;
    align-self: center;
    cursor: pointer;
    color: #8494b2;
  }

  .onboarding__flag-icon--selected {
    color: ${variables.duskyBlue};
  }

  .onboarding__flag-icon svg {
    height: 24px;
    width: 24px;
  }

  .onboarding__flag-icon small {
    font-size: 10px;
    padding-top: 8px;
  }

.loading-curl{
  /* position: absolute;
  left: 50%;
  top:50%;
  transform: translate(-50%,-50%); */
  animation-name: play90;
  animation-duration: 1500ms;
  animation-timing-function: steps(90);
  animation-iteration-count: infinite;
  animation-direction: alternate-reverse;
  width: 195px;
  height: 42px;
  background-repeat: no-repeat;
}

  @keyframes play90 {
    0% {
      background-position: 0px 0px;
    }
    100% {
      background-position: -17550px 0px;
    }
  }

  /* STICKY HEADER */

  .sticky-header__container {
     transition: transform 0.2s ease-in-out, top 0.3s ease-in-out;
     will-change:transform, top;
  }

  .sticky-header__content {
    display: flex;
          justify-content: space-between;
          width: 100%;
          align-items: center;
          
  }

  @media ${variables.lg}{
    .sticky-header__content a {
      display: none;
    }
  }

  .sticky-header__link {
    font-size:10px;
    font-weight: 700;
    color: ${variables.darkBlue};
    padding: 0.5rem 0;

  }

  .sticky-header__link > button.el-button--default, .onboarding__content-alignment > button.el-button--default, .onboarding__learning-items-available > button.el-button--default {
    color: ${variables.brandPrimary}
  }

  .sticky-header__button{
    border: 1px solid ${variables.brandPrimary};
  }

  .sticky-header__background {
    opacity: 0;
    display: flex;
    position: absolute;
    background-color:#fff;
    height:120%;
    width:230%;
    left:65%;
    top:0;
    transform:translate(-50%, 0);
    z-index:-1;
  }

.shadow{
  box-shadow: 0 4px 8px 0 rgba(0, 8, 32, 0.06), 0 1px 4px 0 rgba(0, 8, 32, 0.08);
  opacity: 1;
}

  @media ${variables.lg} {
    .sticky-header__background {
      display: none;
    }
  }

@media screen and (max-width: 1199px){
  .sticky {
    position: fixed;
    top: 0px;
    left: 0;
    width: 100%;
    padding: 24px 0 0;
    background-color: white;
    z-index: 1;
    transform: translate(0%, -7%) ;
    
  }
  .sticky h3 {
    margin-bottom: 0 !important;
  }

  .sticky .sticky-header__content {
    padding: 0 12px;
  }
}
  


   /* FILTERS  */
  .filters__container {
    display: flex;
    width: 100%;
    background-color: #f6f8fc;
    border-radius: 6px;
    height: 123px;
    padding: 24px;
    align-items:center;
    height:auto;
  }

  h3.content-title {
      display: none;
     font-weight: 900;
     font-size: 12px;
     padding-bottom: 10px;
  }

  h3.content-title-inner {
     font-weight: 900;
     font-size: 12px;
     padding-bottom: 10px;
  }

@media ${variables.md} {
  h3.content-title {
    display:block;
  }
   .filters__container h3.content-title-inner {
    display: none;
  }
}
 

  @media ${variables.md} {
    .filters__container {
      width: 620px;
    }
  }

  @media ${variables.lg} {
    .filters__container {
      min-width:790px;
      width: 100%;
      height:123px;
    }
  }

  .filters__filter {
    margin-right: 10%;
  }

  .filters__content-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    flex-wrap: wrap;
    height: 250px;
    justify-content: space-around;
  }

  @media ${variables.md} {
    .filters__content-container {
      height: auto;
    justify-content:inherit
    }
    
  }

  .filters__content-container .filters__content-option-price {
    padding: 0 0 2rem;
  }

  .filters__content-option-price > div.filters__content-option {
    max-width: 100px;
    position:absolute;
    left:0;
    transform: translateY(104%);
  }
  @media screen and (min-width:620px){
    .filters__content-option-price > div.filters__content-option {
      transform: translate(-30px);
      padding-left: 0;
      left:unset;
      right: 0;
    }

  }

  @media ${variables.md}{
  .filters__content-option-price > div.filters__content-option {
    transform: translate(-38%);
     padding-left: 0;
    
  }

  }

  @media ${variables.lg}{
    .filters__content-container{
      flex-direction: row;
      justify-content:space-between;
      flex-wrap: nowrap;
    }

    .filters__content-container .filters__content-option-price {
    padding: 0
  }
  }

.filters__content-option {
  display: flex;
    flex-direction:column;
    width:40%;
    /* align-items:center; */
    justify-content:center;
    flex-wrap:wrap;
}

.filters__content-option h6, .filters__content-option-price h6 {
    font-weight:400;
    color: #3b4b66;
    margin-bottom: 5px;
  }

  .filters__content-option-price {
    display: flex;
    justify-content:flex-start;
    flex-wrap:wrap;
  }

  @media ${variables.lg} {
    .filters__content-option h6 {
      margin-bottom: 21px;
    }
    .filters__content-option-price:first-child h6 {
      margin-bottom: 21px;
    }
    .filters__content-option-price {
      justify-content: space-between;
    }
    
    .filters__content-option-price > div.filters__content-option{
      position: absolute;
      transform: translate(40%);
      left: 50%;
      right:unset;
      transform: translate(-120%);
    }
  }

  .filters__price-range-inputs {
    display: flex;
    /* justify-content: center; */
    align-items: center;
  }

  .filters__price-range-inputs > div > input {
    margin-top: 0;
    height: 34px;
    width: 50px;
    border: 1px solid #d8d8d8;
    padding: 0 5px 0 6px;
    border-radius: 4px;
  }

  .filters__filter > div > label.el-checkbox {
    display:flex;
    max-width: 80px;
    align-items: center;
  }

  .filters__filter > div > label.el-checkbox .el-checkbox__label {
    position: relative;
    
  }

  @media ${variables.lg} {
    .filters__filter > div > label.el-checkbox .el-checkbox__label{
      white-space: nowrap;
    }

    .filters__price-range-inputs {
      position:relative;
      transform:translate(0, -7px)
    }
    
  }

  /* .filters__filter > div > label.el-checkbox .el-checkbox__input {
    padding-left: 10px;

  } */

  @media ${variables.md} {
    .filters__filter > div > label.el-checkbox {
       max-width: 100px;
      align-items:start;
    }
    .filters__filter > div > label.el-checkbox .el-checkbox__label  {
      padding-left: 10px;
    }
   
  }

  .filters__filter > div > label.el-checkbox

.filters__container > div span.el-checkbox__label {
    width: auto;
    position: relative;
}

  .filters__price-range-inputs > div {
    max-width: 85px;
    /* width: 30%; */
  }

  .filters__filter__count {
    margin-left: 4px;
    padding: 0 11px;
    font-size: 11px;
    color: ${variables.brandPrimary};
    background-color: ${variables.white};
    border-radius: 10px;
  }

  /* LOADING PAGE */

  .onboarding__loading-container {
    display:flex;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .onboarding__loading-container h1{
    font-weight: 900;
    font-size: 36px;
    white-space: nowrap;
  }
  .onboarding__loading-container h3{
    font-weight: 400;
    font-size: 16px;
    white-space: nowrap;
    font-size: 16px;
    font-weight: 400;
    padding: 16px 0 42px;
  }

  .onboarding__loading-container .column {
    display: flex;
          flex-direction: column;
          padding-right: 10%;
          align-items:center;
  }

  .onboarding__loading-container > div > div.loading-curl {
    transform:none;
    position:inherit;
  }

  .onboarding__loading-container img {
    display: none;
  }

  @media ${variables.lg} {
    .onboarding__loading-container img {
      display: flex;
    }
    .onboarding__loading-container .column {
      align-items:start;
    }

    .onboarding__loading-container h1 {
      font-size: 48px;
    }
  }

  /* SLIDER_RUNWAY */

  .slider-container H4 {
    margin-bottom: 36px;
  }

  div.slider-onboarding >div.track{
    height: 12px;
    border-radius: 8px;
  }

  div.slider-onboarding >div.thumb{
    height: 32px;
    width: 32px;
    border: 5px solid #fff;
    bottom: 11px;
    box-shadow: 0 4px 8px 0 rgba(0, 8, 32, 0.08), 0 1px 4px 0 rgba(0, 8, 32, 0.12);
  }

  /* PREFERENCES  */

  .onboarding__skill-tag {
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

  .onboarding__span-change {
    font-size: 12px;
    color: ${variables.brandPrimary};
    opacity: 0.84;
    cursor: pointer;
    font-weight: 700;
    padding: 9px;

  }

.onboarding__button {
  border: 1px solid ${variables.brandPrimary};
  width:178px;
}

.onboarding__button > span > div > svg {
  padding-left: 5px;
}
.onboarding__button  {
  opacity: 1;
}

/* LAYOUT */

.onboarding__content-alignment {
  display: flex;
  width: 100%;
  justify-content:center
}


@media ${variables.lg} {
  .onboarding__content-alignment{
    justify-content:flex-start;
  }
  
}

.page-container form h4 {
    text-align: center;
    color: ${variables.warmGrey};
    font-size: 16px;
    // margin-bottom: 48px;
    font-weight: 400;
}

@media ${variables.md} {
  .onBoarding-form-group h4 {
    text-align: start !important;
}
.onboarding__your-skill-levels {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
      width: 100%;
  }
  .onboarding__your-skill-levels .skills-stars__name, .onboarding__your-skill-levels .skills-stars__subtitle {
    text-align: left;
  }

  .onboarding__your-skill-levels .skills-stars__star-wrapper {
    justify-content:flex-start;
  }
  .onboarding__your-skill-levels .skills-stars {
    margin: 10px 0;
  }
}


@media ${variables.lg} {
  .page-container form h4 {
     text-align:left;
  }

  .page-content-align {
  max-width: 1200px;
  /* margin : 0 auto; */
} 
}

/*
@media screen and (min-width: 2560px) {
   .page-content-align {
     margin: 0 auto;
   }
 
}
*/


@media ${variables.md}{
  .page-content-align form {
    min-width:300px;
   max-width: 750px;
}
}

.onboarding__signup-button {
    position: absolute;
    right: 0;
  padding: 32px 0;
}

.onboarding__signup-button button {
  height: 41px;
  width: 116px;
  border-radius: 100px;
}

/* @media ${variables.lg}{
  .onboarding__signup-button {
    position: absolute;
    /* transform: translate(-32%); */
    /* right: unset; 
    right: 0;
    /* left: 32%; 
    padding: 32px 0;
  


/* @media screen and (min-width: 1600px) {
  .onboarding__signup-button{
    position: absolute;
    transform: translate(-32%);
    /* right: unset; */
   /* left: 32%;
  }
  
} */


.onboarding__signup-button button.el-button {
  width: 116px;
    height: 42px;
    border-radius: 100px;
    transform: translateX(14px);

}

@media ${variables.md} {
  .onboarding__signup-button button.el-button {
    transform: translate(0,0);
  }
}


/* LEARNING CARDS */

.onboarding__learning-items-container .dev-item  {

  /* min-width: 370px; */
  min-height: 300px;
  max-width: 585px;
}

.onboarding__learning-items-selected .item-mobile-true {
  max-width: 600px;
  margin: 0 auto 24px;
}





/* @media ${variables.lg} {
  .onboarding__learning-items-container .dev-item {
     width: 372px;
      min-height: 300px;
  }
 
}

@media screen and (min-width: 1330px) {
  .onboarding__learning-items-container .dev-item {
    width: 425px;
  }
}
@media screen and (min-width: 1600px) {
  .onboarding__learning-items-container .dev-item {
    width: 480px;
  }
} */

/* BROWSER SPECIFIC */

/* FIREFOX */

  @supports (-moz-appearance:none) { 
               .onboarding__content-alignment > button {
                margin-bottom:24px;
                }
            } 

.onboarding__form-item span.el-checkbox__inner {
  z-index: 0;
}


/* ANIMATION */
@keyframes animationFrames{
  0% {
    transform:   scale(1);
  }
  15% {
    transform:   scale(1.2);
  }
 
  45% {
    transform:  scale(0.8);
  }

  75% {
    transform:   scale(1.2) ;
  }
  100% {
    transform: scale(1);
  }
}

@-ms-keyframes animationFrames {
 0% {
     -ms-transform:   scale(1);
  }
  15% {
     -ms-transform:   scale(1.2);
  }

  45% {
     -ms-transform:  scale(0.8);
  }
  
  75% {
     -ms-transform:   scale(1.2) ;
  }
  100% {
    -ms-transform: scale(1);
   
  }
}

  /* NEW ONBOARDING STYLES */
  .head__header {
    padding-left: 0;
    margin-bottom: 12px !important;
    font-family: 'Poppins', sans-serif;
    font-size: 24px;
    line-height: 38px;
  }

  .head_subtitle {
    font-family: 'Poppins', sans-serif;
    font-weight: normal;
    font-size: 16px;
    line-height: 26px;    
    color: #556685;
  }

  .skill-choice {
    padding: 13px 40px !important;
    border-radius: 40px !important;
    margin-top: 40px;
  }

  .skill-choice-survey {
    padding: 18px 40px;
    border-radius: 40px;
    margin-top: 40px;
  }

  .skill-choice svg, .skill-choice-survey svg {
    margin-right: 11px;
  }

  .onboarding_refresh-survey {
    display: flex;
    align-items: center;
    font-family: 'Poppins', sans-serif;
    font-weight: bold;
    font-size: 16px;
    line-height: 26px;
    text-align: center;
    letter-spacing: 0.008em;
    color: #556685;
    cursor: pointer;
    top: 160px;
  }

  .onboarding_refresh-survey svg {
    margin-right: 10px;
  }

  .head__paragraph {
    text-align: center;
    font-size: 16px;
    color: ${variables.darkBlueTwo};
    font-weight: 400;
  }

  @media ${variables.lg} {
    .head__paragraph {
      text-align: left;
    }
  } 

  .video-container {
    display: flex;
    margin: 48px auto;

  }

  .video-container__placeholder {
    position: relative;
    margin: 0 auto;
    width: 530px;
    min-height: 254px;
    border-radius: 6px;
    background-color: #EFEEF7;
  }
  

  .video-container__button {
    width: 56px;
    height: 56px;
    background-color: ${variables.white};
  }

  .how-to-wrapper {
    max-width: 800px;
    margin-top: 48px;
    display: flex;
    flex-direction: column;
  }

  .how-to-wrapper .pager-item::before {
    border: none;
    color: #556685;
    content: counter(li, decimal-leading-zero);
  }

  .how-to-item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 46px;
  }

  .item-content {
    padding-left: 8px;
   
  }
  
  .item-content--header {
    margin-bottom: 4px;
    font-size: 16px;
    line-height: 24px;
    color: ${variables.veryDarkBlue};
  }
  
  .item-content--text {
    position: relative;
    max-width: 525px;
    font-size: 14px;
    line-height: 20px;
    color: ${variables.desaturatedBlue};
  }

  .item-image {
    display: none;
    width: 64px;
    height: 64px;
    background: #F6F8FC;
    box-shadow: 0px 1px 4px rgb(0 8 32 / 10%), 0px 32px 64px rgb(0 8 32 / 12%);
    border-radius: 14px;
    margin-left: 18px;
    margin-right: 5px;
    justify-content: center;
    align-items: center;
  }

  @media ${variables.md} {
    .item-image {
      display: flex;
    }
  }

  .cta-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: ${variables.greyishBlue};
    border-radius: 4px;
    padding: 20px;
  }

  @media ${variables.sm} {
   .cta-box {
      flex-direction: row;
  }
  }
  .cta-box__image img {
    max-width: 110px;
    heihgt: auto;
    margin-bottom: 15px;
  }

  .cta-box__content {
    margin-left: 24px;
    font-size: 14px;
    line-height: 20px;
    color: ${variables.darkBlue};
  }

  .content-text {
    margin-bottom: 8px;
    line-height: 22px;
  }

  .content-text--header {
    font-size: 16px;
    line-height: 22px;
    color: ${variables.veryDarkBlue};
    margin-bottom: 15px;
  }

  .el-button-technician {
    color: ${variables.brandPrimary} !important;
    border-color: ${variables.brandPrimary};
    background-color: ${variables.white} !important;
    font-family: Poppins;
    padding: 12px 20px !important;
    border-radius: 100px !important;
    margin-top: 12px;
  }

  .el-button-technician:hover {
    border-color: ${variables.brandPrimary} !important;
    opacity: 0.7;
  }

  .el-button-technician--active {
    color: ${variables.white} !important;
    background-color: ${variables.brandPrimary} !important;
  }
  `

export default onboardingStyle
