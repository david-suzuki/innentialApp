import css from 'styled-jsx/css'
import variables from './variables'

export const homeEventsDesktopStyle = css.global`
  .home-desktop__events-container {
    padding: 200px 16px 0px 14px;
  }

  .home-desktop__events-header {
    color: ${variables.veryDarkBlue};
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .home-desktop__events-header__title {
    color: ${variables.veryDarkBlue};
    font-size: 20px;
    font-weight: ${variables.bold700};
    line-height: 32px;
    display: flex;
    align-items: center;
  }

  .el-icon-star-off {
    font-size: 22px;
    font-weight: ${variables.bold700};
    padding-bottom: 1px;
  }

  .home-desktop__events-count {
    font-size: 12px;
    line-height: 16px;
    color: ${variables.brandPrimary};
    border-radius: 50%;
    background: ${variables.white};
    font-weight: 400;
    text-align: center;
    padding: 3px 9px;
  }

  .home-desktop__events-header__link {
    color: ${variables.brandPrimary};
    font-size: 12px;
    font-weight: ${variables.bold700};
    line-height: 18px;
    letter-spacing: 0.6px;
    cursor: pointer;
  }

  .el-icon-arrow-down, .el-icon-arrow-up {
    color: ${variables.darkBlueTwo};
    font-weight: ${variables.bold700};
  }

  .el-icon-arrow-right {
    color: ${variables.darkBlueTwo};
    font-weight: ${variables.bold700};
    padding-bottom: 2px;
  }

  .home-desktop__events__item {
    text-align: left;
    margin: 16px 0px;
    background: ${variables.white};
    border-radius: 4px;
    padding: 16px 14px 2px;
  }

  .events__item-date {
    font-size: 16px;
    line-height: 26px;
    color: ${variables.black};
    font-weight: ${variables.bold700};
  }

  .events__item-info {
    display: flex;
    gap: 11px;
    margin: 16px 0px;
    cursor: pointer;
  }
  
  
  .events__item-info__image {
    background-size: 100% 100%;
    width: 84px;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 4px;
    min-width: 84px;
  }

  .events__item-info__details {
    // cursor: default;
    width: 100%;
  }

  .events__item-info__detail-type {
    display: flex;
    align-items: center;
    font-size: 12px;
    line-height: 18px;
    color: ${variables.desaturatedBlue};
    font-weight: ${variables.bold700};
    border-radius: 4px;
    background-color: ${variables.hawkesBlue};
    padding: 4px 6px;
    width: fit-content;
  }

  .events__item-info__details-name {
    display: flex;
    align-items: center;
    margin: 6px 0px;
    justify-content: space-between;
    width: 100%;
  }

  .events__item-info__details-name span {
    display: inline-block;
    font-size: 14px;
    line-height: 26px;
    color: ${variables.black};
    font-weight: ${variables.bold700};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 15vw;
  }

  .events__item-info__details-time {
    display: flex;
    align-items: center;
    font-size: 14px;
    line-height: 22px;
    color: ${variables.brandPrimary};
  }

  .clock-icon {
    width: 18px;
    height: 18px;
    margin-right: 8px;
    padding-bottom: 1px;
  }

  svg.clock-icon path{
    fill: ${variables.brandPrimary};
  }

  .no-events {
    font-size: 14px;
    line-height: 20px;
    color: ${variables.black};
    font-weight: 400;
    max-width: 72%;
    display: flex;
    flex-direction: column;
  }

  .no-events__button {
    border: 1px solid ${variables.brandPrimary};
    font-family: 'Poppins', sans-serif;
    font-weight: ${variables.bold700};
    color: ${variables.brandPrimary};
    font-size: 12px;
    line-height: 18px;
    letter-spacing: 0.6px;
  }

  .no-events__button .el-icon-arrow-right {
    font-weight: ${variables.bold700};
    color: ${variables.brandPrimary};
    font-size: 12px;
  }

  .no-events__button:hover {
    background-color: ${variables.brandPrimary};
    color: ${variables.white};
  }

  .no-events__button:hover .el-icon-arrow-right {
    color: ${variables.white};
  }

  a {
    margin: 14px 0px;
  }
`
export default homeEventsDesktopStyle
