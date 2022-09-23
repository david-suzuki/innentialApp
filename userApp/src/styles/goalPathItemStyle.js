import css from 'styled-jsx/css'
import variables from './variables'

export const goalPathItemStyle = css.global`
  .goal-path__item {
    border-radius: 4px;
    border: solid 1px ${variables.whiteFour};
    padding: 20px;
    margin-bottom: 15px;
    background-color: ${variables.white};
  }

  .goal-path__item-heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .goal-path__item-heading p {
    font-size: 13px;
    font-weight: 600;
  }

  .goal-path__item-button {
    border-radius: 15.5px;
    border: solid 1px ${variables.duskyBlue};
    color: ${variables.duskyBlue};
    font-size: 12px;
    font-weight: 500;
  }

  .goal-path__item-team {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    border-bottom: 1px solid #e8e8e8;
  }

  .goal-path__item-team h3 {
    font-size: 15px;
    font-weight: 800;
    padding-bottom: 15px;
    margin-top: 30px;
  }

  .goal-path__item-goal {
    font-size: 13px;
    font-weight: 600;
    color: ${variables.duskyBlue};
    padding-bottom: 15px;
  }

  .draft-goal-selector__goal-item--label {
    display: flex;
    justify-content: space-between;
    padding: 15px 0px;
    font-size: 13px;
    font-weight: 600;
    color: ${variables.duskyBlue};
  }

  .draft-goal-selector__goal-item--name {
    margin-left: 8px;
  }
`
export default goalPathItemStyle
