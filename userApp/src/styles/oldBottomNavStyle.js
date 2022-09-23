import css from 'styled-jsx/css'

export const oldBottomNavStyle = css.global`
  .bottom-nav {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .bottom-nav__previous {
    padding-right: 24px;
    position: relative;
    cursor: pointer;
  }
  .bottom-nav__previous span {
    font-size: 11px;
  }
  .bottom-nav__previous .icon-e-remove {
    position: absolute;
    top: 8px;
    left: -18px;
    font-size: 12px;
  }
  .bottom-nav__previous .icon-tail-left {
    position: absolute;
    top: 8px;
    left: -18px;
    font-size: 12px;
  }
  .bottom-nav__button span {
    font-size: 18px;
  }
  .el-button .icon-tail-right {
    font-size: 18px;
    margin-top: 2px;
  }
`
export default oldBottomNavStyle
