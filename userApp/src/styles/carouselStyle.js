import css from 'styled-jsx/css'
import variables from './variables'

const carouselStyle = css.global`
  // Block
  // --------------------------------------------------

  // .slider-list {
  //   min-height: calc(100vw - 65rem);
  //  }

  .slider-list {
    min-height: max-content;
  }

  .slider li {
    padding: 0;
  }
  .slider li:before {
    content: none;
  }

  .slider-control-bottomcenter li {
    padding-left: 5px;
  }

  .slider-control-centerright {
    display: none;
  }

  .slider-control-centerleft {
    display: none;
  }

  .slider-control-bottomcenter {
    position: relative !important;
    margin: 20px 0;
  }

  .slider-slide > *:focus {
    outline: 0;
  }

  .paging-item button {
    outline: 0;
  }

  .paging-item {
    padding: 0 6px !important;
  }

  .paging-dot {
    list-style-type: none;
    display: inline-block;
    text-align: center;
    position: relative;
    background: transparent !important;
  }

  .paging-dot:before {
    content: '';
    width: 8px;
    height: 8px;
    background-color: ${variables.white};
    border: 2px solid ${variables.paleLilac};
    display: block;
    transform: translate(-12%, -10%);
    border-radius: 50%;
  }

  .paging-item.active .paging-dot:before {
    border: 2px solid ${variables.brandSecondary} !important;
  }

  .paging-item.active .paging-dot:after {
    content: '';
    width: 15px;
    height: 15px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin: auto;
    z-index: -1;
    border: 4px solid ${variables.brandSecondary};
    border-radius: 50%;
    opacity: 0.2;
    position: absolute;
  }
`
export default carouselStyle
