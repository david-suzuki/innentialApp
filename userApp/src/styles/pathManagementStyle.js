import css from 'styled-jsx/css'
import variables from './variables'

export default css.global`
  .path-management__wrapper {
    position: relative;
    padding: 22px 16px 22px 26px;
    border-radius: 4px;
    box-shadow: 0 6px 11px 5px rgba(0, 0, 0, 0.05);
    background-color: ${variables.white};
    width: 1024px
  }

  .path-management__title-wrapper--team {
    display: flex;
    align-items: center;
  }

  .path-management__title--team {
    max-width: 190px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow-x: hidden;
    display: block;
  }

  .path-management__expand {
    cursor: pointer;
    // border: 1px solid ${variables.warmGreyFour};
    border-radius: 50%;
    margin-right: 7px;
    margin-left: 7px;
  }

  .path-management__expand__count {
    min-width: 20px;
    padding: 0px 7px;
    // background-color: ${variables.brandPrimary};
    color: ${variables.white};
    border-radius: 40%;
    font-size: 10px;
    margin-left: 7px;
    background: #EFEEF7;
    border-radius: 100px;
    color: #5A55AB;
    cursor: pointer;
  }

  .path-management__details__skill-tag {
    margin: 8px 15px 8px 0;
    background-color: ${variables.paleLilacTwo};
    padding: 3px 10px;
    color: ${variables.duskyBlue};
    font-size: 11px;
  }

  .goal-template-index {
    background: #F6F8FC;
    border-radius: 100px;
    width: 20px;
    height: 20px;
    margin-right: 10px;
    text-align: center;
  }

  // .path-management__wrapper .tabs-content {
  //   overflow-x: scroll;
  // }

  .path-management__wrapper .table {
    min-width: 910px;
  }

  .path-management__path__assignee {
    color: ${variables.brandPrimary};
    font-style: normal;
    font-weight: bold;
    font-size: 12px;
    line-height: 20px;
    cursor: pointer;
    opacity: 1;
    display: flex;
    align-items: center;
  }

  .path-management__path__assignee i {
    font-size: 10px;
    margin-left: 8px;
  }

  .path-management__path__assignee:hover {
    opacity: 0.7;
  }

  .path-management__path__assignee__text {
    max-width: 160px;
    white-space: nowrap;
    overflow-x: hidden;
    text-overflow: ellipsis;
  }

   svg.table-icon path {
    fill: ${variables.desaturatedBlue} !important;
  }

  svg.table-icon--first {
    stroke: ${variables.desaturatedBlue};
  }

  .table td {
    color: ${variables.grey80} !important;
  }
`
