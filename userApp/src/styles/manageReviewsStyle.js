import css from 'styled-jsx/css'
import variables from './variables'

export const manageReviewsStyle = css.global`
  .manage-reviews {
    position: relative;
    padding-top: 20px;
  }

  .manage-reviews__title {
    display: flex;
    justify-content: space-between;
    font-size: 22px;
    font-weight: 800;
    text-align: left;
    padding-bottom: 20px;
  }

  .manage-reviews__button-create {
    position: fixed;
    right: 0;
    top: auto;
    left: 50%;
    transform: translateX(-50%);
    bottom: 50px;
    z-index: 10;
  }

  @media ${variables.lg} {
    .manage-reviews__button-create {
      top: 35px;
      position: absolute;
      left: auto;
      transform: none;
      bottom: auto;
      z-index: 100;
    }
  }
`
export default manageReviewsStyle
