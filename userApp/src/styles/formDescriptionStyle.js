import css from 'styled-jsx/css'
import variables from './variables'

export const formDescriptionStyle = css.global`
  .form-description {
    text-align: center;
    width: 100%;
  }
  .form-description .el-form-item__description {
    font-size: 12px;
    line-height: 1.2;
    text-align: center;
    padding-top: 5px;
    color: ${variables.warmGreyTwo};
  }
  .form-description .el-form-item__description,
  .form-description .el-form-item__label {
    margin: 0 auto;
  }
  .form-description .el-form-item__label {
    font-size: 16px;
    font-weight: bold;
  }

  .form-description .el-form-item__error {
    font-size: 0.8em;
    color: ${variables.fadedRed};
    font-style: italic;
  }

  .form-description--register.el-form-item__label {
    font-size: 13px;
    font-weight: 500;
  }
`
export default formDescriptionStyle
