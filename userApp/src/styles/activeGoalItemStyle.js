import css from 'styled-jsx/css'
import variables from './variables'

export const activeGoalItemStyle = css.global`
  .goal-item {
    position: relative;
    display: flex;
    gap: 30px;
    width: 100%;
    /* padding-left: 35px; */
  }

  .goal-item--short {
    position: relative;
    display: flex;
    gap: 30px;
    width: 100%;
    margin-bottom: 16px;
  }

  .goal-item--short .goal-item__list-item__order-icon {
    position: relative;
    left: 0;
    top: 0;
  }

  .goal-item--short .order-icon_container--order {
    margin-top: 8px;
  }
  
  .goal-item--path {
    display: flex;
    flex-direction: column;
    margin-top: 50px;
    max-width: 900px;
    width: 100%;
  }

  .goal-item__title {
    /* background-color: ${variables.white}; */
    border-radius: 4px;
    display: flex;
    padding: 6px 0px 12px;
    width: inherit;
    gap: 30px;
    align-items: flex-end;
  }

  .goal-item--completed {
    opacity: 0.8;
    display: flex;
    justify-content: center;
  }

  .goal-item__goal-number {
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px 0;
  }

  .goal-item__goal-number img {
    position: absolute;
  }

  .goal-item__goal-number span {
    color: ${variables.brandPrimary};
    font-size: 24px;
    line-height: 24px;
    font-weight: 800;
    z-index: 2;
  }

  .goal-item__goal-number span:first-child {
    font-size: 10px;
    line-height: 16px;
    font-weight: 700;
  }

  .goal-item__date {
    text-align: left;
    font-size: 12px;
    color: ${variables.brandPrimary};
  }

  .goal-item__name-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .goal-item__name-wrapper--path {
    text-align: left;
    width: inherit;
  }

  .goal-item__content-wrapper {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }

  .goal-item__content {
    display: block;
    max-width: 75%;
  }

  .goal-item__name {
    font-size: 13px;
    font-weight: 600;
    color: ${variables.duskyBlue};
    display: flex;
    width: 100%;
    justify-content: space-between;
    gap: 50px;
  }

  .goal-item__name span {
    word-break: break-word;
    text-align: left;
    margin-left: 15px;
  }

  .goal-item__name input {
    margin-top: 0;
    max-width: 550px;
  }

  .goal-item__name img {
    margin-right: 5px;
  }

  .goal-item__completion {
    margin-left: 20px;
  }

  .goal-item__completion-text {
    font-size: 10px;
    font-weight: 500;
    line-height: 1.5;
    color: ${variables.warmGreyTwo};
  }

  .goal-item__completion--numbers span:first-child {
    font-size: 22px;
    font-weight: 800;
    margin-right: 3px;
  }

  .goal-item__completion--numbers--completed span:first-child {
    color: ${variables.kiwiGreen};
  }

  .goal-item__completion--numbers span:last-child {
    font-size: 13px;
    color: ${variables.warmGrey};
  }

  .goal-item__skills-wrapper {
    text-align: left;
    // display: flex;
    // flex-direction: column;
    // align-items: flex-start;
  }

  .goal-item__skills-wrapper--path {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 20px;
    color: ${variables.grey100};
  }

  .goal-item__skills-wrapper--path p {
    font-family: Poppins;
    font-style: normal;
    font-weight: ${variables.bold700};
    font-size: 14px;
    line-height: 22px;
  }

  .goal-item__skills-wrapper__title {
    margin: 24px 0 4px;
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    line-height: 22px;
    color: ${variables.grey80};
  }

  .goal-item__skills-wrapper p {
  }

  .list-skill-selector__button-input {
    font-style: normal;
    font-weight: normal;
    font-size: 14px !important;
    line-height: 22px;
    color: ${variables.darkBlueTwo};
    border: 1px solid ${variables.darkBlueTwo};
    cursor: pointer;
    max-width: 550px;
  }

  .list-skill-selector__button-input--selected {
    color: ${variables.duskyBlue};
    font-style: normal;
    font-weight: ${variables.bold700};
    font-size: 12px;
    line-height: 18px;
    display: flex;
    border: none;
    cursor: pointer;
  }

  .goal-item__skills {
    color: ${variables.duskyBlue};
    font-style: normal;
    font-weight: ${variables.bold700};
    font-size: 12px;
    line-height: 18px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }

  .goal-item__skill-tag {
    margin: 8px 15px 8px 0;
    background-color: ${variables.paleLilacTwo};
    padding: 8px 12px;
  }

  .goal-item__skill-results {
    margin-top: 22px;
    display: flex;
    flex-wrap: wrap;
  }

  .goal-item__skill-result-tag {
    font-size: 12px;
    color: ${variables.brandPrimary};
    padding: 4px 16px 3px;
    background: ${variables.paleLilacTwo};
    display: inline-block;
    border-radius: 11px;
    margin: 0 14px 8px 0;
    opacity: 0.6;
    display: flex !important;
    align-items: center;
  }

  .goal-item__skill-result-tag--main {
    opacity: 1;
  }

  .goal-item__skill-result-tag-trim {
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100px;
    margin: 0;
    padding: 0;
    line-height: 1.5;
  }
  .goal-item__skill-result-tag-trim:hover {
    max-width: none;
  }

  .goal-item__skill-result-tag-level {
    border-radius: 9px;
    background: ${variables.brandPrimary};
    color: white;
    padding: 3px 6px 2px;
    font-size: 9px;
    margin-right: -13px;
    margin-left: 6px;
    min-width: 25px;
    text-align: center;
  }

  .goal-item__buttons-wrapper, .goal-item__buttons-wrapper--active {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin-top: 25px;
    justify-content: space-between;
  }

  .goal-item__buttons-wrapper--active{
    max-width: 556px;
}

  .goal-item__development-button {
    font-family: Poppins;
    font-style: normal;
    font-weight: ${variables.bold700};
    font-size: 14px;
    line-height: 22px;
    text-align: center;
    letter-spacing: 0.008em;
    color: ${variables.info60};
    padding: 10px 30px;
    background: none;
    border-radius: 100px;
    border: 1px solid ${variables.info60};
  }

  .goal-item__development-button span {
    display: flex;
  }

  .goal-item__development-button--active {
    font-family: Poppins;
    font-style: normal;
    font-weight: ${variables.bold700};
    font-size: 14px;
    line-height: 22px;
    text-align: center;
    letter-spacing: 0.008em;
    color: ${variables.white};
    font-weight: 700;
    padding: 10px 30px;
    background: #347eb6;
    border-radius: 100px;
    padding: 10px 30px;
    background: ${variables.info80};
  }

  @media ${variables.lg} {
    .goal-item__buttons-wrapper {
      display: flex;
      align-items: center;
      margin-top: 25px;
      justify-content: space-between;
    }
  }

  .goal-item__measures-button {
    font-size: 12px;
    font-weight: 500;
    margin: 0 10px 0 0;
  }

  .goal-item__update-button {
    border-color: ${variables.error40};
    background-color: ${variables.whiteSeven};
    color: ${variables.error40};
    margin: 8px 5px 5px !important;
    padding: 10px 30px;
    font-style: normal;
    font-weight: ${variables.bold700};
    font-size: 14px;
    line-height: 22px;
    text-align: center;
    letter-spacing: 0.008em;
    border-radius: 100px;
  }

  .goal-item__update-button span {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .goal-item__update-button i {
    font-weight: ${variables.bold700};
    font-size: 18px;
    position: relative;
    bottom: 2px;
  }

  .goal-item__update-button:hover,
  .goal-item__update-button.el-tag--is-active {
    background: ${variables.fadedRedLighten};
    border-color: ${variables.fadedRedLighten};
    color: ${variables.brandPrimary};
  }

  .goal-item__add-button {
    font-size: 12px;
    font-weight: 500;
    color: ${variables.duskyBlue};
    margin: 20px 0;
  }

  .goal-item__measures-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .goal-item__measures-wrapper p {
    font-size: 11px;
  }

  .goal-item__success-measures-label {
    font-size: 11px;
    margin: 17px 0;
  }

  .goal-item__success-item {
    font-size: 11px;
    padding: 15px 0;
    word-break: break-word;
    text-align: left;
  }

  .goal-item__success-rate {
    font-weight: bold;
  }

  .goal-item__success-wrapper {
    display: flex;
    align-items: center;
    width: 100%;
  }

  .goal-item__success-wrapper--with-hover {
    cursor: pointer;
  }

  .goal-item__success-wrapper--with-hover:hover {
    box-shadow: 0px 0px 2px 0px #888888;
  }

  .goal-item__success-icon {
    min-width: 34px;
    min-height: 34px;
    background-color: #f0f0f0;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 10px;
  }

  .completed {
    background-color: #d6f2ca;
  }

  .goal-setting__heading {
    display: flex;
    justify-content: space-between;
    padding: 15px 0 15px 0;
    align-items: center;
  }

  .goal-setting__heading-text {
    font-size: 13px;
    font-weight: 500;
  }

  .goal-setting__heading-number {
    font-size: 13px;
    font-weight: 800;
    margin-left: 5px;
  }

  .goal-setting__next-text {
    font-size: 15px;
    font-weight: 800;
    margin: 20px 0;
  }

  .goal-item__feedback-label {
    font-size: 10px;
    font-weight: 500;
    color: ${variables.black};
    margin: 17px 0 0;
    text-align: left;
  }

  .goal-item__feedback-wrapper {
    font-size: 12px;
    border: 1px solid ${variables.whiteTwo};
    padding: 12px;
    margin: 12px 0;
    text-align: left;
  }

  .goal-item__feedback-wrapper > ul > li {
    text-indent: 20px;
  }

  .goal-item__development-button--active:hover {
    color: ${variables.white};
    background: #6da3cd;
  }

  .goal-item__development-button--active span {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .el-button.is-disabled,
  .el-button.is-disabled:hover,
  .el-button.is-disabled:focus {
    color: ${variables.white};
    cursor: not-allowed;
    background-image: none;
    background: #add2ee;
    border-color: #add2ee;
  }

  .goal-item__controls-text {
    text-align: left;
    margin-left: 7px !important;
    margin-bottom: 3px;
  }

  .el-input__inner {
    color: ${variables.grey80};
    font-family: Poppins;
    font-weight: bold;
    font-size: 16px;
    line-height: 26px;
    background: ${variables.white};
    border: 1px solid ${variables.darkBlueTwo};
    box-sizing: border-box;
    border-radius: 4px;
    padding: 9px 0 9px 16px;
    display: flex;
    align-items: center;
  }

  .darker-border .el-input__inner {
    background: ${variables.white};
    border: 1px solid ${variables.grey80};
    color: ${variables.grey80};
  }

  .goal-item__title .el-input__inner {
    border: 1px solid ${variables.grey80};
  }

  .goal__wrapper .goal-item__wrapper {
    width: inherit;
    border-left: none;
    padding-left: 46px;
    padding-bottom: 45px;
    z-index: 1;
    position: relative;
    right: 51px;
  }

  .goal-item__wrapper--order {
    border-left: none;
    max-width: 593px;
    width: 100%;
  }

  .settings__icon {
    width: 20px;
    height: 20px;
  }

  .settings__icon path {
    fill: ${variables.veryDarkBlue};
  }

  .goals__order {
    font-weight: bold;
    font-size: 12px;
    line-height: 18px;
    text-align: center;
    letter-spacing: 0.008em;
    color: ${variables.desaturatedBlue};
    display: flex;
    align-items: center;
    white-space: nowrap;
    cursor: pointer;
  }

  .goals__order div {
    display: flex;
  }

  .order__icon {
    margin-right: 3px;
  }

  svg.order__icon--green path {
    fill: ${variables.success80} !important;
  }

  svg.right__icon path {
    fill: ${variables.success80} !important;
  }

  .goal-item__list {
    display: none;
  }

  .goal-item__list--draggable {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 14px;
    max-width: 550px;
  }

  .goal-item__list-item {
    top:auto !important;
    left: auto !important;
    margin: 16px 0px;
    display: flex;
  }

  .goal-item__list-item__content {
    background: #ffffff;
    border: 1px solid ${variables.darkBlueTwo};
    box-sizing: border-box;
    border-radius: 4px;
    display: flex;
    width: 100%;
    max-width: 924px;
  }

  .item__content {
    padding: 21px 21px 24px 16px;
    flex: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .item__content-labels {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  textarea .el-textarea__inner {
    background: #ffffff;
    box-sizing: border-box;
    border-radius: 4px;
    border: 1px solid ${variables.grey80};
    font-size: 14px;
    line-height: 22px;
    color: ${variables.grey80};
    padding: 8px 16px 12px;
    text-align: left;
    margin-top: 16px;
  }

  textarea.el-textarea__inner::placeholder {
    font-size: 14px;
    line-height: 22px;
    color: ${variables.grey80};
  }

  .item__content__button {
    padding: 22px;
  }

  .item__content__button-container {
    border: 2px solid ${variables.error80};
    color: ${variables.error80};
    border-radius: 4px;
    display: flex;
    align-content: center;
  }

  .item__content__button-container i {
    color: ${variables.error80};
    font-size: 14px;
    font-weight: ${variables.bold700};
  }

  .goal-item__list-item__order-icon {
    position: absolute;
    left: -28px;
    display: none;
  }

  .order-icon_container {
    display: flex;
    flex-direction: column;
    color: ${variables.darkBlueTwo};
    gap: 3px;
    font-weight: ${variables.bold700};
    margin-top: 30px;
  }

  .order-icon_container--order {
    margin-top: 60px;
    /* margin-bottom: 35px; */
  }

  .order-icon_container i {
    height: 2px;
    width: 16px;
  }

  .item__content-labels {
    display: flex;
    align-items: center;
  }

  .item__content-labels__title {
    font-weight: bold;
    font-size: 14px;
    line-height: 22px;
    color: ${variables.veryDarkBlue};
    text-align: left;
    flex: 2;
  }

  .item__content-labels__tag {
    flex: 1;
    text-align: right;
  }

  .item__content-labels__tag span {
    background: ${variables.hawkesBlue};
    border-radius: 4px;
    font-weight: ${variables.bold700};
    font-size: 12px;
    line-height: 18px;
    color: ${variables.desaturatedBlue};
    padding: 4px 6px;
  }

  .item__content-labels__upload {
    flex: 1;
  }

  .upload__image {
    height: 25px;
    contain: content;
    line-height: 22px;
    font-weight: bold;
    font-size: 12px;
    color: ${variables.warmGrey};
  }

  .upload__image-source {
    height: 100%;
  }

  .upload-person {
    font-weight: normal;
    font-size: 14px;
    line-height: 18px;
    color: #000000;
  }

  .upload-person span {
    color: ${variables.brandPrimary};
  }

  .goal-item--short .goal-item__wrapper--order {
    max-width: 550px;
  }

  .goal__wrapper .development-plan__tabs-content__goal-content .learning-item-new__input {
    display: none;
  }

  .goal-wrapper .goal-item__list-item .goal-item--short .goal-item__list-item__order-icon {
    display: none;
  }

  .item__content-note {
    display: none;
  }
`
export default activeGoalItemStyle
