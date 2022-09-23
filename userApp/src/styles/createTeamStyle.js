import css from 'styled-jsx/css'
import variables from './variables'

export const createTeamStyle = css.global`
  .create-team p {
    font-size: 11px;
    color: ${variables.brandPrimary};
    padding: 10px 0 20px;
    cursor: pointer;
  }

  .create-team form button {
    margin-top: 12px;
  }

  .create-team__heading {
    display: flex;
    position: relative;
  }
  @media ${variables.md} {
    .create-team__heading {
      align-items: center;
    }
  }

  .create-team__heading .icon.icon-small-right::before {
    position: absolute;
    transform: rotate(180deg);
    left: -10px;
    font-size: 22px;
    cursor: pointer;
    ${variables.brandPrimary};
  }
  @media ${variables.md} {
    .create-team__heading .icon.icon-small-right::before {
      left: -40px;
    }
  }

  .create-team__members .el-input .icon.icon-e-remove::before {
    cursor: pointer;
    color: ${variables.fadedRed};
  }

  .platform-invites .el-checkbox {
    margin-top: 12px;
    max-width: none;
  }
`
export default createTeamStyle
