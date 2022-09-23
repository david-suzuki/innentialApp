import css from 'styled-jsx/css'
import variables from '../../../../styles/variables'

const filtersStyle = css.global`
  .filters__wrapper {
    text-align: left;
  }

  @media screen and (min-width: 1100px) {
    .filters__wrapper--development-plan {
      margin-top: 325px;
    }
  }

  .filters__heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .filters__heading--small {
    align-items: baseline;
  }

  .filters__filter__count {
    position: absolute;
    right: 20px;
    padding: 0 11px;
    font-size: 11px;
    color: ${variables.brandPrimary};
    background-color: ${variables.paleLilacTwo};
    border-radius: 10px;
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
    width: 222px;
    color: ${variables.whiteTwo};
    font-size: 13px;
  }

  .filters__price-range-inputs > .el-input {
    width: 100px;
  }

  .filters__price-range-inputs > .el-input > .el-input__inner {
    border: 1px solid ${variables.whiteFive};
    color: ${variables.warmGrey};
    padding: 13px 0 16px 16px;
    border-radius: 4px;
    font-family: Poppins;
  }

  .filters__loader-wrapper {
    width: 100%;
    height: 1000px;
    text-align: center;
    margin-top: 20px;
    padding-top: 120px;
    border-radius: 10px;
  }

  .filters__heading__button-clear {
    background-color: ${variables.whiteFive};
    color: ${variables.black};
    border-radius: 5px;
    border: 1px solid ${variables.whiteFive};
    font-family: Poppins;
    font-weight: 400;
    padding: 5px 5px 6px 13px;
    width: 90px;
  }

  .filters__heading__button-clear--small {
    padding: 3px 5px 3px 13px;
    width: 70px;
  }

  .filters__heading__button-clear > span {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .filters__heading__button-clear:hover {
    background-color: ${variables.white};
    color: ${variables.warmGrey};
    border-color: ${variables.whiteFive};
  }

  .filters__heading__button-clear:focus {
    background-color: ${variables.white};
    color: ${variables.warmGrey};
    border-color: ${variables.whiteFive};
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

export default filtersStyle
