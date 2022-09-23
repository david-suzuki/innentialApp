import css from 'styled-jsx/css'
import variables from './variables'

export const requestItemStyle = css.global`
  .request-item__wrapper {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }

  .learning-item-new__info {
    max-width: 65%;
  }

  .request-item__status-wrapper {
  }

  .request-item__reviewed-by {
  }

  .request-item__status {
    text-align: right;
    font-size: 14px;
    font-weight: 600;
  }

  .request-item__note {
    margin-top: 26px;
  }

  .request-item__note p {
    font-size: 12px;
  }

  .request-item__status-box {
    position: absolute;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    line-height: 33px;
    color: ${variables.white};
    font-size: 24px;
    font-weight: 800;
    margin: -12px 0 0 -15px;
  }

  .request-item__options {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    padding: 15px 24px 15px 32px;
    border-top: 1px solid ${variables.whiteFive};
  }

  @media ${variables.xs} {
    .request-item__options {
      flex-direction: column;
    }
  }
`
export default requestItemStyle
