import css from 'styled-jsx/css'
import variables from './variables'

export const generateFeedbackStyle = css.global`
  .generate-feedback__link-input {
    width: 100%;
    color: ${variables.black};
    font-size: 13px;
    border-style: solid;
    border-image: initial;
    border-color: ${variables.whiteTwo};
    border-width: 0px 0px 1px;
    border-radius: 0px;
    padding: 13px 0px 16px;
    outline: 0px;
    text-align: center;
  }

  .generate-feedback__input {
    background-color: ${variables.white};
    margin-top: 0;
    flex-basis: 70%;
    margin-bottom: 12px;
  }

  .generate-feedback__input .el-input__icon {
    top: 0;
    right: 10px;
    color: ${variables.duskyBlue};
    cursor: pointer;
  }

  .generate-feedback__input .el-input__inner {
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

  .generate-feedback__wrapper {
    padding-top: 20px;
    position: relative;
  }

  .generate-feedback__tabs .tabs-list {
    margin-bottom: 14px;
  }

  .generate-feedback__content {
    font-size: 13px;
  }

  .generate-feedback__footer-text {
    color: ${variables.warmGrey};
  }

  .generate-feedback__header {
    // margin-bottom: 24px;
  }

  .generate-feedback__list-wrapper {
    min-height: 120px;
    max-height: 420px;
    overflow: auto;
    margin-bottom: 24px;
    box-shadow: inset 1px 1px 3px 1px rgba(0, 0, 0, 0.2);
    text-align: center;
    padding: 12px 0 0 8px;
  }

  .generate-feedback__button-request {
    /* position: fixed;
    right: 0;
    top: auto;
    left: 50%;
    transform: translateX(-50%);
    bottom: 50px; */
    z-index: 100;
  }

  @media ${variables.lg} {
    .generate-feedback__button-request {
      /* top: 95px;
      position: absolute;
      /* left: auto; 
      transform: none;
      bottom: auto; */
    }
  }

  .generate-feedback__dialog > .el-dialog__header {
    padding: 20px;
    padding-bottom: 25px;
    position: sticky;
    width: 100%;
    top: 0;
    background-color: ${variables.white};
    z-index: 100;
  }
`
export default generateFeedbackStyle
