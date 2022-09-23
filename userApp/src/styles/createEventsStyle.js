import css from 'styled-jsx/css'
import variables from './variables'

export default css.global`
  .create-event__heading {
    display: flex;
    justify-content: center;
    align-items: baseline;
    margin-bottom: 40px;
    margin-top: 20px;
  }

  .create-event__heading-info {
    flex: 1;
    margin-right: 28px;
  }

  .create-event__heading-info h1 {
    font-size: 22px;
    font-weight: 800;
  }

  .create-event__back__button {
    font-size: 17px;
    cursor: pointer;
    float: left;
    color: ${variables.brandPrimary};
    border: 1px solid;
    width: 28px;
    height: 28px;
    border-radius: 20px;
    border-color: ${variables.paleLilac};
    background-color: ${variables.paleLilac};
    padding: 5px;
  }

  .create-event__selected-calendar {
    border-radius: 21px;
    border: solid 1px ${variables.duskyBlue};
    background-color: #f0f0ff;
  }
`
