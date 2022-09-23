import css from 'styled-jsx/css'
import variables from './variables'

const chooseYourReasonBoxStyle = css.global`
  .choose-your-reason-box__option {
    padding: 10px;
    display: flex;
    align-items: baseline;
  }

  .choose-your-reason-box__option__other {
    margin-right: 10px;
    font-size: 13px;
  }

  .choose-your-reason-box__submitted {
    height: 282.7px;
    display: flex;
    align-items: center;
  }

  .el-button--choose-your-reason {
    border-radius: 4px;
    height: 40px;
    padding: 0px 10px;
    box-sizing: border-box;
  }
`

export default chooseYourReasonBoxStyle
