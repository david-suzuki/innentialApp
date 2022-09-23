import css from 'styled-jsx/css'
import variables from './variables'

export const assessmentItemStyle = css.global`
  .assessment-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  .assessment-item__data {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .assessment-item__data img {
    width: 22px;
    height: 22px;
    border-radius: 50%;
  }
  .assessment-item__title {
    font-size: 12px;
    color: ${variables.black};
  }
  .assessment-item__details {
    padding-left: 16px;
    text-align: left;
  }

  .assessment-item__details__profession {
    font-size: 10px;
    line-height: 1.13;
    padding-top: 4px;
    color: ${variables.warmGreyTwo};
  }

  .assessment-item__status {
    font-size: 11px;
    text-transform: capitalize;
    color: ${variables.fadedRed};
    font-weight: 300;
  }
  .assessment-item__status--is-active {
    color: ${variables.kiwiGreen};
  }
`
export default assessmentItemStyle
