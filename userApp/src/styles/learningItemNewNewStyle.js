import css from 'styled-jsx/css'
import variables from './variables'

export const learningItemNewStyle = css.global`
  .learning-path-item {
    margin: 10px 10px 30px 10px;
    padding: 20px 30px;
    box-shadow: 0 6px 11px 5px rgba(0, 0, 0, 0.05);
  }
  .learning-path-item:hover {
    box-shadow: 0 6px 11px 5px rgba(0, 0, 0, 0.11);
  }

  .learning-item-new {
    background-color: ${variables.white};
    border-radius: 10px;
    box-shadow: 0 4px 8px 0 rgba(0, 8, 32, 0.06),
      0 1px 4px 0 rgba(0, 8, 32, 0.08);
    margin-bottom: 24px;
    border-bottom: none !important;
    padding: 0 !important;
  }

  .learning-item-new .goal-item__cardContainer {
    border: none !important;
    box-shadow: none !important;
  }

  .learning-item-new .goal-item__cardContainer .goal-item__cardBody {
    padding: 10px 24px 32px !important;
  }

  .learning-item-new--no-box {
    box-shadow: none;
    padding: 16px 0 24px !important;
  }

  .learning-item-new__wrapper {
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-top: 17px;
  }

  .learning-item-new__certified {
    position: absolute;
    margin: -21px 0 0 -18px;
    cursor: pointer;
  }

  .learning-item-new__certified--dev-plan {
    margin: -35px 0 0 -40px;
  }

  .learning-item-new__certified:hover {
    transform: scale(1.1);
  }

  .learning-item-new__certified__ribbon {
    position: absolute;
    top: 9px;
    left: 9px;
  }

  .learning-item-new__content {
    text-align: left;
    width: 100%;
    padding: 36px 24px 0 32px !important;
    margin-bottom: 24px;
  }

  .learning-item-new__content i {
    height: auto;
    font-size: 15px;
    margin-right: 8px;
    color: ${variables.brandSecondary};
  }

  .learning-item-new__image {
    width: 230px;
    height: auto;
  }

  .learning-item-new__image img {
    object-fit: cover;
    width: 100%;
    height: auto;
  }

  .learning-item-new__price {
    font-weight: ${variables.bold700};
    font-size: 14px;
    border: 1px solid;
    padding: 2px 5px;
    border-radius: 4px;
  }

  .learning-item-new__label {
    display: flex;
    align-items: center;
    margin: 16px 0 12px 0;
    font-size: 12px;
    color: ${variables.warmGrey};
    line-height: 0.9;
  }

  .learning-item-new__duration {
    max-width: 250px;
    font-weight: ${variables.bold700};
    font-size: 12px;
    line-height: 18px;
    color: ${variables.desaturatedBlue};
    display: flex;
    align-items: end;
  }

  .learning-item-new__label-tags-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  @media ${variables.xxs} {
    .learning-item-new__label-tags-wrapper {
      display: block;
    }

    .learning-item-new__duration {
      margin-top: 10px;
    }
  }

  .learning-item-new__logo {
    height: 25px;
    contain: content;
    margin-right: 24px;
    margin-top: 5px;
    line-height: 22px;
    font-weight: bold;
    font-size: 12px;
    color: ${variables.warmGrey};
  }

  .learning-item-new__label-source-image {
    height: 100%;
    background-color: white;
  }

  .learning-item-new__title a {
    font-size: 16px;
    font-weight: 800;
    line-height: 1.67;
    color: ${variables.black};
  }

  .learning-path-item__title-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .learning-path-item__title {
    font-size: 20px;
    color: ${variables.black};
    font-weight: bold;
    max-width: 75%;
  }

  .learning-path-item__goal {
    font-weight: 600;
    font-size: 13px;
    margin: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .learning-path-item__goal__name {
    color: #556685;
    font-size: 14px;
    font-weight: normal;
  }

  .learning-path-item__goal__content {
    color: ${variables.black};
  }

  .learning-path-item__goal__content-length {
    background-color: ${variables.duskyBlue};
    color: ${variables.white};
    font-weight: 500;
    font-size: 11px;
    position: absolute;
    margin: 12px 0px 0px -24px;
    border-radius: 10px;
    padding: 0px 10px;
    opacity: 0.9;
  }

  .learning-path-item__description {
    font-size: 16px;
    color: #556685;
    text-align: justify;
  }

  .learning-item-new__author {
    font-size: 12px;
    color: #556685;
    line-height: 1.6;
    margin-top: 6px;
  }

  .learning-item-new__skills {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 0 24px 24px 32px;
  }

  .learning-item-new__skill-tag {
    font-size: 12px;
    font-weight: bold;
    color: ${variables.brandPrimary};
    padding: 8px 15px;
    background: #f9f8fc;
    display: inline-block;
    border-radius: 4px;
    margin: 0 14px 8px 0;
    opacity: 0.3;
  }
  @media ${variables.lg} {
    .learning-item-new__skill-tag {
      margin-right: 14px;
    }
  }
  @media ${variables.xxs} {
    .learning-item-new__skill-tag {
      padding: 8px;
    }
  }

  .learning-item-new__skill-tag--main {
    opacity: 1;
  }

  .learning-item-new__action {
    display: flex;
    justify-content: space-between;
    padding: 15px 24px 15px 32px;
    border-top: 1px solid ${variables.whiteFive};
  }

  .learning-item-new__options {
    display: flex;
    // flex-wrap: wrap;
    justify-content: flex-end;
  }

  .learning-item-new__options > .call-to-action__option {
    padding-left: 14px;
  }

  .learning-item-new__options > .call-to-action__option p {
    max-width: 144px;
  }

  @media ${variables.xs} {
    .learning-item-new__options {
      flex-wrap: wrap;
      justify-content: space-evenly;
    }
  }

  .learning-item-new__goal {
    display: flex;
    margin-bottom: 26px;
    align-items: center;
  }

  .learning-item-new__goal--completed {
    opacity: 0.7;
  }

  .learning-item-new__goal a {
    font-size: 13px;
    font-weight: 600;
    margin-left: 14px;
  }

  .learning-item-new__goal p {
    font-size: 13px;
    font-weight: 600;
    margin-left: 14px;
    color: ${variables.linkColor};
  }

  .learning-item-new__goal span {
    font-size: 13px;
  }

  .learning-item-new__label-tags {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .learning-item-new__label-tag {
    font-size: 12px;
    font-weight: bold;
    margin-right: 6px;
    padding: 6px 5px;
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
  }

  .learning-item-new__share-info {
    font-size: 14px;
    color: ${variables.black};
  }

  .learning-item-new__share-info--teams {
    font-size: 13px;
    max-width: 400px;
  }

  .learning-item-new__share-info span {
    color: ${variables.warmGrey};
  }

  .learning-item-new__share-info--img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    margin-right: 8px;
  }

  .learning-item-new__share-wrapper {
    justify-content: flex-start !important;
    align-items: center;
    display: flex;
    margin-bottom: 8px;
  }

  .learning-item-new__level {
    font-size: 9px;
    font-weight: 600;
    text-transform: uppercase;
    line-height: 1.29;
    letter-spacing: 2px;
    color: ${variables.warmGrey};
    padding-top: 3px;
  }

  .learning-path-item__learning-goals-title {
    font-size: 14px;
    color: black;
  }

  .learning-path-item__learning-skills-title {
    font-size: 14px;
    color: #152540;
    font-weight: normal;
  }

  @media screen and (min-width: 892px) {
    .learning-path-item__learning-goals-title {
      margin-top: 30px;
    }
  }
  @media screen and (max-width: 1200px) {
    .learning-path-item__learning-skills-title {
      margin-top: 30px;
    }
  }

  .learning-path-item__info {
    display: flex;
  }

  @media screen and (max-width: 892px) {
    .learning-path-item__info {
      display: block;
    }
  }

  .learning-path-item__info-left {
    flex-basis: 60%;
    padding-right: 30px;
  }
  .learning-path-item__info-right {
    flex-basis: 390px;
  }

  @media screen and (min-width: 1200px) {
    .learning-path-item__info-right {
      position: relative;
      top: 35px;
    }
  }

  .learning-path-item__goal__name {
    display: flex;
    align-items: center;
  }

  .learning-path-item__goal-number {
    width: 35px;
    height: 35px;
    background-color: #f9f8fc;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    margin-right: 10px;
    margin-left: -10px;
  }

  .learning-path-item__goal-number span {
    color: ${variables.brandPrimary};
    font-weight: bold;
    font-size: 14px;
    line-height: 22px;
  }

  .learning-item-new__type {
    margin-right: 10px;
    display: flex;
  }

  .learning-item-new__note-box .el-message-box__message {
    padding: 10px;
    font-style: italic;
    border: 1px solid ${variables.whiteFive};
  }

  .learning-item-new__delivery-box .el-message-box__message {
    padding-left: 12px;
  }

  .learning-item-new__delivery-box h4 {
    margin-top: 12px;
  }

  .learning-item-new__delivery-box__footer {
    padding-top: 12px;
    margin: 0 auto;
    text-align: center;
  }

  .learning-item-new__delivery-note-box {
    padding: 10px;
    border: 1px solid ${variables.whiteFive};
  }

  .learning-item-new__delivery-note-box > ul {
    padding-left: 24px;
  }

  .learning-item-new__delivery-note-box > ol {
    padding-left: 24px;
  }

  .learning-item-new__info-box {
    display: flex;
    background-color: #efeef7;
    padding: 16px 24px;
    margin: 0 auto 16px;
    border-radius: 4px;
  }

  .info-box--icon {
    width: 24px;
    height: 24px;
  }

  .info-box--content {
    color: ${variables.brandPrimary};
    font-size: 14px;
    line-height: 22px;
    margin-left: 16px;
    text-align: left;
  }

  .info-box--content ol {
    padding-left: 20px;
  }

  .info-box--content ul {
    padding-left: 20px;
  }

  .learning-item-new__cta {
    text-align: left;
  }

  .learning-item-new__cta__button {
    font-weight: 600 !important;
    font-family: Poppins;
    font-size: 14px;
  }

  .learning-item-new__input {
    display: none;
    margin-bottom: 20px;
  }

  .learning-item-new__certified--small {
    background: ${variables.brandPrimary};
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0px 5px 4px 5px;
    border-radius: 4px;
  }

  .learning-item-new__certified--small-tooltip {
    padding-bottom: 1px;
  }

  .learning-item-new__certified__ribbon-small {
    width: 16px;
    height: 16px;
    position: relative;
    top: 4px;
  }
`
export default learningItemNewStyle
