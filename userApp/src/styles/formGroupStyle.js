import css from 'styled-jsx/css'
import variables from './variables'

export const formGroupStyle = css.global`
  .form-group {
    text-align: left;
  }
  .form-group form .el-form-item:not(:last-child) {
    padding-bottom: 12px;
  }
  /* .form-group h4 {
    text-align: left;
    color: ${variables.warmGrey};
    font-size: 16px;
    margin-bottom: 48px;
    font-weight: 400;
  } */
  .form-group .el-form-item__label {
    font-family: Poppins;
    font-size: 14px;
    font-weight: bold;
    color: #3b4b66;
  }
  .form-group .el-form-item__label-large {
    font-size: 16px;
    font-weight: bold;
    margin-top: 30px;
    line-height: 0.9;
    color: ${variables.black};
  }
  .form-group .el-form-item__error {
    font-size: 0.8em;
    color: ${variables.fadedRed};
    margin-top: 5px;
    font-style: italic;
  }
  .form-group .el-input__inner {
    background: ${variables.white};
    border: 1px solid #8494b2;
    box-sizing: border-box;
    border-radius: 4px;
    padding: 3px 0 3px 11px;
  }
  .el-cascader {
    width: 100%;
  }

  .form-group .icon.icon-eye-ban-18 {
    top: 34px;
  }

  .form-group .el-input__inner {
    color: ${variables.warmGrey};
  }

  .form-group .el-form-item.is-required:not(:last-child) {
    padding-bottom: 16px;
  }

  .form-group--admin {
    text-align: center;
  }

  .form-group--admin .el-input__inner {
    color: ${variables.black};
  }

  .form-group--admin h4 {
    padding-bottom: 15px;
    font-size: 15px;
    font-weight: 800;
  }

  .form-group--admin .el-form-item__label {
    text-align: center;
    font-size: 13px;
    font-weight: 500;
    color: ${variables.black};
  }

  .form-group--admin .el-input__inner {
    margin-top: 38px;
  }

  .form-group--admin .el-input__icon {
    top: 20px;
    transition: none;
  }

  .form-group--admin .el-form-item.is-required:not(:last-child) {
    padding-bottom: 36px;
  }

  .form-group--admin .el-input__inner::-webkit-input-placeholder {
    color: ${variables.black};
  }
  .form-group--admin .el-input__inner:-ms-input-placeholder {
    color: ${variables.black};
  }
  .form-group--admin .el-input__inner::-ms-input-placeholder {
    color: ${variables.black};
  }
  .form-group--admin .el-input__inner::placeholder {
    color: ${variables.warmGrey};
  }

  .form-group--admin .add-location {
    max-width: 200px;
    margin-top: 10px;
    font-size: 11px;
    color: ${variables.brandPrimary};
    padding: 15px 0 40px;
    cursor: pointer;
  }

  /* PREVENT SUGGESTION ICON OVERLAP */

  .el-input i.icon-eye-17 {
    right: 25px;
  }   I

  /* ONBOARDING FORM */

  .onBoarding-form-group {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  @media ${variables.md} {
    .onBoarding-form-group {
       align-items: flex-start;
    }
  }

  @media ${variables.lg} {
    .onBoarding-form-group {
      align-items: flex-start;
    }
  }
`
export default formGroupStyle
// TODO: fine tuned cascader styling
