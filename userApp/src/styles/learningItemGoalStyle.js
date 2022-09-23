import css from 'styled-jsx/css'
import variables from './variables'

export const learningItemGoalStyle = css.global`
  .learning-item-goal {
    margin-top: 40px;
  }

  .learning-item-goal__main {
    display: flex;
  }

  .learning-item-goal__image {
    margin-right: 20px;
  }

  .learning-item-goal__image img {
    width: 100%;
  }

  .learning-item-goal__content {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .learning-item-goal__content-heading {
    display: flex;
    justify-content: space-between;
  }

  .learning-item-goal__content-heading-text {
    font-weight: 800;
    font-size: 12px;
    line-height: 20px;
    color: #152540;
    text-align: left;
  }

  .learning-item-goal__content-description {
    font-size: 12px;
    line-height: 18px;
    color: #556685;
    text-align: left;
    flex: 1;
  }

  .learning-item-goal__content-tags {
    align-self: flex-start;
    margin-bottom: 5px;
  }

  .learning-item-goal__content-tags-tag {
    font-size: 10px;
    font-weight: bold;
    height: 20px;
    margin-right: 15px;
    // text-transform: uppercase;
    padding: 5px 6px 4px 6px;
    display: inline-block;
    line-height: 1;
    border-radius: 4px;

    background-color: bisque;
  }

  @media only screen and (max-width: 890px) {
    .learning-item-goal__main {
      display: block;
    }
    .learning-item-goal__content-heading-text,
    .learning-item-goal__content-heading-logo {
      margin-top: 10px;
    }
    .learning-item-goal__content-description {
      margin-bottom: 10px;
    }
    .learning-item-goal__image {
      margin-right: 0px;
    }
  }
`
export default learningItemGoalStyle
