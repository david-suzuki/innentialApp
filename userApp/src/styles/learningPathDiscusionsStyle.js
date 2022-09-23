import css from 'styled-jsx/css'
import variables from './variables'

export const learningPathDiscusionsStyle = css.global`
  .component-block--paths {
    padding: 0;
  }

  .discussions__header {
    display: flex;
    gap: 1em;
    padding-bottom: 1.7em;
  }

  .discussions__content ul {
    list-style: none;
  }

  .discussions__content-header {
    text-align: left;
    font-size: 1.2em;
    font-weight: ${variables.bold};
    line-height: 26px;
    padding-bottom: 0.5em;
  }

  .discussions__path-name {
    font-size: 0.9em;
    font-weight: ${variables.bold700};
    color: ${variables.brandPrimary};
    text-align: left;
    display: flex;
    gap: 0.5em;
    font-weight: bold;
    margin-bottom: 12px;
  }

  .header__button {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #efeef7;
    border: 0;
    border-color: #dcdfe6;
    color: #6b66b3;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    margin: 0;
    transition: 0.1s;
    font-weight: 500;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    font-size: 12px;
    border-radius: 100px;
    padding: 8px 20px;
    letter-spacing: 0.008em;
    display: flex;
    align-items: center;
    gap: 0.5em;
  }

  .header__button > svg > path {
    fill: ${variables.brandPrimary};
  }

  .header__button__image {
    height: 18px;
    width: 16px;
  }

  .header__button--primary {
    color: #ffffff !important;
    background-color: #5a55ab;
    font-weight: ${variables.bold700};
  }

  .header__button--primary > svg > path {
    fill: ${variables.white};
  }

  .header__button:hover {
    background: #7b77bc;
    border-color: #5a55ab;
    color: #ffffff;
  }

  .header__button:hover > svg > path {
    fill: ${variables.white};
  }

  @media (max-width: 470px) {
    .header__button__image {
      height: 16px;
      width: 14px;
    }

    .header__button {
      font-size: 11px;
      padding: 8px 14px;
      letter-spacing: 0.007em;
      gap: 0.3em;
    }

    .discussions__header {
      gap: 0.7em;
    }
  }

  @media (max-width: 390px) {
    .header__button__image {
      height: 14px;
      width: 13px;
    }

    .header__button {
      padding: 8px 12px;
      letter-spacing: 0.007em;
    }

    .discussions__header {
      gap: 0.3em;
    }
  }
`
export default learningPathDiscusionsStyle
