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

  .learning-item-new__wrapper {
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-top: 17px;
  }

  .learning-item-new__content {
    text-align: left;
    max-width: 75%;
  }

  .learning-item-new__content i {
    height: auto;
    font-size: 15px;
    margin-right: 8px;
    color: ${variables.brandSecondary};
  }

  .learning-item-new__label {
    display: flex;
    align-items: center;
    margin-bottom: 6px;
    font-size: 12px;
    color: ${variables.warmGrey};
    line-height: 0.9;
  }

  .learning-item-new__label-source-image {
    width: 16px;
    height: 16px;
    margin-left: 4px;
    border: solid 0.5px ${variables.paleLilac};
    border-radius: 50%;
    background-color: white;
  }

  .learning-item-new__title a {
    font-size: 14px;
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
    font-size: 11px;
    color: ${variables.warmGrey};
    line-height: 0.9;
    margin-top: 6px;
  }

  .learning-item-new__skills {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin: 20px 0;
  }

  .learning-item-new__skill-tag {
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
    .learning-item-new__skill-tag {
      margin-right: 14px;
    }
  }

  .learning-item-new__skill-tag--main {
    opacity: 1;
  }

  .learning-item-new__option-group {
    margin-bottom: 10px;
  }

  .learning-item-new__option {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-weight: 500;
    font-size: 12px;
  }

  .learning-item-new__option:hover {
    opacity: 0.7;
  }

  .learning-item-new__option p {
    margin-left: 4px;
  }

  .learning-item-new__goal {
    display: flex;
    margin-bottom: 10px;
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

  .learning-item-new__label-tags {
    margin-bottom: 10px;
  }

  .learning-item-new__label-tag {
    font-size: 10px;
    font-weight: bold;
    height: 20px;
    margin-right: 6px;
    text-transform: uppercase;
    padding: 6px 4px 3px 4px;
    display: inline-block;
    line-height: 1;
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
`
export default learningItemNewStyle
