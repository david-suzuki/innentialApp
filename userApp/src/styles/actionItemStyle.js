import css from 'styled-jsx/css'
import variables from './variables'

export const actionItemStyle = css.global`
  .action-item {
    width: 100%;
    text-align: left;
    position: relative;
  }

  .action-item__label {
    font-size: 11px;
    color: ${variables.fadedRed};
    border: 1px solid ${variables.fadedRed};
    border-radius: 1px;
    padding: 3px 5px 2px 5px;
    margin-bottom: 16px;
  }

  .action-item__content-wrapper {
    display: flex;
    justify-content: space-between;
    padding: 14px 0;
  }
  @media ${variables.md} {
    .action-item__content-wrapper {
      padding-bottom: 20px;
    }
  }

  .action-item__content {
    font-size: 14px;
    padding-left: 10px;
    position: relative;
  }
  .action-item__content:after {
    content: '';
    position: absolute;
    width: 2px;
    height: 16px;
    border-radius: 2px;
    background-color: ${variables.darkPink};
    top: 50%;
    left: 0;
    transform: translate(0, -50%);
    z-index: 1;
  }

  .action-item__skill-select {
    font-size: 14px;
    padding-left: 10px;
    position: relative;
  }
  .action-item__skill-select:after {
    content: '';
    position: absolute;
    width: 2px;
    height: 16px;
    border-radius: 2px;
    top: 50%;
    left: 0;
  }

  .action-item__date {
    font-size: 12px;
    line-height: 0.9;
    color: ${variables.duskyBlue};
  }

  .action-item--purple {
    padding: 24px 39px 24px 26px;
    background: ${variables.paleLilacTwo}!important;
  }

  .action-item__content-wrapper--label {
    padding-top: 0;
  }

  .action-item i {
    color: ${variables.duskyBlue};
  }

  .action-item .el-button.el-button--primary span {
    font-size: 12px;
  }

  .action-item__content--icon {
    padding-right: 34px;
  }

  .action-item__content--team:after {
    background-color: ${variables.avocado};
  }

  .action-item__add-skill {
    font-size: 11px;
    color: #5a55ab;
    padding: 15px 0 40px;
    cursor: pointer;
  }
`
export default actionItemStyle
