import css from 'styled-jsx/css'
import variables from './variables'

export const reviewFormStyle = css.global`
  .reviewForm__title {
    margin-top: 20px;
    font-size: 22px;
    font-weight: 800;
    text-align: center;
    padding-bottom: 20px;
    line-height: 28px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .review-start__heading {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin: 20px 0px;
  }

  .review-start__heading h1 {
    font-size: 22px;
    font-weight: 800;
  }

  .review-start__heading a {
    margin-bottom: 12px;
  }

  .review-start__heading-info {
    flex: 1;
    margin-right: 28px;
  }

  td.disabled {
    background: ${variables.whiteTwo};
  }
  .active-class {
    background: red;
  }
  .reviewForm__subtitle {
    margin: 16px 0;
    text-align: left;
  }

  .review-form__button__schedule {
    float: left;
    margin-top: 15px;
  }

  .review-form__back__button {
    font-size: 17px;
    cursor: pointer;
    float: left;
    color: ${variables.brandPrimary};
    border: 1px solid;
    width: 28px;
    height: 28px;
    border-radius: 20px;
    border-color: ${variables.paleLilac};
    background-color: ${variables.paleLilac};
    padding: 5px;
  }

  .review-form__highlight-element {
    animation: bg 2s ease-in;
    -webkit-animation: bg 2s ease-in;
    -moz-animation: bg 2s ease-in;
    -ms-animation: bg 2s ease-in;
    -o-animation: bg 2s ease-in;
  }

  @-webkit-keyframes bg {
    0% {
      background: rgba(255, 165, 0, 1);
    }
    20% {
      background: rgba(255, 165, 0, 0.8);
    }
    50% 70% {
      background: rgba(255, 165, 0, 0.5);
    }
    100% {
      background: rgba(255, 165, 0, 0);
    }
  }

  @-moz-keyframes bg {
    0% {
      background: rgba(255, 165, 0, 1);
    }
    20% {
      background: rgba(255, 165, 0, 0.8);
    }
    50% 70% {
      background: rgba(255, 165, 0, 0.5);
    }
    100% {
      background: rgba(255, 165, 0, 0);
    }
  }

  @-ms-keyframes bg {
    0% {
      background: rgba(255, 165, 0, 1);
    }
    20% {
      background: rgba(255, 165, 0, 0.8);
    }
    50% 70% {
      background: rgba(255, 165, 0, 0.5);
    }
    100% {
      background: rgba(255, 165, 0, 0);
    }
  }

  @-o-keyframes bg {
    0% {
      background: rgba(255, 165, 0, 1);
    }
    20% {
      background: rgba(255, 165, 0, 0.8);
    }
    50% 70% {
      background: rgba(255, 165, 0, 0.5);
    }
    100% {
      background: rgba(255, 165, 0, 0);
    }
  }

  .review-form__inline-label {
    color: ${variables.warmGrey};
    font-size: 13px;
    line-height: 50px;
  }

  .review-form__week-input {
    color: ${variables.warmGrey};
    font-size: 13px;
    display: flex;
    justify-content: flex-start;
    align-items: baseline;
    line-height: 50px;
    padding: 10px 0px;
    flex-wrap: wrap;
  }

  .review-form__disable-progress-checks {
    color: ${variables.warmGrey};
    font-size: 13px;
    justify-content: space-between;
    line-height: 50px;
    padding: 10px 0px;
  }

  .review-form__week-input .el-input__inner {
    margin: 10px 0px;
    text-align: center;
  }

  .review-form__week-input-number {
    display: flex;
    align-items: baseline;
    margin-right: 10px;
  }

  .review-form__week-input-days {
    display: flex;
    align-items: center;
  }

  .review-form__week-input-days .el-radio-group {
    margin-left: 10px;
  }

  .review-form__week-input-days .el-radio-group .el-radio {
    margin-right: 15px !important;
  }

  @media only screen and (max-width: 580px) {
    .review-form__week-input-days .el-radio-group .el-radio {
      margin-right: 0 !important;
      margin-bottom: 5px;
    }
    .review-form__week-input-days .el-radio-group {
      flex-wrap: wrap;
      justify-content: flex-start;
    }
  }
`
export default reviewFormStyle
