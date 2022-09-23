import css from 'styled-jsx/css'
import variables from './variables'

export const learningPreferencesStyle = css.global`
  .learning-preferences {
    font-weight: normal;
  }

  .learning-preferences h4,
  h5,
  h6 {
    font-weight: normal;
  }

  .learning-preferences h5 {
    font-size: 14px;
    padding-bottom: 8px;
    font-weight: 500;
  }

  .learning-preferences h6 {
    font-size: 11.5px;
    margin: 18px 0 8px;
  }

  .learning-preferences__add-new {
    font-size: 12px;
    color: ${variables.brandPrimary};
    padding-top: 8px;
    margin-bottom: 26px;
    cursor: pointer;
  }

  .learning-preferences__button-container {
    margin-top: 43px;
  }

  .learning-preferences .el-cascader {
    display: block;
  }

  .learning-preferences--desktop {
    display: none;
  }
  @media ${variables.lg} {
    .learning-preferences--desktop {
      display: block;
      width: 100%;
    }
  }

  .el-button--learning-preferences i {
    font-size: 13px;
    margin-left: 6px;
    font-weight: 600;
  }
  @media ${variables.lg} {
    .el-button--learning-preferences {
      display: none;
    }
  }
`
export default learningPreferencesStyle
