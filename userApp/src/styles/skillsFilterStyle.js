import css from 'styled-jsx/css'
import variables from './variables'

export const skillsFilterStyle = css.global`
  .skills-filter-checkbox-wrapper {
    margin-top: 25px;
    border-bottom: 1px solid ${variables.whiteFour};
    padding-bottom: 25px;
    text-align: left;
  }

  .skills-filter-description {
    width: 100%;
    border: 1px solid ${variables.whiteFour};
    margin-top: 20px;
  }

  .skills-filter-description .skills-description__dot:first-child {
    margin-left: 0;
  }

  .skills-filter-title {
    font-size: 23px;
    font-weight: 500;
  }

  @media ${variables.lg} {
    .skills-filter-title {
      font-size: 13px;
    }
  }
`

export default skillsFilterStyle
