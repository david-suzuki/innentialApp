import css from 'styled-jsx/css'
import variables from './variables'

export const skillsFrameworkStyle = css.global`
  .skills-framework {
    margin-top: 20px;
    padding-right: 15px;
  }

  .skills-framework__title-category {
    display: inline-block;
    font-size: 13px;
    font-weight: 900;
    color: ${variables.black};
    margin-right: 7px;
  }

  .skills-framework__title-label {
    display: inline-block;
    font-size: 13px;
    font-weight: 500;
    color: ${variables.black};
  }

  .skills-framework__list {
    list-style-type: none;
    padding: 0;
    margin: 27px 20px 0 0;
  }

  .skills-framework__list__item {
    display: block;
    padding-left: 50px;
    font-size: 13px;
    font-weight: normal;
    color: ${variables.warmGrey};
    margin-bottom: 14px;
    position: relative;
    word-wrap: break-word;
  }

  .skills-framework__list-stars {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0.3;
  }

  .skills-framework__list-stars svg {
    margin-left: -8px;
    position: relative;
  }

  .skills-framework__list-stars svg:nth-child(1) {
    margin-left: 0;
    z-index: 5;
  }

  .skills-framework__list-stars svg:nth-child(2) {
    z-index: 4;
  }

  .skills-framework__list-stars svg:nth-child(3) {
    z-index: 3;
  }

  .skills-framework__list-stars svg:nth-child(4) {
    z-index: 2;
  }

  .skills-framework__list-stars svg:nth-child(5) {
    z-index: 1;
  }

  .skills-framework__list__item:last-child {
    margin-bottom: 0;
  }

  .skills-framework__list__item--selected {
    color: ${variables.black};
  }

  .skills-framework__list__item--prev-selected .skills-framework__list-stars {
    opacity: 1;
  }
`

export default skillsFrameworkStyle
