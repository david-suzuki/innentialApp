import css from 'styled-jsx/css'
import variables from './variables'

export const skillBarStyle = css.global`
  .skill-bar {
    width: 100%;
    position: relative;
    background: pink;
  }

  .skill-bar__track {
    height: 3px;
    border-radius: 4px;
    background-color: #fcfcfc;
    width: 100%;
  }

  .skill-bar__indicator-line {
    height: 3px;
    border-radius: 4px;
    position: absolute;
    left: 0;
    top: 0;
  }

  .skill-bar__indicator-pin {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${variables.white};
    font-size: 10px;
    font-weight: bold;
    line-height: 1.13;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-52%);
    cursor: pointer;
  }

  .skill-bar__tooltip {
    z-index: 300;
  }

  .skill-bar__tooltip-display {
    background-color: white;
    color: ${variables.warmGrey};
    font-size: 11px;
    position: absolute;
    padding: 15px;
    display: none;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.11);
    text-align: left;
    width: 185px;
    bottom: 35px;
    z-index: 300;
  }

  @media only screen and (max-width: 768px) {
    .skill-bar__tooltip-display {
      right: -40px;
    }
  }

  .skill-bar__tooltip-display:after {
    top: 99%;
    left: 50%;
    border: solid transparent;
    content: ' ';
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-color: rgba(255, 255, 255, 0);
    border-top-color: #ffffff;
    border-width: 10px;
    margin-left: -10px;
    z-index: 400;
  }

  .skill-bar__tooltip-display__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: normal;
    margin-bottom: 12px;
  }

  .skill-bar__tooltip-display__skillvalue {
    color: ${variables.black};
  }

  .skill-bar__tooltip-display__item:last-child {
    margin-bottom: 0;
  }

  .skill-bar__tooltip-display__item:first-child
    .skill-bar__tooltip-display__username {
    color: ${variables.brandPrimary};
    font-weight: bold;
  }

  .skill-bar__tooltip-display__item:first-child
    .skill-bar__tooltip-display__skillvalue {
    color: ${variables.brandPrimary};
    font-weight: bold;
  }

  .skill-bar__tooltip:hover .skill-bar__tooltip-display {
    display: block;
  }
`

export default skillBarStyle
