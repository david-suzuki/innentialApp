import css from 'styled-jsx/css'
import variables from '../../../../styles/variables'

const filtersSmallStyle = css.global`
  .filters__wrapper {
    text-align: left;
    background-color: #f6f8fc;
    padding: 20px;
    width: 100%;
    margin: 20px 0;
  }

  @media ${variables.md} {
    .filters__wrapper {
      width: 640px;
      margin: 20px auto;
    }
  }

  .filters__filters {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
  }

  @media ${variables.md} {
    .filters__filters {
      flex-direction: row;
    }
  }

  .filters__filter__count {
    position: unset;
    margin-left: 75%;
    padding: 0 11px;
    font-size: 11px;
    color: ${variables.brandPrimary};
    background-color: ${variables.white};
    border-radius: 10px;
  }

  .filters__filter {
    padding: 5px 0;
    display: flex;
    align-items: center;
  }

  .filters__filter-heading {
    margin: 20px 0 10px;
  }

  .filters__price {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    width: 100%;
  }

  @media ${variables.md} {
    .filters__price {
      flex-direction: row;
      width: 66%;
    }
  }

  .filters__small {
    width: 100%;
  }

  @media ${variables.md} {
    .filters__small {
      width: 33%;
    }
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
`

export default filtersSmallStyle
