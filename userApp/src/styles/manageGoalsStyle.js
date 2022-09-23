import css from 'styled-jsx/css'
import variables from './variables'

export const manageGoalsStyle = css.global`
  .manage-goals {
    position: relative;
    padding-top: 20px;
  }

  .manage-goals__title {
    display: flex;
    justify-content: space-between;
    font-size: 22px;
    font-weight: 800;
    text-align: left;
    padding-bottom: 20px;
  }

  .manage-goals__info-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 25px 0 10px;
    position: relative;
  }

  .manage-goals__info-active {
    font-size: 15px;
    font-weight: 600;
  }

  .manage-goals__info-active span {
    font-weight: 800;
    margin-left: 5px;
  }

  .manage-goals__info-draft {
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 10px;
    text-align: left;
  }

  .manage-goals__info-draft span {
    font-weight: 800;
    margin-left: 5px;
  }

  .manage-goals__info-button {
    font-size: 12px;
  }

  .manage-goals__info-button-icon {
    margin-left: 10px;
  }

  .manage-goals__button-create {
    position: fixed;
    right: 0;
    top: auto;
    left: 50%;
    transform: translateX(-50%);
    bottom: 50px;
    z-index: 100;
  }

  @media ${variables.lg} {
    .manage-goals__button-create {
      top: 70px;
      position: absolute;
      left: auto;
      transform: none;
      bottom: auto;
    }
  }

  .goals-tabs .tabs-list {
    margin-bottom: 14px;
  }

  .goals-placeholder__wrapper {
    box-shadow: 0 6px 11px 5px rgba(0, 0, 0, 0.05);
    padding: 22px 16px 22px 26px;
    text-align: left;
    font-size: 13px;
  }

  .goals-placeholder__title {
    font-size: 24px;
    font-weight: bold;
    color: ${variables.brandPrimary};
  }
`
export default manageGoalsStyle
