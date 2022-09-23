import css from 'styled-jsx/css'
import variables from './variables'

const onboardingStyle = css.global`
  p {
    color: ${variables.brandPrimary};
  }

  .onboarding__wrapper {
    max-width: 1350px;
    width: 100%;
    margin: 0 auto;
    position: relative;
  }

  .onboarding__skills-framework {
    display: none;
  }

  .container-main--onboarding .skills-stars {
    margin-bottom: 0;
    margin-bottom: 0;
  }

  .container-main--onboarding .component-block {
    padding: 0;
  }

  @media ${variables.md} {
    .onboarding__skills-framework {
      display: block;
      position: fixed;
      max-width: 420px;
      padding: 30px 20px;
    }
  }

  .onboarding__logo-wrapper {
    width: 100%;
    text-align: center;
    box-shadow: inset 0 -1px 0 0 ${variables.whiteFive};
  }
  @media ${variables.md} {
    .onboarding__logo-wrapper {
      box-shadow: none;
    }
  }
  .onboarding-logo {
    width: 95px;
    margin: 46px auto 18px auto;
  }
  @media ${variables.md} {
    .onboarding-logo {
      width: 116px;
      margin-bottom: 0;
    }
  }
  .add-location {
    max-width: 200px;
    margin-top: 10px;
    font-size: 11px;
    color: ${variables.brandPrimary};
    padding: 15px 0 40px;
    cursor: pointer;
  }
  .pager-container {
    width: 100%;
    margin-top: 20px;
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
`
export default onboardingStyle
