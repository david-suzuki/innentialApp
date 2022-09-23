import css from 'styled-jsx/css'
import variables from './variables'

export const developmentPlanStyle = css.global`
  .development-plan__heading {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 40px;
    margin-top: 20px;
  }

  .development-plan__heading--fixed {
    display: flex;
    justify-content: center;
    align-items: center;
    // margin-bottom: 40px;
    // margin-top: 20px;
    position: sticky;
    background-color: white;
    box-shadow: rgba(0, 0, 0, 0.05) 0px -4px 7px 0px;
    z-index: 18;
    bottom: 0;
    margin: -20px;
    padding: 40px;
    transform: unset;
  }

  @media ${variables.md} {
    .development-plan__heading--fixed {
      padding: 40px;
    }
  }

  @media ${variables.lg} {
    .development-plan__heading--fixed {
      margin: -20px -40vw 0;
      transform: translateX(-55px);
      padding: 40px 36vw 40px 45vw;
    }
  }

  @media ${variables.xl} {
    .development-plan__heading--fixed {
      padding: 40px 37vw 40px 43vw;
    }
  }

  .development-plan__heading-info {
    flex: 1;
    margin-right: 28px;
  }

  .development-plan__heading-info h1 {
    font-size: 22px;
    font-weight: 800;
  }

  .development-plan__set-new-heading {
    font-size: 15px;
    font-weight: 800;
    margin: 20px 0;
  }

  .development-plan__back__button {
    font-size: 17px;
    cursor: pointer;
    float: left;
    color: ${variables.brandPrimary};
    border: 1px solid;
    width: 28px;
    height: 28px;
    border-radius: 20px;
    border-color: ${variables.paleLilac};
    background-color: ${variables.paleLilac};
    padding: 5px;
  }

  .development-plan__milestones-heading {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 16px;
    font-weight: 700;
    text-align: left;
    background: white;
    padding: 10px 13px;
    border-radius: 8px;
  }

  .development-plan__status-heading {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 16px;
    font-weight: 700;
    text-align: left;
    margin-top: 24px;
    background: white;
    border-radius: 8px;
  }

  .development-plan__status-heading span.numbers {
    width: 20px;
    position: absolute;
    display: flex;
    height: 20px;
    background: white;
    justify-content: center;
    align-items: center;
    top: 4px;
    right: -30px;
    border-radius: 15px;
    font-family: Poppins;
    font-style: normal;
    font-weight: normal;
    font-size: 10px;
    line-height: 16px;
    text-align: center;
    color: #5A55AB;
    background: #EFEEF7;
  }

  .goal__edit-button {
    font-family: 'Poppins', sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 10px;
    line-height: 16px;
    text-align: center;
    letter-spacing: 0.008em;
    color: #FFFFFF;
    background: #FEC97E;
    border-radius: 100px;
    padding: 6px 14px;
  }

  .development-plan__milestones-heading .el-select {
    width: 530px;
  }

  .development-plan__milestones-heading.setting-heading {
    justify-content: space-between;
    background: unset;
    padding: 0;
    font-family: Poppins;
    font-style: normal;
    font-weight: 900;
    font-size: 20px;
    line-height: 32px;
    color: #000000;
    max-width: 924px;
    width: 100%;
  }

  .development-plan__milestones__search-container {
    display: flex;
    max-width: 924px;
    width: 100%;
    gap: 16px;
  }
  
  .development-plan__milestones__search-bar{
    width: 100%;
    max-width: 585px;
  }

  .development-plan__milestones-heading .el-input__inner {
    font-size: 16px;
    line-height: 26px;
    font-family: 'Poppins', sans-serif;
    font-weight: 700;
    background: #EFEEF7;
    border-radius: 4px;
    margin-top: 0px;
    border-color: #EFEEF7;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .development-plan__milestones__search-bar .el-input__inner,
  .development-plan__milestones__search-bar .el-input__inner::placeholder{
    font-family: Poppins;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 22px;
    color: #8494B2;
  }

  .development-plan__milestones-heading .el-input__icon {
    box-sizing: border-box;
    position: absolute;
    right: 8px;
    top: 13px;
    display: block;
    transform: scale(var(--ggs,1));
    width: 20px;
    height: 14px;
    border: 2px solid transparent;
    border-radius: 100px
  }

  .development-plan__milestones-heading .heading-title {
    font-size: 14px;
    line-height: 22px;
    display: flex;
    align-items: center;
    color: #5a55ab;
    margin-right: 16px;
  }

  .development-plan__milestones-heading .heading-path-overview {
    border: 1px solid #5A55AB;
    font-family: 'Poppins', sans-serif;
    font-weight: bold;
    color: #5A55AB;
    font-size: 12px;
    line-height: 18px;
    margin-left: 16px;
  }

  .development-plan__milestones-heading .heading-path-overview svg {
    margin-right: 6px;
  }

  .development-plan__milestones-heading .heading-path-overview:hover {
    background-color: #5A55AB;
    color: white;
  }

  .development-plan__milestones-heading .heading-path-overview:hover svg path {
    fill: white;
  }

  .development-plan__milestones-heading .heading-path-overview span {
    display: flex;
    justify-content: center;
  }

  .development-plan__milestones-heading .el-input__icon::before {
    content: "" !important;
  }

  .development-plan__milestones-heading .el-input__icon::after {
    content: "";
    display: block;
    box-sizing: border-box;
    position: absolute;
    width: 10px;
    height: 10px;
    border-bottom: 2px solid;
    border-right: 2px solid;
    transform: rotate(-135deg);
    left: 4px;
    top: 2px
  }

  @media ${variables.md} {
    .development-plan__milestones-heading > .el-select {
      // width: 380px;
    }
  }

  .development-plan__controls-wrapper__header {
    display: flex;
    justify-content: flex-start;
  }
  .development-plan__controls-wrapper__header .development-plan__goal-control {
    margin: 17px 0;
  }

  .development-plan__controls-wrapper__header .goal-navs {
    border: 1px solid #D9E1EE;
    font-family: 'Poppins', sans-serif;
    font-weight: bold;
    color: #556685;
    background: transparent;
    font-size: 10px;
    line-height: 16px;
    padding: 6px 14px;
  }

  .development-plan__controls-wrapper__header .development-plan__goal-control .line {
    width: 60px;
    border-bottom: 1px solid #D9E1EE;
  }

  @media ${variables.lg}{
    .development-plan__controls-wrapper__header .development-plan__goal-control .line {
      width: 130px;
    }
  }

  @media ${variables.xs}{
    .development-plan__milestones-heading {
      flex-direction: column;
      align-items: baseline;
    }
    .development-plan__milestones-heading .el-select {
      width: 100%;
      margin: 16px 0;
    }
    .heading-path-overview {
      margin-left: 0px;
    }
    .development-plan__controls-wrapper__header .development-plan__goal-control .line {
      width: 30px;
    }
  }

  @media ${variables.xs}{
    .development-plan__controls-wrapper__header {
      display: none;
    }
  }
  @media ${variables.xxs}{
    .heading-path-overview {
      width: 100%;
    }
    .development-plan__milestones-heading .heading-title {
      justify-content: center;
    }
  }

  .development-plan__controls-wrapper__header .development-plan__goal-control .line.completed-goal {
    border-bottom: 1px solid #1CB55C !important;
  }

  .development-plan__controls-wrapper__header .goal-navs.active {
    border: 1px solid #5A55AB;!important;
    color: #5A55AB !important;
    background: white !important; 
  }

  .development-plan__controls-wrapper__header .goal-navs.completed-goal {
    border: 1px solid #1CB55C !important;
    color: white !important;
    background: #1CB55C !important; 
  }

  .development-plan__controls-wrapper__header .goal-navs:hover {
    background-color: #5A55AB;
    color: white;
  }

  .development-plan__controls-wrapper__footer {
    margin: 15px 0;
    display: flex;
    justify-content: space-between;
  }

  .development-plan__controls-wrapper__footer .goal-navs-control {
    margin-top: 12px;
    border: 1px solid #D9E1EE;
    font-family: 'Poppins', sans-serif;
    font-weight: bold;
    color: #556685;
    font-size: 14px;
    line-height: 22px;
    padding: 10px 30px;
    border-radius: 22px;
  }

  .development-plan__controls-wrapper__footer .goal-navs-control:hover {
    background-color: #5A55AB;
    color: white;
  }

  .development-plan__controls-wrapper__footer .goal-navs-control > span {
    display: flex;
    align-items: center;
  }

  .development-plan__controls-wrapper__footer .goal-navs-control .goal-navs-control__span {
    width: 45px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: inherit;
    padding-right: 8px
  }

  @media ${variables.lg}{
    .development-plan__controls-wrapper__footer .goal-navs-control .goal-navs-control__span {
      width: 360px;
      text-overflow: ellipsis;
    }
  }

  .development-plan__goal-control {
    display: flex;
    align-items: center;
  }

  .development-plan__goal-control > span {
    font-size: 13px;
    line-height: 28px;
    margin: 0 8px;
  }

  .development-plan__goal-control > i {
    font-size: 17px;
    cursor: pointer;
    color: ${variables.brandPrimary};
    border: 1px solid;
    width: 28px;
    height: 28px;
    border-radius: 20px;
    border-color: ${variables.paleLilac};
    background-color: ${variables.paleLilac};
    padding: 5px;
  }

  .development-plan__goal-control > i:hover {
    opacity: 0.7;
  }

  .development-plan__milestones-tabs .tabs-list-item {
    font-size: 13px;
    font-weight: 500;
    color: ${variables.warmGrey};
  }

  .highlight-label {
    border-radius: 3px;
    animation: highlight 1000ms ease-out;
  }

  @keyframes highlight {
    0% {
      background-color: ${variables.brandPrimary};
    }
    100 {
      background-color: white;
    }
  }

  .development-plan__tab-label {
    display: flex;
    align-items: center;
  }

  .development-plan__tab-item-length {
    color: ${variables.brandPrimary};
    font-size: 10px;
    background-color: ${variables.paleLilac};
    border-radius: 50%;
    width: 14px;
    height: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 6px;
    padding: 11px;
  }

  .development-plan__workshop {
    border-radius: 4px;
    border: 1px solid ${variables.warmGrey};
    padding: 20px;
    margin-bottom: 15px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .development-plan__workshop:hover {
    border: solid 1px ${variables.brandPrimary};
  }

  .development-plan__info {
    text-align: left;
  }

  .development-plan__workshop-heading a {
    font-size: 13px;
    font-weight: bold;
    margin-bottom: 7px;
    color: ${variables.black};
  }

  .development-plan__workshop-name {
    font-size: 13px;
    font-weight: normal;
    color: ${variables.warmGrey};
    margin-bottom: 7px;
  }

  .development-plan__workshop-date {
    font-size: 13px;
    font-weight: 500;
  }

  .development-plan__workshop-button {
    float: left;
    border-radius: 100px;
    height: 40px;
    position: relative;
    top: 10px;
    display: flex;
    align-items: center;
  }

  .development-plan__workshop-button span{
    font-family: Poppins;
    font-style: normal;
    font-weight: ${variables.bold700} !important;
    font-size: 14px;
    line-height: 22px;
    text-align: center;
    letter-spacing: 0.008em;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  @media ${variables.xs} {
    .development-plan__workshop-button {
      float: none;
    }
  }

  .development-plan__workshop-paid {
    font-size: 12px;
    font-weight: 600;
    color: ${variables.avocado};
    height: 12px;
    margin: 0 8px 10px 0;
  }

  .development-plan__workshop-icons {
    color: ${variables.white};
    display: flex;
    align-items: center;
    margin-left: auto;
    cursor: pointer;
  }

  .development-plan__workshop-icons p {
    color: ${variables.brandPrimary};
    font-size: 14px;
  }

  .development-plan__workshop-icons i {
    font-weight: bold;
    background-color: ${variables.brandPrimary};
    padding: 3px;
    border-radius: 16px;
    margin-right: 10px;
  }

  .development-plan__back-button {
    font-size: 17px;
    cursor: pointer;
    float: left;
    color: ${variables.duskyBlue};
    width: 28px;
    height: 28px;
  }

  .development-plan__back-button:hover {
    background-color: ${variables.paleLilacTwo};
  }

  .development-plan__save-button {
    cursor: pointer;
    color: ${variables.white};
    border: 1px solid;
    border-color: ${variables.brandPrimary};
    background-color: ${variables.brandPrimary};
    padding: 12px 38px;
    border-radius: 100px;
    font-weight: ${variables.bold700};
    font-size: 16px;
    line-height: 26px;
    text-align: center;
    letter-spacing: 0.008em;
    font-family: Poppins;
  }

  .development-plan__save-button--desktop {
    display: none;
  }

  @media ${variables.sm} {
    .development-plan__save-button--desktop {
      display: block;
    }
  }

  .development-plan__save-button--mobile {
    display: block;
    margin-left: 0 !important;
    width: 28px;
    height: 28px;
    border-radius: 20px;
    padding: 5px;
  }

  @media ${variables.sm} {
    .development-plan__save-button--mobile {
      display: none;
    }
  }

  .development-plan__save-button--mobile img {
    width: 16px;
    height: 11px;
  }

  .development-plan__save-button:hover {
    color: ${variables.brandPrimary};
    background-color: ${variables.white};
    border-color: ${variables.brandPrimary};
  }

  .development-plan__workshop-skill-tag {
    font-size: 12px;
    color: ${variables.brandPrimary};
    padding: 4px 16px 3px;
    background: ${variables.paleLilacTwo};
    display: inline-block;
    border-radius: 11px;
    margin: 0 14px 8px 0;
    opacity: 0.3;
  }

  @media ${variables.lg} {
    .development-plan__workshop-skill-tag {
      margin-right: 14px;
    }
  }

  .development-plan__workshop-caption {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin: 20px 0 0 0;
    max-width: 100%;
  }

  .development-plan__workshop-caption-name {
    font-size: 12px;
    color: ${variables.apple};
    cursor: pointer;
  }

  .development-plan__workshop-caption-name i {
    font-size: 12px;
    margin-right: 6px;
  }

  .development-plan__workshop-skill-tag--main {
    opacity: 1;
  }

  .development-plan__items-completed {
    display: flex;
    justify-content: space-between;
    font-weight: 500;
    line-height: 28px;
    padding: 5px 0px;
    margin: 10px 0px;
    border-top: 1px solid ${variables.whiteFive};
    border-bottom: 1px solid ${variables.whiteFive};
    color: ${variables.brandPrimary};
  }

  .development-plan__items-completed span {
    color: ${variables.warmGrey};
  }

  .development-plan__items-completed span span {
    font-size: 22px;
    color: ${variables.black};
    font-weight: 800;
  }

  .development-plan__completed, .development-plan__completed-mobile {
    border: none;
    outline: none;
    font-family: 'Poppins', sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 26px;
    color: #8494B2 !important;
    background: transparent !important;
    border: none;
    display: none;
  }

  .development-plan__completed-mobile {
    display: block;
  }

  @media ${variables.lg}{
    .development-plan__completed {
      display: block;
    }
    .development-plan__completed-mobile {
      display: none;
    }
  }

  @media ${variables.lg}{
    .development-plan__controls-wrapper__header .development-plan__goal-control .line {
      width: 130px;
    }
  }

  @media ${variables.xs}{
    .development-plan__milestones-heading {
      flex-direction: column;
      align-items: baseline;
    }
    .heading-path-overview {
      margin-left: 0px !important;
    }
    .development-plan__controls-wrapper__header .development-plan__goal-control .line {
      width: 30px;
    }
  }

  @media ${variables.xxs}{
    .development-plan__controls-wrapper__header {
      display: none;
    }
  }

  .development-plan__content-list {
    min-height: 1200px;
  }

  .development-plan__milestones-wrapper .bottom-nav__previous {
    font-style: normal;
    font-weight: ${variables.bold700};
    font-size: 21px;
    line-height: 26px;
    text-align: center;
    letter-spacing: 0.008em;
    color: ${variables.desaturatedBlue};
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
}

  .development-plan__milestones-wrapper .bottom-nav__previous span{
    font-size: 16px;
  }

  .development-plan__milestones-wrapper .development-plan__back-button {
    font-size: 21px;
    cursor: pointer;
    float: left;
    color: inherit;
    width: auto;
    height: auto;
}

  .el-button--green {
    opacity: 1 !important;
  }

`
export default developmentPlanStyle
