import css from 'styled-jsx/css'
import variables from '$/styles/variables'

export const discussionQuestionStyle = css.global`
  .question {
    background-color: ${variables.bodyBg};
    display: flex;
    gap: 0.5em;
    max-width: 45em;
    padding: 1em;
    margin-bottom: 1em;
    text-align: left;
    width: 100%;
    box-sizing: border-box;
    border: 2px solid ${variables.white};
  }

  .question-arrow {
    position: relative;
    bottom: 0.2em;
  }

  .question--highlight {
    animation: highlight 3s ease-in;
  }

  @keyframes highlight {
    0% {
      border: 2px solid ${variables.white};
    }
    40% {
      border: 2px solid ${variables.white};
    }
    50% {
      border: 2px solid ${variables.brandPrimary};
    }
    60% {
      border: 2px solid ${variables.white};
    }
    70% {
      border: 2px solid ${variables.brandPrimary};
    }
    80% {
      border: 2px solid ${variables.white};
    }
  }

  .question-main {
    display: flex;
    flex-direction: column;
    gap: 0.3em;
    width: inherit;
    position: relative;
  }

  .question-main__header {
    line-height: 1.375em;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .question__title {
    font-size: 1em;
    font-weight: ${variables.bold700};
    line-height: 26px;
    color: black;
    text-align: left;
    font-weight: bold;
  }

  .question-main__content {
    color: ${variables.textColor};
    text-align: left;
    font-size: 0.9em;
    position: relative;
  }

  .question-main__content-text {
    height: 100%;
    overflow: auto;
  }

  .question-main__content-text--on-path {
    height: 55px;
    overflow: hidden;
  }

  .question-main__content__cover {
    background: linear-gradient(to bottom right, #002f4b, #dc4225);
    opacity: 1;
    width: inherit;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.4) 0%,
      rgb(254, 255, 255) 100%
    );
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 36px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    top: 19px;
  }

  .question-main__content__cover:hover {
    background: linear-gradient(to bottom right, #002f4b, #dc4225);
    opacity: 1;
    width: inherit;
    background: linear-gradient(
      180deg,
      rgba(239, 238, 247, 0.4) 0%,
      rgba(239, 238, 247, 1) 100%
    );
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 51px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    top: 4px;
  }

  .question-main__content__cover:hover .cover__button {
    display: flex;
  }

  .cover__button {
    background: #5a55ab;
    border-radius: 36px;
    font-size: 13px;
    color: white;
    padding: 6px 20px;
    white-space: nowrap;
    cursor: pointer;
    box-sizing: border-box;
    outline: none;
    margin: 0;
    -webkit-transition: 0.1s;
    transition: 0.1s;
    border: none;
    display: none;
    align-items: center;
    gap: 5px;
    font-style: normal;
    font-weight: normal;
    letter-spacing: 0.8px;
    height: fit-content;
    cursor: pointer;
  }

  .cover__button img {
    width: 18px;
    height: 16px;
  }

  .question-main__footer {
    color: ${variables.desaturatedBlue};
    font-size: 14px;
    line-height: 22px;
    display: flex;
    gap: 1em;
    justify-content: flex-start;
    padding-top: 0.5em;
  }

  .header__badge {
    color: ${variables.white};
    background-color: #1cb55c;
    font-size: 0.75em;
    line-height: 1.8em;
    font-weight: ${variables.regular};
    padding: 2.5px 6px;
    border-radius: 4px;
    margin-right: 1.1em;
    letter-spacing: 0.4px;
  }

  .header__badge--empty {
    display: none;
  }

  .header__picture {
    height: 2.5em;
    width: 2.5em;
    border-radius: 50%;
  }

  .header__author {
    font-size: 0.85em;
    font-weight: 700;
    padding-inline: 0.5em;
    cursor: pointer;
  }

  .header__author::hover {
    font-size: 5em;
    font-weight: 700;
    padding-inline: 0.5em;
  }
  .header__date {
    font-size: 0.8em;
    font-weight: 400;
    color: ${variables.darkBlueTwo};
  }

  .header__hide {
    margin-left: auto;
    font-size: 14px;
    line-height: 22px;
    color: #5a55ab;
    display: flex;
    align-items: center;
    gap: 0.3em;
    cursor: pointer;
  }

  .header__hide img {
    transform: rotate(270deg);
  }

  .footer__section {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 14px;
  }

  .footer__section__icon {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding-right: 0.2em;
  }

  .footer__section__icon--right {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding-left: 0.2em;
  }

  .footer__section__text {
    color: ${variables.desaturatedBlue};
  }

  .footer__section__text--clicked {
    color: ${variables.brandPrimary};
    font-weight: ${variables.bold700};
  }

  .footer__dropdown {
    display: flex;
    flex-direction: column;
    gap: 14px;
    position: absolute;
    top: 22px;
    background: #ffffff;
    box-shadow: 0px 1px 4px rgba(0, 8, 32, 0.12),
      0px 4px 8px rgba(0, 8, 32, 0.08);
    border-radius: 4px;
    padding: 14px 80px 20px 14px;
    z-index: 22;
  }

  .reply__form {
    padding-top: 0.2em;
  }

  .reply__form__info {
    display: flex;
    align-items: flex-start;
    gap: 0.55em;
    border-radius: 5px;
    font-size: 0.8em;
    color: ${variables.desaturatedBlue};
    background: white;
    margin: 0;
    padding: 0;
    position: relative;
    bottom: 1.5em;
  }

  .reply__form__buttons {
  }

  .el-button {
    font-family: Poppins;
    border-radius: 100px;
    line-height: 22px;
    padding: 0.6em 2.3em;
    font-weight: ${variables.regular} !important;
    letter-spacing: 0.04em;
  }

  .el-button--primary span {
    font-size: 1em;
    font-weight: ${variables.regular} !important;
    letter-spacing: 0.008em;
  }

  .el-button--secondary {
    border: none;
  }

  .el-button--secondary span {
    font-size: 1em;
    font-weight: ${variables.regular} !important;
    letter-spacing: 0.008em;
  }

  .el-textarea__inner {
    font-family: Poppins;
    outline: 0;
    border: 1px solid ${variables.darkBlueTwo};
    border-width: 1px;
    border-radius: 4px;
    color: ${variables.black};
    font-size: 1em;
    padding: 13px 16px;
    margin: 0.75em 0 2em;
    background-color: ${variables.white};
  }

  .el-textarea__inner::-webkit-input-placeholder {
    color: ${variables.desaturatedBlue};
    font-family: Poppins;
    font-size: 1em;
  }

  .el-textarea__inner:-ms-input-placeholder {
    color: ${variables.desaturatedBlue};
    font-family: Poppins;
    font-size: 1em;
  }

  .el-textarea__inner::-ms-input-placeholder {
    color: ${variables.desaturatedBlue};
    font-family: Poppins;
    font-size: 1em;
  }

  .el-textarea__inner::placeholder {
    color: ${variables.desaturatedBlue};
    font-family: Poppins;
    font-size: 1em;
  }
`

export default discussionQuestionStyle
