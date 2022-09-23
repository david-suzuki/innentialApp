import css from 'styled-jsx/css'
import variables from './variables'

export const userDashboardItemStyle = css.global`
  .user-dashboard-item__container {
    display: flex;
    border-bottom: 1px solid #d9e1ee;
  }

  .user-dashboard-item__content {
    padding: 24px 0;
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 86px;
  }

  .user-dashboard-item__content > div > img {
    width: 38px;
    height: 38px;
    border-radius: 50%;
  }

  .user-dashboard-item__content > div:first-child {
    display: flex;
    align-items: center;
    color: ${variables.veryDarkBlue};
    font-size: 14px;
  }

  .user-dashboard-item__content > div:nth-child(2) {
    display: flex;
    width: 50%;
    justify-content: space-between;
    align-items: center;
    color: ${variables.darkBlue};
    font-size: 12px;
  }

  .user-dashboard-item__content > div:nth-child(2) > div:first-child {
    display: none;
  }

  .user-dashboard-item__tag {
    display: flex;
    align-items: center;
    height: 30px;
    border-radius: 20px;
    font-size: 10px;
    padding: 4px 8px;
  }

  .tag-red {
    background-color: ${variables.lightRed};
    color: ${variables.darkRed};
  }
  .tag-warning {
    background-color: ${variables.lightOrange};
    color: ${variables.alloyOrange};
  }
  .tag-green {
    background-color: ${variables.fauxWater};
    color: ${variables.deepGreen};
  }

  @media ${variables.md} {
    .user-dashboard-item__content > div:nth-child(2) > div:first-child {
      display: block;
    }
  }
`
