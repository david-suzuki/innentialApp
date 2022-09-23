import css from 'styled-jsx/css'
import variables from './variables'

export const assessmentItemsStyle = css.global`
  .assessment-items {
    text-align: left;
    font-size: 12px;
    margin-bottom: 20px;
  }

  .assessment-items__date-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 13px 0 16px 0;
  }

  .assessment-items__name {
    color: ${variables.brandPrimary};
  }

  .assessment-items__completed {
    position: relative;
    margin-top: 20px;
    padding-left: 16px;
    color: ${variables.brandPrimary};
    font-size: 12px;
    cursor: pointer;
  }
  .assessment-items__completed i {
    position: absolute;
    font-size: 11px;
    left: 0;
    top: 1px;
    transition: all 400ms;
  }

  .assessment-items__list {
    margin: 18px 0 12px 0;
    display: none;
  }

  .assessment-items .el-button {
    margin-top: 20px;
  }

  /* ----------- */
  /* states */

  .assessment-items__list.is-active {
    display: block;
  }

  .assessment-items__completed.is-past {
    display: none;
  }

  .assessment-items__completed.is-active i {
    transform: rotate(180deg);
    top: 2px;
  }
`
export default assessmentItemsStyle
