import css from 'styled-jsx/css'
import variables from './variables'

const learningPathListStyle = css.global`
  .learning-path-list__wrapper {
    flex-basis: 860px;
    flex-grow: 1.1;
  }

  .learning-path-list__search-box-input {
    flex: 2 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .learning-path-list__search-box-input .el-icon-search {
    color: ${variables.brandPrimary};
    margin-right: 8px;
  }

  .learning-path-list__input {
    background-color: ${variables.white};
    margin-top: 0;
    flex-basis: 70%;
  }

  .learning-path-list__input .el-input__icon {
    top: 0;
    right: 10px;
    color: ${variables.duskyBlue};
    cursor: pointer;
  }

  .learning-path-list__input .el-input__inner {
    margin-top: 0;
    border: 1px solid ${variables.whiteFive};
    display: flex;
    align-items: center;
    padding: 13px 16px;
    font-size: 12px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  .learning-path-list__input .el-input__inner--noborder {
    border-bottom: 0;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .learning-path-list__input .el-input__inner--noborder:hover,
  .learning-path-list__input .el-input__inner--noborder:focus {
    border-bottom: 0 !important;
  }

  .learning-path-list__search-box--mini {
    font-size: 12px;
    color: ${variables.warmGrey};
    border: 1px solid ${variables.whiteFive};
    border-radius: 4px;
    line-height: 38px;
    padding: 0px 16px;
    cursor: pointer;
  }
`

export default learningPathListStyle
