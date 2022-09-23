import css from 'styled-jsx/css'
import variables from './variables'

export default css.global`
  .goal-item__cardContainer {
    margin: 25px 0;
    display: flex;
    justify-content: space-between;
    background: white;
    border-radius: 4px;
    flex-direction: column-reverse;
  }

  .goal-item__cardContainer.active {
    border: 2px solid #5a55ab;
    box-shadow: 0px 1px 4px rgba(0, 8, 32, 0.1),
      0px 16px 32px rgba(0, 8, 32, 0.1);
    background: #F6F8FC;
  }

  .goal-item__cardContainer:hover {
    box-shadow: 0px 1px 4px rgba(0, 8, 32, 0.12),
      0px 4px 8px rgba(0, 8, 32, 0.08);
  }

  .goal-item__cardContainer.active .goal-item__cardBody {
    padding: 22px;
  }
  .goal-item__cardContainer.active .goal-item__cardBody.withIcon {
    padding-top: 11px;
  }

  @media ${variables.md} {
    .goal-item__cardContainer {
      flex-direction: row;
    }
  }

  .goal-item__cardBody {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 24px;
    width: 100%;
  }

  .goal-item__cardBody.withIcon {
    padding-top: 10px;
  }

  @media ${variables.xxs} {
    .goal-item__cardBody {
      padding: 14px 16px;
    }
    .goal-item__cardContainer.active .goal-item__cardBody {
      padding: 12px 14px;
    }
    .goal-item__header {
      flex-direction: column;
      align-items: flex-start !important;
    }
    .goal-item__tags.right {
      margin-top: 16px;
    }
    .goal-item__title {
      align-items: flex-start !important;
    }
    .goal-item__cardBody.withIcon .goal-item__tags.right {
      margin-top: 5px;
    }
  }

  .goal-item__title {
    margin-top: 16px;
    display: flex;
    align-items: center;
  }
  .goal-item__title.withIcon {
    margin-top: 5px;
  }
  .goal-item__title a {
    font-weight: bold;
    font-size: 16px;
    line-height: 26px;
    color: #152540;
    text-align: left;
  }

  .goal-item__completed-button {
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16px;
    cursor: pointer;
  }

  .goal-item__author {
    font-weight: normal;
    width: 100%;
    color: rgb(85, 102, 133);
    font-size: 12px;
    line-height: 18px;
    text-align: left;
  }

  .goal-item__description {
    color: #556685;
    font-size: 14px;
    line-height: 22px;
    font-weight: 400;
    text-align: left;
    margin-top: 16px;
    padding: 10px 20px 10px 20px;
    border-left: 2px solid #6b66b3;
  }

  @media ${variables.xxs} {
    .goal-item__description {
      margin-left: 0px !important;
    }
  }
  .goal-item__description p {
    display: none;
  }

  .goal-item__description ol,
  .goal-item__description ul {
    margin-left: 20px;
  }

  .goal-item__description p:first-child {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3; /* number of lines to show */
    -webkit-box-orient: vertical;
  }

  .goal-item__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    flex-wrap: wrap;
  }

  .goal-item__footer {
    display: flex;
    margin-top: 16px;
  }

  .goal-item__footer .goal-item_mark-complete {
    background: white;
    color: #1CB55C !important;
    border: 1px solid #1CB55C;
    margin-right: 16px;
  }

  .goal-item__footer .goal-item_mark-complete:hover {
    background: #D1F2E1 !important;
    color: #128945 !important;
    border: 1px solid #128945;
  }

  .goal-item__footer .goal-item_mark-complete:disabled {
    color: #4ACF89 !important;
    background: #D1F2E1 !important;
    border-color: #D1F2E1 !important;
  }

  .goal-item__footer .goal-item_mark-complete.disabled svg path {
    fill: #4ACF89;
  }

  .goal-item__footer button svg {
    margin-right: 8.5px;
  }

  .goal-item__cardContainer .goal-item__footer .not-started {
    background: #BDBBDD;
    border: 1px solid #BDBBDD;
  }

  .goal-item__cardContainer.active .goal-item__footer .not-started, .goal-item__cardContainer.in-progress .goal-item__footer .not-started {
    background: #5A55AB;
    border: 1px solid #5A55AB;
    color: white !important;
  }

  .goal-item__cardContainer.active .goal-item__footer .not-started svg path, .goal-item__cardContainer.in-progress .goal-item__footer .not-started svg path {
    fill: white !important;
  }

  .goal-item__footer .not-started:hover, .goal-item__cardContainer.active .goal-item__footer .not-started:hover {
    background: white;
    color: #5A55AB !important;
    border: 1px solid #5A55AB;
  }

  .goal-item__footer .not-started:hover svg path, .goal-item__cardContainer.active .goal-item__footer .not-started:hover svg path {
    fill: #5A55AB !important;
  }

  .goal-item__cardContainer .goal-item__footer .in-progress {
    background: #BDBBDD;
    border: 1px solid #BDBBDD;
  }

  .goal-item__cardContainer.active .goal-item__footer .in-progress, .goal-item__cardContainer.in-progress .goal-item__footer .in-progress {
    background: #FFFFFF;
    border: 1px solid #5A55AB;
    color: #5A55AB !important;
  }

  .goal-item__cardContainer.active .goal-item__footer .in-progress svg path, .goal-item__cardContainer.in-progress .goal-item__footer .in-progress svg path {
    fill: #5A55AB !important;
  }

  .goal-item__footer .in-progress:hover, .goal-item__cardContainer.active .goal-item__footer .in-progress:hover, .goal-item__cardContainer.in-progress .goal-item__footer .in-progress:hover {
    background: #EFEEF7 !important;
    color: #5A55AB !important;
    border: 1px solid #5A55AB;
  }

  .goal-item__footer .in-progress:hover svg path, .goal-item__cardContainer.active .goal-item__footer .in-progress:hover svg path, .goal-item__cardContainer.in-progress .goal-item__footer .in-progress:hover svg path {
    fill: #5A55AB !important;
  }

  .goal-item__cardContainer .goal-item__footer .not-approved {
    background: #FFECD0;
    border: 1px solid #FFECD0;
    color: #BF7817 !important;
  }

  .goal-item__footer .not-approved {
    background: #FEBB5B;
    border: 1px solid #FEBB5B;
  }

  .goal-item__footer .not-approved svg path {
    fill: #BF7817 !important;
  }

  .goal-item__footer .not-approved:hover {
    background: #FFECD0 !important;
    border: 1px solid #E89C36 !important;
    color: #E89C36 !important;
  }

  .goal-item__footer .not-approved:hover svg path {
    fill: #E89C36 !important;
  }

  .goal-item__cardContainer.active .goal-item__footer .not-approved {
    background: #FEBB5B;
    border: 1px solid #FEBB5B;
    color: white !important;
  }
  
  .goal-item__cardContainer.active .goal-item__footer .not-approved svg path {
    fill: white !important;
  }

  .goal-item__cardContainer.active .goal-item__footer .not-approved:hover {
    color: #E89C36 !important;
  }
  
  .goal-item__cardContainer.active .goal-item__footer .not-approved:hover svg path {
    fill: #E89C36 !important;
  }

  .title-completed-icon:hover circle {
    fill: #4ACF89;
    stroke: #1CB55C;
  }

  .title-completed-icon:hover path {
    fill: white;
  }

  .goal-item__cardContainer .goal-item__footer .awaiting-fulfillment {
    background: #DDECF8;
    border: 1px solid #DDECF8;
    color: #1564A3 !important;
  }

  .goal-item__cardContainer .goal-item__footer .awaiting-fulfillment svg path {
    fill: #1564A3 !important;
  }

  .goal-item__cardContainer.active .goal-item__footer .el-button--primary.awaiting-fulfillment {
    background: #5296CA;
    border: 1px solid #5296CA;
    color: white !important;
  }

  .goal-item__cardContainer.active .goal-item__footer .el-button--primary.awaiting-fulfillment svg path {
    fill: white !important;
  }

  .goal-item__footer .awaiting-fulfillment {
    background: #5296CA;
    border: 1px solid #5296CA;
  }

  .goal-item__footer .awaiting-fulfillment:hover, .goal-item__cardContainer.active .goal-item__footer .awaiting-fulfillment:hover {
    background: #DDECF8 !important;
    border: 1px solid #5296CA !important;
    color: #5296CA !important;
  }

  .goal-item__footer .awaiting-fulfillment:hover svg path, .goal-item__cardContainer.active .goal-item__footer .awaiting-fulfillment:hover svg path {
    fill: #5296CA !important;
  }

  @media ${variables.xxs}{
    .goal-item__footer {
      margin-left: 0px;
    }
  }

  .goal-item__tags {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }

  .goal-item__status-icon {
    width: 12px;
    height: 12px;
    content: '';
    position: absolute;
    top: 7px;
    border: 1px solid #3b4b66;
    border-radius: 12px;
  }

  .goal-item__status-icon.in-progress {
    background: #8c88c4;
    border: 1px solid #8c88c4;
  }

  .goal-item__status-icon.completed {
    background: #2fc373;
    border: 1px solid #2fc373;
  }
/*
  .goal-item__status-icon.not-approved {
    background: ${variables.darkRed};
    border: 1px solid ${variables.darkRed};
  }
*/
  .goal-item__status-icon.awaiting-approval {
    background: #febb5b;
    border: 1px solid #febb5b;
  }

  .goal-item__status-icon.awaiting-fulfillment {
    background: #5296ca;
    border: 1px solid #5296ca;
  }

  .goal-item__cardContainer .img {
    width: 332px;
    background-size: cover !important;
    height: 270px;
    display: none;
  }

  @media ${variables.lg} {
    .goal-item__cardContainer .img {
      display: block;
    }
  }

  .goal-item__source {
    display: flex;
    line-height: 22px;
    font-weight: bold;
    font-size: 12px;
    color: #645a53;
  }

  .goal-item__source img {
    max-width: 100px;
    max-height: 25px;
    margin-right: 5px;
    min-width: 70px;
  }

  .goal-item__duration {
    color: #556685;
    font-size: 12px;
    line-height: 18px;
    font-weight: bold;
    display: flex;
    align-items: center;
    margin-right: 16px;
  }

  .goal-item__duration img {
    padding-right: 6px;
    width: 24px;
  }

  .goal-item__cardBody a {
    opacity: 1 !important;
  }

  .goal-item__cardBody button {
    border-radius: 100px;
    outline: none;
    border: none;
    background: #5a55ab;
    padding: 8px 22px;
    font-family: 'Poppins', sans-serif;
    color: white;
  }

  .goal-item__cardBody button span {
    display: flex;
    align-items: center;
    font-size: 12px;
    line-height: 18px;
    text-align: center;
    font-weight: bold !important;
  }

  .goal-item__cardBody button span img {
    margin-right: 8px;
  }

  .goal-item__cardBody button.goal-item__watching {
    background: #bdbbdd;
    border-radius: 100px;
    color: white;
  }

  .goal-item__cardBody button.goal-item__watching:hover {
    background: #5a55ab;
    color: white;
  }

  .goal-item__cardBody button.goal-item__watching.article.not-started {
    background: #ddecf8 !important;
    border: 1px solid #5296ca !important;
    color: #5296ca !important;
  }

  .goal-item__cardBody button.goal-item__watching.article.waiting-delivery {
    background: #ddecf8 !important;
    color: #77b1dd !important;
  }

  .goal-item__cardBody button.goal-item__watching.e-learning.not-started {
    background: #ffecd0 !important;
    border: 1px solid #e89c36 !important;
    color: #e89c36 !important;
  }

  .goal-item__cardBody button.goal-item__watching.e-learning.waiting-approval {
    background: #ffecd0 !important;
    color: #fec97e !important;
  }

  .goal-item__cardBody button.goal-item__skip {
    background: transparent;
    color: #556685;
    padding: 8px 16px;
  }

  .tooltip-body {
    line-height: 0px;
  }

  .tooltip-body > div {
    line-height: 15px;
  }

  .learning-item-new__price {
    font-weight: bold;
    font-size: 14px;
    border: 1px solid;
    border-radius: 4px;
    padding: 4px 6px;
    display: flex;
    align-items: center;
  }

  .learning-item-new__price svg {
    margin-right: 4px;
  }
`
