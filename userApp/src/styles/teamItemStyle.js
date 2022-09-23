import css from 'styled-jsx/css'
import variables from './variables'

export const teamItemStyle = css.global`
  .team-item {
    border-bottom: none !important;
    padding-bottom: 0px !important;
  }
  .team-item__heading {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    border-bottom: 1px solid ${variables.whiteFour};
  }
  .team-item__heading__info {
    text-align: left;
    padding-bottom: 10px;
  }
  .team-item__heading__count {
    padding-bottom: 10px;
  }
  .team-item__heading__count .icon {
    margin-right: 8px;
    color: ${variables.brandPrimary};
    font-size: 16px;
  }
  .team-item__content {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    padding-top: 10px;
    padding-bottom: 40px;
  }
  .team-item__content__details {
    font-size: 13px;
    text-align: left;
    color: ${variables.warmGrey};
    font-weight: 400;
  }
  .team-item-content__details > div {
    padding-bottom: 10px;
  }
  .team-item__content__details span {
    color: ${variables.black};
    font-weight: 700;
  }
  .team-item__content__details span {
    margin-left: 7px;
  }
  .team-item__content__details .icon {
    font-size: 9px;
    margin-left: 5px;
  }
  .team-item__content__details .icon.icon-diag-bottom-right {
    color: ${variables.fadedRed};
  }
  .team-item__content__details .icon.icon-diag-top-right {
    color: ${variables.kiwiGreen};
  }
  .team-item__content__details .team-item-dash {
    color: ${variables.warmGrey};
  }
  .team-item__content__details a .icon {
    color: ${variables.brandPrimary};
  }

  .team-item__children {
    position: relative;
    color: ${variables.brandPrimary};
    font-size: 14px;
    cursor: pointer;
  }
`
export default teamItemStyle
