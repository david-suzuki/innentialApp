import css from 'styled-jsx/css'
import variables from './variables'

export const actionDropdownStyle = css.global`
  .action-dropdown-wrapper {
    position: relative;
  }

  .action-dropdown-trigger {
    float: right;
    color: ${variables.duskyBlue};
    cursor: pointer;
  }

  .action-dropdown-trigger .icon {
    color: ${variables.duskyBlue};
  }

  .action-dropdown {
    position: absolute;
    background-color: transparent;
    right: 0;
    top: 20px;
    visibility: hidden;
    opacity: 0;
    transition: all 400ms;
    min-width: 200px;
    width: auto;
  }

  .development-plan__container .action-dropdown {
    background: #ffffff;
    border-radius: 4px;
    min-width: 110px;
    padding: 8px;
    font-family: 'Poppins', sans-serif;
    font-weight: bold;
    font-size: 16px;
    line-height: 26px;
    top: 35px;
    color: #8494b2;
    box-shadow: 0px 1px 4px rgba(0, 8, 32, 0.1),
      0px 16px 32px rgba(0, 8, 32, 0.1);
  }

  .action-dropdown ul {
    padding: 0;
  }

  .action-dropdown ul li {
    list-style: none;
    line-height: 10px;
    font-size: 12px;
    text-align: right;
    padding: 0;
  }

  .action-dropdown ul li span.development-plan__completed__span {
    cursor: pointer;
  }
  @media ${variables.lg} {
    .action-dropdown ul li span.development-plan__completed__span {
      display: none;
    }
  }

  .action-dropdown ul li:not(:first-child) {
    padding-top: 5px;
  }

  .action-dropdown ul li a {
    color: ${variables.brandPrimary};
    font-size: 9px;
    line-height: 9px;
    cursor: pointer;
  }
  @media ${variables.md} {
    .action-dropdown ul li {
      font-size: 11px;
      line-height: 11px;
    }
    .action-dropdown ul li a {
      font-size: 11px;
      line-height: 11px;
    }
  }

  .action-dropdown.is-active {
    visibility: visible;
    opacity: 1;
  }
`
export default actionDropdownStyle
