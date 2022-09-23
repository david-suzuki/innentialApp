import css from 'styled-jsx/css'
import variables from './variables'
import activityPlaceholder from '../static/activityPlaceholder.png'
import popularPlaceholder from '../static/popularPlaceholder.png'
import skillsPlaceholder from '../static/skillsPlaceholder.png'

export const statsStyle = css.global`
  .stats-view {
    height: 100vh;
    width: 100%;
    text-align: left;
  }

  .stats-view > h1:nth-child(1) {
    margin-top: 24px;
  }

  .stats-view h1 {
    text-align: center;
  }

  @media ${variables.md} {
    .stats-view {
      width: 792px;
      margin-left: -72px;
    }

    .stats-view h1 {
      text-align: left;
    }

    .stats-view > h1:nth-child(1) {
      margin-top: 55px;
    }
  }
  @media ${variables.lg} {
    .stats-view {
      margin-left: 0;
    }
  }

  .stats-view-section-header {
    font-weight: 800;
    font-size: 22px;
    margin-bottom: 35px;
    margin-top: 55px;
  }

  .stats-view-wrapper {
    display: flex;
    align-items: stretch;
  }

  .stats-item-panel {
    box-shadow: 0 6px 11px 5px rgba(0, 0, 0, 0.05),
      inset 0 -1px 0 0 ${variables.whiteFive};
    padding: 25px;
  }

  .stats-item-panel-title {
    font-size: 13px;
    font-weight: 500;
  }

  .stats-item-panel-description {
    font-size: 12px;
    color: ${variables.warmGrey};
    margin-bottom: 25px;
  }

  .stats-overview-item {
    flex: 1;
    margin: 24px 0px;
    border-bottom: 1px solid ${variables.whiteFive};
  }

  .stats-overview-new-count {
    font-size: 14px;
    color: ${variables.warmGrey};
    margin-left: 6px;
  }

  .stats-overview-new-count span {
    font-weight: bold;
    font-size: 16px;
    color: ${variables.avocado};
  }

  .stats-teams-item,
  .stats-growth-item {
    flex: 1;
    background-color: ${variables.white};
  }

  .stats-teams-item:first-child {
    margin-right: 12px;
  }

  .stats-teams-item:last-child {
    margin-left: 12px;
  }

  .stats-growth-item:first-child {
    margin-right: 12px;
  }

  .stats-growth-item:nth-child(2) {
    margin-left: 12px;
    margin-right: 12px;
  }

  .stats-growth-item:last-child {
    margin-left: 12px;
  }

  .stats-item-panel-team-name {
    font-size: 15px;
    font-weight: 800;
    display: flex;
    padding: 0 22px;
    justify-content: space-between;
  }

  .stats-item-panel-team-name a {
    color: ${variables.black};
  }

  .stats-overview-item-count-wrapper {
    display: flex;
    margin-bottom: 10px;
  }

  .stats-overview-item-count-wrapper.stats-overview-employees
    .stats-overview-item-circle {
    background-color: ${variables.duskyBlueLighten};
  }

  .stats-overview-item-count-wrapper.stats-overview-employees i {
    color: ${variables.duskyBlue};
    font-size: 18px;
    font-weight: bold;
  }

  .stats-overview-item-count-wrapper.stats-overview-teams
    .stats-overview-item-circle {
    background-color: ${variables.fadedRedLighten};
  }

  .stats-overview-item-count-wrapper.stats-overview-teams i {
    color: ${variables.fadedRed};
    font-size: 18px;
    font-weight: bold;
  }

  .stats-overview-item-count-wrapper.stats-overview-skills
    .stats-overview-item-circle {
    background-color: ${variables.kiwiGreenLighten};
  }

  .stats-overview-item-count-wrapper.stats-overview-skills i {
    color: ${variables.kiwiGreen};
    font-size: 26px;
    font-weight: bold;
  }

  .stats-overview-item-circle {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
  }

  .stats-overview-item-count {
    font-weight: 300;
    font-size: 48px;
    line-height: 1;
  }

  .stats-overview-item-label {
    font-size: 13px;
    color: ${variables.warmGrey};
    margin-bottom: 20px;
  }

  .stats-item-panel-bar-item {
    width: 100%;
    margin-bottom: 24px;
    text-align: left;
  }

  .stats-see-more {
    font-size: 11px;
  }

  .stats-item-panel-bar {
    height: 8px;
    border-top-right-radius: 100px;
    border-bottom-right-radius: 100px;
  }

  .stats-item-panel-bar.stats-bar-teams {
    background-color: ${variables.darkGreen};
  }

  .stats-item-panel-bar.stats-bar-growth {
    background-color: ${variables.brandSecondary};
  }

  .stats-item-panel-bar-title {
    font-size: 12px;
    font-weight: 400;
    margin-bottom: 10px;
    color: ${variables.veryDarkBlue};
  }

  .stats-item-panel-bar-badge {
    display: inline-block;
    vertical-align: middle;
    height: 18px;
    border-radius: 8px;
    font-size: 10px;
    line-height: 1.13;
    background-color: ${variables.whiteTwo};
    min-width: 35px;
    text-align: center;
    margin-left: 8px;
  }

  .stats-item-panel-badge-content {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  .stats-item-panel-badge-content__clickable {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    cursor: pointer;
  }

  .stats-item-panel-badge-content__clickable:hover {
    border-radius: 8px;
    background-color: ${variables.brandPrimary};
  }

  .stats-item-panel-badge-content .icon2-teams {
    margin-right: 2px;
    font-size: 10px;
  }

  .stats-item-panel-team-count {
    font-size: 13px;
    font-weight: 500;
    margin-left: 20px;
    display: inline-block;
  }

  .stats-teams-chart-item {
    margin-top: 25px;
    margin-bottom: 25px;
    width: 100%;
  }

  .stats-item-panel-team-container {
    border-bottom: 1px solid ${variables.whiteFour};
    margin-bottom: 15px;
    padding-bottom: 13px;
  }

  .stats-item-panel-team-container:last-child {
    border-bottom: 0;
  }

  .stats-item-panel-team-chart {
    margin: 10px auto;
  }

  .stats-view-wrapper .icon.icon-small-right::before {
    position: absolute;
    left: 10px;
    margin-top: 8px;
    transform: rotate(180deg);
    font-size: 22px;
    cursor: pointer;
    color: ${variables.brandPrimary};
  }
  @media ${variables.md} {
    .stats-view-wrapper .icon.icon-small-right::before {
      left: 20px;
    }
  }
  @media only screen and (max-width: 480px) {
    .stats-view-wrapper {
      flex-direction: column;
    }
    .stats-growth-item {
      margin: 0 0 20px 0 !important;
    }
    .stats-teams-item {
      margin: 0 0 20px 0 !important;
    }
  }

  .dashboard-activity__placeholder {
    background-image: url(${activityPlaceholder});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
    min-height: 165px;
    height: 90%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 17px;
  }

  .skills-list__placeholder {
    background-image: url(${skillsPlaceholder});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
    min-height: 165px;
    height: 90%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 17px;
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
`
