import css from 'styled-jsx/css'
import variables from './variables'

export const TeamDetailsStyle = css.global`
  .team-details .el-button--green {
    margin: 86px 0 20px 0;
  }

  @media ${variables.md} {
    .team-details {
      position: relative;
    }
    .team-details .el-button--team-member {
      position: absolute;
      margin: 0;
      top: 70px;
      right: 0;
      left: auto;
      transform: translate(0, 0);
    }
  }

  .team-details .el-button i {
    margin-left: 10px;
  }
`
export default TeamDetailsStyle
