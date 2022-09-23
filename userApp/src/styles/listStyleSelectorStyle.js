import css from 'styled-jsx/css'
import variables from './variables'

export const listStyleSelectorStyle = css.global`
  .list-skill-selector .el-dialog__body {
    padding-left: 40px;
    padding-right: 40px;
  }

  .list-skill-selector .el-dialog {
    width: 100%;
  }

  .list-skill-selector__title {
    font-size: 13px;
    font-weight: 500;
    color: ${variables.black};
    padding-bottom: 30px;
    text-align: center;
  }

  .list-skill-selector__label {
    font-size: 12px;
    font-weight: 600;
    color: ${variables.black};
    text-align: left;
  }

  .list-skill-selector__input {
    background-color: ${variables.white};
    margin-top: 0;
  }

  .list-skill-selector__input .el-input__icon {
    top: 0;
    right: 10px;
    color: ${variables.duskyBlue};
  }

  .list-skill-selector__input .el-input__inner {
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

  .list-skill-selector__input .el-input__inner--noborder {
    border-bottom: 0;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .list-skill-selector__input .el-input__inner--noborder:hover,
  .list-skill-selector__input .el-input__inner--noborder:focus {
    border-bottom: 0 !important;
  }

  .list-skill-selector__results {
    display: flex;
    justify-items: stretch;
    text-align: left;
    border: 1px solid ${variables.whiteFive};
    position: relative;
    z-index: 1;
  }

  .list-skill-selector__results__categories__item {
    list-style-type: none;
    display: block;
    border: 1px solid ${variables.whiteFive};
    border-bottom: 0;
    border-left: 0;
    border-right: 0;
    padding: 10px 16px;
    font-size: 13px;
    line-height: normal;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .list-skill-selector__results__categories__item .icon {
    font-size: 18px;
    cursor: pointer;
    color: ${variables.duskyBlue};
  }

  .list-skill-selector__results__categories__item.active {
    box-shadow: 0 0 6px 2px rgba(0, 0, 0, 0.05);
    background-color: ${variables.brandPrimary};
    color: ${variables.white};
    border: 1px solid transparent;
    position: relative;
    left: -1px;
    width: calc(100% + 2px);
  }

  .list-skill-selector__results__categories__item.active .icon {
    display: none;
  }

  .list-skill-selector__results__categories__item.active
    + .list-skill-selector__results__categories__item {
    border-top: 1px solid transparent;
  }

  .list-skill-selector__results__categories__item:first-child {
    border-top: 1px solid transparent;
  }

  .list-skill-selector__results__categories__item:last-child {
    border-bottom: 1px solid ${variables.whiteFive};
  }

  .list-skill-selector__results__categories {
    padding: 0 1px 0 0;
    margin: 0;
    flex: 1;
    min-height: 100px;
    overflow: auto;
    max-height: calc(100vh - 420px);
  }

  .list-skill-selector__results__skills {
    flex: 1;
    background-color: #fcfcfc;
    position: relative;
    z-index: 2;
    border-left: 1px solid ${variables.whiteFive};
    min-height: 100px;
    overflow: auto;
    max-height: calc(100vh - 420px);
  }

  .list-skill-selector__results__skills--autosuggest {
    height: auto;
    max-height: calc(100vh - 500px);
    min-height: 46px;
  }

  .list-skill-selector__results__skills__item {
    list-style-type: none;
    display: block;
    padding: 10px 16px;
    font-size: 13px;
    line-height: normal;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
  }

  .list-skill-selector__results__skills__item--highlighted {
    background-color: ${variables.whiteFive};
  }

  .list-skill-selector__results__skills__item .skill-name-category {
    margin-left: 8px;
    font-size: 12px;
  }

  .list-skill-selector__results__skills__item .icon {
    font-size: 12px;
    font-weight: 800;
    cursor: pointer;
    color: ${variables.duskyBlue};
  }

  .list-skill-selector__results__skills__item__selected {
    list-style-type: none;
    display: block;
    padding: 10px 16px;
    font-size: 13px;
    opacity: 0.4;
    line-height: normal;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
  }

  .list-skill-selector__results__skills__item__selected--highlighted {
    background-color: ${variables.whiteFive};
  }

  .list-skill-selector__results__skills__item__selected .skill-name-category {
    margin-left: 8px;
    font-size: 12px;
  }

  .list-skill-selector__results__skills__item__selected .icon {
    font-size: 12px;
    font-weight: 800;
    cursor: pointer;
    color: ${variables.duskyBlue};
  }

  .list-skill-selector-wrapper {
    margin-top: 26px;
  }

  .list-skill-selector__actions {
    text-align: center;
    padding-top: 10px;
    padding-bottom: 30px;
  }

  .list-skill-selector__actions .el-button {
    font-size: 12px;
    padding: 8px 20px;
  }

  .list-skill-selector .el-dialog__wrapper {
    bottom: auto !important;
  }

  .cascader-selections,
  .skills-container {
    margin-top: 1em;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    align-items: flex-start;
    min-height: 35px;
  }

  .cascader-selections > div,
  .skills-container > div {
    max-height: 35px;
    padding-bottom: 10px;
  }

  .cascader-selections .el-button--cascader,
  .skills-container .el-button--cascader {
    font-weight: 300 !important;
    font-size: 11px;
    margin-right: 10px;
    padding-left: 15px;
    padding-right: 25px;
    position: reltive;
  }

  .cascader-selections .el-button--cascader span,
  .skills-container .el-button--cascader span {
    font-weight: 300 !important;
    font-size: 11px;
    position: relative;
  }

  .cascader-selections .el-button--cascader i,
  .skills-container .el-button--cascader i {
    font-size: 9px;
    padding-left: 9px;
    margin-top: 2px;
    position: absolute;
    right: -12px;
  }
`

export default listStyleSelectorStyle
