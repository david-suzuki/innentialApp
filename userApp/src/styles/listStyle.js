import css from 'styled-jsx/css'
import variables from './variables'

export const listStyle = css.global`
  .list {
    padding: 22px 16px 22px 26px;
    border-radius: 4px;
    margin-bottom: 30px;
    box-shadow: 0 6px 11px 5px rgba(0, 0, 0, 0.05);
    position: relative;
    overflow: hidden;
  }
  .list__section-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
  }

  .list__section-title i {
    font-size: 14px;
    transform: rotate(180deg);
    color: ${variables.brandPrimary};
    cursor: pointer;
  }

  .list__section-title h3 {
    font-size: 16px;
    font-weight: 800;
  }

  .list__section-title--margin-top {
    margin-top: 40px;
    margin-bottom: 18px;
  }

  .list__section-title--margin-bottom {
    margin-bottom: 22px;
  }

  .list__title {
    font-size: 16px;
    font-weight: bold;
    text-align: left;
    padding-bottom: 6px;
    border-bottom: 1px solid ${variables.whiteFive};
  }

  .list-item {
    background-color: ${variables.white};
  }

  .list .list-item:not(:last-child) {
    border-bottom: 1px solid #e8e8e8;
    padding-bottom: 16px;
  }
  .list-item__label {
    font-size: 12px;
    line-height: 0.9;
    color: ${variables.warmGrey};
  }
  .list-item__title,
  .list-item__title a {
    font-size: 15px;
    font-weight: 800;
    color: ${variables.black};
    padding-top: 7px;
    display: flex;
    align-items: center;
  }
  .list-item__title span {
    padding-left: 8px;
    font-size: 12px;
  }
  .list .user-item:not(:last-child) {
    border-bottom: 1px solid ${variables.whiteFour};
  }
  .list .list-item:not(:first-child) {
    padding-top: 25px;
  }
  .list-sort {
    display: flex;
    flex-direction: row;
    align-items: top;
    justify-content: space-between;
    padding-bottom: 25px;
  }
  .list-sort__label {
    font-size: 11px;
    color: ${variables.brandPrimary};
  }
  .list-sort__label span {
    color: ${variables.warmGrey};
    cursor: pointer;
    padding-left: 5px;
  }
  .list-sort__label .icon {
    font-size: 9px;
    margin-right: 5px;
  }

  .list-item__title--user--skills {
    padding: 0;
  }

  .list-sort__inner {
    position: relative;
  }

  .list__dropdown {
    position: absolute;
    top: 20px;
    right: 0;
    background-color: transparent;
    visibility: hidden;
    opacity: 0;
    transition: all 400ms;
    z-index: 100;
  }

  .list__dropdown.is-active {
    visibility: visible;
    opacity: 1;
  }

  .list__dropdown ul li {
    list-style: none;
    line-height: 10px;
    font-size: 12px;
    text-align: right;
    background: white;
    padding: 0 4px;
    padding-top: 5px;
  }

  .list__dropdown ul li a {
    color: ${variables.warmGrey};
    font-size: 13px;
    line-height: 13px;
    cursor: pointer;
  }
  @media ${variables.md} {
    .list__dropdown ul li {
      font-size: 13px;
      line-height: 13px;
    }
    .list__dropdown ul li a {
      font-size: 13px;
      line-height: 13px;
    }
  }

  .list--nobg {
    background: none;
  }

  // .list--purple {
  //   background: ${variables.white};
  // }

  .list--no-shadow {
    box-shadow: none;
  }

  .list--no-padding {
    padding: 0;
  }

  .list--overflow {
    overflow: visible;
  }

  .list__items-review {
    padding: 15px 0;
    margin-top: 10px;
  }

  .list__dropdown--review-filter {
    top: 40px;
    right: calc(100% - 170px);
  }

  .list__dropdown--review-filter ul li {
    list-style: none;
    line-height: 10px;
    font-size: 12px;
    text-align: left;
    background: white;
    padding: 0 4px;
    padding-top: 5px;
  }

  .list__dropdown--review-sort {
    top: 40px;
    right: 10px;
  }

  .list-profile {
    padding: 22px 16px 22px 26px;
    border-radius: 4px;
    margin-bottom: 30px;
    box-shadow: 0 6px 11px 5px rgba(0, 0, 0, 0.05);
    position: relative;
    overflow: hidden;
  }
  .list-profile__section-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
  }

  .list-profile__section-title i {
    font-size: 14px;
    transform: rotate(180deg);
    color: ${variables.brandPrimary};
    cursor: pointer;
  }

  .list-profile__section-title h3 {
    font-size: 16px;
    font-weight: 800;
  }

  .list-profile__section-title--margin-top {
    margin-top: 40px;
  }

  .list-profile__section-title--margin-bottom {
    margin-bottom: 22px;
  }

  .list-profile__title {
    font-size: 14px;
    text-align: left;
  }
  .list-profile .list-profile-item:not(:last-child) {
    border-bottom: 1px solid #e8e8e8;
    padding-bottom: 16px;
  }
  .list-profile-item__label {
    font-size: 12px;
    line-height: 0.9;
    color: ${variables.warmGrey};
  }
  .list-profile-item__title,
  .list-profile-item__title a {
    font-size: 15px;
    font-weight: 800;
    color: ${variables.black};
    padding-top: 7px;
    display: flex;
    align-items: center;
  }
  .list-profile-item__title span {
    padding-left: 8px;
    font-size: 12px;
  }
  .list-profile .user-item:not(:last-child) {
    border-bottom: 1px solid ${variables.whiteFour};
  }
  .list-profile .list-profile-item:not(:first-child) {
    padding-top: 25px;
  }
  .list-profile-sort {
    display: flex;
    flex-direction: row;
    align-items: top;
    justify-content: space-between;
    padding-bottom: 10px;
  }
  .list-profile-sort__label {
    font-size: 11px;
    color: ${variables.brandPrimary};
  }
  .list-profile-sort__label span {
    color: ${variables.warmGrey};
    cursor: pointer;
    padding-left: 5px;
  }
  .list-profile-sort__label .icon {
    font-size: 9px;
    margin-right: 5px;
  }

  .list-profile-item__title--user--skills {
    padding: 0;
  }

  .list-profile-sort__inner {
    position: relative;
  }

  .list-profile__dropdown {
    position: absolute;
    top: 20px;
    right: 0;
    background-color: transparent;
    visibility: hidden;
    opacity: 0;
    transition: all 400ms;
    z-index: 100;
  }

  .list-profile__dropdown.is-active {
    visibility: visible;
    opacity: 1;
  }

  .list-profile__dropdown ul li {
    /* list-profile-style: none; */
    line-height: 10px;
    font-size: 12px;
    text-align: right;
    background: white;
    padding: 0 4px;
    padding-top: 5px;
  }

  .list-profile__dropdown ul li a {
    color: ${variables.warmGrey};
    font-size: 13px;
    line-height: 13px;
    cursor: pointer;
  }
  @media ${variables.md} {
    .list-profile__dropdown ul li {
      font-size: 13px;
      line-height: 13px;
    }
    .list-profile__dropdown ul li a {
      font-size: 13px;
      line-height: 13px;
    }
  }

  .list-profile--purple {
    background: ${variables.paleLilacTwo};
  }

  .list-profile--no-shadow {
    box-shadow: none;
  }

  .list-profile--no-padding {
    padding: 0;
  }

  .list-profile--overflow {
    overflow: visible;
  }

  .list-profile__items-review {
    padding: 15px 0;
    margin-top: 10px;
  }

  .list-profile__dropdown--review-filter {
    top: 40px;
    right: calc(100% - 170px);
  }

  .list-profile__dropdown--review-filter ul li {
    /* list-profile-style: none; */
    line-height: 10px;
    font-size: 12px;
    text-align: left;
    background: white;
    padding: 0 4px;
    padding-top: 5px;
  }

  .list-profile__dropdown--review-sort {
    top: 40px;
    right: 10px;
  }
`
export default listStyle
