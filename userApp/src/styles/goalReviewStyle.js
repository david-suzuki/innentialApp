import css from 'styled-jsx/css'
import variables from './variables'

export const goalReviewStyle = css.global`
  .goal-review__heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20px 0px;
  }

  .goal-review__heading h1 {
    font-size: 22px;
    font-weight: 800;
  }

  .goal-review__heading a {
    margin-bottom: 12px;
  }

  .goal-review__heading-info {
    flex: 1;
    margin-right: 28px;
  }

  .goal-review__date {
    font-size: 16px;
    font-weight: 500;
    color: ${variables.warmGrey};
  }

  .goal-review__goal-item {
    margin-top: 50px;
  }

  .goal-review__skills-feedback {
    font-size: 13px;
    font-weight: 500;
    text-align: left;
    margin-bottom: 50px;
  }

  .goal-review-action-item-wrapper {
    display: flex;
    flex-direction: column;
    background-color: white;
    border-radius: 4px;
  }

  .goal-review-action-item-heading {
    font-size: 13px;
    font-weight: 500;
  }

  .goal-review__skill-select-label {
    font-size: 13px;
    color: ${variables.warmGrey};
    text-align: left;
    margin-top: 40px;
  }

  .goal-review__feedback {
    font-size: 13px;
    font-weight: 500;
    text-align: left;
    margin: 50px 0 10px 0;
  }

  .goal-review__feedback-label {
    font-size: 13px;
    color: ${variables.warmGrey};
    text-align: left;
    margin-bottom: 20px;
  }

  .goal-review__textarea {
    margin-bottom: 25px;
  }

  .goal-review-next-button {
    border-color: ${variables.brandPrimary};
    background-color: ${variables.brandPrimary};
    color: ${variables.white};
  }

  .goal-review__back__button {
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

  .goal-review__back__button:hover {
    opacity: 0.7;
    cursor: pointer;
  }

  .goal-summary__skills-progression-wrapper {
    background-color: rgba(231, 230, 255, 0.3);
    padding: 25px;
    margin-bottom: 15px;
  }

  .goal-summary__skills-progression-header {
    font-size: 15px;
    font-weight: ${variables.bold};
    text-align: left;
  }

  .goal-summary__progression-box {
    display: flex;
    flex-wrap: wrap;
    text-align: left;
    margin: 20px 0 10px 0;
  }

  .goal-summary__progression-item {
    font-size: 13px;
    color: ${variables.warmGrey};
    width: 50%;
    margin-bottom: 20px;
  }

  .goal-summary__progression-item .values {
    color: black;
    margin-left: 5px;
  }

  .goal-summary__progression-item .newValue {
    font-weight: bold;
  }

  .goal-summary__progression-item .icon-green {
    color: ${variables.kiwiGreen};
    font-size: 9px;
    margin-left: 9px;
  }

  .goal-summary__progression-item .icon-red {
    color: ${variables.fadedRed};
    font-size: 9px;
    margin-left: 9px;
  }

  .goal-summary__graph-button-box {
    display: flex;
  }

  .summary-item__button {
    font-size: 12px;
    color: ${variables.brandPrimary};
    opacity: 0.84;
    border-radius: 20.5px;
    border: 2px solid ${variables.brandPrimary};
    font-weight: 500;
    padding: 12px 20px;
    float: left;
    margin-right: 15px;
  }

  .goal-summary__goals-reviewed-wrapper {
    padding: 20px;
    border: 1px solid ${variables.whiteFive};
    border-radius: 3px;
    margin-bottom: 20px;
    background-color: ${variables.white};
  }
  .goal-summary__goals-reviewed-header {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    font-weight: 400;
  }
  .goal-summary__goals-reviewed-header .el-button {
    font-size: 11px;
    color: ${variables.brandPrimary};
  }
  .goal-summary__goals-reviewed-header__number {
    font-weight: bold;
  }
  .goal-summary__goals-set-header {
    font-size: 16px;
    font-weight: bold;
    text-align: left;
    margin-bottom: 15px;
  }

  .el-dialog--success-rate {
    width: 370px !important;
    min-height: 242px;
    text-align: center;
    padding: 20px;
  }

  .el-dialog__footer--success-rate {
    text-align: center;
  }

  .el-dialog__body--success-rate {
    font-size: 13px;
    font-weight: 500;
    color: ${variables.black};
    padding: 0px 15px;
  }

  .goal-results__result-heading {
    font-size: 18px;
    font-weight: 800;
    text-align: left;
    margin-bottom: 15px;
  }

  .goal-results__feedback-wrapper {
    font-size: 12px;
    border: 1px solid ${variables.whiteTwo};
    padding: 12px;
    margin: 12px 0;
    text-align: left;
  }

  .goal-results__feedback-wrapper > ul > li {
    text-indent: 20px;
  }
`
export default goalReviewStyle

// .goal-review__heading-info > h1 {
//   margin-bottom: 6px;
// }
