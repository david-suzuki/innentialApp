import css from 'styled-jsx/css'
import variables from './variables'

export const feedbackItemStyle = css.global`
  .feedback-item {
    padding: 10px;
    box-shadow: 2px 2px 8px 0 rgba(0, 0, 0, 0.2);
    margin-bottom: 22px;
    background-color: ${variables.white};
  }

  .feedback-item__feedback-wrapper {
    font-size: 12px;
    padding: 12px;
    margin: 12px 0;
    text-align: left;
  }

  .feedback-item__feedback-wrapper > ul > li {
    text-indent: 20px;
  }

  .feedback-item__skills-wrapper {
    padding: 12px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .feedback-item__skill {
    font-size: 13px;
    width: 45%;
    color: ${variables.warmGrey};
    display: flex;
    line-height: 15px;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
    text-align: left;
  }
`
export default feedbackItemStyle
