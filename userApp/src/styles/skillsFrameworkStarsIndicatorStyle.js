import css from 'styled-jsx/css'
import variables from './variables'

export const skillsFrameworkStarsIndicatorStyle = css.global`
  .skills-stars__wrapper {
    width: 100%;
  }

  .skills-stars {
    width: 200px;
    margin: 10px auto;
  }

  .skills-stars__name {
    font-family: Poppins;
    font-size: 14px;
    font-weight: 500;
    text-align: center;
  }

  .skills-stars__subtitle {
    margin-top: 5px;
    color: ${variables.warmGreyTwo};
    font-size: 10px;
    text-align: center;
  }

  .skills-stars__indicator {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .skills-stars__star-wrapper {
    width: 60px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .skills-stars__star {
    margin-right: 30px;
    cursor: pointer;
  }

  .skills-stars__star--profile {
    margin-right: -15px;
    cursor: auto;
  }

  .skills-stars__star:last-child {
    margin-right: 0;
  }

  .skills-stars__menu {
    position: absolute;
    color: ${variables.brandPrimary};
    font-size: 14px;
    cursor: pointer;
    width: 35px;
    right: 20px;
  }

  .skills-stars__dropdown {
    position: absolute;
    background-color: transparent;
    right: 0;
    visibility: hidden;
    opacity: 0;
    transition: all 400ms;
  }

  .skills-stars__dropdown ul {
    padding: 0;
  }

  .skills-stars__dropdown ul li {
    list-style: none;
    line-height: 10px;
    font-size: 12px;
    text-align: right;
    background: white;
    padding: 0 4px;
  }

  .skills-stars__dropdown ul li:not(:first-child) {
    padding-top: 5px;
  }

  .skills-stars__dropdown ul li a {
    color: ${variables.brandPrimary};
    font-size: 9px;
    line-height: 9px;
    cursor: pointer;
  }
  @media ${variables.md} {
    .skills-stars__dropdown ul li {
      font-size: 11px;
      line-height: 11px;
    }
    .skills-stars__dropdown ul li a {
      font-size: 11px;
      line-height: 11px;
    }
  }

  .skills-stars__dropdown.is-active {
    visibility: visible;
    opacity: 1;
  }
`

export default skillsFrameworkStarsIndicatorStyle
