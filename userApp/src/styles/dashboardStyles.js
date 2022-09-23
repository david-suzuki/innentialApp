import css from 'styled-jsx/css'
import variables from './variables'
import activityPlaceholder from '../static/activityPlaceholder.png'
import popularPlaceholder from '../static/popularPlaceholder.png'
import skillsPlaceholder from '../static/skillsPlaceholder.png'

export const dashboardStyles = css.global`
  .grid-content {
    background-color: #e7e0e0;
    border: 1px solid #b8b6b6;
    border-radius: 8px;
  }

  .dashboard__ilustration {
    display: none;
  }

  .dashboard__max-width-wrapper, .dashboard__max-width-wrapper > .el-col.el-col-24 {
    width:100%;
  }

  .dashboard-item__container {
    padding: 50px 0 0;
    width: 100%;
    height: calc(100% - 50px);
  }
  .dashboard-item__title {
    font-size: 20px;
    text-align: start;
    padding-bottom: 6px;
    font-weight: 900;
    text-align: left;
    color: ${variables.veryDarkBlue};
  }

  .dashboard-item__description {
    font-size: 14px;
    color: ${variables.warmGrey};
    text-align: left;
    height: 40px;
    padding-bottom: 6px;
  }

  .dashboard-item__content {
    display:flex;
    background-color: ${variables.white};
    flex-direction: column;
    justify-content: center;
    position: relative;
    height:134px;
    border-radius: 10px;
    padding: 20px;
    min-height: 396px;
    height:100%;
    box-shadow: 0 4px 8px 0 rgba(0, 8, 32, 0.08),
      0 1px 4px 0 rgba(0, 8, 32, 0.12);
  }

  .dashboard-activity__placeholder {
    background-image: url(${activityPlaceholder});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
    height: 90%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 17px;
  }

  .dashboard-activity__head {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .dashboard-activity__head > div {
    flex-grow: 1;
    font-size: 12px;
    color: ${variables.darkBlue};
  }

  .dashboard-activity__legend {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }



   .dashboard-activity__legend .legend-color {
     display: none;
   }

  .dashboard-activity__legend > div:nth-child(2) {
    padding-left: 45px;
  }

  .dashboard-activity__chart-container {
    display: none;
    min-height: 300px;
  }

  .doughnut-chart__container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .doughnut-chart__placeholder {
    background-image: url(${popularPlaceholder});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
    height: 90%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 17px;
  }

  .doughnut-chart__legend {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    padding: 24px 0 0 0;
   
  }
   .doughnut-chart__legend > div {
     display: flex;
    align-items: center;
   }
  .doughnut-chart__legend > div:not(:last-child) {
    padding-bottom: 14px;
  }

  .doughnut-chart__legend div > span:first-of-type {
    font-weight: 600;
  }
  .doughnut-chart__legend div > span:last-child {
    font-weight: 400;
    color: ${variables.darkBlue};
    padding-left: 5px;
    text-transform: capitalize;
    white-space: nowrap
  }

  .legend-color{
    width: 8px;
    height: 8px;
    border-radius: 5px;
    margin-right: 5px;
  }

  .dashboard-item__info {
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${variables.brandSecondary};
    font-size: 14px;
    font-weight: 700;
    border-radius: 50%;
    background-color: ${variables.fauxBubbles};
    margin-left: 16px;
    min-width: 30px;
  }

  .dashboard__learning-progress-container {
     display: flex;
    justify-content: space-between;
    flex-direction: column;
      width: 100%;
  }

  .dashboard__learning-progress-container div.el-input, .dashboard-activity__legend div.el-input {
    width: 90%;
  
  }

  .dashboard__learning-progress-container div.dashboard-select__container {
    width: 108%;
  }

  .dashboard__switch-button-container {
    position:absolute;
    left: 50%;
    bottom: 3px;
    display: flex;
    justify-content: center;
    padding-right: 14px;
    transform: translate(-50%);
    width: 100%;
  }

  @media screen and (min-width: 710px){
    .dashboard__switch-button-container {
      width: unset;
    }
  }

  .dashboard__switch-button-container .el-button {
    padding: 6px 20px 6px 20px;
  }

  .dashboard__switch-button-container .el-button--primary.is-plain {
    color: ${variables.brandPrimary}!important;
  }

  .dashboard__switch-button-container .el-button--primary.is-plain:hover {
     color: ${variables.white}!important;
  }

  .dashboard__button-container {
    display: flex;
    justify-content: flex-start;
    padding: 16px 0 0;
  }

  .el-button--primary span.dashboard__button,
  .el-button--secondary span.dashboard__button, span.dashboard-button__extra-content, span.dashboard-button__extra-content--left {
    font-weight: 700 !important;
    font-family: 'Poppins';
    font-size: 12px;
    display: flex;
  }

  span.dashboard-button__extra-content {
    display: none;
    padding-left: 4px;
  }

  span.dashboard-button__extra-content--left {
    display: none;
    padding-right: 4px;
  }

  .dashboard__wrapper button.el-button--primary.is-plain {
    color: ${variables.brandPrimary}!important;
  }

  .dashboard__wrapper .el-button--primary.is-plain:hover,
  .dashboard__wrapper .el-button--primary.is-plain:focus {
    color: #fff !important;
  }

  .dashboard__wrapper .el-row--flex {
    flex-wrap:wrap;
    justify-content: center;

  }

  .dashboard__wrapper .el-col-24 {
    width:unset;
  }

  .legend__total {
    font-size: 24px;
    font-weight: 900;
    text-align: center;
    color: ${variables.veryDarkBlue};
  }

  .dashboard__select {
    width: 140px;
  }

  .dashboard__select .el-input__inner {
    border: none;
    font-size: 12px;
    font-weight: 700;
    color: ${variables.brandPrimary};
    font-family: 'Poppins';
  }

  .dashboard__select span {
    margin-right: 10px;
    font-size: 12px;
    color: ${variables.darkBlue};
  }

  .dashboard__select .el-input__icon:hover {
    cursor: pointer;
  }

  .dashboard-select__container {
    /* display: none; */
    width: 40%;
    justify-content: flex-end;
       
  }
  .dashboard-activity__legend div.dashboard-select__container, .dashboard-activity__legend div.dashboard-select__container span {
    display: flex;
  }

  .dashboard-select__container > div > span {
    display: none;
    color: ${variables.darkBlue}; 
    font-size:12px;
  }

  .dashboard-select__activity-container i.el-input__icon {
    right: 16px;
  }

  /* .dashboard__select input::placeholder,
  .dashboard__select li.el-select-dropdown__item {
    color: ${variables.brandPrimary};
  } */

  .skills-list__placeholder {
    background-image: url(${skillsPlaceholder});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
    height: 90%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 17px;
  }

  @media screen and (min-width: 434px){
    .dashboard__switch-button-container {
      bottom: -8px
    }
    span.dashboard-button__extra-content {
      display:flex;
    }
    span.dashboard-button__extra-content--left {
      display:flex;
    }
  }

  @media screen and (min-width: 571px){
      .max-width__50 {
        max-width: 50%;
    }
      .max-width__66 {
        max-width: 66%;
    }
      .max-width__34 {

        max-width: 34%;
    }
  }

  @media screen and (min-width: 640px) {
    .dashboard-activity__chart-container {
      display: block;
    }
    .dashboard-activity__legend {
      display:flex;
      justify-content: flex-start;
    }
    .dashboard-activity__legend h4 {
      white-space:nowrap;
    }
     .legend-color, .dashboard-activity__legend .legend-color {
      display: inline-block;
     }

    .dashboard-activity__head > div {
        padding: 0 0 24px 24px;
    }

    .dashboard-select__container {
      display: flex;
    }
    .legend__total {
      text-align: start;
    }
  }

  @media screen and (min-width: 710px) {
    .dashboard__switch-button-container {
      position:inherit;
    }
  }

  @media ${variables.md} {
    .dashboard__ilustration {
      display: inline;
      position: absolute;
      bottom: 20px;
      max-width: 200px;
      right: 0;
    }
     .dashboard__switch-button-container {
       transform: translate(0%)
     }
  }

  @media ${variables.lg} {
    .dashboard__switch-button-container {
      justify-content: flex-end;
    }
    .dashboard-select__container > div > span {
      display: flex;
    }
  }

  @media ${variables.mxl} {
    .dashboard__ilustration {
      right: 140px;
      max-width: 290px;
    }
    .doughnut-chart__container {
      flex-direction: row;
    }
    .doughnut-chart__legend {
      align-items: flex-start;
       padding: 0 0 0 12px;
    }
    .dashboard-activity__legend > div:nth-child(2) {
      padding-left: 100px;
    }
    .dashboard-select__container {
      width: 100%;
    }
    .dashboard__learning-progress-container div.dashboard-select__container {
    width: 108%;
  }

  }
`
