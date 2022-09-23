import css from 'styled-jsx/css'
import variables from './variables'

export const devStyle = css.global`
  .dev-item {
    border-radius: 4px;
    /* padding-right: 18px; */
    margin-bottom: 24px;
    display: flex;
    justify-content: space-between;
    background-color: white;
    width: 100%;
    border: 1px solid white;
  }

  .dev-item--onboarding {
    border: 1px solid ${variables.whiteTwo};
  }

  .dev-item--selectable:hover {
    border: solid 1px ${variables.brandPrimary};
  }

  .border-bottom {
    border: none;
    border-radius: 0px;
    box-shadow: none;
    border-bottom: solid 1px ${variables.whiteFour};
  }

  .not-selected:hover {
    border: solid 1px ${variables.brandPrimary};
  }

  .dev-item__label {
    display: flex;
    align-items: center;
    margin-bottom: 6px;
  }

  .dev-item__label-name {
    font-size: 12px;
    color: ${variables.warmGrey};
  }

  .dev-item__label-source-img {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    margin-right: 8px;
  }

  .dev-item__recommended {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 12px;
    color: ${variables.warmGrey};
    margin-bottom: 13px;
  }

  .dev-item__recommended-image {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    margin-right: 8px;
  }

  .dev-item__wrapper {
    max-width: 75%;
  }

  .dev-item__wrapper i {
    height: auto;
    font-size: 15px;
    margin-right: 8px;
    color: ${variables.brandSecondary};
  }

  .dev-item__wrapper .dev-item__label-name {
    line-height: 0.9;
  }

  .dev-item__content {
    text-align: left;
  }

  .dev-item__label-source-img {
    position: relative;
    overflow: hidden;
    width: 16px;
    height: 16px;
    margin-left: 4px;
    border: solid 0.5px ${variables.paleLilac};
    border-radius: 50%;
    background-color: white;
  }

  .dev-item__label-source-img img {
    width: 9px;
    height: auto;
    max-height: 11px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .dev-item__text {
    font-size: 14px;
    position: relative;
    line-height: 1.5;
    color: ${variables.black};
  }

  .dev-item__text span {
    color: ${variables.warmGrey};
  }

  .dev-item__sophistication {
    font-size: 9px;
    font-weight: 600;
    text-transform: uppercase;
    line-height: 1.29;
    letter-spacing: 2px;
    color: ${variables.warmGrey};
    padding-top: 3px;
  }

  .dev-item__text a {
    font-size: 14px;
    color: ${variables.black};
  }
  .dev-item__text:after {
    content: '';
    position: absolute;
    width: 2px;
    height: 16px;
    border-radius: 2px;
    background-color: transparent;
    top: 50%;
    left: 0;
    transform: translate(0, -50%);
    z-index: 1;
  }

  .dev-item__details {
    font-size: 12px;
    line-height: 0.9;
    margin-top: 6px;
    color: ${variables.brandPrimary};
  }

  .dev-item__author {
    font-size: 11px;
    color: ${variables.warmGrey};
    line-height: 0.9;
    margin-top: 6px;
  }

  .dev-item__paid {
    text-align: right;
    font-size: 12px;
    font-weight: 600;
    color: ${variables.avocado};
    margin-left: 20px;
  }

  .dev-item__inProgress {
    text-align: right;
    font-size: 12px;
    font-weight: 600;
    color: ${variables.brandPrimary};
    margin-left: 20px;
  }

  .dev-item__icons {
    color: ${variables.white};
    display: flex;
    align-items: center;
    margin-left: auto;
    cursor: pointer;
    flex-direction: column;
    justify-content: center;
    width: 2px;
  }

  .dev-item__icons-wrapper {
    position: relative;
    left: 92%;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.dev-item__icons-wrapper__set {
    background-color: ${variables.brandPrimary};
    padding: 7px;
    border-radius: 4px;
}

.dev-item__icons-wrapper__set--delete {
    background-color: ${variables.error60};
   
}

.dev-item__icons-wrapper__set--delete__drag {
    background-color: none;
    margin-right: 24px;
   
}
  .dev-item__icons p {
    color: ${variables.brandPrimary};
    font-size: 14px;
  }

  .dev-item__icons i {
    font-weight: bold;
    background-color: ${variables.brandPrimary};
    padding: 2px;
    border-radius: 4px;
    border: 2px solid white;
  }

  .dev-item__icons .el-icon-close {
    background-color: ${variables.error60};
  }

  .dev-item__icons i:not(:first-child) {
    /* margin-top: 20px; */
    /* border-radius: 16px;
    background-color: ${variables.seafoamBlue};
    font-weight: bold;
    padding: 3px; */
  }

  .dev-item__text--team {
    padding-left: 10px;
  }

  .dev-item__text--team:after {
    background-color: ${variables.avocado};
  }

  .dev-item__text--user {
    color: ${variables.brandPrimary} !important;
  }

  .dev-item__completed-img {
    width: 22px;
    height: 22px;
    background-color: ${variables.brandPrimary};
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 10px;
  }

  .dev-item__skill-tag {
    font-size: 12px;
    color: ${variables.brandPrimary};
    padding: 4px 16px 3px;
    background: ${variables.paleLilacTwo};
    display: inline-block;
    border-radius: 11px;
    margin: 0 14px 8px 0;
    opacity: 0.3;
  }

  @media ${variables.lg} {
    .dev-item__skill-tag {
      margin-right: 14px;
    }
  }

  .dev-item__caption {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin: 20px 0 0 0;
    max-width: 100%;
  }

  .dev-item__caption-name {
    font-size: 12px;
    color: ${variables.apple};
    cursor: pointer;
  }

  .dev-item__caption-name i {
    font-size: 12px;
    margin-right: 6px;
  }

  .dev-item__skill-tag--main {
    opacity: 1;
  }

  .clock-icon {
    font-size: 14px;
    margin-right: 5px;
    font-size: 20px !important;
    color: ${variables.hawkesBlue} !important;
  }

  .learning-item-new__input {
        padding: 0 90px 0 32px;
  }

  .learning-item__new__number {
    display: none;
    background: ${variables.white};
    border-radius: 50%;
    width: fit-content;
    position: absolute;
    left: 50%;
    top: -17px;
    border: 2px solid ${variables.brandPrimary};
    color: blue;
    width: 32px;
    height: 32px;
    font-family: Poppins;
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    line-height: 22px;
    /* text-align: center; */
    letter-spacing: 0.008em;
    color: ${variables.brandPrimary};
    align-items: center;
    justify-content: center;
  }

  textarea.el-textarea__inner {
    font-family: Poppins;
    background: ${variables.white};
    border: 1px solid ${variables.desaturatedBlue};
    box-sizing: border-box;
    border-radius: 4px;
    padding: 8px 16px;
    height: 60px;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 22px;
    color: ${variables.desaturatedBlue};
  }

  .el-textarea__inner::-webkit-input-placeholder {
    font-family: Poppins;
    color: ${variables.desaturatedBlue};
    font-size: 14px;
    line-height: 22px;
    padding-right: 50px;
  }

  .el-textarea__inner:-ms-input-placeholder {
    font-family: Poppins;
    color: ${variables.desaturatedBlue};
    font-size: 14px;
    line-height: 22px;
    padding-right: 50px;
  }

  .el-textarea__inner::placeholder {
    font-family: Poppins;
    color: ${variables.desaturatedBlue};
    font-size: 14px;
    line-height: 22px;
    padding-right: 100px;
  }

  .edit__icon {
    width: 18px;
    height: 18px;
  }

  svg.edit__icon path {
    fill: ${variables.gold};
  }

  .learning-item-new__certified {
    display: none;
  }

  .learning-item-new__certified--small {
    display: flex !important;
    background: ${variables.brandPrimary};
  }

  .learning-item-new__type {
    margin-right: 0 !important;
  }

  .tabs-label__order {
    font-weight: bold;
    font-size: 12px;
    line-height: 18px;
    text-align: center;
    letter-spacing: 0.008em;
    color: ${variables.desaturatedBlue};
    cursor: pointer;
    position: relative;
  }

  .tabs-label__order, .tabs-label__order div {
    display: flex;
  }

  .order__icon {
    margin-right: 3px;
  }
  
  svg.order__icon--green path {
    fill: ${variables.success80} !important;
  }

.learning-item-new__content--order {
    text-align: left;
    width: 100%;
    padding: 0px 24px 0 24px;
    margin-bottom: 24px;
}

.dev-item__icons-wrapper__set--delete__drag i{
    font-weight: bold;
    background-color: none;
    padding: 2px;
    border-radius: 4px;
    border: 2px solid ${variables.error60};
    color: ${variables.error60};
   
}
`
export default devStyle
