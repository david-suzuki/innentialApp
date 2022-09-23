import css from 'styled-jsx/css'
import variables from '../../../../styles/variables'

const filtersNewStyle = css.global`
  .filters__wrapper {
    
  }

  .development-plan__filters-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 22px;
  }

  .development-plan__filters-heading {
    display: flex;
    position:  relative;
    top: 10px;
    gap: 10px;
  }

  .development-plan__filters-heading--loading {
    top: 0;
    text-align: left;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .development-plan__filters-heading h3{
    font-family: Poppins;
    font-style: normal;
    font-weight: ${variables.bold700};
    font-size: 14px;
    color: ${variables.black};
    line-height: 22px;
  }

  .el-dropdown {
    width: 100%;
    position: relative;
  }

  .el-dropdown-link {
    display: flex;
    align-items: center;
    padding: 9px 16px 9px 9px;
    border: 1px solid #d9e1ee;
    box-sizing: border-box;
    border-radius: 4px;
    background-color: ${variables.white};
    font-family: Poppins;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    color: ${variables.grey80};
    line-height: 22px;
    gap: 8px;
    cursor: pointer;
  }

  .el-dropdown-link--selected {
    display: flex;
    align-items: center;
    padding: 9px 16px 9px 9px;
    border: 1px solid ${variables.brandPrimary};
    box-sizing: border-box;
    border-radius: 4px;
    background-color: ${variables.white};
    font-family: Poppins;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    color: ${variables.brandPrimary};
    line-height: 22px;
    gap: 8px;
    cursor: pointer;
  }

  .el-dropdown-menu {
    padding: 9px;
    border: 1px solid #d9e1ee;
    box-sizing: border-box;
    border-radius: 4px;
    background-color: ${variables.white};
    z-index: 2;
    top: 52px !important; */
    left: 0 !important;
    width: inherit;
    box-shadow: 0px 1px 4px rgba(0, 8, 32, 0.1), 0px 16px 32px rgba(0, 8, 32, 0.1);
    cursor: pointer;
  }

  .el-dropdown-menu--wider {
    width: 175%;
    left: 0 !important;
    text-align: left;
  }

  .el-dropdown-menu--wider .el-checkbox__label  {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 160px;
  }

  @media ${variables.lg} {
    .el-dropdown-menu--wider {
    width: 125%;
  }
  }

  li.el-dropdown-menu__item {
    list-style: none;
  }

  .el-checkbox__inner {
    border: 1px solid ${variables.darkBlueTwo};
    box-sizing: border-box;
    border-radius: 4px;
  }

  .el-button--secondary-link--dropdown {
    font-family: Poppins;
    font-style: normal;
    font-weight: ${variables.bold700};
    font-size: 12px;
    line-height: 18px;
    text-align: center;
    letter-spacing: 0.008em;
    color: ${variables.darkBlue};
    margin: 0;
    display: flex;
    gap: 7px;
    align-items: center;
    border: none;
    background: none;
    cursor: pointer;
  }

  .source__modal {
    max-height: 90vh;
    height: fit-content;
  }

  .sources .el-dialog__wrapper {
    align-items: center;
    bottom: 0px !important;
 }

  div.el-dialog.el-dialog--full div.el-dialog__header {
    font-family: Poppins;
    font-style: normal;
    font-weight: ${variables.bold700};
    font-size: 20px;
    line-height: 32px;
    color: ${variables.black};
  }

  div.el-dialog.el-dialog--full.source__modal div.el-dialog__body {
    column-count: 2;
  }
  
  .el-dialog__headerbtn .el-dialog__close {
    width: 14px;
    height: 14px;
  }

  .el-dialog__headerbtn .el-dialog__close:before{
    color: ${variables.veryDarkBlue};
    font-weight: ${variables.bold700};
  }

  @media screen and (min-width: 1000px) {
    div.el-dialog.el-dialog--full.source__modal div.el-dialog__body {
      column-count: 3;
    }
  }

  .arrow-icon {
    height: 12px;
    width: 9px;
    padding-bottom: 2px;
  }

  .filters__filter__count {
    padding: 2px 8px;
    color: ${variables.brandPrimary};
    background-color: ${variables.white};
    border-radius: 100px;
    font-weight: normal;
    display: flex;
    align-items: center;
    font-size: 10px;
    line-height: 16px;
    text-align: center;
  }

  @media ${variables.lg} {
    .filters__filter__count {
      right: 0;
    }
    /* .el-button--filters {
      display: none;
    } */
  }

  @media screen and (min-width: 1200px) {
    .el-button--filters {
      display: none;
    }
  }

  .filters__filter {
    padding: 5px 0;
    display: flex;
    align-items: center;
  }

  .filters__filter-heading {
    margin: 20px 0 10px;
  }

  .filters__price-range-inputs {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    color: ${variables.darkBlueTwo};
    font-family: Poppins;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 22px;
    gap: 5px;
  }

  .filters__price-range-inputs > .el-input {
    
  }

  .filters__price-range-inputs > .el-input > .el-input__inner {
    border: none;
    border-radius: 0;
    border-bottom: 1px solid ${variables.darkBlueTwo};
    padding: 0;
    margin: auto;
    color: ${variables.darkBlueTwo};
    font-family: Poppins;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 22px;
    text-align: center;
    height: 32px;
    width: 64%;
  }

  .filters__loader-wrapper {
    width: 100%;
    /* height: 1000px; */
    text-align: center;
    margin-top: 20px;
    /* padding-top: 120px; */
    border-radius: 10px;
  }

  /* .filters__heading__button-clear {
    background-color: ${variables.whiteFive};
    color: ${variables.black};
    border-radius: 5px;
    border: 1px solid ${variables.whiteFive};
    font-family: Poppins;
    font-weight: 400;
    padding: 5px 5px 6px 13px;
    width: 90px;
  } */

  .filters__heading__button-clear--small {
    padding: 3px 5px 3px 13px;
    width: 70px;
  }

  .development-plan__filters__heading__button-clear {
    border: none;
    background-color: inherit;
    padding: 0px;
    position:  relative;
    top: 10px;
  }

  .development-plan__filters__heading__button-clear--loading {
    padding: 8px;
    top: 2px;
  }

  .development-plan__filters__heading__button-clear > span {
    font-family: Poppins;
    font-style: normal;
    font-weight: bold;
    font-size: 12px;
    line-height: 22px;
    letter-spacing: 0.008em;
    color: ${variables.medieval};
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .development-plan__filters__heading__button-clear:hover {
    background-color: ${variables.white};
    color: ${variables.warmGrey};
    border-color: ${variables.whiteFive};
  }

  /* .development-plan__filters__heading__button-clear:focus {
    background-color: ${variables.white};
    color: ${variables.warmGrey};
    border-color: ${variables.whiteFive};
  } */

  .filter__icon {
    width: 18px;
    height: 17px;
  }

  svg.filter__icon path{
    fill: ${variables.veryDarkBlue};
  }

  .reset__icon path {
    fill: ${variables.medieval};
  }

  .filters__icon {
    width: 15px;
    height: 15px;
    // margin-right: 8px;
  }

  .filters__icon--dropdown{
    width: 15px;
    height: 15px;
    margin-left: 8px;
    margin-right: 0;
    position: relative;
    top: 2px;
  }

  svg.filters__icon path {
    fill: ${variables.grey80};
  }

  .isDisabled {
    cursor: not-allowed;
  }
  
  svg.isDisabled path{
    fill: #c0c4cc;
  }

  .el-dropdown-link--selected svg.filters__icon path{
    fill: ${variables.brandPrimary};
  }

  .el-icon--right {
    color: ${variables.grey80};
    font-weight: ${variables.bold700};
    width: 12px;
    height: 7px;
    display: flex;
    align-items: center;
    margin-left: auto;
  }

  .el-dropdown-link--selected .el-icon--right{
    color: ${variables.brandPrimary};
  }

  .el-button--filters i {
    font-size: 13px;
    margin-left: 6px;
    font-weight: 600;
  }
  /* @media screen and (min-width: 1100px) {
    .el-button--filters {
      display: none;
    }
  } */

  .el-checkbox--grey > .el-checkbox__label {
    color: ${variables.whiteTwo};
  }

  .filters__filter > div > .el-checkbox > .el-checkbox__label {
    width: 202px;
  }

  @media screen and (min-width: 1300px) {
    .filters__filter > div > .el-checkbox > .el-checkbox__label {
      width: 262px;
    }
  }

  .development-plan__filters-wrapper__skils {
    display: flex;
    gap: 8px;
    margin-bottom : 22px;
    align-items: center;
  }

  .development-plan__filters-wrapper__skils .list-skill-selector {
    display: flex;
    align-items: center;
  }

  .development-plan__filters-wrapper__skils .el-button--secondary-link {
    color: ${variables.brandPrimary};
    padding-top: 0;
    margin-left: 0;
    margin-bottom: 0;
    cursor: pointer;
    font-family: Poppins;
    font-style: normal;
    font-weight: ${variables.bold700};
    font-size: 12px;
    line-height: 18px;
    border: none;
    background-color: inherit;
}

  .settings__icon {
    width: 20px;
    height: 20px;
  }

  .development-plan__filters-wrapper__skils-title {
    font-family: Poppins;
    font-style: normal;
    font-weight: ${variables.bold700};
    font-size: 14px;
    line-height: 22px;
    color:  ${variables.veryDarkBlue};
  }

  .el-checkbox-button {
    background: ${variables.snowfallWhite};
    border-radius: 4px;
    cursor: pointer;
  }

  .el-checkbox-button__inner {
    font-family: Poppins;
    font-style: normal;
    font-weight: ${variables.bold700};
    font-size: 12px;
    line-height: 18px;
    color: ${variables.brandPrimary};
    background: ${variables.snowfallWhite};
    border: none;
    padding: 12px;
    border-radius: 4px;
    display: flex;
    gap: 10px;
  }

  .el-checkbox-button:first-child .el-checkbox-button__inner, .el-checkbox-button:last-child .el-checkbox-button__inner  {
    border-left: none;
    border-radius: 4px;
  }

  .el-checkbox-button__original:checked ~ .el-checkbox-button__inner {
    color: ${variables.white};
    background: ${variables.brandPrimary};
  }

  .filters__duration__labels {
    margin-bottom: 36px;
  }

  .filters__duration__label {
    font-size: 12px;
    color: ${variables.warmGrey};
  }

  .filters__duration__label--left {
    float: left;
  }

  .filters__duration__label--right {
    float: right;
  }

  .filters-dialog > .el-dialog__header {
    padding: 20px;
    padding-bottom: 25px;
    position: sticky;
    width: 100%;
    top: 0;
    background-color: ${variables.white};
    z-index: 100;
  }

  .filters__filter__certified {
    position: absolute;
    right: 35%;
    top: -2px;
    opacity: 0.3;
  }

  @media ${variables.lg} {
    .filters__filter__certified {
      right: 25%;
    }
  }

  .filters__filter__certified__ribbon {
    position: absolute;
    top: 3px;
    left: 4px;
  }

  .filters__filter__certified--active {
    opacity: 1;
  }

  .filters__filter__list-stars {
    position: absolute;
    right: 30%;
    top: 2px;
    opacity: 0.3;
  }

  .filters__filter__list-stars--active {
    opacity: 1;
  }

  @media ${variables.lg} {
    .filters__filter__list-stars {
      right: 20%;
    }
  }

  .filters__filter__list-stars svg {
    margin-left: -8px;
    position: relative;
  }

  .filters__filter__list-stars svg:nth-child(1) {
    margin-left: 0;
    z-index: 5;
  }

  .filters__filter__list-stars svg:nth-child(2) {
    z-index: 4;
  }

  .filters__filter__list-stars svg:nth-child(3) {
    z-index: 3;
  }

  .filters__filter__list-stars svg:nth-child(4) {
    z-index: 2;
  }

  .filters__filter__list-stars svg:nth-child(5) {
    z-index: 1;
  }
`

export default filtersNewStyle
