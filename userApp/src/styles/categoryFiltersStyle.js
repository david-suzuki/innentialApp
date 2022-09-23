import css from 'styled-jsx/css'
import variables from './variables'

const categoryFiltersStyle = css.global`
  .category-filters__heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .category-filters__heading .el-button--text {
    padding: 0 !important;
  }

  .category-filters__heading .el-button--text span {
    color: ${variables.desaturatedBlue};
    font-size: 10px;
    font-weight: bold;
    font-family: Poppins;
    letter-spacing: 0.008em;
    opacity: 1;
  }

  .category-filters__heading .el-button--text span:hover {
    opacity: 0.7;
  }

  .category-filters__heading h2 {
    font-size: 20px;
    color: ${variables.veryDarkBlue};
  }

  .category-filters__desktop h4 {
    font-size: 12px;
    color: ${variables.grey80};
    font-weight: bold;
    margin-bottom: 16px;
  }

  .category-filters__desktop {
    flex-basis: 252px;
    text-align: left;
    margin-right: 24px;
    background-color: white;
    padding: 18.5px;
    display: none;
    height: fit-content;
  }

  @media ${variables.lg} {
    .category-filters__desktop {
      display: block;
    }
  }

  .category-filters__mobile {
    display: block;
  }

  @media ${variables.lg} {
    .category-filters__mobile {
      display: none;
    }
  }

  .category-filters__checkbox {
    margin-bottom: 16px;
  }

  .category-filters__checkbox .el-checkbox__label {
    min-width: 180px;
  }

  .category-filters__onboarding__list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    min-height: 60px;
    margin: 10px 0;
  }

  .category-filters__onboarding__filters {
    display: flex;
    align-items: center;
    padding: 6px 12px;
    color: ${variables.grey80};
    background-color: ${variables.whiteFive};
    border-radius: 100px;
    box-sizing: border-box;
    cursor: pointer;
    margin-right: 20px;
  }

  .category-filters__onboarding__filters i {
    scolor: ${variables.desaturatedBlue};
    font-weight: 700;
    font-size: 16px;
  }

  .category-filters__onboarding__filters:hover {
    opacity: 0.7;
  }

  .category-filters__onboarding__filter__text {
    font-size: 14px;
    line-height: 18px;
    margin: 0 8px;
  }

  .category-filters__onboarding__filter__number {
    padding: 2px 8px;
    background: ${variables.brandPrimary};
    color: ${variables.white};
    border-radius: 100px;
    font-size: 10px;
    line-height: 16px;
  }

  .category-filters__onboarding__dropdown {
    position: absolute;
    background-color: white;
    z-index: 20;
    min-width: 265px;
    padding: 17px 29px;
    box-shadow: 0px 1px 4px rgb(0 8 32 / 10%), 0px 16px 32px rgb(0 8 32 / 10%);
    border-radius: 4px;
  }

  .category-filters__onboarding__selected {
    margin: 12px 8px 12px 0;
    display: flex;
    align-items: center;
    color: ${variables.brandSecondary};
    padding: 8px 22px;
    border-radius: 100px;
    box-sizing: border-box;
    border: 1px solid ${variables.brandSecondary};
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
  }

  .category-filters__onboarding__selected:hover {
    opacity: 0.7;
  }

  .category-filters__onboarding__selected > svg {
    width: 16px;
    height: 18px;
    margin-right: 8px;
    fill: ${variables.brandSecondary};
    stroke: ${variables.brandSecondary};
  }

  .category-filters__onboarding__selected > svg > path {
    fill: ${variables.brandSecondary};
    stroke: ${variables.brandSecondary};
  }
`

export default categoryFiltersStyle
