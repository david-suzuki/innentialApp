import css from 'styled-jsx/css'
import variables from './variables'

export const userHeadingStyle = css.global`
  .user-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 5px 14px 5px;
    margin: 10px 0 18px 0;
    box-shadow: inset 0 -1px 0 0 ${variables.whiteFive};
    font-size: 12px;
    text-align: left;
    color: ${variables.warmGrey};
    font-weight: 400;
  }

  .user-heading__name-wrapper {
    display: flex;
    align-items: center;
    text-align: left;
  }

  .user-heading__name-wrapper img {
    width: 22px;
    height: 22px;
    border-radius: 50%;
  }

  .user-heading__name {
    font-size: 13px;
    font-weight: 500;
    color: ${variables.black};
    padding-left: 8px;
  }

  .user-heading__data-wrapper {
    display: flex;
  }

  .user-heading__department span {
    color: ${variables.black};
    font-weight: 700;
  }

  .user-heading__data-wrapper div:nth-child(2) {
    padding-left: 15px;
  }

  .user-heading__data-wrapper span {
    font-size: 15px;
    color: ${variables.black};
    font-weight: 800;
  }

  @media ${variables.lg} {
    .user-heading--hide-on-desktop {
      display: none;
    }
  }
`
export default userHeadingStyle
