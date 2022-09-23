import css from 'styled-jsx/css'
import variables from './variables'

export const manageUsersStyle = css.global`
  .manage-users__button-create {
    border-radius: 0;
    width: 100%;
    font-size: 18px;
  }

  .manage-users__button-container {
    display: none;
    justify-content: space-between;
    // width: 33%;
  }

  .manage-users {
    position: relative;
    padding-top: 20px;
  }
  .manage-users__title {
    font-size: 22px;
    font-weight: 800;
    text-align: left;
    padding-bottom: 20px;
  }

  .manage-users__input {
    margin-bottom: 35px;
  }

  .manage-users__no-results {
    font-size: 13px;
  }

  .manage-users__filters {
    display: none;
    text-align: left;
    width: 207px;
    position: fixed;
    z-index: 10;
    top: 30px;
    left: 99%;
    /* transform: translateX(100%); */
    padding: 0 10px 0 10px;
    margin: 21px 0 0 10px;
  }

  @media screen and (min-width: 1300px) {
    .manage-users__filters {
      width: 260px;
      left: 105%;
    }
  }

  @media screen and (min-width: 1440px) {
    .manage-users__filters {
      width: 320px;
    }
  }

  @media ${variables.lg} {
    .manage-users__button-container {
      display: flex;
    }
    .manage-users__filters {
      display: block;
    }
  }
`
export default manageUsersStyle
