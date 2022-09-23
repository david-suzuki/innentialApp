import css from 'styled-jsx/css'
import variables from './variables'

export const skillItemBasicStyle = css.global`
  .skill-item-basic {
    padding: 25px 25px 45px !important;
  }

  .skill-item-basic__wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2px;
  }

  .skill-item-basic__level {
    font-size: 11px;
    line-height: 0.9;
    color: ${variables.warmGreyTwo};
    text-align: center;
    padding-left: 6px;
  }

  .skill-item-basic__level span {
    font-weight: 800;
    color: ${variables.black};
    line-height: 1.2;
  }
`
export default skillItemBasicStyle
