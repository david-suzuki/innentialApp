import css from 'styled-jsx/css'
import variables from './variables'

export const userItemStyle = css.global`
  .user-item {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  }
  .user-item__data {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .user-item__data-is-active:hover {
    cursor: pointer;
  }

  .user-item__is-admin {
    font-size: 12px;
    font-weight: bold;
    color: ${variables.lightMustard};
  }

  .user-item__data img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  .user-item__details {
    padding-left: 16px;
    text-align: left;
  }

  .user-item__details__profession {
    font-size: 12px;
    line-height: 0.9;
    padding-top: 3px;
  }
  .user-item__details__location {
    margin-top: 10px;
  }

  .user-item__status {
    font-size: 11px;
    text-transform: capitalize;
    color: ${variables.lightMustard};
    font-weight: 300;
  }
  .user-item__status--green {
    color: ${variables.kiwiGreen};
  }
  .user-item__status--red {
    color: ${variables.fadedRed};
  }

  .user-item__children {
    position: relative;
    color: ${variables.brandPrimary};
    font-size: 14px;
    cursor: pointer;
  }

  .user__dropdown {
    position: absolute;
    background-color: transparent;
    right: 0;
    visibility: hidden;
    opacity: 0;
    transition: all 400ms;
  }

  .user__dropdown ul {
    padding: 0;
  }

  .user__dropdown ul li {
    list-style: none;
    line-height: 10px;
    font-size: 12px;
    text-align: right;
    background: white;
    padding: 0 4px;
  }

  .user__dropdown ul li:not(:first-child) {
    padding-top: 5px;
  }

  .user__dropdown ul li a {
    color: ${variables.brandPrimary};
    font-size: 9px;
    line-height: 9px;
    cursor: pointer;
  }
  @media ${variables.md} {
    .user__dropdown ul li {
      font-size: 11px;
      line-height: 11px;
    }
    .user__dropdown ul li a {
      font-size: 11px;
      line-height: 11px;
    }
  }

  @media ${variables.lg} {
    .user-item__details {
      min-width: 145px;
    }
  }

  .user__dropdown.is-active {
    visibility: visible;
    opacity: 1;
  }

  .user-item__skills-wrapper {
    margin-top: 22px;
    display: flex;
    flex-wrap: wrap;
  }

  /* Modifiers */
  .user-item--skill {
    border-bottom: 1px solid ${variables.whiteFour};
    padding: 26px 0 23px;
    display: block;
    text-align: left;
  }

  .user-item__data--skill {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .user-item__data--skill img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .list-item__title {
    font-size: 15px;
    font-weight: 800;
    color: ${variables.black};
    padding-top: 7px;
    display: flex;
    align-items: center;
  }

  .list-item__title--skill span {
    margin-left: 6px;
  }

  .list-item__label--skill {
    font-size: 12px;
    line-height: 0.9;
    margin-bottom: 6px;
    color: ${variables.warmGreyTwo};
  }

  .learning-item__skill-tag-trim {
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100px;
    margin: 0;
    padding: 0;
    line-height: 1.5;
  }
  .learning-item__skill-tag-trim:hover {
    max-width: none;
  }

  .learning-item__skill-tag-level {
    border-radius: 9px;
    background: ${variables.brandPrimary};
    color: white;
    padding: 3px 6px 2px;
    font-size: 9px;
    margin-right: -13px;
    margin-left: 6px;
    min-width: 25px;
    text-align: center;
  }

  .learning-item__skill-tag--skill {
    display: flex !important;
    align-items: center;
  }
  .user-review-item--black {
    font-size: 15px;
    font-weight: 800;
    color: black;
  }

  .user-item-review__wrapper,
  .user-item-request__wrapper {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    border-bottom: 1px solid #e8e8e8;
    cursor: pointer;
    min-height: 85px;
    color: black !important;
    padding-left: 4px;
    /* box-shadow: 0px 0px 2px 0px #888888; */
  }

  .user-item-review__wrapper--no-hover {
    cursor: default;
  }

  .user-item-review__wrapper:hover {
    box-shadow: 0px 0px 2px 0px #888888;
  }
  .user-item-request__wrapper:hover {
    background-color: #f6f8fc;
  }

  .user-item-request__wrapper:hover .user-request-item__name {
    color: ${variables.brandPrimary};
  }

  .user-item-review__wrapper--no-hover:hover {
    box-shadow: 0px 0px 0px 0px;
  }

  .user-item-review__number {
    font-size: 15px;
    font-weight: 800;
    display: flex;
  }

  .user-item-review__number img {
    margin-right: 5px;
  }

  .user-item-review__profession {
    padding: 5px 0;
  }

  .user-item__details {
    // width: 200px;
  }

  .user-item__details__location {
    margin-bottom: 20px;
  }

  .user-item__review-completed {
    display: flex;
    align-items: center;
  }

  .user-item__review-completed-info {
    padding-right: 10px;
    text-align: right;
  }

  .user-item__review-completed-text {
    font-size: 12px;
    font-weight: 500;
    color: ${variables.warmGrey};
    text-align: right;
  }

  .user-item__review-completed-date {
    font-size: 12px;
    font-weight: 500;
    color: ${variables.black};
  }

  .user-item__review-completed-img {
    min-width: 34px;
    min-height: 34px;
    background-color: #d6f2ca;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 10px;
  }

  .user-item__review-calendar-event {
    font-size: 12px;
    font-weight: 500;
    color: ${variables.warmGrey};
    text-align: right;
    background-color: ${variables.lightMustard};
    border-radius: 33%;
    padding: 4px;
    transition: all 0.2s ease-in-out;
  }

  .user-item__review-calendar-event:hover {
    background-color: ${variables.seafoamBlue};
    transform: scale(1.1);
  }

  .user-item-review__person-wrapper {
    display: flex;
  }

  .user-item-review__status-wrapper {
    width: 50%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .user-item__goal-name {
    display: flex;
    margin-bottom: 10px;
  }

  .user-item__goal-name a {
    font-size: 13px;
    font-weight: 600;
    margin-left: 14px;
  }

  .user-item__goal-name--completed {
    opacity: 0.7;
  }

  .user-item__goal-name p {
    font-size: 13px;
    font-weight: 600;
    margin-left: 14px;
    color: ${variables.linkColor};
  }

  .user-item-with-skill__data {
    display: flex;
    justify-content: space-between;
  }

  .user-item__name {
    word-break: break-all;
  }

  /* USER ITEM REQUESTS STYLES */
  .user-item-request__number {
    font-size: 12px;
    font-weight: 400;
    color: #556685;
  }

  .user-request-item__name {
    font-size: 14px;
    font-weight: 400;
    color: #152540;
  }

  .user-request-item__subtitle {
    font-size: 12px;
    color: ${variables.warmGrey};
  }

  .user-request-item__team {
    background-color: ${variables.whiteFive};
    color: ${variables.warmGrey};
    border-radius: 50%;
    width: 40px;
    height: 40px;
    font-size: 25px;
    line-height: 45px;
  }

  .user-item-request__right {
    width: 50%;
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
  }

  .user-item-request__time {
    color: ${variables.warmGrey};
    font-size: 12px;
    padding-right: 9px;
  }
`
export default userItemStyle
