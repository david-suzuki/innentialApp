import css from 'styled-jsx/css'
import variables from './variables'

export const careerItemStyle = css.global`
  .career-item__header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .career-item__role {
    font-size: 15px;
    font-weight: ${variables.bold};
    text-align: left;
  }

  .career-item__content {
    display: flex;
    align-items: center;
  }

  .career-item__content p {
    font-size: 14px;
    color: ${variables.warmGrey};
    text-align: left;
    margin-right: 5px;
  }

  .career-item__button-container {
    text-align: left;
  }

  .career-item__button {
    font-size: 12px;
    color: ${variables.brandPrimary};
    opacity: 0.84;
    border-radius: 20.5px;
    border: 2px solid ${variables.brandPrimary};
    font-weight: 500;
    padding: 10px 20px;
    margin-right: 15px;
  }

  .career-item {
    padding-bottom: 20px;
    padding-top: 30px;
    border-bottom: 1px solid #e8e8e8;
  }
`
export default careerItemStyle
