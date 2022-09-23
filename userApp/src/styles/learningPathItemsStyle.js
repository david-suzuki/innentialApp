import css from 'styled-jsx/css'
import variables from './variables'

export const learningPathItemsStyle = css.global`
  .learning-path-items__list {
    margin-bottom: 40px;
  }

  .learning-path-items__list-heading {
    text-align: left;
    position: relative;
    top: 42px;
    font-size: 32px;
    font-weight: 900;
  }

  @media only screen and (max-width: 768px) {
    .learning-path-items__list {
      display: none;
    }
  }

  .learning-path-items__list--no-carousel {
    display: flex;
    margin-top: 40px;
  }

  .learning-path-items__list--no-carousel .learning-path-item-new {
    max-width: 300px;
    min-width: 250px;
  }

  .learning-path-items__list-mobile {
    display: block;
    margin-bottom: 36px;
  }

  @media only screen and (min-width: 769px) {
    .learning-path-items__list-mobile {
      display: none;
    }
  }
`
export default learningPathItemsStyle
