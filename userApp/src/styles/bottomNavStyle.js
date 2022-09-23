import css from 'styled-jsx/css'
import variables from './variables'

export const bottomNavStyle = css.global`
  .bottom-nav {
    display: flex;
    flex-direction: row;
    position: fixed;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 1560px;
    background-color: #ffff;
    bottom: 0;
    padding: 1rem;
    transform: translate(0, 0);
    box-shadow: -1px 19px 40px -10px rgba(0, 0, 0, 0.49);
  }

  @media ${variables.vl} {
    .bottom-nav {
      transform: translateY(10px);
    }
    
  }

  @media ${variables.md} {
    .bottom-nav {
      box-shadow: none;
      transform: translate(0, 0);
    }
  }

  @media ${variables.lg} {
    .bottom-nav {
      width: 74%;
      left: 6%; 
      transform: translate(23%);
      padding: 1rem 2rem!important;
      /* width: 64%;
      left: 80%;
      padding: 0 70px 30px 0; */
    }
  }


  .bottom-nav__previous {
    padding-right: 24px;
    position: relative;
    cursor: pointer;
    transition: opacity 0.3s ease-in-out;
  }

  .bottom-nav__previous.survey-navs {
    margin-top: 20px;
  }

  .bottom-nav__previous span {
    font-size: 14px;
    font-weight: 700;
    color: ${variables.darkBlue};
  }
  .bottom-nav__previous .icon-e-remove {
    position: absolute;
    top: 8px;
    left: -18px;
    font-size: 12px;
  }
  .bottom-nav__previous .icon-tail-left {
    position: absolute;
    top: 8px;
    left: -18px;
    font-size: 12px;
  }
   .bottom-nav button.el-button {
    border-radius: 100px;
    /* width: 116px;
    height: 41px */
  }

  @media ${variables.md}{
     .bottom-nav button.el-button {
        min-width: 116px;
        height: 41px
     }
  }
 

  .bottom-nav__button-next {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    font-family: 'Poppins';
    font-size: 14px;
    font-weight: 700;
    /* width: 41px;
    height: 20px; */
    position: relative;
    transform: translate(0, 0);
  }
    .button-signup {
      width:unset;
    }

    /* position: absolute;
    left: 0;
    top: 0;
    background-color: ${variables.brandPrimary};
    cursor: pointer;
    border-radius: 100px; */
  

  @media ${variables.md} {
    .button-signup {
      width: 41px;
    }
    .bottom-nav {
      padding: 1rem 6.5rem;
    }
    .bottom-nav__button-next{
      transform: translate(-13%, -15%)
    }
    .bottom-nav__button-next, .page-content-align div form div div button.el-button, .bottom-nav button.el-button, .bottom-nav-contained button.el-button{
      width: 116px;
      height: 42px;
      border-radius: 100px;
    }
    .bottom-nav__button-next svg, .onboarding__signup-button button span div svg {
      display: block !important;
    }

    button.el-button span div.bottom-nav__button-next svg {
       display: block !important;
    }
  }


  @media screen and (max-width:892px){
     .bottom-nav button.el-button {
    /* border-radius: 100px; */
    width: 90px;
    height: 41px
  }
    .bottom-nav__button-next svg {
    display: none;
  }
  }

  .bottom-nav__button-next svg g#Symbols g use#arrow-small {
    fill: #ffff;
  }


  /* BOTTOM NAV CONTAINED */

  .bottom-nav-contained {
    display: flex;
    justify-content: space-between;
    position: sticky;
    bottom: 0;
    left: 0;
    width: 102%;
    padding: 1.7rem 2rem;
    background-color: #ffff;
    transform:translate(0px);
    z-index: 10;
  }

  .bottom-nav-contained > button.el-button {
    height: 35px;
  }


@media ${variables.md}{
// .bottom-nav-contained {
//     padding: 2rem 60px 2rem 0;
//   }

  // .bottom-skills {
  //   padding: 3rem 0;
  // }

  .bottom-nav-contained > button.el-button {
    height: 41px;
    min-width: 116px;
    border-radius: 100px;
  }
}
  

  @media screen and (min-width: 736px) and (max-width:1200px){
    .nav-preferences {
      width:596px;
      padding: 2rem 0;
    }
  }

  .dev-nav {
    width: 113%;
    padding: 2rem 80px 2rem 1rem;
  }


  @media ${variables.lg} {
    .dev-nav {
      width:115%!important;
      transform: translate(-18px)!important;
    }
  }

  @media screen and (min-width: 1379px) {
   .dev-nav {
     width: 930px!important;
     transform: translate(-16px)!important;
    }
  }

  @media screen and (min-width: 1500px) {
    .dev-nav {
      padding: 2rem 1rem;
     }
   }

  @media screen and (min-width: 2500px) {
   .dev-nav {
     width: 935px!important;
    }
  }

`
export default bottomNavStyle
