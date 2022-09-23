import css from 'styled-jsx/css'
import variables from './variables'

export const organizationSettingsStyle = css.global`
  .organization-settings__location {
    max-width: 200px;
    margin-top: 10px;
    font-size: 11px;
    color: ${variables.brandPrimary};
    padding: 15px 0 40px;
    cursor: pointer;
  }

  .organization-settings__submit-button {
    margin-top: 20px !important;
  }

  .organization-settings__submit-button.disabled {
    display: none;
  }

  .framework-settings__skills-expand {
    margin-top: 10px;
    font-size: 11px;
    color: ${variables.brandPrimary};
    padding: 15px 0px;
  }

  .framework-settings__skills-expand__content {
    cursor: pointer;
  }

  .framework-settings__list {
    list-style-type: none;
    padding: 0;
  }

  .framework-settings__list__item {
    display: block;
    padding-left: 50px;
    font-size: 11px;
    font-weight: normal;
    color: ${variables.black};
    position: relative;
    word-wrap: break-word;
    cursor: pointer;
    padding-top: 15px;
    padding-bottom: 15px;
    line-height: 1;
  }

  .framework-settings__list__item__description {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
  }

  .framework-settings__list__item__description .el-icon-edit {
    position: absolute;
    right: 35px;
    color: ${variables.brandPrimary};
    font-size: 16px;
  }

  .framework-settings__list__item__description--notext {
    font-style: italic;
    color: ${variables.warmGrey};
  }

  .framework-settings__list__item div.el-input {
    max-width: 450px;
  }

  .framework-settings__list__item div.el-input.el-input__inner {
    color: ${variables.black};
  }

  .framework-settings__list-stars {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }

  .framework-settings__list-stars svg {
    margin-left: -8px;
    position: relative;
  }

  .framework-settings__list-stars svg:nth-child(1) {
    margin-left: 0;
    z-index: 5;
  }

  .framework-settings__list-stars svg:nth-child(2) {
    z-index: 4;
  }

  .framework-settings__list-stars svg:nth-child(3) {
    z-index: 3;
  }

  .framework-settings__list-stars svg:nth-child(4) {
    z-index: 2;
  }

  .framework-settings__list-stars svg:nth-child(5) {
    z-index: 1;
  }

  .framework-settings__selected {
    border-radius: 2px;
    box-shadow: 0 6px 11px 5px rgba(0, 0, 0, 0.05);
    background-color: ${variables.white};
    position: relative;
    margin-left: -35px;
    margin-right: -27px;
    padding-left: 85px;
  }

  .framework-settings__selected .framework-settings__list-stars {
    left: 35px;
  }

  .framework-settings__skills-results {
    border: 1px solid ${variables.whiteSix};
    background-color: ${variables.white};
    padding: 10px;
    font-size: 12px;
    font-weight: 500;
    text-align: justify;
    color: ${variables.warmGrey};
  }

  .framework-settings__type input {
    margin-top: 0;
  }

  .framework-settings__type .el-select .el-input {
    margin-top: 0;
  }

  .framework-settings__type .react-autosuggest__suggestions-container--open {
    top: auto;
  }

  .framework-settings__type .list-skill-selector__results__skills--autosuggest {
    max-height: 200px;
  }

  .framework-settings__star-items {
    margin-top: 10px;
  }

  .framework-settings__buttons {
    display: flex;
    justify-content: space-between;
  }

  .framework-settings__category-checkbox {
    margin-bottom: 14px;
  }
`

export default organizationSettingsStyle
