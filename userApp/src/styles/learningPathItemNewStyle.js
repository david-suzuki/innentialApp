import css from 'styled-jsx/css'
import variables from './variables'

export const learningPathItemNewStyle = css.global`
  .learning-path-item-new {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 0px 4px 8px rgba(0, 8, 32, 0.06),
      0px 1px 4px rgba(0, 8, 32, 0.08);
    border-radius: 4px;
    margin: 5px 5px 22px;
    padding: 0 0 20px;
    overflow: hidden;
    /* cursor: pointer; */
    background-color: ${variables.white};
  }

  @media only screen and (min-width: 769px) {
    .learning-path-item-new {
      min-height: 412px;
    }
  }

  .learning-path-item-new__wrapper {
    flex-direction: column;
  }

  .learning-path-item-new__team {
    text-align: left;
    color: ${variables.warmGrey};
    display: flex;
    align-items: center;
    font-size: 14px;
    opacity: 0.7;
    background-color: ${variables.white};
    padding: 6px;
    border-radius: 8px;
  }

  .learning-path-item-new__team i {
    margin-right: 6px;
    font-size: 17px;
  }

  .learning-path-item-new__team span {
    margin-left: 6px;
    font-weight: 600;
  }

  .learning-path-item-new:hover {
    box-shadow: 0 6px 11px 5px rgba(0, 0, 0, 0.11);
  }

  .learning-path-item-new__content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0 15px;
  }

  .learning-path-item-new_tags {
    display: flex;
  }

  .learning-path-item-new__heading {
    font-weight: 800;
    font-size: 16px;
    color: #152540;
    text-align: left;
    margin-bottom: 10px;
  }

  .learning-path-item-new__description {
    font-size: 14px;
    line-height: 18px;
    color: #556685;
    text-align: left;
    margin-bottom: 26px;
  }

  .learning-path-item-new__image {
    display: grid;
    height: 152px;
    margin-bottom: 20px;
  }

  @media screen and (min-width: 768px) and (max-width: 1200px) {
    .learning-path-item-new__image {
      height: 152px;
      margin-bottom: 8px;
    }
  }

  .learning-path-item-new__preview-tag {
    background-color: ${variables.brandSecondary};
    color: ${variables.white};
    font-weight: 600;
    border-radius: 50px;
    margin: 11px 16px 0 auto;
    font-size: 13px;
    grid-column: 1;
    grid-row: 1;
    width: fit-content;
    height: fit-content;
    padding: 6px 14px;
  }

  .learning-path-item-new__image img {
    object-fit: cover;
    grid-column: 1;
    grid-row: 1;
    max-height: 152px;
    width: 100%;
    height: 100%;
  }

  .learning-path-item-new__tags {
    display: flex;
    flex-wrap: wrap;
  }

  .learning-path-item-new__tag {
    display: block;
    color: $brand-primary;
    background-color: #f9f8fc;
    padding: 2px 6px;
    border-radius: 4px;
    margin-bottom: 15px;
    margin-right: 10px;
    font-weight: bold;
    font-size: 10px;
    line-height: 16px;
  }

  .learning-path-item-new__skills {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    width: 100%;
  }

  .learning-path-item-new__skills::-webkit-scrollbar {
    display: none;
  }

  .learning-path-item-new__skill {
    font-weight: bold;
    font-size: 12px;
    line-height: 18px;
    color: #5a55ab;
    flex: 0 0 auto;
    padding: 5px 10px;
    background-color: #f9f8fc;
    margin-right: 10px;
    border-radius: 4px;
  }

  .learning-path-item-new__footer-icons {
    display: flex;
    height: 100%;
    align-items: flex-end;
  }

  .learning-path-item-new__timer {
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid #d9e1ee;
    padding-top: 16px;
  }

  .learning-path-item-new__timer img {
    width: 24px;
    height: 24px;
  }

  .learning-path-item-new__timer span {
    margin: 0 4px;
    font-size: 12px;
    line-height: 18px;
    color: ${variables.darkBlue};
    font-weight: 600;
  }
`
export default learningPathItemNewStyle
