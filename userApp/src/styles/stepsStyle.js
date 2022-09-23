import css from 'styled-jsx/css'
import variables from './variables'

export const stepsStyle = css.global`
  .steps__container {
    width: 600px;
    margin: 50px auto;
  }
  @media only screen and (max-width: 638px) {
    .steps__container {
      width: 330px;
    }
  }
  .steps__progressbar {
    counter-reset: step;
    display: flex;
    justify-content: center;
  }
  .steps__progressbar li {
    list-style-type: none;
    width: 25%;
    float: left;
    font-size: 12px;
    position: relative;
    text-align: center;
    color: #7d7d7d;
    font-size: 12px;
    font-weight: 500;
  }
  .steps__progressbar li:before {
    width: 10px;
    height: 10px;
    content: counter(step);
    counter-increment: step;
    line-height: 30px;
    border: 1px solid ${variables.warmGrey};
    display: block;
    text-align: center;
    margin: 0 auto 10px auto;
    border-radius: 50%;
    background-color: white;
    color: transparent;
  }

  .steps__progressbar li.active > span:before {
    content: '';
    display: block;
    width: 2px;
    height: 2px;
    border-radius: 50%;
    background-color: ${variables.brandPrimary};
    position: absolute;
    bottom: 32px;
    left: 74px;
  }
  @media only screen and (max-width: 638px) {
    .steps__progressbar li.active > span:before {
      left: 40px;
    }
  }

  .steps__progressbar li.complete > span:before {
    content: '✔';
    color: white;
    position: absolute;
    bottom: 30px;
    font-size: 4px;
    left: 74px;
  }

  .steps__progressbar li:after {
    width: 100%;
    height: 2px;
    content: '';
    position: absolute;
    background-color: #e6e6e6;
    top: 4px;
    left: -50%;
    z-index: -1;
  }
  .steps__progressbar li.active {
    color: ${variables.brandPrimary};
  }
  .steps__progressbar li.active:before {
    box-shadow: 0px 0px 0px 3px ${variables.paleLilac};
    color: transparent;
  }
  .steps__progressbar li:first-child:after {
    content: none;
  }
  .steps__progressbar li.complete {
    color: ${variables.apple};
  }
  .steps__progressbar li.complete:before {
    border-color: #55b776;
    background-color: limegreen;
  }
  .steps__progressbar li.complete + li:after {
    background-color: ${variables.apple};
  }
`

export default stepsStyle
