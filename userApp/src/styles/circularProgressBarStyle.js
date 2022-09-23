import css from 'styled-jsx/css'
import variables from './variables'

const circularProgressBarStyle = css.global`
  .circle-background,
  .circle-progress {
    fill: none;
  }

  .circle-background {
    stroke: ${variables.paleLilac};
  }

  .circle-progress {
    stroke: ${variables.brandPrimary};
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .circle-text {
    font-size: 13px;
    font-weight: 500;
    fill: black;
  }

  .circle-text--info {
    font-size: 8px;
    font-weight: 400;
    fill: ${variables.warmGrey};
  }
`

export default circularProgressBarStyle
