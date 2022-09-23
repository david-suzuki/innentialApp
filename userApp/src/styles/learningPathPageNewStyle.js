import css from 'styled-jsx/css'
import variables from './variables'

export default css.global`
  .learning-path__background {
    max-height: 400px;
    padding-left: 50px;
    object-fit: contain;
    position: absolute;
    left: 65%;
  }

  .learning-path__path-panel {
    width: 100%;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-top: 43px;
  }

  .learning-path__info-panel {
    max-width: 65%;
    width: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .learning-path__author-info {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .learning-path__author-avatar {
    display: flex;
    align-items: center;
  }

  .learning-path__author-avatar img {
    max-width: 48px;
    border-radius: 50px;
  }

  .learning-path__information {
    display: flex;
    align-items: flex-start;
    padding-left: 8px;
  }

  .learning-path__information span {
    font-size: 12px;
    font-weight: bold;
    line-height: 18px;
    padding-left: 2px;
  }

  .learning-path__information span:first-child {
    color: #8494b2;
    font-weight: normal;
  }

  .learning-path__information span:last-child {
    color: #3b4b66;
    font-weight: bold;
  }

  .learning-path__title {
    font-weight: 900;
    font-size: 32px;
    line-height: 52px;
    color: #152540;
    text-align: left;
    padding-top: 20px;
    margin: 0;
  }

  .learning-path__subtitle {
    font-weight: bold;
    font-size: 16px;
    line-height: 26px;
    color: #556685;
    text-align: left;
    padding-top: 8px;
    margin: 0;
  }

  .learning-path__description {
    padding-top: 16px;
    font-size: 16px;
    text-align: left;
    line-height: 26px;
    font-weight: normal;
  }

  .learning-path__description p,
  .learning-path__description li {
    font-size: 16px;
    text-align: left;
    line-height: 26px;
    font-weight: normal;
    display: none;
  }

  .learning-path__description ol,
  .learning-path__description ul {
    margin-left: 20px;
  }

  .limit p:first-child {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3; /* number of lines to show */
    -webkit-box-orient: vertical;
  }

  .read-more li {
    display: list-item;
    font-weight: normal;
  }

  .read-more p {
    display: block;
  }

  
  .learning-path__extra-info {
    background: #ffffff;

    /*border: 1px solid #6B66B3;*/

    /*box-shadow: 0 0 0 6px #EFEEF7;*/
    border-radius: 8px;
    /*padding: 32px 20px;*/
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 30px;
  }

  .learning-path__extra-info h2 {
    color: #152540;
    margin: 0;
    font-weight: 900;
    font-size: 24px;
    text-align: left;
    line-height: 38px;
  }

  .learning-path__skill-sets {
    text-align: left;
    margin-top: 28px;
  }

  .learning-path__skill-sets-body {
    display: flex;
    flex-wrap: wrap;
  }

  .learning-path__skill-sets span {
    margin-right: 16px;
    margin-bottom: 5px;
    display: block;
  }

  .learning-path__skill-sets-title {
    font-family: 'Poppins', sans-serif;
    font-style: normal;
    font-weight: 900;
    font-size: 20px;
    line-height: 32px;
    color: #152540;
    padding: 24px 0;
  }

  .learning-path__goal-steps {
    flex-direction: column;
  }
  .learning-path__step-container {
    position: relative;
    border-left: 2px solid #efeef7;
    margin-left: 30px;
    z-index: 1;
    padding-bottom: 30px;
  }

  .learning-path__step-title {
    display: flex;
    align-items: flex-start;
    position: inherit;
    left: -13px;
    z-index: 2;
    top: 0px;
  }

  .learning-path__title-icon {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px 0;
    background: white;
  }

  .learning-path__title-icon span {
    color: #5a55ab;
    font-size: 24px;
    line-height: 24px;
    font-weight: 800;
    z-index: 2;
  }

  .learning-path__title-icon span:first-child {
    font-size: 10px;
    line-height: 16px;
    font-weight: 700;
  }

  .learning-path__step-title img {
    position: absolute;
    z-index: 1;
  }

  .learning-path__step-title h2 {
    padding: 10px 0px 10px 35px;
    font-size: 24px;
    font-weight: 900;
    line-height: 38px;
    color: #152540;
    margin: 0px;
    text-align: left;
  }

  .first {
    margin-top: 100px;
  }

  .last {
    border: none !important;
  }

  .learning-path__border-element {
    border-left: 2px solid #efeef7;
    border-bottom: 2px solid #efeef7;
    width: 38px;
    position: absolute;
    z-index: 1;
    top: 56px;
  }

  .learning-path__back__button {
    font-size: 17px;
    cursor: pointer;
    color: ${variables.brandPrimary};
    border: 1px solid;
    width: 28px;
    height: 28px;
    border-radius: 20px;
    border-color: ${variables.paleLilac};
    background-color: ${variables.paleLilac};
    padding: 5px 0 0;
    float: left;
    margin-bottom: -20px;
  }

  .learning-path__back__button--secondary {
    font-size: 13px;
    font-weight: bold;
    cursor: pointer;
    color: ${variables.brandPrimary};
    padding: 5px;
    margin-bottom: -20px;
    display: flex;
    align-items: center;
  }
  .learning-path__back__button--secondary i {
    font-size: 15px;
    font-weight: bold;
    position: relative;
    bottom: 1px;
    right: 2px;
  }

  .learning-path__back__button:hover {
    opacity: 0.7;
  }

  .learning-path__footer-button {
    font-weight: bold;
    font-size: 16px;
    line-height: 26px;
    padding: 10px 40px;
    border-radius: 100px;
  }

  .learning-path__footer-button:disabled {
    color: #556685 !important;
    border-color: #d9e1ee !important;
  }

  .learning-path__footer-button--assign {
    background-color: white;
    border-color: #d9e1ee;
    color: #556685;
  }

  .learning-path__footer-button--claim {
    background-color: #5a55ab;
    border-color: #5a55ab;
    color: white;
  }

  .learning-path__footer-button--progress {
    background-color: #54d4c9;
    border-color: #54d4c9;
    color: white;
  }

  .learning-path__footer-button--progress:hover {
    background-color: white;
    border-color: #54d4c9;
    color: #54d4c9;
  }

  .learning-path__footer-button--completed {
    background-color: #3b4b66;
    border-color: #3b4b66;
    color: white;
    margin-left: 10px;
  }

  .learning-path__footer-button--completed:hover {
    background-color: white;
    border-color: #3b4b66;
    color: #3b4b66;
  }

  .learning-path__footer-button--request {
    background-color: ${variables.seafoamBlue};
    border-color: ${variables.seafoamBlue};
  }

  .learning-path__footer-button--assign:hover {
    color: #5a55ab;
    background-color: ${variables.white};
    border-color: #5a55ab;
  }

  .learning-path__footer-button--claim:hover {
    color: #5a55ab;
    background-color: ${variables.white};
    border-color: #5a55ab;
  }

  .learning-path__footer-button--request:hover {
    color: ${variables.seafoamBlue};
    background-color: ${variables.white};
    border-color: ${variables.seafoamBlue};
  }

  .learning-path__heading-wrapper {
    display: flex;
    align-items: center;
    margin-top: 50px;
  }

  .learning-path__heading-wrapper-left {
    flex-basis: 50%;
  }

  .learning-path__details-button {
    font-size: 12px;
    font-weight: bold;
    line-height: 18px;
    letter-spacing: 0.008em;
    color: #5a55ab;
    width: fit-content;
    box-sizing: border-box;
    border-radius: 100px;
    float: left;
    padding: 10px 0px;
    cursor: pointer;
  }

  .learning-path__details-button i {
    font-size: 15px;
    font-weight: bold;
    position: relative;
    bottom: -4px;
    right: -2px;
  }

  .page-footer--fixed-path {
    position: sticky;
    width: 100vw;
    margin-left: calc(510px - 50vw);
    top: auto;
    bottom: 0;
    right: 0;
    box-shadow: 0px -1px 4px RGBA(0, 8, 32, 0.04),
      0px -16px 32px RGBA(0, 8, 32, 0.04);
  }

  .learning-path__author {
    font-size: 12px;
    line-height: 16px;
    color: #8494b2;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .learning-path__author-info {
    display: flex;
    margin-top: 5px;
    align-items: center;
  }

  .learning-path__author-info-image {
    border-radius: 50%;
    margin-right: 5px;
  }

  .learning-path__author-info-name {
    font-size: 13px;
    line-height: 16px;
    color: #3b4b66;
  }

  // .el-button--primary {

  // }

  // .el-button--primary span {
  //   font-size: 1em;
  //   font-weight: 700;
  //   display: flex:
  //   align-items: center;
  //   gap: .5em;
  // }

  @media (max-width: 1200px) {
    .learning-path__background {
      display: none;
    }
    .first {
      margin-top: 60px;
    }
    .learning-path__info-panel {
      max-width: 100%;
    }
    .page-footer--fixed-path {
      margin-left: calc(480px - 50vw);
    }
  }

  @media only screen and (max-width: 890px) {
    .learning-path__heading-wrapper {
      display: flex;
      flex-direction: column-reverse;
    }
    .learning-path__goal {
      margin-left: 0;
      margin-right: 0;
    }
    .page-footer--fixed-path {
      margin-left: -25px;
    }
  }
  @media only screen and (max-width: 890px) {
    .learning-path__title {
      text-align: left;
    }
  }
`
