import css from 'styled-jsx/css'
import variables from './variables'

export const profilesStyle = css.global`
  .profiles {
    margin-top: 20px;
  }
  @media ${variables.sm} {
    .profiles {
      text-align: left;
    }
    .profiles__user-name {
      margin: 0 !important;
    }
  }

  .profiles .list-profile {
    box-shadow: none;
    padding: 0 0 26px;
    overflow: visible;
  }

  @media ${variables.sm} {
    .profiles .list-profile {
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      justify-content: space-between;
    }
  }

  .profiles__heading {
    position: relative;
  }
  @media ${variables.sm} {
    .profiles__heading {
      display: flex;
    }
  }

  .profiles__heading .icon.icon-small-right::before {
    position: absolute;
    transform: rotate(180deg);
    top: 0;
    left: -10px;
    font-size: 22px;
    cursor: pointer;
    ${variables.brandPrimary};
  }
  @media ${variables.md} {
    .profiles__heading .icon.icon-small-right::before {
      left: -15px;
    }
  }

  .profiles__user-image {
    position: relative;
    display: inline-flex;
  }
  @media ${variables.sm} {
    .profiles__user-image {
      display: block;
      margin: 10px 35px 10px 0;
    }
  }

  .profiles__user-image img {
    width: 98px;
    height: 98px;
    border-radius: 50%;
    position: relative;
    z-index: 10;
  }

  .profiles__role {
    font-size: 14px;
    line-height: 22px;
    font-weight: bold;
  }

  .profiles__role.admin {
    color: ${variables.gold};
  }

  .profiles__role.leader {
    color: ${variables.brandPrimary};
  }

  .profiles__role.employee {
    color: ${variables.brandSecondary};
  }

  .profiles__user-heading {
    display: flex;
    justify-content: space-between;
    max-width: 600px;
  }
  @media screen and (max-width: 768px) {
    .profiles__user-heading {
      max-width: unset;
      flex-direction: column;
      align-items: center;
    }
    .profiles__user-heading > div {
      justify-content: space-around;
      width: 100%;
    }
  }

  .profiles__user-image::before {
    content: '';
    z-index: 8;
    position: absolute;
    width: 108px;
    height: 108px;
    border-radius: 50%;
    top: -5px;
    left: -5px;
    background: white;
    border: 1px solid #8494b2;
  }

  .profiles__personal-info {
    flex-grow: 2;
  }

  .profiles__user-name {
    margin: auto;
    font-size: 24px;
    line-height: 1.5;
    font-weight: 800;
    word-wrap: break-word;
  }

  .profiles__user-position {
    font-size: 12px;
    line-height: 18px;
    margin: 0px 0 8px;
    text-transform: capitalize;
  }

  .profiles__user-team {
    padding: 4px 7px 2px;
    background: #ffffff;
    border: 1px solid #efeef7;
    box-sizing: border-box;
    border-radius: 4px;
    max-width: 400px;
    text-align: left;
  }
  @media screen and (max-width: 768px) {
    .profiles__user-team {
      margin: auto;
    }
  }

  .profiles__user-team__tabs .tabs-list-item {
    font-size: 12px;
    padding: 0 10px 0 0;
    height: auto;
    border: 0;
    line-height: 18px;
    color: ${variables.warmGrey};
    font-weight: 400;
  }

  .profiles__user-team__tabs .tabs-list-item::after {
    display: none;
  }

  .profiles__user-team__tabs .tabs-list-item.tabs-list-item--active {
    color: ${variables.brandPrimary};
  }

  .profiles__user-team__tabs .tabs-list {
    padding-bottom: 0;
  }

  .profiles__user-team__tabs .tabs-content {
    font-size: 12px;
  }

  .profiles__user-team .el-tab-pane {
    padding: 0;
    box-shadow: none;
    font-size: 13px;
    text-align: left;
  }

  .profiles__email {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 8px;
    color: ${variables.brandPrimary};
    font-size: 13px;
  }
  @media ${variables.sm} {
    .profiles__email {
      justify-content: flex-start;
    }
  }

  .profiles__email i {
    margin-right: 14px;
    font-size: 16px;
  }

  .profiles__tab-content {
    max-width: 640px;
    // margin: 0 auto;
  }

  .profiles__interests-wrapper .profiles__interests,
  .profiles__skills-wrapper {
    margin-bottom: 20px;
  }
  @media ${variables.sm} {
    .profiles__interests-wrapper .profiles__interests:first-of-type {
      margin-bottom: 40px;
    }
  }

  .profiles__interests-title {
    font-weight: 700;
    font-size: 16px;
    line-height: 26px;
    font-family: 'Poppins', sans-serif;
    margin: 12px 0;
  }

  .profile__skill-tag {
    font-weight: 700;
    font-size: 12px;
    line-height: 18px;
    font-family: 'Poppins', sans-serif;
    color: #5a55ab;
    background: #efeef7;
    border-radius: 4px;
    padding: 8px 12px;
    margin-right: 8px;
    margin-bottom: 8px;
  }

  .profiles__skills-title {
    font-size: 15px;
    font-weight: 800;
    margin: 12px 0;
  }

  .profiles__skills-title__link {
    margin-left: 25px;
    font-weight: normal;
    font-size: 12px;
  }

  .profiles__skills-wrapper {
    margin-top: 40px;
  }

  .profile__category-tabs .tabs-list-item {
    font-size: 14px;
    line-height: 22px;
    font-weight: 700;
    color: #8494b2;
    height: auto;
    padding: 8px 0px;
    margin: 0 32px 0 0;
  }

  .profile__category-tabs .tabs-list-item.tabs-list-item--active {
    color: #152540 !important;
  }

  .profile__category-tabs .tabs-list-item.tabs-list-item--active::after {
    width: 100%;
    left: 50%;
  }

  .profiles__interests .el-button {
    cursor: default;
  }

  .profiles__interests .el-button:hover,
  .profiles__interests .el-button:focus {
    background: white;
    color: ${variables.warmGrey};
    border: 1px solid #dcdfe6;
  }

  .profiles__location {
    margin-top: 25px;
  }

  .profiles__career__heading {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-size: 18px;
    font-weight: bold;
    color: ${variables.warmGrey};
    text-align: left;
  }

  @media ${variables.sm} {
    .profiles__career__heading .el-select {
      width: 400px;
    }
  }

  .statement {
    margin-top: 24px;
  }

  .statement-career {
    margin-top: 24px;
    background-color: ${variables.white};
    border-radius: 5px;
    display: flex;
    justify-content: center;
    padding: 80px;
  }

  .statement-career__content {
    text-align: center;
    max-width: 200px;
  }

  .statement-career__content-text {
    line-height: 16px;
  }
  
  .statement-career__content-text p{
    font-size: 16px;
    font-weight: ${variables.bold700};
    line-height: 26px;
  }

  .statement-career__content-text span{
    font-size: 12px;
  }
`
export default profilesStyle
