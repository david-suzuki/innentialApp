import css from 'styled-jsx/css'
import variables from './variables'

export const skillItemStyle = css.global`
  .skill-item {
    border-bottom: none !important;
    border-radius: 4px;
    box-shadow: 0 6px 11px 5px rgba(0, 0, 0, 0.05);
    padding: 25px !important;
    margin-bottom: 24px;
    background-color: white;
  }

  @media ${variables.sm} {
    .skill-item {
      flex-basis: calc(50% - 12px);
    }

    .skill-item:nth-child(2n + 1) {
      margin-right: 6px;
    }

    .skill-item:nth-child(2n) {
      margin-left: 6px;
    }
  }

  @media only screen and (max-width: 767px) {
    .skill-item {
      flex-basis: 100%;
    }
  }

  .skills-title {
    display: flex;
    align-items: center;
    margin-bottom: 22px;
    justify-content: space-between;
  }
  @media ${variables.lg} {
    .skills-title {
      margin-bottom: 38px;
    }
  }

  .skills-title i {
    font-size: 14px;
    transform: rotate(180deg);
    color: ${variables.brandPrimary};
    cursor: pointer;
  }

  .skills-title h3 {
    font-size: 16px;
    font-weight: 800;
    margin-left: 4px;
  }

  .skills-sort {
    display: flex;
    align-items: center;
    font-size: 11px;
    color: ${variables.brandPrimary};
  }

  .skills-sort span {
    margin: 0 7px;
  }

  .skills-sort__item {
    font-size: 11px;
    font-weight: 300;
    color: ${variables.warmGrey};
    cursor: pointer;
  }

  .skills-description {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 18px 0;
    margin-bottom: 15px;
    font-size: 12px;
    line-height: 0.9;
    color: ${variables.warmGreyTwo};
  }

  .skills-description--no-padding {
    padding: 0;
    margin-bottom: 0;
  }

  .skills-description__wrapper {
    display: flex;
    align-items: center;
  }

  .skills-description__dot {
    list-style-type: none;
    display: inline-block;
    padding: 0 8px;
    text-align: center;
    position: relative;
    margin-left: 16px;
  }

  .skills-description__dot:before {
    content: '';
    width: 8px;
    height: 8px;
    background-color: ${variables.white};
    border: 2px solid ${variables.brandPrimary};
    display: block;
    text-align: center;
    border-radius: 50%;
  }

  .skills-description__dot:after {
    content: '';
    width: 16px;
    height: 16px;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    z-index: -1;
    border: 4px solid ${variables.brandPrimary};
    border-radius: 50%;
    opacity: 0.2;
    position: absolute;
  }

  .skills-description__dot--needed:before {
    border: 2px solid ${variables.darkGreen};
  }

  .skills-description__dot--needed:after {
    border: 4px solid ${variables.darkGreen};
  }

  .skill__users {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
  }

  .skill__users-item {
    display: flex;
    align-items: center;
    text-align: left;
    flex: 1;
  }

  .skill__users-item-count {
    color: ${variables.duskyBlue};
    font-size: 18px;
    font-weight: bold;
    line-height: 1.22;
  }

  .skill__users-item-count:hover {
    color: ${variables.duskyBlueLight};
  }

  .skill__users-item-count-label {
    margin-left: 8px;
    line-height: 1.13;
    color: #000000;
  }

  .skill__users a {
    font-size: 11px;
    line-height: 0.9;
    color: ${variables.black};
  }

  .skill-name {
    font-size: 15px;
    font-weight: 800;
    margin-bottom: 15px;
    text-align: left;
  }

  .skill__user-image {
    width: 26px;
    height: 26px;
    margin-right: 10px;
    border-radius: 50%;
  }

  .skill__user-count {
    background: ${variables.whiteSix};
    width: 16px;
    height: 16px;
    border-radius: 50%;
    font-size: 10px;
    text-align: center;
  }

  .skill__user-count span {
    line-height: 2.2;
    letter-spacing: -0.8px;
    margin-left: -2px;
  }

  .progress-bar {
    width: 100%;
    bottom: 0;
    margin-top: 10px;
    background-image: none;
    background-color: none;
    height: 10px;
    border-radius: 4px;
    border: solid 1px ${variables.whiteFive};
    background-size: 100% 10px;
    position: relative;
    z-index: 10;
  }

  .progress-bar__meter {
    height: 8px;
    background-color: none;
    background-image: none;
    border-radius: 4px;
    position: relative;
  }

  .level-bar__wrapper {
    width: 100%;
    position: relative;
    z-index: 10;
    border-bottom: 1px solid ${variables.whiteFour};
  }

  .level-bar__wrapper .skill-bar:first-of-type {
    margin-bottom: 20px;
  }

  .level-bar {
    display: flex;
  }

  .level-bar__item {
    height: 5px;
    border-radius: 4px;
    border: solid 1px ${variables.whiteFive};
    width: 20%;
  }

  .level-bar__item--needed {
    background-color: ${variables.brandSecondary};
    z-index: 11;
  }

  .level-bar__item--available {
    background-color: ${variables.brandPrimary};
    z-index: 12;
  }

  .progress-bar__meter--needed {
    background-color: ${variables.brandSecondary};
    z-index: 11;
  }

  .progress-bar__meter--available {
    background-color: ${variables.brandPrimary};
    margin-top: -8px;
    z-index: 12;
  }

  .skill__user-name-wrapper,
  .skill-name-wrapper {
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 500;
  }

  .skill__user-name {
    max-width: 130px;
    word-wrap: break-word;
  }

  .skill__user-name-wrapper {
    text-align: left;
  }

  .skill__user-name-wrapper:hover {
    cursor: pointer;
  }

  @media ${variables.md} {
    .skill__user-name-wrapper {
      font-size: 15px;
    }
  }

  .skill__information-label {
    font-size: 12px;
    margin-top: 15px;
    text-align: left;
    color: ${variables.warmGreyTwo};
  }

  .skill__information-wrapper {
    display: flex;
    padding-top: 15px;
  }

  .skill__information-item {
    padding-right: 40px;
    font-size: 11px;
    line-height: 0.9;
    color: ${variables.warmGrey};
  }

  .skill__information-item span {
    color: ${variables.black};
    font-weight: 800;
  }

  .skill__leader-button {
    margin: 15px 15px 0 auto;
    display: flex;
  }

  .skill__leader-button:focus {
  }

  .skillgap__heading {
    position: relative;
  }

  .skillgap__heading-label {
    font-size: 24px;
    font-weight: 800;
  }

  .skillgap__heading .icon.icon-small-right::before {
    position: absolute;
    left: 10px;
    margin-top: 8px;
    transform: rotate(180deg);
    font-size: 22px;
    cursor: pointer;
    color: ${variables.brandPrimary};
  }
  @media ${variables.lg} {
    .skillgap__heading .icon.icon-small-right::before {
      left: 20px;
    }
  }

  .skillgap__search-box {
    display: flex;
    margin-bottom: 18px;
  }

  .skillgap__search-box .el-input__inner {
    padding: 0 36px 0 8px;
  }

  .skillgap__search-box-input {
    flex: 2 0 0;
    margin-right: 24px;
  }

  .skillgap__search-box-input .el-icon-search {
    color: ${variables.brandPrimary};
    margin-right: 8px;
  }

  .skillgap__search-box-select {
    flex: 1 0 0;
  }

  .tab-content--2-columns {
    box-shadow: none;
    padding: 22px 10px 26px;
  }

  .tab-content--2-columns .list {
    overflow: visible;
  }

  @media ${variables.sm} {
    .tab-content--2-columns .list .skills__list {
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      justify-content: space-between;
    }
  }

  .skills-evaluate-button {
    font-size: 12px;
    font-weight: 500;
    margin-left: 25px;
  }

  .skills-evaluate-button span {
    font-size: 18px;
    margin-left: 6px;
  }

  .skills-title-wrapper {
    justify-content: flex-start !important;
  }

  .skills-container {
    position: relative;
  }

  .skills-container .el-dialog__wrapper {
    overflow: hidden;
  }

  .skills__filter {
    display: none;
    text-align: left;
    width: 280px;
    position: fixed;
    z-index: 10;
    right: -10px;
    transform: translateX(100%);
    padding-left: 10px;
    margin-top: 20px;
  }

  @media screen and (min-width: 1440px) {
    .skills__filter {
      width: 320px;
    }
  }

  @media ${variables.lg} {
    .skills__filter {
      display: block;
    }
  }

  .skills-filter-button {
    display: block;
    position: fixed;
    bottom: 50px;
    left: 50%;
    transform: translateX(-50%);
  }

  @media ${variables.lg} {
    .skills-filter-button {
      display: none;
    }
  }

  .skills__filter .el-checkbox__label {
    width: 300px;
  }

  .skill-item__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 17px;
  }

  .skill-item__header.no-evaluated-bar {
    margin-bottom: 0;
  }

  .skill-item__header-count {
    font-size: 12px;
    color: ${variables.warmGrey};
    text-align: right;
    white-space: nowrap;
  }

  .skill-item__header-count__item {
    font-weight: 600;
  }

  .skill-item__header-count__item:last-child {
    margin-left: 5px;
  }

  .skill-item__skillbar-wrapper {
    padding: 0;
    border: 0;
  }

  .skill-item__skillbar-wrapper .skill-bar {
    margin-bottom: 0 !important;
  }
`

export default skillItemStyle
