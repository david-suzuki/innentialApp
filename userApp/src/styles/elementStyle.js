import css from 'styled-jsx/css'
import variables from './variables'

const elementStyle = css.global`
  // ---------------------
  // TAG
  .el-tag {
    height: 0;
    line-height: 0;
    margin: 8px 0;
  }
  @media ${variables.sm} {
    .el-tag {
    }
  }
  // TAG paleLilac

  .el-tag--pale-lilac {
    padding: 12px 16px 12px 16px !important;
    margin: 9px 7px;
    background-color: ${variables.paleLilacTwo};
    border: none;
    font-size: 11px;
    border-color: rgba(144, 147, 153, 0.2);
    color: ${variables.brandPrimary};
    cursor: pointer;
  }
  .el-tag--paleLilac.is-hit {
    border-color: #909399;
  }
  .el-tag--paleLilac .el-tag__close {
    color: #909399;
  }
  .el-tag--paleLilac .el-tag__close:hover {
    background-color: #909399;
    color: #fff;
  }

  .el-tag--pale-lilac-inactive {
    cursor: default;
    opacity: 0.6;
  }
  .el-tag--pale-lilac-closable {
    padding: 4px 20px 17px 20px !important;
    cursor: default;
  }
  .el-tag--pale-lilac-closable .el-icon-close {
    margin-right: -11px;
    font-size: 12px;
  }
  .el-tag--pale-lilac-closable .el-icon-close:hover {
    background: none;
    font-weight: bold;
    color: ${variables.brandPrimary};
  }
  .el-tag--is-active {
    color: white;
    background-color: ${variables.brandPrimary};
  }
  // ---------------------
  // NOTIFICATION

  .el-notification .el-icon-circle-check {
    color: ${variables.apple};
  }
  .el-notification__closeBtn {
    right: 10px;
  }

  .el-notification__content {
    text-align: left;
  }
  // ---------------------
  // INPUT included AUTOSUGGEST INPUT
  .el-input__inner,
  .react-autosuggest__container input {
    outline: 0;
    border: 1px solid ${variables.whiteTwo};
    border-width: 1px;
    border-radius: 4px;
    color: ${variables.black};
    font-size: 13px;
    padding: 13px 16px;
    margin-top: 12px;
    background-color: ${variables.white};
  }

  input[type="number"].el-input__inner{
    padding: 0 0 0 5px;
  }
  .el-form-item__label {
    font-size: 13px;
    font-weight: 500;
    text-align: center;
  }
  .el-input__inner::-webkit-input-placeholder,
  .react-autosuggest__container input::-webkit-input-placeholder {
    color: ${variables.warmGrey};
  }
  .el-input__inner:-ms-input-placeholder,
  .react-autosuggest__container input:-ms-input-placeholder {
    color: ${variables.warmGrey};
  }
  .el-input__inner::-ms-input-placeholder,
  .react-autosuggest__container input::-ms-input-placeholder {
    color: ${variables.warmGrey};
  }
  .el-input__inner::placeholder,
  .react-autosuggest__container input::placeholder {
    color: ${variables.warmGrey};
  }

  .el-input .icon.icon-eye-ban-18::before {
    color: ${variables.brandPrimary};
    font-weight: 300;
    font-size: 20px;
    opacity: 0.7;
  }

  .el-input.is-disabled .el-input__inner {
    color: #d2d0d0;
    background-color: transparent;
  }

  .react-autosuggest__container {
    position: relative;
  }

  .react-autosuggest__container input {
    width: 100%;
  }

  .react-autosuggest__input--focused {
    outline: none;
  }

  .react-autosuggest__input--open {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .react-autosuggest__suggestions-container {
    display: none;
  }

  .react-autosuggest__suggestions-container--open {
    display: block;
    position: absolute;
    top: 60px;
    width: 100%;
    border: 1px solid ${variables.whiteTwo};
    background-color: #fff;
    font-size: 14px;
    z-index: 20;
    max-height: 150px;
    overflow: auto;
  }

  .react-autosuggest__suggestions-list {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }

  .react-autosuggest__suggestion {
    cursor: pointer;
    padding: 8px 20px;
    color: #606266;
  }

  .react-autosuggest__suggestion--highlighted {
    background-color: #f5f7fa;
  }

  .icon--autosuggest {
    position: absolute;
    right: 10px;
    margin-top: 24px;
    z-index: 1;
    cursor: pointer;
    color: ${variables.warmGrey};
  }
  // ---------------------
  // EL-FORM ERROR

  .el-form-item__error {
    color: ${variables.fadedRed};
    font-size: 12px;
  }
  // ---------------------
  // SELECT
  .el-select {
    display: block;
    padding: 0;
  }
  .el-select .el-input {
    padding: 0;
  }
  .el-select-dropdown__item {
    color: ${variables.warmGrey};
    font-size: 13px;
    text-align: left;
    padding-left: 24px;
  }
  .el-select-dropdown__item.hover,
  .el-select-dropdown__item:hover {
    background: ${variables.whiteThree};
    color: ${variables.black};
  }
  .el-select-dropdown__item.selected {
    font-weight: 500;
    color: ${variables.black};
  }
  .el-select .el-input .el-input__icon {
    transform: rotate(180deg);
    transition-duration: 700ms;
  }
  .el-select .el-input .el-input__icon.is-reverse {
    transform: rotate(0deg);
  }

  // ---------------------
  // SELECT-TAG
  // ---------------------
  // SELECT-TAG
  .el-select .el-tag__close.el-icon-close {
    background: transparent;
    right: -8px;
    color: ${variables.white};
  }
  .el-select .el-tag {
    background: ${variables.warmGrey};
    color: ${variables.white};
    font-size: 11px;
    font-weight: 300;
    padding: 5px 13px 17px 13px;
    /* margin-bottm: 8px; */
  }

  // ---------------------
  // BUTTON
  .el-button {
    border-radius: 18px;
    padding: 8px 20px;
  }

  .el-button--primary {
    color: ${variables.white} !important;
  }

  .el-button--primary span {
    font-weight: 300 !important;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .el-button--secondary-link {
    color: ${variables.linkColor};
    padding-top: 8px;
    margin-bottom: 26px;
    margin-left: 15px;
    cursor: pointer;
    font: 400 12px Poppins;
    border: none;
    background-color: inherit;
  }

  .el-button--secondary-link:hover {
    opacity: 0.7;
  }

  .el-button--default {
    color: ${variables.warmGrey};
  }

  .el-button--large {
    padding: 12px 85px !important;
  }

  .el-button--mini {
    font-size: 11px;
    font-weight: 300;
    padding: 5px 13px 6px 13px;
  }

  .el-button--full-width {
    width: 100%;
  }

  .el-button--list {
    padding: 6px 20px 8px 20px;
  }

  .el-button--list span {
    font-weight: 300 !important;
    font-size: 12px;
  }

  .el-button--green {
    background-color: ${variables.brandSecondary};
    opacity: 0.84;
    border-radius: 20.5px;
    box-shadow: 0 6px 12px 0 rgba(138, 138, 138, 0.2);
    border: ${variables.brandSecondary};
    color: ${variables.white};
    font-weight: 400;
    padding: 12px 20px;
  }

  .el-button--lilac {
    background-color: ${variables.brandPrimary};
    opacity: 0.84;
    border-radius: 20.5px;
    box-shadow: 0 6px 12px 0 rgba(138, 138, 138, 0.2);
    border: ${variables.brandPrimary};
    color: ${variables.white};
    font-size: 12px;
    font-weight: 400;
    padding: 12px 20px;
  }

  .el-button--green:hover,
  .el-button--green:focus {
    background: #2eb8ac;
    border-color: #ebb563;
    color: ${variables.white};
  }

  .el-button--fixed {
    position: fixed;
    bottom: 12%;
    z-index: 18;
    left: 50%;
    transform: translateX(-50%);
  }
  @media ${variables.lg} {
    .el-button--fixed {
      bottom: 30px;
    }
  }

  .el-button--space-top {
    margin-top: 30px;
  }

  .el-button--pale-lilac {
    margin: 8px 5px 5px !important;
    padding: 3px 16px 4px 16px !important;
    color: ${variables.brandPrimary};
    background: ${variables.paleLilacTwo};
    border-color: ${variables.paleLilacTwo};
  }

  .el-button--pale-lilac:hover,
  .el-button--pale-lilac.el-tag--is-active {
    background: ${variables.brandPrimary};
    border-color: ${variables.brandPrimary};
    color: ${variables.white};
  }

  .el-button--pale-lilac span {
    font-weight: 300 !important;
    font-size: 11px;
  }

  .el-button--help {
    background: ${variables.brandPrimary};
    border-color: ${variables.brandPrimary};
    color: ${variables.white};
    width: 36px;
    height: 36px;
    padding: 0;
    border-radius: 18px;
    font-weight: 800;
    font-size: 18px;
  }

  .el-button--help:hover {
    background: ${variables.brandPrimary};
    border-color: ${variables.brandPrimary};
    color: ${variables.white};
    opacity: 0.7;
  }

  .el-button--flex {
    display: flex;
  }

  .el-button--light {
    background-color: ${variables.white};
    color: ${variables.brandPrimary};
    border-color: ${variables.brandPrimary};
    font-size: 12px;
    line-height: 16px;
    font-weight: 800;
  }
  .el-button--light:hover {
    background-color: ${variables.brandPrimary};
    color: ${variables.white};
    border-color: ${variables.brandPrimary};
  }

  // ---------------------
  // CASCADER

  .el-cascader-menu {
    height: auto !important;
    max-height: 300px !important;
  }

  .el-cascader__label {
    color: ${variables.warmGrey};
    padding: 0;
    font-size: 13px;
  }

  // ---------------------
  // CHECKBOX
  .el-checkbox {
    white-space: normal;
    max-width: 350px;
  }
  .el-checkbox__inner {
    width: 20px;
    height: 20px;
    border-radius: 2px;
    background-color: ${variables.white};
    border: solid 1px ${variables.whiteTwo};
  }
  .el-checkbox__inner::after {
    height: 12px;
    left: 8px;
  }
  .el-checkbox__label {
    color: ${variables.black};
    font-size: 13px;
    font-weight: 400;
    display: inline;
    position: absolute;
    /* width: 300px; */
    line-height: 1.6;
  }

  div.create-team span.el-checkbox__label {
    position: relative;
  }

  .full-label .el-checkbox__label {
    width: 580px;
  }

  .el-checkbox__label a {
    text-decoration: underline !important;
  }
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: ${variables.black};
   
  }


  @media ${variables.md} {
    .el-checkbox__label {
      width: max-content;
    }
  }
  // ----------------------
  // Tabs
  .el-tabs__content {
    overflow: visible;
  }
  .el-tabs__nav-wrap::after {
    background-color: transparent;
  }
  .tab-content {
    position: relative;
    padding: 22px 16px 18px 26px;
    border-radius: 4px;
    box-shadow: 0 6px 11px 5px rgba(0, 0, 0, 0.05);
    background-color: ${variables.white};
  }
  .tab-content--no-bg-shadow {
    box-shadow: none;
    background-color: unset;
  }
  .tab-content .list {
    padding: 0;
    margin-bottom: 0;
    border-radius: 0;
    box-shadow: none;
  }
  @media ${variables.lg} {
    .el-tabs__nav-wrap {
      margin-top: 20px;
    }
    .el-tabs__nav-wrap.is-scrollable {
      padding: 0;
    }
    .el-tabs__nav-wrap .el-tabs__nav-prev {
      display: none;
    }
    .el-tabs__nav-wrap .el-tabs__nav-next {
      display: none;
    }
  }

  // ----------------------
  // ICON
  .el-input__icon {
    position: absolute;
    right: 0;
    top: 8px;
  }
  .el-input .icon {
    position: absolute;
    right: 5px;
    top: 25px;
    font-size: 16px;
    color: ${variables.warmGrey};
  }
  .rc-slider-handle-1 {
    display: none !important;
  }
  // ----------------------
  // MENU
  .el-menu.el-menu--horizontal {
    border-bottom: transparent;
  }

  .el-menu--horizontal > .el-menu-item {
    height: 70px;
    line-height: 80px;
    border: 0 !important;
  }
  // ----------------------
  // POPOVER
  .el-popover {
    padding: 8px 0 6px 8px;
    border-radius: 3px;
    background-color: ${variables.greyishBrown};
    transform: translate(-52px, 5px);
    font-size: 12px;
    line-height: 0.9;
    color: ${variables.white};
    letter-spacing: 0.2px;
    font-weight: 200;
  }
  @media ${variables.md} {
    .el-popover {
      transform: translate(-72px, 5px);
    }
  }

  .el-popover .popper__arrow,
  .el-popover .popper__arrow::after {
    position: absolute;
    display: block;
    width: 0;
    height: 0;
    border-color: transparent;
    border-style: solid;
  }

  .el-popover .popper__arrow {
    border-width: 6px;
    -webkit-filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03));
    filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03));
  }

  .el-popover .popper__arrow::after {
    content: ' ';
    border-width: 6px;
  }

  .el-popover[x-placement^='top'] {
    margin-bottom: 12px;
  }

  .el-popover[x-placement^='top'] .popper__arrow {
    bottom: -6px;
    left: 50%;
    margin-right: 3px;
    border-top-color: transparent;
    border-bottom-width: 0;
  }
  .el-popover[x-placement^='top'] .popper__arrow::after {
    bottom: 1px;
    margin-left: 32px;
    border-top-color: ${variables.greyishBrown};
    border-bottom-width: 0;
  }
  @media ${variables.md} {
    .el-popover[x-placement^='top'] .popper__arrow {
    }
    .el-popover[x-placement^='top'] .popper__arrow::after {
      margin-left: 52px;
    }

    .el-popover[x-placement^='bottom'] {
      margin-top: 12px;
    }

    .el-popover[x-placement^='bottom'] .popper__arrow {
      top: -6px;
      left: 50%;
      margin-right: 3px;
      border-top-width: 0;
      border-bottom-color: #ebeef5;
    }
    .el-popover[x-placement^='bottom'] .popper__arrow::after {
      top: 1px;
      margin-left: -6px;
      border-top-width: 0;
      border-bottom-color: #fff;
    }

    .el-popover[x-placement^='right'] {
      margin-left: 12px;
    }

    .el-popover[x-placement^='right'] .popper__arrow {
      top: 50%;
      left: -6px;
      margin-bottom: 3px;
      border-right-color: #ebeef5;
      border-left-width: 0;
    }
    .el-popover[x-placement^='right'] .popper__arrow::after {
      bottom: -6px;
      left: 1px;
      border-right-color: #fff;
      border-left-width: 0;
    }

    .el-popover[x-placement^='left'] {
      margin-right: 12px;
    }

    .el-popover[x-placement^='left'] .popper__arrow {
      top: 50%;
      right: -6px;
      margin-bottom: 3px;
      border-right-width: 0;
      border-left-color: #ebeef5;
    }
    .el-popover[x-placement^='left'] .popper__arrow::after {
      right: 1px;
      bottom: -6px;
      margin-left: -6px;
      border-right-width: 0;
      border-left-color: #fff;
    }
  }

  // ----------------------
  // AutoComplete
  .el-autocomplete {
    display: block;
  }

  // ----------------------
  // DIALOG

  .v-modal {
    position: fixed;
    left: -900px;
    top: -100px;
    width: 400%;
    height: 200%;
    opacity: 0.8;
    background: #000;
  }

  .el-dialog {
    width: 95%;
    border-radius: 4px;
    box-shadow: 0 8px 24px 0 rgba(0, 0, 0, 0.32);
    overflow: auto;
    margin-bottom: 0;
    overflow-x: hidden;
  }

  @media ${variables.lg} {
    .el-dialog {
      width: 50%;
    }
  }

  .el-dialog__wrapper {
    max-width: 90%;
    margin: 0 auto;
    top: 30px !important;
    bottom: auto !important;
    overflow: hidden;
    display: flex;
    max-height: calc(100% - 60px);
    align-items: stretch;
  }

  .el-dialog--tiny {
    width: 35% !important;
    min-width: 250px;
    max-width: 450px;
  }

  .el-dialog--full {
    width: 95% !important;
    border-radius: 4px;
    box-shadow: 0 8px 24px 0 rgba(0, 0, 0, 0.32);
    overflow: auto;
    margin-bottom: 0;
    overflow-x: hidden;
  }

  .el-dialog__body-text {
    color: ${variables.warmGreyTwo};
  }

  .el-dialog__learning-path-details 
  .el-dialog__footer {
    padding: 25px;
    position: fixed;
    bottom: 30px;
    background-color: ${variables.white};
    border-radius: 4px;
    text-align: center;
    width: calc(100% - (15% + 11px));
    box-shadow: 0px -1px 4px rgba(0, 8, 32, 0.04), 0px -16px 32px rgba(0, 8, 32, 0.04);
    z-index: 100;
  }

  .el-dialog__learning-path-details 
  .el-dialog__header {
    padding: 20px;
    padding-bottom: 45px;
    position: sticky;
    width: 100%;
    top: 0;
    z-index: 100;
  }

  .el-dialog__learning-path-details 
  .el-dialog__header 
  .el-icon-close {
    padding: 12px;
    border-radius: 50%;
    background-color: ${variables.paleLilac};
    font-weight: bold;
    color: ${variables.brandPrimary};
    opacity: 1;
  }

  .el-dialog__learning-path-details 
  .el-dialog__header 
  .el-icon-close:hover {
    opacity: 0.7;
  }

  // ----------------------
  // FORM
  .el-form-item__content {
    position: relative;
  }
  .el-form-item__caption {
    font-size: 12px;
    color: ${variables.warmGreyTwo};
  }

  // ----------------------
  // IE11 fixes
  .el-form-item .el-form-item__error {
    display: none;
  }

  .el-form-item.is-error .el-form-item__error {
    display: block;
  }

  // ----------------------
  // SLIDER

  .slider {
    // padding: 40px 15px;
  }

  .slider > .track {
    height: 4px;
    border-radius: 4px;
  }

  .track-0 {
    background-color: ${variables.brandPrimary};
  }

  .track-1 {
    background-color: ${variables.whiteTwo};
  }

  .slider > .thumb.thumb-0 {
    height: 32px;
    line-height: 32px;
    width: 32px;
    text-align: center;
    background-color: ${variables.brandPrimary};
    color: ${variables.white};
    border-radius: 50%;
    cursor: grab;
    bottom: 22px;
  }

  .slider--duration {
    padding: 30px 15px;
    cursor:pointer;
  }

  .slider--duration.disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .slider--duration > .track {
    height: 6px;
    border-radius: 4px;
  }

  .slider--duration > .thumb {
    height: 16px;
    width: 16px;
    background-color: ${variables.brandPrimary};
    border-radius: 50%;
    cursor: grab;
    border: 2px solid ${variables.whiteFour};
    bottom: 19px;
  }

  /*
  
  .el-slider {
    margin: 40px 15px;
  }

  .el-slider__button {
    border: 2px solid ${variables.whiteFive};
    background-color: ${variables.brandPrimary};
  }

  .el-slider__runway {
    height: 4px;
  }

  .el-slider__bar {
    height: 4px;
    background-color: ${variables.brandPrimary};
  }

  .el-tooltip__popper {
    top: auto !important;
    bottom: 30px !important;
    right: 1px !important;
    left: auto !important;
    background: ${variables.brandPrimary} !important;
    opacity: 1 !important;
    margin-bottom: 12px !important;
  }

  .el-tooltip__popper .popper__arrow {
    opacity: 1 !important;
    bottom: -6px !important;
  }

  .el-tooltip__popper .popper__arrow::after {
    opacity: 1 !important;
    border-top-color: ${variables.brandPrimary} !important;
    bottom: 1px !important;
    margin-left: -5px !important;
  }
  
  */


  // ----------------------
  // TIME-SELECT

  .time-select {
    margin: 5px 0;
    min-width: 0;
  }

  .time-select .el-picker-panel__content {
    max-height: 200px;
    margin: 0;
  }

  .time-select-item {
    padding: 8px 10px;
    font-size: 14px;
    line-height: 20px;
  }

  .time-select-item.selected:not(.disabled) {
    color: #5a55ab;
    font-weight: bold;
  }

  .time-select-item.disabled {
    color: #e4e7ed;
    cursor: not-allowed;
  }

  .time-select-item:hover {
    background-color: #f5f7fa;
    font-weight: bold;
    cursor: pointer;
  }

  // ICON

  .icon-delete-red {
    cursor: pointer;
    color: ${variables.fadedRed};
  }

  .icon-delete-red:hover {
    color: ${variables.fadedRedLighten};
  }

  .icon-delete-red--fixed {
    top: 18px;
    right: -30px;
    position: absolute;
  }

  .icon-clickable {
    cursor: pointer;
  }

  .icon-clickable:hover {
    opacity: 0.7;
  }

  .icon-edit-black {
    cursor: pointer;
    color: ${variables.black};
  }

  .icon-edit-black:hover {
    color: ${variables.warmGrey};
  }
`
export default elementStyle
