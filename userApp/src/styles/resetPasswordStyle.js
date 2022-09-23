import css from 'styled-jsx/css'
import variables from './variables'

export const resetPasswordStyle = css.global`
  .reset-password {
    /* margin-top: 100px; */
    margin: 100px auto;
  }

  .reset-password__heading {
    display: flex;
    position: relative;
    padding-left: 20px;
  }
  @media ${variables.md} {
    .reset-password__heading {
      align-items: center;
      padding-left: 0;
    }
  }

  .reset-password__heading .icon.icon-small-right::before {
    position: absolute;
    left: -10px;
    transform: rotate(180deg);
    font-size: 22px;
    cursor: pointer;
    ${variables.brandPrimary};
  }
  @media ${variables.md} {
    .reset-password__heading .icon.icon-small-right::before {
      left: -40px;
    }
  }
`
export default resetPasswordStyle
