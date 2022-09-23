import css from 'styled-jsx/css'
import variables from './variables'

export const learningItemStyle = css.global`
  .learning-item {
    border-bottom: 1px solid ${variables.whiteFour};
  }

  .learning-item__label {
    display: flex;
    align-items: center;
    margin-bottom: 6px;
  }

  .learning-item__label-img {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    margin-right: 8px;
  }

  .learning-item__label-name {
    font-size: 12px;
    color: ${variables.warmGrey};
  }

  .learning-item__wrapper {
    display: flex;
    justify-content: space-between;
    margin-top: 17px;
  }

  .learning-item__wrapper i {
    height: auto;
    font-size: 15px;
    margin-right: 8px;
    color: ${variables.brandSecondary};
  }

  .learning-item__wrapper .learning-item__label-name {
    line-height: 0.9;
  }

  .learning-item__share-wrapper {
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
    align-items: center;
  }

  .learning-item__share-wrapper-items {
    justify-content: flex-start !important;
    align-items: center;
    display: flex;
  }

  .learning-item__share-wrapper-items .icon-bookmark {
    margin-left: 4px;
    cursor: pointer;
  }

  .learning-item__share {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-weight: 500;
    color: ${variables.apple};
  }

  .learning-item__share p {
    font-size: 12px;
    margin-left: 4px;
  }

  .learning-item__share i {
    font-size: 12px;
    color: ${variables.apple};
  }

  .learning-item__content {
    text-align: left;
    max-width: 75%;
  }

  .learning-item__title {
    display: flex;
    margin-bottom: 10px;
  }

  .learning-item__title a {
    font-size: 13px;
    font-weight: 600;
    margin-left: 20px;
  }

  .learning-item__is-new {
    font-size: 11px;
    height: 20px;
    margin-right: 6px;
    color: ${variables.fadedRed};
    border: 1px solid ${variables.fadedRed};
    text-transform: uppercase;
    padding: 4px 4px 3px 4px;
    display: inline-block;
    line-height: 1;
  }

  .learning-item__label-source-img {
    position: relative;
    overflow: hidden;
    width: 16px;
    height: 16px;
    margin-left: 4px;
    border: solid 0.5px ${variables.paleLilac};
    border-radius: 50%;
    background-color: white;
  }

  .learning-item__label-source-img img {
    width: 9px;
    height: auto;
    max-height: 11px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .learning-item__share-info {
    font-size: 14px;
    color: ${variables.black};
  }

  .learning-item__share-info--teams {
    font-size: 13px;
    max-width: 400px;
  }

  .learning-item__share-info span {
    color: ${variables.warmGrey};
  }

  .learning-item__share-info--img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    margin-right: 8px;
  }

  .learning-item__text {
    font-size: 14px;
    position: relative;
    line-height: 1.5;
    color: ${variables.black};
  }

  .learning-item__text span {
    color: ${variables.warmGrey};
  }

  .learning-item__sophistication {
    font-size: 9px;
    font-weight: 600;
    text-transform: uppercase;
    line-height: 1.29;
    letter-spacing: 2px;
    color: ${variables.warmGrey};
    padding-top: 3px;
  }

  .learning-item__text a {
    font-size: 14px;
    color: ${variables.black};
  }
  .learning-item__text:after {
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

  .learning-item__details {
    font-size: 12px;
    line-height: 0.9;
    margin-top: 6px;
    color: ${variables.brandPrimary};
  }

  .learning-item__author {
    font-size: 11px;
    color: ${variables.warmGrey};
    line-height: 0.9;
    margin-top: 6px;
  }

  .learning-item__skill-tag {
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
    .learning-item__skill-tag {
      margin-right: 14px;
    }
  }

  .learning-item__paid {
    text-align: right;
    font-size: 12px;
    font-weight: 600;
    color: ${variables.avocado};
    margin-left: 20px;
  }

  .learning-item__icons {
    display: flex;
    margin-left: auto;
    align-items: center;
  }

  .learning-item__icons i {
    cursor: pointer;
  }

  .learning-item__icons .icon-favorite {
    color: ${variables.warmGrey};
  }

  .learning-item__icons .icon-favorite__liked {
    color: ${variables.fadedRed};
    cursor: auto;
  }

  .learning-item__icons .icon-favorite:hover {
    color: ${variables.fadedRed};
  }

  .learning-item__icons .icon-ban {
    color: ${variables.warmGrey};
  }

  .learning-item__icons .icon-ban:hover {
    color: ${variables.black};
  }

  .learning-item__icons .icon-ban__disliked {
    color: ${variables.black};
    cursor: auto;
  }

  .learning-item__caption {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin: 20px 0;
    max-width: 100%;
  }

  .learning-item__caption-name {
    font-size: 12px;
    color: ${variables.apple};
    cursor: pointer;
  }

  .learning-item__caption-name i {
    font-size: 12px;
    margin-right: 6px;
  }

  .learning-item__text--team {
    padding-left: 10px;
  }

  .learning-item__text--team:after {
    background-color: ${variables.avocado};
  }

  .learning-item__icons--popover {
    border-top-left-radius: 100px;
    border-bottom-left-radius: 100px;
    border: solid 1px ${variables.brandPrimary};
    border-right: 0;
    background-color: rgba(231, 230, 255, 0.2);
    padding: 10px 14px 3px 14px;
    transform: translateX(17px);
    position: relative;
  }

  .learning-item__icons--popover::before {
    content: '';
    border: solid 2px rgba(90, 85, 171, 0.15);
    border-right: 0;
    border-top-left-radius: 100px;
    border-bottom-left-radius: 100px;
    position: absolute;
    width: 104%;
    height: 116%;
    transform: translate(-17px, -13px);
    /* top: 0;
  left: 0; */
    z-index: -1;
  }

  .learning-item__skill-tag--main {
    opacity: 1;
  }

  .learning-item__share--delete {
    color: ${variables.fadedRed};
  }

  .learning-item__share--delete i {
    color: ${variables.fadedRed};
  }
`
export default learningItemStyle
