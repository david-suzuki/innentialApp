import css from 'styled-jsx/css'
import variables from './variables'

export const pagerStyle = css.global`
  .pager {
    text-align: left;
    list-style: none;
    counter-reset: li;
  }

  .pager-item {
    display: flex;
    align-items: center;
    color: ${variables.whiteTwo};
    margin: 48px 0;
  }

  .pager-item > .pager-item__description {
    white-space:nowrap;
    display: flex;
    align-items: center;
  }

  .pager-item--active {
    color: ${variables.brandPrimary};
  }

  .pager-item--active ul {
    list-style: none;
  }

  .pager li.pager-item {
    counter-increment: li;
    display:flex;
    align-items: flex-start;
    
  }

  .pager-item::before {
    content: counter(li);
    display: inline-block;
    font-size: 16px;
    font-weight: 800;
    border: 1px solid ${variables.whiteTwo};
    color: ${variables.warmGrey};
    border-radius: 50%;
    text-align: center;
    width: 34px;
    height: 34px;
    padding: 4px;
  }

  .footer-pager-item::before {
    content: '';
    display: inline-block;
    border: 1px solid ${variables.whiteTwo};
    border-radius: 50%;
    width: 16px;
    height: 16px;
  }
  .footer-pager-item--active::before {
    content: '';
    display: inline-block;
    background-color: ${variables.brandPrimary};
    width: 16px;
    height: 16px;
    border-radius: 50%;
  }

  .pager-item--active::before {
    border: 1px solid ${variables.brandPrimary};
    color: ${variables.brandPrimary};
    background-color: #ffff;
  }

  .pager-item--active::before {
    content: counter(li);
    display: inline-block;
    /* color: ${variables.warmGrey}; */
    border-radius: 50%;
    text-align: center;
    width: 34px;
    height: 34px;
    padding: 4px;
    /* border: 1px solid ${variables.whiteTwo}; */
  }

  .pager-item--done {
    display: flex;
    align-items: center;
    height: 34px;
  }

  .pager-item--done .pager-item__description {
    color: #8494b2;
  }

  .pager-item--done::before {
    content: '';
    background-color:#128945;
  }

  .pager-item__description {
    position: relative;
    margin-left: 12px;
    font-size: 16px;
    line-height: 26px;
    padding-top: 5px;
  }

  .pager-item__description.active-item svg {
    position: absolute;
    transform: translateX(1000%);
    right: 0;
    top: 5px;
    fill: none;
  }

  .pager-item__description > svg {
    position: absolute;
    left: 0;
    top:0;
    fill: #fff;
    transform: translate(-35px, 14px);
  }

  .footer-pager-container {
    position: fixed;
    bottom: 1%;
    left: 50%;
    transform: translateX(-50%);
  }

  .pager-sub-route {
    
    padding: 32px 0 0 16px;
  }

  .route--active {
    display: flex;
    width: 100%;
   position:relative;
    color: #152540;
  }

  .route--active svg {
    position: absolute;
    transform: translateX(400%);
    right: 0;
  }

  .route--inactive {
    color: #d8d8d8;
   }

  @media ${variables.md} {
    .footer-pager-container {
      position: absolute;
      bottom: 12px;
    }
  }

  .footer-pager {
    list-style-type: none;
    display: flex;
    counter-reset: li;
  }

  .footer-pager-item,
  .footer-pager-item--active {
    margin: 0 5px;
  }

  @media ${variables.lg} {
    .footer-pager-container {
      display: none;
    }
  }
`
export default pagerStyle
