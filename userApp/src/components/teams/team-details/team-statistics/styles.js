import css from 'styled-jsx/css'
import variables from '../../../../styles/variables'

export const TeamStatsStyle = css.global`
  .team-statistics__row {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  @media ${variables.lg} {
    .team-statistics__row {
      flex-direction: row;
    }
  }

  .team-stats-item__wrapper {
    text-align: left;
    margin-bottom: 40px;
    min-width: 48%;
  }

  .team-stats-item__wrapper + .team-stats-item__wrapper {
    margin-left: 20px;
  }

  .team-stats-item {
    background-color: ${variables.white};
  }

  .team-stats-item__header {
    font-family: 'Poppins', sans-serif;
    font-weight: bold;
    font-size: 16px;
    line-height: 26px;
    color: #000000;
    padding: 9px 0;
  }

  .team-stats-item__action {
    display: flex;
    align-items: baseline;
    min-height: 30px;
    flex-direction: row;
    justify-content: space-between;
  }

  .team-stats-item__action > .list-sort {
    padding-bottom: 0;
  }

  .progress-table-row > .row {
    display: flex;
    justify-content: space-between;
  }

  .progress-table-row {
    padding: 13px 16px;
    background: #ffffff;
    border-radius: 4px;
    margin-bottom: 8px;
  }

  .path-title {
    padding-top: 7px;
    font-family: 'Poppins', sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 12px;
    line-height: 20px;
    align-items: top;
    color: #000000;
    flex-basis: 200px;
  }

  .goal-status {
    display: flex;
    justify-content: center;
  }

  @media screen and (max-width: 516px) {
    .goal-status {
      flex-direction: column;
    }
  }

  .goal-status .filter-item {
    display: flex;
    align-items: top;
    padding: 7px 16px;
    border-right: 1px solid #d9e1ee;
    cursor: pointer;
  }
  .goal-status .filter-item:last-child {
    border: none;
  }

  @media screen and (max-width: 516px) {
    .goal-status .filter-item {
      border-right: none;
      padding: 12px 0;
    }
  }

  @media screen and (max-width: 768px) {
    .goal-status .filter-item {
      margin-right: 5px;
    }
  }

  .goal-status .filter-item div.not-started {
    font-weight: 700;
    font-size: 12px;
    line-height: 18px;
    margin-right: 8px;
    color: ${variables.darkBlueTwo};
  }

  .goal-status .filter-item div.not-started div {
    color: black;
    font-weight: 400;
    padding-top: 3px;
  }

  .goal-status .filter-item div.not-started div.item-body {
    padding-top: 10px;
  }

  .goal-status .filter-item div.in-progress {
    font-weight: 700;
    font-size: 12px;
    line-height: 18px;
    margin-right: 8px;
    color: #8c88c4;
  }

  .goal-status .filter-item div.in-progress div {
    color: black;
    font-weight: 400;
    padding-top: 3px;
  }

  .goal-status .filter-item div.in-progress div.item-body {
    padding-top: 10px;
  }

  .goal-status .filter-item div.completed {
    font-weight: 700;
    font-size: 12px;
    line-height: 18px;
    margin-right: 8px;
    color: #2fc373;
  }

  .goal-status .filter-item div.completed div {
    color: black;
    font-weight: 400;
    padding-top: 3px;
  }

  .goal-status .filter-item div.completed div.item-body {
    padding-top: 10px;
  }

  .goal-status .filter-item span.number {
    font-weight: 400;
    font-size: 10px;
    line-height: 20px;
    width: 20px;
    height: 20px;
    text-align: center;
    background: #efeef7;
    border-radius: 20px;
    color: #5a55ab;
    display: inline-block;
    margin-left: 8px;
  }

  .path-detail-button {
    font-size: 12px;
    line-height: 18px;
    color: #5a55ab;
    font-weight: bold;
    padding: 8px 22px;
    background: white;
    border-color: #5a55ab;
    align-self: flex-start;
  }

  .path-detail-button:hover {
    color: white;
    background: #5a55ab;
    border-color: #5a55ab;
  }

  .more-path-items-button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 9px 0px;
    background: #ffffff;
    border-radius: 4px;
    font-family: 'Poppins', sans-serif;
    font-weight: bold;
    font-size: 12px;
    line-height: 18px;
    color: #8494b2;
    cursor: pointer;
  }

  .more-path-items-button svg {
    margin-left: 8px;
  }

  .more-path-items-button.up svg {
    transform: rotate(180deg);
  }

  .team-members {
    display: flex;
    justify-content: flex-start;
    flex-basis: 111px;
  }

  .team-members img:not(:first-child) {
    margin-left: -16px;
  }

  .team-members img {
    border-radius: 50%;
    box-sizing: content-box;
    border: 3px solid ${variables.white};
  }

  .row__button {
    flex-basis: 121px;
  }
`
export default TeamStatsStyle
