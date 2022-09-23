import css from 'styled-jsx/css'
import variables from './variables'

const onboardingStyle = css.global`
  .login-page {
    padding: 24px;
    height: 100%;
    width: 100%;
    position: relative;
    background-color: ${variables.white};
  }

  .login-page a {
    font-size: 12px;
  }

  .login-background {
    height: 100%;
    width: 100%;
    /* background: conic-gradient(#e7e6ff 20%, #fff 30% 0); */
    background-color: ${variables.white};
    z-index: 10;
    position: absolute;
    top: 0;
    z-index: 10;
    opacity: 0.2;
    border-radius: 4px;
  }
  @media ${variables.md} {
    .login-background {
      display: none;
    }
    .login-page {
      padding: 0;
    }
  }

  .container-main--login {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    height: 100vh;
    z-index: 12;
    position: relative;
    margin: 0 auto !important;
    background-color: ${variables.white};
  }
  @media ${variables.md} {
    .container-main--login {
      width: 100% !important;
      max-width: 1440px !important;
      /* transform: translateX(0px)!important; */
    }
  }
  @media ${variables.lg} {
    .container-main--login {
      transform: translateX(0px) !important;
    }
  }

  .login__wrapper {
    width: 100%;
    min-width: 336px;
  }

  .login__wrapper h4 {
    margin: 110px 0 15px 0;
    font-size: 22px;
    font-weight: 800;
  }
  @media ${variables.md} {
    .login__wrapper h4 {
      margin-top: 50px;
    }
  }

  .login__header-wrapper {
    width: 100%;
    height: 0;
  }
  @media ${variables.md} {
    .login__header-wrapper {
      height: 140px;
    }
  }

  .login__header a {
    display: none;
  }
  @media ${variables.md} {
    .login__header {
      width: 100%;
      left: 0;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      position: fixed;
      top: 0;
      padding: 60px 76px 40px 80px;
    }
    .login__header a {
      display: block;
    }
  }

  .login__logo {
    width: 143px;
  }
  @media ${variables.md} {
    .login__logo {
      width: 179px;
    }
  }

  .login__desktop-wrapper {
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: space-around;
  }

  .login__image-wrapper {
    display: none;
  }

  @media ${variables.md} {
    .login__image-wrapper {
      display: block;
      max-width: 50%;
    }
    .login__image-wrapper img {
      width: 100%;
      padding: 80px 0 45px 0;
    }
  }

  .login__image-wrapper__title {
    font-size: 36px;
    font-weight: 800;
  }

  .login__image-wrapper__caption {
    font-size: 13px;
  }

  .login__form {
    min-width: 336px;
  }
  @media ${variables.lg} {
    .login__form {
      min-width: 435px;
    }
  }

  .login__button-wrapper {
    text-align: center;
  }
  @media ${variables.md} {
    .login__button-wrapper {
      text-align: left;
    }
  }

  .login__button-wrapper button {
    margin: 10px 0 20px 0;
    width: 100%;
  }
  @media ${variables.md} {
    .login__button-wrapper button {
      margin: 10px 32px 20px 0;
      width: 140px;
    }
  }
  @media ${variables.lg} {
    .login__button-wrapper button {
      width: 200px;
    }
  }

  .login-page .el-input__inner {
    background: transparent;
  }

  .login__contact {
    position: fixed;
    bottom: 28px;
    text-align: center;
    width: 100%;
    left: 0;
  }
  @media ${variables.md} {
    .login__contact {
      display: none;
    }
  }

  .el-form-item__error {
    width: 336px;
    text-align: justify;
  }
  @media ${variables.lg} {
    .el-form-item__error {
      width: 435px;
    }
  }

  .info-block {
    width: 336px;
    color: ${variables.warmGrey};
    font-size: 12px;
  }
  @media ${variables.lg} {
    .info-block {
      width: 435px;
    }
  }

  .login__already {
    position: fixed;
    top: 85px;
    text-align: center;
    width: 100%;
    left: 0;
  }
  @media ${variables.md} {
    .login__already {
      display: none;
    }
  }

  .double-input {
    display: flex;
    justify-content: space-between;
  }

  .double-input > .el-form-item {
    width: 48%;
  }

  .registration-box
    > .el-message-box
    > .el-message-box__content
    > .el-message-box__status {
    font-size: 45px !important;
    margin-left: 15px;
    color: ${variables.avocado};
  }
`
export default onboardingStyle
