import css from 'styled-jsx/css'
import variables from './variables'

// REMOVED FLEX FROM REVIEW-ITEM HEADING CAUSE IT FLEXES TOO MUCH ANYWAYS
/* 
  .review-item__heading {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    border-bottom: 1px solid ${variables.whiteFour};
  }
*/

export const reviewItemStyle = css.global`
  .review-item__wrapper {
    padding: 22px 16px 60px 26px;
    border-radius: 4px;
    box-shadow: 0 6px 11px 5px rgb(0 0 0 / 5%);
    background-color: ${variables.white};
    margin-bottom: 22px;
  }

  .review-item {
    border-bottom: none !important;
    padding-bottom: 0px !important;
  }

  .review-item__heading__info {
    text-align: left;
    font-size: 15px;
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;
  }

  .review-item__title,
  .review-item__title a {
    font-size: 15px;
    font-weight: 800;
    color: ${variables.black};
    padding-top: 7px;
    display: flex;
    align-items: center;
  }

  .review-item__affected-teams {
    color: ${variables.warmGrey};
    text-align: left;
    font-size: 13px;
  }

  .review-item__stats__container {
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
  }

  .review-item__stats {
    font-size: 13px;
    padding-bottom: 20px;
    width: 50%;
    text-align: left;
  }

  .review-item__stats--grey {
    color: ${variables.warmGrey};
    padding-right: 7px;
  }

  .review-item__content {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    padding-top: 20px;
    padding-bottom: 10px;
    border-top: 1px solid;
    border-color: ${variables.whiteFive};
  }
  .review-item__content__details {
    font-size: 13px;
    text-align: left;
    color: ${variables.warmGrey};
    font-weight: 400;
  }

  .review-item__date__container {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
  }

  .review-item__date {
    color: ${variables.brandPrimary};
    font-size: 13px;
    width: 50%;
    text-align: left;
  }

  .review-item__date--grey {
    color: ${variables.warmGrey};
    padding-left: 7px;
  }

  .review-item__button-container-margin {
    margin-top: 15px;
  }

  .review-item__button {
    font-size: 12px;
    color: ${variables.brandPrimary};
    opacity: 0.84;
    border-radius: 20.5px;
    border: 2px solid ${variables.brandPrimary};
    font-weight: 500;
    padding: 12px 20px;
    float: left;
    margin-right: 15px;
  }

  .review-item__dropdown {
    cursor: pointer;
    text-align: right;
    padding-top: 7px;
  }

  .review-item__dropdown-content {
    top: 55px !important;
    right: 10px !important;
  }
`
export default reviewItemStyle
