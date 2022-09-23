import css from 'styled-jsx/css'
import variables from './variables'

export const addUserStyle = css.global`
  .add-user p {
    font-size: 11px;
    color: ${variables.brandPrimary};
    padding: 10px 0 40px;
    cursor: pointer;
  }

  .add-user__heading {
    display: flex;
    position: relative;
    padding-left: 20px;
  }
  @media ${variables.md} {
    .add-user__heading {
      align-items: center;
      padding-left: 0;
    }
  }

  .add-user__heading .icon.icon-small-right::before {
    position: absolute;
    left: -10px;
    transform: rotate(180deg);
    font-size: 22px;
    cursor: pointer;
    color: ${variables.brandPrimary};
  }
  @media ${variables.md} {
    .add-user__heading .icon.icon-small-right::before {
      left: -40px;
    }
  }
`
export default addUserStyle
