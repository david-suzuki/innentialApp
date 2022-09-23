import css from 'styled-jsx/css'

export default css.global`
  .extra-item__item {
    display: -webkit-box;
    align-items: center;
    margin-top: 18px;
  }

  .extra-item__icon {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #5a55ab;
    width: 28px;
    height: 28px;
    border-radius: 15px;
    box-shadow: 0px 1px 4px RGBA(0, 8, 32, 0.12),
      0px 4px 8px RGBA(0, 8, 32, 0.08);
  }

  .extra-item__item p {
    color: #556685;
    font-size: 16px;
    line-height: 30px;
    font-weight: normal;
    padding-left: 12px;
    margin: 0;
    text-align: left;
  }
`
