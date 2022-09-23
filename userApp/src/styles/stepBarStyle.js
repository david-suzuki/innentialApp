import css from 'styled-jsx/css'
import variables from './variables'

export const stepBarStyle = css.global`
  .step-bar {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .step-bar__menu {
    position: relative;
    color: ${variables.brandPrimary};
    font-size: 14px;
    cursor: pointer;
    width: 35px;
  }

  .step-bar__dropdown {
    position: absolute;
    background-color: transparent;
    right: 0;
    visibility: hidden;
    opacity: 0;
    transition: all 400ms;
  }

  .step-bar__dropdown ul {
    padding: 0;
  }

  .step-bar__dropdown ul li {
    list-style: none;
    line-height: 10px;
    font-size: 12px;
    text-align: right;
    background: white;
    padding: 0 4px;
  }

  .step-bar__dropdown ul li:not(:first-child) {
    padding-top: 5px;
  }

  .step-bar__dropdown ul li a {
    color: ${variables.brandPrimary};
    font-size: 9px;
    line-height: 9px;
    cursor: pointer;
  }
  @media ${variables.md} {
    .step-bar__dropdown ul li {
      font-size: 11px;
      line-height: 11px;
    }
    .step-bar__dropdown ul li a {
      font-size: 11px;
      line-height: 11px;
    }
  }

  .step-bar__dropdown.is-active {
    visibility: visible;
    opacity: 1;
  }

  .step-bar__progressbar {
    width: 100%;
  }

  .progressbar {
    padding: 18px 0 40px 0;
  }
  .progressbar li {
    list-style-type: none;
    float: left;
    position: relative;
    text-align: center;
    font-size: 12px;
    color: ${variables.warmGreyTwo};
  }
  .progressbar__number {
    width: 16px;
    height: 16px;
    line-height: 15px;
    cursor: pointer;
    background-color: ${variables.white};
    border: 1px solid ${variables.whiteTwo};
    font-size: 10px;
    display: block;
    text-align: center;
    margin: 0 auto 15px auto;
    border-radius: 50%;
  }
  .progressbar__number:hover,
  .progressbar--active .progressbar__number {
    background-color: ${variables.brandPrimary};
    border-color: ${variables.brandPrimary};
    color: ${variables.white};
    font-size: 14px;
    font-weight: bold;
    width: 26px;
    height: 26px;
    line-height: 23px;
    margin-top: -5px;
    margin-bottom: 10px;
  }
  .progressbar li:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 1px;
    background-color: ${variables.whiteTwo};
    top: 8px;
    left: -50%;
    z-index: -1;
  }
  .progressbar li:first-child:after {
    content: none;
  }
  .progressbar--higlighted .progressbar__number {
    color: ${variables.brandPrimary};
    border-color: ${variables.brandPrimary};
  }
  .progressbar--higlighted .progressbar__number:hover {
    color: ${variables.white};
  }
  .progressbar li.progressbar--higlighted:after,
  .progressbar li.progressbar--active:after {
    background-color: ${variables.brandPrimary};
    height: 2px;
  }
`
export default stepBarStyle
