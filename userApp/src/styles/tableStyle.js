import css from 'styled-jsx/css'
import variables from './variables'

export default css.global`
  .table {
    font-weight: normal;
    font-size: 13px;
    border-collapse: collapse;
    width: 100%;
  }

  .table tr:first-child td {
    color: ${variables.warmGreyThree};
  }

  .table tr:first-child {
    border-bottom: 1px solid ${variables.whiteFive};
  }

  .table tr:not(:first-child) {
    // border-top: 1px solid ${variables.whiteFive};
  }

  .table tr:last-child {
    // border-bottom: 1px solid ${variables.whiteFive};
  }

  .table td {
    text-align: left;
    padding: 8px 16px 8px 0px;
    color: ${variables.warmGreyFour};
  }

  .table th {
    text-align: center;
    padding: 8px 16px 8px 0px;
    color: ${variables.warmGreyFour};
    font-weight: 500;
  }

  .table td:last-child {
    // font-size: 21px;
    text-align: center;
    padding: 9px 10px;
  }

  .table__column--description {
    color: ${variables.warmGrey};
    font-style: italic;
  }

  .table__column--goal {
    color: ${variables.duskyBlue} !important;
    font-weight: bold;
  }

  .table__assingee {
    color: #e89c36;
    font-size: 12px;
    line-height: 18px;
    border: 1px dashed #e89c36;
    box-sizing: border-box;
    border-radius: 100px;
    padding: 0px 20px;
    background: #ffecd0;
    cursor: pointer;
    padding: 3px 10px;
  }

  .table__edit {
    color: #E89C36;
    border: 1px solid #E89C36;
    box-sizing: border-box;
    border-radius: 100px;
    padding: 4px 14px;
    font-weight: 600;
  }

  .table__autoassign {
    text-align: center !important;
  }

  .table__autoassign__wrapper {
    position: relative;
    cursor: pointer;
    margin: 0 auto;
    max-width: 80px;
  }

  .table__autoassign__wrapper:hover {
    position: relative;
    opacity: 0.7;
  }

  .table__autoassign img {
    width: 24px;
    height: 24px;
  }

  .table__autoassign span {
    color: ${variables.success80};
    position: absolute;
    right: 0;
    top: 3px;
  }
`
