import css from 'styled-jsx/css'
import variables from './variables'

export const teamHeadingStyle = css.global`
  .team-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 14px;
    margin: 10px 0 18px 0;
    box-shadow: inset 0 -1px 0 0 ${variables.whiteFive};
  }

  .team-heading__department-wrapper {
    display: flex;
    align-items: center;
    text-align: left;
  }

  .team-heading__department-wrapper .icon-small-right {
    transform: rotate(180deg);
    color: ${variables.brandPrimary};
    margin-top: -10px;
    cursor: pointer;
  }

  .team-heading__title-wrapper {
    padding-left: 8px;
  }

  .team-heading__data-wrapper {
    display: flex;
    font-size: 12px;
    text-align: left;
    color: ${variables.warmGrey};
    font-weight: 400;
    padding-left: 5px;
  }

  .team-heading__data-wrapper div:nth-child(2) {
    padding: 0 12px 0 15px;
  }

  .team-heading__data-wrapper span {
    font-size: 15px;
    color: ${variables.black};
    font-weight: 800;
  }
`
export default teamHeadingStyle
