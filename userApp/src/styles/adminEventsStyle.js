import css from 'styled-jsx/css'
import variables from '$/styles/variables'

const adminEventStyle = css.global`
  .admin-paths__container {
    background: ${variables.white};
    border-radius: 4px;
    width: 100%;
    padding: 19px 18px;
  } 

  .subtabs .tabs-list-item {
    font-size: 14px;
    color: ${variables.darkBlueTwo};
  }

  .add-event__button {
    display: flex;
    align-items: center;
    position: absolute;
    right: 0px;
    top: 6px;
  }

  .add-event__button span{
    font-size: 12px;
    font-weight: ${variables.bold700};
    line-height: 18px;
    letter-spacing: 0.5px;
  }
`

export default adminEventStyle
