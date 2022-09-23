import css from 'styled-jsx/css'
import variables from './variables'

export const locationStyle = css.global`
  .location {
    color: ${variables.warmGrey};
    display: flex;
    align-items: center;
  }

  .location.location--large .icon {
    font-size: 16px;
    margin-right: 14px;
    margin-top: -2px;
    margin-left: -3px;
  }

  .location.location--small .icon {
    font-size: 12px;
    margin-right: 5px;
    margin-top: -2px;
    margin-left: -3px;
  }

  .location--large {
    font-size: 13px;
  }

  .location--small {
    font-size: 12px;
  }
`

export default locationStyle
