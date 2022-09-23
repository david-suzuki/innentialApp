import css from 'styled-jsx/css'
import variables from '../../../styles/variables'

export const profilesStyle = css.global`
  .profile__development-plans-container {
    text-align: left;
  }
  .profile__development-plans-category {
    margin-top: 16px;
    margin-bottom: 40px;
  }
  .profile__development-plans-category-title {
    font-weight: 700;
    font-size: 16px;
    line-height: 26px;
    color: black;
    margin-bottom: 16px;
  }
  .profile__development-single-plan {
    background: #fff;
    border-radius: 4px;
    padding: 16px;
    margin-bottom: 16px;
  }
  .profile__development-single-plan-header {
    margin: 0 -16px;
    border-bottom: 1px solid #d9e1ee;
  }
  .profile__development-single-plan-header h3 {
    font-weight: 700;
    font-size: 16px;
    line-height: 26px;
    padding: 0 16px;
  }
  .profile__development-single-plan-header-sub {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
  }
  .profile__development-single-plan-header-sub p {
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
    color: ${variables.duskyBlue};
  }
  @media screen and (max-width: 512px) {
    .profile__development-single-plan-header-sub p {
      display: none;
    }
  }
  .profile__development-single-plan-header-sub p span {
    color: ${variables.desaturatedBlue};
    margin-right: 8px;
  }
  .profile__development-single-plan-header-filter {
    display: flex;
  }
  .profile__development-single-plan-header-filter .filter-item {
    display: flex;
    align-items: center;
    margin-right: 32px;
    cursor: pointer;
  }
  @media screen and (max-width: 768px) {
    .profile__development-single-plan-header-filter .filter-item {
      margin-right: 5px;
    }
  }

  .profile__development-single-plan-header-filter
    .filter-item
    span.not-started {
    font-weight: 700;
    font-size: 12px;
    line-height: 18px;
    margin-right: 8px;
    color: ${variables.darkBlueTwo};
  }

  .profile__development-single-plan-header-filter
    .filter-item
    span.in-progress {
    font-weight: 700;
    font-size: 12px;
    line-height: 18px;
    margin-right: 8px;
    color: #8c88c4;
  }

  .profile__development-single-plan-header-filter .filter-item span.completed {
    font-weight: 700;
    font-size: 12px;
    line-height: 18px;
    margin-right: 8px;
    color: #2fc373;
  }

  .profile__development-single-plan-header-filter .filter-item span.number {
    font-weight: 400;
    font-size: 10px;
    line-height: 20px;
    width: 20px;
    height: 20px;
    text-align: center;
    background: #efeef7;
    border-radius: 20px;
    color: #5a55ab;
  }

  .profile__development-single-plan-body {
    padding: 10px 0;
  }

  .single-plan__goal-item {
    padding: 13px 0;
    border-bottom: 1px solid #efeef7;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
  }

  @media screen and (max-width: 571px) {
    .single-plan__goal-item {
      flex-direction: column;
    }
  }

  .single-plan__goal-item:last-child {
    border: none;
  }

  .single-plan__goal-item__title {
    flex: 2;
    font-weight: 700;
    font-size: 12px;
    line-height: 20px;
    max-width: 300px;
    color: #152540;
  }
  @media screen and (max-width: 1314px) {
    .single-plan__goal-item__title {
      max-width: 250px;
    }
  }
  @media screen and (max-width: 1024px) {
    .single-plan__goal-item__title {
      flex: 6;
    }
  }
  @media screen and (max-width: 768px) {
    .single-plan__goal-item__title {
      flex: 3;
    }
  }
  .single-plan__goal-item__source {
    flex: 1;
    font-weight: 700;
    font-size: 12px;
    line-height: 20px;
    max-width: 160px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    padding: 0 10px;
  }
  .single-plan__goal-item__source img {
    max-width: 70px;
  }
  @media screen and (max-width: 1024px) {
    .single-plan__goal-item__source {
      flex: 2;
    }
  }
  @media screen and (max-width: 1200px) {
    .single-plan__goal-item__source {
      display: none;
    }
  }
  @media screen and (max-width: 768px) {
    .single-plan__goal-item__title {
      flex: 1;
    }
  }
  .single-plan__goal-item__type {
    max-width: 135px;
    flex: 1;
  }
  @media screen and (max-width: 1200px) {
    .single-plan__goal-item__type {
      display: none;
    }
  }
  .single-plan__goal-item__price {
    flex: 1;
    padding: 4px 6px;
    font-weight: bold;
    font-size: 14px;
    line-height: 22px;
    color: #128945;
  }
  @media screen and (max-width: 1200px) {
    .single-plan__goal-item__price {
      display: none;
    }
  }
  .single-plan__goal-item__status {
    flex: 1;
    font-weight: 700;
    font-size: 12px;
    line-height: 18px;
    padding: 4px 9px 4px 28px;
    border-radius: 4px;
    position: relative;
    width: auto;
    text-transform: capitalize;
  }
  @media screen and (max-width: 1024px) {
    .single-plan__goal-item__status {
      flex: 2;
    }
  }
  @media screen and (max-width: 768px) {
    .single-plan__goal-item__title {
      flex: 1;
    }
  }
  .single-plan__goal-item__status::before {
    content: ' ';
    position: absolute;
    left: 9px;
    top: 6px;
    width: 12px;
    height: 12px;
    border-radius: 12px;
    border: 1px solid #3b4b66;
  }

  .single-plan__goal-item__status.not-started {
    color: #556685;
    border: 1px solid #d9e1ee;
    max-width: 110px;
  }

  .single-plan__goal-item__status.in-progress {
    color: #8c88c4;
    border: 1px solid #8c88c4;
    max-width: 108px;
  }

  .single-plan__goal-item__status.in-progress::before {
    background: #8c88c4;
    border-color: #8c88c4;
  }

  .single-plan__goal-item__status.completed {
    color: #2fc373;
    border: 1px solid #2fc373;
    max-width: 108px;
  }

  .single-plan__goal-item__status.completed::before {
    background: #2fc373;
    border-color: #2fc373;
  }

  .single-plan__goal-item__status.not-approved {
    color: #febb5b;
    border: 1px solid #febb5b;
    max-width: 115px;
  }

  .single-plan__goal-item__status.not-approved::before {
    background: #febb5b;
    border-color: #febb5b;
  }

  .single-plan__goal-item__status.awaiting-fulfillment {
    color: #1564a3;
    border: 1px solid #1564a3;
    max-width: 165px;
  }

  .single-plan__goal-item__status.awaiting-fulfillment::before {
    background: #1564a3;
    border-color: #1564a3;
  }

  .single-plan__goal-item__status.awaiting-approval {
    color: #febb5b;
    border: 1px solid #febb5b;
    max-width: 155px;
  }

  .single-plan__goal-item__status.awaiting-approval::before {
    background: #febb5b;
    border-color: #febb5b;
  }

  .single-plan-footer__control {
    font-size: 12px;
    line-height: 18px;
    color: white;
    font-weight: bold;
    padding: 8px 22px;
    background: #5a55ab;
    border-color: #5a55ab;
  }
`
export default profilesStyle
