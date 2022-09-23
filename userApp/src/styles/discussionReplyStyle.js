import css from 'styled-jsx/css'
import variables from '$/styles/variables'

export const discussionReplyStyle = css.global`
  .reply {
    background-color: ${variables.bodyBg};
    display: flex;
    gap: 0.5em;
    max-width: 41em;
    padding-left: 2em;
    margin-bottom: 1em;
    text-align: left;
    width: 100%;
  }

  .reply-arrow {
    position: relative;
    bottom: 0.2em;
  }

  .reply-main {
    display: flex;
    flex-direction: column;
    gap: 0.3em;
    width: 100%;
  }

  .reply-main__header {
    line-height: 1.375em;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .reply__title {
    font-size: 1em;
    font-weight: ${variables.bold700};
    line-height: 26px;
    color: black;
    text-align: left;
  }

  .reply-main__content {
    color: ${variables.textColor};
    text-align: left;
    font-size: 0.9em;
    width: inherit;
  }

  .reply-main__footer {
    color: ${variables.desaturatedBlue};
    font-size: 0.875em;
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
  }

  .header__date {
    font-size: 0.8em;
    font-weight: 400;
    color: ${variables.darkBlueTwo};
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
    max-width: 100%;
  }

  .footer__section__text {
    color: ${variables.desaturatedBlue};
  }

  .footer__section__text--clicked {
    color: ${variables.brandPrimary};
    font-weight: ${variables.bold700};
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

export default discussionReplyStyle
