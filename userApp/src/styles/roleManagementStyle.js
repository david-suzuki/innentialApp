import css from 'styled-jsx/css'
import variables from './variables'

export default css.global`
  .role-management__wrapper {
    padding: 22px 16px 22px 26px;
    border-radius: 4px;
    box-shadow: 0 6px 11px 5px rgba(0, 0, 0, 0.05);
    background-color: ${variables.white};
  }

  .role-management__group-heading {
    text-align: left;
    display: flex;
    justify-content: space-between;
    margin-top: 5px;
    padding: 7px 8px 6px 6px;
    background-color: ${variables.brandSecondary};
    border-radius: 5px;
    color: ${variables.white};
    font-size: 18px;
  }

  .role-management__group-heading span {
    display: flex;
    align-items: center;
    max-width: 540px;
  }

  .role-management__group-heading a {
    color: ${variables.white};
  }

  .role-management__group-heading__expand {
    cursor: pointer;
    border: 1px solid ${variables.white};
    border-radius: 50%;
    margin-right: 7px;
  }

  .role-management__group-heading__count {
    min-width: 20px;
    padding: 0px 7px;
    background-color: ${variables.white};
    color: ${variables.brandSecondary};
    border-radius: 40%;
    font-size: 12px;
    margin-left: 7px;
  }

  @media only screen and (max-width: 617px) {
    .role-management__add-role-button {
      margin-bottom: 10px;
    }
  }
`
