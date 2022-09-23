import css from 'styled-jsx/css'
import variables from './variables'

export const homeEventsMobileStyle = css.global`
  .home__events {
    background: ${variables.white};
    margin-bottom: 16px;
    padding: 17px 16px 17px 18px;
    border-radius: 4px;
  }

  .home__events-header {
    color: ${variables.veryDarkBlue};
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .home__events-header__title {
    color: ${variables.veryDarkBlue};
    font-size: 16px;
    font-weight: ${variables.bold700};
    line-height: 26px;
    display: flex;
    align-items: center;
    gap: 13px;
  }

  .el-icon-star-off {
    font-size: 22px;
    font-weight: ${variables.bold700};
    padding-bottom: 1px;
  }

  .home__events-count {
    font-size: 12px;
    line-height: 16px;
    color: ${variables.white};
    border-radius: 50%;
    background: ${variables.brandPrimary};
    font-weight: 400;
    text-align: center;
    padding: 3px 9px;
  }

  .el-icon-arrow-down, .el-icon-arrow-up {
    color: ${variables.darkBlueTwo};
    font-weight: ${variables.bold700};
  }

  .home__events-dropwdown__item {
    text-align: left;
    margin: 16px 0px;
  }
  
  .dropwdown__item-date {
    font-size: 14px;
    line-height: 22px;
    color: ${variables.black};
    font-weight: ${variables.bold700};
    margin: 16px 0px;
  }

  .dropwdown__item-info {
    display: flex;
    gap: 11px;
    margin: 16px 0px;
    cursor: pointer;
  }
  
  .dropwdown__item-info__image {
    background-size: 100% 100%;
    width: 84px;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 4px;
    min-width: 84px;
  }

  .dropwdown__item-info__details {
    cursor: default;
    width: 100%;
  }

  .dropwdown__item-info__detail-type {
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

  .dropwdown__item-info__details-name {
    display: flex;
    align-items: center;
    margin: 6px 0px;
    justify-content: space-between;
  }

  .dropwdown__item-info__details-name span {
    display: inline-block;
    font-size: 14px;
    line-height: 22px;
    color: ${variables.black};
    font-weight: ${variables.bold700};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 52vw;
  }

  .dropwdown__item-info__details-time {
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

  .show-dropdown-enter {
  opacity: 0;
 }

  .show-dropdown-enter-active {
    opacity: 1;
    transition: opacity 200ms;
  }

  .show-dropdown-exit {
    opacity: 0.5;
  }

  .show-dropdown-exit-active {
    opacity: 0;
    transition: opacity 200ms;
  }

  @media screen and (min-width: 500px) {
   .dropwdown__item-info__details-name span {
     max-width: 64vw;
  }

  @media screen and (min-width: 700px) {
   .dropwdown__item-info__details-name span {
     max-width: 71vw;
  }

  @media screen and (min-width: 892px) {
   .dropwdown__item-info__details-name span {
     max-width: 37vw;
  }

  @media ${variables.lg} {
   .home__events {
     display: none;
   } 
`
export default homeEventsMobileStyle
