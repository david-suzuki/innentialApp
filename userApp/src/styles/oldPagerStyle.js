import css from 'styled-jsx/css'
import variables from './variables'

export const pagerStyle = css.global`
  .pager {
    text-align: center;
  }
  .pager li {
    list-style-type: none;
    display: inline-block;
    padding: 0 8px;
    text-align: center;
    position: relative;
  }
  .pager li:before {
    content: '';
    width: 8px;
    height: 8px;
    background-color: ${variables.white};
    border: 2px solid ${variables.paleLilac};
    display: block;
    text-align: center;
    border-radius: 50%;
  }
  .pager--active:before {
    border: 2px solid ${variables.brandSecondary} !important;
  }
  .pager--active:after {
    content: '';
    width: 15px;
    height: 15px;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    z-index: -1;
    border: 4px solid ${variables.brandSecondary};
    border-radius: 50%;
    opacity: 0.2;
    position: absolute;
  }
`
export default pagerStyle
