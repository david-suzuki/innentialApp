import css from 'styled-jsx/css'
import variables from './variables'

export const skillDetailsStyle = css.global`
  .skill-details .el-form-item__label {
    font-size: 24px;
    font-weight: 800;
  }

  .skill-details .el-form-item__description {
    font-size: 14px;
    font-weight: 500;
    color: ${variables.black};
    max-width: 80%;
    line-height: 1.8;
    padding: 20px 0 25px;
  }

  .skill-details__heading {
    position: relative;
  }

  .skill-details .skill__user-name-wrapper {
    margin-bottom: 4px;
  }

  .skill-details .list {
    box-shadow: none;
  }

  .skill-details__heading .icon.icon-small-right::before {
    position: absolute;
    left: 10px;
    margin-top: 8px;
    transform: rotate(180deg);
    font-size: 22px;
    cursor: pointer;
    color: ${variables.brandPrimary};
  }
  @media ${variables.md} {
    .skill-details__heading .icon.icon-small-right::before {
      left: 20px;
    }
  }

  .skill-details__list {
    display: flex;
    flex-wrap: wrap;
  }

  .skill-details__list.no-required-skills {
    padding-top: 50px;
  }

  .skill-details__subtitle {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
    margin-bottom: 50px;
  }

  .skill-details__subtitle__text {
    font-size: 14px;
    font-weight: 500;
    margin-right: 10px;
    color: ${variables.warmGrey};
  }

  .skill-details__subtitle__count {
    border-radius: 50%;
    background-color: ${variables.darkGreen};
    width: 23px;
    height: 23px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${variables.white};
    font-size: 12px;
    font-weight: bold;
  }
`
export default skillDetailsStyle
