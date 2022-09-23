import css from 'styled-jsx/css'
import variables from './variables'

export const tabsStyle = css.global`
  .tabs {
    width: 100%;
  }

  .tabs-list {
    width: 100%;
    list-style-type: none;
    margin: 0;
    padding: 0 0 15px 0;
    text-align: left;
    display: flex;
    flex-wrap: wrap;
    white-space: nowrap;
    justify-content: flex-start;
    margin: 0 -12px;
  }

  .tabs-list--flex {
    justify-content: space-evenly;
    margin: 0 !important;
  }

  @media ${variables.md} {
    .tabs-list--flex {
      flex-wrap: nowrap;
      justify-content: space-between;
    }
  }
  .tabs-list::-webkit-scrollbar {
    width: 3px;
    height: 3px;
  }

  .tabs-list::-webkit-scrollbar-thumb {
    background-color: ${variables.linkColor};
  }

  .tabs-list--no-borders {
    padding: 0;
  }

  .tabs-list-item {
    margin: 0 12px;
    font-family: 'Poppins', sans-serif;
    height: 40px;
    box-sizing: border-box;
    line-height: 40px;
    display: inline-block;
    font-size: 14px;
    font-weight: 700;
    color: ${variables.warmGrey};
    position: relative;
    cursor: pointer;
  }

  .tabs-list-item:last-child {
    padding-right: 0;
  }

  .tabs-list-item:last-child::after {
    left: 50%;
  }

  .tabs-list-item::after {
    content: '';
    position: absolute;
    bottom: 0;
    width: 100%;
    border-bottom: 2px solid transparent;
  }

  .tabs-list-item--active {
    color: #152540 !important;
    // color: ${variables.linkColor} !important;
  }

  .tabs-list-item--active::after {
    content: '';
    position: absolute;
    bottom: 0;
    width: 100%;
    border-bottom: 2px solid ${variables.linkColor};
    left: 50%;
    transform: translateX(-50%);
  }

  .tabs-list-item--disabled {
    cursor: auto;
    opacity: 0.5;
    border-bottom: 2px solid transparent;
  }

  .tabs-list-item--no-borders::after {
    border-bottom: 2px solid transparent;
  }

  @media ${variables.md} {
    .tabs-list-item--box:not(:last-child) {
      margin-right: 23px;
    }
  }

  .tabs-list-item--box {
    width: 256px;
    padding: 6px 16px !important;
    height: unset;
    font-weight: unset;
    border: 1px solid #d9e1ee;
    background-color: #f6f8fc;
    color: #556685;
    border-radius: 100px;
    margin-bottom: 20px;
  }

  .tabs-list-item--box.tabs-list-item--active {
    transition: border-color 1.4s ease-in, background-color 1.4s ease-in,
      color 1.4s ease-in;
    background-color: ${variables.brandPrimary};
    color: ${variables.white} !important;
    border-color: ${variables.brandPrimary};
  }

  .tabs-list-item--box.tabs-list-item--active .svg-fill > path {
    transition: fill 1.4s ease-in;
    fill: ${variables.white} !important;
  }

  .tabs-list-item--box.tabs-list-item--active .svg-stroke > path {
    transition: stroke 1.4s ease-in;
    stroke: ${variables.white} !important;
  }
`

export default tabsStyle
